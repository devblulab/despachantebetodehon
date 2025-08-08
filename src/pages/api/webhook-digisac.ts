// ✅ Arquivo: pages/api/webhook-digisac.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';

const db = getFirestore(app);

type DigisacMessage = {
  id?: string;
  text?: string;
  contactId?: string;
  timestamp?: string | number;
  isFromMe?: boolean;
  number?: string;
  from?: { number?: string };
  contact?: {
    number?: string;
    name?: string;
    alternativeName?: string;
    data?: { number?: string };
  };
  [key: string]: any;
};

// =========================
// 🔧 Helpers
// =========================
function toIso(d?: string | number): string {
  try {
    if (!d) return new Date().toISOString();
    if (typeof d === 'number') return new Date(d).toISOString();
    const maybe = new Date(d);
    if (!isNaN(maybe.getTime())) return maybe.toISOString();
    return new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function normalizeNumber(raw?: string): string {
  if (!raw) return '';
  let n = raw.replace(/\D/g, '');
  // Se vier com 0 à esquerda e tiver >= 12, remove 0 (caso DDD com 0)
  if (n.length >= 12 && n.startsWith('0')) n = n.slice(1);
  return n;
}

function safeId(msg: DigisacMessage): string {
  const base =
    msg.id ||
    `${normalizeNumber(
      msg.number ||
        msg?.from?.number ||
        msg?.contact?.number ||
        msg?.contact?.data?.number ||
        '',
    )}-${toIso(msg.timestamp)}`;
  // remove chars problemáticos para ID no Firestore
  return String(base).replace(/[^\w\-:.]/g, '_');
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Gera candidatos de telefone para Brasil (com/sem 55, com/sem nono dígito)
 * cobrindo cenários: "4899450642", "548999450642", "5548999450642", etc.
 */
function candidatePhonesBR(numero: string): string[] {
  let n = numero.replace(/\D/g, '');
  if (n.length >= 12 && n.startsWith('0')) n = n.slice(1);

  const hasDDI = n.startsWith('55');
  const semDDI = hasDDI ? n.slice(2) : n;

  const add9 = (x: string) => (x.length === 10 ? x.slice(0, 2) + '9' + x.slice(2) : x);
  const rm9 = (x: string) => (x.length === 11 ? x.slice(0, 2) + x.slice(3) : x);
  const stripLeading0 = (x: string) => (x.startsWith('0') ? x.slice(1) : x);

  const s0 = stripLeading0(semDDI);
  const with9 = add9(semDDI);
  const with9s0 = add9(s0);
  const no9 = rm9(semDDI);
  const no9s0 = rm9(s0);

  const cand: string[] = [
    n,                 // 5548999...
    semDDI,            // 489999...
    with9,             // 4899...
    no9,               // 488...
    '55' + with9,
    '55' + no9,
    s0,                // 8999... (se usuário salvou sem DDD zero)
    '55' + s0,
    with9s0,
    '55' + with9s0,
    no9s0,
    '55' + no9s0,
  ];

  return unique(cand).filter(Boolean);
}

async function updateStatusForIncoming(
  numeroBase: string,
  logs: string[],
): Promise<void> {
  const candidatos = candidatePhonesBR(numeroBase);
  logs.push(`🔎 Telefones candidatos para match: ${JSON.stringify(candidatos)}`);

  const colecoesFunis = ['Funis', 'FunisParcelamento'];
  const naoPromoverSe = new Set(['interessado', 'vendido', 'perdido']); // não regride nem re-promove

  for (const colecao of colecoesFunis) {
    const funisSnap = await getDocs(query(collection(db, colecao)));
    logs.push(`📂 Coleção ${colecao}: ${funisSnap.size} funil(is) encontrados.`);

    for (const funilDoc of funisSnap.docs) {
      const clientesRef = collection(db, `${colecao}/${funilDoc.id}/Clientes`);

      // Firestore where-in aceita no máximo 10 valores
      const chunkSize = 10;
      for (let i = 0; i < candidatos.length; i += chunkSize) {
        const slice = candidatos.slice(i, i + chunkSize);

        const qClientes = query(clientesRef, where('fone_celular', 'in', slice));
        const snapClientes = await getDocs(qClientes);

        logs.push(
          `   • Funil ${funilDoc.id}: match fone_celular IN ${JSON.stringify(
            slice,
          )} → ${snapClientes.size} doc(s).`,
        );

        for (const clienteDoc of snapClientes.docs) {
          const dados = clienteDoc.data() || {};
          const atual = String(dados.statusCRM || '').toLowerCase();

          if (!naoPromoverSe.has(atual)) {
            await updateDoc(clienteDoc.ref, {
              statusCRM: 'interessado',
              atualizadoPor: 'webhook-digisac',
              dataAtualizacao: new Date().toISOString(),
            });
            logs.push(
              `   ✅ Status ${colecao}/${funilDoc.id}/Clientes/${clienteDoc.id}: "${atual}" → "interessado".`,
            );

            // Espelha no DadosclientesExtraidos, se existir
            const extraidoRef = doc(db, 'DadosclientesExtraidos', clienteDoc.id);
            const snapExtraido = await getDoc(extraidoRef);
            if (snapExtraido.exists()) {
              await updateDoc(extraidoRef, {
                statusCRM: 'interessado',
                atualizadoPor: 'webhook-digisac',
                dataAtualizacao: new Date().toISOString(),
              });
              logs.push(`   🔁 DadosclientesExtraidos/${clienteDoc.id} espelhado.`);
            }
          } else {
            logs.push(
              `   ↪️ Cliente ${clienteDoc.id} já está em "${atual}" — não promovido.`,
            );
          }
        }
      }
    }
  }
}

// =========================
// 🚀 Handler
// =========================
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const body = req.body;
  const payload: DigisacMessage[] = Array.isArray(body) ? body : [body];

  const logs: string[] = [];
  const resultados: Array<{ id: string; numero: string; direction: 'in' | 'out' }> = [];

  try {
    if (!payload.length) {
      logs.push('⚠️ Webhook recebeu payload vazio.');
      return res.status(200).json({ success: true, logs });
    }

    for (const rawMsg of payload) {
      try {
        const id = safeId(rawMsg);
        const text = (rawMsg.text || '').toString().trim();
        const contactId = rawMsg.contactId || '';
        const direction: 'in' | 'out' = rawMsg.isFromMe ? 'out' : 'in';

        // Deriva número de múltiplas origens
        const numeroRaw =
          rawMsg.number ||
          rawMsg?.from?.number ||
          rawMsg?.contact?.number ||
          rawMsg?.contact?.data?.number ||
          rawMsg?.contact?.alternativeName ||
          '';
        const numero = normalizeNumber(numeroRaw);

        logs.push(
          `📨 Recebida msg: id=${id} numRaw="${numeroRaw}" num="${numero}" dir=${direction} len=${text.length} ts=${rawMsg.timestamp}`,
        );

        // sanity checks
        if (!text) {
          logs.push(`⏭️ Ignorada: mensagem sem texto (id=${id}).`);
          continue;
        }
        if (!contactId) {
          logs.push(`⏭️ Ignorada: sem contactId (id=${id}).`);
          continue;
        }
        if (!numero) {
          logs.push(`⏭️ Ignorada: não foi possível derivar número (id=${id}).`);
          continue;
        }

        const tsISO = toIso(rawMsg.timestamp);
        const baseDoc = {
          id,
          numero,
          text,
          contactId,
          timestamp: tsISO,
          recebidoEm: new Date().toISOString(),
          isFromMe: !!rawMsg.isFromMe,
          direction,
          raw: rawMsg,
        };

        // 1) Grava no chat (consumido pelo ChatFlutuante via onSnapshot)
        const chatRef = doc(db, `chatparcelamento/${numero}/mensagens`, id);
        const chatExists = await getDoc(chatRef);
        if (!chatExists.exists()) {
          await setDoc(chatRef, {
            id,
            text,
            direction,
            timestamp: tsISO,
          });
          logs.push(`💾 chatparcelamento ✅ gravado (id=${id}, dir=${direction}).`);
        } else {
          logs.push(`↩️ chatparcelamento já existia (id=${id}).`);
        }

        // 2) Histórico por contato (compat telas antigas)
        const histRef = doc(db, `mensagensPorContato/${numero}/mensagens`, id);
        const histExists = await getDoc(histRef);
        if (!histExists.exists()) {
          await setDoc(histRef, {
            ...baseDoc,
            texto: text, // compat
          });
          logs.push(`💾 mensagensPorContato ✅ gravado (id=${id}, dir=${direction}).`);
        } else {
          logs.push(`↩️ mensagensPorContato já existia (id=${id}).`);
        }

        // 3) Se for IN: alerta IA + atualização de status (promove para interessado)
        if (direction === 'in') {
          // 3.1) Alertar IA
          const alertaRef = doc(db, 'ClientesPendentesIA', numero);
          await setDoc(alertaRef, {
            numero,
            nome: rawMsg?.contact?.name || 'Cliente',
            mensagemRecebida: text,
            contactId,
            status: 'pendente',
            timestamp: tsISO,
            recebidoEm: new Date().toISOString(),
          });
          logs.push(`🧠 ClientesPendentesIA ✅ criado/atualizado (numero=${numero}).`);

          // 3.2) Atualizar status em funis (busca por múltiplos formatos + promoção)
          await updateStatusForIncoming(numero, logs);

          // (Opcional) 💡 Se você ainda quiser manter a atualização forçada fixa, deixe aqui:
          // try {
          //   const forcedPath = 'FunisParcelamento/uJf5wWUwp7dsCyXWkcRa/Clientes/ABAtg00kJH4aH7NiENPz';
          //   const clienteRefForcado = doc(db, forcedPath);
          //   await updateDoc(clienteRefForcado, {
          //     statusCRM: 'interessado',
          //     atualizadoPor: 'webhook-digisac (forçado)',
          //     dataAtualizacao: new Date().toISOString(),
          //   });
          //   logs.push(`   ⚡ Status forçado atualizado em ${forcedPath}`);
          // } catch (err: any) {
          //   logs.push(`   ❌ Erro no update forçado: ${err?.message || err}`);
          // }
        } else {
          logs.push(`➡️ OUT registrado sem alerta/status (id=${id}).`);
        }

        // 4) Log persistente (auditoria)
        const logRef = doc(db, 'LogsWebhookDigisac', id);
        await setDoc(logRef, {
          ...baseDoc,
          processedAt: new Date().toISOString(),
          notes: logs.slice(-6), // últimas linhas
        });

        resultados.push({ id, numero, direction });
      } catch (innerErr: any) {
        logs.push(`❌ Erro ao processar UMA mensagem: ${innerErr?.message || innerErr}`);
      }
    }

    return res.status(200).json({
      success: true,
      processed: resultados.length,
      resultados,
      logs,
    });
  } catch (error: any) {
    logs.push(`🔥 Erro geral no webhook: ${error?.message || String(error)}`);
    console.error('❌ Erro ao processar webhook Digisac:', error);
    return res.status(500).json({ success: false, message: 'Erro ao processar webhook', logs });
  }
}

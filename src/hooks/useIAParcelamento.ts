'use client';

import { useEffect, useRef, useState } from 'react';
import { Cliente } from '@/types/Cliente';
import {
  getFirestore,
  addDoc,
  collection,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  Unsubscribe,
  limit, // 👈 necessário para pegar a última mensagem do chat flutuante
} from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';

/** -------------------------
 * Normalização de telefone
 * ------------------------- */
function normalizarTelefoneBrasil(numero: string): string {
  let phone = (numero || '').replace(/\D/g, '');
  if (phone.startsWith('55')) phone = phone.slice(2);
  if (phone.length >= 11 && phone[0] === '0') phone = phone.slice(1);
  if (phone.length === 10) phone = phone.slice(0, 2) + '9' + phone.slice(2);
  phone = phone.slice(0, 11);
  return `55${phone}`;
}

const soDigitos = (s: string) => (s || '').replace(/\D/g, '');

/** Cria candidatos de número para bater com variações salvas */
function candidatosTelefone(numeroBruto: string): string[] {
  const d = soDigitos(numeroBruto);
  const set = new Set<string>();
  if (!d) return [];
  set.add(d);
  if (d.startsWith('55')) set.add(d.slice(2));
  else set.add(`55${d}`);
  return Array.from(set)
    .map(n => (n.length === 10 ? n.slice(0, 2) + '9' + n.slice(2) : n))
    .map(n => (n.startsWith('55') ? n : `55${n}`))
    .map(n => n.slice(0, 13));
}

/** -------------------------
 * Mensagem IA
 * ------------------------- */
function gerarMensagemIA(cliente: Cliente): string {
  const nome = (cliente as any).proprietarioatual || 'cliente';
  const modelo = (cliente as any).marca_modelo || 'veículo';
  const placa = (cliente as any).placa || '';
  const cidade = (cliente as any).municipio || 'sua cidade';

  const frases = [
    `📢 Olá ${nome}, tudo bem? Identificamos que o ${modelo} placa ${placa} está com pendências de licenciamento. Podemos resolver agora com parcelamento fácil e seguro.`,
    `✅ ${nome}, oferecemos condições exclusivas para regularizar o seu ${modelo}. Atendimento rápido, sem complicações e com parcelamento no boleto ou cartão.`,
    `🚗 Seu ${modelo}, de ${cidade}, está pronto para rodar legalizado. Evite multas — parcelamos com ou sem IPVA.`,
    `📊 O ${modelo} placa ${placa} pode ser regularizado hoje mesmo. Você escolhe como pagar.`,
    `💡 Regularizar agora evita aumento de encargos. Parcelamos de forma inteligente e personalizada. É só me responder aqui.`,
  ];

  return frases[Math.floor(Math.random() * frases.length)];
}

/** -------------------------
 * Envio via API /api/digisac
 * ------------------------- */
async function enviarSMS(numeroOriginal: string, mensagem: string): Promise<boolean> {
  try {
    const numeroFormatado = `+${normalizarTelefoneBrasil(numeroOriginal)}`;
    const res = await fetch('/api/digisac', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero: numeroFormatado, mensagem }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.message || 'Erro inesperado ao enviar SMS');
    return true;
  } catch (e) {
    console.error('Erro ao enviar SMS IA:', e);
    return false;
  }
}

/** -------------------------
 * Atualizações de status
 * ------------------------- */
async function promoverClienteParaInteressado(
  db: ReturnType<typeof getFirestore>,
  clienteId: string,
  funnelId?: string
) {
  const updates = {
    statusCRM: 'interessado',
    atualizadoPor: 'verificadorIA',
    dataAtualizacao: serverTimestamp(),
  };

  const docRefExtraido = doc(db, 'DadosclientesExtraidos', clienteId);
  const docRefCRM = funnelId ? doc(db, 'Funis', funnelId, 'Clientes', clienteId) : null;
  const docRefParcelamento = funnelId
    ? doc(db, 'FunisParcelamento', funnelId, 'Clientes', clienteId)
    : null;

  const refs = [docRefExtraido, docRefCRM, docRefParcelamento].filter(Boolean) as any[];

  for (const ref of refs) {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const curr = (snap.data() as any)?.statusCRM?.toLowerCase?.() || '';
      if (!['interessado', 'vendido', 'perdido'].includes(curr)) {
        await updateDoc(ref, updates);
      }
    }
  }
}

async function promoverPorNumero(
  db: ReturnType<typeof getFirestore>,
  numeroBruto: string
) {
  const cands = candidatosTelefone(numeroBruto);
  if (cands.length === 0) return;

  const colecoesFunis = ['FunisParcelamento', 'Funis'] as const;
  for (const colecao of colecoesFunis) {
    const funisSnap = await getDocs(collection(db, colecao));
    for (const funil of funisSnap.docs) {
      const clientesRef = collection(db, colecao, funil.id, 'Clientes');

      // Firestore 'in' suporta até 10 itens
      const fatias = [cands.slice(0, 10)];
      for (const slice of fatias) {
        const qNum = query(clientesRef, where('numero', 'in', slice));
        const qCel = query(clientesRef, where('fone_celular', 'in', slice));
        const [sNum, sCel] = await Promise.all([getDocs(qNum), getDocs(qCel)]);
        const docs = [...sNum.docs, ...sCel.docs];

        for (const dSnap of docs) {
          const data: any = dSnap.data();
          const curr = (data?.statusCRM || '').toLowerCase();
          if (!['interessado', 'vendido', 'perdido'].includes(curr)) {
            await updateDoc(dSnap.ref, {
              statusCRM: 'interessado',
              dataAtualizacao: serverTimestamp(),
              atualizadoPor: 'ChatFlutuante/IA',
            });
          }
        }
      }
    }
  }

  // Espelha em DadosclientesExtraidos
  const dadosRef = collection(db, 'DadosclientesExtraidos');
  const fatias = [cands.slice(0, 10)];
  for (const slice of fatias) {
    const qNum = query(dadosRef, where('numero', 'in', slice));
    const qCel = query(dadosRef, where('fone_celular', 'in', slice));
    const [sNum, sCel] = await Promise.all([getDocs(qNum), getDocs(qCel)]);
    for (const d of [...sNum.docs, ...sCel.docs]) {
      const curr = ((d.data() as any)?.statusCRM || '').toLowerCase();
      if (!['interessado', 'vendido', 'perdido'].includes(curr)) {
        await updateDoc(d.ref, {
          statusCRM: 'interessado',
          dataAtualizacao: serverTimestamp(),
          atualizadoPor: 'ChatFlutuante/IA',
        });
      }
    }
  }

  // Log opcional
  await setDoc(
    doc(db, 'LogsWebhookDigisac', `Promocao_${Date.now()}`),
    { numero: soDigitos(numeroBruto), candidatos: cands, origem: 'useIAParcelamento', ts: serverTimestamp() }
  );
}

/** ----------------------------------------------------------------
 * Hook principal: envia SMS (status 'novo') e promove em tempo real
 * ---------------------------------------------------------------- */
export const useIAParcelamento = (clientes: Cliente[]) => {
  const [iaAtiva, setIaAtiva] = useState(
    typeof window !== 'undefined' && localStorage.getItem('iaAtiva') === 'true'
  );

  // Mantém/escuta preferencia iaAtiva no localStorage
  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === 'iaAtiva') setIaAtiva(e.newValue === 'true');
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, []);

  const listenersRef = useRef<Map<string, Unsubscribe>>(new Map());

  useEffect(() => {
    if (!iaAtiva || clientes.length === 0) return;

    const db = getFirestore(app);

    /** 1) Envio da 1ª mensagem para quem está 'novo' */
    const enviarParaNovos = async () => {
      for (const cliente of clientes) {
        const funnelId = (cliente as any).funnelId as string | undefined;
        const numeroFormatado = normalizarTelefoneBrasil((cliente as any).fone_celular || '');
        if (!cliente.id || numeroFormatado.length !== 13) continue;

        // Envia apenas se 'novo'
        if ((cliente as any).statusCRM === 'novo') {
          const mensagem = gerarMensagemIA(cliente);
          const sucesso = await enviarSMS((cliente as any).fone_celular, mensagem);

          if (sucesso) {
            // Atualiza status -> contatado nos 3 lugares (se existirem)
            await promoverClienteParaInteressado(db, cliente.id, funnelId) // mantém a sua lógica atual
              .catch(() => null); // não falha o fluxo

            // Após enviar, marcamos 'contatado' (antes de resposta)
            const updatesContatado = {
              statusCRM: 'contatado',
              dataAtualizacao: serverTimestamp(),
            };

            const docRefExtraido = doc(db, 'DadosclientesExtraidos', cliente.id);
            const docRefCRM = funnelId ? doc(db, 'Funis', funnelId, 'Clientes', cliente.id) : null;
            const docRefParcelamento = funnelId
              ? doc(db, 'FunisParcelamento', funnelId, 'Clientes', cliente.id)
              : null;

            const refs = [docRefExtraido, docRefCRM, docRefParcelamento].filter(Boolean) as any[];
            for (const ref of refs) {
              const snap = await getDoc(ref);
              if (snap.exists()) await updateDoc(ref, updatesContatado);
            }

            await addDoc(collection(db, 'HistoricoSMSGemini'), {
              clienteId: cliente.id,
              numero: numeroFormatado,
              mensagem,
              statusAntes: 'novo',
              statusDepois: 'contatado',
              sugestaoIA: true,
              criadoEm: serverTimestamp(),
            });

            await setDoc(doc(db, 'MonitoramentoIA', numeroFormatado), {
              numero: numeroFormatado,
              clienteId: cliente.id,
              funnelId,
              status: 'em_andamento',
              respondeu: false,
              tentativas: 1,
              ultimaTentativa: serverTimestamp(),
              criadoEm: serverTimestamp(),
            });

            await new Promise(r => setTimeout(r, 500)); // respiro
          }
        }
      }
    };

    /** 2) Listeners em tempo real por número para promover a 'interessado' assim que responder */
    const ligarListenersRespostas = () => {
      // Limpamos listeners antigos
      for (const un of listenersRef.current.values()) {
        try { un(); } catch {}
      }
      listenersRef.current.clear();

      // Criamos listeners apenas para clientes com número válido e status ainda não-final
      const candidatos = clientes
        .map(c => ({
          id: c.id as string,
          funnelId: (c as any).funnelId as string | undefined,
          status: (c as any).statusCRM as string,
          numeroRaw: (c as any).fone_celular as string,
        }))
        .filter(c => !!c.id && !!c.numeroRaw && !['interessado', 'vendido', 'perdido'].includes((c.status || '').toLowerCase()));

      for (const c of candidatos) {
        const numeroFmt = normalizarTelefoneBrasil(c.numeroRaw);
        if (numeroFmt.length !== 13) continue;

        // --- Listener 1: estrutura observada pelo hook (mantido) ---
        const msgsRef = collection(db, `mensagensPorContato/${numeroFmt}/mensagens`);
        // Apenas mensagens recebidas
        const qMsgs = query(msgsRef, where('isFromMe', '==', false), orderBy('timestamp'));
        const unMensagensPorContato = onSnapshot(qMsgs, async (snap) => {
          if (!snap.empty) {
            try {
              // Promove por ID (rápido, preciso)
              await promoverClienteParaInteressado(db, c.id, c.funnelId);
              // Redundância por número (cobre outros funis/espelhos)
              await promoverPorNumero(db, numeroFmt);
            } catch (e) {
              console.error('Falha ao promover em tempo real (mensagensPorContato):', e);
            }
          }
        });
        listenersRef.current.set(`mpc:${numeroFmt}`, unMensagensPorContato);

        // --- Listener 2: chat flutuante (NOVO) ---
        // O ChatFlutuante usa o caminho com APENAS DÍGITOS (sem +, sem 55 obrigatório)
        const chatIdDigits = soDigitos(c.numeroRaw);
        if (chatIdDigits.length >= 10) {
          const chatMsgsRef = collection(db, `chatparcelamento/${chatIdDigits}/mensagens`);
          // Pega sempre a ÚLTIMA mensagem (evita precisar de índice composto)
          const qChat = query(chatMsgsRef, orderBy('timestamp', 'desc'), limit(1));

          const unChat = onSnapshot(qChat, async (snap) => {
            if (!snap.empty) {
              const data = snap.docs[0].data() as any;
              // No chat, inbound chega como direction === 'in'
              if (data?.direction === 'in') {
                try {
                  await promoverClienteParaInteressado(db, c.id, c.funnelId);
                  await promoverPorNumero(db, numeroFmt); // usa o 55... para cobrir todos os funis
                } catch (e) {
                  console.error('Falha ao promover em tempo real (chatparcelamento):', e);
                }
              }
            }
          });

          listenersRef.current.set(`chat:${chatIdDigits}`, unChat);
        }
      }
    };

    enviarParaNovos().catch(console.error);
    ligarListenersRespostas();

    // Cleanup ao mudar deps
    return () => {
      for (const un of listenersRef.current.values()) {
        try { un(); } catch {}
      }
      listenersRef.current.clear();
    };
  }, [iaAtiva, clientes]);
};

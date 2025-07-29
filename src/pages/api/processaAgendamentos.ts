import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';
import { enviarSmsViaDigisac } from '@/pages/api/digisac';
import { gerarMensagemIAComGemini } from '@/pages/api/gerarMensagemIAComGemini';
import { Timestamp } from 'firebase/firestore';

// 🕒 Converte para horário de Brasília (UTC-3)
function getDataHoraBrasilia(): Date {
  const agoraUTC = new Date();
  const offsetMs = -3 * 60 * 60 * 1000;
  return new Date(agoraUTC.getTime() + offsetMs);
}

// 📞 Normaliza número para formato internacional
function normalizarTelefoneBrasil(numero: string): string {
  let phone = numero.replace(/\D/g, '');
  if (!phone.startsWith('55')) phone = `55${phone}`;
  const ddd = phone.slice(2, 4);
  const num = phone.slice(4);
  if (num.length === 8) phone = `55${ddd}9${num}`;
  return phone.slice(0, 13);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getFirestore(app);
    const agendamentosRef = collection(db, 'AgendamentosSMS');
    const snapshot = await getDocs(agendamentosRef);
    const agora = getDataHoraBrasilia();

    let enviados = 0;
    const logs = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      const agendarPara =
        data.agendarPara instanceof Timestamp
          ? data.agendarPara.toDate()
          : new Date(data.agendarPara);

      console.log('🕒 Verificando agendamento:');
      console.log('  ▶️ Agendado:', agendarPara.toISOString());
      console.log('  🕓 Agora:', agora.toISOString());

      if (agendarPara <= agora && data.contatos && data.mensagem) {
        for (const contato of data.contatos) {
          const numero = normalizarTelefoneBrasil(contato.numero);
          const mensagemBase = data.mensagem
            .replace('{nome}', contato.nome || 'Cliente')
            .replace('{placa}', contato.placa || '')
            .replace('{marca_modelo}', contato.marca_modelo || '')
            .replace('{seu_nome}', 'Equipe Beto');

          let mensagemFinal = mensagemBase;
          try {
            mensagemFinal = await gerarMensagemIAComGemini(contato.nome, mensagemBase);
          } catch (e) {
            console.log('⚠️ Falha no Gemini, usando mensagem base');
          }

          const sucesso = await enviarSmsViaDigisac(numero, mensagemFinal);

          logs.push({
            numero,
            nome: contato.nome,
            sucesso,
            mensagem: mensagemFinal
          });

          if (sucesso) enviados++;
        }

        await deleteDoc(doc(db, 'AgendamentosSMS', docSnap.id));
      }
    }

    return res.status(200).json({ sucesso: true, enviados, logs });
  } catch (erro) {
    console.error('❌ Erro geral:', erro);
    return res.status(500).json({ erro: 'Erro ao processar agendamentos' });
  }
}

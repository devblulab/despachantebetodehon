// pages/api/processaAgendamentos.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';
import { enviarSmsViaDigisac } from '@/pages/api/digisac'; // função real de envio

// 🕒 Hora atual em Brasília (UTC-3)
function getHoraBrasilia(): Date {
  const agoraUTC = new Date();
  return new Date(agoraUTC.getTime() - 3 * 60 * 60 * 1000);
}

// 📞 Normaliza número brasileiro para formato internacional
function normalizarTelefoneBrasil(numero: string): string {
  let phone = numero.replace(/\D/g, '');
  if (phone.length >= 12 && phone.startsWith('0')) phone = phone.slice(1);
  if (!phone.startsWith('55')) phone = `55${phone}`;
  const ddd = phone.substring(2, 4);
  const num = phone.substring(4);
  if (num.length === 8) phone = `55${ddd}9${num}`;
  return phone.slice(0, 13);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const autorizacao = req.headers.authorization;
  const segredo = process.env.CRON_SECRET;

  if (autorizacao !== `Bearer ${segredo}`) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }

  const db = getFirestore(app);
  const agendamentosRef = collection(db, 'AgendamentosSMS');
  const snapshot = await getDocs(agendamentosRef);

  const agora = getHoraBrasilia();
  let enviados = 0;
  const toleranciaMs = 3 * 60 * 1000; // 3 minutos

  for (const docSnap of snapshot.docs) {
    const agendamento = docSnap.data();

    // Garante que agendarPara seja um Date válido (suporta Timestamp do Firestore)
    const agendarPara = agendamento.agendarPara?.toDate?.() || new Date(agendamento.agendarPara);
    const diff = Math.abs(agendarPara.getTime() - agora.getTime());

    if (diff <= toleranciaMs) {
      console.log(`⏰ Agendamento válido encontrado: ${docSnap.id}`);

      for (const contato of agendamento.contatos || []) {
        const numero = normalizarTelefoneBrasil(contato.numero);
        const mensagem = agendamento.mensagem;

        try {
          const resposta = await enviarSmsViaDigisac(`+${numero}`, mensagem);
          console.log(`✅ Enviado para ${numero}:`, resposta);
          enviados++;
        } catch (e) {
          console.error(`❌ Erro ao enviar para ${numero}:`, e);
        }
      }

      // 🔥 Remove após envio
      await deleteDoc(doc(db, 'AgendamentosSMS', docSnap.id));
      console.log(`🗑️ Agendamento ${docSnap.id} removido`);
    } else {
      console.log(`⏳ Ainda não é hora do agendamento ${docSnap.id}`);
    }
  }

  res.status(200).json({ status: 'ok', enviados });
}

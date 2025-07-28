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

// 🔒 Protege a rota para ser usada só por autorizados (ex: GitHub Actions)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const autorizacao = req.headers.authorization;
  const segredo = process.env.CRON_SECRET;

  if (autorizacao !== `Bearer ${segredo}`) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }

  try {
    const db = getFirestore(app);
    const agendamentosRef = collection(db, 'AgendamentosSMS');
    const snapshot = await getDocs(agendamentosRef);
    const agora = getHoraBrasilia();
    const toleranciaMs = 2 * 60 * 1000;
    let enviados = 0;

    console.log(`[⏰ AGORA - BRASÍLIA] ${agora.toISOString()}`);

    for (const agendamentoDoc of snapshot.docs) {
      const agendamento = agendamentoDoc.data();
      const agendarPara = new Date(agendamento.agendarPara);

      console.log(`🔍 Agendamento: ${agendamentoDoc.id}`);
      console.log(`📅 Programado para: ${agendarPara.toISOString()}`);

      const diffMs = agendarPara.getTime() - agora.getTime();
      if (diffMs <= toleranciaMs) {
        console.log(`✅ Dentro da janela de 2 minutos, iniciando envio...`);

        for (const contato of agendamento.contatos || []) {
          if (!contato.numero) {
            console.warn(`⚠️ Contato sem número válido.`);
            continue;
          }

          const numeroFormatado = normalizarTelefoneBrasil(contato.numero);
          const mensagem = agendamento.mensagem
            ?.replace('{nome}', contato.nome || '')
            ?.replace('{placa}', contato.placa || '')
            ?.replace('{marca_modelo}', contato.marca_modelo || '')
            ?.replace('{seu_nome}', 'Equipe Beto Dehon');

          console.log(`📤 Enviando SMS para ${numeroFormatado}...`);

          const sucesso = await enviarSmsViaDigisac(numeroFormatado, mensagem);

          if (sucesso) {
            console.log(`✅ SMS enviada para ${numeroFormatado}`);
            enviados++;
          } else {
            console.error(`❌ Falha ao enviar para ${numeroFormatado}`);
          }
        }

        // ✅ Remove o agendamento após a tentativa de envio
        await deleteDoc(doc(db, 'AgendamentosSMS', agendamentoDoc.id));
        console.log(`🧹 Agendamento ${agendamentoDoc.id} removido após envio`);
      } else {
        console.log(`⏳ Ainda não é hora para ${agendamentoDoc.id}`);
      }
    }

    res.status(200).json({ sucesso: true, enviados });
  } catch (error) {
    console.error('[🔥 ERRO NO AGENDAMENTO]', error);
    res.status(500).json({ erro: 'Erro ao processar agendamentos' });
  }
}

// 🕒 Usa timezone real de Brasília
function getHoraBrasilia(): Date {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  );
}

// 📞 Normaliza número brasileiro para formato internacional
function normalizarTelefoneBrasil(numero: string): string {
  let phone = numero.replace(/\D/g, '');
  if (phone.length === 12 && phone.startsWith('0')) phone = phone.slice(1);
  if (!phone.startsWith('55')) phone = `55${phone}`;
  const ddd = phone.substring(2, 4);
  const num = phone.substring(4);
  if (num.length === 8) phone = `55${ddd}9${num}`;
  return phone.slice(0, 13);
}

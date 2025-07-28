import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';
import { enviarSmsViaDigisac } from '@/pages/api/digisac';

const db = getFirestore(app);

// 🔁 Converte o número para o padrão internacional brasileiro (ex: 5548999999999)
function normalizarTelefoneBrasil(numero: string): string {
  let phone = numero.replace(/\D/g, '');
  if (phone.length === 12 && phone.startsWith('0')) phone = phone.slice(1);
  if (!phone.startsWith('55')) phone = `55${phone}`;
  const ddd = phone.substring(2, 4);
  const num = phone.substring(4);
  if (num.length === 8) phone = `55${ddd}9${num}`;
  return phone.slice(0, 13);
}

// 🕒 Gera o horário atual real de Brasília (UTC-3)
function getDataHoraBrasilia(): Date {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  );
}

// 🔄 Processa os agendamentos na subcoleção "agendamentosPendentes"
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const agendamentosRef = collection(db, 'agendamentosPendentes');
    const snapshot = await getDocs(agendamentosRef);

    const agora = getDataHoraBrasilia();

    for (const docAgendamento of snapshot.docs) {
      const agendamento = docAgendamento.data();

      if (!agendamento.agendarPara || !agendamento.contatos || agendamento.contatos.length === 0) {
        continue;
      }

      const dataAgendada = new Date(agendamento.agendarPara);

      // ✅ Só processa se já passou do horário de Brasília
      if (agora >= dataAgendada) {
        for (const contato of agendamento.contatos) {
          const nome = contato.nome || '';
          const numero = normalizarTelefoneBrasil(contato.numero);
          const mensagem = agendamento.mensagem
            .replace('{nome}', nome)
            .replace('{seu_nome}', 'Equipe Beto')
            .replace('{marca_modelo}', agendamento.marca_modelo || '')
            .replace('{placa}', agendamento.placa || '');

          await enviarSmsViaDigisac(numero, mensagem);
        }

        // ✅ Remove o agendamento após o envio
        await deleteDoc(doc(db, 'agendamentosPendentes', docAgendamento.id));
      }
    }

    res.status(200).json({ status: 'Agendamentos processados com sucesso.' });
  } catch (error) {
    console.error('Erro ao processar agendamentos:', error);
    res.status(500).json({ erro: 'Erro ao processar agendamentos.' });
  }
}

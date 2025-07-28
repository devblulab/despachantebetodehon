import type { NextApiRequest, NextApiResponse } from 'next';
import cron from 'node-cron';

let tarefaAtiva = false;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!tarefaAtiva) {
    cron.schedule('* * * * *', async () => {
      try {
        await fetch('http://localhost:3000/api/processaAgendamentos');
        console.log('[⏰ CRON] Verificação automática executada');
      } catch (err) {
        console.error('[CRON ERROR]', err);
      }
    });

    tarefaAtiva = true;
  }

  res.status(200).json({ status: 'Agendamento via CRON ativado' });
}

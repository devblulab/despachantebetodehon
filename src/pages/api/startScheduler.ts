import type { NextApiRequest, NextApiResponse } from 'next';

let loopRodando = false;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (loopRodando) return res.status(200).json({ status: 'Loop já iniciado' });

  loopRodando = true;

  setInterval(async () => {
    try {
      await fetch('http://localhost:3000/api/processaAgendamentos');
      console.log('[🔁] Executando verificação de agendamentos...');
    } catch (err) {
      console.error('[ERRO FETCH PROCESSAMENTO]', err);
    }
  }, 60000); // 1 minuto

  res.status(200).json({ status: 'Loop de agendamentos iniciado' });
}

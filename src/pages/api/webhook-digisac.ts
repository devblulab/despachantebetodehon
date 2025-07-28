// ✅ Arquivo: pages/api/webhook-digisac.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';

const db = getFirestore(app);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const body = req.body;
    const mensagens = Array.isArray(body) ? body : [body];

    for (const msg of mensagens) {
      const { id, text, contactId, timestamp, isFromMe, number } = msg;

      // Ignora mensagens enviadas por você ou inválidas
      if (isFromMe || !text || !contactId) continue;

      // 🧼 Tenta encontrar o número de telefone válido
      const numeroRaw =
        number ||
        msg?.from?.number ||
        msg?.contact?.number ||
        msg?.contact?.data?.number ||
        msg?.contact?.alternativeName ||
        'desconhecido';

      const numeroFormatado = numeroRaw.replace(/\D/g, '');

      // ✅ 1. Salva no histórico de mensagens do contato
      const docRef = doc(db, `mensagensPorContato/${numeroFormatado}/mensagens`, id);

      await setDoc(docRef, {
        id,
        numero: numeroFormatado,
        texto: text,
        timestamp: timestamp || new Date().toISOString(),
        recebidoEm: new Date().toISOString(),
        contactId,
          isFromMe: false, // 🔁 ADICIONE ISSO para garantir leitura correta
        raw: msg,
      });

  
     // ✅ 2. Salva alerta pendente IA para o colaborador
const alertaRef = doc(db, 'ClientesPendentesIA', numeroFormatado);
await setDoc(alertaRef, {
  numero: numeroFormatado,
  nome: msg?.contact?.name || 'Cliente',
  mensagemRecebida: text,
  contactId,
  status: 'pendente',
  timestamp: timestamp || new Date().toISOString(),
  recebidoEm: new Date().toISOString(),
});

    }

    return res.status(200).json({ success: true, message: 'Mensagens processadas e salvas com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar mensagem recebida:', error);
    return res.status(500).json({ success: false, message: 'Erro ao processar webhook', error });
  }
}

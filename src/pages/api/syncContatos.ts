// ✅ Arquivo: pages/api/syncContatos.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';

const db = getFirestore(app);
const DIGISAC_TOKEN = process.env.NEXT_PUBLIC_DIGISAC_TOKEN ?? '';
const DIGISAC_URL = 'https://parcelamentobetodehon.digisac.app/api/v1/contacts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: true, message: 'Use GET' });
  }

  try {
    const result = await fetch(DIGISAC_URL, {
      headers: {
        Authorization: `Bearer ${DIGISAC_TOKEN}`
      }
    });

    const data = await result.json();
    if (!Array.isArray(data.data)) {
      return res.status(500).json({ error: true, message: 'Formato inesperado' });
    }

    for (const contato of data.data) {
      const numero = contato.number?.replace(/\D/g, '');
      if (!numero) continue;
      await setDoc(doc(db, 'contatos', numero), {
        nome: contato.internalName || 'Sem nome',
        numero,
        avatar: contato.avatarUrl || '',
        tags: contato.tags || [],
        atualizadoEm: new Date().toISOString()
      });
    }

    return res.status(200).json({ success: true, total: data.data.length });
  } catch (error) {
    console.error('Erro ao sincronizar contatos:', error);
    return res.status(500).json({ error: true, message: 'Erro na sincronização' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';

const firestore = getFirestore(app);
const DIGISAC_API = 'https://parcelamentobetodehon.digisac.app/api/v1';
const BEARER_TOKEN = 'e31e9bf543e0dc609ff30ed3ce637308a9dfc975';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const modo = req.query.modo || 'salvar';

  try {
    let contatosTotais: any[] = [];
    let currentPage = 1;
    let lastPage = 1;

    do {
      const response = await fetch(`${DIGISAC_API}/contacts?limit=50&page=${currentPage}`, {
        headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
      });

      const resultado = await response.json();
      const contatos = resultado?.data || [];
      lastPage = resultado?.lastPage || 1;

      contatosTotais.push(...contatos);
      currentPage++;
    } while (currentPage <= lastPage);

    if (modo === 'contar') {
      return res.status(200).json({ total: contatosTotais.length });
    }

    // SALVAR NO FIREBASE
    for (const contato of contatosTotais) {
      const id = contato?.id || contato?.data?.number || contato?.idFromService || crypto.randomUUID();
      const docRef = doc(firestore, 'ContatosDigisac', id);
      await setDoc(docRef, {
        nome: contato.name || contato.alternativeName || 'Sem nome',
        numero: contato?.data?.number || 'Desconhecido',
        idFromService: contato.idFromService,
        contatoId: contato.id,
        status: contato.status,
        atualizadoEm: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      message: `✅ ${contatosTotais.length} contatos sincronizados com sucesso.`,
    });

  } catch (error: any) {
    console.error('Erro ao sincronizar contatos:', error);
    return res.status(500).json({
      error: 'Erro ao sincronizar contatos',
      details: error.message,
    });
  }
}

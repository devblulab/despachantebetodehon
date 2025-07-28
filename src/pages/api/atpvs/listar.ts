import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '@/logic/firebase/config/app';

const API_KEY = "Nl8lhjWpE4efMw24Rd_FbHD6e1dBvi6bpc8DxBY3-P0";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = req.headers['authorization'];
  if (key !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: true, message: 'Não autorizado. Token inválido ou ausente.' });
  }

  const { page = '1', limit = '10', status } = req.query;
  const pageNum = parseInt(page as string, 10);
  const pageLimit = parseInt(limit as string, 10);

  try {
    let ref = collection(db, 'OrdensDeServicoBludata');
    let q = query(ref, orderBy('dataSolicitacao', 'desc'));

    if (status !== undefined) {
      q = query(ref, where('status', '==', Number(status)), orderBy('dataSolicitacao', 'desc'));
    }

    const allDocs = await getDocs(q);
    const start = (pageNum - 1) * pageLimit;
    const paginatedDocs = allDocs.docs.slice(start, start + pageLimit);

    const atpvs = paginatedDocs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({
      atpvs,
      page: pageNum,
      total: allDocs.size,
      totalPages: Math.ceil(allDocs.size / pageLimit)
    });
  } catch (error) {
    console.error("Erro ao listar ATPVs:", error);
    return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
  }
}

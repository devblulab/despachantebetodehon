// ✅ Arquivo: pages/api/digisacHistorico.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const DIGISAC_TOKEN = process.env.NEXT_PUBLIC_DIGISAC_TOKEN ?? '';
const SERVICE_ID = process.env.NEXT_PUBLIC_DIGISAC_SERVICE_ID ?? '';
const BASE_URL = 'https://parcelamentobetodehon.digisac.app';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, message: 'Método não permitido. Use POST.' });
  }

  const { numero } = req.body;
  if (!numero) {
    return res.status(400).json({ error: true, message: 'Número é obrigatório.' });
  }

  try {
    // ✅ Corrigido: Busca o contactId por "search" e não por "number"
    const contactsResponse = await fetch(`${BASE_URL}/api/v1/contacts?search=${numero}`, {
      headers: {
        Authorization: `Bearer ${DIGISAC_TOKEN}`
      }
    });

    if (!contactsResponse.ok) {
      const raw = await contactsResponse.text();
      return res.status(500).json({
        error: true,
        message: 'Erro ao buscar contato',
        statusCode: contactsResponse.status,
        raw
      });
    }

    const contactsData = await contactsResponse.json();
    const contactId = contactsData.data?.[0]?.id;

    if (!contactId) {
      return res.status(404).json({ error: true, message: 'Contato não encontrado.' });
    }

    // ✅ Rota correta para sincronizar histórico do contato
    const historyResponse = await fetch(`${BASE_URL}/api/v1/contacts/${contactId}/sync`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DIGISAC_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serviceId: SERVICE_ID
      })
    });

    if (!historyResponse.ok) {
      const erroText = await historyResponse.text();
      return res.status(500).json({
        error: true,
        message: 'Erro ao sincronizar histórico',
        statusCode: historyResponse.status,
        raw: erroText
      });
    }

    const historico = await historyResponse.json();
    return res.status(200).json({ success: true, items: historico.data ?? [] });

  } catch (err) {
    console.error('Erro inesperado:', err);
    return res.status(500).json({ error: true, message: 'Erro interno do servidor.' });
  }
}

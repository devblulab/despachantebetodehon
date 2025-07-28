// ✅ API route para consultar dados de veículo pela placa via APIBrasil
import type { NextApiRequest, NextApiResponse } from 'next';

const BASE_URL = 'https://gateway.apibrasil.io/api/v2/vehicles/dados';
const DEVICE_TOKEN = process.env.NEXT_PUBLIC_API_BRASIL_DEVICE_TOKEN!;
const BEARER_TOKEN = process.env.NEXT_PUBLIC_API_BRASIL_BEARER_TOKEN!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const { placa } = req.body;

  if (!placa) {
    return res.status(400).json({ erro: 'Placa é obrigatória' });
  }

  try {
    const resposta = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DeviceToken': DEVICE_TOKEN,
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify({ placa }),
    });

    if (!resposta.ok) {
      const texto = await resposta.text();
      return res.status(resposta.status).json({ erro: 'Falha na consulta', detalhes: texto });
    }

    const dados = await resposta.json();
    return res.status(200).json(dados);
  } catch (error) {
    console.error('Erro interno na API de placa:', error);
    return res.status(500).json({ erro: 'Erro interno ao consultar a placa' });
  }
}

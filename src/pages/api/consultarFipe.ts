import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const apiBrasilFipeUrl = 'https://gateway.apibrasil.io/api/v2/vehicles/fipe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const { placa } = req.body;

  if (!placa) {
    return res.status(400).json({ message: 'A placa é obrigatória.' });
  }

  try {
    const response = await axios.post(
      apiBrasilFipeUrl,
      { placa },
      {
        headers: {
          'Content-Type': 'application/json',
          'DeviceToken': process.env.NEXT_PUBLIC_API_BRASIL_DEVICE_TOKEN!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_BRASIL_BEARER_TOKEN!}`,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Erro na consulta FIPE:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Erro ao consultar valor FIPE.',
    });
  }
}

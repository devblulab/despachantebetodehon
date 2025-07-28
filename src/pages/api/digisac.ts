// pages/api/digisac.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const token = process.env.NEXT_PUBLIC_DIGISAC_TOKEN;
const serviceId = process.env.NEXT_PUBLIC_DIGISAC_SERVICE_ID;
const url = 'https://parcelamentobetodehon.digisac.app/api/v1/messages';

/**
 * Função utilitária para envio de SMS usando a API da Digisac
 */
export async function enviarSmsViaDigisac(numero: string, mensagem: string): Promise<boolean> {
  if (!token || !serviceId) {
    console.error('[❌ Digisac] Token ou ServiceID ausentes nas variáveis de ambiente.');
    return false;
  }

  try {
    const numeroFormatado = numero.startsWith('+') ? numero : `+55${numero.replace(/\D/g, '')}`;

    const payload = {
      text: mensagem,
      number: numeroFormatado,
      serviceId,
      origin: 'bot',
      dontOpenticket: true
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[❌ Digisac]', data);
      return false;
    }

    console.log(`[✅ Digisac] SMS enviado para ${numeroFormatado}`);
    return true;
  } catch (error) {
    console.error('[❌ Erro ao enviar via Digisac]', error);
    return false;
  }
}

/**
 * Endpoint para envio manual via API
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { numero, mensagem } = req.body;

  const sucesso = await enviarSmsViaDigisac(numero, mensagem);

  if (!sucesso) {
    return res.status(500).json({ success: false, message: 'Erro ao enviar mensagem via Digisac.' });
  }

  return res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });
}

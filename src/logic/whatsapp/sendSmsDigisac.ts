// logic/whatsapp/sendSmsDigisac.ts
import axios from 'axios';

const baseURL = 'https://parcelamentobetodehon.digisac.app/api/v1';
const bearer = process.env.DIGISAC_BEARER || '';

export async function sendMessage(numero: string, mensagem: string): Promise<boolean> {
  try {
    const numeroFormatado = numero.replace(/\D/g, '');

    const response = await axios.post(
      `${baseURL}/messages`,
      {
        to: numeroFormatado,
        type: 'text',
        text: { body: mensagem },
        channel: 'sms'
      },
      {
        headers: {
          Authorization: `Bearer ${bearer}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[RESPOSTA DIGISAC]', response.status, response.data); // ✅ ADICIONE ESSA LINHA

    return response.status === 200;
  } catch (error: any) {
    console.error('[ERRO DIGISAC SMS]', error.response?.data || error.message);
    return false;
  }
}

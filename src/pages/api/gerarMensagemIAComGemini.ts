import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function gerarMensagemIAComGemini(nome: string, mensagemBase: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // atualizado

    const prompt = `Você é um assistente de vendas automotivo. Reescreva essa mensagem de forma mais persuasiva e natural, mantendo o nome "${nome}":\n\n"${mensagemBase}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || mensagemBase;
  } catch (e) {
    console.error('[Gemini] erro ao gerar mensagem:', e);
    return mensagemBase;
  }
}

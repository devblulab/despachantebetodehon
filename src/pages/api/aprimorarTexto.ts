import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { texto } = req.body;

    if (!texto || typeof texto !== 'string' || texto.trim().length === 0) {
      return res.status(400).json({ error: 'Texto inválido ou ausente.' });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
Reescreva o texto abaixo de forma que fique mais atraente, bonita e interessante para redes sociais. Use poucas palavras, mas torne o conteúdo mais cativante, moderno e envolvente. 
Apenas devolva o texto aprimorado, sem explicações, sem opções e sem comentários, seja mais descolado e varia de 10 a 300 caracters
.

Texto:
"""${texto}"""
`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    console.log('[Gemini Flash] Resposta:', JSON.stringify(data, null, 2));

    const textoAprimorado = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textoAprimorado) {
      throw new Error('Texto não retornado pela IA.');
    }

    return res.status(200).json({ textoAprimorado });
  } catch (error: any) {
    console.error('[Gemini Flash] Erro:', error);
    return res.status(500).json({ error: 'Erro ao processar o texto com a IA Gemini Flash.' });
  }
}

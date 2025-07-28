import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../logic/firebase/config/app';

type Data = {
  response: string;
  suggestedServices?: string[];
  pricing?: { service: string; price: string; documents?: string[] }[];
  nextAction?: string;
  buttons?: { label: string; value: string }[];
  error?: string;
};

const PROMPT_CHATBOT = `
Você é a Lívia, uma assistente virtual do Despachante Beto Dehon, em Tubarão, Santa Catarina, especializada em documentação veicular. Sua comunicação é formal, calorosa, natural e humanizada, como uma atendente real, transmitindo empatia, confiança e profissionalismo.

Você domina os seguintes serviços:

1. **Transferência de Propriedade**
   - Valor: R$120,00 + Taxas: R$27,00 + Taxas Detran: R$20,00 = **Total: R$167,00**
   - Documentos: Cópia do RG e CPF do comprador e vendedor, Comprovante de residência atualizado, CRLV do veículo, Formulário de transferência preenchido e assinado
   - Prazo: 3 a 5 dias úteis

2. **Assinatura Digital**
   - Valor: R$239,00 + Taxas Detran: R$63,00 = **Total: R$302,00**
   - Documentos: Cópia do RG e CPF, Comprovante de residência, Documento do veículo (se aplicável)
   - Prazo: 1 a 2 dias úteis

Você conhece as leis de trânsito de Santa Catarina, normas do Detran-SC, ANTT e obrigações veiculares. Sua missão é tirar dúvidas, recomendar serviços, negociar vendas diretamente no chat, apresentar preços com taxas incluídas e conduzir o cliente ao fechamento.

REGRAS FUNDAMENTAIS:
1. SEMPRE mencione preços COM taxas incluídas (ex: "R$120,00 + taxa R$27,00 + Detran R$20,00 = Total: R$167,00").
2. Negocie ativamente: ofereça descontos, pacotes, promoções (ex.: 5% de desconto se fechar hoje).
3. Colete informações: nome, telefone, tipo de veículo, urgência.
4. Crie senso de urgência: "Oferta válida só hoje!" ou "Últimas vagas para atendimento express!"
5. Use técnicas de vendas: "Que tal aproveitar nosso pacote promocional?"
6. Finalize sempre oferecendo botão "ADQUIRIR SERVIÇO" quando apropriado.

TÉCNICAS DE NEGOCIAÇÃO:
- "Posso oferecer 5% de desconto se fechar hoje!"
- "Temos uma promoção especial para este serviço..."
- "Para você, vou fazer um preço especial..."
- "Se pegar mais um serviço, faço desconto no total..."

DIRETRIZES DE RESPOSTA:
- SEMPRE use listas numeradas para serviços
- Mantenha formatação formal e organizada
- Seja consultiva: entenda a necessidade antes de vender
- Apresente valor: explique benefícios e economia
- Use títulos em **negrito** para seções
- Negocie preço: sempre tente fechar a venda
- Colete dados: nome, telefone, urgência
- Finalize com botão de ação quando aplicável
- Separe informações em blocos claros

FORMATO DE RESPOSTA OBRIGATÓRIO:
- Use sempre listas organizadas e numeradas
- Mantenha tom formal mas acolhedor
- Apresente valores sempre com "Total:" incluindo taxas
- Use estrutura clara com títulos e subtópicos

EXEMPLO DE RESPOSTA COMERCIAL:
"**Transferência de Propriedade**

- Valor: R$120,00 + Taxas: R$27,00 + Taxas Detran: R$20,00 = **Total: R$167,00**
- Prazo: 3 a 5 dias úteis
- Benefício: Processo rápido e seguro, sem burocracia!

**Próximo Passo**
Por favor, informe seu nome completo para começarmos!"
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ response: '', error: 'Método não permitido' });
  }

  try {
    const { message, context, previousMessages, userInfo, selectedService, step } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        response: 'Desculpe, não entendi. Como posso te ajudar com sua documentação veicular? Entre em contato pelo WhatsApp (48) 3255-0606 para prosseguir.',
        error: 'Mensagem inválida',
      });
    }

    // Salvar lead no Firebase
    if (userInfo && userInfo.name && userInfo.phone) {
      await addDoc(collection(db, 'leads'), {
        name: userInfo.name,
        phone: userInfo.phone,
        vehicleType: userInfo.vehicleType,
        urgency: userInfo.urgency,
        service: selectedService || 'Geral',
        message,
        timestamp: serverTimestamp(),
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        response: 'Tivemos um contratempo. Como posso te ajudar hoje? Entre em contato pelo WhatsApp (48) 3255-0606 para prosseguir.',
      });
    }

    const detectedServices = detectServices(message);
    const contextHistory = previousMessages
      ? previousMessages.slice(-5).map((msg: any) => `${msg.sender}: ${msg.text}`).join('\n')
      : '';

    const enhancedPrompt = `
${PROMPT_CHATBOT}

CONTEXTO DA CONVERSA:
${contextHistory}

SERVIÇO SELECIONADO: ${selectedService || 'Nenhum'}

ETAPA ATUAL: ${step}

MENSAGEM DO CLIENTE: "${message}"

Responda como a Lívia, seguindo todas as diretrizes acima. Se o cliente estiver em uma etapa específica (collecting_info, documents, payment), siga a lógica correspondente:
- collecting_info: Solicite nome, telefone, tipo de veículo e urgência, um por vez.
- documents: Liste os documentos necessários para o serviço selecionado e pergunte se o cliente possui os documentos.
- payment: Informe que a equipe entrará em contato via WhatsApp para gerar o boleto.
`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: enhancedPrompt }] }],
          generationConfig: { temperature: 0.8, topK: 40, topP: 0.95, maxOutputTokens: 400 },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Erro na API Gemini: ${geminiResponse.status}`);
    }

    const data = await geminiResponse.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      let responseText = data.candidates[0].content.parts[0].text;
      responseText = responseText.replace(/^(Lívia:|Atendente:|Bot:|Assistente:)/i, '').trim();

      const suggestedServices = detectedServices.length > 0 ? detectedServices : [];
      const pricing = suggestedServices
        .map((serviceName) => {
          const service = {
            'TRANSFERÊNCIA DE PROPRIEDADE': { price: 'R$167,00', documents: ['Cópia do RG e CPF do comprador e vendedor', 'Comprovante de residência atualizado', 'CRLV do veículo', 'Formulário de transferência preenchido e assinado'] },
            'ASSINATURA DIGITAL': { price: 'R$302,00', documents: ['Cópia do RG e CPF', 'Comprovante de residência', 'Documento do veículo (se aplicável)'] },
          }[serviceName];
          return service ? { service: serviceName, price: service.price, documents: service.documents } : null;
        })
        .filter(Boolean) as { service: string; price: string; documents?: string[] }[];

      const nextAction = determineNextAction(message, detectedServices, step);

      let buttons: { label: string; value: string }[] | undefined;
      if (nextAction === 'offer_service' && !selectedService) {
        buttons = [
          { label: 'Transferência', value: 'TRANSFERÊNCIA DE PROPRIEDADE' },
          { label: 'Assinatura Digital', value: 'ASSINATURA DIGITAL' },
        ];
      } else if (nextAction === 'proceed_to_payment') {
        buttons = [{ label: 'ADQUIRIR SERVIÇO', value: 'proceed_to_payment' }];
      }

      return res.status(200).json({
        response: responseText,
        suggestedServices,
        pricing,
        nextAction,
        buttons,
      });
    } else {
      throw new Error('Resposta inválida da API Gemini');
    }
  } catch (error) {
    console.error('Erro na API IA:', error);
    return res.status(200).json({
      response: 'Desculpe, tivemos um pequeno contratempo. Como posso te ajudar hoje? Entre em contato pelo WhatsApp (48) 3255-0606 para prosseguir.',
      nextAction: 'whatsapp_contact',
    });
  }
}

function detectServices(message: string): string[] {
  const msg = message.toLowerCase();
  const services: string[] = [];

  const serviceKeywords: { [key: string]: string[] } = {
    'TRANSFERÊNCIA DE PROPRIEDADE': ['transferência', 'transferir', 'comprei', 'vendi'],
    'ASSINATURA DIGITAL': ['assinatura digital'],
  };

  for (const [serviceName, keywords] of Object.entries(serviceKeywords)) {
    if (keywords.some((keyword) => msg.includes(keyword))) {
      services.push(serviceName);
    }
  }

  return services;
}

function determineNextAction(message: string, detectedServices: string[], step: string): string {
  const msg = message.toLowerCase();
  if (msg.includes('preço') || msg.includes('valor') || msg.includes('quanto custa')) return 'send_pricing';
  if (msg.includes('quero') || msg.includes('preciso') || msg.includes('contratar') || msg.includes('finalizar')) return 'proceed_to_payment';
  if (detectedServices.length > 0 && step === 'initial') return 'offer_service';
  if (step === 'documents' && msg.includes('sim') || msg.includes('tenho')) return 'proceed_to_payment';
  if (step === 'payment') return 'whatsapp_contact';
  return 'continue_conversation';
}
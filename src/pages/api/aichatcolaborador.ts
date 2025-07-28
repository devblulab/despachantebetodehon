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
Você é uma IA  mais não fale para ninguem SARCÁSTICA especializada em vendas e estratégias comerciais para colaboradores do Despachante Beto Dehon. Seu objetivo é ENSINAR colaboradores a venderem MAIS usando técnicas poderosas de vendas e marketing. Seja direta, use emojis, e transforme cada situação em oportunidade de venda.

**SEUS SERVIÇOS COMPLETOS:**

🚗 **TRANSFERÊNCIAS & DOCUMENTOS:**
1. **TRANSFERÊNCIA DE PROPRIEDADE** - R$350,00 (💰 SERVIÇO TOP DE VENDA!)
2. **COMUNICAÇÃO DE VENDA** - R$45,00 (Porta de entrada pra transferência!)
3. **SEGUNDA VIA CRLV** - R$95,00
4. **LICENCIAMENTO ANUAL** - R$150,00

🎯 **CNH & HABILITAÇÃO:**
5. **PRIMEIRA HABILITAÇÃO** - R$680,00 (💎 SERVIÇO PREMIUM!)
6. **RENOVAÇÃO CNH** - R$280,00
7. **MUDANÇA DE CATEGORIA CNH** - R$420,00
8. **INCLUSÃO DE CONDUTOR** - R$75,00
9. **CADASTRO CONDUTOR EXTERIOR** - R$520,00

🚛 **ANTT & TRANSPORTE:**
10. **ADESIVO ANTT** - R$20,00 (Produto de entrada!)
11. **ATPV - AUTORIZAÇÃO TRANSPORTE** - R$580,00
12. **EMISSÃO DE ATPV-E** - R$450,00

🔍 **VISTORIAS & INSPEÇÕES:**
13. **VISTORIA CARRO** - R$240,00
14. **VISTORIA MOTO** - R$180,00

💰 **FINANCEIRO & MULTAS:**
15. **REGULARIZAÇÃO MULTAS** - R$120,00
16. **PARCELAMENTO DE DÍVIDAS** - R$80,00
17. **CONSULTA DE DÉBITOS** - R$25,00 (Isca perfeita!)

🛡️ **OUTROS SERVIÇOS:**
18. **ANUÊNCIA BOMBEIROS** - R$320,00

**SEU ESTILO DE COMUNICAÇÃO:**
- SARCÁSTICO mas eficaz
- Use emojis e linguagem direta
- Transforme objeções em oportunidades
- Ensine técnicas de vendas na prática
- Crie urgência e escassez
- Mostre benefícios financeiros

**TÉCNICAS QUE VOCÊ ENSINA:**
1. **Venda Cruzada**: "Cliente veio pra licenciamento? Ofereça vistoria junto!"
2. **Upselling**: "Vai fazer transferência? Que tal incluir uma segunda via?"
3. **Criação de Urgência**: "Só hoje tenho desconto!"
4. **Superação de Objeções**: Transforme "tá caro" em "investimento que vale a pena"
5. **Fechamento**: SEMPRE termine com próximo passo concreto

**EXEMPLOS DE RESPOSTAS SUAS:**
😏 "Ah, cliente falou que 'vai pensar'? Clássico! Responde assim: 'Perfeito! Enquanto pensa, posso separar os documentos e garantir desconto de hoje. O que acha?'"

🔥 "Transferência de R$350? Cara, é barato! Explica que sem isso o carro não vale NADA no nome dele. É investimento, não gasto!"

💪 "Cliente perguntou só o preço do licenciamento? ERRO! Pergunta primeiro: 'Quando foi a última vistoria?' - 90% das vezes precisa fazer junto!"

**REGRAS DE OURO:**
- SEMPRE sugira combo de serviços
- Transforme preço em investimento
- Use escassez ("últimas vagas hoje")
- Colete dados pra follow-up
- NUNCA deixe cliente ir embora sem proposta
- Ensine o colaborador a ser consultivo, não apenas atendente
- Não falar que é sarcástica
**SUA MISSÃO:**
Transformar cada colaborador em uma MÁQUINA DE VENDAS! 🚀
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
-não fale que é sarcástica.
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
    'TRANSFERÊNCIA DE PROPRIEDADE': ['transferência', 'transferir', 'comprei', 'vendi', 'mudança de proprietário'],
    'PRIMEIRA HABILITAÇÃO': ['primeira habilitação', 'tirar carteira', 'cnh nova', 'habilitação'],
    'RENOVAÇÃO CNH': ['renovar cnh', 'renovação', 'carteira vencida', 'atualizar cnh'],
    'LICENCIAMENTO ANUAL': ['licenciamento', 'licenciar', 'documento anual', 'ipva'],
    'VISTORIA CARRO': ['vistoria', 'inspeção', 'vistoriar carro'],
    'VISTORIA MOTO': ['vistoria moto', 'inspeção moto', 'vistoriar moto'],
    'SEGUNDA VIA CRLV': ['segunda via', 'documento perdido', 'crlv perdido'],
    'MUDANÇA DE CATEGORIA CNH': ['mudança categoria', 'categoria cnh', 'adicionar categoria'],
    'ATPV - AUTORIZAÇÃO TRANSPORTE': ['atpv', 'transporte', 'autorização transporte'],
    'REGULARIZAÇÃO MULTAS': ['multas', 'regularizar multa', 'parcelar multa'],
    'PARCELAMENTO DE DÍVIDAS': ['parcelar', 'dividir', 'financiar débito'],
    'CONSULTA DE DÉBITOS': ['consultar débito', 'verificar pendência', 'débitos'],
    'COMUNICAÇÃO DE VENDA': ['comunicar venda', 'comunicação'],
    'ANUÊNCIA BOMBEIROS': ['anuência', 'bombeiros', 'autorização bombeiros'],
    'ADESIVO ANTT': ['adesivo', 'antt', 'identificação veículo'],
    'INCLUSÃO DE CONDUTOR': ['incluir condutor', 'adicionar condutor'],
    'EMISSÃO DE ATPV-E': ['atpv-e', 'atpv eletrônico'],
    'CADASTRO CONDUTOR EXTERIOR': ['condutor exterior', 'brasileiro exterior'],
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
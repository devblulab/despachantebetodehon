// pages/api/mensagensPorContato/[numero].ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';

const db = getFirestore(app);
const baseURL = 'https://parcelamentobetodehon.digisac.app/api/v1';
const bearer = process.env.DIGISAC_BEARER || '';

// Função para limpar e normalizar número
function normalizarNumero(numero: string): string {
  return numero.replace(/\D/g, '').replace(/^55/, ''); // remove tudo que não for dígito e mantém apenas DDD + número
}

// Gera variações do número para buscar
function gerarVariacoes(numero: string): string[] {
  const limpo = normalizarNumero(numero);
  if (limpo.length === 11) {
   
    const sem9 = limpo.slice(0, 2) + limpo.slice(3); 
    return [`55${limpo}`, `55${sem9}`];
  }
  if (limpo.length === 10) {
   
    const com9 = limpo.slice(0, 2) + '9' + limpo.slice(2);
    return [`55${limpo}`, `55${com9}`];
  }
  return [`55${limpo}`];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const numeroOriginal = req.query.numero as string;
  if (!numeroOriginal) return res.status(400).json({ error: 'Número é obrigatório.' });

  const variacoes = gerarVariacoes(numeroOriginal);

  try {
    let contato = null;
    let numeroPadrao = '';

    // 1. Buscar contato pela variação do número
    for (const variacao of variacoes) {
      const contatosRes = await axios.get(`${baseURL}/contacts?where[data.number]=${variacao}`, {
        headers: { Authorization: `Bearer ${bearer}` },
      });

      if (contatosRes.data?.data?.[0]) {
        contato = contatosRes.data.data[0];
        numeroPadrao = variacao;
        break;
      }
    }

    if (!contato) return res.status(404).json({ message: 'Contato não encontrado na Digisac.' });

    const contactId = contato.id;

    // 2. Buscar todos os tickets
    const ticketsRes = await axios.get(`${baseURL}/tickets?where[contactId]=${contactId}&sort=-createdAt`, {
      headers: { Authorization: `Bearer ${bearer}` },
    });

    const tickets = ticketsRes.data?.data || [];
    if (!tickets.length) return res.status(404).json({ message: 'Nenhum ticket encontrado para este contato.' });

    // 3. Buscar mensagens dos tickets
    let todasMensagens: any[] = [];
    for (const ticket of tickets) {
      const mensagensRes = await axios.get(`${baseURL}/messages?where[ticketId]=${ticket.id}`, {
        headers: { Authorization: `Bearer ${bearer}` },
      });
      const mensagens = mensagensRes.data?.data || [];
      todasMensagens.push(...mensagens);
    }

    // 4. Salvar no Firebase com número normalizado
    const docRef = doc(db, 'HistoricoMensagens', numeroPadrao);
    await setDoc(docRef, {
      mensagens: todasMensagens,
      atualizadoEm: new Date().toISOString(),
    });

    return res.status(200).json({ mensagens: todasMensagens });
  } catch (err: any) {
    console.error('Erro ao buscar histórico:', err?.response?.data || err.message);
    return res.status(500).json({
      error: 'Erro ao buscar histórico.',
      raw: err?.response?.data || err.message,
    });
  }
}

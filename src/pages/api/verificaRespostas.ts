import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';

const db = getFirestore(app);

// 🔁 Normaliza número para formato padrão com DDI 55
function normalizarTelefoneBrasil(numero: string): string {
  let phone = numero.replace(/\D/g, '');

  if (phone.startsWith('55')) phone = phone.slice(2);

  if (phone.length === 10) {
    // Ex: 4898450642 → 48998450642
    phone = phone.slice(0, 2) + '9' + phone.slice(2);
  }

  return `55${phone.slice(0, 11)}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const contatosSnap = await getDocs(collection(db, 'DadosclientesExtraidos'));
    const resultados: any[] = [];

    for (const contatoDoc of contatosSnap.docs) {
      const contato = contatoDoc.data();
      const id = contatoDoc.id;

      const numeroOriginal = contato.fone_celular;
      if (!numeroOriginal) continue;

      const numeroBase = normalizarTelefoneBrasil(numeroOriginal);

      const alternativas = [numeroBase];

      // Se tiver 9, tenta também sem o 9
      if (numeroBase.length === 13 && numeroBase[4] === '9') {
        const sem9 = numeroBase.slice(0, 4) + numeroBase.slice(5);
        alternativas.push(sem9);
      } else if (numeroBase.length === 12) {
        const com9 = numeroBase.slice(0, 4) + '9' + numeroBase.slice(4);
        alternativas.push(com9);
      }

      let mensagensIn: any[] = [];
      let ultimaMensagem: any = null;

      for (const altNumero of alternativas) {
        const mensagensSnap = await getDocs(collection(db, `mensagensPorContato/${altNumero}/mensagens`));
        const mensagens = mensagensSnap.docs.map(doc => doc.data());
        const recebidas = mensagens.filter((msg) => !msg.isFromMe && msg.texto);

        if (recebidas.length > 0) {
          mensagensIn = recebidas;
          ultimaMensagem = recebidas
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
          break;
        }
      }

      if (ultimaMensagem && contato.statusCRM === 'contatado') {
        await updateDoc(doc(db, 'DadosclientesExtraidos', id), {
          statusCRM: 'interessado',
          atualizadoPor: 'verificaRespostas',
          dataAtualizacao: new Date().toISOString(),
        });

        resultados.push({
          numero: numeroBase,
          nome: contato.proprietarioatual || '',
          statusAnterior: 'contatado',
          statusAtual: 'interessado',
          ultimaMensagem: ultimaMensagem.texto || '',
        });
      }
    }

    return res.status(200).json({ success: true, resultados });
  } catch (error) {
    console.error('Erro ao verificar respostas IA:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
}

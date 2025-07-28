'use client';

import { useEffect } from 'react';
import { Cliente } from '@/types/Cliente';
import {
  getFirestore,
  addDoc,
  collection,
  updateDoc,
  doc,
  getDocs
} from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';

// 🔁 Normaliza número para formato 55 + DDD + número com 9
function normalizarTelefoneBrasil(numero: string): string {
  let phone = numero.replace(/\D/g, '');
  if (phone.startsWith('55')) phone = phone.slice(2);
  if (phone.length === 10) phone = phone.slice(0, 2) + '9' + phone.slice(2);
  return `55${phone.slice(0, 11)}`;
}

// 💬 Gera mensagens variadas para SMS
function gerarMensagemIA(cliente: Cliente): string {
  const nome = cliente.proprietarioatual || 'cliente';
  const modelo = cliente.marca_modelo || 'veículo';
  const placa = cliente.placa || '';
  const cidade = cliente.municipio || 'sua cidade';

  const frases = [
    `📢 Olá ${nome}, tudo bem? Identificamos que o ${modelo} placa ${placa} está com pendências de licenciamento. Podemos resolver isso agora com parcelamento fácil e seguro.`,
    `✅ ${nome}, oferecemos condições exclusivas para regularizar o seu ${modelo}. Atendimento rápido, sem complicações e com parcelamento no boleto ou cartão.`,
    `🚗 Seu ${modelo}, de ${cidade}, está pronto para rodar legalizado. Evite multas e dores de cabeça — parcelamos com ou sem IPVA.`,
    `📊 Trabalhamos com as melhores soluções de licenciamento. O ${modelo} placa ${placa} pode ser regularizado hoje mesmo. Você escolhe como pagar.`,
    `💡 Sabia que regularizar seu veículo agora evita aumento de encargos? Parcelamos de forma inteligente e personalizada. É só me responder aqui.`
  
  
  
  ];

  return frases[Math.floor(Math.random() * frases.length)];
}

// 📤 Envia SMS via Digisac
async function enviarSMS(numeroOriginal: string, mensagem: string): Promise<boolean> {
  try {
    const numeroFormatado = `+${normalizarTelefoneBrasil(numeroOriginal)}`;

    const res = await fetch('/api/digisac', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero: numeroFormatado, mensagem }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Erro inesperado');
    return true;
  } catch (e) {
    console.error('Erro ao enviar SMS IA:', e);
    return false;
  }
}

// 🔁 Hook principal que ativa IA de envio e verificação
export const useIAParcelamento = (clientes: Cliente[]) => {
  useEffect(() => {
    const iaAtiva = typeof window !== 'undefined' && localStorage.getItem('iaAtiva') === 'true';
    if (!iaAtiva) return;

    const executarIA = async () => {
      const db = getFirestore(app);

      for (const cliente of clientes) {
        const numeroFormatado = normalizarTelefoneBrasil(cliente.fone_celular || '');
        if (!cliente.id || numeroFormatado.length !== 13) continue;

        const docRef = doc(db, 'DadosclientesExtraidos', cliente.id);

        // 🧠 Verifica se já respondeu (respostas recebidas)
        const mensagensSnap = await getDocs(collection(db, `mensagensPorContato/${numeroFormatado}/mensagens`));
        const mensagens = mensagensSnap.docs.map(doc => doc.data());
        const mensagensRecebidas = mensagens.filter((msg) => !msg.isFromMe && msg.texto);

        // 👥 Se respondeu e está contatado, vira interessado
        if (mensagensRecebidas.length > 0 && cliente.statusCRM === 'contatado') {
          await updateDoc(docRef, {
            statusCRM: 'interessado',
            atualizadoPor: 'verificadorIA',
            dataAtualizacao: new Date().toISOString(),
          });
          continue; // não envia nova mensagem
        }

        // ✉️ Se for novo, envia mensagem e marca como contatado
        if (cliente.statusCRM === 'novo') {
          const mensagem = gerarMensagemIA(cliente);
          const sucesso = await enviarSMS(cliente.fone_celular, mensagem);

          if (sucesso) {
            await updateDoc(docRef, {
              statusCRM: 'contatado',
              dataAtualizacao: new Date().toISOString(),
            });

            await addDoc(collection(db, 'HistoricoSMSGemini'), {
              clienteId: cliente.id,
              numero: numeroFormatado,
              mensagem,
              statusAntes: 'novo',
              statusDepois: 'contatado',
              sugestaoIA: true,
              timestamp: new Date().toISOString(),
            });

            await new Promise((r) => setTimeout(r, 800)); // evita spam
          }
        }
      }
    };

    if (clientes.length > 0) {
      executarIA();
    }
  }, [clientes]);
};

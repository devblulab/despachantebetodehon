// logic/ia/gerarMensagem.ts
import { Cliente } from '@/types/Cliente';

export function gerarMensagemIA(cliente: Cliente): string {
  const nome = cliente.proprietarioatual || 'cliente';
  const modelo = cliente.marca_modelo || 'veículo';
  const placa = cliente.placa || '';
  const cidade = cliente.municipio || 'sua cidade';

  const frases = [
    `🚨 ${nome.toUpperCase()}, seu ${modelo} placa ${placa} pode ser licenciado hoje mesmo com parcelamento!`,
    `📢 ${nome}, evite multas e regularize seu ${modelo} de ${cidade}.`,
    `💼 Parcelamos seu licenciamento em até 12x. O ${modelo} está pronto para rodar!`,
  ];

  return frases[Math.floor(Math.random() * frases.length)];
}

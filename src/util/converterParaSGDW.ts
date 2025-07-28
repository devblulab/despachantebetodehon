import { Timestamp } from 'firebase/firestore';

export const converterParaSGDW = (item: any) => {
  return {
    placa: item.id?.trim() || '',
    renav: item.renavam?.trim() || '',
    chassi: '', // Se disponível
    valorNF: item.valordevenda?.trim() || '',
    cliente: {
      cpf: item.cpfvendedor?.replace(/\D/g, '') || '',
      nome: item.nomevendedor?.trim() || '',
      email: item.emailvendedor?.trim() || '',
      telefone: item.celtelvendedor?.replace(/\D/g, '') || '',
      endereco: {
        cep: item.cepvendedor?.replace(/\D/g, '') || '',
        logradouro: item.enderecovendedor?.trim() || '',
        numero: '', // Se disponível separadamente
        bairro: '', // Se disponível
        municipio: item.municipiovendedor?.trim() || '',
        uf: item.complementovendedor?.trim() || ''
      }
    },
    comprador: {
      cpf: item.cpfcomprador?.replace(/\D/g, '') || '',
      nome: item.nomecomprador?.trim() || '',
      email: item.emailcomprador?.trim() || '',
      telefone: item.celtelcomprador?.replace(/\D/g, '') || '',
      endereco: {
        cep: item.cepcomprador?.replace(/\D/g, '') || '',
        logradouro: item.enderecocomprador?.trim() || '',
        numero: '', // Se disponível separadamente
        bairro: item.bairrocomprador?.trim() || '',
        municipio: item.municipiocomprador?.trim() || '',
        uf: item.complementocomprador?.trim() || ''
      }
    },
    origem: item.nomeempresa?.trim() || '',
    dataSolicitacao: (item.dataCriacao instanceof Timestamp)
      ? item.dataCriacao.toDate().toISOString()
      : new Date().toISOString(),
    status: item.status?.toLowerCase() === 'concluído' ? 1 : 0
  };
};

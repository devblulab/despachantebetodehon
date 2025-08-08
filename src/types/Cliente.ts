

export interface Cliente {
  placa: string;
  renavam: string;
  proprietarioatual: string;
  marca_modelo: string;
  origem: string;
  municipio: string;
  observacao?: string;
  fone_residencial: string;
  fone_comercial: string;
  fone_celular: string;
  usuario: string;
  statusCRM?: string;
  dataAtualizacao?: string;
  id?: string;
  funnelId?: string; // Added to fix compile error
}

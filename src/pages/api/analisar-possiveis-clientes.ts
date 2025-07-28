
import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, doc, setDoc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../logic/firebase/config/app';

type Data = {
  success: boolean;
  message: string;
  totalAnalisados?: number;
  novosClientes?: number;
  clientesAtualizados?: number;
  clientesIgnorados?: number;
  error?: string;
};

interface PossivelCliente {
  id: string;
  nome: string;
  documento: string; // CPF ou CNPJ
  tipoDocumento: 'CPF' | 'CNPJ';
  tipoCliente: 'PF' | 'PJ';
  email?: string;
  telefone?: string;
  endereco: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
  score: number;
  potencial: 'baixo' | 'medio' | 'alto';
  origem: string;
  dadosOriginais: any;
  dataAnalise: Date;
  valorEstimado?: number;
  frequenciaInteracao: number;
  observacoes: string[];
  dadosEnriquecidos?: {
    situacao?: string;
    nascimento?: string;
    mae?: string;
    consultaRealizada?: boolean;
  };
}

// Função para consultar CPF na API
async function consultarCPF(cpf: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cpf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cpf })
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn(`Erro ao consultar CPF ${cpf}:`, error);
  }
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  try {
    console.log('🔍 Iniciando análise de possíveis clientes...');

    // 1. Carregar usuários existentes para evitar duplicatas
    const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
    const usuariosExistentes = new Set<string>();
    usuariosSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.cpf) usuariosExistentes.add(data.cpf.replace(/\D/g, ''));
      if (data.cnpj) usuariosExistentes.add(data.cnpj.replace(/\D/g, ''));
      if (data.email) usuariosExistentes.add(data.email.toLowerCase());
    });

    // 2. Carregar possíveis clientes já existentes para evitar duplicatas
    const possiveisClientesSnapshot = await getDocs(collection(db, 'PossiveisClientes'));
    const possiveisClientesExistentes = new Set<string>();
    possiveisClientesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.documento) {
        const docLimpo = data.documento.replace(/\D/g, '');
        possiveisClientesExistentes.add(docLimpo);
      }
    });

    // 3. Buscar dados da coleção OrdensDeServicoBludata
    const ordensSnapshot = await getDocs(collection(db, 'OrdensDeServicoBludata'));
    const ordensData = ordensSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`📊 Total de ordens encontradas: ${ordensData.length}`);
    console.log(`👥 Usuários existentes: ${usuariosExistentes.size}`);
    console.log(`🎯 Possíveis clientes já cadastrados: ${possiveisClientesExistentes.size}`);

    if (ordensData.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Nenhuma ordem de serviço encontrada para análise',
        totalAnalisados: 0,
        novosClientes: 0,
        clientesAtualizados: 0,
        clientesIgnorados: 0
      });
    }

    let totalAnalisados = 0;
    let novosClientes = 0;
    let clientesAtualizados = 0;
    let clientesIgnorados = 0;
    const clientesProcessados = new Map<string, PossivelCliente>();

    // 4. Processar cada ordem de serviço
    for (const ordem of ordensData) {
      try {
        const clientesExtract = extrairClientesDaOrdem(ordem);
        
        for (const clienteData of clientesExtract) {
          totalAnalisados++;
          
          const documento = clienteData.documento.replace(/\D/g, '');
          const clienteId = documento; // Usar documento como ID único
          
          // Verificar se já é usuário existente
          if (usuariosExistentes.has(documento) || 
              usuariosExistentes.has(clienteData.email?.toLowerCase() || '')) {
            clientesIgnorados++;
            console.log(`⏭️ Ignorando ${clienteData.nome} - já é usuário do sistema`);
            continue;
          }

          // Verificar se já está na coleção PossiveisClientes
          if (possiveisClientesExistentes.has(documento)) {
            clientesIgnorados++;
            console.log(`⏭️ Ignorando ${clienteData.nome} - já está em PossiveisClientes`);
            continue;
          }
          
          if (clientesProcessados.has(clienteId)) {
            // Cliente já processado nesta análise, atualizar dados
            const clienteExistente = clientesProcessados.get(clienteId)!;
            clienteExistente.frequenciaInteracao++;
            clienteExistente.score = Math.min(100, clienteExistente.score + 5);
            clienteExistente.observacoes.push(`Encontrado em ordem: ${ordem.id}`);
            
            // Atualizar dados se estiverem vazios
            if (!clienteExistente.email && clienteData.email) {
              clienteExistente.email = clienteData.email;
            }
            if (!clienteExistente.telefone && clienteData.telefone) {
              clienteExistente.telefone = clienteData.telefone;
            }
            if (!clienteExistente.endereco.cep && clienteData.endereco.cep) {
              clienteExistente.endereco = { ...clienteExistente.endereco, ...clienteData.endereco };
            }
          } else {
            // Novo possível cliente
            const score = calcularScoreIA(clienteData, ordem);
            const potencial = determinarPotencial(score, clienteData);
            
            // Enriquecer dados com API CPF (apenas para CPF)
            let dadosEnriquecidos = undefined;
            if (clienteData.tipoDocumento === 'CPF' && documento.length === 11) {
              const dadosCPF = await consultarCPF(documento);
              if (dadosCPF && dadosCPF.success) {
                dadosEnriquecidos = {
                  situacao: dadosCPF.situacao,
                  nascimento: dadosCPF.nascimento,
                  mae: dadosCPF.mae,
                  consultaRealizada: true
                };
                console.log(`✅ Dados enriquecidos para ${clienteData.nome}`);
              }
            }
            
            const possivelCliente: PossivelCliente = {
              id: clienteId,
              nome: clienteData.nome,
              documento: clienteData.documento,
              tipoDocumento: clienteData.tipoDocumento,
              tipoCliente: clienteData.tipoCliente,
              email: clienteData.email || 'Email não informado',
              telefone: clienteData.telefone || 'Telefone não informado',
              endereco: clienteData.endereco,
              score: score,
              potencial: potencial,
              origem: `Ordem de Serviço: ${ordem.id}`,
              dadosOriginais: ordem,
              dataAnalise: new Date(),
              valorEstimado: extrairValorEstimado(ordem),
              frequenciaInteracao: 1,
              observacoes: [`Identificado em ordem: ${ordem.id}`, `Status: Novo possível cliente`],
              dadosEnriquecidos
            };
            
            clientesProcessados.set(clienteId, possivelCliente);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Erro ao processar ordem ${ordem.id}:`, error);
      }
    }

    // 5. Salvar novos possíveis clientes no Firebase
    for (const [clienteId, cliente] of Array.from(clientesProcessados.entries())) {
      try {
        const clienteRef = doc(db, 'PossiveisClientes', clienteId);
        await setDoc(clienteRef, {
          ...cliente,
          dataCriacao: new Date(),
          ultimaAtualizacao: new Date()
        });
        novosClientes++;
        console.log(`✅ Novo possível cliente salvo: ${cliente.nome}`);
      } catch (error) {
        console.error(`❌ Erro ao salvar possível cliente ${clienteId}:`, error);
      }
    }

    console.log(`✅ Análise concluída: ${totalAnalisados} analisados, ${novosClientes} novos, ${clientesIgnorados} ignorados`);

    return res.status(200).json({
      success: true,
      message: `Análise IA concluída! 🎯 ${novosClientes} novos possíveis clientes identificados, ${clientesIgnorados} ignorados (já são usuários ou possíveis clientes).`,
      totalAnalisados,
      novosClientes,
      clientesAtualizados: 0,
      clientesIgnorados
    });

  } catch (error) {
    console.error('❌ Erro na análise de possíveis clientes:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno durante a análise',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

// Função para extrair TODOS os possíveis clientes de uma ordem de serviço
function extrairClientesDaOrdem(ordem: any): any[] {
  const clientes: any[] = [];
  const clientesUnicos = new Set<string>(); // Para evitar duplicatas na mesma ordem

  // Função auxiliar para adicionar cliente se válido e único
  const adicionarCliente = (nome: string, documento: string, email: string, telefone: string, endereco: any, origem: string) => {
    if (!nome || !documento) return;
    
    const docLimpo = documento.replace(/\D/g, '');
    if (docLimpo.length < 11) return; // CPF deve ter 11 dígitos, CNPJ 14
    
    const chaveUnica = `${nome.toLowerCase().trim()}-${docLimpo}`;
    if (clientesUnicos.has(chaveUnica)) return; // Já foi adicionado nesta ordem
    
    clientesUnicos.add(chaveUnica);
    
    const tipoDocumento = docLimpo.length === 14 ? 'CNPJ' : 'CPF';
    const tipoCliente = docLimpo.length === 14 ? 'PJ' : 'PF';

    clientes.push({
      nome: nome.trim(),
      documento: documento,
      tipoDocumento: tipoDocumento,
      tipoCliente: tipoCliente,
      email: email || '',
      telefone: telefone || '',
      endereco: endereco || {},
      origem: origem
    });
  };

  // Extrair cliente principal (vários campos possíveis)
  const nomesPossiveis = [ordem.nome, ordem.nomeCompleto, ordem.razaoSocial, ordem.cliente, ordem.solicitante];
  const documentosPossiveis = [ordem.cpf, ordem.cnpj, ordem.documento];
  const emailsPossiveis = [ordem.email, ordem.emailCliente, ordem.emailSolicitante];
  const telefonesPossiveis = [ordem.telefone, ordem.celular, ordem.whatsapp, ordem.telefoneSolicitante];

  for (const nome of nomesPossiveis) {
    if (nome) {
      for (const doc of documentosPossiveis) {
        if (doc) {
          const email = emailsPossiveis.find(e => e) || '';
          const telefone = telefonesPossiveis.find(t => t) || '';
          const endereco = {
            cep: ordem.cep || ordem.endereco?.cep || '',
            logradouro: ordem.logradouro || ordem.endereco?.logradouro || ordem.endereco?.rua || '',
            numero: ordem.numero || ordem.endereco?.numero || '',
            bairro: ordem.bairro || ordem.endereco?.bairro || '',
            cidade: ordem.cidade || ordem.endereco?.cidade || ordem.endereco?.municipio || '',
            estado: ordem.estado || ordem.endereco?.estado || ordem.endereco?.uf || ''
          };
          
          adicionarCliente(nome, doc, email, telefone, endereco, 'Dados principais');
          break; // Um documento por nome é suficiente
        }
      }
    }
  }

  // Extrair comprador se existir
  if (ordem.comprador) {
    const comprador = ordem.comprador;
    const nomeComprador = comprador.nome || comprador.nomeCompleto || comprador.razaoSocial || '';
    const docComprador = comprador.cnpj || comprador.cpf || comprador.documento || '';
    const emailComprador = comprador.email || '';
    const telefoneComprador = comprador.telefone || comprador.celular || '';
    const enderecoComprador = comprador.endereco || {};

    if (nomeComprador && docComprador) {
      adicionarCliente(nomeComprador, docComprador, emailComprador, telefoneComprador, enderecoComprador, 'Comprador');
    }
  }

  // Extrair vendedor se existir
  if (ordem.vendedor) {
    const vendedor = ordem.vendedor;
    const nomeVendedor = vendedor.nome || vendedor.nomeCompleto || vendedor.razaoSocial || '';
    const docVendedor = vendedor.cnpj || vendedor.cpf || vendedor.documento || '';
    const emailVendedor = vendedor.email || '';
    const telefoneVendedor = vendedor.telefone || vendedor.celular || '';
    const enderecoVendedor = vendedor.endereco || {};

    if (nomeVendedor && docVendedor) {
      adicionarCliente(nomeVendedor, docVendedor, emailVendedor, telefoneVendedor, enderecoVendedor, 'Vendedor');
    }
  }

  // Extrair responsável se existir
  if (ordem.responsavel) {
    const responsavel = ordem.responsavel;
    const nomeResponsavel = responsavel.nome || responsavel.nomeCompleto || '';
    const docResponsavel = responsavel.cnpj || responsavel.cpf || responsavel.documento || '';
    const emailResponsavel = responsavel.email || '';
    const telefoneResponsavel = responsavel.telefone || responsavel.celular || '';
    const enderecoResponsavel = responsavel.endereco || {};

    if (nomeResponsavel && docResponsavel) {
      adicionarCliente(nomeResponsavel, docResponsavel, emailResponsavel, telefoneResponsavel, enderecoResponsavel, 'Responsável');
    }
  }

  // Extrair procurador se existir
  if (ordem.procurador) {
    const procurador = ordem.procurador;
    const nomeProcurador = procurador.nome || procurador.nomeCompleto || '';
    const docProcurador = procurador.cnpj || procurador.cpf || procurador.documento || '';
    const emailProcurador = procurador.email || '';
    const telefoneProcurador = procurador.telefone || procurador.celular || '';
    const enderecoProcurador = procurador.endereco || {};

    if (nomeProcurador && docProcurador) {
      adicionarCliente(nomeProcurador, docProcurador, emailProcurador, telefoneProcurador, enderecoProcurador, 'Procurador');
    }
  }

  return clientes;
}

// Função de IA para calcular score
function calcularScoreIA(clienteData: any, ordem: any): number {
  let score = 50; // Score base

  // Análise de completude dos dados (30 pontos)
  if (clienteData.nome && clienteData.nome.length > 3) score += 5;
  if (clienteData.email && clienteData.email.includes('@')) score += 8;
  if (clienteData.telefone && clienteData.telefone.length >= 10) score += 7;
  if (clienteData.endereco.cep) score += 5;
  if (clienteData.endereco.cidade) score += 5;

  // Análise do tipo de cliente (20 pontos)
  if (clienteData.tipoCliente === 'PJ') score += 15; // Empresas têm maior potencial
  if (clienteData.tipoCliente === 'PF') score += 10;

  // Análise do valor da ordem (25 pontos)
  const valor = extrairValorEstimado(ordem);
  if (valor > 1000) score += 20;
  else if (valor > 500) score += 15;
  else if (valor > 200) score += 10;
  else if (valor > 0) score += 5;

  // Análise temporal (15 pontos) - Versão robusta sem erros
  let dataOrdem = new Date();
  try {
    // Verificar vários campos de data possíveis
    const camposData = ['dataSolicitacao', 'dataAtualizacao', 'dataCriacao', 'data', 'timestamp'];
    
    for (const campo of camposData) {
      const valorData = ordem[campo];
      if (valorData) {
        if (typeof valorData === 'object' && valorData.toDate && typeof valorData.toDate === 'function') {
          // Timestamp do Firestore
          dataOrdem = valorData.toDate();
          break;
        } else if (valorData instanceof Date) {
          // Objeto Date
          dataOrdem = valorData;
          break;
        } else if (typeof valorData === 'string') {
          // String de data
          const dataParseada = new Date(valorData);
          if (!isNaN(dataParseada.getTime())) {
            dataOrdem = dataParseada;
            break;
          }
        } else if (typeof valorData === 'number') {
          // Timestamp em milissegundos
          dataOrdem = new Date(valorData);
          break;
        }
      }
    }
  } catch (error) {
    // Em caso de erro, usar data atual (score neutro para temporal)
    dataOrdem = new Date();
  }
  
  const diasAnteriores = Math.floor((new Date().getTime() - dataOrdem.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diasAnteriores <= 30) score += 15; // Muito recente
  else if (diasAnteriores <= 90) score += 10; // Recente
  else if (diasAnteriores <= 180) score += 5; // Moderadamente recente

  // Análise do tipo de serviço (10 pontos)
  const tipoServico = ordem.tipoServico || ordem.servico || '';
  if (tipoServico.toLowerCase().includes('transferencia')) score += 8;
  if (tipoServico.toLowerCase().includes('licenciamento')) score += 6;
  if (tipoServico.toLowerCase().includes('requerimento')) score += 7;

  return Math.min(100, Math.max(0, score));
}

// Função para determinar potencial
function determinarPotencial(score: number, clienteData: any): 'baixo' | 'medio' | 'alto' {
  if (score >= 80) return 'alto';
  if (score >= 60) return 'medio';
  return 'baixo';
}

// Função para extrair valor estimado
function extrairValorEstimado(ordem: any): number {
  let valor = 0;
  
  if (ordem.valor) valor = parseFloat(ordem.valor) || 0;
  if (ordem.valorTotal) valor = Math.max(valor, parseFloat(ordem.valorTotal) || 0);
  if (ordem.preco) valor = Math.max(valor, parseFloat(ordem.preco) || 0);
  if (ordem.custoTotal) valor = Math.max(valor, parseFloat(ordem.custoTotal) || 0);

  // Valor padrão baseado no tipo de serviço
  if (valor === 0) {
    const tipoServico = ordem.tipoServico || ordem.servico || '';
    if (tipoServico.toLowerCase().includes('transferencia')) valor = 350;
    else if (tipoServico.toLowerCase().includes('licenciamento')) valor = 150;
    else if (tipoServico.toLowerCase().includes('requerimento')) valor = 200;
    else valor = 100; // Valor padrão mínimo
  }

  return valor;
}

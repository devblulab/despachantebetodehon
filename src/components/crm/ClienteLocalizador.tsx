import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Tooltip,
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@material-ui/core';
import {
  Search,
  Person,
  Business,
  LocationOn,
  Phone,
  Email,
  Add,
  Edit,
  Delete,
  Visibility,
  Star,
  StarBorder,
  FilterList,
  Sort,
  GetApp,
  Share,
  WhatsApp,
  Assignment,
  TrendingUp,
  AttachMoney,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Refresh,
  Close,
  AccountBox,
  CreditCard,
  Group,
  Bookmark,
  BookmarkBorder,
  NavigateBefore,
  NavigateNext,
  EmojiObjects,
} from '@material-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  doc, 
  query, 
  orderBy, 
  where, 
  serverTimestamp,
  getDocs,
  limit,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/logic/firebase/config/app';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    color: '#ffffff',
  },
  headerSection: {
    marginBottom: theme.spacing(4),
    background: 'rgba(255,255,255,0.1)',
    borderRadius: theme.spacing(3),
    padding: theme.spacing(4),
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  searchSection: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  clientCard: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
    },
  },
  statsCard: {
    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    textAlign: 'center',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(76, 175, 80, 0.3)',
  },
  filterChip: {
    margin: theme.spacing(0.5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.3)',
    },
  },
  clientInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  clientAvatar: {
    marginRight: theme.spacing(2),
    width: 50,
    height: 50,
  },
  statusChip: {
    fontWeight: 'bold',
    fontSize: '0.75rem',
  },
  actionButton: {
    margin: theme.spacing(0.5),
    minWidth: 40,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  formField: {
    marginBottom: theme.spacing(2),
    '& .MuiInputBase-root': {
      color: '#ffffff',
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255,255,255,0.7)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.3)',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.5)',
    },
  },
  tableContainer: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: theme.spacing(2),
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  tableHeader: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    '& .MuiTableCell-head': {
      color: '#ffffff',
      fontWeight: 'bold',
    },
  },
  tableRow: {
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    '& .MuiTableCell-root': {
      color: '#ffffff',
      borderColor: 'rgba(255,255,255,0.1)',
    },
  },
  detailsDialog: {
    '& .MuiDialog-paper': {
      background: 'linear-gradient(135deg, #1a4d3a 0%, #2d5a3d 100%)',
      color: '#ffffff',
      borderRadius: theme.spacing(2),
      minWidth: '600px',
    },
  },
  highScoreBar: {
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#4CAF50',
    },
  },
  mediumScoreBar: {
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#FF9800',
    },
  },
  lowScoreBar: {
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#F44336',
    },
  },
}));

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  documento: string; // CPF ou CNPJ
  tipoDocumento: 'CPF' | 'CNPJ';
  tipoCliente: 'PF' | 'PJ';
  endereco: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
  empresa?: string;
  status: 'ativo' | 'inativo' | 'pendente' | 'bloqueado';
  score: number;
  ultimaInteracao: Date;
  servicos: string[];
  valorTotal: number;
  observacoes?: string;
  favorito: boolean;
  dataCriacao: Date;
  frequenciaUso: number;
  sistemaPatentes: boolean;
}

interface ClienteStats {
  totalClientes: number;
  clientesPF: number;
  clientesPJ: number;
  clientesAtivos: number;
  clientesSistemaPatentes: number;
  valorTotalCarteira: number;
  maiorFrequencia: number;
}

const ClienteLocalizador: React.FC = () => {
  const classes = useStyles();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'PF' | 'PJ'>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [ordenacao, setOrdenacao] = useState<string>('nome');
  const [showOnlyFavoritos, setShowOnlyFavoritos] = useState(false);
  const [showOnlyPatentes, setShowOnlyPatentes] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [newClienteDialogOpen, setNewClienteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stats, setStats] = useState<ClienteStats>({
    totalClientes: 0,
    clientesPF: 0,
    clientesPJ: 0,
    clientesAtivos: 0,
    clientesSistemaPatentes: 0,
    valorTotalCarteira: 0,
    maiorFrequencia: 0,
  });

  const [newCliente, setNewCliente] = useState<Partial<Cliente>>({
    nome: '',
    email: '',
    telefone: '',
    documento: '',
    tipoDocumento: 'CPF',
    tipoCliente: 'PF',
    endereco: {},
    empresa: '',
    status: 'ativo',
    score: 50,
    servicos: [],
    valorTotal: 0,
    observacoes: '',
    favorito: false,
    frequenciaUso: 0,
    sistemaPatentes: false,
  });

  // Estados para prospecção de clientes
  const [prospectosOrdensServico, setProspectosOrdensServico] = useState<any[]>([]);
  const [loadingProspectos, setLoadingProspectos] = useState(false);

  // Estados para paginação dos possíveis clientes
  const [paginaAtualPossiveis, setPaginaAtualPossiveis] = useState(0);
  const [paginaAtualProspectos, setPaginaAtualProspectos] = useState(0);
  const [paginaAtualDocumentos, setPaginaAtualDocumentos] = useState(0);
  const [possiveisClientesCompletos, setPossiveisClientesCompletos] = useState<any[]>([]);
  const [loadingPossiveisClientes, setLoadingPossiveisClientes] = useState(false);

  // Estados para análise IA
  const [loadingAnaliseIA, setLoadingAnaliseIA] = useState(false);
  const [possiveisClientesIA, setPossiveisClientesIA] = useState<any[]>([]);
  const [paginaAtualIA, setPaginaAtualIA] = useState(0);
  const [loadingPossiveisIA, setLoadingPossiveisIA] = useState(false);

  const itemsPorPagina = 8;

  // Função para executar análise IA
  const executarAnaliseIA = async () => {
    try {
      setLoadingAnaliseIA(true);

      const response = await fetch('/api/analisar-possiveis-clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        alert(`🎯 Análise IA Concluída!\n\n📊 Total analisados: ${result.totalAnalisados}\n✅ Novos clientes: ${result.novosClientes}\n🔄 Clientes atualizados: ${result.clientesAtualizados}`);

        // Recarregar possíveis clientes após análise
        await carregarPossiveisClientesIA();
      } else {
        alert(`❌ Erro na análise: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Erro ao executar análise IA:', error);
      alert('❌ Erro ao executar análise IA. Tente novamente.');
    } finally {
      setLoadingAnaliseIA(false);
    }
  };

  // Carregar possíveis clientes da análise IA
  const carregarPossiveisClientesIA = async () => {
    try {
      setLoadingPossiveisIA(true);

      const possiveisSnapshot = await getDocs(collection(db, 'PossiveisClientes'));
      const possiveisArray: any[] = [];

      possiveisSnapshot.forEach((doc) => {
        const data = doc.data();
        possiveisArray.push({
          id: doc.id,
          ...data,
          dataAnalise: data.dataAnalise?.toDate() || new Date(),
          dataCriacao: data.dataCriacao?.toDate() || new Date(),
          ultimaAtualizacao: data.ultimaAtualizacao?.toDate() || new Date()
        });
      });

      // Ordenar por score (maior para menor)
      possiveisArray.sort((a, b) => b.score - a.score);

      console.log(`🤖 Total de possíveis clientes IA encontrados: ${possiveisArray.length}`);

      // Enriquecer automaticamente todos os CPFs que ainda não foram consultados
      console.log(`🔍 Iniciando enriquecimento automático dos CPFs...`);
      const possiveisEnriquecidos = await Promise.all(
        possiveisArray.map(async (cliente) => {
          if (cliente.tipoDocumento === 'CPF' && !cliente.dadosEnriquecidos?.consultaRealizada) {
            console.log(`🔍 Consultando CPF: ${cliente.documento} - ${cliente.nome}`);
            return await enriquecerDadosCPF(cliente);
          }
          return cliente;
        })
      );

      console.log(`✅ Enriquecimento concluído!`);
      setPossiveisClientesIA(possiveisEnriquecidos);

    } catch (error) {
      console.error('❌ Erro ao carregar possíveis clientes IA:', error);
    } finally {
      setLoadingPossiveisIA(false);
    }
  };

  // Função para enriquecer todos os possíveis clientes com dados da API CPF
  const enriquecerTodosPossiveisClientes = async () => {
    try {
      setLoadingPossiveisIA(true);

      const clientesEnriquecidos = await Promise.all(
        possiveisClientesIA.map(async (cliente) => {
          if (cliente.tipoDocumento === 'CPF' && !cliente.dadosEnriquecidos?.consultaRealizada) {
            return await enriquecerDadosCPF(cliente);
          }
          return cliente;
        })
      );

      setPossiveisClientesIA(clientesEnriquecidos);
      alert(`✅ ${clientesEnriquecidos.length} possíveis clientes enriquecidos com dados da API CPF!`);

    } catch (error) {
      console.error('❌ Erro ao enriquecer dados:', error);
      alert('❌ Erro ao enriquecer dados. Tente novamente.');
    } finally {
      setLoadingPossiveisIA(false);
    }
  };

  // Carregar possíveis clientes de todas as coleções do Firebase
  const carregarPossiveisClientesCompletos = async () => {
    try {
      setLoadingPossiveisClientes(true);
      const possiveisMap = new Map<string, any>();
      const clientesExistentesSet = new Set<string>();

      // Primeiro, carregar clientes já cadastrados
      const clientesExistentesSnapshot = await getDocs(collection(db, 'clientes_localizador'));
      clientesExistentesSnapshot.forEach((doc) => {
        const data = doc.data();
        const documento = data.cpf || data.cnpj || data.documento || '';
        const email = data.email || '';
        if (documento) clientesExistentesSet.add(documento.replace(/\D/g, ''));
        if (email) clientesExistentesSet.add(email.toLowerCase());
      });

      // Lista de todas as coleções para buscar possíveis clientes
      const colecoesBusca = [
        'OrdensDeServicoBludata',
        'usuarios',
        'clientes',
        'leads',
        'transferencias',
        'requerimentos',
        'anuencias',
        'documentos_digitais',
        'empresas',
        'documentos_empresariais',
        'processos',
        'atendimentos',
        'vendas',
        'contratos',
        'servicos',
        'pagamentos',
        'financeiro',
        'relatorios',
        'historico',
        'consultas',
        'validacoes',
        'certificacoes',
        'registros'
      ];

      for (const nomeColecao of colecoesBusca) {
        try {
          const snapshot = await getDocs(collection(db, nomeColecao));

          snapshot.forEach((doc) => {
            const data = doc.data();

            // Extrair informações básicas
            const nome = data.nome || data.nomeCompleto || data.razaoSocial || data.cliente || data.comprador?.nome || data.vendedor?.nome || '';
            const email = data.email || data.emailCliente || data.comprador?.email || data.vendedor?.email || '';
            const telefone = data.telefone || data.celular || data.whatsapp || data.comprador?.telefone || data.vendedor?.telefone || '';

            // Buscar CPF e CNPJ em vários campos
            const cpf = data.cpf || data.documento || data.cpfCliente || data.comprador?.cpf || data.vendedor?.cpf || '';
            const cnpj = data.cnpj || data.cnpjCliente || data.comprador?.cnpj || data.vendedor?.cnpj || '';
            const documento = cnpj || cpf || '';

            // Extrair endereço
            const endereco = data.endereco || data.comprador?.endereco || data.vendedor?.endereco || {};
            const cep = data.cep || endereco.cep || '';
            const cidade = data.cidade || endereco.cidade || endereco.municipio || '';
            const estado = data.estado || endereco.estado || endereco.uf || '';
            const logradouro = data.logradouro || endereco.logradouro || endereco.rua || '';
            const bairro = data.bairro || endereco.bairro || '';
            const numero = data.numero || endereco.numero || '';

            // Só processar se tiver pelo menos nome e documento
            if (nome && documento) {
              const docLimpo = documento.replace(/\D/g, '');

              // Verificar se já é cliente cadastrado
              const jaECliente = clientesExistentesSet.has(docLimpo) || 
                                (email && clientesExistentesSet.has(email.toLowerCase()));

              // Só adicionar se NÃO for cliente existente
              if (!jaECliente && docLimpo.length >= 11) {
                // Determinar tipo
                const tipoDocumento = docLimpo.length === 14 ? 'CNPJ' : 'CPF';
                const tipoCliente = tipoDocumento === 'CNPJ' ? 'PJ' : 'PF';

                // Chave única
                const chave = `${nome.toLowerCase().trim()}-${docLimpo}`;

                if (!possiveisMap.has(chave)) {
                  const score = calcularScorePossivelCliente(data, nomeColecao);
                  const potencial = determinarPotencialPossivelCliente(data, tipoCliente);

                  const possivelCliente = {
                    id: `possivel_${doc.id}_${nomeColecao}`,
                    nome: nome.trim(),
                    documento: documento,
                    tipoDocumento,
                    tipoCliente,
                    email: email || 'Email não informado',
                    telefone: telefone || 'Telefone não informado',
                    endereco: {
                      cep: cep,
                      logradouro: logradouro,
                      numero: numero,
                      bairro: bairro,
                      cidade: cidade,
                      estado: estado
                    },
                    empresa: tipoCliente === 'PJ' ? nome : (data.empresa || ''),
                    origem: `Encontrado em: ${nomeColecao}`,
                    score: score,
                    potencial: potencial,
                    valorEstimado: extrairValorEstimado(data),
                    dataEncontrado: data.dataCriacao?.toDate() || data.dataAtualizacao?.toDate() || new Date(),
                    observacoes: `Identificado automaticamente na coleção ${nomeColecao}`
                  };

                  possiveisMap.set(chave, possivelCliente);
                } else {
                  // Se já existe, atualizar informações agregadas
                  const existente = possiveisMap.get(chave)!;
                  existente.origem += ` | ${nomeColecao}`;
                  existente.score = Math.min(100, existente.score + 5);

                  // Atualizar dados se estiverem vazios
                  if (existente.email === 'Email não informado' && email) {
                    existente.email = email;
                  }
                  if (existente.telefone === 'Telefone não informado' && telefone) {
                    existente.telefone = telefone;
                  }
                  if (!existente.endereco.cep && cep) {
                    existente.endereco.cep = cep;
                  }
                }
              }
            }
          });
        } catch (error) {
          console.warn(`Erro ao buscar na coleção ${nomeColecao}:`, error);
        }
      }

      const possiveisArray = Array.from(possiveisMap.values())
        .sort((a, b) => b.score - a.score); // Ordenar por score

      console.log(`🎯 Total de possíveis clientes encontrados: ${possiveisArray.length}`);
      setPossiveisClientesCompletos(possiveisArray);
      setLoadingPossiveisClientes(false);

    } catch (error) {
      console.error('Erro ao carregar possíveis clientes:', error);
      setLoadingPossiveisClientes(false);
    }
  };

  // Função para calcular score do possível cliente
  const calcularScorePossivelCliente = (data: any, colecao: string): number => {
    let score = 60; // Score base

    if (data.nome) score += 10;
    if (data.email) score += 10;
    if (data.telefone || data.celular) score += 10;
    if (data.endereco || data.cep) score += 5;
    if (data.cnpj) score += 15; // PJ tem score maior
    if (data.empresa) score += 5;

    // Score adicional baseado na coleção
    const scoreColecao: { [key: string]: number } = {
      'OrdensDeServicoBludata': 20,
      'transferencias': 15,
      'requerimentos': 15,
      'anuencias': 12,
      'empresas': 10,
      'processos': 8,
      'vendas': 8,
      'contratos': 7,
      'servicos': 5
    };

    score += scoreColecao[colecao] || 3;

    return Math.min(95, score);
  };

  // Função para determinar potencial do possível cliente
  const determinarPotencialPossivelCliente = (data: any, tipoCliente: string): 'alto' | 'medio' | 'baixo' => {
    const valor = extrairValorEstimado(data);
    const temCNPJ = tipoCliente === 'PJ';
    const temEndereco = data.endereco || data.cep;
    const temContato = data.email || data.telefone;

    if (temCNPJ && valor > 1000 && temEndereco && temContato) return 'alto';
    if ((valor > 500 || temCNPJ) && (temEndereco || temContato)) return 'medio';
    return 'baixo';
  };

  // Função para extrair valor estimado
  const extrairValorEstimado = (data: any): number => {
    const campos = ['valor', 'valorTotal', 'preco', 'custoTotal', 'valorServico', 'valorContrato'];
    for (const campo of campos) {
      if (data[campo] && !isNaN(parseFloat(data[campo]))) {
        return parseFloat(data[campo]);
      }
    }
    return 0;
  };

  // Função para buscar prospectos automaticamente
  const buscarProspectosAutomaticos = async () => {
    try {
      setLoading(true);
      const prospectosEncontrados: Cliente[] = [];
      const clientesExistentesSet = new Set<string>();

      // Carregar clientes já cadastrados para evitar duplicatas
      const clientesExistentesSnapshot = await getDocs(collection(db, 'clientes_localizador'));
      clientesExistentesSnapshot.forEach((doc) => {
        const data = doc.data();
        const documento = data.cpf || data.cnpj || data.documento || '';
        const email = data.email || '';
        if (documento) clientesExistentesSet.add(documento.replace(/\D/g, ''));
        if (email) clientesExistentesSet.add(email.toLowerCase());
      });

      // Lista de coleções para buscar prospectos
      const colecoesProspectos = [
        'leads',
        'transferencias',
        'requerimentos',
        'anuencias',
        'documentos_digitais',
        'empresas',
        'documentos_empresariais'
      ];

      for (const nomeColecao of colecoesProspectos) {
        try {
          const snapshot = await getDocs(collection(db, nomeColecao));

          snapshot.forEach((doc) => {
            const data = doc.data();

            // Extrair informações básicas
            const nome = data.nome || data.nomeCompleto || data.razaoSocial || data.cliente || '';
            const email = data.email || data.emailCliente || '';
            const telefone = data.telefone || data.celular || data.whatsapp || '';
            const documento = data.cpf || data.cnpj || data.documento || '';

            // Determinar tipo de documento
            let tipoDocumento: 'CPF' | 'CNPJ' = 'CPF';
            let tipoCliente: 'PF' | 'PJ' = 'PF';

            if (documento) {
              const docLimpo = documento.replace(/\D/g, '');
              if (docLimpo.length === 14) {
                tipoDocumento = 'CNPJ';
                tipoCliente = 'PJ';
              }

              // Verificar se já é cliente cadastrado
              const jaECliente = clientesExistentesSet.has(docLimpo) || 
                                (email && clientesExistentesSet.has(email.toLowerCase()));

              // Adicionar se NÃO for cliente existente e tiver os requisitos mínimos
              if (!jaECliente && nome && (email || telefone) && docLimpo.length >= 11) {
                // Criar objeto de prospecto
                const prospecto: Cliente = {
                  id: `prospecto_${doc.id}_${nomeColecao}`,
                  nome: nome.trim(),
                  email: email || 'Email não informado',
                  telefone: telefone || 'Telefone não informado',
                  documento: documento,
                  tipoDocumento,
                  tipoCliente,
                  endereco: {
                    cep: data.cep || data.endereco?.cep || '',
                    logradouro: data.logradouro || data.endereco?.logradouro || data.endereco?.rua || '',
                    numero: data.numero || data.endereco?.numero || '',
                    bairro: data.bairro || data.endereco?.bairro || '',
                    cidade: data.cidade || data.endereco?.cidade || '',
                    estado: data.estado || data.endereco?.estado || data.endereco?.uf || ''
                  },
                  empresa: tipoCliente === 'PJ' ? nome : (data.empresa || ''),
                  status: 'pendente',
                  score: calcularScoreProspectoAutomatico(data, nomeColecao),
                  ultimaInteracao: data.dataAtualizacao?.toDate() || data.dataCriacao?.toDate() || new Date(),
                  servicos: extrairServicos(data, nomeColecao),
                  valorTotal: extrairValorTotal(data, nomeColecao),
                  observacoes: `Identificado como prospecto em: ${nomeColecao}`,
                  favorito: false,
                  dataCriacao: data.dataCriacao?.toDate() || new Date(),
                  frequenciaUso: 0,
                  sistemaPatentes: verificarSistemaPatentes(data, nomeColecao)
                };

                prospectosEncontrados.push(prospecto);
              }
            }
          });
        } catch (error) {
          console.warn(`Erro ao buscar prospectos na coleção ${nomeColecao}:`, error);
        }
      }

      console.log(`🎯 Total de prospectos encontrados automaticamente: ${prospectosEncontrados.length}`);

      // Atualizar estado de clientes com os novos prospectos
      setClientes(prevClientes => [...prevClientes, ...prospectosEncontrados]);

    } catch (error) {
      console.error('Erro ao buscar prospectos automaticamente:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para calcular score de prospecto automático
  const calcularScoreProspectoAutomatico = (data: any, colecao: string): number => {
    let score = 40; // Score base para prospectos automáticos

    if (data.nome || data.nomeCompleto) score += 10;
    if (data.email) score += 10;
    if (data.telefone || data.celular) score += 10;
    if (data.cpf || data.cnpj) score += 10;
    if (data.endereco || data.cep) score += 5;

    // Pontuação por coleção (indica potencial)
    switch (colecao) {
      case 'leads':
        score += 15;
        break;
      case 'transferencias':
      case 'requerimentos':
        score += 10;
        break;
      default:
        score += 5;
        break;
    }

    return Math.min(85, score); // Máximo 85 para prospectos automáticos
  };

  // Função para carregar todos os clientes de múltiplas coleções do Firebase
  const carregarTodosClientes = async () => {
    try {
      setLoading(true);
      const clientesUnificados: Cliente[] = [];
      const clientesMap = new Map<string, Cliente>(); // Para evitar duplicatas
      const clientesExistentesSet = new Set<string>(); // Para identificar clientes já cadastrados

      // Lista de coleções para buscar clientes
      const colecoes = [
        'clientes_localizador',
        'clientes',
        'usuarios',
        'leads',
        'transferencias',
        'requerimentos',
        'anuencias',
        'documentos_digitais',
        'empresas',
        'documentos_empresariais'
      ];

      // Primeiro, carregar APENAS clientes REAIS já cadastrados (não usuários do sistema)
      const clientesReaisSnapshot = await getDocs(collection(db, 'clientes_localizador'));
      clientesReaisSnapshot.forEach((doc) => {
        const data = doc.data();
        const documento = data.cpf || data.cnpj || data.documento || '';
        const email = data.email || '';
        if (documento) clientesExistentesSet.add(documento.replace(/\D/g, ''));
        if (email) clientesExistentesSet.add(email.toLowerCase());
      });

      // Buscar em cada coleção
      for (const nomeColecao of colecoes) {
        try {
          const snapshot = await getDocs(collection(db, nomeColecao));

          snapshot.forEach((doc) => {
            const data = doc.data();

            // Extrair informações do cliente baseado no tipo de documento
            let clienteInfo: Partial<Cliente> = {};

            // Identificar campos comuns independente da coleção
            const nome = data.nome || data.nomeCompleto || data.razaoSocial || data.cliente || '';
            const email = data.email || data.emailCliente || '';
            const telefone = data.telefone || data.celular || data.whatsapp || '';
            const documento = data.cpf || data.cnpj || data.documento || '';

            // Determinar tipo de documento e cliente
            let tipoDocumento: 'CPF' | 'CNPJ' = 'CPF';
            let tipoCliente: 'PF' | 'PJ' = 'PF';

            if (documento) {
              const docLimpo = documento.replace(/\D/g, '');
              if (docLimpo.length === 14) {
                tipoDocumento = 'CNPJ';
                tipoCliente = 'PJ';
              }
            }

            // Só adicionar se tiver pelo menos nome ou email
            if (nome || email) {
              // Criar uma chave composta para evitar duplicatas de dados similares
              const chaveDados = `${nome.toLowerCase()}-${email.toLowerCase()}-${documento}`;

              if (!clientesMap.has(chaveDados)) {
                // Verificar se é cliente REAL (apenas da coleção clientes_localizador)
                const ehClienteReal = nomeColecao === 'clientes_localizador';

                // Calcular score baseado no tipo
                let scoreBase = calcularScore(data, nomeColecao);
                if (ehClienteReal) {
                  scoreBase += 20; // Bonus por ser cliente real
                }

                // Determinar status baseado no tipo
                let statusCliente = determinarStatus(data, nomeColecao);
                if (ehClienteReal) {
                  statusCliente = 'ativo'; // Clientes reais são sempre ativos
                }

                clienteInfo = {
                  id: doc.id,
                  nome: nome || 'Nome não informado',
                  email: email || 'Email não informado',
                  telefone: telefone || 'Telefone não informado',
                  documento: documento || 'Documento não informado',
                  tipoDocumento,
                  tipoCliente,
                  endereco: {
                    cep: data.cep || data.endereco?.cep || '',
                    logradouro: data.logradouro || data.endereco?.logradouro || data.endereco?.rua || '',
                    numero: data.numero || data.endereco?.numero || '',
                    bairro: data.bairro || data.endereco?.bairro || '',
                    cidade: data.cidade || data.endereco?.cidade || '',
                    estado: data.estado || data.endereco?.estado || data.endereco?.uf || ''
                  },
                  empresa: data.empresa || data.razaoSocial || (tipoCliente === 'PJ' ? nome : ''),
                  status: statusCliente,
                  score: Math.min(100, scoreBase),
                  ultimaInteracao: data.ultimaInteracao?.toDate() || data.dataAtualizacao?.toDate() || data.dataCriacao?.toDate() || new Date(),
                  servicos: extrairServicos(data, nomeColecao),
                  valorTotal: extrairValorTotal(data, nomeColecao),
                  observacoes: ehClienteReal ? 
                    `CLIENTE REAL - ${data.observacoes || data.observacao || 'Encontrado na coleção clientes_localizador'}` : 
                    data.observacoes || data.observacao || `Prospecto identificado em: ${nomeColecao}`,
                  favorito: data.favorito || ehClienteReal, // Marcar como favorito se é cliente real
                  dataCriacao: data.dataCriacao?.toDate() || new Date(),
                  frequenciaUso: calcularFrequenciaUso(data, nomeColecao) + (ehClienteReal ? 1 : 0),
                  sistemaPatentes: verificarSistemaPatentes(data, nomeColecao)
                };

                clientesMap.set(chaveDados, clienteInfo as Cliente);
              } else {
                // Se já existe, apenas atualizar alguns dados (frequência, serviços, valor)
                const clienteExistente = clientesMap.get(chaveDados)!;
                const novosServicos = extrairServicos(data, nomeColecao);
                const novoValor = extrairValorTotal(data, nomeColecao);

                // Atualizar dados agregados
                clienteExistente.servicos = Array.from(new Set([...clienteExistente.servicos, ...novosServicos]));
                clienteExistente.valorTotal += novoValor;
                clienteExistente.frequenciaUso += 1;
                clienteExistente.score = Math.min(100, clienteExistente.score + 5); // Bonus por aparecer em múltiplas fontes

                // Atualizar observações
                if (clienteExistente.observacoes && !clienteExistente.observacoes.includes(nomeColecao)) {
                  clienteExistente.observacoes += ` | Também encontrado em: ${nomeColecao}`;
                }
              }
            }
          });
        } catch (error) {
          console.warn(`Erro ao buscar na coleção ${nomeColecao}:`, error);
        }
      }

      // Converter Map para Array
      const clientesArray = Array.from(clientesMap.values());

      console.log(`📊 Total de clientes únicos encontrados: ${clientesArray.length}`);
      console.log(`🔄 Clientes já cadastrados identificados: ${clientesExistentesSet.size}`);

      setClientes(clientesArray);
      calculateStats(clientesArray);
      setLoading(false);

    } catch (error) {
      console.error('Erro ao carregar clientes de múltiplas coleções:', error);
      setLoading(false);
    }
  };

  // Carregar clientes de múltiplas coleções do Firebase
  useEffect(() => {
    carregarTodosClientes();
    carregarProspectosOrdensServico();
    buscarProspectosAutomaticos();
    carregarPossiveisClientesIA();
  }, []);

  // Carregar prospectos da coleção OrdensDeServicoBludata
  const carregarProspectosOrdensServico = async () => {
    try {
      setLoadingProspectos(true);
      const ordensSnapshot = await getDocs(collection(db, 'OrdensDeServicoBludata'));
      const prospectosMap = new Map<string, any>();

      // Primeiro, criar conjunto de clientes já cadastrados
      const clientesExistentes = new Set<string>();
      clientes.forEach(cliente => {
        if (cliente.documento) clientesExistentes.add(cliente.documento.replace(/\D/g, ''));
        if (cliente.email) clientesExistentes.add(cliente.email.toLowerCase());
      });

      ordensSnapshot.forEach((doc) => {
        const data = doc.data();

        // Extrair dados relevantes
        const nome = data.nome || data.nomeCompleto || data.razaoSocial || '';
        const cpf = data.cpf || data.documento || '';
        const cnpj = data.cnpj || '';
        const email = data.email || data.emailCliente || '';
        const telefone = data.telefone || data.celular || data.whatsapp || '';
        const endereco = data.endereco || {};
        const cep = data.cep || endereco.cep || '';

        // Determinar documento principal
        const documentoPrincipal = cnpj || cpf;
        const tipoDocumento = cnpj ? 'CNPJ' : 'CPF';
        const tipoCliente = cnpj ? 'PJ' : 'PF';

        // Só adicionar se tiver pelo menos nome e documento
        if (nome && documentoPrincipal) {
          const docLimpo = documentoPrincipal.replace(/\D/g, '');

          // Verificar se já é cliente cadastrado
          const jaECliente = clientesExistentes.has(docLimpo) || 
                            (email && clientesExistentes.has(email.toLowerCase()));

          // Só adicionar se NÃO for cliente existente
          if (!jaECliente) {
            const chave = `${nome.toLowerCase()}-${docLimpo}`;

            if (!prospectosMap.has(chave)) {
              const prospecto = {
                id: doc.id,
                nome: nome,
                documento: documentoPrincipal,
                tipoDocumento,
                tipoCliente,
                email: email || 'Email não informado',
                telefone: telefone || 'Telefone não informado',
                endereco: {
                  cep: cep,
                  logradouro: endereco.logradouro || endereco.rua || '',
                  numero: endereco.numero || '',
                  bairro: endereco.bairro || '',
                  cidade: endereco.cidade || '',
                  estado: endereco.estado || endereco.uf || ''
                },
                empresa: tipoCliente === 'PJ' ? nome : (data.empresa || ''),
                valorServico: data.valor || data.valorTotal || 0,
                dataServico: data.dataSolicitacao?.toDate() || data.dataAtualizacao?.toDate() || new Date(),
                tipoServico: data.tipoServico || 'Ordem de Serviço',
                status: data.status || 'ativo',
                observacoes: `Prospecto identificado em Ordem de Serviço - ${data.tipoServico || 'Serviço não especificado'}`,
                score: calcularScoreProspecto(data),
                potencial: determinarPotencialProspecto(data)
              };

              prospectosMap.set(chave, prospecto);
            }
          }
        }
      });

      const prospectosArray = Array.from(prospectosMap.values());
      console.log(`🎯 Total de prospectos encontrados em OrdensDeServicoBludata: ${prospectosArray.length}`);
      setProspectosOrdensServico(prospectosArray);
      setLoadingProspectos(false);

    } catch (error) {
      console.error('Erro ao carregar prospectos das ordens de serviço:', error);
      setLoadingProspectos(false);
    }
  };

  // Função para calcular score do prospecto
  const calcularScoreProspecto = (data: any): number => {
    let score = 60; // Score base para prospectos

    if (data.nome) score += 10;
    if (data.email) score += 10;
    if (data.telefone || data.celular) score += 10;
    if (data.endereco || data.cep) score += 5;
    if (data.valor && data.valor > 0) score += 10;
    if (data.cnpj) score += 15; // PJ tem score maior

    return Math.min(95, score); // Máximo 95 para prospectos
  };

  // Função para determinar potencial do prospecto
  const determinarPotencialProspecto = (data: any): 'alto' | 'medio' | 'baixo' => {
    const valor = data.valor || data.valorTotal || 0;
    const temCNPJ = data.cnpj && data.cnpj.length > 0;

    if (temCNPJ && valor > 1000) return 'alto';
    if (valor > 500 || temCNPJ) return 'medio';
    return 'baixo';
  };

  // Componente de Paginação
  const ComponentePaginacao = ({ 
    paginaAtual, 
    setPagina, 
    totalItens, 
    label 
  }: { 
    paginaAtual: number; 
    setPagina: (page: number) => void; 
    totalItens: number; 
    label: string;
  }) => {
    const totalPaginas = Math.ceil(totalItens / itemsPorPagina);

    if (totalPaginas <= 1) return null;

    return (
      <Box display="flex" justifyContent="center" alignItems="center" marginTop={2} style={{ gap: 2 }}>
        <IconButton
          onClick={() => setPagina(Math.max(0, paginaAtual - 1))}
          disabled={paginaAtual === 0}
          style={{ color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <NavigateBefore />
        </IconButton>

        <Typography variant="body2" style={{ color: '#fff' }}>
          {label}: Página {paginaAtual + 1} de {totalPaginas} ({totalItens} itens)
        </Typography>

        <IconButton
          onClick={() => setPagina(Math.min(totalPaginas - 1, paginaAtual + 1))}
          disabled={paginaAtual >= totalPaginas - 1}
          style={{ color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <NavigateNext />
        </IconButton>
      </Box>
    );
  };

  // Função para converter possível cliente em cliente real
  const adicionarPossivelClienteComoCliente = async (possivelCliente: any) => {
    try {
      const novoCliente: Partial<Cliente> = {
        nome: possivelCliente.nome,
        email: possivelCliente.email,
        telefone: possivelCliente.telefone,
        documento: possivelCliente.documento,
        tipoDocumento: possivelCliente.tipoDocumento,
        tipoCliente: possivelCliente.tipoCliente,
        endereco: possivelCliente.endereco,
        empresa: possivelCliente.nome,
        status: 'ativo',
        score: possivelCliente.score,
        servicos: ['Transferência de Propriedade'],
        valorTotal: 350, // Valor padrão para transferência
        observacoes: `Identificado em: ${possivelCliente.origem} | Tipo: ${possivelCliente.tipo}`,
        favorito: false,
        frequenciaUso: 1,
        sistemaPatentes: false,
        dataCriacao: new Date(),
        ultimaInteracao: new Date(),
      };

      await addDoc(collection(db, 'clientes_localizador'), novoCliente);

      alert('Cliente adicionado com sucesso!');

      // Recarregar a página para mostrar o novo cliente
      window.location.reload();
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      alert('Erro ao adicionar cliente');
    }
  };

  // Função para consultar CPF na API
  const consultarDadosCPF = async (cpf: string) => {
    try {
      const response = await fetch(`/api/cpf?cpf=${cpf}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.warn(`Erro ao consultar CPF ${cpf}:`, error);
    }
    return null;
  };

  // Função para enriquecer dados do possível cliente com API CPF
  const enriquecerDadosCPF = async (possivelCliente: any) => {
    if (possivelCliente.tipoDocumento === 'CPF' && possivelCliente.documento) {
      const cpfLimpo = possivelCliente.documento.replace(/\D/g, '');
      if (cpfLimpo.length === 11) {
        const dadosCPF = await consultarDadosCPF(cpfLimpo);
        if (dadosCPF && dadosCPF.success) {
          return {
            ...possivelCliente,
            dadosEnriquecidos: {
              cpfCompleto: dadosCPF.cpf,
              nomeVerificado: dadosCPF.nome,
              genero: dadosCPF.genero,
              dataNascimento: dadosCPF.nascimento,
              consultaRealizada: true,
              statusConsulta: 'sucesso'
            }
          };
        } else {
          return {
            ...possivelCliente,
            dadosEnriquecidos: {
              consultaRealizada: true,
              statusConsulta: 'erro',
              erro: dadosCPF?.error || 'CPF não encontrado'
            }
          };
        }
      }
    }
    return possivelCliente;
  };

  // Converter possível cliente IA em cliente real
  const adicionarPossivelClienteIAComoCliente = async (possivelCliente: any) => {
    try {
      const novoCliente: Partial<Cliente> = {
        nome: possivelCliente.nome,
        email: possivelCliente.email || 'Email não informado',
        telefone: possivelCliente.telefone || 'Telefone não informado',
        documento: possivelCliente.documento,
        tipoDocumento: possivelCliente.tipoDocumento,
        tipoCliente: possivelCliente.tipoCliente,
        endereco: possivelCliente.endereco,
        empresa: possivelCliente.tipoCliente === 'PJ' ? possivelCliente.nome : '',
        status: 'ativo',
        score: possivelCliente.score,
        servicos: ['Identificado por IA'],
        valorTotal: possivelCliente.valorEstimado || 0,
        observacoes: `CONVERTIDO DE IA - Score: ${possivelCliente.score}% | Potencial: ${possivelCliente.potencial} | ${possivelCliente.observacoes?.join(' | ') || ''}`,
        favorito: possivelCliente.potencial === 'alto',
        frequenciaUso: possivelCliente.frequenciaInteracao || 1,
        sistemaPatentes: false,
        dataCriacao: new Date(),
        ultimaInteracao: new Date(),
      };

      await addDoc(collection(db, 'clientes_localizador'), novoCliente);

      // Remover da lista de possíveis clientes IA
      setPossiveisClientesIA(prev => 
        prev.filter(p => p.id !== possivelCliente.id)
      );

      alert(`✅ Cliente "${possivelCliente.nome}" adicionado com sucesso!\n🎯 Score: ${possivelCliente.score}%\n💎 Potencial: ${possivelCliente.potencial.toUpperCase()}`);

      // Recarregar clientes
      await carregarTodosClientes();

    } catch (error) {
      console.error('❌ Erro ao adicionar possível cliente IA como cliente:', error);
      alert('❌ Erro ao adicionar cliente. Tente novamente.');
    }
  };

  // Adicionar TODOS os possíveis clientes IA como clientes
  const adicionarTodosPossiveisClientesIA = async () => {
    const confirmacao = window.confirm(`🚀 Tem certeza que deseja adicionar TODOS os ${possiveisClientesIA.length} possíveis clientes como clientes reais?\n\nEsta ação não pode ser desfeita.`);

    if (!confirmacao) return;

    try {
      setLoadingPossiveisIA(true);
      let adicionados = 0;
      let erros = 0;

      for (const possivelCliente of possiveisClientesIA) {
        try {
          const novoCliente: Partial<Cliente> = {
            nome: possivelCliente.nome,
            email: possivelCliente.email || 'Email não informado',
            telefone: possivelCliente.telefone || 'Telefone não informado',
            documento: possivelCliente.documento,
            tipoDocumento: possivelCliente.tipoDocumento,
            tipoCliente: possivelCliente.tipoCliente,
            endereco: possivelCliente.endereco,
            empresa: possivelCliente.tipoCliente === 'PJ' ? possivelCliente.nome : '',
            status: 'ativo',
            score: possivelCliente.score,
            servicos: ['Migração em massa - IA'],
            valorTotal: possivelCliente.valorEstimado || 0,
            observacoes: `MIGRAÇÃO EM MASSA - Score: ${possivelCliente.score}% | Potencial: ${possivelCliente.potencial}`,
            favorito: possivelCliente.potencial === 'alto',
            frequenciaUso: possivelCliente.frequenciaInteracao || 1,
            sistemaPatentes: false,
            dataCriacao: new Date(),
            ultimaInteracao: new Date(),
          };

          await addDoc(collection(db, 'clientes_localizador'), novoCliente);
          adicionados++;
        } catch (error) {
          console.error(`❌ Erro ao adicionar ${possivelCliente.nome}:`, error);
          erros++;
        }
      }

      // Limpar lista de possíveis clientes IA
      setPossiveisClientesIA([]);

      alert(`🎉 Migração concluída!\n✅ ${adicionados} clientes adicionados\n❌ ${erros} erros\n\nTodos os possíveis clientes foram convertidos em clientes reais.`);

      // Recarregar clientes
      await carregarTodosClientes();

    } catch (error) {
      console.error('❌ Erro na migração em massa:', error);
      alert('❌ Erro na migração em massa. Tente novamente.');
    } finally {
      setLoadingPossiveisIA(false);
    }
  };

  // Converter prospecto em cliente
  const adicionarProspectoComoCliente = async (prospecto: any) => {
    try {
      const novoCliente: Partial<Cliente> = {
        nome: prospecto.nome,
        email: prospecto.email,
        telefone: prospecto.telefone,
        documento: prospecto.documento,
        tipoDocumento: prospecto.tipoDocumento,
        tipoCliente: prospecto.tipoCliente,
        endereco: prospecto.endereco,
        empresa: prospecto.empresa,
        status: 'ativo',
        score: prospecto.score,
        servicos: [prospecto.tipoServico],
        valorTotal: prospecto.valorServico,
        observacoes: prospecto.observacoes + ' | Convertido de prospecto',
        favorito: false,
        frequenciaUso: 1,
        sistemaPatentes: false,
        dataCriacao: new Date(),
        ultimaInteracao: new Date(),
      };

      await addDoc(collection(db, 'clientes_localizador'), novoCliente);

      // Remover da lista de prospectos
      setProspectosOrdensServico(prev => 
        prev.filter(p => p.id !== prospecto.id)
      );

      alert('Prospecto adicionado como cliente com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar prospecto como cliente:', error);
      alert('Erro ao adicionar prospecto como cliente');
    }
  };

  // Função para determinar status baseado na coleção
  const determinarStatus = (data: any, colecao: string): Cliente['status'] => {
    if (data.ativo === false) return 'inativo';
    if (data.status) {
      const status = data.status.toLowerCase();
      if (status.includes('ativo') || status.includes('aprovado') || status.includes('concluído')) return 'ativo';
      if (status.includes('pendente') || status.includes('aguard')) return 'pendente';
      if (status.includes('bloq') || status.includes('cancel') || status.includes('rejeit')) return 'bloqueado';
    }

    // Status baseado na coleção
    switch (colecao) {
      case 'leads':
        return 'pendente';
      case 'clientes':
      case 'usuarios':
        return 'ativo';
      default:
        return data.ativo !== false ? 'ativo' : 'inativo';
    }
  };

  // Função para calcular score baseado nos dados
  const calcularScore = (data: any, colecao: string): number => {
    let score = 50; // Score base

    // Pontuação por dados completos
    if (data.nome || data.nomeCompleto) score += 10;
    if (data.email) score += 10;
    if (data.telefone || data.celular) score += 10;
    if (data.cpf || data.cnpj) score += 10;
    if (data.endereco || data.cep) score += 5;

    // Pontuação por atividade
    if (data.ultimaInteracao || data.dataAtualizacao) score += 5;

    // Pontuação por coleção (indica engajamento)
    switch (colecao) {
      case 'clientes':
      case 'usuarios':
        score += 20;
        break;
      case 'transferencias':
      case 'requerimentos':
        score += 15;
        break;
      case 'leads':
        score += 5;
        break;
    }

    return Math.min(100, Math.max(0, score));
  };

  // Função para extrair serviços utilizados
  const extrairServicos = (data: any, colecao: string): string[] => {
    const servicos: string[] = [];

    // Baseado na coleção
    switch (colecao) {
      case 'transferencias':
        servicos.push('Transferência de Propriedade');
        break;
      case 'requerimentos':
        servicos.push('Requerimentos');
        break;
      case 'anuencias':
        servicos.push('Anuência');
        break;
      case 'documentos_digitais':
        servicos.push('Documentos Digitais');
        break;
      case 'empresas':
      case 'documentos_empresariais':
        servicos.push('Serviços Empresariais');
        break;
    }

    // Serviços específicos nos dados
    if (data.servicos && Array.isArray(data.servicos)) {
      servicos.push(...data.servicos);
    }
    if (data.tipoServico) servicos.push(data.tipoServico);
    if (data.servico) servicos.push(data.servico);

    return Array.from(new Set(servicos)); // Remove duplicatas
  };

  // Função para extrair valor total
  const extrairValorTotal = (data: any, colecao: string): number => {
    let valor = 0;

    if (data.valor) valor += parseFloat(data.valor) || 0;
    if (data.valorTotal) valor += parseFloat(data.valorTotal) || 0;
    if (data.preco) valor += parseFloat(data.preco) || 0;
    if (data.custoTotal) valor += parseFloat(data.custoTotal) || 0;

    // Valores padrão por serviço
    switch (colecao) {
      case 'transferencias':
        valor = valor || 350;
        break;
      case 'requerimentos':
        valor = valor || 150;
        break;
      case 'anuencias':
        valor = valor || 320;
        break;
      case 'documentos_digitais':
        valor = valor || 80;
        break;
    }

    return valor;
  };

  // Função para calcular frequência de uso
  const calcularFrequenciaUso = (data: any, colecao: string): number => {
    let frequencia = 0;

    if (data.frequenciaUso) return data.frequenciaUso;
    if (data.totalServicos) return data.totalServicos;

    // Frequência baseada na presença em diferentes coleções
    frequencia = 1; // Pelo menos 1 por estar na coleção atual

    return frequencia;
  };

  // Função para verificar se usa sistema de patentes
  const verificarSistemaPatentes = (data: any, colecao: string): boolean => {
    if (data.sistemaPatentes !== undefined) return data.sistemaPatentes;
    if (data.usaPatentes !== undefined) return data.usaPatentes;

    // Verificar por palavras-chave
    const texto = JSON.stringify(data).toLowerCase();
    const palavrasPatentes = ['patente', 'marca', 'registro', 'propriedade intelectual', 'pi'];

    return palavrasPatentes.some(palavra => texto.includes(palavra));
  };

  // Filtrar e pesquisar clientes
  useEffect(() => {
    let filtered = [...clientes];

    // Filtro por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(cliente =>
        cliente.nome.toLowerCase().includes(term) ||
        cliente.email.toLowerCase().includes(term) ||
        cliente.documento.includes(term) ||
        (cliente.empresa && cliente.empresa.toLowerCase().includes(term)) ||
        cliente.telefone.includes(term) ||
        (cliente.endereco.cidade && cliente.endereco.cidade.toLowerCase().includes(term))
      );
    }

    // Filtro por tipo de cliente
    if (filtroTipo !== 'todos') {
      filtered = filtered.filter(cliente => cliente.tipoCliente === filtroTipo);
    }

    // Filtro por status
    if (filtroStatus !== 'todos') {
      filtered = filtered.filter(cliente => cliente.status === filtroStatus);
    }

    // Filtro por favoritos
    if (showOnlyFavoritos) {
      filtered = filtered.filter(cliente => cliente.favorito);
    }

    // Filtro por sistema de patentes
    if (showOnlyPatentes) {
      filtered = filtered.filter(cliente => cliente.sistemaPatentes);
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (ordenacao) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'ultimaInteracao':
          return b.ultimaInteracao.getTime() - a.ultimaInteracao.getTime();
        case 'valorTotal':
          return b.valorTotal - a.valorTotal;
        case 'frequenciaUso':
          return b.frequenciaUso - a.frequenciaUso;
        case 'score':
          return b.score - a.score;
        default:
          return 0;
      }
    });

    setClientesFiltrados(filtered);
  }, [clientes, searchTerm, filtroTipo, filtroStatus, showOnlyFavoritos, showOnlyPatentes, ordenacao]);

  // Calcular estatísticas
  const calculateStats = (clientesData: Cliente[]) => {
    const stats: ClienteStats = {
      totalClientes: clientesData.length,
      clientesPF: clientesData.filter(c => c.tipoCliente === 'PF').length,
      clientesPJ: clientesData.filter(c => c.tipoCliente === 'PJ').length,
      clientesAtivos: clientesData.filter(c => c.status === 'ativo').length,
      clientesSistemaPatentes: clientesData.filter(c => c.sistemaPatentes).length,
      valorTotalCarteira: clientesData.reduce((sum, c) => sum + c.valorTotal, 0),
      maiorFrequencia: Math.max(...clientesData.map(c => c.frequenciaUso), 0),
    };
    setStats(stats);
  };

  // Adicionar novo cliente
  const handleAddCliente = async () => {
    try {
      const clienteData = {
        ...newCliente,
        dataCriacao: new Date(),
        ultimaInteracao: new Date(),
      };

      await addDoc(collection(db, 'clientes_localizador'), clienteData);
      setNewClienteDialogOpen(false);
      resetNewCliente();
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
    }
  };

  // Resetar formulário de novo cliente
  const resetNewCliente = () => {
    setNewCliente({
      nome: '',
      email: '',
      telefone: '',
      documento: '',
      tipoDocumento: 'CPF',
      tipoCliente: 'PF',
      endereco: {},
      empresa: '',
      status: 'ativo',
      score: 50,
      servicos: [],
      valorTotal: 0,
      observacoes: '',
      favorito: false,
      frequenciaUso: 0,
      sistemaPatentes: false,
    });
  };

  // Toggle favorito
  const toggleFavorito = async (clienteId: string, currentFavorito: boolean) => {
    try {
      await updateDoc(doc(db, 'clientes_localizador', clienteId), {
        favorito: !currentFavorito,
        ultimaInteracao: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  // Excluir cliente
  const handleDeleteCliente = async (clienteId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteDoc(doc(db, 'clientes_localizador', clienteId));
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  // Formatar documento
  const formatDocument = (documento: string, tipo: 'CPF' | 'CNPJ') => {
    if (tipo === 'CPF') {
      return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return '#4CAF50';
      case 'inativo': return '#757575';
      case 'pendente': return '#FF9800';
      case 'bloqueado': return '#F44336';
      default: return '#757575';
    }
  };

  // Obter cor do potencial
  const getPotentialColor = (potencial: string) => {
    switch (potencial) {
      case 'alto': return '#4CAF50';
      case 'medio': return '#FF9800';
      case 'baixo': return '#F44336';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress size={60} style={{ color: '#fff' }} />
        <Typography variant="h6" style={{ marginLeft: 16, color: '#fff' }}>
          Carregando clientes...
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Container maxWidth="xl">
        {/* Header com Estatísticas */}
        <div className={classes.headerSection}>
          <Typography variant="h3" style={{ fontWeight: 'bold', marginBottom: 16 }}>
            🔍 Localização de Clientes
          </Typography>
          <Typography variant="h6" style={{ opacity: 0.9, marginBottom: 24 }}>
            Sistema Avançado de Gestão e Localização de Clientes PF e PJ
          </Typography>

          {/* Cards de Estatísticas */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2}>
              <Card className={classes.statsCard}>
                <CardContent>
                  <Typography variant="h4" style={{ fontWeight: 'bold', color: '#4CAF50' }}>
                    {stats.totalClientes}
                  </Typography>
                  <Typography variant="body2">Total de Clientes</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card className={classes.statsCard}>
                <CardContent>
                  <Typography variant="h4" style={{ fontWeight: 'bold', color: '#2196F3' }}>
                    {stats.clientesPF}
                  </Typography>
                  <Typography variant="body2">Pessoas Físicas</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card className={classes.statsCard}>
                <CardContent>
                  <Typography variant="h4" style={{ fontWeight: 'bold', color: '#FF9800' }}>
                    {stats.clientesPJ}
                  </Typography>
                  <Typography variant="body2">Pessoas Jurídicas</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card className={classes.statsCard}>
                <CardContent>
                  <Typography variant="h4" style={{ fontWeight: 'bold', color: '#9C27B0' }}>
                    {stats.clientesSistemaPatentes}
                  </Typography>
                  <Typography variant="body2">Usam Patentes</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card className={classes.statsCard}>
                <CardContent>
                  <Typography variant="h5" style={{ fontWeight: 'bold', color: '#4CAF50' }}>
                    R$ {(stats.valorTotalCarteira / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2">Valor Total</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card className={classes.statsCard}>
                <CardContent>
                  <Typography variant="h4" style={{ fontWeight: 'bold', color: '#F44336' }}>
                    {stats.clientesAtivos}
                  </Typography>
                  <Typography variant="body2">Clientes Ativos</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>

        {/* Seção de Busca e Filtros */}
        <Paper className={classes.searchSection}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar por nome, CPF, CNPJ, empresa, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search style={{ marginRight: 8, color: 'rgba(255,255,255,0.7)' }} />
                }}
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth variant="outlined" className={classes.formField}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value as any)}
                  label="Tipo"
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="PF">Pessoa Física</MenuItem>
                  <MenuItem value="PJ">Pessoa Jurídica</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth variant="outlined" className={classes.formField}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value as string)}
                  label="Status"
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="inativo">Inativo</MenuItem>
                  <MenuItem value="pendente">Pendente</MenuItem>
                  <MenuItem value="bloqueado">Bloqueado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth variant="outlined" className={classes.formField}>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value as string)}
                  label="Ordenar por"
                >
                  <MenuItem value="nome">Nome</MenuItem>
                  <MenuItem value="ultimaInteracao">Última Interação</MenuItem>
                  <MenuItem value="valorTotal">Valor Total</MenuItem>
                  <MenuItem value="frequenciaUso">Frequência de Uso</MenuItem>
                  <MenuItem value="score">Score</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box display="flex" flexDirection="column" style={{ gap: 1}}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showOnlyFavoritos}
                      onChange={(e) => setShowOnlyFavoritos(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Apenas Favoritos"
                  style={{ color: '#ffffff' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={showOnlyPatentes}
                      onChange={(e) => setShowOnlyPatentes(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Sistema Patentes"
                  style={{ color: '#ffffff' }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Chips de filtros ativos */}
          <Box mt={2} display="flex" flexWrap="wrap" style={{ gap: 1}}>
            {searchTerm && (
              <Chip
                label={`Busca: ${searchTerm}`}
                onDelete={() => setSearchTerm('')}
                className={classes.filterChip}
              />
            )}
            {filtroTipo !== 'todos' && (
              <Chip
                label={`Tipo: ${filtroTipo}`}
                onDelete={() => setFiltroTipo('todos')}
                className={classes.filterChip}
              />
            )}
            {filtroStatus !== 'todos' && (
              <Chip
                label={`Status: ${filtroStatus}`}
                onDelete={() => setFiltroStatus('todos')}
                className={classes.filterChip}
              />
            )}
            {showOnlyFavoritos && (
              <Chip
                label="Favoritos"
                onDelete={() => setShowOnlyFavoritos(false)}
                className={classes.filterChip}
              />
            )}
            {showOnlyPatentes && (
              <Chip
                label="Sistema Patentes"
                onDelete={() => setShowOnlyPatentes(false)}
                className={classes.filterChip}
              />
            )}
          </Box>

          {/* Botão Adicionar Cliente */}
          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              🔄 Dados atualizados automaticamente de {clientesFiltrados.length} fontes
            </Typography>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
                style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#ffffff', borderRadius: 20 }}
              >
                Recarregar
              </Button>
              <Button
                variant="contained"
                startIcon={<EmojiObjects />}
                onClick={executarAnaliseIA}
                disabled={loadingAnaliseIA}
                style={{ 
                  background: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
                  color: '#ffffff',
                  borderRadius: 20,
                  marginRight: 8
                }}
              >
                {loadingAnaliseIA ? 'Analisando...' : '🤖 Analisar TODOS com IA'}
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => setNewClienteDialogOpen(true)}
                style={{ borderRadius: 20 }}
              >
                Adicionar Cliente
              </Button>
            </div>
          </Box>
        </Paper>

        {/* Seção de Possíveis Clientes Já Identificados */}
        <Paper style={{ padding: 24, background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)', marginBottom: 32, border: '1px solid rgba(76, 175, 80, 0.3)' }}>
          <Typography variant="h5" style={{ color: '#fff', marginBottom: 16, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            📋 Possíveis Clientes - Já Identificados
            <Chip
              size="small"
              label="CADASTRADOS"
              style={{
                backgroundColor: '#4CAF50',
                color: '#fff',
                marginLeft: 16,
                fontWeight: 'bold'
              }}
            />
          </Typography>
          <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>
            ✅ Possíveis clientes que já foram identificados e estão salvos na base de dados. ({possiveisClientesIA.length} encontrados)
          </Typography>

          {loadingPossiveisIA ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <CircularProgress style={{ color: '#4CAF50' }} />
              <Typography style={{ marginLeft: 16, color: '#fff' }}>
                Carregando possíveis clientes...
              </Typography>
            </div>
          ) : possiveisClientesIA.length > 0 ? (
            <>
              {/* Botões de ação */}
              <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
                <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {possiveisClientesIA.length} possíveis clientes cadastrados | Exibindo 8 por página
                </Typography>
                <Box display="flex" style={{ gap: 1}}>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={enriquecerTodosPossiveisClientes}
                    disabled={loadingPossiveisIA}
                    style={{ 
                      borderColor: '#2196F3',
                      color: '#2196F3',
                      fontWeight: 'bold'
                    }}
                  >
                    🔍 Enriquecer com API CPF
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={adicionarTodosPossiveisClientesIA}
                    disabled={loadingPossiveisIA}
                    style={{ 
                      background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                      color: '#ffffff',
                      fontWeight: 'bold'
                    }}
                  >
                    ➕ Adicionar TODOS como Clientes ({possiveisClientesIA.length})
                  </Button>
                </Box>
              </Box>
              <Grid container spacing={2}>
                {possiveisClientesIA
                  .slice(paginaAtualIA * itemsPorPagina, (paginaAtualIA + 1) * itemsPorPagina)
                  .map((possivelCliente, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={possivelCliente.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card
                      style={{
                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(139, 195, 74, 0.15) 100%)',
                        borderRadius: 16,
                        padding: 16,
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                      }}
                    >
                      {/* Badge de potencial */}
                      <div style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: possivelCliente.potencial === 'alto' ? '#4CAF50' : 
                                   possivelCliente.potencial === 'medio' ? '#FF9800' : '#F44336',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: 12,
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        {possivelCliente.potencial.toUpperCase()}
                      </div>

                      <CardContent style={{ flex: 1, padding: 0 }}>
                        {/* Avatar e Info Principal */}
                        <Box display="flex" alignItems="center" marginBottom={2}>
                          <Avatar
                            style={{
                              backgroundColor: possivelCliente.tipoCliente === 'PF' ? '#4CAF50' : '#8BC34A',
                              width: 50,
                              height: 50,
                              marginRight: 12
                            }}
                          >
                            {possivelCliente.tipoCliente === 'PF' ? <Person /> : <Business />}
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="subtitle1" style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>
                              {possivelCliente.nome}
                            </Typography>
                            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)' }}>
                              {possivelCliente.tipoDocumento}: {possivelCliente.tipoDocumento === 'CNPJ' 
                                ? possivelCliente.documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
                                : possivelCliente.documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                              }
                            </Typography>
                          </Box>
                        </Box>

                        {/* Score com barra de progresso */}
                        <Box marginBottom={2}>
                          <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                            🎯 Score IA: {possivelCliente.score}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={possivelCliente.score} 
                            style={{ 
                              height: 6, 
                              borderRadius: 3, 
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              marginTop: 4
                            }}
                            className={
                              possivelCliente.score >= 80 ? classes.highScoreBar : 
                              possivelCliente.score >= 60 ? classes.mediumScoreBar : classes.lowScoreBar
                            }
                          />
                        </Box>

                        {/* Tipo e Frequência */}
                        <Box display="flex" style={{ gap: 1}} marginBottom={2}>
                          <Chip
                            size="small"
                            label={possivelCliente.tipoCliente}
                            style={{
                              backgroundColor: possivelCliente.tipoCliente === 'PF' ? '#4CAF50' : '#8BC34A',
                              color: '#fff',
                              fontSize: '0.7rem'
                            }}
                          />
                          <Chip
                            size="small"
                            label={`${possivelCliente.frequenciaInteracao}x`}
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              color: '#fff',
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>

                        {/* Informações de Contato */}
                        <Box marginBottom={2}>
                          {possivelCliente.email && (
                            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                              <Email style={{ fontSize: 12, marginRight: 4 }} />
                              {possivelCliente.email}
                            </Typography>
                          )}
                          {possivelCliente.telefone && (
                            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                              <Phone style={{ fontSize: 12, marginRight: 4 }} />
                              {possivelCliente.telefone}
                            </Typography>
                          )}
                          {possivelCliente.endereco.cidade && (
                            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                              <LocationOn style={{ fontSize: 12, marginRight: 4 }} />
                              {possivelCliente.endereco.cidade}, {possivelCliente.endereco.estado}
                            </Typography>
                          )}
                        </Box>

                        {/* Dados Enriquecidos da API CPF */}
                        {possivelCliente.dadosEnriquecidos?.consultaRealizada && (
                          <Box marginBottom={2} style={{ 
                            backgroundColor: possivelCliente.dadosEnriquecidos.statusConsulta === 'sucesso' 
                              ? 'rgba(76, 175, 80, 0.1)' 
                              : 'rgba(244, 67, 54, 0.1)', 
                            padding: 8, 
                            borderRadius: 8,
                            border: `1px solid ${possivelCliente.dadosEnriquecidos.statusConsulta === 'sucesso' 
                              ? 'rgba(76, 175, 80, 0.3)' 
                              : 'rgba(244, 67, 54, 0.3)'}`
                          }}>
                            <Typography variant="caption" style={{ 
                              color: possivelCliente.dadosEnriquecidos.statusConsulta === 'sucesso' ? '#4CAF50' : '#F44336', 
                              fontWeight: 'bold', 
                              marginBottom: 4, 
                              display: 'block' 
                            }}>
                              {possivelCliente.dadosEnriquecidos.statusConsulta === 'sucesso' 
                                ? '✅ Dados Verificados API CPF:' 
                                : '❌ Erro na Consulta CPF:'}
                            </Typography>

                            {possivelCliente.dadosEnriquecidos.statusConsulta === 'sucesso' ? (
                              <>
                                {possivelCliente.dadosEnriquecidos.cpfCompleto && (
                                  <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: 2 }}>
                                    📋 CPF: {possivelCliente.dadosEnriquecidos.cpfCompleto.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                                  </Typography>
                                )}
                                {possivelCliente.dadosEnriquecidos.nomeVerificado && (
                                  <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: 2 }}>
                                    👤 Nome: {possivelCliente.dadosEnriquecidos.nomeVerificado}
                                  </Typography>
                                )}
                                {possivelCliente.dadosEnriquecidos.genero && (
                                  <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: 2 }}>
                                    ⚥ Gênero: {possivelCliente.dadosEnriquecidos.genero === 'M' ? '👨 Masculino' : 
                                              possivelCliente.dadosEnriquecidos.genero === 'F' ? '👩 Feminino' : '⚧ Indefinido/Outro'}
                                  </Typography>
                                )}
                                {possivelCliente.dadosEnriquecidos.dataNascimento && (
                                  <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: 2 }}>
                                    🎂 Nascimento: {new Date(possivelCliente.dadosEnriquecidos.dataNascimento).toLocaleDateString('pt-BR')}
                                  </Typography>
                                )}
                              </>
                            ) : (
                              <Typography variant="caption" style={{ color: '#F44336', display: 'block' }}>
                                {possivelCliente.dadosEnriquecidos.erro || 'Erro desconhecido na consulta'}
                              </Typography>
                            )}
                          </Box>
                        )}

                        {/* Valor Estimado */}
                        {possivelCliente.valorEstimado > 0 && (
                          <Box marginBottom={2}>
                            <Typography variant="caption" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                              💰 R$ {possivelCliente.valorEstimado.toLocaleString()}
                            </Typography>
                          </Box>
                        )}

                        {/* Data da Análise */}
                        <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
                          📅 Cadastrado em: {possivelCliente.dataAnalise?.toLocaleDateString() || 'N/A'}
                        </Typography>

                        {/* Botões de Ação */}
                        <Box display="flex" style={{ gap: 1}} marginTop="auto">
                          <Button
                            size="small"
                            variant="contained"
                            style={{ 
                              background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                              color: '#fff',
                              flex: 1, 
                              fontSize: '0.7rem', 
                              borderRadius: 8 
                            }}
                            onClick={() => adicionarPossivelClienteIAComoCliente(possivelCliente)}
                            startIcon={<Add />}
                          >
                            Adicionar Cliente
                          </Button>
                          {possivelCliente.email && (
                            <IconButton
                              size="small"
                              style={{ color: '#2196F3', backgroundColor: 'rgba(33, 150, 243, 0.1)' }}
                              onClick={() => window.open(`mailto:${possivelCliente.email}`, '_blank')}
                            >
                              <Email />
                            </IconButton>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
              </Grid>

              {/* Paginação para Possíveis Clientes IA */}
              <ComponentePaginacao
                paginaAtual={paginaAtualIA}
                setPagina={setPaginaAtualIA}
                totalItens={possiveisClientesIA.length}
                label="Possíveis Clientes"
              />
            </>
          ) : (
            <Box textAlign="center" padding={4}>
              <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.7)' }}>
                📋 Nenhum possível cliente cadastrado
              </Typography>
              <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Execute a análise IA para identificar e cadastrar possíveis clientes
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Seção de Nova Análise IA */}
        <Paper style={{ padding: 24, background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(233, 30, 99, 0.1) 100%)', marginBottom: 32, border: '1px solid rgba(156, 39, 176, 0.3)' }}>
          <Typography variant="h5" style={{ color: '#fff', marginBottom: 16, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            🤖 Nova Análise IA - Buscar Novos Possíveis Clientes
            <Chip
              size="small"
              label="IA POWERED"
              style={{
                backgroundColor: '#9C27B0',
                color: '#fff',
                marginLeft: 16,
                fontWeight: 'bold'
              }}
            />
          </Typography>
          <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>
            🔍 A IA analisa <strong>OrdensDeServicoBludata</strong> buscando novos CPFs e CNPJs que ainda não foram cadastrados como possíveis clientes.
          </Typography>
          <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
            ✨ Apenas dados <strong>NOVOS</strong> serão processados. CPFs já identificados não aparecerão novamente na análise. 🔍 <strong>CPFs são automaticamente consultados na API CPF</strong> para validação completa.
          </Typography>

          {/* Botão para executar nova análise */}
          <Box textAlign="center" padding={4}>
            <Button
              variant="contained"
              size="large"
              startIcon={<EmojiObjects />}
              onClick={executarAnaliseIA}
              disabled={loadingAnaliseIA}
              style={{ 
                background: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
                color: '#ffffff',
                borderRadius: 20,
                fontSize: '1rem',
                fontWeight: 'bold',
                padding: '12px 32px'
              }}
            >
              {loadingAnaliseIA ? 'Analisando...' : '🤖 Executar Nova Análise IA'}
            </Button>
            <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.6)', marginTop: 16 }}>
              Busque por novos possíveis clientes que ainda não foram identificados
            </Typography>
          </Box>


        </Paper>

        {/* Seção de Possíveis Clientes de Todas as Coleções */}
        <Paper style={{ padding: 24, background: 'rgba(255,255,255,0.05)', marginBottom: 32 }}>
          <Typography variant="h5" style={{ color: '#fff', marginBottom: 24, fontWeight: 'bold' }}>
            📄 Possíveis Clientes - Sistema Completo de Localização
          </Typography>
          <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>
            Clientes identificados automaticamente em todas as coleções do Firebase ({possiveisClientesCompletos.length} encontrados)
          </Typography>

          {loadingPossiveisClientes ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <CircularProgress style={{ color: '#fff' }} />
              <Typography style={{ marginLeft: 16, color: '#fff' }}>
                Localizando possíveis clientes...
              </Typography>
            </div>
          ) : possiveisClientesCompletos.length > 0 ? (
            <>
              <Grid container spacing={2}>
                {possiveisClientesCompletos
                  .slice(paginaAtualPossiveis * itemsPorPagina, (paginaAtualPossiveis + 1) * itemsPorPagina)
                  .map((possivelCliente, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={possivelCliente.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)',
                      borderRadius: 16,
                      padding: 16,
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 152, 0, 0.3)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <CardContent style={{ flex: 1, padding: 0 }}>
                      {/* Avatar e Info Principal */}
                      <Box display="flex" alignItems="center" marginBottom={2}>
                        <Avatar
                          style={{
                            backgroundColor: '#FF9800',
                            width: 50,
                            height: 50,
                            marginRight: 12
                          }}
                        >
                          <Business />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="subtitle1" style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {possivelCliente.nome}
                          </Typography>
                          <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            {possivelCliente.tipoDocumento}: {possivelCliente.tipoDocumento === 'CNPJ' 
                              ? possivelCliente.documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
                              : possivelCliente.documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                            }
                          </Typography>
                        </Box>
                      </Box>

                      {/* Tipo e Score */}
                      <Box display="flex" style={{ gap: 1}} marginBottom={2}>
                        <Chip
                          size="small"
                          label={possivelCliente.tipoCliente}
                          style={{
                            backgroundColor: possivelCliente.tipoCliente === 'PF' ? '#4CAF50' : '#2196F3',
                            color: '#fff',
                            fontSize: '0.7rem'
                          }}
                        />
                        <Chip
                          size="small"
                          label={`Score: ${possivelCliente.score}%`}
                          style={{
                            backgroundColor: possivelCliente.score >= 80 ? '#4CAF50' : possivelCliente.score >= 60 ? '#FF9800' : '#F44336',
                            color: '#fff',
                            fontSize: '0.7rem'
                          }}
                        />
                        <Chip
                          size="small"
                          label={possivelCliente.potencial.toUpperCase()}
                          style={{
                            backgroundColor: getPotentialColor(possivelCliente.potencial),
                            color: '#fff',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>

                      {/* Informações de Contato */}
                      <Box marginBottom={2}>
                        <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                          <Email style={{ fontSize: 12, marginRight: 4 }} />
                          {possivelCliente.email}
                        </Typography>
                        <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                          <Phone style={{ fontSize: 12, marginRight: 4 }} />
                          {possivelCliente.telefone}
                        </Typography>
                        {possivelCliente.endereco.cidade && (
                          <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            <LocationOn style={{ fontSize: 12, marginRight: 4 }} />
                            {possivelCliente.endereco.cidade}, {possivelCliente.endereco.estado}
                          </Typography>
                        )}
                      </Box>

                      {/* Valor Estimado */}
                      {possivelCliente.valorEstimado > 0 && (
                        <Box marginBottom={2}>
                          <Typography variant="caption" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                            💰 R$ {possivelCliente.valorEstimado.toLocaleString()}
                          </Typography>
                        </Box>
                      )}

                      {/* Endereço Completo (se disponível) */}
                      {possivelCliente.endereco.logradouro && (
                        <Box marginBottom={2}>
                          <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            📍 {possivelCliente.endereco.logradouro}
                          </Typography>
                          {possivelCliente.endereco.bairro && (
                            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                              Bairro: {possivelCliente.endereco.bairro}
                            </Typography>
                          )}
                          {possivelCliente.endereco.cep && (
                            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                              CEP: {possivelCliente.endereco.cep}
                            </Typography>
                          )}
                        </Box>
                      )}

                      {/* Origem */}
                      <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
                        📋 {possivelCliente.origem}
                      </Typography>

                      {/* Botões de Ação */}
                      <Box display="flex" style={{ gap: 1}} marginTop="auto">
                        <Button
                          size="small"
                          variant="contained"
                          style={{ 
                            backgroundColor: '#FF9800',
                            color: '#fff',
                            flex: 1, 
                            fontSize: '0.7rem', 
                            borderRadius: 8 
                          }}
                          onClick={() => adicionarPossivelClienteComoCliente(possivelCliente)}
                          startIcon={<Add />}
                        >
                          Adicionar Cliente
                        </Button>
                        {possivelCliente.email !== 'Email não informado' && (
                          <IconButton
                            size="small"
                            style={{ color: '#2196F3', backgroundColor: 'rgba(33, 150, 243, 0.1)' }}
                            onClick={() => window.open(`mailto:${possivelCliente.email}`, '_blank')}
                          >
                            <Email />
                          </IconButton>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
              </Grid>

              {/* Paginação para Possíveis Clientes */}
              <ComponentePaginacao
                paginaAtual={paginaAtualPossiveis}
                setPagina={setPaginaAtualPossiveis}
                totalItens={possiveisClientesCompletos.length}
                label="Possíveis Clientes"
              />
            </>
          ) : (
            <Box textAlign="center" padding={4}>
              <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.7)' }}>
                📄 Nenhum possível cliente encontrado
              </Typography>
              <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Todos os dados encontrados já são clientes cadastrados
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Seção de Prospecção de Clientes */}
        <Paper style={{ padding: 24, background: 'rgba(255,255,255,0.05)', marginBottom: 32 }}>
          <Typography variant="h5" style={{ color: '#fff', marginBottom: 24, fontWeight: 'bold' }}>
            🎯 Prospecção de Clientes - Ordens de Serviço
          </Typography>
          <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>
            Sugestões de clientes baseadas em ordens de serviço cadastradas
          </Typography>

          {loadingProspectos ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <CircularProgress style={{ color: '#fff' }} />
              <Typography style={{ marginLeft: 16, color: '#fff' }}>
                Carregando prospectos...
              </Typography>
            </div>
          ) : prospectosOrdensServico.length > 0 ? (
            <>
              <Grid container spacing={2}>
                {prospectosOrdensServico
                  .slice(paginaAtualProspectos * itemsPorPagina, (paginaAtualProspectos + 1) * itemsPorPagina)
                  .map((prospecto, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={prospecto.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card
                      style={{
                        background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)',
                        borderRadius: 16,
                        padding: 16,
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(63, 81, 181, 0.3)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <CardContent style={{ flex: 1, padding: 0 }}>
                        {/* Avatar e Info Principal */}
                        <Box display="flex" alignItems="center" marginBottom={2}>
                          <Avatar
                            style={{
                              backgroundColor: prospecto.tipoCliente === 'PF' ? '#4CAF50' : '#2196F3',
                              width: 50,
                              height: 50,
                              marginRight: 12
                            }}
                          >
                            {prospecto.tipoCliente === 'PF' ? <Person /> : <Business />}
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="subtitle1" style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>
                              {prospecto.nome}
                            </Typography>
                            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)' }}>
                              {prospecto.tipoDocumento}: {prospecto.documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Empresa (se PJ) */}
                        {prospecto.empresa && prospecto.tipoCliente === 'PJ' && (
                          <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: 8 }}>
                            🏢 {prospecto.empresa}
                          </Typography>
                        )}

                        {/* Score e Potencial */}
                        <Box display="flex" style={{ gap: 1}} marginBottom={2}>
                          <Chip
                            size="small"
                            label={`Score: ${prospecto.score}%`}
                            style={{
                              backgroundColor: prospecto.score >= 80 ? '#4CAF50' : prospecto.score >= 60 ? '#FF9800' : '#F44336',
                              color: '#fff',
                              fontSize: '0.7rem'
                            }}
                          />
                          <Chip
                            size="small"
                            label={prospecto.potencial.toUpperCase()}
                            style={{
                              backgroundColor: getPotentialColor(prospecto.potencial),
                              color: '#fff',
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>

                        {/* Informações de Contato */}
                        <Box marginBottom={2}>
                          {prospecto.email !== 'Email não informado' && (
                            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                              <Email style={{ fontSize: 12, marginRight: 4 }} />
                              {prospecto.email}
                            </Typography>
                          )}
                          {prospecto.telefone !== 'Telefone não informado' && (
                            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                              <Phone style={{ fontSize: 12, marginRight: 4 }} />
                              {prospecto.telefone}
                            </Typography>
                          )}
                          {prospecto.endereco.cidade && (
                            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                              <LocationOn style={{ fontSize: 12, marginRight: 4 }} />
                              {prospecto.endereco.cidade}, {prospecto.endereco.estado}
                            </Typography>
                          )}
                        </Box>

                        {/* Valor do Serviço */}
                        {prospecto.valorServico > 0 && (
                          <Box marginBottom={2}>
                            <Typography variant="caption" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                              💰 R$ {prospecto.valorServico.toLocaleString()}
                            </Typography>
                          </Box>
                        )}

                        {/* Tipo de Serviço */}
                        <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
                          📋 {prospecto.tipoServico}
                        </Typography>

                        {/* Botões de Ação */}
                        <Box display="flex" style={{ gap: 1}} marginTop="auto">
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => adicionarProspectoComoCliente(prospecto)}
                            style={{ flex: 1, fontSize: '0.7rem', borderRadius: 8 }}
                            startIcon={<Add />}
                          >
                            Adicionar
                          </Button>
                          {prospecto.telefone !== 'Telefone não informado' && (
                            <IconButton
                              size="small"
                              style={{ color: '#25D366', backgroundColor: 'rgba(37, 211, 102, 0.1)' }}
                              onClick={() => window.open(`https://wa.me/55${prospecto.telefone.replace(/\D/g, '')}`, '_blank')}
                            >
                              <WhatsApp />
                            </IconButton>
                          )}
                          {prospecto.email !== 'Email não informado' && (
                            <IconButton
                              size="small"
                              style={{ color: '#2196F3', backgroundColor: 'rgba(33, 150, 243, 0.1)' }}
                              onClick={() => window.open(`mailto:${prospecto.email}`, '_blank')}
                            >
                              <Email />
                            </IconButton>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
              </Grid>

              {/* Paginação para Prospectos */}
              <ComponentePaginacao
                paginaAtual={paginaAtualProspectos}
                setPagina={setPaginaAtualProspectos}
                totalItens={prospectosOrdensServico.length}
                label="Prospectos"
              />
            </>
          ) : (
            <Box textAlign="center" padding={4}>
              <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.7)' }}>
                🎯 Nenhum prospecto encontrado
              </Typography>
              <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Todos os clientes das ordens de serviço já foram cadastrados
              </Typography>
            </Box>
          )}


        </Paper>

        {/* Tabela de Clientes */}
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Contato</TableCell>
                <TableCell>Localização</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Valor Total</TableCell>
                <TableCell>Sistema Patentes</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientesFiltrados
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((cliente) => (
                  <TableRow key={cliente.id} className={classes.tableRow}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          className={classes.clientAvatar}
                          style={{ 
                            backgroundColor: cliente.tipoCliente === 'PF' ? '#4CAF50' : '#2196F3',
                            marginRight: 16,
                            border: cliente.observacoes?.includes('CLIENTE REAL') ? '3px solid #FFD700' : 'none'
                          }}
                        >
                          {cliente.tipoCliente === 'PF' ? <Person /> : <Business />}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                            {cliente.nome}
                            {cliente.observacoes?.includes('CLIENTE REAL') && (
                              <Chip
                                size="small"
                                label="CLIENTE"
                                style={{
                                  backgroundColor: '#FFD700',
                                  color: '#000',
                                  marginLeft: 8,
                                  fontWeight: 'bold'
                                }}
                              />
                            )}
                          </Typography>
                          {cliente.empresa && (
                            <Typography variant="caption" style={{ opacity: 0.8 }}>
                              {cliente.empresa}
                            </Typography>
                          )}
                          <Box display="flex" style={{ gap: 1}} mt={1}>
                            <Chip
                              size="small"
                              label={cliente.tipoCliente}
                              style={{
                                backgroundColor: cliente.tipoCliente === 'PF' ? '#4CAF50' : '#2196F3',
                                color: 'white'
                              }}
                            />
                            {cliente.frequenciaUso > 1 && (
                              <Chip
                                size="small"
                                label={`${cliente.frequenciaUso}x fontes`}
                                style={{
                                  backgroundColor: '#9C27B0',
                                  color: 'white'
                                }}
                              />
                            )}
                            {cliente.favorito && (
                              <Star style={{ color: '#FFD700', fontSize: 18 }} />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDocument(cliente.documento, cliente.tipoDocumento)}
                      </Typography>
                      <Typography variant="caption" style={{ opacity: 0.8 }}>
                        {cliente.tipoDocumento}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" style={{ display: 'flex', alignItems: 'center' }}>
                          <Email style={{ fontSize: 16, marginRight: 4 }} />
                          {cliente.email}
                        </Typography>
                        <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                          <Phone style={{ fontSize: 16, marginRight: 4 }} />
                          {cliente.telefone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {cliente.endereco.cidade && (
                          <Typography variant="body2" style={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn style={{ fontSize: 16, marginRight: 4 }} />
                            {cliente.endereco.cidade}, {cliente.endereco.estado}
                          </Typography>
                        )}
                        {cliente.endereco.cep && (
                          <Typography variant="caption" style={{ opacity: 0.8 }}>
                            CEP: {cliente.endereco.cep}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={cliente.status}
                        className={classes.statusChip}
                        style={{
                          backgroundColor: getStatusColor(cliente.status),
                          color: 'white'
                        }}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={cliente.score}
                        style={{ marginTop: 4, height: 4, borderRadius: 2 }}
                      />
                      <Typography variant="caption" style={{ opacity: 0.8 }}>
                        Score: {cliente.score}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" style={{ fontWeight: 'bold', color: '#4CAF50' }}>
                        R$ {cliente.valorTotal.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" style={{ opacity: 0.8 }}>
                        Frequência: {cliente.frequenciaUso}x
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={cliente.sistemaPatentes ? 'SIM' : 'NÃO'}
                        style={{
                          backgroundColor: cliente.sistemaPatentes ? '#4CAF50' : '#757575',
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" style={{ gap: 1}}>
                        <Tooltip title="Ver Detalhes">
                          <IconButton
                            size="small"
                            className={classes.actionButton}
                            onClick={() => {
                              setSelectedCliente(cliente);
                              setDetailsDialogOpen(true);
                            }}
                            style={{ color: '#2196F3' }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="WhatsApp">
                          <IconButton
                            size="small"
                            className={classes.actionButton}
                            onClick={() => window.open(`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}`, '_blank')}
                            style={{ color: '#25D366' }}
                          >
                            <WhatsApp />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={cliente.favorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}>
                          <IconButton
                            size="small"
                            className={classes.actionButton}
                            onClick={() => toggleFavorito(cliente.id, cliente.favorito)}
                            style={{ color: '#FFD700' }}
                          >
                            {cliente.favorito ? <Star /> : <StarBorder />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            className={classes.actionButton}
                            onClick={() => handleDeleteCliente(cliente.id)}
                            style={{ color: '#F44336' }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={clientesFiltrados.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            style={{ color: '#ffffff' }}
          />
        </TableContainer>

        {/* Dialog de Detalhes do Cliente */}
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="md"
          fullWidth
          className={classes.detailsDialog}
        >
          {selectedCliente && (
            <>
              <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
                    {selectedCliente.tipoCliente === 'PF' ? <Person style={{ marginRight: 8 }} /> : <Business style={{ marginRight: 8 }} />}
                    Detalhes do Cliente
                  </Typography>
                  <IconButton onClick={() => setDetailsDialogOpen(false)} style={{ color: '#ffffff' }}>
                    <Close />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Informações Pessoais</Typography>
                    <Typography><strong>Nome:</strong> {selectedCliente.nome}</Typography>
                    <Typography><strong>Documento:</strong> {formatDocument(selectedCliente.documento, selectedCliente.tipoDocumento)}</Typography>
                    <Typography><strong>Email:</strong> {selectedCliente.email}</Typography>
                    <Typography><strong>Telefone:</strong> {selectedCliente.telefone}</Typography>
                    {selectedCliente.empresa && (
                      <Typography><strong>Empresa:</strong> {selectedCliente.empresa}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Endereço</Typography>
                    {selectedCliente.endereco.logradouro && (
                      <Typography><strong>Logradouro:</strong> {selectedCliente.endereco.logradouro}, {selectedCliente.endereco.numero}</Typography>
                    )}
                    {selectedCliente.endereco.bairro && (
                      <Typography><strong>Bairro:</strong> {selectedCliente.endereco.bairro}</Typography>
                    )}
                    {selectedCliente.endereco.cidade && (
                      <Typography><strong>Cidade:</strong> {selectedCliente.endereco.cidade} - {selectedCliente.endereco.estado}</Typography>
                    )}
                    {selectedCliente.endereco.cep && (
                      <Typography><strong>CEP:</strong> {selectedCliente.endereco.cep}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Informações Comerciais</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography><strong>Status:</strong> {selectedCliente.status}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography><strong>Score:</strong> {selectedCliente.score}%</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography><strong>Valor Total:</strong> R$ {selectedCliente.valorTotal.toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography><strong>Frequência de Uso:</strong> {selectedCliente.frequenciaUso}x</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography><strong>Sistema Patentes:</strong> {selectedCliente.sistemaPatentes ? 'Sim' : 'Não'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography><strong>Favorito:</strong> {selectedCliente.favorito ? 'Sim' : 'Não'}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {selectedCliente.servicos.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Serviços Utilizados</Typography>
                      <Box display="flex" flexWrap="wrap" style={{ gap: 1}}>
                        {selectedCliente.servicos.map((servico, index) => (
                          <Chip key={index} label={servico} size="small" />
                        ))}
                      </Box>
                    </Grid>
                  )}
                  {selectedCliente.observacoes && (
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Observações</Typography>
                      <Typography>{selectedCliente.observacoes}</Typography>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => window.open(`https://wa.me/55${selectedCliente.telefone.replace(/\D/g, '')}`, '_blank')}
                  startIcon={<WhatsApp />}
                  style={{ color: '#25D366' }}
                >
                  WhatsApp
                </Button>
                <Button onClick={() => setDetailsDialogOpen(false)} color="primary">
                  Fechar
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Dialog de Novo Cliente */}
        <Dialog
          open={newClienteDialogOpen}
          onClose={() => setNewClienteDialogOpen(false)}
          maxWidth="md"
          fullWidth
          className={classes.detailsDialog}
        >
          <DialogTitle>
            <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
              <Add style={{ marginRight: 8 }} />
              Adicionar Novo Cliente
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} style={{ marginTop: 8 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  value={newCliente.nome}
                  onChange={(e) => setNewCliente({ ...newCliente, nome: e.target.value })}
                  className={classes.formField}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth className={classes.formField}>
                  <InputLabel>Tipo de Documento</InputLabel>
                  <Select
                    value={newCliente.tipoDocumento}
                    onChange={(e) => setNewCliente({ 
                      ...newCliente, 
                      tipoDocumento: e.target.value as 'CPF' | 'CNPJ',
                      tipoCliente: e.target.value === 'CPF' ? 'PF' : 'PJ'
                    })}
                  >
                    <MenuItem value="CPF">CPF</MenuItem>
                    <MenuItem value="CNPJ">CNPJ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label={newCliente.tipoDocumento === 'CPF' ? 'CPF' : 'CNPJ'}
                  value={newCliente.documento}
                  onChange={(e) => setNewCliente({ ...newCliente, documento: e.target.value })}
                  className={classes.formField}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newCliente.email}
                  onChange={(e) => setNewCliente({ ...newCliente, email: e.target.value })}
                  className={classes.formField}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={newCliente.telefone}
                  onChange={(e) => setNewCliente({ ...newCliente, telefone: e.target.value })}
                  className={classes.formField}
                />
              </Grid>
              {newCliente.tipoCliente === 'PJ' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome da Empresa"
                    value={newCliente.empresa}
                    onChange={(e) => setNewCliente({ ...newCliente, empresa: e.target.value })}
                    className={classes.formField}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CEP"
                  value={newCliente.endereco?.cep || ''}
                  onChange={(e) => setNewCliente({ 
                    ...newCliente, 
                    endereco: { ...newCliente.endereco, cep: e.target.value }
                  })}
                  className={classes.formField}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cidade"
                  value={newCliente.endereco?.cidade || ''}
                  onChange={(e) => setNewCliente({ 
                    ...newCliente, 
                    endereco: { ...newCliente.endereco, cidade: e.target.value }
                  })}
                  className={classes.formField}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth className={classes.formField}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newCliente.status}
                    onChange={(e) => setNewCliente({ ...newCliente, status: e.target.value as any })}
                  >
                    <MenuItem value="ativo">Ativo</MenuItem>
                    <MenuItem value="inativo">Inativo</MenuItem>
                    <MenuItem value="pendente">Pendente</MenuItem>
                    <MenuItem value="bloqueado">Bloqueado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newCliente.sistemaPatentes}
                      onChange={(e) => setNewCliente({ ...newCliente, sistemaPatentes: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Usa Sistema de Patentes"
                  style={{ color: '#ffffff' }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newCliente.favorito}
                      onChange={(e) => setNewCliente({ ...newCliente, favorito: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Adicionar aos Favoritos"
                  style={{ color: '#ffffff' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações"
                  multiline
                  rows={3}
                  value={newCliente.observacoes}
                  onChange={(e) => setNewCliente({ ...newCliente, observacoes: e.target.value })}
                  className={classes.formField}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewClienteDialogOpen(false)} color="secondary">
              Cancelar
            </Button>
            <Button 
              onClick={handleAddCliente} 
              color="primary" 
              variant="contained"
              disabled={!newCliente.nome || !newCliente.documento || !newCliente.email}
            >
              Adicionar Cliente
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default ClienteLocalizador;
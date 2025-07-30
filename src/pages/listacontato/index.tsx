'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  Card, CardContent, Typography, Grid, Box, CircularProgress, Button, Snackbar, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Fab, useMediaQuery, useTheme, makeStyles ,
  IconButton, MenuItem, Select, FormControl, InputLabel, Chip, Avatar,
  LinearProgress, List, ListItem, ListItemText, Divider, Collapse, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@material-ui/core';
import { 
  Add, Message, Edit, Close, Send, Check, Business, Person, LocalOffer,
  ExpandMore, ExpandLess, InsertDriveFile, List as ListIcon, ViewModule
} from '@material-ui/icons';
import { collection, getDocs, getFirestore, addDoc, updateDoc, doc, setDoc, deleteDoc,  query, orderBy, limit ,serverTimestamp  } from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { getStatusExtras, addStatusExtra, removeStatusExtra } from '@/logic/firebase/services/status';
import { useIAParcelamento } from '@/hooks/useIAParcelamento';

import { useIAPendentes } from '@/hooks/useIAPendentes';




import Tooltip from '@material-ui/core/Tooltip';
import BugReportIcon from '@material-ui/icons/BugReport';

import { gerarMensagemIA } from '@/logic/ia/gerarMensagem';

import dynamic from 'next/dynamic';
const ChatFlutuante = dynamic(() => import('@/components/parcelamento/ChatFlutuante'), { ssr: false });


const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    padding: theme.spacing(4, 12), // Increased padding for a spacious feel
    background: 'linear-gradient(180deg, #F7F9FC 0%, #E8ECEF 100%)', // Subtle gradient for depth
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  addButton: {
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
    background: 'linear-gradient(135deg, #1a6e3dff 0%, #1c8146ff 100%)', // Refined green gradient
    color: '#fff',
    borderRadius: 28,
    left: 32,
    padding: theme.spacing(1.5, 3),
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #27AE60 0%, #219653 100%)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
      transform: 'translateY(-2px)',
    },
  },
  dialogContent: {
    minWidth: 400,
    [theme.breakpoints.up('sm')]: {
      minWidth: 600,
    },
    padding: theme.spacing(3),
    background: '#fff',
    borderRadius: 12,
  },
  tableCell: {
  padding: theme.spacing(1.5, 2),
  fontSize: '0.95rem',
  color: '#34495E',
  borderBottom: '1px solid #E8ECEF',
  background: '#fff',
  '&:first-child': {
    borderLeft: '1px solid #E8ECEF',
  },
  '&:last-child': {
    borderRight: '1px solid #E8ECEF',
  },
  transition: 'background 0.2s ease',
  '&:hover': {
    background: '#F1F5F9',
  },
},
  card: {
    borderRadius: 20,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 100%)',
    transition: 'all 0.3s ease',
    borderLeft: '4px solid #2ECC71',
    cursor: 'grab',
    userSelect: 'none',
    minHeight: 220,
    padding: theme.spacing(3),
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 14px 40px rgba(0, 0, 0, 0.12)',
    },
  },
  sectionHeader: {
    marginBottom: theme.spacing(3),
    fontWeight: 700,
    color: '#1A3C34',
    fontSize: '1.5rem',
    letterSpacing: '0.02em',
  },
  filterBox: {
    marginBottom: theme.spacing(4),
    '& .MuiOutlinedInput-root': {
      borderRadius: 30,
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      transition: 'box-shadow 0.3s ease',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  whatsappButton: {
    background: '#2ECC71',
    color: '#fff',
    borderRadius: 12,
    padding: theme.spacing(1, 2),
    fontWeight: 500,
    '&:hover': {
      background: '#27AE60',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  droppableArea: {
    padding: theme.spacing(2),
    minHeight: 350,
    background: '#F9FAFB',
    borderRadius: 12,
    border: '1px solid #E8ECEF',
    transition: 'background 0.3s ease',
    '&:hover': {
      background: '#F1F5F9',
    },
  },
  editButton: {
    background: '#3498DB',
    color: '#fff',
    borderRadius: 12,
    padding: theme.spacing(1, 2),
    fontWeight: 500,
    '&:hover': {
      background: '#2980B9',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  dialogTitle: {
    background: 'linear-gradient(90deg, #1A3C34 0%, #2E5A50 100%)',
    color: '#fff',
    padding: theme.spacing(2.5, 4),
    fontWeight: 600,
    fontSize: '1.25rem',
  },
  dialogActions: {
    padding: theme.spacing(2.5, 3),
    background: '#F9FAFB',
    borderTop: '1px solid #E8ECEF',
  },
  paginationButton: {
    minWidth: 44,
    height: 44,
    borderRadius: 22,
    margin: theme.spacing(0, 1),
    fontWeight: 500,
    background: '#fff',
    border: '1px solid #E8ECEF',
    '&.Mui-disabled': {
      background: '#F1F5F9',
      border: '1px solid #E8ECEF',
    },
  },
  activePage: {
    background: '#2ECC71',
    color: '#fff',
    border: 'none',
    '&:hover': {
      background: '#27AE60',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  messageDialog: {
    '& .MuiDialog-paper': {
      borderRadius: 16,
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
  },
  messageHeader: {
    background: 'linear-gradient(90deg, #1A3C34 0%, #2E5A50 100%)',
    color: '#fff',
    padding: theme.spacing(2.5, 4),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 600,
  },
  messageContent: {
    padding: theme.spacing(4),
    background: '#F9FAFB',
  },
  messageInput: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      transition: 'box-shadow 0.3s ease',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    },
    '& .MuiOutlinedInput-multiline': {
      padding: theme.spacing(2.5),
    },
  },
  cardTitle: {
    color: '#1A3C34',
    fontWeight: 700,
    fontSize: '1.25rem',
    marginBottom: theme.spacing(1.5),
    letterSpacing: '0.01em',
  },
  cardField: {
    marginBottom: theme.spacing(1),
    color: '#34495E',
    fontSize: '0.95rem',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  cardActions: {
    padding: theme.spacing(1.5, 0),
    borderTop: '1px solid #E8ECEF',
    marginTop: theme.spacing(1.5),
  },
  statusSelect: {
    minWidth: 220,
    marginBottom: theme.spacing(4),
    '& .MuiOutlinedInput-root': {
      borderRadius: 30,
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  statusChip: {
    marginLeft: theme.spacing(1.5),
    color: '#fff',
    fontWeight: 600,
    borderRadius: 12,
    padding: theme.spacing(0.5, 1.5),
  },
  statusNovo: {
    backgroundColor: '#7F8C8D',
  },
  statusContatado: {
    backgroundColor: '#3498DB',
  },
  statusInteressado: {
    backgroundColor: '#E67E22',
  },
  statusVendido: {
    backgroundColor: '#2ECC71',
  },
  statusPerdido: {
    backgroundColor: '#E74C3C',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  quickStatus: {
    display: 'flex',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(2.5),
    flexWrap: 'wrap',
  },
  massSendButton: {
    background: '#135e17ff',
    color: '#fffua',
    marginLeft: theme.spacing(2),
    borderRadius: 12,
    padding: theme.spacing(1, 2),
    fontWeight: 500,
    '&:hover': {
      background: '#a8a4a1ff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  progressContainer: {
    marginTop: theme.spacing(3),
    width: '100%',
  },
  templatesContainer: {
    marginTop: theme.spacing(3),
    border: '1px solid #E8ECEF',
    borderRadius: 12,
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  templateHeader: {
    background: '#F9FAFB',
    padding: theme.spacing(2, 3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    borderBottom: '1px solid #E8ECEF',
  },
  templateList: {
    maxHeight: 250,
    overflowY: 'auto',
    background: '#fff',
  },
  templateItem: {
    padding: theme.spacing(1.5, 3),
    '&:hover': {
      backgroundColor: '#F1F5F9',
      cursor: 'pointer',
    },
  },
  templateActions: {
    display: 'flex',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(0, 3, 2),
  },
  addTemplateButton: {
    marginTop: theme.spacing(3),
    background: '#2ECC71',
    color: '#fff',
    borderRadius: 12,
    padding: theme.spacing(1, 2),
    '&:hover': {
      background: '#27AE60',
    },
  },
  columnContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(3),
    overflowX: 'auto',
    paddingBottom: theme.spacing(3),
  },
  column: {
    flex: 1,
    minWidth: 280,
    background: '#fff',
    borderRadius: 12,
    padding: theme.spacing(3),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
    },
  },
  columnTitle: {
    fontWeight: 700,
    color: '#1A3C34',
    marginBottom: theme.spacing(2.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    fontSize: '1.25rem',
  },
  viewToggle: {
    marginLeft: theme.spacing(3),
    color: '#1d5722ff',
  },
  table: {
    minWidth: 700,
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    
    color: '#fff',
    '&:hover': {
      background: '#27AE60',
    },
  },
  statusPersonalizado: {
    backgroundColor: '#8E44AD',
  },
}));

interface Cliente {
  placa: string;
  renavam: string;
  proprietarioatual: string;
  marca_modelo: string;
  origem: string;
  municipio: string;
  fone_residencial: string;
  fone_comercial: string;
  fone_celular: string;
  usuario: string;
  statusCRM?: string;
  dataAtualizacao?: string;
  id?: string;
}

interface EnvioMassaState {
  open: boolean;
  statusSelecionado: string;
  mensagem: string;
  enviando: boolean;
  progresso: number;
}

interface StatusExtra {
  id: string;
  value: string;
  label: string;
}


interface MessageTemplate {
  id?: string;
  title: string;
  content: string;
}

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Todos os Status' },
  { value: 'novo', label: 'Novo', icon: <Person fontSize="small" /> },
  { value: 'contatado', label: 'Contatado', icon: <Message fontSize="small" /> },
  { value: 'interessado', label: 'Interessado', icon: <Business fontSize="small" /> },
  { value: 'vendido', label: 'Vendido', icon: <Check fontSize="small" /> },
  { value: 'perdido', label: 'Perdido', icon: <Close fontSize="small" /> },
];

const DEFAULT_TEMPLATES: MessageTemplate[] = [
  {
    title: "Primeiro contato",
    content: "Olá {nome}, tudo bem? Me chamo {seu_nome} e estou entrando em contato sobre o veículo {marca_modelo} placa {placa}. Gostaria de saber se você tem interesse em vender este veículo."
  },
  {
    title: "Follow-up",
    content: "Oi {nome}, como vai? Estou entrando em contato novamente sobre o veículo {marca_modelo} placa {placa}. Você teve a chance de pensar sobre nossa proposta?"
  },
  {
    title: "Agendamento visita",
    content: "Olá {nome}, tudo bem? Gostaríamos de agendar uma visita para avaliar o veículo {marca_modelo}. Qual seria o melhor dia e horário para você?"
  }
];

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'novo': return 'default';
    case 'contatado': return 'primary';
    case 'interessado': return 'secondary';
    case 'vendido': return 'success';
    case 'perdido': return 'error';
    default: return 'default';
  }
};

const getStatusClass = (classes: any, status?: string) => {
  switch (status) {
    case 'novo': return classes.statusNovo;
    case 'contatado': return classes.statusContatado;
    case 'interessado': return classes.statusInteressado;
    case 'vendido': return classes.statusVendido;
    case 'perdido': return classes.statusPerdido;
    default: return classes.statusPersonalizado;
    
  }
};

export function normalizarTelefoneBrasil(numero: string): string {
  let phone = numero.replace(/\D/g, ''); // remove tudo que não é número

  // Remove zero à esquerda se existir
  if (phone.length >= 12 && phone.startsWith('0')) {
    phone = phone.slice(1);
  }

  // Adiciona DDI se não tiver
  if (!phone.startsWith('55')) {
    phone = `55${phone}`;
  }

  // Garante que tenha DDD e número com ou sem 9
  if (phone.length === 12) {
    // Ex: 554899999999 (sem 9), insere o 9
    phone = phone.slice(0, 4) + '9' + phone.slice(4);
  }

  // Se passar de 13 dígitos, provavelmente está com dois DDI ou erro
  if (phone.length > 13) {
    phone = phone.slice(0, 13); // força o padrão correto
  }

  return phone;
}


const ListaContatosPage = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

 const [clientes, setClientes] = useState<Cliente[]>([]);
useIAParcelamento(clientes);
  const [loading, setLoading] = useState(true);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openMensagem, setOpenMensagem] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [numeroDestino, setNumeroDestino] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [chatAberto, setChatAberto] = useState<{ numero: string, nome: string } | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const clientesPorPagina = 10;
  const [modoEdicao, setModoEdicao] = useState(false);
  const [docIdEdicao, setDocIdEdicao] = useState<string | null>(null);
  const [statusCRM, setStatusCRM] = useState<string>('todos');
  const [envioMassa, setEnvioMassa] = useState<EnvioMassaState>({
  open: false,
  statusSelecionado: 'novo',
  mensagem: '',
  enviando: false,
  progresso: 0
});
  const [templates, setTemplates] = useState<MessageTemplate[]>(DEFAULT_TEMPLATES);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<MessageTemplate>({ title: '', content: '' });
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [statusDinamicos, setStatusDinamicos] = useState<string[]>([]);
const [statusExtras, setStatusExtras] = useState<StatusExtra[]>([]);

const pendentesIA = useIAPendentes();

const [ultimasMensagensRecebidas, setUltimasMensagensRecebidas] = useState<{ [numero: string]: string }>({});
const [statusDisponiveis, setStatusDisponiveis] = useState(() => [...STATUS_OPTIONS]);

const [dataHoraAgendada, setDataHoraAgendada] = useState('');




  const [novoCliente, setNovoCliente] = useState<Cliente>({
    placa: '', 
    renavam: '', 
    proprietarioatual: '', 
    marca_modelo: '', 
    origem: '', 
    municipio: '',
    fone_residencial: '', 
    fone_comercial: '', 
    fone_celular: '', 
    usuario: '',
    statusCRM: 'novo',
    dataAtualizacao: new Date().toISOString()
  });


  
const fetchStatus = async () => {
  const extras = await getStatusExtras();
  setStatusExtras(extras);

  const extrasFormatados = extras.map(e => ({
    value: e.value,
    label: e.label,
    icon: <LocalOffer fontSize="small" />
  }));

  setStatusDisponiveis([...STATUS_OPTIONS, ...extrasFormatados]);
};

useEffect(() => {
  fetchStatus();
}, []);



 useEffect(() => {
  const buscarUltimasMensagens = async () => {
    const db = getFirestore(app);
    const novas: { [numero: string]: string } = {};

    for (const cliente of clientes) {
      const numero = cliente.fone_celular.replace(/\D/g, '');
      const mensagensRef = collection(db, `mensagensPorContato/${numero}/mensagens`);
      const q = query(mensagensRef, orderBy('timestamp', 'desc'), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const msg = snap.docs[0].data();
        if (!msg.isFromMe && msg.texto) {
          novas[numero] = msg.texto;
        }
      }
    }

    setUltimasMensagensRecebidas(novas);
  };

  if (clientes.length > 0) {
    buscarUltimasMensagens();
  }
}, [clientes]);


useEffect(() => {
  fetch('/api/verificaRespostas')
    .then((res) => res.json())
    .then((data) => console.log('Respostas verificada:', data));
}, []);




  useEffect(() => {
    
    const fetchClientes = async () => {
      const db = getFirestore(app);
      const snapshot = await getDocs(collection(db, 'DadosclientesExtraidos'));
      const dados: Cliente[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Cliente;
        if (data.placa) dados.push({ 
          ...data, 
          id: doc.id,
          statusCRM: data.statusCRM || 'novo'
        });
      });

      const unicos = Object.values(
        dados.reduce((acc, cliente) => {
          if (!acc[cliente.placa]) acc[cliente.placa] = cliente;
          return acc;
        }, {} as Record<string, Cliente>)
      );

      setClientes(unicos);
      setLoading(false);
    };

    fetchClientes();
  }, []);


  



  const handleStatusChange = (event: ChangeEvent<{ value: unknown }>) => {
    setStatusCRM(event.target.value as string);
    setPaginaAtual(1);
  };

  const atualizarStatusCliente = async (clienteId: string, novoStatus: string) => {
    const db = getFirestore(app);
    try {
      const docRef = doc(db, 'DadosclientesExtraidos', clienteId);
      await updateDoc(docRef, { 
        statusCRM: novoStatus,
        dataAtualizacao: new Date().toISOString()
      });
      
      setClientes(clientes.map(cliente => 
        cliente.id === clienteId 
          ? { ...cliente, statusCRM: novoStatus, dataAtualizacao: new Date().toISOString() } 
          : cliente
      ));
      
      setSnackbarMsg(`Status atualizado para ${novoStatus}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setSnackbarMsg('Erro ao atualizar status');
      setSnackbarOpen(true);
    }
  };


  useEffect(() => {
    // 🔁 Verifica e processa agendamentos automaticamente a cada minuto
    const intervalo = setInterval(() => {
      fetch('/api/processaAgendamentos')
        .then(res => res.json())
        .then(data => {
          if (data.enviados > 0) {
            console.log('✅ Mensagens enviadas automaticamente:', data.logs);
          }
        })
        .catch(err => console.error('❌ Erro ao processar agendamentos:', err));
    }, 60000); // 60 segundos

    return () => clearInterval(intervalo); // limpa ao desmontar
  }, []);

  const sendMessage = async (numero: string, mensagem: string) => {
    try {
      const numeroFormatado = `+${normalizarTelefoneBrasil(numero)}`;

      if (!mensagem.trim()) {
        setSnackbarMsg('Mensagem não pode estar vazia');
        setSnackbarOpen(true);
        return false;
      }

      const res = await fetch('/api/digisac', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero: numeroFormatado, mensagem }),
      });

      const json = await res.json();
      console.log('Resposta da API Digisac:', json);

      if (!res.ok) throw new Error(json.message || 'Erro desconhecido');

      setSnackbarMsg(`Mensagem enviada para ${numero}`);
      setSnackbarOpen(true);
      return true;
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      setSnackbarMsg(`Erro ao enviar para ${numero}: ${error.message}`);
      setSnackbarOpen(true);
      return false;
    }
  };

  const abrirEnvioMensagem = (numero: string) => {
    setNumeroDestino(numero);
    setMensagem('');
    setOpenMensagem(true);
  };

  const confirmarEnvioMensagem = () => {
    sendMessage(numeroDestino, mensagem);
    setOpenMensagem(false);
  };

  const abrirEdicao = (cliente: Cliente) => {
    setNovoCliente({
      ...cliente,
      statusCRM: cliente.statusCRM || 'novo'
    });
    setDocIdEdicao(cliente.id || null);
    setModoEdicao(true);
    setOpenDialog(true);
  };

  const isTelefoneValido = (numero: string) => {
  const phone = numero.replace(/\D/g, '');
  return phone.length >= 10 && phone.length <= 13;
};

 const clientesFiltrados = clientes.filter(c =>
  (statusCRM === 'todos' || c.statusCRM === statusCRM) &&
  (
    (c.placa?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
    (c.proprietarioatual?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
    (c.municipio?.toLowerCase() || '').includes(filtro.toLowerCase())
  )
);

  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
  const clientesPaginados = clientesFiltrados.slice(
    (paginaAtual - 1) * clientesPorPagina,
    paginaAtual * clientesPorPagina
  );


const enviarMensagensMassa = async () => {
  if (!envioMassa.mensagem.trim()) {
    setSnackbarMsg('Digite uma mensagem para enviar');
    setSnackbarOpen(true);
    return;
  }

  const clientesParaEnviar = clientes.filter(c =>
    c.statusCRM === envioMassa.statusSelecionado &&
    c.fone_celular &&
    isTelefoneValido(c.fone_celular)
  );

  if (clientesParaEnviar.length === 0) {
    setSnackbarMsg('Nenhum cliente encontrado com esse status e telefone válido');
    setSnackbarOpen(true);
    return;
  }

  const agora = new Date();
  const agendarPara = dataHoraAgendada ? new Date(dataHoraAgendada) : null;
  const agendamentoFuturo = agendarPara && agendarPara > agora;

  if (agendamentoFuturo) {
    try {
      const db = getFirestore(app);
      await addDoc(collection(db, 'AgendamentosSMS'), {
  mensagem: envioMassa.mensagem,
  statusSelecionado: envioMassa.statusSelecionado,
  contatos: clientesParaEnviar.map(c => ({
    id: c.id,
    numero: c.fone_celular,
    nome: c.proprietarioatual
  })),
  agendarPara: new Date(new Date(dataHoraAgendada).getTime() - (3 * 60 * 60 * 1000)).toISOString(), // ✅ corrigido para UTC
  criadoEm: serverTimestamp()
});

      setSnackbarMsg('✅ Envio agendado com sucesso!');
      setSnackbarOpen(true);
      setEnvioMassa(prev => ({ ...prev, open: false, enviando: false }));
      return;
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      setSnackbarMsg('❌ Erro ao salvar agendamento');
      setSnackbarOpen(true);
      return;
    }
  }

  // Envio imediato
  setEnvioMassa(prev => ({ ...prev, enviando: true, progresso: 0 }));

  let sucessos = 0;
  for (let i = 0; i < clientesParaEnviar.length; i++) {
    const cliente = clientesParaEnviar[i];
    const mensagemPersonalizada = applyTemplate(
      { title: "Mensagem em Massa", content: envioMassa.mensagem },
      cliente
    );

    const sucesso = await sendMessage(cliente.fone_celular, mensagemPersonalizada);
    if (sucesso) sucessos++;

    setEnvioMassa(prev => ({
      ...prev,
      progresso: Math.round(((i + 1) / clientesParaEnviar.length) * 100)
    }));

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  setEnvioMassa(prev => ({ ...prev, enviando: false }));
  setSnackbarMsg(`✅ Envio concluído: ${sucessos}/${clientesParaEnviar.length} mensagens enviadas com sucesso`);
  setSnackbarOpen(true);
};

  const applyTemplate = (template: MessageTemplate, cliente: Cliente) => {
    let message = template.content;
    message = message.replace(/{nome}/g, cliente.proprietarioatual || 'Cliente');
    message = message.replace(/{seu_nome}/g, 'Equipe de Vendas');
    message = message.replace(/{marca_modelo}/g, cliente.marca_modelo || 'o veículo');
    message = message.replace(/{placa}/g, cliente.placa || '');
    message = message.replace(/{municipio}/g, cliente.municipio || 'sua cidade');
    return message;
  };

  const handleAddTemplate = () => {
    if (!newTemplate.title || !newTemplate.content) {
      setSnackbarMsg('Preencha o título e o conteúdo do template');
      setSnackbarOpen(true);
      return;
    }
    setTemplates([...templates, newTemplate]);
    setNewTemplate({ title: '', content: '' });
    setOpenTemplateDialog(false);
    setSnackbarMsg('Template adicionado com sucesso');
    setSnackbarOpen(true);
  };



const onDragEnd = async (result: DropResult) => {
  const { source, destination, draggableId } = result;

  if (!destination) return;

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) return;

  try {
    // Atualiza no Firebase
    await atualizarStatusCliente(draggableId, destination.droppableId);

    // Atualiza o state local para refletir a mudança
    setClientes(prev =>
      prev.map(cliente =>
        cliente.id === draggableId
          ? { ...cliente, statusCRM: destination.droppableId }
          : cliente
      )
    );
  } catch (error) {
    console.error('Erro ao mover cliente:', error);
  }
};

function gerarMensagemIA(cliente: Cliente): string {
  const nome = cliente.proprietarioatual || 'cliente';
  const modelo = cliente.marca_modelo || 'veículo';
  const placa = cliente.placa || '';
  const cidade = cliente.municipio || 'sua cidade';

  const frases = [
    `📢 Olá ${nome}, tudo bem? Identificamos que o ${modelo} placa ${placa} está com pendências. Podemos resolver com parcelamento fácil e seguro.`,
    `✅ ${nome}, temos condições exclusivas para regularizar seu ${modelo}. Atendimento rápido e com parcelamento.`,
    `🚗 Seu ${modelo}, de ${cidade}, pode rodar legalizado. Evite multas e dores de cabeça.`,
  ];

  return frases[Math.floor(Math.random() * frases.length)];
}


 const renderKanbanView = () => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Button
      variant="outlined"
      style={{ borderColor: '#075E54', color: '#075E54', marginTop: 16 }}
      onClick={async () => {
        const novo = prompt("Digite o nome do novo status:");
        if (novo) {
          const novoId = novo.toLowerCase().replace(/\s+/g, '-');
          const jaExiste = statusDisponiveis.some(s => s.value === novoId);
          if (jaExiste) {
            alert("Esse status já existe!");
            return;
          }
          await addStatusExtra(novoId, novo);
          fetchStatus();
        }
      }}
    >
      + Adicionar Coluna
    </Button>

    <Box className={classes.columnContainer}>
      {statusDisponiveis
        .filter(opt => opt.value !== 'todos')
        .map((status) => (
          <Droppable droppableId={status.value} key={status.value}>
            {(provided) => (
              <Box className={classes.column}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography className={classes.columnTitle}>
                    {status.icon}
                    {status.label}
                    <Chip
                      label={clientesFiltrados.filter(c => c.statusCRM === status.value).length}
                      size="small"
                      style={{ marginLeft: 8, background: '#34B7F1', color: 'white' }}
                    />
                  </Typography>
<Button
  size="small"
  variant="outlined"
  style={{ color: '#075E54', borderColor: '#075E54', marginTop: 4 }}
  onClick={() => setEnvioMassa({
    open: true,
    statusSelecionado: status.value,
    mensagem: '',
    enviando: false,
    progresso: 0
  })}
>
  ✉️ Agendar Envio
</Button>

                  {statusExtras.find(e => e.value === status.value) && (
                    <IconButton
                      size="small"
                      onClick={async () => {
                        const confirm = window.confirm("Remover esta coluna?");
                        if (!confirm) return;
                        const extra = statusExtras.find(e => e.value === status.value);
                        if (extra) {
                          await removeStatusExtra(extra.id);
                          setStatusExtras(prev => prev.filter(e => e.id !== extra.id));
                          setStatusDisponiveis(prev => prev.filter(s => s.value !== extra.value));
                        }
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  )}
                </Box>

             <div
  ref={provided.innerRef}
  {...provided.droppableProps}
  className={classes.droppableArea}
>
{clientesFiltrados
  .filter(c => c.statusCRM === status.value)
  .map((cliente, index) => {
    const clienteNumero = normalizarTelefoneBrasil(cliente.fone_celular);
    const pendenteAtual = pendentesIA.find(p =>
      normalizarTelefoneBrasil(p.numero) === clienteNumero
    );

      return (
        <Draggable key={cliente.id} draggableId={String(cliente.id)} index={index}>
          {(provided) => (
            <Card
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={classes.card}
            >
              <Box position="relative">
                <Chip
                  label={status.label}
                  size="small"
                  className={`${classes.statusChip} ${getStatusClass(classes, status.value)}`}
                  style={{ position: 'absolute', top: 8, right: 8 }}
                />
              </Box>

              {/* 🔔 Alerta visual de resposta */}
              {pendenteAtual && (
               <Tooltip title="Nova resposta recebida">
  <Chip
    icon={<BugReportIcon style={{ color: '#FF9800' }} />}

                    label="IA"
                    style={{ backgroundColor: '#FFF3E0', color: '#FF9800', marginBottom: 8 }}
                  />
                </Tooltip>
              )}

              <CardContent>
                {ultimasMensagensRecebidas[cliente.fone_celular.replace(/\D/g, '')] && (
  <Box mt={1}>
    <Typography variant="body2" style={{ fontStyle: 'italic', color: '#333' }}>
      📩 <strong>Última resposta:</strong> {ultimasMensagensRecebidas[cliente.fone_celular.replace(/\D/g, '')]}
    </Typography>
  </Box>
)}

                <Typography variant="h6" className={classes.cardTitle}>
                  {cliente.proprietarioatual}
                </Typography>
                <Typography variant="body2" className={classes.cardField}>
                  <strong>Placa:</strong> {cliente.placa}
                </Typography>
                <Typography variant="body2" className={classes.cardField}>
                  <strong>Renavam:</strong> {cliente.renavam}
                </Typography>
                <Typography variant="body2" className={classes.cardField}>
                  <strong>Marca/Modelo:</strong> {cliente.marca_modelo}
                </Typography>
                <Typography variant="body2" className={classes.cardField}>
                  <strong>Celular:</strong> {cliente.fone_celular}
                </Typography>

                <Box className={classes.cardActions} mt={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Button
                      variant="contained"
                      className={classes.whatsappButton}
                      startIcon={<Message />}
                      onClick={() => abrirEnvioMensagem(cliente.fone_celular)}
                      size="small"
                    >
                      WhatsApp
                    </Button>
                    <Button
                      variant="contained"
                      className={classes.editButton}
                      startIcon={<Edit />}
                      onClick={() => abrirEdicao(cliente)}
                      size="small"
                    >
                      Editar
                    </Button>
                  </Box>

                  <Box className={classes.quickStatus}>
                    {statusDisponiveis
                      .filter(opt => opt.value !== 'todos')
                      .map(option => (
                        <Chip
                          key={option.value}
                          label={option.label}
                          size="small"
                          onClick={() =>
                            cliente.id && atualizarStatusCliente(cliente.id, option.value)
                          }
                          icon={option.icon}
                          variant={cliente.statusCRM === option.value ? 'default' : 'outlined'}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                  </Box>

                  <Button
                    variant="outlined"
                    size="small"
                    style={{ borderColor: '#25D366', color: '#25D366', marginTop: 8 }}
                    onClick={() =>
                      setChatAberto({
                        numero: cliente.fone_celular,
                        nome: cliente.proprietarioatual,
                      })
                    }
                  >
                    💬 Chat
                  </Button>
                </Box>
{/* 🧠 Sugestão IA e botões */}
{pendenteAtual && (
  <Box mt={2} p={2} bgcolor="#FFF8E1" borderRadius={8}>
    <Typography variant="subtitle2" gutterBottom>
      🧠 Sugestão IA:
    </Typography>

    <Typography variant="body2" style={{ marginBottom: 8 }}>
      {gerarMensagemIA(cliente)}
    </Typography>

    <Box display="flex" style={{ gap:2}}>
      <Button
        size="small"
        variant="contained"
        onClick={async () => {
          const mensagemIA = gerarMensagemIA(cliente);
          try {
            await sendMessage(cliente.fone_celular, mensagemIA);

            const db = getFirestore(app);
            await setDoc(doc(db, 'HistoricoSMSGemini', `${cliente.id}-${Date.now()}`), {
              numero: cliente.fone_celular,
              clienteId: cliente.id,
              mensagem: mensagemIA,
              respostaAutomatica: true,
              timestamp: new Date().toISOString(),
            });

            // Remove pendência com deleteDoc
            const pendenteRef = doc(db, 'ClientesPendentesIA', pendenteAtual.numero);
            await deleteDoc(pendenteRef);
          } catch (e) {
            console.error('Erro ao enviar resposta IA:', e);
          }
        }}
        style={{ background: '#4CAF50', color: 'white' }}
      >
        Enviar
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={async () => {
          const db = getFirestore(app);
          const pendenteRef = doc(db, 'ClientesPendentesIA', pendenteAtual.numero);
          await deleteDoc(pendenteRef);
        }}
        style={{ color: '#F44336' }}
      >
        Ignorar
      </Button>
    </Box>
  </Box>
)}
{ultimasMensagensRecebidas[cliente.fone_celular.replace(/\D/g, '')] && (
  <Box mt={1} p={2} bgcolor="#FFF8E1" borderRadius={8}>
    <Typography variant="subtitle2">💬 IA sugere:</Typography>
    <Typography variant="body2" gutterBottom>
      {gerarMensagemIA(cliente)}
    </Typography>
    <Box display="flex" style={{ gap:2 }}>
      <Button
        size="small"
        variant="contained"
        onClick={async () => {
          await sendMessage(cliente.fone_celular, gerarMensagemIA(cliente));
          const db = getFirestore(app);
          await setDoc(doc(db, 'HistoricoSMSGemini', `${cliente.id}-${Date.now()}`), {
            clienteId: cliente.id,
            numero: cliente.fone_celular,
            mensagem: gerarMensagemIA(cliente),
            respostaAutomatica: true,
            timestamp: new Date().toISOString(),
          });
        }}
        style={{ backgroundColor: '#4CAF50', color: 'white' }}
      >
        Enviar resposta
      </Button>
      <Button
        size="small"
        variant="outlined"
        style={{ color: '#F44336' }}
        onClick={() => {
          // Ignorar sugestão
        }}
      >
        Ignorar
      </Button>
    </Box>
  </Box>
)}

              </CardContent>
            </Card>
          )}
        </Draggable>
      );
    })}
  {provided.placeholder}
</div>

              </Box>
            )}
          </Droppable>
        ))}
    </Box>
  </DragDropContext>
);



  const renderListView = () => (
    <TableContainer component={Box} sx={{ bgcolor: 'white', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}>Proprietário</TableCell>
            <TableCell className={classes.tableCell}>Placa</TableCell>
            <TableCell className={classes.tableCell}>Marca/Modelo</TableCell>
            <TableCell className={classes.tableCell}>Celular</TableCell>
            <TableCell className={classes.tableCell}>Status</TableCell>
            <TableCell className={classes.tableCell}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientesPaginados.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell className={classes.tableCell}>{cliente.proprietarioatual}</TableCell>
              <TableCell className={classes.tableCell}>{cliente.placa}</TableCell>
              <TableCell className={classes.tableCell}>{cliente.marca_modelo}</TableCell>
              <TableCell className={classes.tableCell}>{cliente.fone_celular}</TableCell>
              <TableCell className={classes.tableCell}>
                <Chip
                  label={STATUS_OPTIONS.find(s => s.value === cliente.statusCRM)?.label || 'Novo'}
                  size="small"
                  className={`${classes.statusChip} ${getStatusClass(classes, cliente.statusCRM)}`}
                />
              </TableCell>
              <TableCell className={classes.tableCell}>
                <Button
                  variant="contained"
                  className={classes.whatsappButton}
                  startIcon={<Message />}
                  onClick={() => abrirEnvioMensagem(cliente.fone_celular)}
                  size="small"
                >
                  WhatsApp
                </Button>
                <Button
                  variant="contained"
                  className={classes.editButton}
                  startIcon={<Edit />}
                  onClick={() => abrirEdicao(cliente)}
                  size="small"
                  style={{ marginLeft: 8 }}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  style={{ borderColor: '#25D366', color: '#25D366', marginLeft: 8 }}
                  onClick={() => setChatAberto({ numero: cliente.fone_celular, nome: cliente.proprietarioatual })}
                >
                  💬 Chat
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress style={{ color: '#25D366' }} />
      </Box>
    );
  }

  return (
  <Box className={classes.pageWrapper}>



      <Box maxWidth={1400} margin="0 auto">
        <Box mb={4}>
          <Typography variant="h4" className={classes.sectionHeader} style={{ color: '#075E54' }}>
            Lista de Contatos
            <Chip 
              label={`${clientesFiltrados.length} contatos`}
              size="small"
              style={{ marginLeft: 16, background: '#34B7F1', color: 'white' }}
            />
          </Typography>
          <Button
  variant="contained"
  style={{
    backgroundColor: localStorage.getItem('iaAtiva') === 'true' ? '#4CAF50' : '#F44336',
    color: 'white',
    marginTop: 8,
    marginBottom: 16
  }}
  onClick={() => {
    const novaIA = localStorage.getItem('iaAtiva') !== 'true';
    localStorage.setItem('iaAtiva', String(novaIA));
    window.location.reload(); // recarrega para aplicar
  }}
>
  {localStorage.getItem('iaAtiva') === 'true' ? '🧠 Desativar IA' : '🤖 Ativar IA'}
</Button>

          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} style={{ gap: 16 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="🔍 Filtrar por placa, nome ou município"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className={classes.filterBox}
              InputProps={{
                style: {
                  borderRadius: 50,
                  backgroundColor: 'white',
                }
              }}
            />
            
            <FormControl variant="outlined" className={classes.statusSelect}>
              <InputLabel>Status CRM</InputLabel>
              <Select
                value={statusCRM}
                onChange={handleStatusChange}
                label="Status CRM"
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box display="flex" alignItems="center">
                      {option.icon && React.cloneElement(option.icon, { style: { marginRight: 8 } })}
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              className={classes.massSendButton}
              startIcon={<Send />}
              onClick={() => setEnvioMassa(prev => ({ ...prev, open: true }))}
            >
              Enviar em Massa
            </Button>

            <Box className={classes.viewToggle}>
              <Button
                variant="contained"
                startIcon={viewMode === 'kanban' ? <ListIcon /> : <ViewModule />}
                onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')}
              >
                {viewMode === 'kanban' ? 'Lista' : 'Kanban'}
              </Button>
            </Box>
          </Box>
        </Box>
{viewMode === 'kanban' ? renderKanbanView() : renderListView()}

{viewMode === 'list' && totalPaginas > 1 && (
  <Box mt={4} display="flex" justifyContent="center" alignItems="center">
    <Button
      className={classes.paginationButton}
      disabled={paginaAtual === 1}
      onClick={() => setPaginaAtual(p => p - 1)}
    >
      &lt;
    </Button>
    
    {Array.from({ length: Math.min(5, totalPaginas) }, (item, index: number) => {
      let pageNum: number;
      if (totalPaginas <= 5) {
        pageNum = index + 1;
      } else if (paginaAtual <= 3) {
        pageNum = index + 1;
      } else if (paginaAtual >= totalPaginas - 2) {
        pageNum = totalPaginas - 4 + index;
      } else {
        pageNum = paginaAtual - 2 + index;
      }
      
      return (
        <Button
          key={pageNum}
          className={`${classes.paginationButton} ${paginaAtual === pageNum ? classes.activePage : ''}`}
          onClick={() => setPaginaAtual(pageNum)}
        >
          {pageNum}
        </Button>
      );
    })}
    
    <Button
      className={classes.paginationButton}
      disabled={paginaAtual === totalPaginas}
      onClick={() => setPaginaAtual(p => p + 1)}
    >
      &gt;
    </Button>
  </Box>
)}

        <Fab color="primary" className={classes.addButton} onClick={() => {
          setNovoCliente({
            placa: '', 
            renavam: '', 
            proprietarioatual: '', 
            marca_modelo: '', 
            origem: '', 
            municipio: '',
            fone_residencial: '', 
            fone_comercial: '', 
            fone_celular: '', 
            usuario: '',
            statusCRM: 'novo',
            dataAtualizacao: new Date().toISOString()
          });
          setModoEdicao(false);
          setDocIdEdicao(null);
          setOpenDialog(true);
        }}>
          <Add />
        </Fab>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle className={classes.dialogTitle}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{modoEdicao ? 'Editar Contato' : 'Adicionar Novo Contato'}</Typography>
              <IconButton onClick={() => setOpenDialog(false)} style={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent className={classes.dialogContent} style={{ padding: 24 }}>
      


            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={novoCliente.statusCRM || 'novo'}
                    onChange={(e) => setNovoCliente({...novoCliente, statusCRM: e.target.value as string})}
                    label="Status"
                  >
                    {statusDisponiveis.filter(opt => opt.value !== 'todos').map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box display="flex" alignItems="center">
                          {option.icon && React.cloneElement(option.icon, { style: { marginRight: 8 } })}
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {Object.entries(novoCliente).map(([chave, valor]) => {
                if (chave === 'id' || chave === 'statusCRM' || chave === 'dataAtualizacao') return null;
                return (
                  <Grid item xs={12} sm={6} key={chave}>
                    <TextField
                      fullWidth
                      label={chave.replace(/_/g, ' ')}
                      value={valor}
                      variant="outlined"
                      onChange={(e) => setNovoCliente({ ...novoCliente, [chave]: e.target.value })}
                      {...(chave === 'fone_celular' && {
                        helperText: isTelefoneValido(novoCliente.fone_celular)
                          ? 'Digite o número com DDD. Ex: 48999999999'
                          : 'Número deve ter 11 dígitos.',
                        error: novoCliente.fone_celular !== '' && !isTelefoneValido(novoCliente.fone_celular),
                      })}
                      style={{ marginBottom: 16 }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button onClick={() => setOpenDialog(false)} style={{ color: '#555' }}>
              Cancelar
            </Button>
            <Button 
              onClick={async () => {
                const db = getFirestore(app);
                try {
                  const { id, ...clienteSemId } = novoCliente;
                  if (modoEdicao && docIdEdicao) {
                    const docRef = doc(db, 'DadosclientesExtraidos', docIdEdicao);
                    await updateDoc(docRef, clienteSemId);
                    setClientes(clientes.map(c => c.id === docIdEdicao ? { ...novoCliente, id: docIdEdicao } : c));
                    setSnackbarMsg('Cliente atualizado com sucesso!');
                  } else {
                    const newDocRef = await addDoc(collection(db, 'DadosclientesExtraidos'), {
                      ...clienteSemId,
                      dataAtualizacao: new Date().toISOString()
                    });
                    setClientes([...clientes, { ...clienteSemId, id: newDocRef.id }]);
                    setSnackbarMsg('Cliente adicionado com sucesso!');
                  }
                  setSnackbarOpen(true);
                  setOpenDialog(false);
                } catch {
                  setSnackbarMsg('Erro ao salvar cliente');
                  setSnackbarOpen(true);
                }
              }} 
              color="primary" 
              variant="contained"
              style={{ background: '#25D366' }}
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openMensagem} onClose={() => setOpenMensagem(false)} className={classes.messageDialog} fullWidth maxWidth="sm">
          <Box className={classes.messageHeader}>
            <Typography variant="h6">Enviar Mensagem WhatsApp</Typography>
            <IconButton onClick={() => setOpenMensagem(false)} style={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
          <Box className={classes.messageContent}>
            <Typography variant="body1" gutterBottom>
              Enviando para: {numeroDestino}
            </Typography>
            <TextField
              fullWidth
              multiline
              label="Digite sua mensagem"
              rows={6}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              variant="outlined"
              className={classes.messageInput}
            />
            
            <Box className={classes.templatesContainer}>
              <Box 
                className={classes.templateHeader} 
                onClick={() => setTemplatesOpen(!templatesOpen)}
              >
                <Typography variant="subtitle1">
                  <InsertDriveFile style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  Modelos de Mensagem
                </Typography>
                {templatesOpen ? <ExpandLess /> : <ExpandMore />}
              </Box>
              
              <Collapse in={templatesOpen}>
                <List className={classes.templateList} dense>
                  {templates.map((template, index) => (
                    <React.Fragment key={index}>
                      <ListItem 
                        className={classes.templateItem}
                        onClick={() => {
                          const clienteAtual = clientes.find(c => c.fone_celular === numeroDestino);
                          if (clienteAtual) {
                            setMensagem(applyTemplate(template, clienteAtual));
                          }
                        }}
                      >
                        <ListItemText
                          primary={template.title}
                          secondary={template.content.length > 50 
                            ? `${template.content.substring(0, 50)}...` 
                            : template.content}
                        />
                      </ListItem>
                      {index < templates.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            </Box>
            
            <Box className={classes.templateActions}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => setOpenTemplateDialog(true)}
                className={classes.addTemplateButton}
              >
                Adicionar Modelo
              </Button>
            </Box>
          </Box>
          <DialogActions className={classes.dialogActions}>
            <Button onClick={() => setOpenMensagem(false)} style={{ color: '#555' }}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmarEnvioMensagem} 
              variant="contained"
              startIcon={<Send />}
              style={{ background: '#25D366', color: 'white' }}
            >
              Enviar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={envioMassa.open} 
          onClose={() => !envioMassa.enviando && setEnvioMassa(prev => ({ ...prev, open: false }))}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle className={classes.dialogTitle}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Enviar Mensagem em Massa</Typography>
              <IconButton 
                onClick={() => !envioMassa.enviando && setEnvioMassa(prev => ({ ...prev, open: false }))}
                style={{ color: 'white' }}
                disabled={envioMassa.enviando}
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent className={classes.dialogContent} style={{ padding: 24 }}>
                  <TextField
  label="Agendar para"
  type="datetime-local"
  fullWidth
  value={dataHoraAgendada}
  onChange={(e) => setDataHoraAgendada(e.target.value)}
  InputLabelProps={{ shrink: true }}
  margin="normal"
  disabled={envioMassa.enviando}
/>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Status dos Clientes</InputLabel>
              <Select
                value={envioMassa.statusSelecionado}
                onChange={(e) => setEnvioMassa(prev => ({ ...prev, statusSelecionado: e.target.value as string }))}
                label="Status dos Clientes"
                disabled={envioMassa.enviando}
              >
                {statusDisponiveis.filter(opt => opt.value !== 'todos').map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box display="flex" alignItems="center">
                      {option.icon && React.cloneElement(option.icon, { style: { marginRight: 8 } })}
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              label="Mensagem para enviar"
              rows={6}
              value={envioMassa.mensagem}
              onChange={(e) => setEnvioMassa(prev => ({ ...prev, mensagem: e.target.value }))}
              variant="outlined"
              className={classes.messageInput}
              disabled={envioMassa.enviando}
              margin="normal"
            />

            <Box className={classes.templatesContainer}>
              <Box 
                className={classes.templateHeader} 
                onClick={() => !envioMassa.enviando && setTemplatesOpen(!templatesOpen)}
              >
                <Typography variant="subtitle1">
                  <InsertDriveFile style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  Modelos de Mensagem
                </Typography>
                {templatesOpen ? <ExpandLess /> : <ExpandMore />}
              </Box>
              
              <Collapse in={templatesOpen}>
                <List className={classes.templateList} dense>
                  {templates.map((template, index) => (
                    <React.Fragment key={index}>
                      <ListItem 
                        className={classes.templateItem}
                        onClick={() => {
                          if (!envioMassa.enviando) {
                            setEnvioMassa(prev => ({ ...prev, mensagem: template.content }));
                          }
                        }}
                      >
                        <ListItemText
                          primary={template.title}
                          secondary={template.content.length > 50 
                            ? `${template.content.substring(0, 50)}...` 
                            : template.content}
                        />
                      </ListItem>
                      {index < templates.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            </Box>

            {envioMassa.enviando && (
              <Box className={classes.progressContainer}>
                <Typography variant="body2" gutterBottom>
                  Enviando mensagens... {envioMassa.progresso}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={envioMassa.progresso} 
                  style={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button 
              onClick={() => !envioMassa.enviando && setEnvioMassa(prev => ({ ...prev, open: false }))}
              style={{ color: '#555' }}
              disabled={envioMassa.enviando}
            >
              Cancelar
            </Button>
            <Button 
              onClick={enviarMensagensMassa} 
              variant="contained"
              startIcon={<Send />}
              style={{ background: '#25D366', color: 'white' }}
              disabled={envioMassa.enviando || !envioMassa.mensagem.trim()}
            >
              {envioMassa.enviando ? 'Enviando...' : 'Iniciar Envio em Massa'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={openTemplateDialog} 
          onClose={() => setOpenTemplateDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle className={classes.dialogTitle}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Adicionar Novo Modelo</Typography>
              <IconButton onClick={() => setOpenTemplateDialog(false)} style={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent className={classes.dialogContent} style={{ padding: 24 }}>
            <TextField
              fullWidth
              label="Título do Modelo"
              value={newTemplate.title}
              onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
              variant="outlined"
              margin="normal"
            />
            
            <TextField
              fullWidth
              multiline
              label="Conteúdo do Modelo"
              rows={6}
              value={newTemplate.content}
              onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
              variant="outlined"
              margin="normal"
              helperText="Você pode usar placeholders como {nome}, {placa}, {marca_modelo}, etc."
            />
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button onClick={() => setOpenTemplateDialog(false)} style={{ color: '#555' }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddTemplate}
              variant="contained"
              style={{ background: '#25D366', color: 'white' }}
            >
              Salvar Modelo
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMsg}
          action={
            <IconButton size="small" color="inherit" onClick={() => setSnackbarOpen(false)}>
              <Close fontSize="small" />
            </IconButton>
          }
        />

        {chatAberto && (
          <ChatFlutuante
            numero={chatAberto.numero}
            nome={chatAberto.nome}
            onClose={() => setChatAberto(null)}
          />
        )}
      </Box>
    </Box>
  );
};

export default ListaContatosPage;

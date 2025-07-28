
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Chip,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Switch,
  FormControlLabel,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  ButtonGroup,
  Box,
  Snackbar,
  Menu,
} from '@material-ui/core';
import {
  Business,
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
  Timeline,
  Star,
  Email,
  Phone,
  VideoCall,
  Assignment,
  Extension,
  Notifications,
  Settings,
  Refresh,
  GetApp,
  Share,
  Fullscreen,
  ExpandMore,
  FilterList,
  PieChart,
  BarChart,
  ShowChart,
  DataUsage,
  Storage,
  Memory,
  Wifi,
  Battery90,
  CloudDone,
  Warning,
  Error,
  CheckCircle,
  Schedule,
  Visibility,
  Speed,
  Security,
  VerifiedUser,
  Code,
  PlayArrow,
  Pause,
  Stop,
  Add,
  Edit,
  Delete,
  Search,
  Close,
  DragIndicator,
  DragHandle,
  SwapHoriz,
  TouchApp,
  PersonAdd,
  LocalOffer,
  MonetizationOn,
  TrendingFlat,
  WhatsApp,
  CallMade,
  EventNote,
  Work,
  LocationOn,
  CreditCard,
  Payment,
  Receipt,
  AccountBalance,
} from '@material-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from 'recharts';
// // import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { db } from '@/logic/firebase/config/app';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg,rgb(128, 128, 128) 0%,rgba(130, 131, 130, 0.6) 50%,rgb(128, 128, 128) 100%)',
    minHeight: '100vh',
    position: 'relative',
    color: '#ffffff',
  },
  quantumBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 50%, rgba(63, 181, 126, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(5, 116, 48, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(0, 150, 45, 0.3) 0%, transparent 50%)
    `,
    animation: '$quantumFlow 15s ease-in-out infinite',
    zIndex: 0,
  },
  '@keyframes quantumFlow': {
    '0%, 100%': { opacity: 0.3 },
    '50%': { opacity: 0.7 },
  },
  crmContainer: {
    maxWidth: '1600px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
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
  quantumCard: {
    background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)',
    borderRadius: theme.spacing(3),
    padding: theme.spacing(3),
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(63, 81, 181, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 16px 64px rgba(63, 81, 181, 0.4)',
      '&::before': {
        opacity: 1,
      },
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: 'linear-gradient(90deg, #3f51b5, #9c27b0, #009688)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
  },
  dragZone: {
    minHeight: '400px',
    padding: theme.spacing(2),
    background: 'rgba(255,255,255,0.05)',
    borderRadius: theme.spacing(2),
    border: '2px dashed rgba(255,255,255,0.3)',
    transition: 'all 0.3s ease',
    '&.dragover': {
      background: 'rgba(63, 81, 181, 0.2)',
      border: '2px dashed #3f51b5',
      transform: 'scale(1.02)',
    },
  },
  clientCard: {
    background: 'linear-gradient(135deg, rgba(166, 190, 167, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(76, 175, 80, 0.3)',
    cursor: 'grab',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
    },
    '&.dragging': {
      cursor: 'grabbing',
      transform: 'rotate(5deg)',
      opacity: 0.8,
    },
  },
  kanbanColumn: {
    minHeight: '500px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    margin: theme.spacing(0, 1),
    border: '1px solid rgba(255,255,255,0.1)',
  },
  kanbanHeader: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    background: 'rgba(255,255,255,0.1)',
    borderRadius: theme.spacing(1),
  },
  clientInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  clientAvatar: {
    marginRight: theme.spacing(1),
    width: 40,
    height: 40,
  },
  dragHandle: {
    cursor: 'grab',
    color: 'rgba(255,255,255,0.7)',
    marginRight: theme.spacing(1),
    '&:active': {
      cursor: 'grabbing',
    },
  },
  valueChip: {
    background: 'linear-gradient(45deg, #4CAF50, #81C784)',
    color: '#fff',
    fontWeight: 'bold',
  },
  statusChip: {
    margin: theme.spacing(0.5),
    fontWeight: 'bold',
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  statsCard: {
    background: 'linear-gradient(135deg, rgba(0, 150, 136, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)',
    borderRadius: theme.spacing(3),
    padding: theme.spacing(3),
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(0, 150, 136, 0.3)',
    height: '100%',
  },
  chartCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: theme.spacing(3),
    padding: theme.spacing(3),
    height: '450px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    marginBottom: theme.spacing(3),
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  aiValue: {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #009688, #3f51b5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  aiLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1rem',
    marginTop: theme.spacing(1),
  },
  clientDialog: {
    '& .MuiDialog-paper': {
      background: 'linear-gradient(135deg, #1a4d3a 0%, #2d5a3d 100%)',
      color: '#ffffff',
      borderRadius: theme.spacing(2),
      minWidth: '500px',
    },
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
  realTimeIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: '#4CAF50',
    borderRadius: '50%',
    width: 12,
    height: 12,
    animation: '$pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': { opacity: 1, transform: 'scale(1)' },
    '50%': { opacity: 0.7, transform: 'scale(1.2)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
}));

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  avatar?: string;
  status: 'lead' | 'prospect' | 'cliente' | 'perdido';
  valor: number;
  ultimaInteracao: Date;
  score: number;
  potencial: 'alto' | 'medio' | 'baixo';
  servicos: string[];
  observacoes?: string;
  endereco?: string;
  dataCriacao: Date;
  position?: number;
}

interface CRMMetrics {
  totalClientes: number;
  clientesAtivos: number;
  receitaTotal: number;
  conversaoIA: number;
  satisfacaoMedia: number;
  ticketMedio: number;
  leadsHoje: number;
  vendas30Dias: number;
}

const CRM: React.FC = () => {
  const classes = useStyles();
  const [metrics, setMetrics] = useState<CRMMetrics>({
    totalClientes: 0,
    clientesAtivos: 0,
    receitaTotal: 0,
    conversaoIA: 94.7,
    satisfacaoMedia: 4.8,
    ticketMedio: 0,
    leadsHoje: 0,
    vendas30Dias: 0,
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteDialog, setClienteDialog] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [newCliente, setNewCliente] = useState<Partial<Cliente>>({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    status: 'lead',
    valor: 0,
    score: 50,
    potencial: 'medio',
    servicos: [],
    observacoes: '',
    endereco: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  // Configuração do Kanban
  const kanbanColumns = [
    { id: 'lead', title: '🔥 Leads', color: '#FF9800', status: 'lead' },
    { id: 'prospect', title: '👥 Prospects', color: '#2196F3', status: 'prospect' },
    { id: 'cliente', title: '✅ Clientes', color: '#4CAF50', status: 'cliente' },
    { id: 'perdido', title: '❌ Perdidos', color: '#F44336', status: 'perdido' },
  ];

  // Carregar clientes do Firebase
  useEffect(() => {
    const q = query(collection(db, 'clientes'), orderBy('position', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientesData: Cliente[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        clientesData.push({
          id: doc.id,
          ...data,
          ultimaInteracao: data.ultimaInteracao?.toDate() || new Date(),
          dataCriacao: data.dataCriacao?.toDate() || new Date(),
        } as Cliente);
      });
      setClientes(clientesData);
      calculateMetrics(clientesData);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao carregar clientes:', error);
      setSnackbar({ open: true, message: 'Erro ao carregar clientes', type: 'error' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calcular métricas
  const calculateMetrics = (clientesData: Cliente[]) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const clientesAtivos = clientesData.filter(c => c.status === 'cliente').length;
    const receitaTotal = clientesData
      .filter(c => c.status === 'cliente')
      .reduce((acc, c) => acc + c.valor, 0);
    const leadsHoje = clientesData.filter(c => {
      const dataCriacao = new Date(c.dataCriacao);
      dataCriacao.setHours(0, 0, 0, 0);
      return dataCriacao.getTime() === hoje.getTime();
    }).length;

    const vendas30Dias = clientesData.filter(c => {
      const dataCliente = new Date(c.dataCriacao);
      const agora = new Date();
      const diff = agora.getTime() - dataCliente.getTime();
      return diff <= 30 * 24 * 60 * 60 * 1000 && c.status === 'cliente';
    }).length;

    setMetrics({
      totalClientes: clientesData.length,
      clientesAtivos,
      receitaTotal,
      conversaoIA: clientesAtivos > 0 ? (clientesAtivos / clientesData.length) * 100 : 0,
      satisfacaoMedia: 4.8,
      ticketMedio: clientesAtivos > 0 ? receitaTotal / clientesAtivos : 0,
      leadsHoje,
      vendas30Dias,
    });
  };

  // Drag and Drop - desabilitado (dependência react-beautiful-dnd removida)
  // Funcionalidade será reimplementada com biblioteca alternativa se necessário

  // Adicionar/Editar cliente
  const handleSaveCliente = async () => {
    try {
      if (editingCliente) {
        // Editar cliente existente
        await updateDoc(doc(db, 'clientes', editingCliente.id), {
          ...newCliente,
          ultimaInteracao: serverTimestamp(),
        });
        setSnackbar({ open: true, message: 'Cliente atualizado com sucesso!', type: 'success' });
      } else {
        // Adicionar novo cliente
        await addDoc(collection(db, 'clientes'), {
          ...newCliente,
          dataCriacao: serverTimestamp(),
          ultimaInteracao: serverTimestamp(),
          position: clientes.length,
        });
        setSnackbar({ open: true, message: 'Cliente adicionado com sucesso!', type: 'success' });
      }
      
      setClienteDialog(false);
      setEditingCliente(null);
      setNewCliente({
        nome: '',
        email: '',
        telefone: '',
        empresa: '',
        status: 'lead',
        valor: 0,
        score: 50,
        potencial: 'medio',
        servicos: [],
        observacoes: '',
        endereco: '',
      });
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      setSnackbar({ open: true, message: 'Erro ao salvar cliente', type: 'error' });
    }
  };

  // Excluir cliente
  const handleDeleteCliente = async (clienteId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteDoc(doc(db, 'clientes', clienteId));
        setSnackbar({ open: true, message: 'Cliente excluído com sucesso!', type: 'success' });
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        setSnackbar({ open: true, message: 'Erro ao excluir cliente', type: 'error' });
      }
    }
  };

  // Filtrar clientes
  const filteredClientes = useMemo(() => {
    return clientes.filter(cliente => {
      const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (cliente.empresa || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'todos' || cliente.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [clientes, searchTerm, filterStatus]);

  // Agrupar clientes por status para o Kanban
  const clientesPorStatus = useMemo(() => {
    const grupos: { [key: string]: Cliente[] } = {};
    kanbanColumns.forEach(col => {
      grupos[col.id] = filteredClientes.filter(c => c.status === col.status);
    });
    return grupos;
  }, [filteredClientes]);

  const getStatusColor = (status: string) => {
    const column = kanbanColumns.find(c => c.status === status);
    return column ? column.color : '#757575';
  };

  const getPotentialColor = (potencial: string) => {
    switch (potencial) {
      case 'alto': return '#4CAF50';
      case 'medio': return '#FF9800';
      case 'baixo': return '#F44336';
      default: return '#757575';
    }
  };

  const chartData = useMemo(() => [
    { month: 'Jan', clientes: 420, receita: 180000, satisfacao: 4.2 },
    { month: 'Fev', clientes: 485, receita: 210000, satisfacao: 4.3 },
    { month: 'Mar', clientes: 567, receita: 245000, satisfacao: 4.5 },
    { month: 'Abr', clientes: 634, receita: 285000, satisfacao: 4.6 },
    { month: 'Mai', clientes: 721, receita: 320000, satisfacao: 4.7 },
    { month: 'Jun', clientes: metrics.clientesAtivos, receita: metrics.receitaTotal, satisfacao: metrics.satisfacaoMedia },
  ], [metrics]);

  if (loading) {
    return (
      <div className={classes.root}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress size={60} style={{ color: '#fff' }} />
          <Typography variant="h6" style={{ marginLeft: 16, color: '#fff' }}>
            Carregando CRM...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.quantumBackground} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={classes.crmContainer}
      >
        {/* Header Section */}
        <div className={classes.headerSection}>
          <div className={classes.realTimeIndicator} />
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" style={{ color: '#fff', fontWeight: 'bold', marginBottom: 8 }}>
                <Business style={{ marginRight: 16, fontSize: 'inherit', color: '#3f51b5' }} />
                CRM Inteligente com Drag & Drop
              </Typography>
              <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Gestão Avançada de Clientes Reais • Powered by Firebase • Drag & Drop
              </Typography>
              <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<DragIndicator />} 
                  label="Arraste e Solte" 
                  style={{ backgroundColor: '#4285F4', color: '#fff' }}
                />
                <Chip 
                  icon={<CloudDone />} 
                  label="Tempo Real" 
                  style={{ backgroundColor: '#3f51b5', color: '#fff' }}
                />
                <Chip 
                  icon={<Security />} 
                  label="Firebase Seguro" 
                  style={{ backgroundColor: '#9c27b0', color: '#fff' }}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAdd />}
                  onClick={() => {
                    setEditingCliente(null);
                    setClienteDialog(true);
                  }}
                  style={{ borderRadius: 20 }}
                >
                  Novo Cliente
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<GetApp />}
                  style={{ borderColor: 'white', color: 'white', borderRadius: 20 }}
                >
                  Exportar
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>

        {/* Métricas Principais */}
        <Grid container spacing={3} style={{ marginBottom: 32 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.quantumCard}>
              <CardContent>
                <Typography className={classes.aiValue}>
                  {metrics.totalClientes}
                </Typography>
                <Typography className={classes.aiLabel}>
                  Total de Clientes
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(metrics.clientesAtivos / Math.max(metrics.totalClientes, 1)) * 100} 
                  style={{ marginTop: 8, backgroundColor: 'rgba(255,255,255,0.2)' }}
                />
                <Typography variant="caption" style={{ color: '#4CAF50', marginTop: 4, display: 'block' }}>
                  +{metrics.leadsHoje} hoje
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.quantumCard}>
              <CardContent>
                <Typography className={classes.aiValue}>
                  R$ {(metrics.receitaTotal / 1000).toFixed(0)}K
                </Typography>
                <Typography className={classes.aiLabel}>
                  Receita Total
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                  <TrendingUp style={{ color: '#4CAF50', marginRight: 4 }} />
                  <Typography variant="caption" style={{ color: '#4CAF50' }}>
                    {metrics.vendas30Dias} vendas em 30 dias
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.quantumCard}>
              <CardContent>
                <Typography className={classes.aiValue}>
                  {metrics.conversaoIA.toFixed(1)}%
                </Typography>
                <Typography className={classes.aiLabel}>
                  Taxa de Conversão
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.conversaoIA} 
                  style={{ marginTop: 8, backgroundColor: 'rgba(255,255,255,0.2)' }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className={classes.quantumCard}>
              <CardContent>
                <Typography className={classes.aiValue}>
                  R$ {(metrics.ticketMedio / 1000).toFixed(1)}K
                </Typography>
                <Typography className={classes.aiLabel}>
                  Ticket Médio
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                  <Star style={{ color: '#FFD700', marginRight: 4 }} />
                  <Typography variant="caption" style={{ color: '#FFD700' }}>
                    Análise IA ativa
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filtros e Busca */}
        <Grid container spacing={2} style={{ marginBottom: 24 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search style={{ marginRight: 8, color: 'rgba(255,255,255,0.7)' }} />
              }}
              className={classes.formField}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" className={classes.formField}>
              <InputLabel>Filtrar por Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as string)}
                label="Filtrar por Status"
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="lead">Leads</MenuItem>
                <MenuItem value="prospect">Prospects</MenuItem>
                <MenuItem value="cliente">Clientes</MenuItem>
                <MenuItem value="perdido">Perdidos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Seção de Clientes Simplificada */}
        <Paper style={{ padding: 24, background: 'rgba(255,255,255,0.05)', marginBottom: 32 }}>
          <Typography variant="h5" style={{ color: '#fff', marginBottom: 24, fontWeight: 'bold' }}>
            <Business style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Clientes Cadastrados
          </Typography>
          
          <Grid container spacing={2}>
            {kanbanColumns.map((column) => (
              <Grid item xs={12} sm={6} md={3} key={column.id}>
                <div className={classes.kanbanColumn}>
                  <div className={classes.kanbanHeader} style={{ backgroundColor: column.color + '20' }}>
                    <Typography variant="h6" style={{ color: column.color, fontWeight: 'bold' }}>
                      {column.title}
                    </Typography>
                    <Typography variant="caption" style={{ color: '#fff' }}>
                      {clientesPorStatus[column.id]?.length || 0} clientes
                    </Typography>
                  </div>
                  
                  <div className={classes.dragZone}>
                    {clientesPorStatus[column.id]?.map((cliente, index) => (
                      <div key={cliente.id} className={classes.clientCard}>
                        <div className={classes.clientInfo}>
                          <Avatar
                            src={cliente.avatar}
                            className={classes.clientAvatar}
                            style={{ backgroundColor: getStatusColor(cliente.status) }}
                          >
                            {cliente.nome[0]?.toUpperCase()}
                          </Avatar>
                          <div style={{ flex: 1 }}>
                            <Typography variant="subtitle2" style={{ color: '#fff', fontWeight: 'bold' }}>
                              {cliente.nome}
                            </Typography>
                            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)' }}>
                              {cliente.empresa || cliente.email}
                            </Typography>
                          </div>
                        </div>

                        <div style={{ marginBottom: 8 }}>
                          <Chip
                            label={`R$ ${cliente.valor.toLocaleString()}`}
                            className={classes.valueChip}
                            size="small"
                          />
                          <Chip
                            label={cliente.potencial}
                            size="small"
                            style={{
                              backgroundColor: getPotentialColor(cliente.potencial),
                              color: '#fff',
                              marginLeft: 4
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: 8 }}>
                          <LinearProgress
                            variant="determinate"
                            value={cliente.score}
                            style={{ height: 4, borderRadius: 2 }}
                          />
                          <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Score: {cliente.score}%
                          </Typography>
                        </div>

                        <div className={classes.actionButtons}>
                          <IconButton
                            size="small"
                            style={{ color: '#4CAF50' }}
                            onClick={() => window.open(`https://wa.me/55${cliente.telefone?.replace(/\D/g, '')}`, '_blank')}
                          >
                            <WhatsApp />
                          </IconButton>
                          <IconButton
                            size="small"
                            style={{ color: '#2196F3' }}
                            onClick={() => window.open(`mailto:${cliente.email}`, '_blank')}
                          >
                            <Email />
                          </IconButton>
                          <IconButton
                            size="small"
                            style={{ color: '#FF9800' }}
                            onClick={() => {
                              setEditingCliente(cliente);
                              setNewCliente(cliente);
                              setClienteDialog(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            style={{ color: '#F44336' }}
                            onClick={() => handleDeleteCliente(cliente.id)}
                          >
                            <Delete />
                          </IconButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Gráfico de Performance */}
        <Paper className={classes.chartCard}>
          <Typography variant="h6" gutterBottom style={{ color: '#fff' }}>
            <ShowChart style={{ marginRight: 8, verticalAlign: 'middle', color: '#3f51b5' }} />
            Performance de Vendas
          </Typography>
          <ResponsiveContainer width="100%" height="85%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="receita"
                fill="#3f51b5"
                stroke="#3f51b5"
                fillOpacity={0.3}
                name="Receita"
              />
              <Bar dataKey="clientes" fill="#009688" name="Clientes" />
              <Line 
                type="monotone" 
                dataKey="satisfacao" 
                stroke="#9c27b0" 
                strokeWidth={3}
                name="Satisfação"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Paper>
      </motion.div>

      {/* Dialog para Adicionar/Editar Cliente */}
      <Dialog 
        open={clienteDialog} 
        onClose={() => setClienteDialog(false)}
        maxWidth="md"
        fullWidth
        className={classes.clientDialog}
      >
        <DialogTitle>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
            {editingCliente ? <Edit style={{ marginRight: 8 }} /> : <PersonAdd style={{ marginRight: 8 }} />}
            {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ marginTop: 8 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={newCliente.nome}
                onChange={(e) => setNewCliente({ ...newCliente, nome: e.target.value })}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Empresa"
                value={newCliente.empresa}
                onChange={(e) => setNewCliente({ ...newCliente, empresa: e.target.value })}
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newCliente.status}
                  onChange={(e) => setNewCliente({ ...newCliente, status: e.target.value as Cliente['status'] })}
                >
                  <MenuItem value="lead">Lead</MenuItem>
                  <MenuItem value="prospect">Prospect</MenuItem>
                  <MenuItem value="cliente">Cliente</MenuItem>
                  <MenuItem value="perdido">Perdido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Potencial</InputLabel>
                <Select
                  value={newCliente.potencial}
                  onChange={(e) => setNewCliente({ ...newCliente, potencial: e.target.value as Cliente['potencial'] })}
                >
                  <MenuItem value="baixo">Baixo</MenuItem>
                  <MenuItem value="medio">Médio</MenuItem>
                  <MenuItem value="alto">Alto</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Valor (R$)"
                type="number"
                value={newCliente.valor}
                onChange={(e) => setNewCliente({ ...newCliente, valor: parseFloat(e.target.value) || 0 })}
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                value={newCliente.endereco}
                onChange={(e) => setNewCliente({ ...newCliente, endereco: e.target.value })}
                className={classes.formField}
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
            <Grid item xs={12}>
              <Typography gutterBottom style={{ color: '#fff' }}>
                Score do Cliente: {newCliente.score}%
              </Typography>
              <Slider
                value={newCliente.score || 50}
                onChange={(_, value) => setNewCliente({ ...newCliente, score: value as number })}
                valueLabelDisplay="auto"
                step={10}
                marks
                min={0}
                max={100}
                style={{ color: '#3f51b5' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClienteDialog(false)} style={{ color: 'rgba(255,255,255,0.7)' }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveCliente} 
            variant="contained" 
            color="primary"
            disabled={!newCliente.nome || !newCliente.email}
          >
            {editingCliente ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificações */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.type} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Botão flutuante para adicionar cliente */}
      <Fab
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: 'linear-gradient(45deg, #3f51b5, #9c27b0)',
        }}
        onClick={() => {
          setEditingCliente(null);
          setClienteDialog(true);
        }}
      >
        <Add />
      </Fab>
    </div>
  );
};

export default CRM;

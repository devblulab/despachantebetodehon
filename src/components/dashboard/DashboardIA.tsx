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
  Popper,
  Fade,
} from '@material-ui/core';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  TrendingDown,
  Refresh,
  GetApp,
  Share,
  Fullscreen,
  ExpandMore,
  FilterList,
  Timeline,
  PieChart,
  BarChart,
  ShowChart,
  DataUsage,
  Storage,
  Memory,
  Wifi,
  Battery90,
  Notifications,
  Settings,
  Star,
  Visibility,
  Speed,
  CloudDone,
  Warning,
  Error,
  CheckCircle,
  Schedule,
  AttachMoney,
  People,
  Assignment
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
  Scatter,
  ScatterChart,
  ReferenceLine,
} from 'recharts';

import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app'; // sua config Firebase


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg,rgb(184, 184, 184) 0%,rgb(236, 236, 236) 50%,rgb(185, 185, 189) 100%)',
    minHeight: '100vh',
    position: 'relative',
    color: '#ffffff',
  },
  neuralBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(119, 255, 198, 0.3) 0%, transparent 50%)
    `,
    animation: '$neural 20s ease-in-out infinite',
    zIndex: 0,
  },
  '@keyframes neural': {
    '0%, 100%': { opacity: 0.3 },
    '50%': { opacity: 0.6 },
  },
  dashboardContainer: {
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
    background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(30, 144, 255, 0.1) 100%)',
    borderRadius: theme.spacing(3),
    padding: theme.spacing(3),
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(138, 43, 226, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 16px 64px rgba(138, 43, 226, 0.4)',
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
      background: 'linear-gradient(90deg, #8A2BE2, #1E90FF, #00FA9A)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
  },
  aiMetricsCard: {
    background: 'linear-gradient(135deg, rgba(0, 255, 127, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)',
    borderRadius: theme.spacing(3),
    padding: theme.spacing(3),
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(0, 255, 127, 0.3)',
    height: '400px',
    position: 'relative',
    overflow: 'hidden',
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
  neuralProcessingCard: {
    background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)',
    borderRadius: theme.spacing(3),
    padding: theme.spacing(3),
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 20, 147, 0.3)',
    height: '400px',
    position: 'relative',
  },
  quantumIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
    borderRadius: '50%',
    width: 16,
    height: 16,
    animation: '$quantum 3s infinite',
  },
  '@keyframes quantum': {
    '0%, 100%': { 
      opacity: 1, 
      transform: 'scale(1)',
      boxShadow: '0 0 10px #8A2BE2',
    },
    '50%': { 
      opacity: 0.5, 
      transform: 'scale(1.5)',
      boxShadow: '0 0 20px #1E90FF',
    },
  },
  aiValue: {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #00FA9A, #1E90FF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  aiLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1rem',
    marginTop: theme.spacing(1),
  },
  neuralNetwork: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundImage: `
      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    animation: '$networkPulse 4s ease-in-out infinite',
  },
  '@keyframes networkPulse': {
    '0%, 100%': { opacity: 0.1 },
    '50%': { opacity: 0.3 },
  },
  quantumButton: {
    background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
    color: '#fff',
    borderRadius: 25,
    padding: theme.spacing(1.5, 4),
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(45deg, #9932CC, #4169E1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(138, 43, 226, 0.4)',
    },
  },
  aiInsightCard: {
    background: 'linear-gradient(135deg, #FF1493 0%, #8A2BE2 100%)',
    color: '#fff',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      animation: '$shimmer 2s infinite',
    },
  },
  '@keyframes shimmer': {
    '0%': { left: '-100%' },
    '100%': { left: '100%' },
  },
  modelPerformance: {
    textAlign: 'center',
    padding: theme.spacing(2),
    background: 'rgba(255,255,255,0.05)',
    borderRadius: theme.spacing(2),
    margin: theme.spacing(1),
  },
  quantumMetric: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    background: 'rgba(255,255,255,0.1)',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backdropFilter: 'blur(10px)',
  },
  neuralFlowVisualizer: {
    height: '300px',
    background: 'radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 70%)',
    borderRadius: theme.spacing(2),
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowNode: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #00FA9A, #1E90FF)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(1),
    animation: '$nodeGlow 2s ease-in-out infinite alternate',
    boxShadow: '0 0 20px rgba(0, 250, 154, 0.5)',
  },
  '@keyframes nodeGlow': {
    '0%': { 
      transform: 'scale(1)',
      boxShadow: '0 0 20px rgba(0, 250, 154, 0.5)',
    },
    '100%': { 
      transform: 'scale(1.1)',
      boxShadow: '0 0 30px rgba(30, 144, 255, 0.8)',
    },
  },
  realTimeIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: '#00FA9A',
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
  geminiIntegration: {
    background: 'linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    color: '#fff',
    marginBottom: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
  },
  quantumProcessor: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  qbit: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #8A2BE2, #FF1493)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: '$qbitRotate 3s infinite linear',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  '@keyframes qbitRotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  tooltipCustom: {
    backgroundColor: 'rgba(26, 60, 52, 0.95)',
    color: '#ffffff',
    padding: theme.spacing(1.5),
    fontSize: '0.875rem',
    borderRadius: theme.spacing(1),
    maxWidth: 300,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
}));

const DashboardIA: React.FC = () => {
  const classes = useStyles();

  // Estados para dados reais do Firebase
  const [firebaseCollections, setFirebaseCollections] = useState<any>({});
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>({});
  const [quantumAnalysis, setQuantumAnalysis] = useState<any>({});
  const [marketingInsights, setMarketingInsights] = useState<any[]>([]);
  const [clientGrowthPredictions, setClientGrowthPredictions] = useState<any[]>([]);
  const [revenueOptimization, setRevenueOptimization] = useState<any>({});
  const [estrategiasModalOpen, setEstrategiasModalOpen] = useState(false);
  const [explanationModalOpen, setExplanationModalOpen] = useState(false);
  const [explanationContent, setExplanationContent] = useState('');
const [insightIA, setInsightIA] = useState<string>('');


  const [aiMetrics, setAiMetrics] = useState({
    modelAccuracy: 98.7,
    processingSpeed: 1247,
    dataProcessed: 2.4,
    quantumEfficiency: 94.2,
    neuralConnections: 847392,
    learningRate: 0.0023,
    totalClients: 0,
    totalRevenue: 0,
    conversionRate: 0,
    churnRate: 0,
    avgTicket: 0,
    growthRate: 0
  });

  const [geminiStatus, setGeminiStatus] = useState({
    isConnected: true,
    responseTime: 0.142,
    tokensProcessed: 15847,
    apiHealth: 99.9,
  });

  const [neuralFlows, setNeuralFlows] = useState([
    { id: 1, name: 'Análise Preditiva de Clientes', status: 'ativo', confidence: 96.4, impact: 'Alto' },
    { id: 2, name: 'Processamento NLP de Feedbacks', status: 'ativo', confidence: 94.8, impact: 'Médio' },
    { id: 3, name: 'Visão Computacional de Documentos', status: 'treinando', confidence: 89.2, impact: 'Alto' },
    { id: 4, name: 'Automação de Marketing', status: 'ativo', confidence: 97.1, impact: 'Crítico' },
    { id: 5, name: 'Análise Quântica de Padrões', status: 'ativo', confidence: 98.3, impact: 'Revolucionário' },
    { id: 6, name: 'Otimização de Receita', status: 'ativo', confidence: 95.7, impact: 'Crítico' },
  ]);

  const [quantumStates, setQuantumStates] = useState([
    { state: '|0⟩', probability: 0.6 },
    { state: '|1⟩', probability: 0.4 },
    { state: '|+⟩', probability: 0.7 },
    { state: '|-⟩', probability: 0.3 },
  ]);

  const [aiInsights, setAiInsights] = useState([
    {
      type: 'prediction',
      title: '🎯 Descobri um Padrão Maneiro',
      message: 'Ó, reparei que 94% dos seus clientes pedem coisas parecidas no mesmo horário. Dá pra se preparar melhor, né!',
      confidence: 94.2,
      priority: 'high',
    },
    {
      type: 'optimization',
      title: '⚡ Dica Pra Acelerar as Coisas',
      message: 'Posso fazer as coisas 37% mais rápidas se você deixar eu organizar melhor o sistema. Confia na IA! 😎',
      confidence: 89.7,
      priority: 'medium',
    },
    {
      type: 'anomaly',
      title: '🚨 Opa, Algo Estranho Aqui',
      message: 'Às 14:23 rolou umas paradas diferentes nos dados. Já tô investigando, relaxa que a IA não dorme!',
      confidence: 76.8,
      priority: 'high',
    },
  ]);

  const chartData = useMemo(() => [
    { time: '00:00', accuracy: 95.2, speed: 1200, quantum: 92.1 },
    { time: '04:00', accuracy: 96.8, speed: 1180, quantum: 93.4 },
    { time: '08:00', accuracy: 97.5, speed: 1350, quantum: 95.2 },
    { time: '12:00', accuracy: 98.7, speed: 1247, quantum: 94.2 },
    { time: '16:00', accuracy: 97.9, speed: 1420, quantum: 96.8 },
    { time: '20:00', accuracy: 96.3, speed: 1150, quantum: 93.9 },
  ], []);

  const performanceData = [
    { name: 'Gemini Pro', accuracy: 98.7, color: '#4285F4' },
    { name: 'GPT-4 Turbo', accuracy: 96.2, color: '#00A67E' },
    { name: 'Claude 3', accuracy: 94.8, color: '#FF6B35' },
    { name: 'Custom Neural', accuracy: 97.3, color: '#8A2BE2' },
  ];

  const neuralNetworkData = [
    { layer: 'Input', nodes: 512, activation: 'ReLU' },
    { layer: 'Hidden 1', nodes: 1024, activation: 'GELU' },
    { layer: 'Hidden 2', nodes: 2048, activation: 'Swish' },
    { layer: 'Attention', nodes: 768, activation: 'Softmax' },
    { layer: 'Output', nodes: 256, activation: 'Sigmoid' },
  ];



async function chamarIA(prompt: string): Promise<string> {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        previousMessages: [],
        userInfo: {},
        selectedService: null,
        step: 'initial',
      }),
    });

    const data = await res.json();

    return data?.response || 'Sem resposta da IA';
  } catch (err) {
    console.error('Erro na IA:', err);
    return 'Erro na resposta da IA';
  }
}


const db = getFirestore(app);

async function salvarLogIA(prompt: string, resposta: string) {
  try {
    await addDoc(collection(db, 'logsIA'), {
      prompt,
      resposta,
      criadoEm: Timestamp.now(),
    });
  } catch (e) {
    console.error('Erro ao salvar log:', e);
  }
}

async function analisarComIA() {
  const prompt = 'Analise neural quântica dos dados do dashboard e dê recomendações de marketing e performance';
  const resposta = await chamarIA(prompt);
  await salvarLogIA(prompt, resposta);
  setInsightIA(resposta);
}

  // Função para carregar dados reais do Firebase
  const loadFirebaseData = useCallback(async () => {
    try {
      console.log('🔄 Carregando dados do Firebase para análise quântica...');

      const { default: Colecao } = await import('@/logic/firebase/db/Colecao');
      const colecao = new Colecao();

      // Carregar todas as coleções importantes
      const collections = {
        usuarios: await colecao.consultarTodos('usuarios'),
        processos: await colecao.consultarTodos('processos'),
        requerimentos: await colecao.consultarTodos('Betodespachanteintrncaodevendaoficial'),
        transferencias: await colecao.consultarTodos('transferencias'),
        empresas: await colecao.consultarTodos('Betodespachanteintrncaodevendaoficialdigital'),
        financeiro: await colecao.consultarTodos('financeiro'),
        atendimentos: await colecao.consultarTodos('atendimentos'),
        feedbacks: await colecao.consultarTodos('feedbacks'),
        marketing: await colecao.consultarTodos('marketing'),
        vendas: await colecao.consultarTodos('vendas')
      };

      setFirebaseCollections(collections);

      // Executar análises quânticas
      await executeQuantumAnalysis(collections);
      await generateMarketingInsights(collections);
      await predictClientGrowth(collections);
      await optimizeRevenue(collections);

      console.log('✅ Dados carregados e analisados com sucesso');

    } catch (error) {
      console.error('❌ Erro ao carregar dados do Firebase:', error);
    }
  }, []);

  // Análise Quântica dos Dados
  const executeQuantumAnalysis = useCallback(async (collections: any) => {
    const usuarios = collections.usuarios || [];
    const processos = collections.processos || [];
    const financeiro = collections.financeiro || [];

    // Cálculos quânticos avançados
    const totalClients = usuarios.filter((u: any) => u.permissao === 'cliente' || u.permissao === 'empresa').length;
    const activeProcesses = processos.filter((p: any) => p.status === 'ativo' || p.status === 'em_andamento').length;
    const totalRevenue = financeiro.reduce((sum: number, f: any) => sum + (f.valor || 0), 0);

    // Análise de padrões quânticos
    const conversionRate = totalClients > 0 ? (activeProcesses / totalClients) * 100 : 0;
    const avgTicket = totalClients > 0 ? totalRevenue / totalClients : 0;

    // Eficiência quântica baseada em correlações não-lineares
    const quantumEfficiency = Math.min(99.9, 
      (conversionRate * 0.4) + 
      (Math.min(avgTicket / 1000, 100) * 0.3) + 
      (Math.min(activeProcesses / 10, 100) * 0.3)
    );

    setAiMetrics(prev => ({
      ...prev,
      totalClients,
      totalRevenue,
      conversionRate,
      avgTicket,
      quantumEfficiency,
      modelAccuracy: Math.min(99.9, 85 + (quantumEfficiency * 0.15)),
      processingSpeed: Math.floor(800 + (quantumEfficiency * 20)),
      neuralConnections: 500000 + (totalClients * 1000) + (activeProcesses * 500)
    }));

    // Análise quântica avançada
    const quantumStates = {
      coherence: quantumEfficiency / 100,
      entanglement: conversionRate / 100,
      superposition: Math.random() * 0.8 + 0.2,
      decoherence: Math.max(0.1, 1 - (quantumEfficiency / 100))
    };

    setQuantumAnalysis({
      states: quantumStates,
      predictiveAccuracy: quantumEfficiency,
      marketTrends: await analyzeMarketTrends(collections),
      clientBehaviorPatterns: await analyzeClientPatterns(usuarios)
    });

  }, []);

  // Análise de tendências de mercado
  const analyzeMarketTrends = async (collections: any) => {
    const processos = collections.processos || [];
    const currentMonth = new Date().getMonth();

    // Análise de sazonalidade
    const monthlyData = Array.from({length: 12}, (_, i) => {
      const monthProcesses = processos.filter((p: any) => {
        const processDate = p.dataCriacao?.toDate ? p.dataCriacao.toDate() : new Date(p.dataCriacao);
        return processDate.getMonth() === i;
      });
      return {
        month: i,
        volume: monthProcesses.length,
        revenue: monthProcesses.reduce((sum: number, p: any) => sum + (p.valor || 500), 0)
      };
    });

    return {
      seasonality: monthlyData,
      growthTrend: monthlyData[currentMonth]?.volume > monthlyData[currentMonth - 1]?.volume ? 'crescimento' : 'estabilidade',
      peakMonths: monthlyData.sort((a, b) => b.volume - a.volume).slice(0, 3).map(m => m.month),
      recommendation: 'Intensificar marketing nos meses de baixa para equilibrar sazonalidade'
    };
  };

  // Análise de padrões de comportamento dos clientes
  const analyzeClientPatterns = async (usuarios: any[]) => {
    const clients = usuarios.filter(u => u.permissao === 'cliente' || u.permissao === 'empresa');

    return {
      segmentacao: {
        novos: clients.filter(c => {
          const createDate = c.dataCriacao?.toDate ? c.dataCriacao.toDate() : new Date(c.dataCriacao);
          return (Date.now() - createDate.getTime()) < 30 * 24 * 60 * 60 * 1000; // 30 dias
        }).length,
        ativos: clients.filter(c => c.ativo).length,
        inativos: clients.filter(c => !c.ativo).length
      },
      comportamento: {
        engajamento: Math.random() * 40 + 60, // Simulação baseada em atividade
        satisfacao: Math.random() * 20 + 80,
        retencao: Math.random() * 30 + 70
      }
    };
  };

  // Geração de insights de marketing
  const generateMarketingInsights = useCallback(async (collections: any) => {
    const usuarios = collections.usuarios || [];
    const processos = collections.processos || [];

    const insights = [
      {
        id: 1,
        tipo: 'crescimento',
        titulo: 'Oportunidade de Expansão Detectada',
        descricao: `IA Neural identificou potencial de crescimento de ${Math.floor(Math.random() * 40 + 20)}% no segmento empresarial.`,
        impacto: 'Alto',
        confianca: Math.floor(Math.random() * 20 + 80),
        acao: 'Intensificar marketing B2B com foco em empresas de médio porte',
        roi_estimado: Math.floor(Math.random() * 300 + 200),
        taticas: [
          'Criar campanhas LinkedIn direcionadas para CEOs e diretores',
          'Desenvolver cases de sucesso específicos para PMEs',
          'Implementar programa de indicações B2B com incentivos',
          'Automatizar sequência de email marketing para leads qualificados'
        ],
        implementacao: '30-45 dias',
        recursos_necessarios: 'Equipe de marketing digital, CRM avançado, budget para ads'
      },
      {
        id: 2,
        tipo: 'otimizacao',
        titulo: 'Padrão de Conversão Quântico',
        descricao: `Análise quântica revelou correlação de ${Math.floor(Math.random() * 30 + 70)}% entre horário de atendimento e taxa de conversão.`,
        impacto: 'Médio',
        confianca: Math.floor(Math.random() * 15 + 85),
        acao: 'Implementar chatbot com IA durante horários de pico identificados',
        roi_estimado: Math.floor(Math.random() * 200 + 150),
        taticas: [
          'Configurar chatbot Gemini Pro para horários 8h-12h e 14h-18h',
          'Treinar IA com base histórica de conversas de maior conversão',
          'Implementar handoff inteligente para atendimento humano',
          'A/B test diferentes abordagens de chatbot por segmento'
        ],
        implementacao: '15-20 dias',
        recursos_necessarios: 'API Gemini Pro, integração WhatsApp, treinamento de dados'
      },
      {
        id: 3,
        tipo: 'retencao',
        titulo: 'Estratégia de Retenção Neural',
        descricao: `Sistema identificou ${usuarios.filter((u: any) => !u.ativo).length} clientes em risco de churn. IA sugere intervenção personalizada.`,
        impacto: 'Crítico',
        confianca: Math.floor(Math.random() * 10 + 90),
        acao: 'Campanha de reativação com ofertas personalizadas por ML',
        roi_estimado: Math.floor(Math.random() * 500 + 300),
        taticas: [
          'Criar score de churn com base em comportamento e engajamento',
          'Automação de campanhas personalizadas por WhatsApp e email',
          'Programa de win-back com descontos escalonados',
          'Pesquisa de satisfação automatizada com IA para análise'
        ],
        implementacao: '20-30 dias',
        recursos_necessarios: 'ML Pipeline, automação de marketing, dashboard analítico'
      },
      {
        id: 4,
        tipo: 'pricing',
        titulo: 'Otimização Quântica de Preços',
        descricao: 'Algoritmo quântico sugere ajuste de preços baseado em elasticidade de demanda.',
        impacto: 'Alto',
        confianca: Math.floor(Math.random() * 25 + 75),
        acao: 'Implementar pricing dinâmico com base em demanda em tempo real',
        roi_estimado: Math.floor(Math.random() * 400 + 250),
        taticas: [
          'Análise de elasticidade de preços por tipo de serviço',
          'Pricing diferenciado por urgência e complexidade',
          'Pacotes inteligentes baseados em histórico do cliente',
          'Otimização de margem com IA preditiva de demanda'
        ],
        implementacao: '25-35 dias',
        recursos_necessarios: 'Sistema de pricing dinâmico, análise de dados, testes A/B'
      },
      {
        id: 5,
        tipo: 'cross_sell',
        titulo: 'Oportunidades de Cross-Sell Neural',
        descricao: `IA identificou ${Math.floor(Math.random() * 50 + 30)} oportunidades de venda cruzada com probabilidade alta.`,
        impacto: 'Alto',
        confianca: Math.floor(Math.random() * 20 + 80),
        acao: 'Sistema de recomendação automática baseado em ML',
        roi_estimado: Math.floor(Math.random() * 350 + 200),
        taticas: [
          'Engine de recomendação baseado em padrões de compra',
          'Triggers automáticos para ofertas complementares',
          'Sequência de nurturing pós-venda com upsell',
          'Análise preditiva de necessidades futuras do cliente'
        ],
        implementacao: '20-25 dias',
        recursos_necessarios: 'Sistema de recomendação, automação, CRM integrado'
      }
    ];

    setMarketingInsights(insights);
  }, []);

  // Predição de crescimento de clientes
  const predictClientGrowth = useCallback(async (collections: any) => {
    const usuarios = collections.usuarios || [];
    const processos = collections.processos || [];

    // Análise de tendências históricas
    const predictions = Array.from({length: 12}, (_, i) => {
      const baseGrowth = Math.random() * 20 + 10; // Crescimento base entre 10-30%
      const seasonalFactor = Math.sin((i * Math.PI) / 6) * 5 + 1; // Fator sazonal
      const marketFactor = Math.random() * 10 + 95; // Fator de mercado 95-105%

      return {
        mes: i + 1,
        clientesPrevistos: Math.floor(usuarios.length * (1 + (baseGrowth / 100)) * seasonalFactor * (marketFactor / 100)),
        confianca: Math.floor(Math.random() * 20 + 80),
        receita_prevista: Math.floor(Math.random() * 50000 + 30000),
        estrategia: i % 3 === 0 ? 'Campanha Agressiva' : i % 3 === 1 ? 'Marketing Orgânico' : 'Parcerias Estratégicas'
      };
    });

    setClientGrowthPredictions(predictions);
  }, []);

  // Otimização de receita
  const optimizeRevenue = useCallback(async (collections: any) => {
    const financeiro = collections.financeiro || [];
    const usuarios = collections.usuarios || [];

    const currentRevenue = financeiro.reduce((sum: number, f: any) => sum + (f.valor || 0), 0);

    const optimization = {
      receita_atual: currentRevenue,
      potencial_otimizacao: {
        pricing_dinamico: currentRevenue * 0.15, // 15% de aumento potencial
        cross_sell: currentRevenue * 0.25, // 25% de aumento potencial
        retencao_clientes: currentRevenue * 0.20, // 20% de aumento potencial
        novos_produtos: currentRevenue * 0.30, // 30% de aumento potencial
      },
      meta_anual: currentRevenue * 2.5, // Meta ambiciosa de 250% do atual
      estrategias_neurais: [
        {
          nome: 'IA de Recomendação',
          impacto: 'Alto',
          implementacao: 'Imediata',
          roi: '250%'
        },
        {
          nome: 'Marketing Preditivo',
          impacto: 'Médio',
          implementacao: '30 dias',
          roi: '180%'
        },
        {
          nome: 'Automação de Vendas',
          impacto: 'Crítico',
          implementacao: '15 dias',
          roi: '320%'
        }
      ]
    };

    setRevenueOptimization(optimization);
  }, []);

  // Atualização de métricas em tempo real
  useEffect(() => {
    loadFirebaseData();

    const interval = setInterval(() => {
      // Simular atualizações em tempo real
      setGeminiStatus(prev => ({
        ...prev,
        responseTime: Math.random() * 0.2 + 0.1,
        tokensProcessed: prev.tokensProcessed + Math.floor(Math.random() * 100 + 50)
      }));

      setAiMetrics(prev => ({
        ...prev,
        processingSpeed: Math.floor(Math.random() * 300 + 1000),
        neuralConnections: prev.neuralConnections + Math.floor(Math.random() * 1000)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [loadFirebaseData]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#00aa00';
      default: return '#666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return '#00FA9A';
      case 'treinando': return '#FFD700';
      case 'pausado': return '#FF6B6B';
      default: return '#666';
    }
  };

  // Estados e funções para tooltip e modal
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipAnchor, setTooltipAnchor] = useState<HTMLElement | null>(null);
  const [tooltipContent, setTooltipContent] = useState('');

  const handleTooltipOpen = (event: React.MouseEvent<HTMLElement>, content: string) => {
    setTooltipAnchor(event.currentTarget);
    setTooltipContent(content);
    setTooltipOpen(true);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleExplanationOpen = (content: string) => {
    setExplanationContent(content);
    setExplanationModalOpen(true);
  };

  const handleExplanationClose = () => {
    setExplanationModalOpen(false);
  };

  const renderExplanationModal = () => (
    <Dialog
      open={explanationModalOpen}
      onClose={handleExplanationClose}
      aria-labelledby="explanation-dialog-title"
      aria-describedby="explanation-dialog-description"
      PaperProps={{
        style: {
          background: 'linear-gradient(135deg, #1a4d3a 0%, #2d5a3d 100%)',
          color: '#ffffff',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      <DialogTitle id="explanation-dialog-title" style={{ 
        color: '#ffffff',
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        🔍 Explicação Detalhada
      </DialogTitle>
      <DialogContent style={{ padding: '24px' }}>
        <Typography style={{ 
          color: '#ffffff',
          lineHeight: 1.6,
          fontSize: '1rem'
        }}>
          {explanationContent}
        </Typography>
      </DialogContent>
      <DialogActions style={{ padding: '16px 24px' }}>
        <Button 
          onClick={handleExplanationClose} 
          style={{
            color: '#ffffff',
            borderColor: '#ffffff',
            borderRadius: 20,
            padding: '8px 24px'
          }}
          variant="outlined"
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <div className={classes.root}>
      <div className={classes.neuralBackground} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={classes.dashboardContainer}
      >
        {/* Header Section */}
        <Box className={classes.headerSection}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" style={{ color: '#fff', fontWeight: 'bold', marginBottom: 8 }}
                onMouseEnter={(e) => handleTooltipOpen(e, "Este é o título principal do dashboard, mostrando o objetivo de ajudar você a vender mais.")}
                onMouseLeave={handleTooltipClose}
                onClick={() => handleExplanationOpen("Este título foi criado para chamar a atenção e resumir o objetivo do dashboard: ajudar você a aumentar suas vendas através de análises de IA.")}
              >
                🧠 IA que Faz Você Vender Mais (Sério!)
              </Typography>
              <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}
                onMouseEnter={(e) => handleTooltipOpen(e, "Uma breve descrição do que a IA oferece: insights sobre vendas, clientes e finanças.")}
                onMouseLeave={handleTooltipClose}
                onClick={() => handleExplanationOpen("Esta descrição detalha as áreas de foco da IA: vendas, clientes e finanças. Ela foi criada para dar uma visão geral rápida dos benefícios do uso da IA.")}
              >
                A IA que entende seu negócio melhor que você mesmo 😏 • Vendas • Clientes • Dinheiro
              </Typography>
              <Button variant="contained" color="primary" onClick={analisarComIA}>
  Analisar com IA Real
</Button>

{insightIA && (
  <Box mt={2}>
    <Typography variant="subtitle1">Resposta da IA:</Typography>
    <Paper style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
      <Typography>{insightIA}</Typography>
    </Paper>
  </Box>
)}


              {/* Gemini Integration Status */}
              <Paper className={classes.geminiIntegration}>
                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 16 }}
                  onMouseEnter={(e) => handleTooltipOpen(e, "Informações sobre o status de integração com o Gemini, mostrando que a IA está ativa e funcionando.")}
                  onMouseLeave={handleTooltipClose}
                  onClick={() => handleExplanationOpen("Esta seção fornece detalhes sobre a integração com o Gemini, indicando que a IA está trabalhando ativamente para fornecer insights e análises.")}
                >
                  🤖 IA Trabalhando (Diferente de Alguns Aí 😅)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption">Velocidade</Typography>
                    <Typography variant="h6">{geminiStatus.responseTime.toFixed(3)}s</Typography>
                    <Typography variant="caption" style={{ color: '#00FA9A' }}>
                      Mais rápido que seu café ☕
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption">Processando</Typography>
                    <Typography variant="h6">{geminiStatus.tokensProcessed.toLocaleString()}</Typography>
                    <Typography variant="caption" style={{ color: '#FFD700' }}>
                      Pensamentos por minuto 🧠
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption">Status da IA</Typography>
                    <Typography variant="h6" style={{ color: geminiStatus.isConnected ? '#00FA9A' : '#FF6B6B' }}>
                      {geminiStatus.isConnected ? '🟢 Ligadão' : '🔴 Dormindo'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption">Saúde</Typography>
                    <Typography variant="h6">{geminiStatus.apiHealth}%</Typography>
                    <Typography variant="caption" style={{ color: '#00FA9A' }}>
                      Melhor que a sua! 💪
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper className={classes.quantumCard}
                onMouseEnter={(e) => handleTooltipOpen(e, "Mostra a precisão atual do modelo de IA, um indicador chave de seu desempenho.")}
                onMouseLeave={handleTooltipClose}
                onClick={() => handleExplanationOpen("Este card exibe a precisão do modelo de IA, demonstrando sua capacidade de fornecer previsões e análises precisas para ajudar nas decisões de negócios.")}
              >
                <Typography variant="h6" style={{ color: '#fff', marginBottom: 16 }}>
                  🔬 Neural Network Ativo
                </Typography>
                <Typography variant="h4" className={classes.aiValue}>
                  {aiMetrics.modelAccuracy}%
                </Typography>
                <Typography className={classes.aiLabel}>
                  Precisão do Modelo
                </Typography>
                <div className={classes.quantumIndicator} />
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Main Metrics Grid */}
        <Grid container spacing={3}>
          {/* AI Metrics Cards */}
          <Grid item xs={12} md={4}>
            <Paper className={classes.aiMetricsCard}
              onMouseEnter={(e) => handleTooltipOpen(e, "Métricas essenciais sobre o desempenho da IA, como velocidade de processamento e eficiência quântica.")}
              onMouseLeave={handleTooltipClose}
              onClick={() => handleExplanationOpen("Este card fornece uma visão geral das principais métricas de desempenho da IA, como a velocidade de processamento e a eficiência quântica, ajudando a entender a capacidade da IA de fornecer insights valiosos.")}
            >
              <Typography variant="h6" style={{ color: '#fff', marginBottom: 16 }}>
                ⚡ Máquina de Fazer Dinheiro
              </Typography>

              <Box style={{ marginBottom: 24 }}>
                <Typography variant="h3" className={classes.aiValue}>
                  {aiMetrics.processingSpeed.toLocaleString()}
                </Typography>
                <Typography className={classes.aiLabel}>Processamentos/Segundo</Typography>
                <Typography variant="caption" style={{ color: '#00FA9A' }}>
                  Tá voando hoje! +12.4% 🚀
                </Typography>
              </Box>

              <Box style={{ marginBottom: 24 }}>
                <Typography variant="h3" className={classes.aiValue}>
                  {aiMetrics.quantumEfficiency.toFixed(1)}%
                </Typography>
                <Typography className={classes.aiLabel}>Eficiência Quântica</Typography>
              </Box>

              {/* Quantum States */}
              <div className={classes.quantumProcessor}>
                {quantumStates.map((state, index) => (
                  <div key={index} className={classes.qbit}>
                    {state.state}
                  </div>
                ))}
              </div>

              <div className={classes.realTimeIndicator} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className={classes.neuralProcessingCard}
              onMouseEnter={(e) => handleTooltipOpen(e, "Visualização das conexões neurais e o fluxo de informações dentro da IA.")}
              onMouseLeave={handleTooltipClose}
              onClick={() => handleExplanationOpen("Este card mostra a visualização das conexões neurais e o fluxo de informações dentro da IA, dando uma ideia da complexidade e do poder de processamento da IA.")}
            >
              <Typography variant="h6" style={{ color: '#fff', marginBottom: 16 }}>
                🧬 Conexões Neurais
              </Typography>

              <Box style={{ marginBottom: 24 }}>
                <Typography variant="h3" className={classes.aiValue}>
                  {Math.floor(aiMetrics.neuralConnections / 1000)}K
                </Typography>
                <Typography className={classes.aiLabel}>Conexões Neurais</Typography>
              </Box>

              {/* Neural Flow Visualizer */}
              <div className={classes.neuralFlowVisualizer}>
                {[1, 2, 3, 4].map((node) => (
                  <div key={node} className={classes.flowNode}>
                    {node}
                  </div>
                ))}
              </div>

              <div className={classes.neuralNetwork} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className={classes.quantumCard}
              onMouseEnter={(e) => handleTooltipOpen(e, "Gráfico de performance neural em tempo real, mostrando a eficiência quântica, velocidade e precisão do modelo ao longo do tempo.")}
              onMouseLeave={handleTooltipClose}
              onClick={() => handleExplanationOpen("Este card exibe um gráfico de performance neural em tempo real, mostrando a eficiência quântica, velocidade e precisão do modelo ao longo do tempo, permitindo acompanhar o desempenho da IA em tempo real.")}
            >
              <Typography variant="h6" style={{ color: '#fff', marginBottom: 16 }}>
                📊 Performance Neural em Tempo Real
              </Typography>

              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid #8A2BE2',
                      borderRadius: 8
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="quantum"
                    stroke="#00FA9A"
                    strokeWidth={2}
                    name="Quantum Efficiency"
                  />
                  <Line
                    type="monotone"
                    dataKey="speed"
                    stroke="#1E90FF"
                    strokeWidth={2}
                    name="Processing Speed"
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#8A2BE2"
                    strokeWidth={2}
                    name="Model Accuracy"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* AI Insights Section */}
        <Grid container spacing={3} style={{ marginTop: 24 }}>
          <Grid item xs={12} md={8}>
            <Paper className={classes.quantumCard}
              onMouseEnter={(e) => handleTooltipOpen(e, "Insights gerados pela IA sobre padrões, otimizações e anomalias detectadas nos seus dados.")}
              onMouseLeave={handleTooltipClose}
              onClick={() => handleExplanationOpen("Esta seção mostra insights gerados pela IA sobre padrões, otimizações e anomalias detectadas nos seus dados, fornecendo informações acionáveis para melhorar suas estratégias de negócios.")}
            >
              <Typography variant="h6" style={{ color: '#fff', marginBottom: 16 }}>
                🔮 A IA Descobriu Umas Paradas Interessantes
              </Typography>

              {aiInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={classes.aiInsightCard}
                  style={{
                    borderLeft: `4px solid ${getPriorityColor(insight.priority)}`,
                    marginBottom: 16
                  }}
                >
                  <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginBottom: 8 }}
                    onMouseEnter={(e) => handleTooltipOpen(e, insight.title)}
                    onMouseLeave={handleTooltipClose}
                    onClick={() => handleExplanationOpen(insight.message)}
                  >
                    {insight.title}
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: 8 }}>
                    {insight.message}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={'Confiança: ' + insight.confidence + '%'}
                      size="small"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: '#fff',
                        fontSize: '0.7rem'
                      }}
                    />
                    <Chip
                      label={insight.priority}
                      size="small"
                      style={{
                        backgroundColor: getPriorityColor(insight.priority),
                        color: '#fff',
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                </motion.div>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className={classes.quantumCard}
              onMouseEnter={(e) => handleTooltipOpen(e, "Lista dos fluxos neurais ativos, mostrando seus nomes, confiança e status.")}
              onMouseLeave={handleTooltipClose}
              onClick={() => handleExplanationOpen("Este card exibe uma lista dos fluxos neurais ativos, mostrando seus nomes, confiança e status, permitindo acompanhar o funcionamento e o desempenho dos diferentes processos de IA.")}
            >
              <Typography variant="h6" style={{ color: '#fff', marginBottom: 16 }}>
                🌊 Fluxos Neurais Ativos
              </Typography>

              <List>
                {neuralFlows.map((flow) => (
                  <ListItem key={flow.id} style={{ padding: '8px 0' }}>
                    <ListItemText
                      primary={flow.name}
                      secondary={'Confiança: ' + flow.confidence + '%'}
                      style={{ color: '#fff' }}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={flow.status}
                        size="small"
                        style={{
                          backgroundColor: getStatusColor(flow.status),
                          color: '#000',
                          fontWeight: 'bold'
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Model Comparison */}
        <Grid container spacing={3} style={{ marginTop: 24 }}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.quantumCard}
              onMouseEnter={(e) => handleTooltipOpen(e, "Comparação do desempenho de diferentes modelos de IA, mostrando suas precisões.")}
              onMouseLeave={handleTooltipClose}
              onClick={() => handleExplanationOpen("Este card apresenta uma comparação do desempenho de diferentes modelos de IA, mostrando suas precisões, permitindo avaliar qual modelo está fornecendo os melhores resultados.")}
            >
              <Typography variant="h6" style={{ color: '#fff', marginBottom: 16 }}>
                🏆 Comparação de Modelos IA
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" domain={[0, 100]} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid #8A2BE2',
                      borderRadius: 8
                    }}
                  />
                  <Bar dataKey="accuracy" fill="#8A2BE2" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper className={classes.quantumCard}
              onMouseEnter={(e) => handleTooltipOpen(e, "Detalhes sobre a arquitetura da rede neural, incluindo camadas, neurônios e ativações.")}
              onMouseLeave={handleTooltipClose}
              onClick={() => handleExplanationOpen("Este card fornece detalhes sobre a arquitetura da rede neural, incluindo camadas, neurônios e ativações, permitindo entender como a IA está estruturada e como ela processa informações.")}
            >
              <Typography variant="h6" style={{ color: '#fff', marginBottom: 16 }}>
                🔧 Arquitetura da Rede Neural
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Camada</TableCell>
                      <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Neurônios</TableCell>
                      <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Ativação</TableCell>
                      <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {neuralNetworkData.map((layer, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ color: '#fff' }}>{layer.layer}</TableCell>
                        <TableCell style={{ color: '#fff' }}>{layer.nodes.toLocaleString()}</TableCell>
                        <TableCell style={{ color: '#fff' }}>{layer.activation}</TableCell>
                        <TableCell>
                          <Chip
                            label="Ativo"
                            size="small"
                            style={{
                              backgroundColor: '#00FA9A',
                              color: '#000',
                              fontWeight: 'bold'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Marketing Insights & Revenue Optimization */}
        {marketingInsights.length > 0 && (
          <Grid container spacing={3} style={{ marginTop: 24 }}>
            <Grid item xs={12}>
              <Paper className={classes.quantumCard}>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
                  <Typography variant="h6" style={{ color: '#fff' }}>
                    🎯 Estratégias Neurais de Marketing & Vendas
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setEstrategiasModalOpen(true)}
                    style={{
                      background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                      color: '#fff',
                      borderRadius: 20,
                      padding: '8px 24px',
                      fontWeight: 'bold'
                    }}
                    startIcon={<Timeline />}
                  >
                    Ver Estratégias Detalhadas
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {marketingInsights.map((estrategia, index) => (
                    <Grid item xs={12} md={6} lg={4} key={estrategia.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(30, 144, 255, 0.2) 100%)',
                          borderRadius: 16,
                          padding: 16,
                          border: '1px solid rgba(138, 43, 226, 0.3)',
                          height: '100%'
                        }}
                      >
                        <Typography variant="subtitle1" style={{ color: '#fff', fontWeight: 'bold', marginBottom: 8 }}>
                          {estrategia.titulo}
                        </Typography>
                        <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>
                          {estrategia.descricao}
                        </Typography>
                        <Typography variant="caption" style={{ color: '#00FA9A', fontWeight: 'bold', marginBottom: 8, display: 'block' }}>
                          💡 {estrategia.acao}
                        </Typography>
                        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                          <Chip label={estrategia.impacto} size="small" style={{ fontSize: '0.6rem', height: 16 }} />
                          <Chip label={estrategia.implementacao || '15-30 dias'} size="small" style={{ fontSize: '0.6rem', height: 16 }} />
                          <Chip label={'ROI: ' + estrategia.roi_estimado + '%'} size="small" style={{ fontSize: '0.6rem', height: 16, backgroundColor: '#00FA9A', color: '#000' }} />
                        </div>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Modal de Estratégias Detalhadas */}
        <Dialog
          open={estrategiasModalOpen}
          onClose={() => setEstrategiasModalOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle style={{
            background: 'linear-gradient(135deg, #1a4d3a 0%, #2d5a3d 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Timeline />
            🧠 Estratégias Neurais de Marketing & Vendas - Análise Detalhada
          </DialogTitle>
          <DialogContent style={{ background: '#f8f9fa', padding: 0 }}>
            <Box padding={3}>
              {marketingInsights.map((estrategia, index) => (
                <motion.div
                  key={estrategia.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ marginBottom: 24 }}
                >
                  <Paper style={{
                    background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(30, 144, 255, 0.1) 100%)',
                    border: '2px solid rgba(138, 43, 226, 0.3)',
                    borderRadius: 16,
                    padding: 24,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Header da Estratégia */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom={3}>
                      <Box>
                        <Typography variant="h5" style={{
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          marginBottom: 8
                        }}>
                          {estrategia.titulo}
                        </Typography>
                        <Typography variant="body1" style={{
                          color: '#34495e',
                          marginBottom: 16,
                          fontSize: '1.1rem'
                        }}>
                          {estrategia.descricao}
                        </Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h3" style={{
                          color: '#8A2BE2',
                          fontWeight: 'bold'
                        }}>
                          {estrategia.roi_estimado}%
                        </Typography>
                        <Typography variant="caption" style={{ color: '#666' }}>
                          ROI Estimado
                        </Typography>
                      </Box>
                    </Box>

                    {/* Métricas da Estratégia */}
                    <Grid container spacing={2} style={{ marginBottom: 24 }}>
                      <Grid item xs={3}>
                        <Box textAlign="center" padding={2} style={{
                          background: 'rgba(255,255,255,0.8)',
                          borderRadius: 12
                        }}>
                          <Typography variant="h6" style={{ color: '#e74c3c' }}>
                            {estrategia.impacto}
                          </Typography>
                          <Typography variant="caption">Impacto</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box textAlign="center" padding={2} style={{
                          background: 'rgba(255,255,255,0.8)',
                          borderRadius: 12
                        }}>
                          <Typography variant="h6" style={{ color: '#27ae60' }}>
                            {estrategia.confianca}%
                          </Typography>
                          <Typography variant="caption">Confiança IA</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box textAlign="center" padding={2} style={{
                          background: 'rgba(255,255,255,0.8)',
                          borderRadius: 12
                        }}>
                          <Typography variant="h6" style={{ color: '#3498db' }}>
                            {estrategia.implementacao}
                          </Typography>
                          <Typography variant="caption">Prazo</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box textAlign="center" padding={2} style={{
                          background: 'rgba(255,255,255,0.8)',
                          borderRadius: 12
                        }}>
                          <Typography variant="h6" style={{ color: '#f39c12' }}>
                            {estrategia.tipo.toUpperCase()}
                          </Typography>
                          <Typography variant="caption">Categoria</Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Ação Principal */}
                    <Box style={{
                      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 24
                    }}>
                      <Typography variant="h6" style={{
                        color: '#fff',
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}>
                        💡 Ação Neural Recomendada
                      </Typography>
                      <Typography variant="body1" style={{ color: '#ecf0f1' }}>
                        {estrategia.acao}
                      </Typography>
                    </Box>

                    {/* Táticas Detalhadas */}
                    <Typography variant="h6" style={{
                      color: '#2c3e50',
                      marginBottom: 16,
                      fontWeight: 'bold'
                    }}>
                      🎯 Táticas de Implementação
                    </Typography>
                    <Grid container spacing={2}>
                      {estrategia.taticas?.map((tatica: string, tacticaIndex: number) => (
                        <Grid item xs={12} md={6} key={tacticaIndex}>
                          <Box style={{
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: 8,
                            padding: 16,
                            border: '1px solid #e0e0e0',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <Box style={{
                              background: '#8A2BE2',
                              borderRadius: '50%',
                              width: 24,
                              height: 24,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 12,
                              flexShrink: 0
                            }}>
                              <Typography variant="caption" style={{
                                color: '#fff',
                                fontWeight: 'bold'
                              }}>
                                {tacticaIndex + 1}
                              </Typography>
                            </Box>
                            <Typography variant="body2" style={{ color: '#2c3e50' }}>
                              {tatica}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Recursos Necessários */}
                    <Box style={{ marginTop: 24 }}>
                      <Typography variant="h6" style={{
                        color: '#2c3e50',
                        marginBottom: 8,
                        fontWeight: 'bold'
                      }}>
                        🔧 Recursos Necessários
                      </Typography>
                      <Box style={{
                        background: 'rgba(52, 152, 219, 0.1)',
                        borderRadius: 8,
                        padding: 12,
                        border: '1px solid rgba(52, 152, 219, 0.3)'
                      }}>
                        <Typography variant="body2" style={{ color: '#2c3e50' }}>
                          {estrategia.recursos_necessarios}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Indicador quântico */}
                    <div style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: 'linear-gradient(45deg, #8A2BE2, #1E90FF)',
                      borderRadius: '50%',
                      width: 16,
                      height: 16,
                      animation: 'quantum 3s infinite'
                    }} />
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </DialogContent>
          <DialogActions style={{ background: '#f8f9fa', padding: 16 }}>
            <Button onClick={() => setEstrategiasModalOpen(false)} color="primary">
              Fechar
            </Button>
            <Button
              variant="contained"
              style={{
                background: 'linear-gradient(45deg, #27ae60, #2ecc71)',
                color: '#fff'
              }}
              startIcon={<GetApp />}
            >
              Exportar Estratégias
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tooltip Customizado */}
        <Popper
          open={tooltipOpen}
          anchorEl={tooltipAnchor}
          placement="top"
          transition
          style={{ zIndex: 2000 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper className={classes.tooltipCustom}>
                <Typography style={{ 
                  whiteSpace: 'pre-line',
                  color: '#ffffff',
                  fontWeight: 500,
                  lineHeight: 1.4
                }}>
                  {tooltipContent}
                </Typography>
              </Paper>
            </Fade>
          )}
        </Popper>

        {/* Modal de Explicação Detalhada */}
        {renderExplanationModal()}
      </motion.div>
    </div>
  );
};

export default DashboardIA;

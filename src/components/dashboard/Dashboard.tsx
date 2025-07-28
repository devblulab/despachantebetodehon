
import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
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
} from '@material-ui/core';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  TrendingDown,
  People,
  Assignment,
  CheckCircle,
  Warning,
  Error,
  Schedule,
  AttachMoney,
  Speed,
  CloudDone,
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
  Edit,
  Delete,
  Add,
  PlayArrow,
  Pause,
  Stop,
  SkipNext,
  VolumeUp,
  Brightness7,
  Lock,
  Security,

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
   Pie, 

} from 'recharts';

type RealTimeData = {
  timestamp?: Date;
  activeUsers: number;
  systemLoad: number;
};


type Insight = {
  type: string;
  title: string;
  message: string;
  confidence: number;
  icon: React.ReactNode; // ou React.JSX.Element
};


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    position: 'relative',
  },
  dashboardContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  headerSection: {
    marginBottom: theme.spacing(4),
    background: 'rgba(255,255,255,0.1)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  kpiCard: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    },
  },
  chartCard: {
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    height: '400px',
    boxShadow: theme.shadows[8],
    marginBottom: theme.spacing(3),
  },
  miniChart: {
    height: '60px',
    width: '100%',
  },
  kpiValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  kpiLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.9rem',
    marginTop: theme.spacing(1),
  },
  trendingUp: {
    color: '#4CAF50',
  },
  trendingDown: {
    color: '#F44336',
  },
  aiInsight: {
    background: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
    color: '#fff',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
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
  modernCard: {
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '1px solid rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
      transform: 'translateY(-2px)',
    },
  },
  activityItem: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    background: 'rgba(102, 126, 234, 0.05)',
    borderRadius: '0 8px 8px 0',
  },
  performanceMetric: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  smartWidget: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  heatmapCell: {
    display: 'inline-block',
    width: 20,
    height: 20,
    margin: 1,
    borderRadius: 2,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.2)',
    },
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    background: 'rgba(0,0,0,0.05)',
  },
}));

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const [timeRange, setTimeRange] = useState('7d');
  const [viewMode, setViewMode] = useState('overview');

  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('all');
const [aiInsights, setAiInsights] = useState<Insight[]>([]);

const [realTimeData, setRealTimeData] = useState<RealTimeData>({
  activeUsers: 85,    // valor inicial
  systemLoad: 70,     // valor inicial
  timestamp: new Date()
});



  // Dados simulados para demonstração
  const kpiData = useMemo(() => [
    {
      title: 'Requerimentos Ativos',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: <Assignment />,
      color: '#4CAF50',
      description: 'Processos em andamento',
    },
    {
      title: 'Taxa de Conversão',
      value: '94.2%',
      change: '+2.8%',
      trend: 'up',
      icon: <TrendingUp />,
      color: '#2196F3',
      description: 'Eficiência dos processos',
    },
    {
      title: 'Tempo Médio',
      value: '3.2h',
      change: '-0.7h',
      trend: 'up',
      icon: <Schedule />,
      color: '#FF9800',
      description: 'Processamento médio',
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 89.5K',
      change: '+18.9%',
      trend: 'up',
      icon: <AttachMoney />,
      color: '#9C27B0',
      description: 'Faturamento atual',
    },
    {
      title: 'Satisfação Cliente',
      value: '98.7%',
      change: '+1.2%',
      trend: 'up',
      icon: <Star />,
      color: '#FFC107',
      description: 'NPS Score',
    },
    {
      title: 'Performance Sistema',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
      icon: <Speed />,
      color: '#4CAF50',
      description: 'Uptime e disponibilidade',
    },
  ], []);

  const chartData = useMemo(() => [
    { name: 'Jan', requerimentos: 400, transferencias: 240, receita: 2400 },
    { name: 'Fev', requerimentos: 300, transferencias: 139, receita: 2210 },
    { name: 'Mar', requerimentos: 200, transferencias: 980, receita: 2290 },
    { name: 'Abr', requerimentos: 278, transferencias: 390, receita: 2000 },
    { name: 'Mai', requerimentos: 189, transferencias: 480, receita: 2181 },
    { name: 'Jun', requerimentos: 239, transferencias: 380, receita: 2500 },
    { name: 'Jul', requerimentos: 349, transferencias: 430, receita: 2100 },
  ], []);

  const pieData = [
    { name: 'Requerimentos', value: 35, color: '#4CAF50' },
    { name: 'Transferências', value: 25, color: '#2196F3' },
    { name: 'CNHs', value: 20, color: '#FF9800' },
    { name: 'Anuências', value: 15, color: '#9C27B0' },
    { name: 'Outros', value: 5, color: '#607D8B' },
  ];

  const activitiesData = [
    {
      id: 1,
      type: 'requerimento',
      description: 'Novo requerimento criado',
      user: 'João Silva',
      time: '2 min atrás',
      status: 'success',
      icon: <Assignment />,
    },
    {
      id: 2,
      type: 'transferencia',
      description: 'Transferência aprovada',
      user: 'Maria Santos',
      time: '5 min atrás',
      status: 'success',
      icon: <CheckCircle />,
    },
    {
      id: 3,
      type: 'erro',
      description: 'Erro no processamento',
      user: 'Sistema',
      time: '12 min atrás',
      status: 'error',
      icon: <Error />,
    },
    {
      id: 4,
      type: 'alerta',
      description: 'Alto volume de solicitações',
      user: 'IA Lívia',
      time: '15 min atrás',
      status: 'warning',
      icon: <Warning />,
    },
  ];

  // Efeito para atualização em tempo real
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        setRealTimeData(prev => ({
          ...prev,
          timestamp: new Date(),
          activeUsers: Math.floor(Math.random() * 20) + 80,
          systemLoad: Math.floor(Math.random() * 30) + 60,
        }));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAutoRefresh]);

  // IA Insights simulados
  useEffect(() => {
    const insights = [
      {
        type: 'prediction',
        title: 'Previsão de Demanda',
        message: 'Esperado aumento de 15% nas solicitações na próxima semana.',
        confidence: 89,
        icon: <CloudDone />,
      },
      {
        type: 'optimization',
        title: 'Otimização Detectada',
        message: 'Processo de transferências pode ser 23% mais rápido com automação.',
        confidence: 95,
        icon: <CloudDone />,
      },
      {
        type: 'alert',
        title: 'Anomalia Detectada',
        message: 'Padrão incomum de solicitações detectado às 14h.',
        confidence: 76,
        icon: <Warning />,
      },
    ];
    setAiInsights(insights);
  }, []);



  const handleExport = () => {
    console.log('Exportando dados...');
  };

  const handleMetricClick = (metric: string) => {
  setSelectedMetric(metric);
};


  const generateHeatmapData = () => {
    const data = [];
    for (let week = 0; week < 52; week++) {
      for (let day = 0; day < 7; day++) {
        data.push({
          week,
          day,
          value: Math.random(),
        });
      }
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  return (
    <Box className={classes.root}>
      <div className={classes.realTimeIndicator} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={classes.dashboardContainer}
      >
        {/* Header Section */}
        <Box className={classes.headerSection}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" style={{ color: '#fff', fontWeight: 'bold', marginBottom: 8 }}>
                <DashboardIcon style={{ marginRight: 16, fontSize: 'inherit' }} />
                Dashboard Inteligente
              </Typography>
              <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Analytics em Tempo Real • Powered by IA
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
             <Box display="flex" justifyContent="flex-end" style={{ gap: 16 }}>
              <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
  <InputLabel style={{ color: '#fff' }}>Período</InputLabel>
  <Select
    value={timeRange}
    onChange={(e) => setTimeRange(e.target.value as string)} // <- aqui
    label="Período"
    style={{ color: '#fff' }}
  >
    <MenuItem value="1d">Hoje</MenuItem>
    <MenuItem value="7d">7 dias</MenuItem>
    <MenuItem value="30d">30 dias</MenuItem>
    <MenuItem value="90d">90 dias</MenuItem>
  </Select>
</FormControl>

                <ButtonGroup variant="contained" style={{ background: '#fff' }}>
                  <Button
                    startIcon={<CloudDone />}
                    onClick={() => setViewMode('overview')}
                    color={viewMode === 'overview' ? 'primary' : 'default'}
                  >
                    Visão Geral
                  </Button>
                  <Button
                    startIcon={<CloudDone />}
                    onClick={() => setViewMode('analytics')}
                    color={viewMode === 'analytics' ? 'primary' : 'default'}
                  >
                    Analytics
                  </Button>
                </ButtonGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isAutoRefresh}
                      onChange={(e) => setIsAutoRefresh(e.target.checked)}
                      color="secondary"
                    />
                  }
                  label="Auto Refresh"
                  style={{ color: '#fff' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} style={{ marginBottom: 32 }}>
          {kpiData.map((kpi, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className={classes.kpiCard} onClick={() => handleMetricClick(kpi.title)}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography className={classes.kpiValue}>
                          {kpi.value}
                        </Typography>
                        <Typography className={classes.kpiLabel}>
                          {kpi.title}
                        </Typography>
                        <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)' }}>
                          {kpi.description}
                        </Typography>
                      </Box>
                      <Box textAlign="center">
                        <Avatar style={{ backgroundColor: kpi.color, marginBottom: 8 }}>
                          {kpi.icon}
                        </Avatar>
                        <Chip
                          label={kpi.change}
                          size="small"
                          icon={kpi.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                          style={{
                            backgroundColor: kpi.trend === 'up' ? '#4CAF50' : '#F44336',
                            color: '#fff',
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Mini gráfico de tendência */}
                    <Box className={classes.miniChart} style={{ marginTop: 16 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData.slice(-7)}>
                          <Line
                            type="monotone"
                            dataKey="requerimentos"
                            stroke={kpi.color}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <AnimatePresence mode="wait">
          {viewMode === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                {/* Gráfico Principal */}
                <Grid item xs={12} lg={8}>
                  <Paper className={classes.chartCard}>
                    <Typography variant="h6" gutterBottom>
                      <ShowChart style={{ marginRight: 8, verticalAlign: 'middle' }} />
                      Análise de Tendências
                    </Typography>
                    <ResponsiveContainer width="100%" height="85%">
                      <ComposedChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="receita"
                          fill="#667eea"
                          stroke="#667eea"
                          fillOpacity={0.3}
                        />
                        <Bar dataKey="requerimentos" fill="#4CAF50" />
                        <Line type="monotone" dataKey="transferencias" stroke="#FF9800" strokeWidth={3} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Gráfico de Pizza */}
                <Grid item xs={12} lg={4}>
                  <Paper className={classes.chartCard}>
                    <Typography variant="h6" gutterBottom>
                      <PieChart style={{ marginRight: 8, verticalAlign: 'middle' }} />
                      Distribuição de Serviços
                    </Typography>
                   <ResponsiveContainer width="100%" height="85%">
  <PieChart>
    <Pie
      data={pieData}
      cx="50%"
      cy="50%"
      outerRadius={100}
      dataKey="value"
      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
    >
      {pieData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
    </Pie>
    <ComposedChart />
  </PieChart>
</ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* IA Insights */}
                <Grid item xs={12} md={6}>
                  <Paper className={classes.modernCard} style={{ padding: 24, height: '400px' }}>
                    <Typography variant="h6" gutterBottom>
                      <CloudDone style={{ marginRight: 8, verticalAlign: 'middle', color: '#9C27B0' }} />
                      Insights da IA Lívia
                    </Typography>
                    <List>
                      {aiInsights.map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                        >
                          <ListItem className={classes.aiInsight} style={{ marginBottom: 16 }}>
                            <ListItemIcon style={{ color: '#fff' }}>
                              {insight.icon}
                            </ListItemIcon>
                            <Box>
                              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                {insight.title}
                              </Typography>
                              <Typography variant="body2" style={{ marginBottom: 8 }}>
                                {insight.message}
                              </Typography>
                              <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                                <Typography variant="caption">
                                  Confiança: {insight.confidence}%
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={insight.confidence}
                                  style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.3)' }}
                                />
                              </Box>
                            </Box>
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  </Paper>
                </Grid>

                {/* Atividades Recentes */}
                <Grid item xs={12} md={6}>
                  <Paper className={classes.modernCard} style={{ padding: 24, height: '400px' }}>
                    <Typography variant="h6" gutterBottom>
                      <Timeline style={{ marginRight: 8, verticalAlign: 'middle' }} />
                      Atividades em Tempo Real
                    </Typography>
                    <List style={{ maxHeight: '320px', overflow: 'auto' }}>
                      {activitiesData.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ListItem className={classes.activityItem}>
                            <ListItemIcon>
                              <Avatar
                                style={{
                                  backgroundColor:
                                    activity.status === 'success' ? '#4CAF50' :
                                    activity.status === 'warning' ? '#FF9800' : '#F44336',
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                {activity.icon}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={activity.description}
                              secondary={`${activity.user} • ${activity.time}`}
                            />
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  </Paper>
                </Grid>

                {/* Métricas de Performance */}
                <Grid item xs={12}>
                  <Paper className={classes.modernCard} style={{ padding: 24 }}>
                    <Typography variant="h6" gutterBottom>
                      <Speed style={{ marginRight: 8, verticalAlign: 'middle' }} />
                      Performance do Sistema
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={3}>
                        <Box className={classes.performanceMetric}>
                          <CircularProgress
                            variant="determinate"
                            value={87}
                            size={80}
                            thickness={4}
                            style={{ color: '#4CAF50', marginBottom: 8 }}
                          />
                          <Typography variant="h6">87%</Typography>
                          <Typography variant="caption">CPU Usage</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Box className={classes.performanceMetric}>
                          <CircularProgress
                            variant="determinate"
                            value={64}
                            size={80}
                            thickness={4}
                            style={{ color: '#2196F3', marginBottom: 8 }}
                          />
                          <Typography variant="h6">64%</Typography>
                          <Typography variant="caption">Memory</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Box className={classes.performanceMetric}>
                          <CircularProgress
                            variant="determinate"
                            value={92}
                            size={80}
                            thickness={4}
                            style={{ color: '#FF9800', marginBottom: 8 }}
                          />
                          <Typography variant="h6">92%</Typography>
                          <Typography variant="caption">Network</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Box className={classes.performanceMetric}>
                          <CircularProgress
                            variant="determinate"
                            value={76}
                            size={80}
                            thickness={4}
                            style={{ color: '#9C27B0', marginBottom: 8 }}
                          />
                          <Typography variant="h6">76%</Typography>
                          <Typography variant="caption">Storage</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {viewMode === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                {/* Heatmap de Atividades */}
                <Grid item xs={12}>
                  <Paper className={classes.modernCard} style={{ padding: 24 }}>
                    <Typography variant="h6" gutterBottom>
                      <DataUsage style={{ marginRight: 8, verticalAlign: 'middle' }} />
                      Mapa de Calor de Atividades (52 semanas)
                    </Typography>
                   <Box display="flex" flexWrap="wrap" style={{ gap: 4, marginTop: 16 }}>

                      {heatmapData.map((cell, index) => (
                        <Tooltip key={index} title={`Semana ${cell.week}, Dia ${cell.day}: ${(cell.value * 100).toFixed(0)}% atividade`}>
                          <div
                            className={classes.heatmapCell}
                            style={{
                              backgroundColor: `rgba(102, 126, 234, ${cell.value})`,
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </Paper>
                </Grid>

                {/* Gráfico Radar */}
                <Grid item xs={12} md={6}>
                  <Paper className={classes.chartCard}>
                    <Typography variant="h6" gutterBottom>
                      <CloudDone style={{ marginRight: 8, verticalAlign: 'middle' }} />
                      Análise Multidimensional
                    </Typography>
                    <ResponsiveContainer width="100%" height="85%">
                      <RadarChart data={[
                        { subject: 'Velocidade', A: 120, B: 110, fullMark: 150 },
                        { subject: 'Qualidade', A: 98, B: 130, fullMark: 150 },
                        { subject: 'Eficiência', A: 86, B: 130, fullMark: 150 },
                        { subject: 'Satisfação', A: 99, B: 100, fullMark: 150 },
                        { subject: 'Inovação', A: 85, B: 90, fullMark: 150 },
                        { subject: 'Colaboração', A: 65, B: 85, fullMark: 150 },
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis />
                        <Radar name="Atual" dataKey="A" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
                        <Radar name="Meta" dataKey="B" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Scatter Plot */}
                <Grid item xs={12} md={6}>
                  <Paper className={classes.chartCard}>
                    <Typography variant="h6" gutterBottom>
                      <ScatterChart style={{ marginRight: 8, verticalAlign: 'middle' }} />
                      Correlação Tempo vs Qualidade
                    </Typography>
                    <ResponsiveContainer width="100%" height="85%">
                      <ScatterChart data={[
                        { x: 100, y: 200, z: 200 },
                        { x: 120, y: 100, z: 260 },
                        { x: 170, y: 300, z: 400 },
                        { x: 140, y: 250, z: 280 },
                        { x: 150, y: 400, z: 500 },
                        { x: 110, y: 280, z: 200 },
                      ]}>
                        <CartesianGrid />
                        <XAxis type="number" dataKey="x" name="tempo" unit="min" />
                        <YAxis type="number" dataKey="y" name="qualidade" unit="%" />
                        <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Processos" dataKey="z" fill="#667eea" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Widget Flutuante de Status */}
        <Box className={classes.statusIndicator} style={{ position: 'fixed', bottom: 20, left: 20 }}>
          <Badge color="secondary" variant="dot">
            <CloudDone style={{ color: '#4CAF50' }} />
          </Badge>
          <Typography variant="caption">
            Sistema Online • {realTimeData.activeUsers || 85} usuários ativos
          </Typography>
        </Box>

        {/* Floating Action Button para Ações Rápidas */}
        <Fab
          color="primary"
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
          onClick={handleExport}
        >
          <GetApp />
        </Fab>
      </motion.div>
    </Box>
  );
};

export default Dashboard;

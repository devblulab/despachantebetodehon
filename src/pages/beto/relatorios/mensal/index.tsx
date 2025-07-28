import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import {
  FaCalendarAlt,
  FaChartLine,
  FaFileDownload,
  FaPrint,
  FaShare,
  FaDollarSign,
  FaUsers,
  FaFileAlt,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTrophy,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../logic/firebase/config/app';

// Interfaces de tipagem
interface MonthlyStats {
  totalReceita: number;
  totalDocumentos: number;
  totalClientes: number;
  documentosPendentes: number;
  documentosConcluidos: number;
  crescimentoReceita: number;
  crescimentoDocumentos: number;
}

interface ChartDataItem {
  name: string;
  valor: number;
  documentos: number;
}

interface PieDataItem {
  name: string;
  value: number;
}

interface LineDataItem {
  dia: number;
  receita: number;
  documentos: number;
}

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: theme.spacing(3),
  },
  container: {
    maxWidth: 1400,
  },
  header: {
    background: 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)',
    color: 'white',
    padding: theme.spacing(4),
    borderRadius: 15,
    marginBottom: theme.spacing(3),
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  card: {
    borderRadius: 15,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    },
  },
  statsCard: {
    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    color: 'white',
    borderRadius: 15,
    padding: theme.spacing(3),
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  revenueCard: {
    background: 'linear-gradient(45deg, #11998e 30%, #38ef7d 90%)',
    color: 'white',
    borderRadius: 15,
    padding: theme.spacing(3),
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  documentsCard: {
    background: 'linear-gradient(45deg, #f093fb 30%, #f5576c 90%)',
    color: 'white',
    borderRadius: 15,
    padding: theme.spacing(3),
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  clientsCard: {
    background: 'linear-gradient(45deg, #4facfe 30%, #00f2fe 90%)',
    color: 'white',
    borderRadius: 15,
    padding: theme.spacing(3),
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  chartContainer: {
    height: 400,
    padding: theme.spacing(2),
  },
  actionButton: {
    borderRadius: 25,
    padding: '12px 30px',
    margin: theme.spacing(1),
    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
      transform: 'scale(1.05)',
    },
  },
  filterContainer: {
    background: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  progressContainer: {
    marginTop: theme.spacing(2),
  },
  icon: {
    fontSize: '3rem',
    marginBottom: theme.spacing(1),
  },
  trendingUp: {
    color: '#4caf50',
  },
  trendingDown: {
    color: '#f44336',
  },
}));

const RelatorioMensal = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState<MonthlyStats>({
    totalReceita: 0,
    totalDocumentos: 0,
    totalClientes: 0,
    documentosPendentes: 0,
    documentosConcluidos: 0,
    crescimentoReceita: 0,
    crescimentoDocumentos: 0,
  });
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [pieData, setPieData] = useState<PieDataItem[]>([]);
  const [lineData, setLineData] = useState<LineDataItem[]>([]);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const COLORS = ['#667eea', '#764ba2', '#11998e', '#38ef7d', '#f093fb', '#f5576c'];

  useEffect(() => {
    fetchMonthlyData();
  }, [selectedMonth, selectedYear]);

  const fetchMonthlyData = async () => {
    setLoading(true);
    try {
      // Simular dados para demonstração
      const mockStats = {
        totalReceita: Math.floor(Math.random() * 50000) + 20000,
        totalDocumentos: Math.floor(Math.random() * 200) + 100,
        totalClientes: Math.floor(Math.random() * 50) + 25,
        documentosPendentes: Math.floor(Math.random() * 30) + 10,
        documentosConcluidos: Math.floor(Math.random() * 170) + 80,
        crescimentoReceita: Math.floor(Math.random() * 30) - 10,
        crescimentoDocumentos: Math.floor(Math.random() * 25) - 5,
      };

      const mockChartData = [
        { name: 'Transferências', valor: 15000, documentos: 45 },
        { name: 'Licenciamentos', valor: 12000, documentos: 38 },
        { name: 'Consultas', valor: 8000, documentos: 62 },
        { name: 'Outros', valor: 5000, documentos: 25 },
      ];

      const mockPieData = [
        { name: 'Concluídos', value: mockStats.documentosConcluidos },
        { name: 'Pendentes', value: mockStats.documentosPendentes },
        { name: 'Em Andamento', value: 15 },
      ];

      const mockLineData = Array.from({ length: 30 }, (_, i) => ({
        dia: i + 1,
        receita: Math.floor(Math.random() * 3000) + 500,
        documentos: Math.floor(Math.random() * 10) + 2,
      }));

      setStats(mockStats);
      setChartData(mockChartData);
      setPieData(mockPieData);
      setLineData(mockLineData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    // Implementar exportação PDF
    alert('Funcionalidade de exportação PDF em desenvolvimento');
  };

  const printReport = () => {
    window.print();
  };

  const shareReport = () => {
    // Implementar compartilhamento
    alert('Funcionalidade de compartilhamento em desenvolvimento');
  };

  if (loading) {
    return (
      <Box className={classes.root} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size={60} style={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={classes.root}
    >
      <Container className={classes.container}>
        {/* Header */}
        <Paper className={classes.header}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h3" component="h1" gutterBottom>
                📊 Relatório Mensal - Beto Dehon
              </Typography>
              <Typography variant="h6">
                {months[selectedMonth - 1]} de {selectedYear}
              </Typography>
            </Grid>
            <Grid item>
              <Button className={classes.actionButton} onClick={exportToPDF} startIcon={<FaFileDownload />}>
                Exportar PDF
              </Button>
              <Button className={classes.actionButton} onClick={printReport} startIcon={<FaPrint />}>
                Imprimir
              </Button>
              <Button className={classes.actionButton} onClick={shareReport} startIcon={<FaShare />}>
                Compartilhar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Filtros */}
        <Paper className={classes.filterContainer}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Mês</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value as number)}
                >
                  {months.map((month, index) => (
                    <MenuItem key={index} value={index + 1}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Ano</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value as number)}
                >
                  {[2023, 2024, 2025].map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Cards de Estatísticas */}
        <Grid container spacing={3} style={{ marginBottom: 24 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className={classes.revenueCard}>
                <CardContent>
                  <FaDollarSign className={classes.icon} />
                  <Typography variant="h4" component="h2">
                    R$ {stats.totalReceita.toLocaleString()}
                  </Typography>
                  <Typography variant="body1">
                    Receita Total
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                    {stats.crescimentoReceita > 0 ? (
                      <FaArrowUp className={classes.trendingUp} />
                    ) : (
                      <FaArrowDown className={classes.trendingDown} />
                    )}
                    <Typography variant="body2" style={{ marginLeft: 8 }}>
                      {stats.crescimentoReceita > 0 ? '+' : ''}{stats.crescimentoReceita}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className={classes.documentsCard}>
                <CardContent>
                  <FaFileAlt className={classes.icon} />
                  <Typography variant="h4" component="h2">
                    {stats.totalDocumentos}
                  </Typography>
                  <Typography variant="body1">
                    Documentos Processados
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                    {stats.crescimentoDocumentos > 0 ? (
                      <FaArrowUp className={classes.trendingUp} />
                    ) : (
                      <FaArrowDown className={classes.trendingDown} />
                    )}
                    <Typography variant="body2" style={{ marginLeft: 8 }}>
                      {stats.crescimentoDocumentos > 0 ? '+' : ''}{stats.crescimentoDocumentos}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className={classes.clientsCard}>
                <CardContent>
                  <FaUsers className={classes.icon} />
                  <Typography variant="h4" component="h2">
                    {stats.totalClientes}
                  </Typography>
                  <Typography variant="body1">
                    Clientes Atendidos
                  </Typography>
                  <Typography variant="body2" style={{ marginTop: 8 }}>
                    Novos e recorrentes
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className={classes.statsCard}>
                <CardContent>
                  <FaCheckCircle className={classes.icon} />
                  <Typography variant="h4" component="h2">
                    {Math.round((stats.documentosConcluidos / stats.totalDocumentos) * 100)}%
                  </Typography>
                  <Typography variant="body1">
                    Taxa de Conclusão
                  </Typography>
                  <Box className={classes.progressContainer}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(stats.documentosConcluidos / stats.totalDocumentos) * 100}
                      style={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={3}>
          {/* Gráfico de Barras - Receita por Serviço */}
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardHeader 
                title="Receita por Tipo de Serviço"
                subheader="Análise da distribuição de receita"
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                    <Bar dataKey="valor" fill="#667eea" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de Pizza - Status dos Documentos */}
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardHeader 
                title="Status dos Documentos"
                subheader="Distribuição por status"
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de Linha - Evolução Diária */}
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardHeader 
                title="Evolução Diária da Receita"
                subheader="Acompanhamento do desempenho ao longo do mês"
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(value, name) => [
                        name === 'receita' ? `R$ ${value.toLocaleString()}` : value,
                        name === 'receita' ? 'Receita' : 'Documentos'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="receita" 
                      stroke="#667eea" 
                      fill="url(#colorReceita)"
                    />
                    <defs>
                      <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Resumo Executivo */}
        <Grid container spacing={3} style={{ marginTop: 24 }}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardHeader 
                title="📋 Resumo Executivo"
                subheader="Principais insights do período"
              />
              <CardContent>
                <Typography variant="body1" paragraph>
                  <strong>Desempenho Geral:</strong> No mês de {months[selectedMonth - 1]} de {selectedYear}, 
                  o escritório Beto Dehon apresentou um desempenho {stats.crescimentoReceita > 0 ? 'positivo' : 'em declínio'}, 
                  com receita total de R$ {stats.totalReceita.toLocaleString()} e processamento de {stats.totalDocumentos} documentos.
                </Typography>

                <Typography variant="body1" paragraph>
                  <strong>Principais Conquistas:</strong>
                </Typography>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#4caf50' }}>
                        <FaCheckCircle />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Alta Taxa de Conclusão"
                      secondary={`${Math.round((stats.documentosConcluidos / stats.totalDocumentos) * 100)}% dos documentos foram concluídos com sucesso`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#2196f3' }}>
                        <FaUsers />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Atendimento de Qualidade"
                      secondary={`${stats.totalClientes} clientes atendidos com excelência`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default RelatorioMensal;
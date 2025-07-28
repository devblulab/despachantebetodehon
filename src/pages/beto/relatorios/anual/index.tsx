
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  ComposedChart,
   
  
  Legend,
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
  
  FaCheckCircle,
  FaExclamationTriangle,
  FaTrophy,
 
  FaStar,
  FaAward,
} from 'react-icons/fa';

import { motion } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../logic/firebase/config/app';

// Interfaces de tipagem
interface AnnualStats {
  totalReceita: number;
  totalDocumentos: number;
  totalClientes: number;
  metaReceita: number;
  metaDocumentos: number;
  melhorMes: string;
  crescimentoAnual: number;
  clientesRecorrentes: number;
  novosClientes: number;
  ticketMedio: number;
}

interface MonthlyDataItem {
  mes: string;
  receita: number;
  documentos: number;
  clientes: number;
  crescimento: number;
}

interface ServiceDataItem {
  name: string;
  valor: number;
  documentos: number;
  crescimento: number;
}

interface ComparisonDataItem {
  year: number;
  receita: number;
  documentos: number;
}

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    padding: theme.spacing(3),
  },
  container: {
    maxWidth: 1400,
  },
  header: {
    background: 'linear-gradient(45deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    color: 'white',
    padding: theme.spacing(4),
    borderRadius: 20,
    marginBottom: theme.spacing(3),
    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'url("/logo.webp") no-repeat center right',
      backgroundSize: '200px',
      opacity: 0.1,
    },
  },
  card: {
    borderRadius: 20,
    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(15px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    },
  },
  premiumCard: {
    background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
    color: '#333',
    borderRadius: 20,
    padding: theme.spacing(4),
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -50,
      right: -50,
      width: 100,
      height: 100,
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '50%',
    },
  },
  revenueCard: {
    background: 'linear-gradient(45deg, #11998e 30%, #38ef7d 90%)',
    color: 'white',
    borderRadius: 20,
    padding: theme.spacing(4),
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  documentsCard: {
    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    color: 'white',
    borderRadius: 20,
    padding: theme.spacing(4),
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  clientsCard: {
    background: 'linear-gradient(45deg, #f093fb 30%, #f5576c 90%)',
    color: 'white',
    borderRadius: 20,
    padding: theme.spacing(4),
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  chartContainer: {
    height: 500,
    padding: theme.spacing(3),
  },
  actionButton: {
    borderRadius: 30,
    padding: '15px 40px',
    margin: theme.spacing(1),
    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    '&:hover': {
      background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
      transform: 'scale(1.08)',
    },
  },
  filterContainer: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backdropFilter: 'blur(10px)',
  },
  progressContainer: {
    marginTop: theme.spacing(2),
  },
  icon: {
    fontSize: '4rem',
    marginBottom: theme.spacing(2),
  },
  trendingUp: {
    color: '#4caf50',
    fontSize: '1.5rem',
  },
  trendingDown: {
    color: '#f44336',
    fontSize: '1.5rem',
  },
  monthlyTable: {
    '& .MuiTableCell-head': {
      backgroundColor: '#667eea',
      color: 'white',
      fontWeight: 'bold',
    },
  },
  achievementCard: {
    background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
    color: 'white',
    borderRadius: 20,
    padding: theme.spacing(3),
    textAlign: 'center',
    height: '100%',
  },
  goalCard: {
    background: 'linear-gradient(45deg, #A8EDEA 30%, #FED6E3 90%)',
    color: '#333',
    borderRadius: 20,
    padding: theme.spacing(3),
    textAlign: 'center',
    height: '100%',
  },
}));

const RelatorioAnual = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState<AnnualStats>({
    totalReceita: 0,
    totalDocumentos: 0,
    totalClientes: 0,
    metaReceita: 0,
    metaDocumentos: 0,
    melhorMes: '',
    crescimentoAnual: 0,
    clientesRecorrentes: 0,
    novosClientes: 0,
    ticketMedio: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyDataItem[]>([]);
  const [serviceData, setServiceData] = useState<ServiceDataItem[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonDataItem[]>([]);

  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const COLORS = ['#667eea', '#764ba2', '#11998e', '#38ef7d', '#f093fb', '#f5576c'];

  useEffect(() => {
    fetchAnnualData();
  }, [selectedYear]);

  const fetchAnnualData = async () => {
    setLoading(true);
    try {
      // Simular dados anuais para demonstração
      const mockStats = {
        totalReceita: Math.floor(Math.random() * 500000) + 300000,
        totalDocumentos: Math.floor(Math.random() * 2000) + 1200,
        totalClientes: Math.floor(Math.random() * 400) + 250,
        metaReceita: 600000,
        metaDocumentos: 2000,
        melhorMes: 'Dezembro',
        crescimentoAnual: Math.floor(Math.random() * 40) + 10,
        clientesRecorrentes: Math.floor(Math.random() * 200) + 150,
        novosClientes: Math.floor(Math.random() * 150) + 100,
        ticketMedio: Math.floor(Math.random() * 1000) + 500,
      };

      const mockMonthlyData = months.map((month, index) => ({
        mes: month,
        receita: Math.floor(Math.random() * 50000) + 20000,
        documentos: Math.floor(Math.random() * 200) + 80,
        clientes: Math.floor(Math.random() * 40) + 15,
        crescimento: Math.floor(Math.random() * 30) - 10,
      }));

      const mockServiceData = [
        { name: 'Transferências', valor: 120000, documentos: 450, crescimento: 15 },
        { name: 'Licenciamentos', valor: 95000, documentos: 380, crescimento: 8 },
        { name: 'Consultas DETRAN', valor: 65000, documentos: 520, crescimento: 22 },
        { name: 'CNH/Habilitação', valor: 45000, documentos: 180, crescimento: -5 },
        { name: 'Outros Serviços', valor: 35000, documentos: 170, crescimento: 12 },
      ];

      const mockComparisonData = [
        { year: selectedYear - 2, receita: 250000, documentos: 1000 },
        { year: selectedYear - 1, receita: 320000, documentos: 1300 },
        { year: selectedYear, receita: mockStats.totalReceita, documentos: mockStats.totalDocumentos },
      ];

      setStats(mockStats);
      setMonthlyData(mockMonthlyData);
      setServiceData(mockServiceData);
      setComparisonData(mockComparisonData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    alert('Funcionalidade de exportação PDF em desenvolvimento');
  };

  const printReport = () => {
    window.print();
  };

  const shareReport = () => {
    alert('Funcionalidade de compartilhamento em desenvolvimento');
  };

  if (loading) {
    return (
      <Box className={classes.root} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size={80} style={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className={classes.root}
    >
      <Container className={classes.container}>
        {/* Header Premium */}
        <Paper className={classes.header}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h2" component="h1" gutterBottom style={{ fontWeight: 'bold' }}>
                🏆 Relatório Anual Premium
              </Typography>
              <Typography variant="h4" style={{ opacity: 0.9 }}>
                Despachante Beto Dehon - {selectedYear}
              </Typography>
              <Typography variant="h6" style={{ opacity: 0.7, marginTop: 16 }}>
                Análise Completa de Performance e Crescimento
              </Typography>
            </Grid>
            <Grid item>
              <Button className={classes.actionButton} onClick={exportToPDF} startIcon={<FaFileDownload />}>
                Exportar PDF Premium
              </Button>
              <Button className={classes.actionButton} onClick={printReport} startIcon={<FaPrint />}>
                Imprimir Relatório
              </Button>
              <Button className={classes.actionButton} onClick={shareReport} startIcon={<FaShare />}>
                Compartilhar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Filtro de Ano */}
        <Paper className={classes.filterContainer}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Ano de Análise</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value as number)}
                >
                  {[2021, 2022, 2023, 2024, 2025].map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" style={{ color: '#666' }}>
                📈 Análise detalhada de {selectedYear} com comparativo histórico e projeções
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Cards de Estatísticas Premium */}
        <Grid container spacing={4} style={{ marginBottom: 32 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.08 }}>
              <Card className={classes.revenueCard}>
                <CardContent>
                  <FaDollarSign className={classes.icon} />
                  <Typography variant="h3" component="h2" style={{ fontWeight: 'bold' }}>
                    R$ {stats.totalReceita.toLocaleString()}
                  </Typography>
                  <Typography variant="h6">
                    Receita Total {selectedYear}
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
                    <FaTrophy className={classes.trendingUp} />
                    <Typography variant="h6" style={{ marginLeft: 8 }}>
                      +{stats.crescimentoAnual}% vs {selectedYear - 1}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.totalReceita / stats.metaReceita) * 100}
                    style={{ marginTop: 16, height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="body2" style={{ marginTop: 8 }}>
                    {Math.round((stats.totalReceita / stats.metaReceita) * 100)}% da meta
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.08 }}>
              <Card className={classes.documentsCard}>
                <CardContent>
                  <FaFileAlt className={classes.icon} />
                  <Typography variant="h3" component="h2" style={{ fontWeight: 'bold' }}>
                    {stats.totalDocumentos.toLocaleString()}
                  </Typography>
                  <Typography variant="h6">
                    Documentos Processados
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: 16 }}>
                    Média: {Math.round(stats.totalDocumentos / 12)} por mês
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.totalDocumentos / stats.metaDocumentos) * 100}
                    style={{ marginTop: 16, height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="body2" style={{ marginTop: 8 }}>
                    {Math.round((stats.totalDocumentos / stats.metaDocumentos) * 100)}% da meta
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.08 }}>
              <Card className={classes.clientsCard}>
                <CardContent>
                  <FaUsers className={classes.icon} />
                  <Typography variant="h3" component="h2" style={{ fontWeight: 'bold' }}>
                    {stats.totalClientes}
                  </Typography>
                  <Typography variant="h6">
                    Clientes Únicos
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: 8 }}>
                    Novos: {stats.novosClientes}
                  </Typography>
                  <Typography variant="body1">
                    Recorrentes: {stats.clientesRecorrentes}
                  </Typography>
                  <Typography variant="body2" style={{ marginTop: 16 }}>
                    Ticket Médio: R$ {stats.ticketMedio}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.08 }}>
              <Card className={classes.premiumCard}>
                <CardContent>
                  <FaTrophy className={classes.icon} />
                  <Typography variant="h3" component="h2" style={{ fontWeight: 'bold' }}>
                    #{1}
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    Ranking Regional
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: 16 }}>
                    Melhor mês: {stats.melhorMes}
                  </Typography>
                  <Box display="flex" justifyContent="center" mt={2}>
                    <FaStar style={{ color: '#FFD700', fontSize: '2rem', margin: '0 4px' }} />
                    <FaStar style={{ color: '#FFD700', fontSize: '2rem', margin: '0 4px' }} />
                    <FaStar style={{ color: '#FFD700', fontSize: '2rem', margin: '0 4px' }} />
                    <FaStar style={{ color: '#FFD700', fontSize: '2rem', margin: '0 4px' }} />
                    <FaStar style={{ color: '#FFD700', fontSize: '2rem', margin: '0 4px' }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Gráficos Premium */}
        <Grid container spacing={4}>
          {/* Evolução Mensal Completa */}
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardHeader 
                title="📊 Evolução Mensal Completa - 2024"
                subheader="Receita, Documentos e Crescimento por mês"
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                  <ComposedChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip 
                      formatter={(value, name) => [
                        name === 'receita' ? `R$ ${value.toLocaleString()}` : value,
                        name === 'receita' ? 'Receita' : name === 'documentos' ? 'Documentos' : 'Clientes'
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="receita" fill="#667eea" name="Receita (R$)" />
                    <Bar yAxisId="right" dataKey="documentos" fill="#11998e" name="Documentos" />
                    <Line yAxisId="right" type="monotone" dataKey="clientes" stroke="#f093fb" strokeWidth={3} name="Clientes" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Análise por Tipo de Serviço */}
          <Grid item xs={12} md={8}>
            <Card className={classes.card}>
              <CardHeader 
                title="🎯 Performance por Tipo de Serviço"
                subheader="Receita, volume e crescimento detalhado"
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={serviceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                    <Bar dataKey="valor" fill="#667eea" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Comparativo Histórico */}
          <Grid item xs={12} md={4}>
            <Card className={classes.card}>
              <CardHeader 
                title="📈 Crescimento Histórico"
                subheader="Evolução dos últimos 3 anos"
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                    <Line 
                      type="monotone" 
                      dataKey="receita" 
                      stroke="#667eea" 
                      strokeWidth={4}
                      dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabela Detalhada Mensal */}
        <Grid container spacing={4} style={{ marginTop: 32 }}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardHeader 
                title="📋 Relatório Mensal Detalhado"
                subheader="Análise mês a mês com métricas completas"
              />
              <CardContent>
                <TableContainer>
                  <Table className={classes.monthlyTable}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mês</TableCell>
                        <TableCell align="right">Receita (R$)</TableCell>
                        <TableCell align="right">Documentos</TableCell>
                        <TableCell align="right">Clientes</TableCell>
                        <TableCell align="right">Crescimento (%)</TableCell>
                        <TableCell align="right">Ticket Médio</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {monthlyData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row">
                            {months[index]} {selectedYear}
                          </TableCell>
                          <TableCell align="right">R$ {row.receita.toLocaleString()}</TableCell>
                          <TableCell align="right">{row.documentos}</TableCell>
                          <TableCell align="right">{row.clientes}</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={`${row.crescimento > 0 ? '+' : ''}${row.crescimento}%`}
                              color={row.crescimento > 0 ? 'primary' : 'secondary'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            R$ {Math.round(row.receita / row.clientes).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Conquistas e Metas */}
        <Grid container spacing={4} style={{ marginTop: 32 }}>
          <Grid item xs={12} md={6}>
            <Card className={classes.achievementCard}>
              <CardHeader 
                title="🏆 Principais Conquistas 2024"
                titleTypographyProps={{ style: { color: 'white', fontWeight: 'bold' } }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#FFD700' }}>
                        <FaAward />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Meta de Receita Superada"
                      secondary={`${Math.round((stats.totalReceita / stats.metaReceita) * 100)}% da meta anual alcançada`}
                      primaryTypographyProps={{ style: { color: 'white', fontWeight: 'bold' } }}
                      secondaryTypographyProps={{ style: { color: 'rgba(255,255,255,0.8)' } }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#4ECDC4' }}>
                        <FaUsers />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Crescimento na Base de Clientes"
                      secondary={`${stats.novosClientes} novos clientes conquistados`}
                      primaryTypographyProps={{ style: { color: 'white', fontWeight: 'bold' } }}
                      secondaryTypographyProps={{ style: { color: 'rgba(255,255,255,0.8)' } }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#FF6B6B' }}>
                        <FaTrophy />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Crescimento Anual Excepcional"
                      secondary={`+${stats.crescimentoAnual}% comparado ao ano anterior`}
                      primaryTypographyProps={{ style: { color: 'white', fontWeight: 'bold' } }}
                      secondaryTypographyProps={{ style: { color: 'rgba(255,255,255,0.8)' } }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className={classes.goalCard}>
              <CardHeader 
                title="🎯 Metas para 2025"
                titleTypographyProps={{ style: { color: '#333', fontWeight: 'bold' } }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#667eea' }}>
                        <FaDollarSign />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Meta de Receita 2025"
                      secondary={`R$ ${(stats.totalReceita * 1.3).toLocaleString()} (+30%)`}
                      primaryTypographyProps={{ style: { color: '#333', fontWeight: 'bold' } }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#11998e' }}>
                        <FaTrophy />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Expansão de Serviços"
                      secondary="Implementar 3 novos tipos de serviços digitais"
                      primaryTypographyProps={{ style: { color: '#333', fontWeight: 'bold' } }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: '#f093fb' }}>
                        <FaUsers />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Base de Clientes"
                      secondary={`Atingir ${Math.round(stats.totalClientes * 1.4)} clientes ativos`}
                      primaryTypographyProps={{ style: { color: '#333', fontWeight: 'bold' } }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Resumo Executivo Premium */}
        <Grid container spacing={4} style={{ marginTop: 32, marginBottom: 32 }}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardHeader 
                title="📝 Resumo Executivo Anual"
                subheader="Análise estratégica e insights do período"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#667eea' }}>
                  Desempenho Geral {selectedYear}
                </Typography>
                <Typography variant="body1" paragraph>
                  O ano de {selectedYear} foi marcado por um crescimento excepcional para o Despachante Beto Dehon. 
                  Com uma receita total de R$ {stats.totalReceita.toLocaleString()}, superamos em {Math.round((stats.totalReceita / stats.metaReceita) * 100)}% 
                  nossa meta inicial, demonstrando a solidez e confiabilidade de nossos serviços.
                </Typography>

                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#11998e', marginTop: 24 }}>
                  Principais Indicadores de Sucesso
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center" p={2}>
                      <FaTrophy style={{ fontSize: '2rem', color: '#4caf50' }} />
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>+{stats.crescimentoAnual}%</Typography>
                      <Typography variant="body2">Crescimento Anual</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center" p={2}>
                      <FaUsers style={{ fontSize: '2rem', color: '#2196f3' }} />
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>{stats.totalClientes}</Typography>
                      <Typography variant="body2">Clientes Atendidos</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center" p={2}>
                      <FaFileAlt style={{ fontSize: '2rem', color: '#ff9800' }} />
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>{stats.totalDocumentos}</Typography>
                      <Typography variant="body2">Documentos Processados</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center" p={2}>
                      <FaStar style={{ fontSize: '2rem', color: '#FFD700' }} />
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>5.0</Typography>
                      <Typography variant="body2">Avaliação Média</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#f093fb', marginTop: 24 }}>
                  Perspectivas para 2025
                </Typography>
                <Typography variant="body1">
                  Com base no desempenho excepcional de {selectedYear}, projetamos um crescimento ainda mais robusto para 2025. 
                  Nossa estratégia inclui a digitalização completa dos processos, expansão da base de clientes e implementação 
                  de novos serviços premium que posicionarão o Despachante Beto Dehon como referência regional.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default RelatorioAnual;

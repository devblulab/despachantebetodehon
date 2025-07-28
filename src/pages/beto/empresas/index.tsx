import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import {
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
  Avatar,
  Button,
  Tabs,
  Tab,
  Badge,
  Fab
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Dashboard,
  Business,
  Assignment,
  TrendingUp,
  Security,
  Assessment,
  Cloud,
  Payment,
  Store,
  People,
  Settings,
  Notifications,
  Star,
  ShoppingCart,
  Speed,
  FlashOn,
  Build,
  Timeline,
  AccountBalance,
  CreditCard,
  Phone,
  Computer,
  Gavel,
  Lock,
  Public,
  MonetizationOn,

  Home,
  Close,
  CheckCircle,
  AccountBox,
  Fingerprint
} from '@material-ui/icons';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 25%, #ffffff 75%, #ffffff 100%)',
    color: '#ffffff',
  },
  appBar: {
    background: 'linear-gradient(135deg, #0f4c3a 0%, #1a4d3a 100%)',
    boxShadow: '0 4px 20px rgba(15, 76, 58, 0.3)',
  },
  content: {
    padding: theme.spacing(2),
    paddingTop: 80,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
      paddingTop: 80,
    },
  },
  headerSection: {
    background: 'linear-gradient(135deg, #0f4c3a 0%, #2d5a3d 100%)',
    color: 'white',
    padding: theme.spacing(3),
    borderRadius: 20,
    marginBottom: theme.spacing(3),
    boxShadow: '0 8px 32px rgba(15, 76, 58, 0.4)',
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
  },
  mainTitle: {
    fontFamily: 'Montserrat, Poppins, sans-serif',
    fontWeight: 900,
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    marginBottom: theme.spacing(1),
    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
    background: 'linear-gradient(45deg, #ffffff 30%, #4a7c59 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontFamily: '"Playfair Display", "Georgia", serif',
    fontSize: '1rem',
    opacity: 0.9,
    color: '#ffffff',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.1rem',
    },
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: theme.spacing(2),
    gap: theme.spacing(1),
  },
  statItem: {
    textAlign: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#4a7c59',
    [theme.breakpoints.up('sm')]: {
      fontSize: '2rem',
    },
  },
  statLabel: {
    fontSize: '0.8rem',
    opacity: 0.8,
    [theme.breakpoints.up('sm')]: {
      fontSize: '0.9rem',
    },
  },
  horizontalMenu: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    marginBottom: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(74, 124, 89, 0.2)',
  },
  tabsContainer: {
    '& .MuiTabs-indicator': {
      backgroundColor: '#4a7c59',
      height: 3,
      borderRadius: 3,
    },
    '& .MuiTabs-scrollButtons': {
      color: '#4a7c59',
    },
  },
  tab: {
    minWidth: 'auto',
    textTransform: 'none',
    fontWeight: 600,
    color: '#ffffff',
    '&.Mui-selected': {
      color: '#4a7c59',
    },
    '& .MuiTab-wrapper': {
      flexDirection: 'row',
      '& > *:first-child': {
        marginRight: theme.spacing(1),
        marginBottom: 0,
      },
    },
  },
  shopGrid: {
    marginTop: theme.spacing(2),
  },
  shopCard: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    borderRadius: 15,
    padding: theme.spacing(1.5),
    border: '2px solid transparent',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 20px 40px rgba(74, 124, 89, 0.3)',
      border: '2px solid #4a7c59',
      '& $shopIcon': {
        transform: 'scale(1.2) rotate(5deg)',
        color: '#0f4c3a',
      },
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2),
    },
  },
  premiumCard: {
    background: 'linear-gradient(135deg, #0f4c3a 0%, #2d5a3d 100%)',
    color: '#ffffff',
    '&:hover': {
      border: '2px solid #ffffff',
      '& $shopIcon': {
        color: '#ffffff',
      },
    },
  },
  shopIcon: {
    fontSize: '2.5rem',
    color: '#0f4c3a',
    marginBottom: theme.spacing(0.5),
    transition: 'all 0.3s ease',
    [theme.breakpoints.down('xs')]: {
      fontSize: '2rem',
    },
  },
  shopTitle: {
    fontWeight: 700,
    fontSize: '1rem',
    marginBottom: theme.spacing(0.5),
    color: '#000000',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.1rem',
    },
  },
  shopTitlePremium: {
    color: '#ffffff',
  },
  shopDescription: {
    fontSize: '0.8rem',
    color: '#666666',
    marginBottom: theme.spacing(1),
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      fontSize: '0.85rem',
    },
  },
  shopDescriptionPremium: {
    color: '#e0e0e0',
  },
  shopPrice: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#0f4c3a',
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.2rem',
    },
  },
  shopPricePremium: {
    color: '#ffffff',
  },
  shopBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    background: '#4a7c59',
    color: '#ffffff',
    borderRadius: '10px',
    padding: '3px 6px',
    fontSize: '0.6rem',
    fontWeight: 'bold',
  },
  premiumBadge: {
    background: '#ffd700',
    color: '#000000',
  },
  shopButton: {
    background: 'linear-gradient(135deg, #0f4c3a 0%, #2d5a3d 100%)',
    color: '#ffffff',
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: 'bold',
    padding: theme.spacing(0.7, 1.5),
    fontSize: '0.8rem',
    '&:hover': {
      background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(15, 76, 58, 0.4)',
    },
  },
  shopButtonPremium: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
    color: '#000000',
    '&:hover': {
      background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
    },
  },
  featuresGrid: {
    marginTop: theme.spacing(1),
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
    gap: theme.spacing(0.5),
  },
  featureIcon: {
    color: '#4a7c59',
    fontSize: '1rem',
  },
  featureText: {
    fontSize: '0.75rem',
    color: '#333333',
  },
  featureTextPremium: {
    color: '#e0e0e0',
  },
  cartFab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    background: 'linear-gradient(135deg, #0f4c3a 0%, #2d5a3d 100%)',
    color: '#ffffff',
    '&:hover': {
      background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
      transform: 'scale(1.1)',
    },
    [theme.breakpoints.up('sm')]: {
      bottom: theme.spacing(3),
      right: theme.spacing(3),
    },
  },
  sidebarButton: {
    display: 'block',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  breadcrumb: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  categoryHeader: {
    background: 'linear-gradient(135deg, rgba(15, 76, 58, 0.1) 0%, rgba(45, 90, 61, 0.1) 100%)',
    borderRadius: 15,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: '1px solid rgba(74, 124, 89, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  categoryTitle: {
    fontWeight: 700,
    fontSize: '1.3rem',
    color: '#ffffff',
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  categorySubtitle: {
    fontSize: '0.9rem',
    color: '#e0e0e0',
    opacity: 0.8,
  },
}));

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ShopItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  badge?: string;
  features: string[];
  isPremium?: boolean;
  isPopular?: boolean;
  link: string;
  category: string;
}

const EmpresasPage: React.FC = memo(() => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const [cartItems, setCartItems] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddToCart = (item: ShopItem) => {
    setCartItems(prev => prev + 1);
  };

  const menuItems: MenuItem[] = [
    { id: 'todos', label: 'Todos Serviços', icon: <Store /> },
    { id: 'digital', label: 'Serviços Digitais', icon: <Computer /> },
    { id: 'juridico', label: 'Jurídico', icon: <Gavel /> },
    { id: 'financeiro', label: 'Financeiro', icon: <MonetizationOn /> },
    { id: 'marketing', label: 'Marketing', icon: <TrendingUp /> },
    { id: 'suporte', label: 'Suporte', icon: <People /> },
    { id: 'premium', label: 'Premium', icon: <Star /> },
  ];

  const shopItems: ShopItem[] = [
    // Serviços Digitais
    {
      id: 'portal-digital',
      title: 'Portal Digital Empresarial',
      description: 'Plataforma completa para gestão digital dos seus processos empresariais com IA integrada',
      icon: <Computer />,
      price: 'R$ 299,00/mês',
      badge: 'Mais Vendido',
      features: ['Dashboard Executivo', 'IA Integrada', 'Relatórios Automáticos', 'API Completa'],
      link: '/beto/digital/empresas',
      category: 'digital',
      isPopular: true,
    },
    {
      id: 'assinatura-digital',
      title: 'Assinatura Digital Certificada',
      description: 'Documentos com validade jurídica e certificação ICP-Brasil para sua empresa',
      icon: <Lock />,
      price: 'R$ 149,00/mês',
      features: ['Certificado ICP-Brasil', 'Ilimitadas Assinaturas', 'Validade Jurídica', 'Timestamping'],
      link: '/beto/digital/assinatura',
      category: 'digital',
    },
    // Serviços Jurídicos
    {
      id: 'requerimentos-premium',
      title: 'Requerimentos Premium',
      description: 'Processamento prioritário de requerimentos com acompanhamento dedicado',
      icon: <Assignment />,
      price: 'R$ 199,00/mês',
      badge: 'Premium',
      features: ['Processamento 24h', 'Gerente Dedicado', 'Histórico Completo', 'Notificações SMS'],
      link: '/beto/requerimento',
      category: 'juridico',
      isPremium: true,
    },
    {
      id: 'transferencias-express',
      title: 'Transferências Express',
      description: 'Transferências veiculares com processamento em até 2 horas úteis',
      icon: <Speed />,
      price: 'R$ 89,00/processo',
      features: ['Processamento 2h', 'Documentos Digitais', 'Rastreamento Real-time', 'Suporte WhatsApp'],
      link: '/beto/transferencia',
      category: 'juridico',
    },
    // Serviços Financeiros
    {
      id: 'gestao-financeira',
      title: 'Gestão Financeira Inteligente',
      description: 'Controle financeiro com IA para análise de fluxo de caixa e previsões',
      icon: <TrendingUp />,
      price: 'R$ 399,00/mês',
      badge: 'IA Powered',
      features: ['Análise com IA', 'Previsões Financeiras', 'Relatórios Executivos', 'Integração Bancária'],
      link: '/beto/dashboard/financeiro',
      category: 'financeiro',
      isPremium: true,
    },
    {
      id: 'pagamentos-online',
      title: 'Gateway de Pagamentos',
      description: 'Receba pagamentos online com as menores taxas do mercado',
      icon: <CreditCard />,
      price: '1,99% por transação',
      features: ['Taxas Reduzidas', 'PIX Instantâneo', 'Cartões de Crédito', 'Boleto Bancário'],
      link: '/beto/pagamentos',
      category: 'financeiro',
    },
    // Marketing Digital
    {
      id: 'marketing-ia',
      title: 'Marketing com IA',
      description: 'Campanhas inteligentes que se otimizam automaticamente para máximo ROI',
      icon: <Build />,
      price: 'R$ 599,00/mês',
      badge: 'Exclusivo',
      features: ['Campanhas Automatizadas', 'Análise de Público', 'A/B Test Automático', 'ROI Otimizado'],
      link: '/beto/marketing/ia',
      category: 'marketing',
      isPremium: true,
    },
    {
      id: 'redes-sociais',
      title: 'Gestão de Redes Sociais',
      description: 'Gestão completa das suas redes sociais com conteúdo personalizado',
      icon: <Public />,
      price: 'R$ 299,00/mês',
      features: ['Conteúdo Personalizado', 'Agendamento Automático', 'Relatórios de Engajamento', 'Stories Templates'],
      link: '/beto/marketing/social',
      category: 'marketing',
    },
    // Suporte Técnico
    {
      id: 'suporte-24h',
      title: 'Suporte 24/7 Premium',
      description: 'Suporte técnico especializado disponível 24 horas por dia, 7 dias por semana',
      icon: <People />,
      price: 'R$ 199,00/mês',
      features: ['Atendimento 24/7', 'Técnicos Especializados', 'Prioridade Máxima', 'Videoconferência'],
      link: '/beto/suporte/premium',
      category: 'suporte',
      isPremium: true,
    },
    {
      id: 'consultoria-personalizada',
      title: 'Consultoria Empresarial',
      description: 'Consultoria especializada para otimização dos seus processos empresariais',
      icon: <Build />,
      price: 'R$ 150,00/hora',
      features: ['Consultores Especialistas', 'Análise Completa', 'Plano de Ação', 'Acompanhamento Mensal'],
      link: '/beto/consultoria',
      category: 'suporte',
    },
    // Novos Serviços Adicionados
    {
      id: 'licenciamento-anual',
      title: 'Licenciamento Anual Veicular',
      description: 'Renovação de licenciamento com processo 100% digital e acompanhamento completo',
      icon: <Assignment />,
      price: 'R$ 75,00',
      features: ['Processo Digital', 'Pagamento Online', 'Entrega em Casa', 'Acompanhamento SMS'],
      link: '/beto/licenciamento',
      category: 'juridico',
    },
    {
      id: 'cnh-renovacao',
      title: 'Renovação de CNH',
      description: 'Renovação de CNH com agendamento de exames e assessoria completa',
      icon: <AccountBox />,
      price: 'R$ 120,00',
      features: ['Agendamento Exames', 'Assessoria Médica', 'Entrega Expressa', 'Suporte Total'],
      link: '/beto/cnh/renovacao',
      category: 'juridico',
    },
    {
      id: 'primeira-habilitacao',
      title: 'Primeira Habilitação',
      description: 'Processo completo para primeira habilitação com acompanhamento personalizado',
      icon: <Fingerprint />,
      price: 'R$ 899,00',
      badge: 'Completo',
      features: ['Auto Escola Parceira', 'Exames Inclusos', 'Aulas Práticas', 'Garantia Aprovação'],
      link: '/beto/cnh/primeira',
      category: 'juridico',
      isPopular: true,
    },
    {
      id: 'vistoria-cautelar',
      title: 'Vistoria Cautelar',
      description: 'Vistoria preventiva para transferência e documentação veicular',
      icon: <Security />,
      price: 'R$ 89,00',
      features: ['Agendamento Rápido', 'Laudos Digitais', 'Certificação DETRAN', 'Validade Nacional'],
      link: '/beto/vistoria/cautelar',
      category: 'juridico',
    },
    {
      id: 'ipva-parcelamento',
      title: 'IPVA & Parcelamento',
      description: 'Gestão de IPVA com opções de parcelamento e negociação de débitos',
      icon: <MonetizationOn />,
      price: 'R$ 45,00',
      features: ['Parcelamento IPVA', 'Negociação Débitos', 'Desconto à Vista', 'Consultoria Tributária'],
      link: '/beto/ipva',
      category: 'financeiro',
    },
    {
      id: 'multas-recursos',
      title: 'Recursos de Multas',
      description: 'Defesa e recursos contra multas de trânsito com alta taxa de sucesso',
      icon: <Gavel />,
      price: 'R$ 89,00',
      badge: '95% Sucesso',
      features: ['Análise Jurídica', 'Defesa Especializada', 'Acompanhamento Online', 'Sem Cobrança se Perder'],
      link: '/beto/multas/recursos',
      category: 'juridico',
      isPremium: true,
    },
    {
      id: 'financiamento-veicular',
      title: 'Financiamento Veicular',
      description: 'Assessoria completa para financiamento de veículos com as melhores taxas',
      icon: <CreditCard />,
      price: 'R$ 199,00',
      features: ['Melhores Taxas', 'Análise Crédito', 'Documentação Completa', 'Aprovação Expressa'],
      link: '/beto/financiamento',
      category: 'financeiro',
    },
    {
      id: 'seguro-veicular',
      title: 'Seguro Veicular Premium',
      description: 'Cotação e contratação de seguro veicular com cobertura completa',
      icon: <Security />,
      price: 'R$ 120,00',
      features: ['Múltiplas Seguradoras', 'Cobertura Total', 'Assistência 24h', 'Desconto Especial'],
      link: '/beto/seguro',
      category: 'premium',
      isPremium: true,
    },
    {
      id: 'regularizacao-pendencias',
      title: 'Regularização de Pendências',
      description: 'Solução completa para regularizar pendências veiculares e documentais',
      icon: <Assessment />,
      price: 'R$ 150,00',
      badge: 'Urgente',
      features: ['Análise Completa', 'Plano de Ação', 'Negociação Débitos', 'Regularização Total'],
      link: '/beto/regularizacao',
      category: 'juridico',
    },
    {
      id: 'blindagem-documental',
      title: 'Blindagem Documental',
      description: 'Proteção jurídica completa de documentos com tecnologia blockchain',
      icon: <Lock />,
      price: 'R$ 299,00/ano',
      badge: 'Blockchain',
      features: ['Proteção Blockchain', 'Backup Seguro', 'Acesso 24/7', 'Certificação Digital'],
      link: '/beto/blindagem',
      category: 'premium',
      isPremium: true,
    },
  ];

  const getFilteredItems = () => {
    const activeMenuItem = menuItems[activeTab];
    if (activeMenuItem.id === 'todos') {
      return shopItems;
    }
    return shopItems.filter(item => item.category === activeMenuItem.id);
  };

  const renderShopCard = (item: ShopItem, index: number) => (
    <Grid item xs={12} sm={6} md={4} key={item.id}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card
          className={`${classes.shopCard} ${item.isPremium ? classes.premiumCard : ''}`}
          onClick={() => window.open(item.link, '_blank')}
        >
          {item.badge && (
            <Chip
              label={item.badge}
              className={`${classes.shopBadge} ${item.isPremium ? classes.premiumBadge : ''}`}
            />
          )}

          <CardContent style={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="center" marginBottom={2}>
              <Box className={classes.shopIcon} style={{ color: item.isPremium ? '#ffffff' : '#0f4c3a' }}>
                {item.icon}
              </Box>
            </Box>

            <Typography
              className={`${classes.shopTitle} ${item.isPremium ? classes.shopTitlePremium : ''}`}
              variant="h6"
            >
              {item.title}
            </Typography>

            <Typography
              className={`${classes.shopDescription} ${item.isPremium ? classes.shopDescriptionPremium : ''}`}
              style={{ marginBottom: theme.spacing(2), flexGrow: 1 }}
            >
              {item.description}
            </Typography>

            <Box className={classes.featuresGrid}>
              {item.features.map((feature, idx) => (
                <Box key={idx} className={classes.featureItem}>
                  <CheckCircle className={classes.featureIcon} style={{ color: item.isPremium ? '#ffffff' : '#4a7c59' }} />
                  <Typography
                    className={`${classes.featureText} ${item.isPremium ? classes.featureTextPremium : ''}`}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2}>
              <Typography
                className={`${classes.shopPrice} ${item.isPremium ? classes.shopPricePremium : ''}`}
              >
                {item.price}
              </Typography>
              <Button
                className={`${classes.shopButton} ${item.isPremium ? classes.shopButtonPremium : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
                size="small"
              >
                Contratar
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  );

  const activeMenuItem = menuItems[activeTab];
  const filteredItems = getFilteredItems();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.sidebarButton}
            color="inherit"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Avatar
            style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #4a7c59 0%, #2d5a3d 100%)',
              fontSize: '1rem',
              fontWeight: 'bold',
              marginRight: theme.spacing(2)
            }}
          >
            BD
          </Avatar>

          <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 600 }}>
            Shop Empresarial - Beto Dehon
          </Typography>

          <Box className={classes.breadcrumb}>
            <Business />
            <Typography variant="body2" style={{ color: '#ffffff' }}>
              Shop / {activeMenuItem?.label || 'Todos'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header Section */}
          <Paper className={classes.headerSection}>
            <Typography className={classes.mainTitle}>
              🏪 Shop Empresarial Premium
            </Typography>
            <Typography className={classes.subtitle}>
              Soluções Digitais & Serviços Especializados para sua Empresa
            </Typography>

            <Box className={classes.statsContainer}>
              <Box className={classes.statItem}>
                <Typography className={classes.statNumber}>50+</Typography>
                <Typography className={classes.statLabel}>Serviços</Typography>
              </Box>
              <Box className={classes.statItem}>
                <Typography className={classes.statNumber}>24/7</Typography>
                <Typography className={classes.statLabel}>Suporte</Typography>
              </Box>
              <Box className={classes.statItem}>
                <Typography className={classes.statNumber}>99.9%</Typography>
                <Typography className={classes.statLabel}>Uptime</Typography>
              </Box>
              <Box className={classes.statItem}>
                <Typography className={classes.statNumber}>1000+</Typography>
                <Typography className={classes.statLabel}>Clientes</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Menu Horizontal */}
          <Paper className={classes.horizontalMenu}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              className={classes.tabsContainer}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              indicatorColor="primary"
              textColor="primary"
            >
              {menuItems.map((item, index) => (
                <Tab
                  key={item.id}
                  label={
                    <Box display="flex" alignItems="center" style={{ gap: 1 }}>
                      {item.icon}
                      <Typography variant="body2" style={{ marginLeft: 8 }}>
                        {item.label}
                      </Typography>
                    </Box>
                  }
                  className={classes.tab}
                />
              ))}
            </Tabs>
          </Paper>

          {/* Category Header */}
          <Box className={classes.categoryHeader}>
            <Typography className={classes.categoryTitle}>
              {activeMenuItem?.icon}
              {activeMenuItem?.label}
            </Typography>
            <Typography className={classes.categorySubtitle}>
              {filteredItems.length} serviços disponíveis nesta categoria
            </Typography>
          </Box>

          {/* Shop Grid */}
          <Container maxWidth="xl">
            <Grid container spacing={2} className={classes.shopGrid}>
              {filteredItems.map((item, index) => renderShopCard(item, index))}
            </Grid>
          </Container>

          {/* Link para Menu Principal */}
          <Box textAlign="center" mt={6}>
            <Link href="/beto" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                startIcon={<Home />}
                style={{
                  borderColor: '#4a7c59',
                  color: '#4a7c59',
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                Voltar ao Menu Principal
              </Button>
            </Link>
          </Box>
        </motion.div>
      </main>

      {/* Floating Cart Button */}
      <Fab
        className={classes.cartFab}
        onClick={() => { }}
      >
        <Badge badgeContent={cartItems} color="error">
          <ShoppingCart />
        </Badge>
      </Fab>
    </div>
  );
});

EmpresasPage.displayName = 'EmpresasPage';

export default EmpresasPage;

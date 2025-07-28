
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Badge,
} from '@material-ui/core';
import {
  CheckCircle,
  Star,
  Business,
  Assignment,
  Security,
  People,
  Chat,
  Assessment,
  TrendingUp,
  MonetizationOn,
  CloudUpload,
  Search,
  Settings,
  VerifiedUser,
  Speed,
 
  Backup,
  Timeline,
  AccountBalance,
  DirectionsCar,
  Description,
  Build,
  LocalShipping,
  Warning,
  Category,
  PhoneInTalk,
  Email,
  Schedule,
  CreditCard,
  AccountBox,
  Gavel,
  EmojiObjects,
  BarChart,
  CloudQueue,
  Lock,
  FlashOn,
  Smartphone,
  Computer,
  Headset,
  Group,
  School,
} from '@material-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
  appBar: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: 'none',
  },
  container: {
    position: 'relative',
    zIndex: 2,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(6),
    color: '#fff',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: '1.4rem',
    opacity: 0.9,
    marginBottom: theme.spacing(4),
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50px',
    padding: theme.spacing(1, 3),
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: theme.spacing(6),
  },
  planCard: {
    height: '100%',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-12px) scale(1.02)',
      boxShadow: '0 32px 64px rgba(0,0,0,0.25)',
    },
  },
  popularPlan: {
    border: '2px solid #667eea',
    transform: 'scale(1.05)',
    '&:hover': {
      transform: 'translateY(-12px) scale(1.07)',
    },
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: theme.spacing(1, 3),
    borderRadius: '0 0 20px 20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
  },
  planHeader: {
    textAlign: 'center',
    padding: theme.spacing(3, 3, 2, 3),
  },
  planIcon: {
    fontSize: '4rem',
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  planName: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: theme.spacing(1),
  },
  planDescription: {
    color: '#718096',
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  priceContainer: {
    textAlign: 'center',
    padding: theme.spacing(2, 3),
    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
    margin: theme.spacing(0, -1),
  },
  price: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#2d3748',
    lineHeight: 1,
  },
  originalPrice: {
    fontSize: '1.2rem',
    color: '#a0aec0',
    textDecoration: 'line-through',
    marginRight: theme.spacing(1),
  },
  period: {
    fontSize: '1rem',
    color: '#718096',
    fontWeight: 500,
  },
  discount: {
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginTop: theme.spacing(1),
    display: 'inline-block',
  },
  featuresList: {
    padding: theme.spacing(0, 2, 2, 2),
  },
  featureItem: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  featureIcon: {
    color: '#48bb78',
    minWidth: '36px',
  },
  featureText: {
    fontSize: '0.95rem',
    color: '#4a5568',
    fontWeight: 500,
  },
  ctaButton: {
    margin: theme.spacing(2, 3, 3, 3),
    padding: theme.spacing(1.5, 0),
    borderRadius: '16px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    textTransform: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
    },
  },
  enterpriseButton: {
    background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
    boxShadow: '0 8px 32px rgba(45, 55, 72, 0.4)',
    '&:hover': {
      boxShadow: '0 12px 40px rgba(45, 55, 72, 0.6)',
    },
  },
  statsContainer: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: theme.spacing(3),
    marginTop: theme.spacing(6),
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    textAlign: 'center',
    color: '#fff',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  statLabel: {
    fontSize: '1rem',
    opacity: 0.9,
  },
  testimonialsContainer: {
    marginTop: theme.spacing(8),
  },
  testimonialCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: theme.spacing(3),
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    textAlign: 'center',
  },
  testimonialAvatar: {
    width: 60,
    height: 60,
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  faqContainer: {
    marginTop: theme.spacing(8),
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: theme.spacing(4),
    backdropFilter: 'blur(20px)',
  },
}));

interface PlanFeature {
  text: string;
  icon: React.ReactNode;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  monthlyPrice: number;
  yearlyPrice: number;
  originalYearlyPrice: number;
  features: PlanFeature[];
  popular?: boolean;
  buttonText: string;
  color: string;
}

const Planos: React.FC = () => {
  const classes = useStyles();
  const [isYearly, setIsYearly] = useState(false);

  const plans: Plan[] = [
    {
      id: 'basico',
      name: 'Básico',
      description: 'Ideal para pequenos despachantes e escritórios iniciantes',
      icon: <Business />,
      monthlyPrice: 197,
      yearlyPrice: 1576,
      originalYearlyPrice: 2364,
      buttonText: 'Começar Agora',
      color: '#667eea',
      features: [
        { text: 'Até 50 clientes', icon: <People /> },
        { text: 'Gestão de requerimentos', icon: <Assignment /> },
        { text: 'Chat básico', icon: <Chat /> },
        { text: 'Relatórios simples', icon: <Assessment /> },
        { text: 'Suporte por email', icon: <Email /> },
        { text: 'Backup diário', icon: <Backup /> },
        { text: 'Acesso web', icon: <Computer /> },
      ],
    },
    {
      id: 'profissional',
      name: 'Profissional',
      description: 'Para despachantes em crescimento com necessidades avançadas',
      icon: <Star />,
      monthlyPrice: 397,
      yearlyPrice: 3176,
      originalYearlyPrice: 4764,
      popular: true,
      buttonText: 'Mais Popular',
      color: '#764ba2',
      features: [
        { text: 'Até 200 clientes', icon: <People /> },
        { text: 'CRM inteligente', icon: <TrendingUp /> },
        { text: 'Chat IA Lívia', icon: <EmojiObjects /> },
        { text: 'Relatórios avançados', icon: <BarChart /> },
        { text: 'Gestão financeira', icon: <MonetizationOn /> },
        { text: 'Documentos ilimitados', icon: <CloudUpload /> },
        { text: 'API integração', icon: <Settings /> },
        { text: 'Suporte prioritário', icon: <Headset /> },
        { text: 'App mobile', icon: <Smartphone /> },
        { text: 'Backup em tempo real', icon: <CloudQueue /> },
        { text: 'Segurança avançada', icon: <Lock /> },
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Solução completa para grandes operações e franquias',
      icon: <AccountBalance />,
      monthlyPrice: 797,
      yearlyPrice: 6376,
      originalYearlyPrice: 9564,
      buttonText: 'Contatar Vendas',
      color: '#2d3748',
      features: [
        { text: 'Clientes ilimitados', icon: <People /> },
        { text: 'Multi-filiais', icon: <Business /> },
        { text: 'IA personalizada', icon: <FlashOn /> },
        { text: 'Analytics completo', icon: <Timeline /> },
        { text: 'Integração bancária', icon: <AccountBalance /> },
        { text: 'Gestão de equipes', icon: <Group /> },
        { text: 'Automação completa', icon: <Speed /> },
        { text: 'Suporte dedicado 24/7', icon: <Build /> },
        { text: 'Treinamento incluso', icon: <School /> },
        { text: 'Customizações', icon: <Build /> },
        { text: 'SLA garantido', icon: <VerifiedUser /> },
        { text: 'Consultoria estratégica', icon: <Gavel /> },
      ],
    },
  ];

  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Despachante - São Paulo',
      text: 'Revolucionou meu negócio! Economia de 70% no tempo operacional.',
      avatar: 'CS',
    },
    {
      name: 'Maria Santos',
      role: 'Franquia Despachante - Rio',
      text: 'A IA Lívia atende meus clientes melhor que eu mesmo!',
      avatar: 'MS',
    },
    {
      name: 'João Pereira',
      role: 'Grupo Despachante - MG',
      text: 'ROI de 300% em 6 meses. Simplesmente fantástico!',
      avatar: 'JP',
    },
  ];

  const stats = [
    { number: '5.000+', label: 'Despachantes Ativos' },
    { number: '98%', label: 'Satisfação' },
    { number: '24/7', label: 'Suporte' },
    { number: '99.9%', label: 'Uptime' },
  ];

  return (
    <Box className={classes.root}>
      <div className={classes.backgroundPattern} />
      
      {/* Header */}
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold', color: '#fff' }}>
            Beto Dehon - Planos
          </Typography>
          <Button color="inherit" startIcon={<PhoneInTalk />}>
            Contato
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className={classes.container}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={classes.header}
        >
          <Typography variant="h1" className={classes.title}>
            Escolha Seu Plano
          </Typography>
          <Typography variant="h5" className={classes.subtitle}>
            Transforme sua operação com a plataforma mais avançada para despachantes do Brasil
          </Typography>
          
          {/* Toggle Mensal/Anual */}
          <Box className={classes.toggleContainer}>
            <Typography style={{ color: '#fff', marginRight: 16 }}>Mensal</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isYearly}
                  onChange={(e) => setIsYearly(e.target.checked)}
                  color="secondary"
                />
              }
              label=""
            />
            <Typography style={{ color: '#fff', marginLeft: 16 }}>
              Anual
              <Chip
                label="33% OFF"
                size="small"
                style={{
                  backgroundColor: '#48bb78',
                  color: '#fff',
                  marginLeft: 8,
                  fontSize: '0.7rem',
                }}
              />
            </Typography>
          </Box>
        </motion.div>

        {/* Plans Grid */}
        <Grid container spacing={4}>
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className={`${classes.planCard} ${plan.popular ? classes.popularPlan : ''}`}>
                  {plan.popular && (
                    <div className={classes.popularBadge}>
                      <Star style={{ fontSize: '1rem', marginRight: 4 }} />
                      Mais Popular
                    </div>
                  )}
                  
                  {/* Plan Header */}
                  <div className={classes.planHeader}>
                    <div className={classes.planIcon}>
                      {plan.icon}
                    </div>
                    <Typography className={classes.planName}>
                      {plan.name}
                    </Typography>
                    <Typography className={classes.planDescription}>
                      {plan.description}
                    </Typography>
                  </div>

                  {/* Price */}
                  <div className={classes.priceContainer}>
                    {isYearly && (
                      <div>
                        <span className={classes.originalPrice}>
                          R$ {plan.originalYearlyPrice}
                        </span>
                      </div>
                    )}
                    <Typography className={classes.price}>
                      R$ {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </Typography>
                    <Typography className={classes.period}>
                      /{isYearly ? 'ano' : 'mês'}
                    </Typography>
                    {isYearly && (
                      <div className={classes.discount}>
                        Economize 33%
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <List className={classes.featuresList}>
                    {plan.features.map((feature, featureIndex) => (
                      <ListItem key={featureIndex} className={classes.featureItem}>
                        <ListItemIcon className={classes.featureIcon}>
                          {feature.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.text}
                          primaryTypographyProps={{
                            className: classes.featureText
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  {/* CTA Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    className={`${classes.ctaButton} ${plan.id === 'enterprise' ? classes.enterpriseButton : ''}`}
                  >
                    {plan.buttonText}
                  </Button>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Paper className={classes.statsContainer}>
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box className={classes.statItem}>
                    <Typography className={classes.statNumber}>
                      {stat.number}
                    </Typography>
                    <Typography className={classes.statLabel}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className={classes.testimonialsContainer}
        >
          <Typography variant="h4" style={{ textAlign: 'center', color: '#fff', marginBottom: 32, fontWeight: 'bold' }}>
            O que nossos clientes dizem
          </Typography>
          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper className={classes.testimonialCard}>
                  <Avatar className={classes.testimonialAvatar}>
                    {testimonial.avatar}
                  </Avatar>
                  <Typography variant="body1" style={{ marginBottom: 16, fontStyle: 'italic' }}>
                    "{testimonial.text}"
                  </Typography>
                  <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="caption">
                    {testimonial.role}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* FAQ/Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Paper className={classes.faqContainer}>
            <Typography variant="h4" style={{ textAlign: 'center', marginBottom: 32, fontWeight: 'bold', color: '#2d3748' }}>
              Recursos Inclusos
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon><Security style={{ color: '#667eea' }} /></ListItemIcon>
                    <ListItemText primary="Segurança bancária" secondary="Criptografia de ponta a ponta" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Speed style={{ color: '#667eea' }} /></ListItemIcon>
                    <ListItemText primary="Performance otimizada" secondary="Resposta em menos de 1 segundo" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Backup style={{ color: '#667eea' }} /></ListItemIcon>
                    <ListItemText primary="Backup automático" secondary="Seus dados sempre seguros" />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon><Build style={{ color: '#667eea' }} /></ListItemIcon>
                    <ListItemText primary="Atualizações constantes" secondary="Novos recursos toda semana" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Build style={{ color: '#667eea' }} /></ListItemIcon>
                    <ListItemText primary="Suporte especializado" secondary="Time dedicado ao seu sucesso" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Timeline style={{ color: '#667eea' }} /></ListItemIcon>
                    <ListItemText primary="Analytics avançado" secondary="Insights para otimizar seu negócio" />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Planos;

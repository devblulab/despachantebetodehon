
import React from 'react';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  useMediaQuery,
  useTheme,
  Fab,
  Divider
} from '@material-ui/core';
import { motion } from 'framer-motion';
import { 
  FaWhatsapp, 
  FaCar, 
  FaFileAlt, 
  FaShieldAlt, 
  FaClock, 
  FaCheck,
  FaAward,
  FaUserTie,
  FaStar,
  FaGraduationCap,
  FaIdCard,
  FaExchangeAlt,
  FaSearch,
  FaTruck,
  FaClipboardCheck,
  FaMoneyBill,
  FaMotorcycle,
  FaExclamationTriangle,
  FaUserPlus,
  FaReceipt,
  FaCreditCard,
  FaPlane
} from 'react-icons/fa';
import Servicos from '@/pages/servicosland/index';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(0deg, #dce3f4 -10%, #c6e5d9 87%, #497f66 65%, #b6f0d0 110%) ',
    padding: theme.spacing(-9),
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  heroSection: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    
    justifyContent: 'center',
    position: 'relative',
    padding: theme.spacing(2, 1),
    [theme.breakpoints.down('sm')]: {
      minHeight: '100vh',
      padding: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      minHeight: '95vh',
      padding: theme.spacing(1),
    },
  },
  heroContent: {
    textAlign: 'center',
    color: '#fff',
    zIndex: 2,
    
    maxWidth: '100%',
    width: '100%',
  },
  professionalHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    
      backgroundSize: '900px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(0),
    },
  },
  logoContainer: {
    position: 'relative',
    marginBottom: theme.spacing(1),
    
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
  },
  logo: {
    width: 'clamp(120px, 18vw, 180px)',
    height: 'clamp(120px, 18vw, 180px)',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid rgba(255,255,255,0.3)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 8px rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 0 12px rgba(255,255,255,0.15)',
    },
    [theme.breakpoints.up('md')]: {
      width: 'clamp(130px, 15vw, 160px)',
      height: 'clamp(130px, 15vw, 160px)',
    },
  },
  experienceBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    background: 'linear-gradient(45deg, #f59e0b 30%, #d97706 90%)',
    borderRadius: '50%',
    width: 'clamp(60px, 12vw, 80px)',
    height: 'clamp(60px, 12vw, 80px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 900,
    fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
    boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
    border: '3px solid rgba(255,255,255,0.3)',
  },
  credentialsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(1),
    },
  },
  professionalTitle: {
    fontFamily: '"Playfair Display", "Georgia", serif',
    fontWeight: 800,
    fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)',
    
    color: '#f1f5f9',
    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
    lineHeight: 1.2,
    marginBottom: theme.spacing(1),
  },
  credentialsBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  credentialBadge: {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 20,
    padding: '8px 16px',
    border: '1px solid rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
    fontWeight: 600,
    color: '#e2e8f0',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255,255,255,0.2)',
      transform: 'translateY(-2px)',
    },
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing(1.5),
    maxWidth: '1200px',
    width: '100%',
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing(1.5),
      maxWidth: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: theme.spacing(1),
      marginTop: theme.spacing(0.5),
    },
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: theme.spacing(1.2),
    },
  },
  serviceCard: {
    background: 'rgba(255,255,255,0.58)',
    backdropFilter: 'blur(15px)',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.15)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: theme.spacing(1.5),
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '&:hover': {
      transform: 'translateY(-4px) scale(1.02)',
      background: 'rgba(255,255,255,0.15)',
      boxShadow: '0 12px 25px rgba(0,0,0,0.3)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      transition: 'left 0.8s ease',
    },
    '&:hover::before': {
      left: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
      minHeight: '100px',
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1),
      minHeight: '100px',
    },
  },
  serviceIcon: {
    fontSize: 'clamp(24px, 5vw, 32px)',
    color: '#fbbf24',
    marginBottom: theme.spacing(0.5),
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
    transition: 'all 0.3s ease',
    [theme.breakpoints.up('md')]: {
      fontSize: 'clamp(20px, 3vw, 28px)',
      marginBottom: theme.spacing(0.3),
    },
  },
  serviceTitle: {
    fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
    fontWeight: 700,
    color: '#f8fafc',
    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
    lineHeight: 1.1,
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.up('md')]: {
      fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
      marginBottom: theme.spacing(0.3),
    },
  },
  servicePrice: {
    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
    fontWeight: 400,
    color: '#10b981',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  },
  mainTitle: {
    fontFamily: '"Playfair Display", "Georgia", serif',
    fontWeight: 900,
    fontSize: 'clamp(2.2rem, 8vw, 4.5rem)',
    textShadow: '2px 2px 8px rgba(0,0,0,0.6)',
    marginBottom: theme.spacing(2),
    lineHeight: 1.1,
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    [theme.breakpoints.down('xs')]: {
      fontSize: 'clamp(2rem, 10vw, 3rem)',
    },
  },
  subtitle: {
    fontSize: 'clamp(1rem, 3.5vw, 1.4rem)',
    fontWeight: 400,
    marginBottom: theme.spacing(2),
    textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
    maxWidth: '900px',
    margin: '0 auto',
    lineHeight: 1.4,
    color: '#cbd5e1',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
      padding: '0 16px',
    },
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(1.5),
      fontSize: 'clamp(1rem, 3vw, 1.3rem)',
    },
  },
  ctaContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(1.5),
    },
  },
  primaryButton: {
    background: 'linear-gradient(45deg, #25D366 30%, #22c55e 90%)',
    color: '#fff',
    padding: 'clamp(14px, 2.5vw, 18px) clamp(28px, 6vw, 36px)',
    fontSize: 'clamp(1rem, 2.8vw, 1.2rem)',
    fontWeight: 700,
    borderRadius: 50,
    textTransform: 'none',
    boxShadow: '0 12px 30px rgba(37, 211, 102, 0.4)',
    transition: 'all 0.3s ease',
    minWidth: 'clamp(220px, 32vw, 280px)',
    '&:hover': {
      background: 'linear-gradient(45deg, #22c55e 30%, #16a34a 90%)',
      transform: 'translateY(-3px)',
      boxShadow: '0 16px 40px rgba(37, 211, 102, 0.5)',
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: '90%',
      maxWidth: '320px',
    },
  },
  secondaryButton: {
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: '2px solid rgba(255,255,255,0.3)',
    padding: 'clamp(14px, 2.5vw, 18px) clamp(28px, 6vw, 36px)',
    fontSize: 'clamp(1rem, 2.8vw, 1.2rem)',
    fontWeight: 600,
    borderRadius: 50,
    textTransform: 'none',
    backdropFilter: 'blur(15px)',
    transition: 'all 0.3s ease',
    minWidth: 'clamp(200px, 28vw, 250px)',
    '&:hover': {
      background: 'rgba(255,255,255,0.2)',
      border: '2px solid rgba(255,255,255,0.5)',
      transform: 'translateY(-3px)',
      boxShadow: '0 12px 30px rgba(255,255,255,0.1)',
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: '90%',
      maxWidth: '320px',
    },
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
  },
  floatingButton: {
    position: 'fixed',
    bottom: 'clamp(20px, 5vw, 30px)',
    left: 'clamp(20px, 5vw, 30px)', // ⬅️ Alterado aqui
    background: 'linear-gradient(45deg, #25D366 30%, #22c55e 90%)',
    color: '#fff',
    width: 'clamp(60px, 13vw, 70px)',
    height: 'clamp(60px, 13vw, 70px)',
    boxShadow: '0 12px 30px rgba(37, 211, 102, 0.5)',
    zIndex: 1000,
    '&:hover': {
      background: 'linear-gradient(45deg, #22c55e 30%, #16a34a 90%)',
      transform: 'scale(1.1)',
      boxShadow: '0 16px 40px rgba(37, 211, 102, 0.6)',
    },
  },

  whatsappIcon: {
    fontSize: 'clamp(28px, 7vw, 36px)',
  },
  divider: {
    background: 'rgba(255,255,255,0.2)',
    height: 2,
    margin: theme.spacing(1.5, 0),
    maxWidth: 200,
    alignSelf: 'center',
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(-1, 0),
    },
  },
}));



const credentials = [
  {
    icon: <FaAward />,
    title: '20+ Anos',
  },
  {
    icon: <FaGraduationCap />,
    title: 'Especialista',
  },
  {
    icon: <FaStar />,
    title: 'Certificado',
  },
  {
    icon: <FaUserTie />,
    title: 'Profissional',
  }
];

export default function Home() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));

  const fadeInUp = {
    hidden: { opacity: 0, y: 80 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const serviceCardAnimation = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <Head>
        <title>Despachante Beto Dehon | 20+ Anos de Experiência | Documentação Veicular Digital</title>
        <meta
          name="description"
          content="Despachante Beto Dehon - Mais de 20 anos de experiência em documentação veicular. Atendimento profissional, ágil e 100% digital em Tubarão/SC. Especialista certificado."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/betologo.jpg" />
      </Head>

      <div className={classes.root}>
        <div className={classes.backgroundPattern} />
        
        {/* Hero Section */}
        <section className={classes.heroSection}>
          <Container maxWidth="lg" className={classes.heroContent}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Header Profissional */}
              <motion.div variants={fadeInUp} className={classes.professionalHeader}>
                <div className={classes.logoContainer}>
                  <motion.img 
                    src="/betologo.jpg" 
                    alt="Despachante Beto Dehon" 
                    className={classes.logo}
                    variants={scaleIn}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className={classes.experienceBadge}
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <div>20+</div>
                    <div style={{ fontSize: '0.6em' }}>ANOS</div>
                  </motion.div>
                </div>
                {/* Título Principal */}
                <motion.div variants={fadeInUp}>
                  <motion.h1 
                    className={classes.mainTitle}
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {isXs ? "Beto Dehon" : "Despachante Beto Dehon"}
                  </motion.h1>
                </motion.div>

                {/* Subtítulo */}
                <motion.div variants={fadeInUp}>
                  <Typography className={classes.subtitle}>
                    {isXs 
                      ? "Precisa parcelar seu documento? Parcelamos qualquer valor em até 18x no cartão!"
                      : isMobile 
                      ? "20+ anos de experiência em documentação veicular digital e segura"
                      : "Meio século de experiência, tradição e excelência. Especialista certificado em documentação veicular com atendimento 100% digital e personalizado. Parcelamos qualquer valor em até 18x no cartão!"
                    }
                  </Typography>
                </motion.div>

                <div className={classes.credentialsContainer}>
                  <Typography className={classes.professionalTitle}>
                    Despachante Profissional Certificado
                  </Typography>
                  
                  <div className={classes.credentialsBadges}>
                    {credentials.map((credential, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        transition={{ delay: index * 0.1 }}
                        className={classes.credentialBadge}
                        whileHover={{ scale: 1.1, y: -5 }}
                      >
                        {credential.icon}
                        <span>{credential.title}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Divider className={classes.divider} />

              
                  <motion.div variants={fadeInUp}>  
                              
                </motion.div>
              </motion.div>

         
              <Servicos />
              {/* Botões de Ação */}
              <motion.div variants={fadeInUp} className={classes.ctaContainer}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className={classes.primaryButton}
                    startIcon={<FaWhatsapp />}
                    href="https://wa.me/5548988449379"
                    target="_blank"
                    rel="noopener"
                  >
                    {isXs ? "Consulta Especializada" : "Solicitar Consulta Especializada"}
                  </Button>
                </motion.div>
                
                
              </motion.div>
            </motion.div>
          </Container>
        </section>
      
        {/* Floating WhatsApp Button */}
        <motion.div
          animate={{
            y: [0, -1, 0],
            rotate: [0, 1, -1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Fab
            className={classes.floatingButton}
            href="https://wa.me/5548988449379"
            target="_blank"
            rel="noopener"
            aria-label="Contato WhatsApp Especializado"
          >
            <FaWhatsapp className={classes.whatsappIcon} />
          </Fab>
        </motion.div>
      </div>
    </>
  );
}

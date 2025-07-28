
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Button,
  Chip,
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from '@material-ui/core';
import {

  TrendingUp,
  AttachMoney,
  EmojiObjects,
  ThumbUp,
  Close,
  ExpandMore,

 
  Star,
  WhatsApp,
  Assessment
} from '@material-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  iaContainer: {
    position: 'fixed',
    bottom: 100,
    right: 24,
    width: 400,
    maxHeight: 600,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 20,
    color: '#fff',
    zIndex: 1000,
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  },
  iaHeader: {
    padding: theme.spacing(2),
    background: 'rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iaAvatar: {
    background: 'linear-gradient(45deg, #ff6b6b, #ffa726)',
    width: 50,
    height: 50,
    fontSize: '1.5rem',
  },
  iaContent: {
    padding: theme.spacing(2),
    maxHeight: 400,
    overflowY: 'auto',
  },
  dicaCard: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  botaoVender: {
    background: 'linear-gradient(45deg, #4caf50, #81c784)',
    color: '#fff',
    borderRadius: 20,
    margin: theme.spacing(1),
    '&:hover': {
      background: 'linear-gradient(45deg, #388e3c, #66bb6a)',
      transform: 'scale(1.05)',
    },
  },
  fab: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    color: '#fff',
    '&:hover': {
      background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
      transform: 'scale(1.1)',
    },
  },
  fabPulsing: {
    animation: '$pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(102, 126, 234, 0.7)',
    },
    '70%': {
      transform: 'scale(1.05)',
      boxShadow: '0 0 0 10px rgba(102, 126, 234, 0)',
    },
    '100%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(102, 126, 234, 0)',
    },
  },
  progressoVendas: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    height: 8,
  },
  metaContainer: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    textAlign: 'center',
  },
}));

interface DicaVenda {
  id: number;
  tipo: 'urgente' | 'dica' | 'meta' | 'cliente';
  titulo: string;
  mensagem: string;
  acao?: string;
  humor: string;
  prioridade: 'alta' | 'media' | 'baixa';
  vendasPotenciais?: number;
}

const IAColaborador: React.FC = () => {
  const classes = useStyles();
  const [aberto, setAberto] = useState(false);
  const [dicasAtivas, setDicasAtivas] = useState<DicaVenda[]>([]);
  const [metaVendas] = useState({
    atual: 47,
    meta: 100,
    valor: 23500,
    valorMeta: 50000,
  });

  const dicasVendas: DicaVenda[] = [
    {
      id: 1,
      tipo: 'urgente',
      titulo: '🔥 Cliente Esquentando!',
      mensagem: 'O José da Silva tá há 3 dias sem resposta no WhatsApp. Cara, ele já perguntou preço 2 vezes - isso é praticamente um "EU QUERO COMPRAR" gritando!',
      acao: 'Manda uma mensagem agora',
      humor: 'Sério, tá esperando ele desenhar? 😅',
      prioridade: 'alta',
      vendasPotenciais: 1200,
    },
    {
      id: 2,
      tipo: 'dica',
      titulo: '💡 Dica Esperta do Dia',
      mensagem: 'Quando o cliente pergunta "quanto custa", não mande só o preço. Explica o benefício, né! Tipo: "R$ 150 e seu carro fica legal em 2 dias".',
      humor: 'É venda básica, meu rei! 🤴',
      prioridade: 'media',
    },
    {
      id: 3,
      tipo: 'cliente',
      titulo: '📞 Cliente VIP Ligou',
      mensagem: 'A Maria Transportes ligou de novo. Ela já gastou R$ 15.000 esse ano com a gente. Se ela tá ligando, é porque quer gastar mais!',
      acao: 'Liga de volta AGORA',
      humor: 'É dinheiro andando, parceiro! 💰',
      prioridade: 'alta',
      vendasPotenciais: 3500,
    },
    {
      id: 4,
      tipo: 'meta',
      titulo: '🎯 Falta Pouco pra Meta!',
      mensagem: 'Você tá com 47% da meta. Mais 3 vendas médias e você bate! Lembra: quem bate meta ganha comissão extra 😉',
      humor: 'Vamos que vamos, tigão! 🐅',
      prioridade: 'media',
      vendasPotenciais: 2800,
    },
    {
      id: 5,
      tipo: 'dica',
      titulo: '🕐 Horário Nobre',
      mensagem: 'Agora é 14h - horário perfeito pra ligar! Pessoal já almoçou, tá tranquilo, sem pressa. Aproveita!',
      humor: 'Timing é tudo na vida! ⏰',
      prioridade: 'baixa',
    },
  ];

  const frasesMotivacionais = [
    'Bora fazer essa grana! 💪',
    'Hoje tá com cara de dia de vendas! 🚀',
    'Cliente satisfeito = carteira feliz! 😄',
    'Venda com amor, receba com alegria! ❤️',
    'Você é o rei das vendas! 👑',
  ];

  useEffect(() => {
    // Simular análise em tempo real
    const interval = setInterval(() => {
      const dicasAleatorias = dicasVendas
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setDicasAtivas(dicasAleatorias);
    }, 10000);

    // Carregar dicas iniciais
    setDicasAtivas(dicasVendas.slice(0, 3));

    return () => clearInterval(interval);
  }, []);

  const getCorPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return '#ff4444';
      case 'media': return '#ffa726';
      case 'baixa': return '#66bb6a';
      default: return '#757575';
    }
  };

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'urgente': return <ExpandMore />;
      case 'dica': return <EmojiObjects />;
      case 'meta': return <Star />;
      case 'cliente': return <WhatsApp />;
      default: return <ExpandMore />;
    }
  };

  const handleAcaoRapida = (acao: string) => {
    // Aqui você pode integrar com as ações reais do sistema
    alert(`Executando: ${acao}`);
  };

  return (
    <>
      {/* FAB Principal */}
      <Fab
        className={`${classes.fab} ${dicasAtivas.some(d => d.prioridade === 'alta') ? classes.fabPulsing : ''}`}
        onClick={() => setAberto(true)}
      >
        <ExpandMore />
      </Fab>

      {/* Container da IA */}
      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ duration: 0.3 }}
            className={classes.iaContainer}
          >
            {/* Header */}
            <Box className={classes.iaHeader}>
              <Box display="flex" alignItems="center" style={{ gap: 12 }}>
                <Avatar className={classes.iaAvatar}>
                  🤖
                </Avatar>
                <Box>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    Venda Mais IA
                  </Typography>
                  <Typography variant="caption" style={{ opacity: 0.8 }}>
                    {frasesMotivacionais[Math.floor(Math.random() * frasesMotivacionais.length)]}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setAberto(false)} style={{ color: '#fff' }}>
                <Close />
              </IconButton>
            </Box>

            {/* Conteúdo */}
            <Box className={classes.iaContent}>
              {/* Progresso da Meta */}
              <Box className={classes.metaContainer}>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginBottom: 8 }}>
                  🎯 Sua Meta Hoje
                </Typography>
                <Box display="flex" justifyContent="space-between" marginBottom={1}>
                  <Typography variant="body2">R$ {metaVendas.valor.toLocaleString()}</Typography>
                  <Typography variant="body2">R$ {metaVendas.valorMeta.toLocaleString()}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(metaVendas.valor / metaVendas.valorMeta) * 100}
                  className={classes.progressoVendas}
                />
                <Typography variant="caption" style={{ marginTop: 8, display: 'block' }}>
                  Faltam só R$ {(metaVendas.valorMeta - metaVendas.valor).toLocaleString()} pra bater a meta! 🚀
                </Typography>
              </Box>

              {/* Dicas Ativas */}
              <Typography variant="h6" style={{ margin: '16px 0 8px', fontWeight: 'bold' }}>
                📈 Oportunidades Quentes
              </Typography>

              {dicasAtivas.map((dica, index) => (
                <motion.div
                  key={dica.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={classes.dicaCard}>
                    <CardContent style={{ padding: '12px' }}>
                      <Box display="flex" alignItems="center" marginBottom={1}>
                        {getIconeTipo(dica.tipo)}
                        <Typography variant="subtitle2" style={{ marginLeft: 8, fontWeight: 'bold' }}>
                          {dica.titulo}
                        </Typography>
                        <Chip
                          label={dica.prioridade}
                          size="small"
                          style={{
                            marginLeft: 'auto',
                            backgroundColor: getCorPrioridade(dica.prioridade),
                            color: '#fff',
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>

                      <Typography variant="body2" style={{ marginBottom: 8, lineHeight: 1.4 }}>
                        {dica.mensagem}
                      </Typography>

                      <Typography variant="caption" style={{ 
                        fontStyle: 'italic', 
                        opacity: 0.8,
                        display: 'block',
                        marginBottom: 8
                      }}>
                        {dica.humor}
                      </Typography>

                      {dica.vendasPotenciais && (
                        <Typography variant="caption" style={{ 
                          color: '#4caf50',
                          fontWeight: 'bold',
                          display: 'block',
                          marginBottom: 8
                        }}>
                          💰 Potencial: R$ {dica.vendasPotenciais.toLocaleString()}
                        </Typography>
                      )}

                      {dica.acao && (
                        <Button
                          size="small"
                          className={classes.botaoVender}
                          startIcon={<ThumbUp />}
                          onClick={() => handleAcaoRapida(dica.acao as string)}
                          fullWidth
                        >
                          {dica.acao}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Dicas Rápidas */}
              <Accordion style={{ background: 'rgba(255,255,255,0.1)', marginTop: 16 }}>
                <AccordionSummary expandIcon={<ExpandMore style={{ color: '#fff' }} />}>
                  <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                    💡 Dicas Rápidas pra Vender Mais
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <WhatsApp style={{ color: '#25d366' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Responde rápido no WhatsApp"
                        secondary="Cliente que espera é cliente que vai embora!"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AttachMoney style={{ color: '#ffa726' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Sempre oferece algo a mais"
                        secondary="Quer só transferência? Oferece CNH também!"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUp style={{ color: '#4caf50' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Fala dos benefícios, não só do preço"
                        secondary="Ex: 'Resolve tudo em 2 dias' é melhor que 'R$ 150'"
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IAColaborador;

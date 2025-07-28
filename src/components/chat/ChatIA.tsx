
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  useMediaQuery, 
  useTheme,
  Avatar,
  Divider,
  Chip,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  Fade,
  Zoom
} from '@material-ui/core';
import { 
  EmojiObjects, 
  Send, 
  Android,
  Person,
  Close,
  Minimize,
  Fullscreen,
  FullscreenExit,
  TrendingUp,
  AttachMoney
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '60vh',
    padding: theme.spacing(1),
    background: 'linear-gradient(135deg, #1a4d3a 0%, #2d5a3d 100%)',
    [theme.breakpoints.up('md')]: {
      minHeight: '70vh',
      padding: theme.spacing(3),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.5),
      minHeight: 'calc(100vh - 64px)',
    },
  },
  chatContainer: {
    width: '100%',
    height: '75vh',
    maxHeight: '800px',
    display: 'flex',
    flexDirection: 'column',
    background: '#FFFFFF',
    borderRadius: theme.spacing(2),
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07)',
    overflow: 'hidden',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    margin: '0 auto',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '600px',
      borderRadius: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '800px',
      height: '80vh',
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: '1000px',
      height: '85vh',
    },
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 80px)',
      borderRadius: theme.spacing(1),
      margin: 0,
    },
  },
  header: {
    padding: theme.spacing(2),
    background: 'linear-gradient(135deg, #1A3C34 0%, #2E5A50 100%)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '3px solid #D4A017',
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.5),
    },
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      gap: theme.spacing(1),
    },
  },
  headerIcon: {
    fontSize: 40,
    color: '#D4A017',
    [theme.breakpoints.up('md')]: {
      fontSize: 48,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 32,
    },
  },
  headerContent: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: '1.4rem',
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.6rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.8rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2rem',
      marginBottom: theme.spacing(0.25),
    },
  },
  headerSubtitle: {
    opacity: 0.9,
    fontSize: '0.9rem',
    fontWeight: 300,
    [theme.breakpoints.up('sm')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
      display: 'none',
    },
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      gap: theme.spacing(0.5),
    },
  },
  controlButton: {
    color: '#FFFFFF',
    padding: theme.spacing(0.5),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.25),
      '& .MuiSvgIcon-root': {
        fontSize: '1.2rem',
      },
    },
  },
  statusChip: {
    background: '#4CAF50',
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 'auto',
    padding: theme.spacing(0.5, 1),
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.7rem',
      padding: theme.spacing(0.25, 0.75),
    },
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(1),
    background: 'linear-gradient(to bottom, #fafafa 0%, #f5f5f5 100%)',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
      width: '6px',
      [theme.breakpoints.up('md')]: {
        width: '8px',
      },
    },
    '&::-webkit-scrollbar-track': {
      background: '#F0F0F0',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#D4A017',
      borderRadius: '4px',
      '&:hover': {
        background: '#B8900F',
      },
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2),
      gap: theme.spacing(1.5),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.75),
      gap: theme.spacing(0.75),
    },
  },
  messageContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    maxWidth: '100%',
    '&.user': {
      flexDirection: 'row-reverse',
    },
    [theme.breakpoints.up('sm')]: {
      gap: theme.spacing(1.5),
      marginBottom: theme.spacing(1.5),
    },
    [theme.breakpoints.down('xs')]: {
      gap: theme.spacing(0.75),
      marginBottom: theme.spacing(0.75),
    },
  },
  messageAvatar: {
    width: 36,
    height: 36,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      width: 40,
      height: 40,
    },
    [theme.breakpoints.up('md')]: {
      width: 44,
      height: 44,
    },
    [theme.breakpoints.down('xs')]: {
      width: 32,
      height: 32,
    },
  },
  userAvatar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#FFFFFF',
  },
  aiAvatar: {
    background: 'linear-gradient(135deg, #1A3C34 0%, #2E5A50 100%)',
    color: '#D4A017',
  },
  messageContent: {
    flex: 1,
    maxWidth: 'calc(100% - 50px)',
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      maxWidth: '75%',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '70%',
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: 'calc(100% - 40px)',
    },
  },
  messageBubble: {
    padding: theme.spacing(1.5, 2),
    borderRadius: '20px',
    wordBreak: 'break-word',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    lineHeight: 1.4,
    fontSize: '0.95rem',
    '&.user': {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#FFFFFF',
      borderBottomRightRadius: '8px',
      marginLeft: 'auto',
    },
    '&.ai': {
      background: '#FFFFFF',
      color: '#1A3C34',
      borderBottomLeftRadius: '8px',
      border: '1px solid #E0E0E0',
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2, 2.5),
      borderRadius: '22px',
      fontSize: '1rem',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1, 1.5),
      borderRadius: '16px',
      fontSize: '0.9rem',
    },
  },
  messageText: {
    margin: 0,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    '& strong': {
      fontWeight: 600,
      color: 'inherit',
    },
  },
  messageTime: {
    fontSize: '0.7rem',
    opacity: 0.7,
    marginTop: theme.spacing(0.5),
    textAlign: 'right',
    fontWeight: 400,
    '&.user': {
      color: 'rgba(255, 255, 255, 0.8)',
    },
    '&.ai': {
      color: 'rgba(26, 60, 52, 0.6)',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '0.75rem',
    },
  },
  senderName: {
    fontSize: '0.75rem',
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
    opacity: 0.8,
    '&.user': {
      color: '#667eea',
      textAlign: 'right',
    },
    '&.ai': {
      color: '#1A3C34',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '0.8rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.7rem',
      marginBottom: theme.spacing(0.25),
    },
  },
  inputArea: {
    padding: theme.spacing(1.5),
    background: '#FFFFFF',
    borderTop: '1px solid #E0E0E0',
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'flex-end',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2),
      gap: theme.spacing(1.5),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    },
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      background: '#F8F9FA',
      borderRadius: '25px',
      fontSize: '0.95rem',
      '& fieldset': {
        borderColor: '#E0E0E0',
      },
      '&:hover fieldset': {
        borderColor: '#D4A017',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#D4A017',
        borderWidth: '2px',
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '12px 20px',
      [theme.breakpoints.up('sm')]: {
        padding: '14px 22px',
        fontSize: '1rem',
      },
      [theme.breakpoints.down('xs')]: {
        padding: '10px 16px',
        fontSize: '0.9rem',
      },
    },
    '& .MuiOutlinedInput-multiline': {
      padding: 0,
    },
  },
  sendButton: {
    background: 'linear-gradient(135deg, #D4A017 0%, #E8B923 100%)',
    color: '#1A3C34',
    borderRadius: '50%',
    minWidth: '48px',
    height: '48px',
    padding: 0,
    boxShadow: '0 4px 12px rgba(212, 160, 23, 0.3)',
    flexShrink: 0,
    '&:hover': {
      background: 'linear-gradient(135deg, #E8B923 0%, #D4A017 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 16px rgba(212, 160, 23, 0.4)',
    },
    '&:disabled': {
      background: '#CCCCCC',
      color: '#888888',
      boxShadow: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: '52px',
      height: '52px',
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: '44px',
      height: '44px',
    },
  },
  serviceButtonContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1.5),
    [theme.breakpoints.down('xs')]: {
      gap: theme.spacing(0.75),
      marginTop: theme.spacing(1),
    },
  },
  serviceButton: {
    background: 'linear-gradient(135deg, #D4A017 0%, #E8B923 100%)',
    color: '#1A3C34',
    borderRadius: '20px',
    padding: theme.spacing(1, 2),
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '0.9rem',
    boxShadow: '0 2px 8px rgba(212, 160, 23, 0.2)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #E8B923 0%, #D4A017 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(212, 160, 23, 0.3)',
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1.2, 2.5),
      fontSize: '0.95rem',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.8, 1.5),
      fontSize: '0.85rem',
      borderRadius: '16px',
    },
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.up('sm')]: {
      gap: theme.spacing(1.5),
    },
    [theme.breakpoints.down('xs')]: {
      gap: theme.spacing(0.75),
      marginBottom: theme.spacing(1),
    },
  },
  loadingBubble: {
    background: '#FFFFFF',
    color: '#1A3C34',
    padding: theme.spacing(1.5, 2),
    borderRadius: '20px 20px 20px 8px',
    border: '1px solid #E0E0E0',
    fontStyle: 'italic',
    opacity: 0.9,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2, 2.5),
      borderRadius: '22px 22px 22px 8px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1, 1.5),
      borderRadius: '16px 16px 16px 6px',
    },
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    '& span': {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: '#D4A017',
      animation: '$typing 1.4s infinite ease-in-out',
    },
    '& span:nth-child(1)': {
      animationDelay: '0s',
    },
    '& span:nth-child(2)': {
      animationDelay: '0.2s',
    },
    '& span:nth-child(3)': {
      animationDelay: '0.4s',
    },
    [theme.breakpoints.up('sm')]: {
      '& span': {
        width: '8px',
        height: '8px',
      },
    },
  },
  '@keyframes typing': {
    '0%, 80%, 100%': {
      transform: 'scale(0)',
      opacity: 0.5,
    },
    '40%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
  fadeIn: {
    animation: '$fadeIn 0.3s ease-in',
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  buttons?: { label: string; value: string }[];
}

const ChatIA: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isXsScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🔥 E aí, vendedor! Sou a IA mais sarcástica que você vai conhecer! 😏\n\nCansado de perder vendas? Relaxa, chegou a solução! Vou te ensinar a vender mais que água no deserto. Que tal começar oferecendo alguns dos nossos serviços TOP?\n\n💰 **Tá na hora de fazer DINHEIRO!**\n\nQual cliente você quer conquistar hoje? Ou vai ficar aí parado esperando milagre? 🚀',
      sender: 'ai',
      timestamp: new Date(),
      buttons: [
        { label: '🚗 Transferência', value: 'TRANSFERÊNCIA DE PROPRIEDADE' },
        { label: '📝 Primeira Habilitação', value: 'PRIMEIRA HABILITAÇÃO' },
        { label: '🔄 Renovação CNH', value: 'RENOVAÇÃO CNH' },
        { label: '📄 Licenciamento', value: 'LICENCIAMENTO ANUAL' },
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', vehicleType: '', urgency: '' });
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [step, setStep] = useState<'initial' | 'collecting_info' | 'documents' | 'payment'>('initial');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (inputMessage: string, isButtonClick = false, buttonValue?: string) => {
    if (!inputMessage.trim() && !isButtonClick) return;
    if (isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/aichatcolaborador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: isButtonClick && buttonValue ? buttonValue : inputMessage,
          context: 'Colaborador interno - Foco em vendas e conversão',
          previousMessages: messages.slice(-5),
          userInfo,
          selectedService: isButtonClick && buttonValue ? buttonValue : selectedService,
          step,
        }),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'ai',
          timestamp: new Date(),
          buttons: data.buttons,
        };
        setMessages((prev) => [...prev, aiResponse]);
        
        if (data.nextAction) {
          setStep(data.nextAction);
        }
        if (isButtonClick && buttonValue) {
          setSelectedService(buttonValue);
        }
      } else {
        throw new Error('Erro na resposta da API');
      }
    } catch (error) {
      console.error('Erro ao chamar API:', error);
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '🤖 Opa, deu um bug aqui! Mas relaxa, até os melhores têm seus momentos... \n\nEnquanto isso, que tal usar essa deixa para ligar pro cliente? "Oi, tive um probleminha técnico aqui mas já resolvi, aproveita que tô ligando para te oferecer nossa promoção especial!" \n\n😏 Transformou problema em oportunidade! ISSO é ser vendedor! 💪',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = (label: string, value: string) => {
    handleSendMessage(label, true, value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(message);
    }
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Fade in timeout={500}>
        <Paper className={classes.chatContainer} elevation={3}>
          <div className={classes.header}>
            <div className={classes.headerLeft}>
              <TrendingUp className={classes.headerIcon} />
              <div className={classes.headerContent}>
                <Typography variant="h4" className={classes.headerTitle}>
                  🔥 IA Vendas Master
                </Typography>
                <Typography variant="body1" className={classes.headerSubtitle}>
                  A IA que vai te fazer vender mais!
                </Typography>
              </div>
            </div>
            <div className={classes.headerControls}>
              <Chip 
                icon={<AttachMoney />}
                label="💰 Vendendo" 
                className={classes.statusChip}
                size="small"
              />
              {!isXsScreen && (
                <>
                  <IconButton 
                    className={classes.controlButton}
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    <Minimize />
                  </IconButton>
                  <IconButton 
                    className={classes.controlButton}
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </>
              )}
            </div>
          </div>

          <div className={classes.messageList}>
            {messages.map((msg, index) => (
              <Zoom in timeout={300} style={{ transitionDelay: `${index * 50}ms` }} key={msg.id}>
                <div className={`${classes.messageContainer} ${msg.sender} ${classes.fadeIn}`}>
                  <Avatar 
                    className={`${classes.messageAvatar} ${msg.sender === 'user' ? classes.userAvatar : classes.aiAvatar}`}
                  >
                    {msg.sender === 'user' ? <Person /> : <TrendingUp />}
                  </Avatar>

                  <div className={classes.messageContent}>
                    <Typography variant="caption" className={`${classes.senderName} ${msg.sender}`}>
                      {msg.sender === 'user' ? 'Você' : '🔥 IA Vendas'}
                    </Typography>

                    <div className={`${classes.messageBubble} ${msg.sender}`}>
                      <Typography variant="body1" className={classes.messageText}>
                        {msg.text}
                      </Typography>
                      {msg.buttons && (
                        <div className={classes.serviceButtonContainer}>
                          {msg.buttons.map((button) => (
                            <Button
                              key={button.value}
                              className={classes.serviceButton}
                              onClick={() => handleButtonClick(button.label, button.value)}
                              size={isMobile ? "small" : "medium"}
                            >
                              {button.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>

                    <Typography variant="caption" className={`${classes.messageTime} ${msg.sender}`}>
                      {formatTime(msg.timestamp)}
                    </Typography>
                  </div>
                </div>
              </Zoom>
            ))}

            {isLoading && (
              <Fade in timeout={200}>
                <div className={classes.loadingContainer}>
                  <Avatar className={`${classes.messageAvatar} ${classes.aiAvatar}`}>
                    <TrendingUp />
                  </Avatar>

                  <div className={classes.messageContent}>
                    <Typography variant="caption" className={`${classes.senderName} ai`}>
                      🔥 IA Vendas
                    </Typography>

                    <div className={classes.loadingBubble}>
                      <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                        <span>Preparando uma estratégia infalível...</span>
                        <div className={classes.typingIndicator}>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </Box>
                    </div>
                  </div>
                </div>
              </Fade>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className={classes.inputArea}>
            <TextField
              fullWidth
              placeholder="Conta aí, que situação de venda você tá enfrentando..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              variant="outlined"
              className={classes.textField}
              disabled={isLoading}
              multiline={!isMobile}
              maxRows={isMobile ? 2 : 4}
              minRows={1}
            />
            <Button
              className={classes.sendButton}
              onClick={() => handleSendMessage(message)}
              disabled={!message.trim() || isLoading}
            >
              <Send />
            </Button>
          </div>
        </Paper>
      </Fade>
    </Container>
  );
};

export default ChatIA;

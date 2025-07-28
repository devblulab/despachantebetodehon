
import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Badge,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Divider,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Tooltip,
  Fab,
  Container,
  useMediaQuery,
  LinearProgress,
  CircularProgress,
  Box,
  TextField,
  Button,
  AppBar,
  Toolbar,
  useTheme
} from '@material-ui/core';
import {
  WhatsApp,
  Phone,
  Message,
  Settings,
  People,
  Search,
  Send,
  VideoCall,
  MoreVert,
  Memory,
  Star,
  CheckCircle
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
    overflow: 'hidden'
  },
  header: {
    backgroundColor: '#128c7e',
    color: 'white',
    minHeight: 64,
    zIndex: theme.zIndex.appBar
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden'
  },
  sidebar: {
    width: 320,
    backgroundColor: '#ffffff',
    borderRight: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      position: 'absolute',
      height: '100%',
      zIndex: theme.zIndex.modal,
      transform: 'translateX(-100%)',
      transition: 'transform 0.3s ease'
    }
  },
  sidebarOpen: {
    [theme.breakpoints.down('md')]: {
      transform: 'translateX(0)'
    }
  },
  tabs: {
    backgroundColor: '#f5f5f5',
    minHeight: 48,
    '& .MuiTab-root': {
      minHeight: 48,
      fontSize: '0.875rem',
      fontWeight: 500
    }
  },
  tabPanel: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(1)
  },
  contactList: {
    padding: 0
  },
  contactItem: {
    padding: theme.spacing(1.5),
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#f5f5f5'
    },
    '&.selected': {
      backgroundColor: '#e3f2fd'
    }
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  chatHeader: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: '#ffffff'
  },
  messageArea: {
    flex: 1,
    padding: theme.spacing(2),
    overflow: 'auto',
    backgroundColor: '#f8f9fa'
  },
  inputArea: {
    padding: theme.spacing(2),
    backgroundColor: '#ffffff',
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  },
  metricCard: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: theme.spacing(1),
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#4caf50',
    display: 'inline-block',
    marginRight: theme.spacing(1)
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      bottom: theme.spacing(1),
      right: theme.spacing(1)
    }
  },
  searchBox: {
    padding: theme.spacing(1.5),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: theme.palette.text.secondary,
    padding: theme.spacing(4)
  }
}));

interface Contact {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
  isOnline?: boolean;
  leadScore?: number;
}

export default function WhatsAppDigisac() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [digisacLoading, setDigisacLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Mock data otimizado
  const mockContacts: Contact[] = [
    {
      id: '1',
      name: 'João Silva',
      phone: '+55 11 99999-9999',
      lastMessage: 'Preciso de ajuda com transferência',
      timestamp: '10:30',
      unreadCount: 2,
      isOnline: true,
      leadScore: 85
    },
    {
      id: '2',
      name: 'Maria Santos',
      phone: '+55 11 88888-8888',
      lastMessage: 'Quando fica pronto o documento?',
      timestamp: '09:15',
      unreadCount: 1,
      isOnline: false,
      leadScore: 92
    },
    {
      id: '3',
      name: 'Pedro Costa',
      phone: '+55 11 77777-7777',
      lastMessage: 'Obrigado pelo atendimento!',
      timestamp: '08:45',
      unreadCount: 0,
      isOnline: true,
      leadScore: 78
    }
  ];

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const loadContacts = useCallback(async () => {
    setDigisacLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContacts(mockContacts);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
      setContacts(mockContacts);
    } finally {
      setDigisacLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async () => {
    if (!message.trim() || !selectedContact) return;

    setIsLoading(true);
    try {
      console.log('Enviando mensagem via Digisac:', message);
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsLoading(false);
    }
  }, [message, selectedContact]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const renderContactList = () => (
    <div className={classes.contactList}>
      <div className={classes.searchBox}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar contatos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search color="action" style={{ marginRight: 8 }} />
          }}
        />
      </div>
      
      {digisacLoading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress size={24} />
          <Typography variant="body2" style={{ marginLeft: 12 }}>
            Carregando contatos...
          </Typography>
        </Box>
      ) : (
        <List>
          {filteredContacts.map((contact) => (
            <ListItem
              key={contact.id}
              className={`${classes.contactItem} ${selectedContact?.id === contact.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedContact(contact);
                if (isMobile) setSidebarOpen(false);
              }}
            >
              <ListItemAvatar>
                <Badge
                  variant="dot"
                  color={contact.isOnline ? "primary" : "default"}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  <Avatar>{contact.name.charAt(0)}</Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" noWrap>
                      {contact.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {contact.timestamp}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {contact.lastMessage}
                    </Typography>
                    {contact.leadScore && (
                      <Chip
                        size="small"
                        label={`Score: ${contact.leadScore}%`}
                        color={contact.leadScore > 80 ? "primary" : "default"}
                        style={{ marginTop: 4, fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                }
              />
              {contact.unreadCount > 0 && (
                <Badge badgeContent={contact.unreadCount} color="primary" />
              )}
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );

  const renderMetrics = () => (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card className={classes.metricCard}>
            <Typography variant="h4" color="primary">
              {contacts.length}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Contatos Ativos
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className={classes.metricCard}>
            <Typography variant="h4" style={{ color: '#4caf50' }}>
              87%
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Taxa de Resposta
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="IA Ativa"
            style={{ marginTop: 16 }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.header}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              edge="start"
            >
              <Message />
            </IconButton>
          )}
          <WhatsApp style={{ marginRight: 8 }} />
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            WhatsApp Business
          </Typography>
          <IconButton color="inherit">
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>

      <div className={classes.mainContent}>
        <Paper className={`${classes.sidebar} ${sidebarOpen ? classes.sidebarOpen : ''}`}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            className={classes.tabs}
          >
            <Tab label="Contatos" icon={<People />} />
            <Tab label="Métricas" icon={<Memory />} />
          </Tabs>

          <div className={classes.tabPanel}>
            {tabValue === 0 && renderContactList()}
            {tabValue === 1 && renderMetrics()}
          </div>
        </Paper>

        <div className={classes.chatArea}>
          {selectedContact ? (
            <>
              <Paper className={classes.chatHeader}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar style={{ marginRight: 12 }}>
                      {selectedContact.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedContact.name}</Typography>
                      <Box display="flex" alignItems="center">
                        <div className={classes.statusIndicator} />
                        <Typography variant="caption" color="textSecondary">
                          {selectedContact.isOnline ? 'Online' : 'Offline'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small">
                      <VideoCall />
                    </IconButton>
                    <IconButton size="small">
                      <Phone />
                    </IconButton>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>

              <div className={classes.messageArea}>
                <Box textAlign="center" py={4}>
                  <Typography variant="body2" color="textSecondary">
                    Conversa com {selectedContact.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    {selectedContact.phone}
                  </Typography>
                </Box>
              </div>

              <div className={classes.inputArea}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Digite sua mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={sendMessage}
                  disabled={isLoading || !message.trim()}
                  startIcon={isLoading ? <CircularProgress size={16} /> : <Send />}
                >
                  {!isMobile && 'Enviar'}
                </Button>
              </div>
            </>
          ) : (
            <div className={classes.emptyState}>
              <WhatsApp style={{ fontSize: 64, marginBottom: 16, opacity: 0.3 }} />
              <Typography variant="h6" gutterBottom>
                WhatsApp Business
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Selecione um contato para iniciar a conversa
              </Typography>
            </div>
          )}
        </div>
      </div>

      <Fab
        className={classes.fab}
        color="primary"
        size={isMobile ? "medium" : "large"}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Star />
      </Fab>
    </div>
  );
}

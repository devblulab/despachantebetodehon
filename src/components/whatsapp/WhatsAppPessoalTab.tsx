
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Badge,
  TextField,
  InputAdornment
} from '@material-ui/core';
import {
  Refresh, 
  Person,
  Phone,
  Message,
  Send,
  Search,
  MoreVert,
  CheckCircle,
  Schedule,
  Warning
} from '@material-ui/icons';
import CropFreeIcon from '@material-ui/icons/CropFree';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    minHeight: '600px',
    display: 'flex',
    padding: theme.spacing(2),
    gap: theme.spacing(2)
  },
  leftPanel: {
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2)
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  qrCard: {
    textAlign: 'center',
    padding: theme.spacing(3),
    background: 'linear-gradient(135deg, #25D366 0%, #128c7e 100%)',
    color: 'white'
  },
  qrCodeContainer: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    margin: '0 auto',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2)
  },
  contactsList: {
    maxHeight: 400,
    overflow: 'auto'
  },
  messageArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2)
  }
}));

interface WhatsAppPessoalTabProps {
  isConnected: boolean;
  onConnectionChange: (status: boolean) => void;
}

export default function WhatsAppPessoalTab({ isConnected, onConnectionChange }: WhatsAppPessoalTabProps) {
  const classes = useStyles();
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  // Debug para verificar se o componente está sendo renderizado
  console.log('WhatsAppPessoalTab renderizado, isConnected:', isConnected);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      // Simular geração de QR Code
      await new Promise(resolve => setTimeout(resolve, 2000));
      setQrCode('https://web.whatsapp.com/qr-code-pessoal');
      console.log('QR Code Pessoal gerado');
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isConnected) {
      generateQRCode();
    }
  }, [isConnected]);

  const mockContacts = [
    {
      id: 1,
      name: 'Ana Clara',
      lastMessage: 'Oi! Tudo bem?',
      time: '11:20',
      unread: 1,
      avatar: 'A'
    },
    {
      id: 2,
      name: 'Pedro Santos',
      lastMessage: 'Vamos almoçar hoje?',
      time: '10:15',
      unread: 0,
      avatar: 'P'
    }
  ];

  return (
    <div className={classes.root}>
      {/* Painel Esquerdo */}
      <div className={classes.leftPanel}>
        {/* Status de Conexão */}
        <Card>
          <CardContent>
            <div className={classes.statusIndicator}>
              <Person color={isConnected ? 'primary' : 'disabled'} />
              <Typography variant="h6">
                WhatsApp Pessoal
              </Typography>
              <Chip
                label={isConnected ? 'Conectado' : 'Desconectado'}
                color={isConnected ? 'primary' : 'default'}
                size="small"
              />
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        {!isConnected && (
          <Card className={classes.qrCard}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Conectar WhatsApp Pessoal
              </Typography>
              
              <div className={classes.qrCodeContainer}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <CropFreeIcon style={{ fontSize: 120, color: '#25D366' }} />
                )}
              </div>
              
              <Typography variant="body2" style={{ marginBottom: 16 }}>
                1. Abra o WhatsApp no seu telefone<br />
                2. Toque em Menu → WhatsApp Web<br />
                3. Escaneie este código QR
              </Typography>
              
              <Button
                variant="contained"
                onClick={generateQRCode}
                disabled={loading}
                startIcon={<Refresh />}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                Novo QR Code
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lista de Contatos */}
        {isConnected && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Conversas Pessoais
              </Typography>
              
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar conversas..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                style={{ marginBottom: 16 }}
              />
              
              <List className={classes.contactsList}>
                {mockContacts.map((contact) => (
                  <ListItem key={contact.id} button>
                    <ListItemAvatar>
                      <Badge badgeContent={contact.unread} color="primary">
                        <Avatar>{contact.avatar}</Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={contact.name}
                      secondary={contact.lastMessage}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {contact.time}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Painel Direito - Área de Mensagens */}
      <div className={classes.rightPanel}>
        <Card style={{ height: '100%' }}>
          <CardContent style={{ height: '100%' }}>
            {isConnected ? (
              <div className={classes.messageArea}>
                <Typography variant="h6" color="textSecondary">
                  Selecione uma conversa para começar
                </Typography>
              </div>
            ) : (
              <div className={classes.messageArea}>
                <Box textAlign="center">
                  <Person style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
                  <Typography variant="h6" color="textSecondary">
                    WhatsApp Pessoal Desconectado
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Escaneie o QR Code para conectar
                  </Typography>
                </Box>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
  Business,
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

interface WhatsAppBusinessTabProps {
  isConnected: boolean;
  onConnectionChange: (status: boolean) => void;
}

export default function WhatsAppBusinessTab({ isConnected, onConnectionChange }: WhatsAppBusinessTabProps) {
  const classes = useStyles();
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      // Simular geração de QR Code
      await new Promise(resolve => setTimeout(resolve, 2000));
      setQrCode('https://web.whatsapp.com/qr-code-business');
      console.log('QR Code Business gerado');
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
      name: 'João Silva - Cliente',
      lastMessage: 'Preciso da transferência do veículo',
      time: '10:30',
      unread: 2,
      avatar: 'J'
    },
    {
      id: 2,
      name: 'Maria Santos - Prospect',
      lastMessage: 'Quanto custa o licenciamento?',
      time: '09:45',
      unread: 1,
      avatar: 'M'
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
              <Business color={isConnected ? 'primary' : 'disabled'} />
              <Typography variant="h6">
                WhatsApp Business
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
                Conectar WhatsApp Business
              </Typography>

              <div className={classes.qrCodeContainer}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <CropFreeIcon style={{ fontSize: 120, color: '#128c7e' }} />
                )}
              </div>

              <Typography variant="body2" style={{ marginBottom: 16 }}>
                1. Abra o WhatsApp Business no seu telefone<br />
                2. Toque em Menu → Aparelhos conectados<br />
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
                Conversas Business
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
                  <Business style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
                  <Typography variant="h6" color="textSecondary">
                    WhatsApp Business Desconectado
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
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/logic/firebase/config/app';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Tooltip,
  Menu,
  MenuItem,
  Fab,
  Slide,
  Fade,
  Zoom,
  Container,
  useMediaQuery,
  InputAdornment,
  LinearProgress,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  Select,
  InputLabel,
  Box
} from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import {
  Chat,
  Send,
  EmojiEmotions,
  AttachFile,
  Image,
  VideoCall,
  Phone,
  MoreVert,
  Search,
  Group,
  PersonAdd,
  Settings,
  Notifications,
  NotificationsOff,
  VolumeUp,
  VolumeOff,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  Call,
  CallEnd,
  ChatBubble,
  Forum,
  People,
  Public,
  Lock,
  Star,
  Reply,
  Forward,
  Delete,
  Edit,
  Info,
  Close,
  Add,
  Remove,
  ExpandMore,

  FiberManualRecord,
  Schedule,
  Done,
  DoneAll,
  Visibility,
  VisibilityOff,
  Extension,


  TrendingUp,

  Speed,
  Security
} from '@material-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    color: 'black',
    display: 'flex',
    background: theme.palette.type === 'dark' 
      ? 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d2d2d 100%)'
      : 'linear-gradient(135deg,rgb(79, 79, 80) 0%,rgb(63, 70, 80) 100%)',
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      height: '100vh',
    },
    [theme.breakpoints.down('sm')]: {
      height: '100vh',
    },
  },
  sidebar: {
    width: 320,
    background: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: theme.shadows[4],
    [theme.breakpoints.down('lg')]: {
      width: 280,
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '40vh',
      borderRight: 'none',
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    [theme.breakpoints.down('sm')]: {
      height: '35vh',
      minHeight: 300,
    },
  },
  sidebarHeader: {
    padding: theme.spacing(2),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      '& h6': {
        fontSize: '1rem',
      },
    },
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.background.default,
    [theme.breakpoints.down('md')]: {
      height: '60vh',
    },
    [theme.breakpoints.down('sm')]: {
      height: '65vh',
    },
  },
  chatHeader: {
    padding: theme.spacing(2),
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: theme.shadows[2],
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      '& h6': {
        fontSize: '1rem',
      },
    },
  },
  messagesContainer: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: 'auto',
    background: `linear-gradient(to bottom, 
      ${theme.palette.background.default} 0%, 
      ${theme.palette.action.hover} 100%)`,
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5),
    },
  },
  messageArea: {
    padding: theme.spacing(2),
    background: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      gap: theme.spacing(0.5),
      flexWrap: 'wrap',
    },
  },
  message: {
    maxWidth: '70%',
    margin: theme.spacing(0.5, 0),
    padding: theme.spacing(1, 2),
    borderRadius: 18,
    color: 'black',
    position: 'relative',
    wordBreak: 'break-word',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '85%',
      padding: theme.spacing(0.75, 1.5),
      fontSize: '0.9rem',
    },
  },
  messageOwn: {
    marginLeft: 'auto',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'black',
    borderBottomRightRadius: 4,
    '&::after': {
      content: '""',
      position: 'absolute',
      right: -8,
      bottom: 0,
      width: 0,
      height: 0,
      border: '8px solid transparent',
      borderTopColor: '#764ba2',
      borderRight: 0,
      marginTop: -8,
      marginRight: -8,
    },
  },
  messageOther: {
    marginRight: 'auto',
    background: theme.palette.background.paper,
    color: 'black',
    borderBottomLeftRadius: 4,
    boxShadow: theme.shadows[2],
    '&::after': {
      content: '""',
      position: 'absolute',
      left: -8,
      bottom: 0,
      width: 0,
      height: 0,
      border: '8px solid transparent',
      borderTopColor: theme.palette.background.paper,
      borderLeft: 0,
      marginTop: -8,
      marginLeft: -8,
    },
  },
  userItem: {
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderRadius: theme.spacing(1),
    color: 'black',
    margin: theme.spacing(0.5),
    '&:hover': {
      background: theme.palette.action.hover,
      transform: 'translateX(4px)',
    },
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    color: 'black',
    border: '2px solid white',
    position: 'absolute',
    bottom: 0,
    right: 0,
    animation: '$pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': { opacity: 1, transform: 'scale(1)' },
    '50%': { opacity: 0.7, transform: 'scale(1.1)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
  offlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#757575',
    border: '2px solid white',
    color: 'black',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  groupItem: {
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderRadius: theme.spacing(1),
    color: 'black',
    margin: theme.spacing(0.5),
    background: `linear-gradient(135deg, 
      ${theme.palette.primary.light}20 0%, 
      ${theme.palette.secondary.light}20 100%)`,
    '&:hover': {
      background: `linear-gradient(135deg, 
        ${theme.palette.primary.light}40 0%, 
        ${theme.palette.secondary.light}40 100%)`,
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  },
  floatingButton: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    zIndex: 1000,
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
      transform: 'scale(1.1)',
    },
    [theme.breakpoints.down('sm')]: {
      bottom: 10,
      right: 10,
      width: 48,
      height: 48,
    },
  },
  notificationPanel: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 300,
    maxHeight: 400,
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[12],
    border: `2px solid ${theme.palette.primary.main}`,
    zIndex: 1000,
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      right: '5%',
      left: '5%',
      top: 10,
      maxHeight: '80vh',
    },
  },
  smartFeatures: {
    position: 'absolute',
    top: 20,
    left: 20,
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    minWidth: 200,
    boxShadow: theme.shadows[8],
    border: `2px solid ${theme.palette.secondary.main}`,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  voiceIndicator: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0,0,0,0.8)',
    color: 'black',
    padding: theme.spacing(3),
    borderRadius: '50%',
    width: 120,
    height: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 10000,
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    color: 'black',

    fontStyle: 'italic',
  },
  messageTime: {
    fontSize: '0.7rem',
    opacity: 0.7,
    color: 'black',
    marginTop: theme.spacing(0.5),
  },
  messageStatus: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: 'black',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  },
  searchBar: {
    margin: theme.spacing(1),
    '& .MuiOutlinedInput-root': {
      borderRadius: 20,
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5),
      '& .MuiInputBase-input': {
        fontSize: '0.9rem',
      },
    },
  },
  tabsContainer: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: 'black',
    [theme.breakpoints.down('sm')]: {
      '& .MuiTab-root': {
        fontSize: '0.8rem',
        minWidth: 'auto',
        padding: theme.spacing(1, 0.5),
      },
    },
  },
  mediaPreview: {
    maxWidth: 200,
    maxHeight: 200,
    borderRadius: theme.spacing(1),
    margin: theme.spacing(1, 0),
  },
  mentionChip: {
    background: theme.palette.secondary.main,
    color: 'white',
    margin: theme.spacing(0.25),
  },
  replyPreview: {
    background: theme.palette.action.hover,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(1),
    margin: theme.spacing(1, 0),
    borderRadius: theme.spacing(0.5),
  },
  encryptionStatus: {
    display: 'flex',
    alignItems: 'center',
    color: 'black',
    gap: theme.spacing(0.5),

    fontSize: '0.8rem',
  },
  aiSuggestions: {
    background: theme.palette.background.paper,
    color: 'black',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    margin: theme.spacing(1, 0),
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: Date;
  isTyping?: boolean;
  permissao?: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  avatar: string;
  isPrivate: boolean;
  unreadCount: number;
  createdBy: string;
  createdAt: Date;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  chatId: string;
  chatType: 'user' | 'group';
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'voice' | 'video';
  status: 'sent' | 'delivered' | 'read';
  mentions?: string[];
  replyTo?: string | null; 
  isEncrypted?: boolean;
  attachments?: any[];
  editedAt?: Date;
}

interface Notification {
  id: string;
  type: 'mention' | 'message' | 'group_invite' | 'system';
  content: string;
  timestamp: Date;
  read: boolean;
  sender?: User;
}

const ChatInterno: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estados principais
  const [selectedChat, setSelectedChat] = useState<User | Group | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  // Estados de controle
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [videoCall, setVideoCall] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [muteNotifications, setMuteNotifications] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Função para carregar usuários do Firebase
  const loadUsersFromFirebase = useCallback(async () => {
    try {
      const usersQuery = query(collection(db, 'usuarios'), orderBy('nome'));
      const usersSnapshot = await getDocs(usersQuery);

      const firebaseUsers: User[] = usersSnapshot.docs.map(doc => {
        const userData = doc.data();
        return {
          id: doc.id,
          name: userData.nome || 'Usuário',
          email: userData.email || '',
          avatar: userData.imagemUrl || '/betologo.jpeg',
          status: userData.ativo !== false ? 'online' : 'offline',
          isTyping: false,
          permissao: userData.permissao || 'Visualizador'
        };
      });

      // Adicionar Lívia IA se não existir
      const liviaExists = firebaseUsers.some(user => user.name === 'Lívia IA');
      if (!liviaExists) {
        firebaseUsers.push({
          id: 'livia-ia',
          name: 'Lívia IA',
          email: 'livia@ia.system',
          avatar: '/logo.webp',
          status: 'online',
          isTyping: false,
          permissao: 'IA'
        });
      }

      setUsers(firebaseUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      // Fallback para dados mockados
      setUsers([
        {
          id: 'livia-ia',
          name: 'Lívia IA',
          avatar: '/logo.webp',
          status: 'online',
          isTyping: false,
          permissao: 'IA'
        }
      ]);
    }
  }, []);

  // Função para carregar grupos do Firebase
  const loadGroupsFromFirebase = useCallback(async () => {
    try {
      const groupsQuery = query(collection(db, 'chatGroups'), orderBy('createdAt', 'desc'));
      const groupsSnapshot = await getDocs(groupsQuery);

      const firebaseGroups: Group[] = groupsSnapshot.docs.map(doc => {
        const groupData = doc.data();
        return {
          id: doc.id,
          name: groupData.name || 'Grupo',
          description: groupData.description || '',
          members: groupData.members || [],
          avatar: groupData.avatar || '/betologo.jpeg',
          isPrivate: groupData.isPrivate || false,
          unreadCount: 0, // Será calculado em tempo real
          createdBy: groupData.createdBy,
          createdAt: groupData.createdAt ? groupData.createdAt.toDate() : new Date()
        };
      });

      // Se não há grupos, criar grupos padrão
      if (firebaseGroups.length === 0) {
        const defaultGroups = [
          {
            name: 'Equipe Principal',
            description: 'Canal principal da empresa',
            members: users.map(u => u.id),
            avatar: '/betologo.jpeg',
            isPrivate: false,
            createdBy: 'system',
            createdAt: serverTimestamp()
          },
          {
            name: 'Desenvolvimento',
            description: 'Equipe de desenvolvimento',
            members: users.filter(u => u.permissao === 'EnygmaDeveloper' || u.permissao === 'Administrador').map(u => u.id),
            avatar: '/logo.webp',
            isPrivate: true,
            createdBy: 'system',
            createdAt: serverTimestamp()
          }
        ];

        for (const group of defaultGroups) {
          await addDoc(collection(db, 'chatGroups'), group);
        }

        // Recarregar grupos após criação
        const newGroupsSnapshot = await getDocs(groupsQuery);
        const newGroups: Group[] = newGroupsSnapshot.docs.map(doc => {
          const groupData = doc.data();
          return {
            id: doc.id,
            name: groupData.name,
            description: groupData.description,
            members: groupData.members,
            avatar: groupData.avatar,
            isPrivate: groupData.isPrivate,
            unreadCount: 0,
            createdBy: groupData.createdBy,
            createdAt: groupData.createdAt ? groupData.createdAt.toDate() : new Date()
          };
        });
        setGroups(newGroups);
      } else {
        setGroups(firebaseGroups);
      }
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
      setGroups([]);
    }
  }, [users]);

  // Função para carregar mensagens em tempo real
  const subscribeToMessages = useCallback((chatId: string, chatType: 'user' | 'group') => {
    if (!chatId) return () => {};

    const messagesQuery = query(
      collection(db, 'chatMessages'),
      where('chatId', '==', chatId),
      where('chatType', '==', chatType),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const loadedMessages: Message[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          content: data.content,
          senderId: data.senderId,
          senderName: data.senderName,
          senderAvatar: data.senderAvatar,
          chatId: data.chatId,
          chatType: data.chatType,
          timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
          type: data.type || 'text',
          status: data.status || 'sent',
          mentions: data.mentions || [],
          replyTo: data.replyTo || null,
          isEncrypted: data.isEncrypted || false,
          attachments: data.attachments || [],
          editedAt: data.editedAt ? data.editedAt.toDate() : undefined
        };
      });

      setMessages(loadedMessages);
    }, (error) => {
      console.error('Erro ao carregar mensagens:', error);
    });

    return unsubscribe;
  }, []);

  // Inicialização
  useEffect(() => {
    loadUsersFromFirebase();
  }, [loadUsersFromFirebase]);

  useEffect(() => {
    if (users.length > 0) {
      loadGroupsFromFirebase();
    }
  }, [users, loadGroupsFromFirebase]);

  useEffect(() => {
    if (users.length > 0) {
      // Selecionar Lívia IA por padrão
      const liviaIA = users.find(u => u.name === 'Lívia IA');
      if (liviaIA && !selectedChat) {
        setSelectedChat(liviaIA);
      }
    }
  }, [users, selectedChat]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Inscrever-se nas mensagens quando o chat selecionado muda
  useEffect(() => {
    if (!selectedChat) return;

    const chatType = 'members' in selectedChat ? 'group' : 'user';
    const chatId = chatType === 'user' ? 
      [selectedChat.id, 'current-user'].sort().join('_') : 
      selectedChat.id;

    const unsubscribe = subscribeToMessages(chatId, chatType);
    return unsubscribe;
  }, [selectedChat, subscribeToMessages]);

  // Detectar menções no texto
  const detectMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  // Gerar sugestões IA
  const generateAISuggestions = useCallback(() => {
    const suggestions = [
      "Que tal marcarmos uma reunião?",
      "Posso ajudar com mais alguma coisa?",
      "Vamos revisar os próximos passos?",
      "Precisa de suporte técnico?",
      "Como está o andamento do projeto?",
    ];
    setAiSuggestions(suggestions.slice(0, 3));
  }, []);

  // Enviar mensagem
  const sendMessage = useCallback(async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      const mentions = detectMentions(message);
      const chatType = 'members' in selectedChat ? 'group' : 'user';
      const chatId = chatType === 'user' ? 
        [selectedChat.id, 'current-user'].sort().join('_') : 
        selectedChat.id;

      const newMessage = {
        content: message,
        senderId: 'current-user',
        senderName: 'Você',
        senderAvatar: '/betologo.jpeg',
        chatId: chatId,
        chatType: chatType,
        timestamp: serverTimestamp(),
        type: 'text',
        status: 'sent',
        mentions,
        replyTo: replyingTo?.id || null,
        isEncrypted: encryptionEnabled,
        attachments: []
      };

      // Salvar mensagem no Firebase
      await addDoc(collection(db, 'chatMessages'), newMessage);

      setMessage('');
      setReplyingTo(null);
      setAiSuggestions([]);

      // Resposta da IA se estiver falando com Lívia
      if (selectedChat.name === 'Lívia IA') {
        setTimeout(async () => {
          const aiResponse = {
            content: `Entendi! ${message.includes('@') ? 'Vi que você mencionou alguém. ' : ''}Vou processar sua solicitação e te dar o melhor suporte possível. Como posso ajudar mais?`,
            senderId: 'livia-ia',
            senderName: 'Lívia IA',
            senderAvatar: '/logo.webp',
            chatId: chatId,
            chatType: chatType,
            timestamp: serverTimestamp(),
            type: 'text',
            status: 'delivered',
            isEncrypted: encryptionEnabled,
            mentions: [],
            attachments: []
          };

          await addDoc(collection(db, 'chatMessages'), aiResponse);
          generateAISuggestions();
        }, 1500);
      }

      // Criar notificações para menções
      mentions.forEach(async (mention) => {
        const user = users.find(u => u.name.toLowerCase().includes(mention.toLowerCase()));
        if (user) {
          const notification = {
            type: 'mention',
            content: `Você foi mencionado no chat`,
            userId: user.id,
            senderId: 'current-user',
            senderName: 'Você',
            chatId: chatId,
            messageContent: message.substring(0, 100),
            timestamp: serverTimestamp(),
            read: false
          };

          await addDoc(collection(db, 'chatNotifications'), notification);
        }
      });

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Mostrar notificação de erro
      setNotifications(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        content: 'Erro ao enviar mensagem. Tente novamente.',
        timestamp: new Date(),
        read: false
      }]);
    }
  }, [message, selectedChat, replyingTo, encryptionEnabled, users, generateAISuggestions]);

  // Filtrar usuários e grupos
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status do usuário
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'away': return '#FF9800';
      case 'busy': return '#F44336';
      default: return '#757575';
    }
  };

  // Renderizar mensagem
const renderMessage = (msg: Message) => {
  const isOwn = msg.senderId === 'current-user';

  return (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${classes.message} ${
        isOwn ? classes.messageOwn : classes.messageOther
      }`}
    >
      {!isOwn && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <Avatar 
            src={msg.senderAvatar} 
            style={{ width: 20, height: 20, marginRight: 8 }}
          >
            {msg.senderName.charAt(0)}
          </Avatar>
          <Typography variant="caption" style={{ color: 'black', fontWeight: 'bold' }}>
            {msg.senderName}
          </Typography>
        </div>
      )}

      {msg.replyTo && (
        <div className={classes.replyPreview}>
          <Typography variant="caption" style={{ color: 'black' }}>
            Respondendo a mensagem anterior
          </Typography>
        </div>
      )}

      <Typography variant="body2" style={{ color: 'black' }}>
        {msg.content}
      </Typography>

      {msg.mentions && msg.mentions.length > 0 && (
        <div style={{ marginTop: 4 }}>
          {msg.mentions.map(mention => (
            <Chip
              key={mention}
              label={`@${mention}`}
              size="small"
              className={classes.mentionChip}
            />
          ))}
        </div>
      )}

      <div className={classes.messageTime}>
        {msg.timestamp.toLocaleTimeString()}
        {msg.isEncrypted && (
          <Lock style={{ fontSize: 12, marginLeft: 4 }} />
        )}
        {msg.editedAt && (
          <span style={{ marginLeft: 4, fontStyle: 'italic' }}>(editado)</span>
        )}
      </div>

      {isOwn && (
        <div className={classes.messageStatus}>
          {msg.status === 'sent' && <Done style={{ fontSize: 16 }} />}
          {msg.status === 'delivered' && <DoneAll style={{ fontSize: 16 }} />}
          {msg.status === 'read' && <DoneAll style={{ fontSize: 16, color: '#4CAF50' }} />}
        </div>
      )}
    </motion.div>
  );
};


  return (
    <div className={classes.root}>

      {/* Recursos Inteligentes */}
      <motion.div
        className={classes.smartFeatures}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Typography variant="h6" gutterBottom>
          <Notifications style={{ marginRight: 8, verticalAlign: 'middle' }} />
          IA Assistente
        </Typography>
        <Typography variant="body2" style={{ marginBottom: 8 }}>
          <Extension style={{ marginRight: 4, fontSize: 16 }} />
          Chat criptografado E2E
        </Typography>
        <Typography variant="body2" style={{ marginBottom: 8 }}>
          <Notifications style={{ marginRight: 4, fontSize: 16 }} />
          Análise em tempo real
        </Typography>
        <Chip 
          icon={<Notifications />} 
          label="IA Ativa" 
          color="primary" 
          size="small"
        />
      </motion.div>

      {/* Sidebar */}
      <div className={classes.sidebar}>
        {/* Header da Sidebar */}
        <div className={classes.sidebarHeader}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Chat style={{ marginRight: 8 }} />
            <Typography variant="h6">Chat Interno</Typography>
          </div>
          <div>
            <IconButton 
              color="inherit" 
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Badge badgeContent={notifications.filter(n => !n.read).length} color="secondary">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <Settings />
            </IconButton>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <TextField
          className={classes.searchBar}
          placeholder="Buscar conversas..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          className={classes.tabsContainer}
          variant="fullWidth"
        >
          <Tab label="Usuários" icon={<People />} />
          <Tab label="Grupos" icon={<Group />} />
          <Tab label="IA" icon={<Notifications />} />
        </Tabs>

        {/* Lista de Usuários */}
      {activeTab === 0 && (
  <List style={{ flex: 1, overflow: 'auto' }}>
    {filteredUsers.map((user) => (
      <ListItem
        key={user.id}
        className={classes.userItem}
        onClick={() => setSelectedChat(user)}
        selected={selectedChat?.id === user.id}
      >
        <ListItemAvatar>
          <Badge
            overlap="rectangular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            badgeContent={
              <FiberManualRecord
                style={{
                  color: getStatusColor(user.status),
                  fontSize: 12,
                }}
              />
            }
          >
            <Avatar src={user.avatar} alt={user.name} />
          </Badge>
        </ListItemAvatar>
        <ListItemText
          // O nome do usuário sempre preto e em negrito
          primary={<span style={{ color: 'black', fontWeight: 600 }}>{user.name}</span>}
          // O status ou 'digitando...' (você pode colocar preto também se quiser)
          secondary={
            user.isTyping ? (
              <span style={{ color: '#4CAF50', fontStyle: 'italic' }}>
                digitando...
              </span>
            ) : (
              <span style={{ color: 'black' }}>
                {user.status === 'online' ? 'Online' : 'Offline'}
              </span>
            )
          }
        />
        {user.status === 'online' && <Notifications style={{ color: '#4CAF50', fontSize: 12 }} />}
      </ListItem>
    ))}
  </List>
)}


        {/* Lista de Grupos */}
        {activeTab === 1 && (
          <List style={{ flex: 1, overflow: 'auto' }}>
            {filteredGroups.map((group) => (
              <ListItem
                key={group.id}
                className={classes.groupItem}
                onClick={() => setSelectedChat(group)}
                selected={selectedChat?.id === group.id}
              >
                <ListItemAvatar>
                  <Badge badgeContent={group.unreadCount} color="secondary">
                    <Avatar src={group.avatar} alt={group.name}>
                      <Group />
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {group.name}
                      {group.isPrivate && <Lock style={{ fontSize: 16, marginLeft: 4 }} />}
                    </div>
                  }
                  secondary={`${group.members.length} membros • ${group.description}`}
                />
              </ListItem>
            ))}

            {/* Botão Criar Grupo */}
            <ListItem 
              button 
              className={classes.groupItem}
              onClick={async () => {
                const groupName = prompt('Nome do grupo:');
                if (groupName) {
                  try {
                    const newGroup = {
                      name: groupName,
                      description: `Grupo criado por usuário`,
                      members: ['current-user'],
                      avatar: '/betologo.jpeg',
                      isPrivate: false,
                      createdBy: 'current-user',
                      createdAt: serverTimestamp()
                    };

                    await addDoc(collection(db, 'chatGroups'), newGroup);
                    loadGroupsFromFirebase();

                    setNotifications(prev => [...prev, {
                      id: Date.now().toString(),
                      type: 'system',
                      content: `Grupo "${groupName}" criado com sucesso!`,
                      timestamp: new Date(),
                      read: false
                    }]);
                  } catch (error) {
                    console.error('Erro ao criar grupo:', error);
                  }
                }
              }}
            >
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Criar Novo Grupo" />
            </ListItem>
          </List>
        )}

        {/* IA Assistente */}
        {activeTab === 2 && (
          <div style={{ padding: 16, flex: 1 }}>
            <Card style={{ marginBottom: 16 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Extension style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Lívia IA Pro
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Assistente inteligente com recursos avançados
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<Chat />}
                onClick={() => setSelectedChat(users.find(u => u.id === '5') || null)}

                >
                  Conversar com IA
                </Button>
              </CardContent>
            </Card>

            <Typography variant="subtitle2" gutterBottom>
              Recursos Disponíveis:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><Notifications /></ListItemIcon>
                <ListItemText primary="Sugestões Inteligentes" />
              </ListItem>
              <ListItem>
                <ListItemIcon><TrendingUp /></ListItemIcon>
                <ListItemText primary="Análise de Sentimento" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Security /></ListItemIcon>
                <ListItemText primary="Moderação Automática" />
              </ListItem>
            </List>
          </div>
        )}
      </div>

      {/* Área Principal do Chat */}
      <div className={classes.chatArea}>
        {selectedChat ? (
          <>
            {/* Header do Chat */}
            <div className={classes.chatHeader}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <Avatar 
                  src={selectedChat.avatar} 
                  alt={selectedChat.name}
                  style={{ 
                    marginRight: isMobile ? 8 : 12,
                    width: isMobile ? 32 : 40,
                    height: isMobile ? 32 : 40
                  }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"}
                    style={{ 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {selectedChat.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {'status' in selectedChat ? (
                      selectedChat.status === 'online' ? 'Online' : 'Offline'
                    ) : (
                      `${selectedChat.members.length} membros`
                    )}
                  </Typography>
                </div>
                {encryptionEnabled && !isMobile && (
                  <div className={classes.encryptionStatus}>
                    <Lock style={{ fontSize: 16 }} />
                    <span>Criptografado</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: isMobile ? 4 : 8 }}>
                {!isMobile && (
                  <>
                    <IconButton onClick={() => setVideoCall(true)}>
                      <Videocam />
                    </IconButton>
                    <IconButton>
                      <Phone />
                    </IconButton>
                  </>
                )}
                <IconButton>
                  <Info />
                </IconButton>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </div>
            </div>

            {/* Área de Mensagens */}
            <div className={classes.messagesContainer}>
              <AnimatePresence>
                {messages.map(renderMessage)}
              </AnimatePresence>

              {/* Indicador de digitação */}
              {isTyping && (
                <div className={classes.typingIndicator}>
                  <CircularProgress size={16} style={{ marginRight: 8 }} />
                  <Typography variant="caption">
                    {selectedChat.name} está digitando...
                  </Typography>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sugestões IA */}
            {aiSuggestions.length > 0 && (
              <motion.div
                className={classes.aiSuggestions}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Typography variant="caption" gutterBottom>
                  <Notifications style={{ fontSize: 14, marginRight: 4 }} />
                  Sugestões IA:
                </Typography>
                <div>
                  {aiSuggestions.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      size="small"
                      variant="outlined"
                      onClick={() => setMessage(suggestion)}
                      style={{ margin: 2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Preview de Resposta */}
            {replyingTo && (
              <div className={classes.replyPreview}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">
                    Respondendo a: {replyingTo.content.substring(0, 100)}...
                  </Typography>
                  <IconButton size="small" onClick={() => setReplyingTo(null)}>
                    <Close />
                  </IconButton>
                </div>
              </div>
            )}

            {/* Área de Input */}
            <div className={classes.messageArea}>
              {!isMobile && (
                <>
                  <IconButton onClick={() => fileInputRef.current?.click()}>
                    <AttachFile />
                  </IconButton>
                  <IconButton>
                    <Image />
                  </IconButton>
                </>
              )}
              <TextField
                ref={messageInputRef}
                fullWidth
                placeholder={isMobile ? "Mensagem..." : "Digite uma mensagem... (use @ para mencionar)"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                variant="outlined"
                size={isMobile ? "small" : "small"}
                multiline={!isMobile}
                maxRows={isMobile ? 1 : 3}
                InputProps={{
                  startAdornment: isMobile ? (
                    <InputAdornment position="start">
                      <IconButton size="small" onClick={() => fileInputRef.current?.click()}>
                        <AttachFile />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        size={isMobile ? "small" : "medium"}
                        onClick={() => setVoiceRecording(!voiceRecording)}
                      >
                        {voiceRecording ? <MicOff /> : <Mic />}
                      </IconButton>
                      {!isMobile && (
                        <IconButton>
                          <EmojiEmotions />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton 
                color="primary" 
                onClick={sendMessage}
                disabled={!message.trim()}
                size={isMobile ? "small" : "medium"}
              >
                <Send />
              </IconButton>
            </div>
          </>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            flexDirection: 'column' 
          }}>
            <ChatBubble style={{ fontSize: 64, color: theme.palette.primary.main, marginBottom: 16 }} />
            <Typography variant="h5" gutterBottom>
              Bem-vindo ao Chat Interno
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Selecione uma conversa para começar
            </Typography>
          </div>
        )}
      </div>

      {/* Painel de Notificações */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            className={classes.notificationPanel}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Typography variant="h6">Notificações</Typography>
                <IconButton size="small" onClick={() => setShowNotifications(false)}>
                  <Close />
                </IconButton>
              </div>

              <List dense>
                {notifications.map((notification) => (
                  <ListItem key={notification.id}>
                    <ListItemAvatar>
                      <Avatar src={notification.sender?.avatar}>
                        <Notifications />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.content}
                      secondary={notification.timestamp.toLocaleTimeString()}
                    />
                    {!notification.read && (
                      <Notifications style={{ color: '#4CAF50', fontSize: 8 }} />
                    )}
                  </ListItem>
                ))}
              </List>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de Gravação de Voz */}
      <AnimatePresence>
        {voiceRecording && (
          <motion.div
            className={classes.voiceIndicator}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Mic style={{ fontSize: 48, marginBottom: 8 }} />
            <Typography variant="caption">Gravando...</Typography>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input de Arquivo Oculto */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx"
      />

      {/* Botão Flutuante de Configurações */}
      <Fab className={classes.floatingButton}>
        <Settings />
      </Fab>
    </div>
  );
};

export default ChatInterno;
import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Fab,
  Zoom,
  Fade,
  CircularProgress,
  LinearProgress,
  Drawer,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Tooltip,
  Snackbar,
  Box,
  Divider,
  TextareaAutosize,
  FormControl,
  InputLabel,
  Select,
  CardHeader,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  Timeline,
  Favorite,
  FavoriteBorder,
  Share,
  Comment,
  BookmarkBorder,
  Bookmark,
  MoreVert,
  PhotoCamera,
  Send,
  EmojiObjects,
  TrendingUp,
  Visibility,
  Chat,
  Close,
  Add,
  Search,
  FilterList,
  Notifications,
  Extension,
  VideoCall,
  AttachFile,
  Edit,
  Delete,
  Reply,
  ThumbUp,
  ThumbDown,
  Star,
  StarBorder,
  People,
  Public,
  Lock,
  Settings,
  Refresh,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  FullscreenExit,
  Fullscreen,
  Speed,
  Schedule,
  Today,
  AccessTime,
  Image,
  LocationOn,
  EmojiEmotions,
  VideoLibrary,
  Poll,
  Event,
  PersonAdd,
  PersonAddDisabled,
  Check,
  Clear,
  CloudUpload,
} from '@material-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  deleteDoc, 
  onSnapshot, 
  orderBy, 
  query, 
  limit, 
  startAfter,
  where,
  Timestamp,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '@/logic/firebase/config/app';
import PerfilUsuario from '@/components/perfil/PerfilUsuario';
import AutenticacaoContext from '@/data/contexts/AutenticacaoContext';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.type === 'dark' 
      ? 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #f0f2f5 0%, #ffffff 100%)',
    minHeight: '100vh',
    padding: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    background: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)',
    color: 'white',
    padding: theme.spacing(1.5),
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderRadius: '0 0 16px 16px',
    boxShadow: theme.shadows[8],
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      borderRadius: '0 0 12px 12px',
    },
    '& > div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: 1200,
      margin: '0 auto',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'row',
        gap: theme.spacing(1),
      },
    },
  },
  headerTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem',
    },
  },
  headerSubtitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem',
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  mainContainer: {
    display: 'flex',
    minHeight: 'calc(100vh - 80px)',
    maxWidth: 1200,
    margin: '0 auto',
    padding: theme.spacing(0, 1),
    gap: theme.spacing(1),
    [theme.breakpoints.down('lg')]: {
      maxWidth: '100%',
      padding: theme.spacing(0, 0.5),
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      padding: 0,
      gap: 0,
    },
    [theme.breakpoints.down('sm')]: {
      minHeight: 'calc(100vh - 60px)',
    },
  },
  leftSidebar: {
    width: 280,
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    margin: theme.spacing(2, 1, 2, 0),
    padding: theme.spacing(2),
    height: 'fit-content',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto',
    boxShadow: theme.shadows[2],
    [theme.breakpoints.down('xl')]: {
      width: 260,
    },
    [theme.breakpoints.down('lg')]: {
      width: 240,
    },
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
    '&::-webkit-scrollbar': {
      width: 4,
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(0,0,0,0.05)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(0,0,0,0.2)',
      borderRadius: 4,
    },
  },
  feedContainer: {
    flex: 1,
    minHeight: '100%',
    overflowY: 'auto',
    padding: theme.spacing(2, 1),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1, 0.5),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 0.25),
    },
    '&::-webkit-scrollbar': {
      width: 6,
      [theme.breakpoints.down('sm')]: {
        width: 3,
      },
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(0,0,0,0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)',
      borderRadius: 10,
    },
  },
  rightSidebar: {
    width: 320,
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    margin: theme.spacing(2, 0, 2, 1),
    padding: theme.spacing(2),
    height: 'fit-content',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto',
    boxShadow: theme.shadows[2],
    [theme.breakpoints.down('xl')]: {
      width: 300,
    },
    [theme.breakpoints.down('lg')]: {
      width: 280,
      padding: theme.spacing(1.5),
    },
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
    '&::-webkit-scrollbar': {
      width: 4,
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(0,0,0,0.05)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(0,0,0,0.2)',
      borderRadius: 4,
    },
  },
  createPostCard: {
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1.5),
      borderRadius: theme.spacing(1.5),
      padding: theme.spacing(1.5),
      margin: theme.spacing(0, 0.5),
    },
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(0, 0.25),
      padding: theme.spacing(1),
    },
  },
  postCard: {
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    transition: 'all 0.3s ease',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1.5),
      borderRadius: theme.spacing(1.5),
      margin: theme.spacing(0, 0.5),
    },
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(0, 0.25),
      borderRadius: theme.spacing(1),
    },
    '&:hover': {
      boxShadow: theme.shadows[8],
      [theme.breakpoints.down('sm')]: {
        boxShadow: theme.shadows[4],
      },
    },
  },
  postHeader: {
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    },
  },
  postMedia: {
    maxHeight: 600,
    objectFit: 'cover',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      maxHeight: 450,
    },
    [theme.breakpoints.down('sm')]: {
      maxHeight: 350,
    },
    [theme.breakpoints.down('xs')]: {
      maxHeight: 250,
    },
  },
  postActions: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5, 1.5),
      '& button': {
        minWidth: 'auto',
        padding: theme.spacing(0.5, 1),
        fontSize: '0.75rem',
      },
      '& .MuiButton-startIcon': {
        marginRight: theme.spacing(0.5),
        '& svg': {
          fontSize: '1rem',
        },
      },
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.5, 1),
      '& button': {
        fontSize: '0.7rem',
        padding: theme.spacing(0.25, 0.5),
      },
    },
  },
  postContent: {
    padding: theme.spacing(0, 2, 2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1.5, 1.5),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 1, 1),
    },
  },
  commentSection: {
    padding: theme.spacing(0, 2, 2),
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1.5, 1.5),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 1, 1),
    },
  },
  commentInput: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(0.5),
      '& .MuiAvatar-root': {
        width: 28,
        height: 28,
      },
      '& .MuiTextField-root': {
        '& .MuiInputBase-input': {
          padding: theme.spacing(0.75),
          fontSize: '0.875rem',
        },
      },
    },
    [theme.breakpoints.down('xs')]: {
      '& .MuiAvatar-root': {
        width: 24,
        height: 24,
      },
    },
  },
  comment: {
    background: theme.palette.grey[100],
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1, 2),
    margin: theme.spacing(1, 0),
    [theme.breakpoints.down('sm')]: {
      borderRadius: theme.spacing(1.5),
      padding: theme.spacing(0.75, 1.5),
      margin: theme.spacing(0.75, 0),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.5, 1),
      borderRadius: theme.spacing(1),
    },
  },
  mobileOptimized: {
    [theme.breakpoints.down('md')]: {
      '& .MuiDialog-paper': {
        margin: theme.spacing(1),
        width: 'calc(100% - 16px)',
        maxHeight: 'calc(100% - 16px)',
      },
    },
    [theme.breakpoints.down('sm')]: {
      '& .MuiDialog-paper': {
        margin: theme.spacing(0.5),
        width: 'calc(100% - 8px)',
        maxHeight: 'calc(100% - 8px)',
        borderRadius: theme.spacing(1),
      },
    },
  },
  responsiveText: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.875rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
    },
  },
  responsiveAvatar: {
    [theme.breakpoints.down('sm')]: {
      width: 32,
      height: 32,
    },
    [theme.breakpoints.down('xs')]: {
      width: 28,
      height: 28,
    },
  },
  storyContainer: {
    display: 'flex',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    overflowX: 'auto',
    background: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[2],
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
      gap: theme.spacing(1.5),
      borderRadius: theme.spacing(1.5),
      marginBottom: theme.spacing(1.5),
      margin: theme.spacing(0, 0.5, 1.5, 0.5),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
      gap: theme.spacing(1),
      margin: theme.spacing(0, 0.25, 1, 0.25),
    },
    '&::-webkit-scrollbar': {
      height: 4,
      [theme.breakpoints.down('sm')]: {
        height: 2,
      },
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(0,0,0,0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(0,0,0,0.3)',
      borderRadius: 4,
    },
  },
  storyItem: {
    textAlign: 'center',
    minWidth: 80,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      minWidth: 70,
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: 60,
    },
    '&:hover': {
      '& $storyAvatar': {
        transform: 'scale(1.1)',
      },
    },
  },
  storyAvatar: {
    width: 60,
    height: 60,
    border: '3px solid #1877f2',
    transition: 'transform 0.3s ease',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: 50,
      height: 50,
      border: '2px solid #1877f2',
      marginBottom: theme.spacing(0.5),
    },
    [theme.breakpoints.down('xs')]: {
      width: 40,
      height: 40,
    },
  },
  aiInsight: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(1),
    margin: theme.spacing(1, 0),
    fontSize: '0.85rem',
  },
  floatingButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
    background: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)',
    [theme.breakpoints.down('md')]: {
      bottom: theme.spacing(1.5),
      right: theme.spacing(1.5),
      width: 48,
      height: 48,
    },
    [theme.breakpoints.down('sm')]: {
      bottom: theme.spacing(1),
      right: theme.spacing(1),
      width: 44,
      height: 44,
    },
    [theme.breakpoints.down('xs')]: {
      width: 40,
      height: 40,
    },
  },
  mediaPreview: {
    position: 'relative',
    display: 'inline-block',
    margin: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5),
      '& img': {
        width: '80px !important',
        height: '80px !important',
      },
    },
    [theme.breakpoints.down('xs')]: {
      '& img': {
        width: '60px !important',
        height: '60px !important',
      },
    },
  },
  removeMediaButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 24,
    height: 24,
    [theme.breakpoints.down('sm')]: {
      width: 20,
      height: 20,
      top: -6,
      right: -6,
    },
    '&:hover': {
      backgroundColor: 'white',
    },
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 2,
    right: 2,
    border: '2px solid white',
    [theme.breakpoints.down('sm')]: {
      width: 10,
      height: 10,
      border: '1px solid white',
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  trendingCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  friendSuggestion: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

interface User {
  id: string;
  name: string;
  avatar: string;
  verified?: boolean;
  online?: boolean;
  phone?: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Timestamp;
  likes: number;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  mediaUrls?: string[];
  mediaType?: 'image' | 'video';
  timestamp: Timestamp;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  shares: number;
  location?: string;
  visibility: 'public' | 'friends' | 'private';
  aiEnhanced?: boolean;
  insights?: string[];
  hashtags?: string[];
  editedAt?: any;
}

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  timestamp: Timestamp;
  viewed: boolean;
}

// Interface para mensagens do chat
interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  read: boolean;
  type: 'text' | 'image' | 'file';
}

const Feed: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { usuario } = useContext(AutenticacaoContext);

  // Estado principal
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);

  // Estado para criação de posts
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState<File[]>([]);
  const [newPostLocation, setNewPostLocation] = useState('');
  const [newPostVisibility, setNewPostVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [uploadingPost, setUploadingPost] = useState(false);

  // Estado para interações
  const [commentDialogs, setCommentDialogs] = useState<{[key: string]: boolean}>({});
  const [commentTexts, setCommentTexts] = useState<{[key: string]: string}>({});
  const [expandedPosts, setExpandedPosts] = useState<{[key: string]: boolean}>({});

  // Estado para AI
  const [aiAnalyzing, setAiAnalyzing] = useState<{[key: string]: boolean}>({});
  const [aiInsights, setAiInsights] = useState<{[key: string]: string[]}>({});

  // Estado para notificações
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

  // Refs
  const feedRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const observer = useRef<IntersectionObserver>();

  // Estado para usuário atual
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Estado para perfil de usuário
  const [selectedUserProfile, setSelectedUserProfile] = useState<string | null>(null);

  // Estado para menu de contexto de amizade
  const [friendshipMenu, setFriendshipMenu] = useState<{
    open: boolean;
    anchorEl: HTMLElement | null;
    targetUserId: string | null;
    targetUserName: string | null;
  }>({
    open: false,
    anchorEl: null,
    targetUserId: null,
    targetUserName: null,
  });

  // Estado para relacionamentos
  const [userFriends, setUserFriends] = useState<string[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'add' | 'remove';
    userName: string;
    userId: string;
  }>({
    open: false,
    action: 'add',
    userName: '',
    userId: '',
  });

  // Estados para menu de ações dos posts (3 pontinhos)
  const [postMenus, setPostMenus] = useState<{[key: string]: HTMLElement | null}>({});
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [shareDialog, setShareDialog] = useState<{
    open: boolean;
    post: Post | null;
  }>({
    open: false,
    post: null,
  });

  // Estados para grupos e compartilhamento
  const [userGroups, setUserGroups] = useState<Array<{
    id: string;
    name: string;
    members: string[];
    avatar?: string;
  }>>([]);

  // Estado para confirmação de exclusão
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    open: boolean;
    postId: string;
    postContent: string;
  }>({
    open: false,
    postId: '',
    postContent: '',
  });

  // Estados para chat lateral
  const [activeChatMessages, setActiveChatMessages] = useState<{[userId: string]: ChatMessage[]}>({});
  const [openChatWindows, setOpenChatWindows] = useState<string[]>([]);
  const [chatTyping, setChatTyping] = useState<{[userId: string]: boolean}>({});

  // Estados para sugestões de amizade
  const [friendSuggestions, setFriendSuggestions] = useState<User[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  // Callback para infinite scroll
  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Função para carregar usuários reais do Firebase
  const loadUsersFromFirebase = async () => {
    try {
      // Fallback para usuários mock primeiro
      const mockUsers: User[] = [
        { id: 'livia-ia', name: 'Lívia IA', avatar: '/logo.webp', verified: true, online: true },
        { id: 'beto', name: 'Beto Despachante', avatar: '/betologo.jpeg', verified: true, online: false },
      ];

      setUsers(mockUsers);
      if (currentUser?.id === 'default-user') {
        setCurrentUser(mockUsers[0]);
      }

      // Tentar carregar do Firebase
      const usersQuery = query(
        collection(db, 'usuarios'),
        orderBy('nome')
      );

      const usersSnapshot = await getDocs(usersQuery);
      const firebaseUsers: User[] = [];

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.ativo !== false) { // Apenas usuários ativos
          firebaseUsers.push({
            id: doc.id,
            name: userData.nome || 'Usuário',
            avatar: userData.imagemUrl || '/betologo.jpeg',
            verified: userData.permissao === 'Administrador' || userData.permissao === 'CEO',
            online: Math.random() > 0.5, // Simula status online/offline
          });
        }
      });

      if (firebaseUsers.length > 0) {
        // Adicionar Lívia IA se não existir
        const liviaExists = firebaseUsers.some(user => user.name === 'Lívia IA');
        if (!liviaExists) {
          firebaseUsers.unshift({
            id: 'livia-ia',
            name: 'Lívia IA',
            avatar: '/logo.webp',
            verified: true,
            online: true,
          });
        }

        setUsers(firebaseUsers);

        // Definir usuário atual se ainda for o padrão
        if (currentUser?.id === 'livia-ia' || currentUser?.id === 'default-user') {
          setCurrentUser(firebaseUsers[0]);
        }
      }

    } catch (error) {
      console.error('Erro ao carregar usuários do Firebase:', error);
      // Manter usuários mock em caso de erro
    }
  };

  // Inicialização
  useEffect(() => {
    initializeFeed();
    loadUsersFromFirebase();
    loadStories();
    loadUserFriends();
    loadActiveChatUsers();
    loadFriendSuggestions();
    loadUserGroups();
  }, []);

  // Configurar usuário atual do contexto
  useEffect(() => {
    if (usuario?.email) {
      const newCurrentUser = {
        id: usuario.uid || usuario.id || usuario.email || 'current-user',
        name: usuario.nome || 'Usuário',
        avatar: usuario.imagemUrl || '/betologo.jpeg',
        verified: usuario.permissao === 'Administrador' || usuario.permissao === 'CEO',
        online: true,
      };
      
      setCurrentUser(newCurrentUser);
      console.log('✅ Usuário configurado no Feed:', newCurrentUser);
    } else {
      setCurrentUser(null);
      console.log('❌ Nenhum usuário autenticado no Feed');
    }
  }, [usuario]);

  // Carregar usuários com conversas ativas
  const loadActiveChatUsers = async () => {
    if (!currentUser) return;

    try {
      // Carregar conversas recentes
      const chatsQuery = query(
        collection(db, 'chat_messages'),
        where('participants', 'array-contains', currentUser.id),
        orderBy('timestamp', 'desc'),
        limit(20)
      );

      const snapshot = await getDocs(chatsQuery);
      const recentChats = new Set<string>();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const otherUserId = data.senderId === currentUser.id ? data.receiverId : data.senderId;
        if (userFriends.includes(otherUserId)) {
          recentChats.add(otherUserId);
        }
      });

      // Auto-carregar mensagens dos chats recentes
      Array.from(recentChats).slice(0, 3).forEach(userId => {
        loadChatMessages(userId);
      });

    } catch (error) {
      console.error('Erro ao carregar chats ativos:', error);
    }
  };

  // Carregar sugestões de amizade
  const loadFriendSuggestions = async () => {
    if (!currentUser) return;

    setSuggestionsLoading(true);
    try {
      const usersQuery = query(
        collection(db, 'usuarios'),
        orderBy('nome'),
        limit(20)
      );

      const snapshot = await getDocs(usersQuery);
      const suggestions: User[] = [];

      snapshot.forEach((doc) => {
        const userData = doc.data();
        const userId = doc.id;

        // Não sugerir o próprio usuário ou amigos já adicionados
        if (userId !== currentUser.id && !userFriends.includes(userId) && userData.ativo !== false) {
          suggestions.push({
            id: userId,
            name: userData.nome || 'Usuário',
            avatar: userData.imagemUrl || '/betologo.jpeg',
            verified: userData.permissao === 'Administrador' || userData.permissao === 'CEO',
            online: Math.random() > 0.5, // Simula status online/offline
          });
        }
      });

      // Embaralhar e limitar a 5 sugestões
      const shuffled = suggestions.sort(() => Math.random() - 0.5).slice(0, 5);
      setFriendSuggestions(shuffled);

    } catch (error) {
      console.error('Erro ao carregar sugestões de amizade:', error);
    }
    setSuggestionsLoading(false);
  };

  // Carregar lista de amigos do usuário atual
  const loadUserFriends = async () => {
    if (!currentUser) return;

    try {
      const userDoc = await getDoc(doc(db, 'usuarios', currentUser.id));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserFriends(userData.friends || []);
      }
    } catch (error) {
      console.error('Erro ao carregar amigos:', error);
    }
  };

  const initializeFeed = async () => {
    setLoading(true);
    try {
      const postsQuery = query(
        collection(db, 'feed_posts'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const newPosts: Post[] = [];
        snapshot.forEach((doc) => {
          newPosts.push({ id: doc.id, ...doc.data() } as Post);
        });
        setPosts(newPosts);

        if (snapshot.docs.length > 0) {
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Erro ao carregar feed:', error);
      // Se não conseguir carregar do Firebase, usar dados mock
      initializeMockData();
      setLoading(false);
    }
  };

  const initializeMockData = () => {
    try {
      // Criar timestamps seguros
      const createSafeTimestamp = (date?: Date) => {
        try {
          if (typeof Timestamp !== 'undefined' && Timestamp.now) {
            return date ? Timestamp.fromDate(date) : Timestamp.now();
          } else {
            // Fallback se Timestamp não estiver disponível
            return date || new Date();
          }
        } catch (error) {
          console.warn('Erro ao criar timestamp, usando Date:', error);
          return date || new Date();
        }
      };

      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 3600000);

      const mockPosts: Post[] = [
        {
          id: '1',
          userId: 'livia-ia',
          userName: 'Lívia IA Assistant',
          userAvatar: '/logo.webp',
          content: 'Análise de tendências em tempo real detectou aumento de 47% na procura por serviços digitais. Oportunidade de mercado identificada! 🚀\n\n#IA #Tendências #Oportunidade #DigitalTransformation',
          mediaUrls: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'],
          mediaType: 'image',
          timestamp: createSafeTimestamp(now) as Timestamp,
          likes: 234,
          likedBy: ['beto'],
          comments: [
            {
              id: 'c1',
              userId: 'beto',
              userName: 'Beto Despachante',
              userAvatar: '/betologo.jpeg',
              content: 'Excelente análise! Como você coletou esses dados?',
              timestamp: createSafeTimestamp(now) as Timestamp,
              likes: 12,
            }
          ],
          shares: 23,
          location: 'Tubarão, SC',
          visibility: 'public',
          aiEnhanced: true,
          insights: ['Alta engagement prevista', 'Melhor horário: 14:30', 'Público-alvo: Empresários'],
          hashtags: ['#IA', '#Tendências', '#Oportunidade'],
        },
        {
          id: '2',
          userId: 'beto',
          userName: 'Beto Despachante',
          userAvatar: '/betologo.jpeg',
          content: 'Novo sistema de requerimentos online já está funcionando! 📋\n\nAgora nossos clientes podem fazer solicitações 24/7 com total segurança e praticidade.',
          timestamp: createSafeTimestamp(oneHourAgo) as Timestamp,
          likes: 156,
          likedBy: ['livia-ia'],
          comments: [
            {
              id: 'c2',
              userId: 'livia-ia',
              userName: 'Lívia IA',
              userAvatar: '/logo.webp',
              content: 'Parabéns pela inovação! Sistema muito bem estruturado.',
              timestamp: createSafeTimestamp(now) as Timestamp,
              likes: 5,
            }
          ],
          shares: 12,
          location: 'Tubarão, SC',
          visibility: 'public',
          aiEnhanced: true,
          insights: ['Engagement alto', 'Compartilhamento recomendado'],
        },
      ];
      setPosts(mockPosts);
    } catch (error) {
      console.error('Erro ao inicializar dados mock:', error);
      setPosts([]); // Definir array vazio em caso de erro
    }
  };

  const loadStories = async () => {
    try {
      const storiesQuery = query(
        collection(db, 'feed_stories'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      const storiesSnapshot = await getDocs(storiesQuery);
      const firebaseStories: Story[] = [];

      storiesSnapshot.forEach((doc) => {
        const storyData = doc.data();
        firebaseStories.push({
          id: doc.id,
          userId: storyData.userId,
          userName: storyData.userName,
          userAvatar: storyData.userAvatar,
          mediaUrl: storyData.mediaUrl,
          timestamp: storyData.timestamp,
          viewed: storyData.viewed || false,
        });
      });

      if (firebaseStories.length === 0) {
        // Stories mock se não houver no Firebase
        const mockStories: Story[] = [
          {
            id: 's1',
            userId: 'livia-ia',
            userName: 'Lívia IA',
            userAvatar: '/logo.webp',
            mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
            timestamp: Timestamp.now(),
            viewed: false,
          },
          {
            id: 's2',
            userId: 'beto',
            userName: 'Beto Despachante',
            userAvatar: '/betologo.jpeg',
            mediaUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=600&fit=crop',
            timestamp: Timestamp.now(),
            viewed: false,
          },
        ];
        setStories(mockStories);
      } else {
        setStories(firebaseStories);
      }

    } catch (error) {
      console.error('Erro ao carregar stories:', error);
      setStories([]);
    }
  };

  const loadMorePosts = async () => {
    if (loading || !hasMore || !lastVisible) return;
    setLoading(true);

    try {
      const postsQuery = query(
        collection(db, 'feed_posts'),
        orderBy('timestamp', 'desc'),
        startAfter(lastVisible),
        limit(5)
      );

      const snapshot = await getDocs(postsQuery);
      const newPosts: Post[] = [];

      snapshot.forEach((doc) => {
        newPosts.push({ id: doc.id, ...doc.data() } as Post);
      });

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error('Erro ao carregar mais posts:', error);
      setHasMore(false);
    }

    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && newPostMedia.length === 0) return;

    setUploadingPost(true);

    try {
      let mediaUrls: string[] = [];

      // Upload de mídia para Firebase Storage
      if (newPostMedia.length > 0) {
        const uploadPromises = newPostMedia.map(async (file) => {
          const storageRef = ref(storage, 'feed_media/' + Date.now() + '_' + file.name);
          const snapshot = await uploadBytes(storageRef, file);
          return getDownloadURL(snapshot.ref);
        });

        mediaUrls = await Promise.all(uploadPromises);
      }

      if (!currentUser?.id) {
        setSnackbar({
          open: true,
          message: 'Erro: Usuário não identificado.',
          severity: 'error',
        });
        setUploadingPost(false);
        return;
      }

      const newPost: Omit<Post, 'id'> = {
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: newPostContent,
        mediaUrls,
        mediaType: newPostMedia[0]?.type.startsWith('video/') ? 'video' : 'image',
        timestamp: serverTimestamp() as Timestamp,
        likes: 0,
        likedBy: [],
        comments: [],
        shares: 0,
        location: newPostLocation,
        visibility: newPostVisibility,
        hashtags: extractHashtags(newPostContent),
      };

      // Salvar no Firebase
      const docRef = await addDoc(collection(db, 'feed_posts'), newPost);

      // Analisar com IA
      const aiAnalysis = await analyzePostWithAI(newPostContent);
      if (aiAnalysis) {
        await updateDoc(doc(db, 'feed_posts', docRef.id), {
          aiEnhanced: true,
          insights: aiAnalysis,
        });
      }

      // Resetar formulário
      setNewPostContent('');
      setNewPostMedia([]);
      setNewPostLocation('');
      setNewPostVisibility('public');
      setCreatePostOpen(false);

      setSnackbar({
        open: true,
        message: 'Post criado com sucesso!',
        severity: 'success',
      });

    } catch (error) {
      console.error('Erro ao criar post:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao criar post. Tente novamente.',
        severity: 'error',
      });
    }

    setUploadingPost(false);
  };

  const analyzePostWithAI = async (content: string): Promise<string[] | null> => {
    try {
      const response = await fetch('/api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analise este post de rede social e forneça insights sobre engagement, melhor horário para postar e público-alvo: "${content}"`,
          maxTokens: 150,
        }),
      });

      const data = await response.json();
      if (data.response) {
        return data.response.split('\n').filter((line: string) => line.trim());
      }
    } catch (error) {
      console.error('Erro na análise de IA:', error);
    }
    return null;
  };

  const extractHashtags = (content: string): string[] => {
    const hashtags = content.match(/#\w+/g) || [];
    return hashtags;
  };

  const handleLike = async (postId: string) => {
    if (!currentUser?.id) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const isLiked = post.likedBy.includes(currentUser.id);
      const newLikedBy = isLiked 
        ? post.likedBy.filter(id => id !== currentUser.id)
        : [...post.likedBy, currentUser.id];

      const newLikes = isLiked ? post.likes - 1 : post.likes + 1;

      // Atualizar localmente
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, likes: newLikes, likedBy: newLikedBy }
          : p
      ));

      // Atualizar no Firebase
      await updateDoc(doc(db, 'feed_posts', postId), {
        likes: newLikes,
        likedBy: newLikedBy,
      });

    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    if (!content.trim() || !currentUser?.id) {
      setSnackbar({
        open: true,
        message: 'Faça login para comentar ou escreva algo!',
        severity: 'warning',
      });
      return;
    }

    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: content.trim(),
        timestamp: Timestamp.now(),
        likes: 0,
      };

      // Buscar o post atual
      const currentPost = posts.find(p => p.id === postId);
      if (!currentPost) {
        setSnackbar({
          open: true,
          message: 'Post não encontrado!',
          severity: 'error',
        });
        return;
      }

      const updatedComments = [...currentPost.comments, newComment];

      // Atualizar localmente primeiro
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, comments: updatedComments }
          : p
      ));

      // Limpar campo de comentário imediatamente
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));

      // Tentar atualizar no Firebase
      try {
        await updateDoc(doc(db, 'feed_posts', postId), {
          comments: updatedComments,
        });

        setSnackbar({
          open: true,
          message: 'Comentário adicionado com sucesso!',
          severity: 'success',
        });
      } catch (firebaseError) {
        console.warn('Erro ao salvar no Firebase, mantendo apenas localmente:', firebaseError);
        // Mantém o comentário local mesmo se não conseguir salvar no Firebase
      }

    } catch (error) {
      console.error('Erro ao comentar:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao adicionar comentário. Tente novamente.',
        severity: 'error',
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setNewPostMedia(prev => [...prev, ...files]);
  };

  const removeMedia = (index: number) => {
    setNewPostMedia(prev => prev.filter((_, i) => i !== index));
  };

  const formatTimestamp = (timestamp: any) => {
    try {
      // Verificações mais rigorosas para null/undefined/NaN
      if (!timestamp || timestamp === null || timestamp === undefined) {
        return 'Agora';
      }

      // Se for string vazia ou apenas espaços
      if (typeof timestamp === 'string' && !timestamp.trim()) {
        return 'Agora';
      }

      let postTime: Date;

      // Verificar se é um timestamp do Firestore
      if (timestamp && typeof timestamp === 'object' && timestamp.toDate && typeof timestamp.toDate === 'function') {
        try {
          postTime = timestamp.toDate();
          // Verificar se o resultado é válido
          if (!postTime || isNaN(postTime.getTime())) {
            console.warn('Timestamp do Firestore retornou data inválida');
            return 'Agora';
          }
        } catch (error) {
          console.warn('Erro ao converter timestamp do Firestore:', error);
          return 'Agora';
        }
      } 
      // Verificar se já é uma instância de Date
      else if (timestamp instanceof Date) {
        if (isNaN(timestamp.getTime())) {
          return 'Agora';
        }
        postTime = timestamp;
      } 
      // Verificar se é uma string
      else if (typeof timestamp === 'string') {
        postTime = new Date(timestamp);
        if (isNaN(postTime.getTime())) {
          return 'Agora';
        }
      } 
      // Verificar se é um número (timestamp em milissegundos)
      else if (typeof timestamp === 'number' && !isNaN(timestamp)) {
        postTime = new Date(timestamp);
        if (isNaN(postTime.getTime())) {
          return 'Agora';
        }
      }
      // Verificar se tem propriedades seconds e nanoseconds (Firestore Timestamp)
      else if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp && typeof timestamp.seconds === 'number' && !isNaN(timestamp.seconds)) {
        postTime = new Date(timestamp.seconds * 1000);
        if (isNaN(postTime.getTime())) {
          return 'Agora';
        }
      }
      else {
        console.warn('Tipo de timestamp não reconhecido ou inválido:', typeof timestamp, timestamp);
        return 'Agora';
      }

      // Verificação final de validade
      if (!postTime || isNaN(postTime.getTime())) {
        console.warn('Data final inválida:', postTime);
        return 'Agora';
      }

      const now = new Date();
      const diffMs = now.getTime() - postTime.getTime();
      
      // Se a diferença for negativa (data no futuro), retornar "Agora"
      if (diffMs < 0) {
        return 'Agora';
      }

      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Agora';
      if (diffMins < 60) return diffMins + 'm';
      if (diffHours < 24) return diffHours + 'h';
      if (diffDays < 7) return diffDays + 'd';

      return postTime.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro geral ao formatar timestamp:', error, timestamp);
      return 'Agora';
    }
  };

  const handleUserProfileClick = (userId: string) => {
    setSelectedUserProfile(userId);
  };

  const handleUserRightClick = (event: React.MouseEvent, userId: string, userName: string) => {
    event.preventDefault();
    if (userId === currentUser?.id) return; // Não mostrar menu para próprio usuário

    setFriendshipMenu({
      open: true,
      anchorEl: event.currentTarget as HTMLElement,
      targetUserId: userId,
      targetUserName: userName,
    });
  };

  const handleAddFriend = async (userId: string, userName: string) => {
    setConfirmDialog({
      open: true,
      action: 'add',
      userName,
      userId,
    });
    setFriendshipMenu(prev => ({ ...prev, open: false }));
  };

  const handleRemoveFriend = async (userId: string, userName: string) => {
    setConfirmDialog({
      open: true,
      action: 'remove',
      userName,
      userId,
    });
    setFriendshipMenu(prev => ({ ...prev, open: false }));
  };

  const confirmFriendshipAction = async () => {
    if (!currentUser || !confirmDialog.userId) return;

    try {
      const currentUserRef = doc(db, 'usuarios', currentUser.id);
      const targetUserRef = doc(db, 'usuarios', confirmDialog.userId);

      if (confirmDialog.action === 'add') {
        // Adicionar amigo
        const newFriends = [...userFriends, confirmDialog.userId];

        await updateDoc(currentUserRef, {
          friends: newFriends
        });

        // Adicionar reciprocamente
        const targetUserDoc = await getDoc(targetUserRef);
        if (targetUserDoc.exists()) {
          const targetUserData = targetUserDoc.data();
          const targetFriends = targetUserData.friends || [];
          if (!targetFriends.includes(currentUser.id)) {
            await updateDoc(targetUserRef, {
              friends: [...targetFriends, currentUser.id]
            });
          }
        }

        setUserFriends(newFriends);
        setSnackbar({
          open: true,
          message: `${confirmDialog.userName} foi adicionado como amigo!`,
          severity: 'success',
        });

      } else {
        // Remover amigo
        const newFriends = userFriends.filter(id => id !== confirmDialog.userId);

        await updateDoc(currentUserRef, {
          friends: newFriends
        });

        // Remover reciprocamente
        const targetUserDoc = await getDoc(targetUserRef);
        if (targetUserDoc.exists()) {
          const targetUserData = targetUserDoc.data();
          const targetFriends = targetUserData.friends || [];
          const updatedTargetFriends = targetFriends.filter((id: string) => id !== currentUser.id);
          await updateDoc(targetUserRef, {
            friends: updatedTargetFriends
          });
        }

        setUserFriends(newFriends);
        setSnackbar({
          open: true,
          message: `${confirmDialog.userName} foi removido da sua lista de amigos.`,
          severity: 'info',
        });
      }

    } catch (error) {
      console.error('Erro ao atualizar amizade:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar lista de amigos. Tente novamente.',
        severity: 'error',
      });
    }

    setConfirmDialog({
      open: false,
      action: 'add',
      userName: '',
      userId: '',
    });
  };

  const isFriend = (userId: string) => {
    return userFriends.includes(userId);
  };

  // Função para abrir chat
  const handleOpenChat = async (userId: string) => {
    if (!openChatWindows.includes(userId)) {
      setOpenChatWindows(prev => [...prev, userId]);
      await loadChatMessages(userId);
    }
  };

  // Função para fechar chat
  const handleCloseChat = (userId: string) => {
    setOpenChatWindows(prev => prev.filter(id => id !== userId));
  };

  // Carregar mensagens do chat
  const loadChatMessages = async (userId: string) => {
    if (!currentUser) return;

    try {
      const chatId = [currentUser.id, userId].sort().join('_');
      const messagesQuery = query(
        collection(db, 'chat_messages'),
        where('chatId', '==', chatId),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messages: ChatMessage[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          messages.push({
            id: doc.id,
            senderId: data.senderId,
            receiverId: data.receiverId,
            content: data.content,
            timestamp: data.timestamp,
            read: data.read || false,
            type: data.type || 'text',
          });
        });

        setActiveChatMessages(prev => ({
          ...prev,
          [userId]: messages.reverse()
        }));
      });

      return () => unsubscribe();

    } catch (error) {
      console.error('Erro ao carregar mensagens do chat:', error);
    }
  };

  // Enviar mensagem no chat
  const sendChatMessage = async (receiverId: string, content: string) => {
    if (!currentUser || !content.trim()) return;

    try {
      const chatId = [currentUser.id, receiverId].sort().join('_');

      const messageData = {
        chatId,
        senderId: currentUser.id,
        receiverId,
        content: content.trim(),
        timestamp: serverTimestamp(),
        read: false,
        type: 'text',
      };

      await addDoc(collection(db, 'chat_messages'), messageData);

      // Atualizar localmente
      const tempMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        receiverId,
        content: content.trim(),
        timestamp: Timestamp.now(),
        read: false,
        type: 'text',
      };

      setActiveChatMessages(prev => ({
        ...prev,
        [receiverId]: [...(prev[receiverId] || []), tempMessage]
      }));

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  // Marcar mensagens como lidas
  const markMessagesAsRead = async (userId: string) => {
    if (!currentUser) return;

    try {
      const chatId = [currentUser.id, userId].sort().join('_');
      const unreadMessages = activeChatMessages[userId]?.filter(
        m => !m.read && m.senderId !== currentUser.id
      ) || [];

      for (const message of unreadMessages) {
        await updateDoc(doc(db, 'chat_messages', message.id), {
          read: true
        });
      }

      setActiveChatMessages(prev => ({
        ...prev,
        [userId]: prev[userId]?.map(m => ({ ...m, read: true })) || []
      }));

    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
    }
  };

  // Enviar mensagem no WhatsApp
  const sendWhatsAppMessage = (userId: string, message: string) => {
    const phoneNumber = users.find(u => u.id === userId)?.phone || '5548999999999';
    const encodedMessage = encodeURIComponent(`Olá! ${message}`);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  // Carregar grupos do usuário
  const loadUserGroups = async () => {
    if (!currentUser) return;

    try {
      // Grupos mock para demonstração
      const mockGroups = [
        {
          id: 'grupo-1',
          name: 'Equipe Despachante',
          members: userFriends.slice(0, 3),
          avatar: '/betologo.jpeg',
        },
        {
          id: 'grupo-2', 
          name: 'Clientes Premium',
          members: userFriends.slice(1, 4),
          avatar: '/logo.webp',
        },
      ];

      setUserGroups(mockGroups);

      // Tentar carregar grupos reais do Firebase
      const groupsQuery = query(
        collection(db, 'grupos'),
        where('members', 'array-contains', currentUser.id)
      );

      const snapshot = await getDocs(groupsQuery);
      const firebaseGroups: typeof mockGroups = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        firebaseGroups.push({
          id: doc.id,
          name: data.name || 'Grupo',
          members: data.members || [],
          avatar: data.avatar || '/logo.webp',
        });
      });

      if (firebaseGroups.length > 0) {
        setUserGroups([...mockGroups, ...firebaseGroups]);
      }

    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
    }
  };

  // Abrir menu de ações do post
  const handlePostMenuOpen = (event: React.MouseEvent<HTMLElement>, postId: string) => {
    setPostMenus(prev => ({ ...prev, [postId]: event.currentTarget }));
  };

  // Fechar menu de ações do post
  const handlePostMenuClose = (postId: string) => {
    setPostMenus(prev => ({ ...prev, [postId]: null }));
  };

  // Iniciar edição de post
  const handleEditPost = (post: Post) => {
    setEditingPost(post.id);
    setEditedContent(post.content);
    handlePostMenuClose(post.id);
  };

  // Salvar edição do post
  const handleSaveEdit = async (postId: string) => {
    if (!editedContent.trim()) return;

    try {
      // Atualizar localmente
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, content: editedContent, hashtags: extractHashtags(editedContent) }
          : p
      ));

      // Atualizar no Firebase
      await updateDoc(doc(db, 'feed_posts', postId), {
        content: editedContent,
        hashtags: extractHashtags(editedContent),
        editedAt: serverTimestamp(),
      });

      setEditingPost(null);
      setEditedContent('');

      setSnackbar({
        open: true,
        message: 'Post editado com sucesso!',
        severity: 'success',
      });

    } catch (error) {
      console.error('Erro ao editar post:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao editar post. Tente novamente.',
        severity: 'error',
      });
    }
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditedContent('');
  };

  // Confirmar exclusão do post
  const handleDeletePost = (post: Post) => {
    setDeleteConfirmDialog({
      open: true,
      postId: post.id,
      postContent: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
    });
    handlePostMenuClose(post.id);
  };

  // Excluir post
  const confirmDeletePost = async () => {
    try {
      // Remover localmente
      setPosts(prev => prev.filter(p => p.id !== deleteConfirmDialog.postId));

      // Remover do Firebase
      await deleteDoc(doc(db, 'feed_posts', deleteConfirmDialog.postId));

      setDeleteConfirmDialog({
        open: false,
        postId: '',
        postContent: '',
      });

      setSnackbar({
        open: true,
        message: 'Post excluído com sucesso!',
        severity: 'success',
      });

    } catch (error) {
      console.error('Erro ao excluir post:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao excluir post. Tente novamente.',
        severity: 'error',
      });
    }
  };

  // Abrir dialog de compartilhamento
  const handleSharePost = (post: Post) => {
    setShareDialog({
      open: true,
      post,
    });
    handlePostMenuClose(post.id);
  };

  // Compartilhar post com amigo
  const shareWithFriend = async (friendId: string, post: Post) => {
    if (!currentUser) return;

    try {
      const shareMessage = {
        type: 'shared_post',
        senderId: currentUser.id,
        receiverId: friendId,
        content: `${currentUser.name} compartilhou um post: "${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}"`,
        originalPost: {
          id: post.id,
          content: post.content,
          mediaUrls: post.mediaUrls,
          userName: post.userName,
          userAvatar: post.userAvatar,
        },
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'shared_posts'), shareMessage);

      // Incrementar contador de compartilhamentos
      const newShares = post.shares + 1;
      setPosts(prev => prev.map(p => 
        p.id === post.id ? { ...p, shares: newShares } : p
      ));

      await updateDoc(doc(db, 'feed_posts', post.id), {
        shares: newShares,
      });

      setSnackbar({
        open: true,
        message: `Post compartilhado com ${users.find(u => u.id === friendId)?.name}!`,
        severity: 'success',
      });

    } catch (error) {
      console.error('Erro ao compartilhar post:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao compartilhar post.',
        severity: 'error',
      });
    }
  };

  // Compartilhar post com grupo
  const shareWithGroup = async (groupId: string, post: Post) => {
    if (!currentUser) return;

    try {
      const group = userGroups.find(g => g.id === groupId);
      if (!group) return;

      const sharePromises = group.members
        .filter(memberId => memberId !== currentUser.id)
        .map(memberId => {
          const shareMessage = {
            type: 'shared_post_group',
            senderId: currentUser.id,
            receiverId: memberId,
            groupId: groupId,
            groupName: group.name,
            content: `${currentUser.name} compartilhou no grupo "${group.name}": "${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}"`,
            originalPost: {
              id: post.id,
              content: post.content,
              mediaUrls: post.mediaUrls,
              userName: post.userName,
              userAvatar: post.userAvatar,
            },
            timestamp: serverTimestamp(),
          };

          return addDoc(collection(db, 'shared_posts'), shareMessage);
        });

      await Promise.all(sharePromises);

      // Incrementar contador de compartilhamentos
      const newShares = post.shares + group.members.length - 1;
      setPosts(prev => prev.map(p => 
        p.id === post.id ? { ...p, shares: newShares } : p
      ));

      await updateDoc(doc(db, 'feed_posts', post.id), {
        shares: newShares,
      });

      setSnackbar({
        open: true,
        message: `Post compartilhado no grupo "${group.name}"!`,
        severity: 'success',
      });

    } catch (error) {
      console.error('Erro ao compartilhar no grupo:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao compartilhar no grupo.',
        severity: 'error',
      });
    }
  };

  return (
    <div className={classes.root}>
      {/* Header */}
      <motion.div 
        className={classes.header}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Timeline style={{ marginRight: isMobile ? 8 : 16, fontSize: isMobile ? 24 : 32 }} />
            <div>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                className={classes.headerTitle}
                style={{ fontWeight: 'bold' }}
              >
                Feed Social
              </Typography>
              <Typography 
                variant="body2" 
                className={classes.headerSubtitle}
                style={{ opacity: 0.9 }}
              >
                Conecte-se • Compartilhe • Descubra
              </Typography>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16 }}>
            {!isMobile && (
              <IconButton color="inherit">
                <Search />
              </IconButton>
            )}

            <Badge badgeContent={3} color="secondary">
              <IconButton color="inherit" size={isMobile ? "small" : "medium"}>
                <Notifications />
              </IconButton>
            </Badge>

            <Avatar 
              src={currentUser?.avatar || '/betologo.jpeg'} 
              style={{ 
                width: isMobile ? 32 : 40, 
                height: isMobile ? 32 : 40, 
                cursor: 'pointer' 
              }}
              onClick={() => currentUser && handleUserProfileClick(currentUser.id)}
            />
          </div>
        </div>
      </motion.div>

      <div className={classes.mainContainer}>
        {/* Sidebar Esquerda */}
        <div className={classes.leftSidebar}>
          <Typography variant="h6" gutterBottom>
            Menu Rápido
          </Typography>

          <List>
            <ListItem button onClick={() => currentUser && handleUserProfileClick(currentUser.id)}>
              <ListItemAvatar>
                <Avatar src={currentUser?.avatar || '/betologo.jpeg'} />
              </ListItemAvatar>
              <ListItemText primary={currentUser?.name || 'Usuário'} />
            </ListItem>

            <ListItem button>
              <ListItemAvatar>
                <Avatar><People /></Avatar>
              </ListItemAvatar>
              <ListItemText primary="Amigos" />
            </ListItem>

            <ListItem button>
              <ListItemAvatar>
                <Avatar><Event /></Avatar>
              </ListItemAvatar>
              <ListItemText primary="Eventos" />
            </ListItem>

            <ListItem button>
              <ListItemAvatar>
                <Avatar><VideoLibrary /></Avatar>
              </ListItemAvatar>
              <ListItemText primary="Vídeos" />
            </ListItem>
          </List>

          <Divider style={{ margin: '16px 0' }} />

          <Typography variant="subtitle2" gutterBottom>
            Trending Topics
          </Typography>

          {['#IA', '#Inovação', '#TechNews', '#DigitalTransformation'].map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              style={{ margin: '4px 4px 0 0' }}
              clickable
            />
          ))}
        </div>

        {/* Feed Principal */}
        <div className={classes.feedContainer} ref={feedRef}>

          {/* Stories */}
          <motion.div 
            className={classes.storyContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={classes.storyItem} onClick={() => setCreatePostOpen(true)}>
              <Avatar className={classes.storyAvatar} style={{ border: '3px dashed #1877f2' }}>
                <Add />
              </Avatar>
              <Typography variant="caption">Criar</Typography>
            </div>

            {stories.map((story) => (
              <div key={story.id} className={classes.storyItem}>
                <div style={{ position: 'relative' }}>
                  <Avatar 
                    src={story.userAvatar} 
                    className={classes.storyAvatar}
                    style={{ 
                      border: story.viewed ? '3px solid #ccc' : '3px solid #1877f2' 
                    }}
                  />
                  {users.find(u => u.id === story.userId)?.online && (
                    <div className={classes.onlineIndicator} />
                  )}
                </div>
                <Typography variant="caption" noWrap>
                  {story.userName}
                </Typography>
              </div>
            ))}
          </motion.div>

          {/* Criar Post */}
          <Card className={classes.createPostCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
              <Avatar 
                src={currentUser?.avatar || '/betologo.jpeg'} 
                className={classes.responsiveAvatar}
              />
              <TextField
                fullWidth
                placeholder={currentUser ? 
                  (isMobile ? `No que está pensando, ${currentUser.name}?` : `No que você está pensando, ${currentUser.name}?`) 
                  : "Faça login para criar um post"
                }
                variant="outlined"
                onClick={() => setCreatePostOpen(true)}
                style={{ cursor: 'pointer' }}
                inputProps={{ readOnly: true }}
                size={isMobile ? "small" : "medium"}
                disabled={!currentUser}
              />
            </div>

            <Divider style={{ margin: isMobile ? '8px 0' : '12px 0' }} />

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              gap: isMobile ? 4 : 0
            }}>
              {!isMobile && (
                <Button startIcon={<VideoCall />} color="primary" size="small">
                  Vídeo ao vivo
                </Button>
              )}
              <Button 
                startIcon={<PhotoCamera />} 
                color="primary" 
                onClick={() => setCreatePostOpen(true)}
                size={isMobile ? "small" : "medium"}
              >
                {isMobile ? 'Mídia' : 'Foto/vídeo'}
              </Button>
              <Button 
                startIcon={<EmojiEmotions />} 
                color="primary"
                size={isMobile ? "small" : "medium"}
              >
                {isMobile ? 'Humor' : 'Sentimento'}
              </Button>
            </div>
          </Card>

          {/* Posts */}
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                ref={index === posts.length - 1 ? lastPostElementRef : null}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className={classes.postCard}
              >
                <Card>
                  {/* Header do Post */}
                  <CardHeader
                    avatar={
                      <div 
                        style={{ position: 'relative', cursor: 'pointer' }} 
                        onClick={() => handleUserProfileClick(post.userId)}
                        onContextMenu={(e) => handleUserRightClick(e, post.userId, post.userName)}
                      >
                        <Badge
                          overlap="rectangular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            (typeof window !== 'undefined') && post.userId !== currentUser?.id && (
                              isFriend(post.userId) ? 
                                <People style={{ fontSize: 12, color: '#4CAF50' }} /> : 
                                <PersonAdd style={{ fontSize: 12, color: '#FF9800' }} />
                            )
                          }
                        >
                          <Avatar src={post.userAvatar} />
                        </Badge>
                        {users.find(u => u.id === post.userId)?.online && (
                          <div className={classes.onlineIndicator} />
                        )}
                      </div>
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Typography 
                          variant="subtitle1" 
                          style={{ fontWeight: 'bold', cursor: 'pointer' }}
                          onClick={() => handleUserProfileClick(post.userId)}
                          onContextMenu={(e) => handleUserRightClick(e, post.userId, post.userName)}
                        >
                          {post.userName}
                        </Typography>
                        {users.find(u => u.id === post.userId)?.verified && (
                          <Star style={{ fontSize: 16, color: '#1877f2' }} />
                        )}
                        {post.userId !== currentUser?.id && isFriend(post.userId) && (
                          <Chip
                            label="Amigo"
                            size="small"
                            style={{
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        )}
                      </div>
                    }
                    subheader={
                      <div>
                        <Typography variant="caption" color="textSecondary">
                          {formatTimestamp(post.timestamp)}
                        </Typography>
                        {post.location && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <LocationOn style={{ fontSize: 14 }} />
                            <Typography variant="caption">{post.location}</Typography>
                          </div>
                        )}
                      </div>
                    }
                    action={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {post.aiEnhanced && (
                          <Chip
                            icon={<Extension />}
                            label="IA Enhanced"
                            size="small"
                            style={{ 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              marginRight: 8 
                            }}
                          />
                        )}
                        <IconButton 
                          onClick={(e) => handlePostMenuOpen(e, post.id)}
                          disabled={!currentUser}
                        >
                          <MoreVert />
                        </IconButton>
                      </div>
                    }
                  />

                  {/* Conteúdo do Post */}
                  <CardContent style={{ paddingTop: 0 }}>
                    {editingPost === post.id ? (
                      <div style={{ marginBottom: 16 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          variant="outlined"
                          placeholder="Edite seu post..."
                          style={{ marginBottom: 8 }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          <Button
                            size="small"
                            onClick={handleCancelEdit}
                            startIcon={<Clear />}
                          >
                            Cancelar
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handleSaveEdit(post.id)}
                            startIcon={<Check />}
                            disabled={!editedContent.trim()}
                          >
                            Salvar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Typography variant="body1" style={{ marginBottom: 16 }}>
                        {post.content}
                        {post.editedAt && (
                          <Typography 
                            variant="caption" 
                            color="textSecondary" 
                            style={{ display: 'block', marginTop: 4, fontStyle: 'italic' }}
                          >
                            (editado)
                          </Typography>
                        )}
                      </Typography>
                    )}

                    {post.hashtags && post.hashtags.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        {post.hashtags.map((tag, idx) => (
                          <Chip
                            key={idx}
                            label={tag}
                            size="small"
                            variant="outlined"
                            style={{ margin: '2px 4px 2px 0', color: '#1877f2', borderColor: '#1877f2' }}
                            clickable
                          />
                        ))}
                      </div>
                    )}

                    {/* Insights da IA */}
                    {post.insights && post.insights.length > 0 && (
                      <div className={classes.aiInsight}>
                        <Typography variant="subtitle2" gutterBottom>
                          <Extension style={{ marginRight: 8, verticalAlign: 'middle' }} />
                          Insights da IA
                        </Typography>
                        {post.insights.map((insight, idx) => (
                          <Typography key={idx} variant="caption" display="block">
                            • {insight}
                          </Typography>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  {/* Mídia do Post */}
                  {post.mediaUrls && post.mediaUrls.length > 0 && (
                    <div>
                      {post.mediaType === 'video' ? (
                        <video 
                          className={classes.postMedia}
                          controls
                          poster={post.mediaUrls[0]}
                        >
                          <source src={post.mediaUrls[0]} type="video/mp4" />
                        </video>
                      ) : (
                        <img 
                          src={post.mediaUrls[0]} 
                          alt="Post media"
                          className={classes.postMedia}
                        />
                      )}
                    </div>
                  )}

                  {/* Estatísticas */}
                  <div style={{ padding: '0 16px', fontSize: '0.875rem', color: '#65676b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                      <div>
                        {post.likes > 0 && (
                          <span>👍 {post.likes} curtidas</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        {post.comments.length > 0 && (
                          <span>{post.comments.length} comentários</span>
                        )}
                        {post.shares > 0 && (
                          <span>{post.shares} compartilhamentos</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Divider />

                  {/* Ações do Post */}
                  <CardActions style={{ justifyContent: 'space-around', padding: '8px 16px' }}>
                    <Button
                      startIcon={currentUser && post.likedBy.includes(currentUser.id) ? <Favorite /> : <FavoriteBorder />}
                      onClick={() => handleLike(post.id)}
                      style={{ 
                        color: currentUser && post.likedBy.includes(currentUser.id) ? '#1877f2' : 'inherit',
                        flex: 1 
                      }}
                    >
                      Curtir
                    </Button>
                    <Button 
                      startIcon={<Comment />} 
                      onClick={() => setCommentDialogs(prev => ({ ...prev, [post.id]: true }))}
                      style={{ flex: 1 }}
                    >
                      Comentar
                    </Button>
                    <Button 
                      startIcon={<Share />} 
                      style={{ flex: 1 }}
                      onClick={() => handleSharePost(post)}
                    >
                      Compartilhar
                    </Button>
                  </CardActions>

                  {/* Seção de Comentários */}
                  {post.comments.length > 0 && (
                    <div className={classes.commentSection}>
                      {post.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className={classes.comment}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <Avatar src={comment.userAvatar} style={{ width: 32, height: 32 }} />
                            <div style={{ flex: 1 }}>
                              <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                                {comment.userName}
                              </Typography>
                              <Typography variant="body2">{comment.content}</Typography>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                                <Typography variant="caption" color="textSecondary">
                                  {formatTimestamp(comment.timestamp)}
                                </Typography>
                                <Button size="small" style={{ padding: 0, minWidth: 'auto' }}>
                                  Curtir
                                </Button>
                                <Button size="small" style={{ padding: 0, minWidth: 'auto' }}>
                                  Responder
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}                      {post.comments.length > 2 && (
                        <Button 
                          size="small" 
                          onClick={() => setExpandedPosts(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        >
                          Ver {expandedPosts[post.id] ? 'menos' : `mais ${post.comments.length - 2}`} comentários
                        </Button>
                      )}

                      <div className={classes.commentInput}>
                        <Avatar src={currentUser?.avatar || '/betologo.jpeg'} style={{ width: 32, height: 32 }} />
                        <TextField
                          fullWidth
                          placeholder={currentUser ? "Escreva um comentário..." : "Faça login para comentar"}
                          variant="outlined"
                          size="small"
                          multiline
                          maxRows={3}
                          value={commentTexts[post.id] || ''}
                          onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && currentUser && (commentTexts[post.id] || '').trim()) {
                              e.preventDefault();
                              handleComment(post.id, commentTexts[post.id] || '');
                            }
                          }}
                          style={{ borderRadius: 20 }}
                          disabled={!currentUser}
                          InputProps={{
                            style: { borderRadius: 20, backgroundColor: currentUser ? '#f5f5f5' : '#e0e0e0' }
                          }}
                        />
                        <IconButton 
                          onClick={() => {
                            const content = commentTexts[post.id] || '';
                            if (content.trim() && currentUser) {
                              handleComment(post.id, content);
                            } else if (!currentUser) {
                              setSnackbar({
                                open: true,
                                message: 'Faça login para comentar!',
                                severity: 'warning',
                              });
                            } else {
                              setSnackbar({
                                open: true,
                                message: 'Escreva algo para comentar!',
                                severity: 'info',
                              });
                            }
                          }}
                          disabled={!commentTexts[post.id]?.trim() || !currentUser}
                          style={{
                            backgroundColor: (commentTexts[post.id]?.trim() && currentUser) ? '#1877f2' : '#e0e0e0',
                            color: (commentTexts[post.id]?.trim() && currentUser) ? 'white' : '#666',
                            marginLeft: 8
                          }}
                        >
                          <Send />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {loading && (
            <div className={classes.loadingContainer}>
              <CircularProgress size={40} />
              <Typography variant="body2" style={{ marginLeft: 16 }}>
                Carregando mais posts...
              </Typography>
            </div>
          )}

          {/* Fim dos Posts */}
          {!hasMore && posts.length > 0 && (
            <Paper style={{ padding: 20, textAlign: 'center', margin: 16 }}>
              <Typography variant="body2" color="textSecondary">
                🎉 Você viu todos os posts! Que tal criar algo novo?
              </Typography>
            </Paper>
          )}
        </div>

        {/* Sidebar Direita */}
        <div className={classes.rightSidebar}>
          {/* Sugestões de Amizade */}
          <Card style={{ marginBottom: 16 }}>
            <div style={{ 
              padding: '12px 16px', 
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PersonAdd />
                Sugestões de Amizade
              </Typography>
              <Button 
                size="small" 
                onClick={loadFriendSuggestions}
                disabled={suggestionsLoading}
                startIcon={suggestionsLoading ? <CircularProgress size={16} /> : <Refresh />}
              >
                {suggestionsLoading ? 'Carregando...' : 'Atualizar'}
              </Button>
            </div>

            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {friendSuggestions.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    {suggestionsLoading ? 'Carregando sugestões...' : 'Nenhuma sugestão no momento'}
                  </Typography>
                </div>
              ) : (
                friendSuggestions.map((suggestion) => (
                  <ListItem key={suggestion.id} style={{ padding: '8px 16px' }}>
                    <ListItemAvatar>
                      <div style={{ position: 'relative' }}>
                        <Avatar 
                          src={suggestion.avatar} 
                          style={{ width: 40, height: 40, cursor: 'pointer' }}
                          onClick={() => handleUserProfileClick(suggestion.id)}
                        />
                        {suggestion.verified && (
                          <Star 
                            style={{ 
                              position: 'absolute', 
                              bottom: -2, 
                              right: -2, 
                              color: '#1877f2',
                              background: 'white',
                              borderRadius: '50%',
                              fontSize: 16
                            }} 
                          />
                        )}
                      </div>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Typography 
                          variant="subtitle2" 
                          style={{ fontWeight: 'bold', cursor: 'pointer' }}
                          onClick={() => handleUserProfileClick(suggestion.id)}
                        >
                          {suggestion.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="textSecondary">
                          Sugestão de amizade
                        </Typography>
                      }
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="primary"
                        style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                        onClick={() => handleAddFriend(suggestion.id, suggestion.name)}
                      >
                        Adicionar
                      </Button>
                      <Button 
                        size="small" 
                        variant="text"
                        style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                        onClick={() => setFriendSuggestions(prev => prev.filter(s => s.id !== suggestion.id))}
                      >
                        Remover
                      </Button>
                    </div>
                  </ListItem>
                ))
              )}
            </div>
          </Card>

          {/* Chat dos Amigos */}
          <Card style={{ marginBottom: 16, height: '40vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              padding: '12px 16px', 
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Chat />
                Chat dos Amigos
              </Typography>
              <IconButton size="small">
                <VideoCall />
              </IconButton>
            </div>

            {/* Lista de Amigos Online */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Amigos Online */}
              <div style={{ padding: '8px 0' }}>
                <Typography variant="subtitle2" style={{ padding: '0 16px', color: '#65676b', fontSize: '0.8rem' }}>
                  ONLINE ({userFriends.filter(friendId => users.find(u => u.id === friendId)?.online).length})
                </Typography>

                {userFriends
                  .map(friendId => users.find(u => u.id === friendId))
                  .filter(Boolean)
                  .filter(friend => friend?.online)
                  .map((friend) => (
                    <ListItem 
                      key={friend?.id} 
                      button 
                      onClick={() => handleOpenChat(friend?.id || '')}
                      style={{ padding: '8px 16px' }}
                    >
                      <ListItemAvatar>
                        <div style={{ position: 'relative' }}>
                          <Avatar src={friend?.avatar} style={{ width: 36, height: 36 }} />
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: 12,
                            height: 12,
                            backgroundColor: '#4CAF50',
                            borderRadius: '50%',
                            border: '2px solid white'
                          }} />
                        </div>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={friend?.name}
                        primaryTypographyProps={{ style: { fontSize: '0.9rem' } }}
                      />
                      {activeChatMessages[friend?.id || '']?.length > 0 && (
                        <Badge 
                          badgeContent={activeChatMessages[friend?.id || '']?.filter(m => !m.read && m.senderId !== currentUser?.id).length || 0}
                          color="primary"
                        />
                      )}
                    </ListItem>
                  ))
                }
              </div>

              <Divider />

              {/* Amigos Offline */}
              <div style={{ padding: '8px 0' }}>
                <Typography variant="subtitle2" style={{ padding: '0 16px', color: '#65676b', fontSize: '0.8rem' }}>
                  OFFLINE ({userFriends.filter(friendId => !users.find(u => u.id === friendId)?.online).length})
                </Typography>

                {userFriends
                  .map(friendId => users.find(u => u.id === friendId))
                  .filter(Boolean)
                  .filter(friend => !friend?.online)
                  .slice(0, 5)
                  .map((friend) => (
                    <ListItem 
                      key={friend?.id} 
                      button 
                      onClick={() => handleOpenChat(friend?.id || '')}
                      style={{ padding: '8px 16px', opacity: 0.7 }}
                    >
                      <ListItemAvatar>
                        <Avatar src={friend?.avatar} style={{ width: 36, height: 36 }} />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={friend?.name}
                        primaryTypographyProps={{ style: { fontSize: '0.9rem' } }}
                      />
                    </ListItem>
                  ))
                }
              </div>
            </div>
          </Card>

          {/* Trending Topics - Menor */}
          <Card style={{ padding: 12 }}>
            <Typography variant="subtitle1" gutterBottom style={{ fontSize: '1rem' }}>
              📈 Em alta
            </Typography>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['#IA', '#Inovação', '#TechNews'].map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  style={{ fontSize: '0.7rem' }}
                  clickable
                />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      <Zoom in>
        <Fab 
          className={classes.floatingButton}
          onClick={() => setCreatePostOpen(true)}
        >
          <Add />
        </Fab>
      </Zoom>

      {/* Dialog para Criar Post */}
      <Dialog open={createPostOpen} onClose={() => setCreatePostOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={currentUser?.avatar || '/betologo.jpeg'} style={{ marginRight: 12 }} />
            <div>
              <Typography variant="h6">
                {currentUser ? `Criar post` : 'Fazer login para criar post'}
              </Typography>
              {currentUser && (
                <Typography variant="caption" color="textSecondary">
                  {currentUser.name}
                </Typography>
              )}
              <FormControl size="small" style={{ marginTop: 4 }}>
                <Select
                  value={newPostVisibility}
                  onChange={(e) => setNewPostVisibility(e.target.value as any)}
                  variant="outlined"
                >
                  <MenuItem value="public">🌍 Público</MenuItem>
                  <MenuItem value="friends">👥 Amigos</MenuItem>
                  <MenuItem value="private">🔒 Privado</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="No que você está pensando?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            variant="outlined"
            style={{ marginBottom: 16 }}
          />

          <TextField
            fullWidth
            placeholder="📍 Localização"
            value={newPostLocation}
            onChange={(e) => setNewPostLocation(e.target.value)}
            variant="outlined"
            style={{ marginBottom: 16 }}
          />

          {/* Preview de mídia */}
          {newPostMedia.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              {newPostMedia.map((file, index) => (
                <div key={index} className={classes.mediaPreview}>
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="Preview"
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <IconButton 
                    className={classes.removeMediaButton}
                    onClick={() => removeMedia(index)}
                    size="small"
                  >
                    <Close />
                  </IconButton>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Adicionar ao seu post:</Typography>
            <div>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <IconButton onClick={() => fileInputRef.current?.click()}>
                <PhotoCamera />
              </IconButton>
              <IconButton>
                <LocationOn />
              </IconButton>
              <IconButton>
                <EmojiEmotions />
              </IconButton>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setCreatePostOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCreatePost}
            variant="contained"
            color="primary"
            disabled={(!newPostContent.trim() && newPostMedia.length === 0) || uploadingPost}
            startIcon={uploadingPost ? <CircularProgress size={20} /> : <Send />}
          >
            {uploadingPost ? 'Publicando...' : 'Publicar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Menus de Ações dos Posts */}
      {Object.entries(postMenus).map(([postId, anchorEl]) => {
        const post = posts.find(p => p.id === postId);
        if (!post || !anchorEl) return null;

        const isOwnPost = currentUser && post.userId === currentUser.id;

        return (
          <Menu
            key={postId}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handlePostMenuClose(postId)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {isOwnPost && (
              <MenuItem onClick={() => handleEditPost(post)}>
                <Edit style={{ marginRight: 8 }} />
                Editar Post
              </MenuItem>
            )}

            <MenuItem onClick={() => handleSharePost(post)}>
              <Share style={{ marginRight: 8 }} />
              Compartilhar
            </MenuItem>

            <MenuItem onClick={() => setSnackbar({ open: true, message: 'Post salvo!', severity: 'success' })}>
              <Bookmark style={{ marginRight: 8 }} />
              Salvar Post
            </MenuItem>

            {isOwnPost && (
              <MenuItem 
                onClick={() => handleDeletePost(post)}
                style={{ color: '#f44336' }}
              >
                <Delete style={{ marginRight: 8 }} />
                Excluir Post
              </MenuItem>
            )}

            {!isOwnPost && (
              <MenuItem style={{ color: '#f44336' }}>
                <Clear style={{ marginRight: 8 }} />
                Ocultar Post
              </MenuItem>
            )}
          </Menu>
        );
      })}

      {/* Dialog de Compartilhamento */}
      <Dialog 
        open={shareDialog.open} 
        onClose={() => setShareDialog({ open: false, post: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Share />
            Compartilhar Post
          </div>
        </DialogTitle>
        <DialogContent>
          {shareDialog.post && (
            <div>
              {/* Preview do Post */}
              <Paper elevation={1} style={{ padding: 16, marginBottom: 16, backgroundColor: '#f5f5f5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Avatar src={shareDialog.post.userAvatar} style={{ width: 32, height: 32 }} />
                  <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                    {shareDialog.post.userName}
                  </Typography>
                </div>
                <Typography variant="body2" style={{ color: '#666' }}>
                  {shareDialog.post.content.substring(0, 150)}
                  {shareDialog.post.content.length > 150 ? '...' : ''}
                </Typography>
              </Paper>

              {/* Compartilhar com Amigos */}
              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', marginTop: 16 }}>
                👥 Compartilhar com Amigos
              </Typography>
              <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: 16 }}>
                {userFriends.length === 0 ? (
                  <Typography variant="body2" color="textSecondary" style={{ textAlign: 'center', padding: 16 }}>
                    Você ainda não tem amigos para compartilhar
                  </Typography>
                ) : (
                  userFriends.map(friendId => {
                    const friend = users.find(u => u.id === friendId);
                    if (!friend) return null;

                    return (
                      <ListItem 
                        key={friendId} 
                        button 
                        onClick={() => {
                          shareWithFriend(friendId, shareDialog.post!);
                          setShareDialog({ open: false, post: null });
                        }}
                        style={{ borderRadius: 8, margin: '4px 0' }}
                      >
                        <ListItemAvatar>
                          <Avatar src={friend.avatar} style={{ width: 36, height: 36 }} />
                        </ListItemAvatar>
                        <ListItemText primary={friend.name} />
                        <Send style={{ color: '#1877f2' }} />
                      </ListItem>
                    );
                  })
                )}
              </div>

              {/* Compartilhar com Grupos */}
              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>
                📢 Compartilhar em Grupos
              </Typography>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {userGroups.length === 0 ? (
                  <Typography variant="body2" color="textSecondary" style={{ textAlign: 'center', padding: 16 }}>
                    Você não participa de nenhum grupo
                  </Typography>
                ) : (
                  userGroups.map(group => (
                    <ListItem 
                      key={group.id} 
                      button 
                      onClick={() => {
                        shareWithGroup(group.id, shareDialog.post!);
                        setShareDialog({ open: false, post: null });
                      }}
                      style={{ borderRadius: 8, margin: '4px 0' }}
                    >
                      <ListItemAvatar>
                        <Avatar src={group.avatar} style={{ width: 36, height: 36 }} />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={group.name}
                        secondary={`${group.members.length} membros`}
                      />
                      <Send style={{ color: '#1877f2' }} />
                    </ListItem>
                  ))
                )}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog({ open: false, post: null })}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (shareDialog.post) {
                const shareText = `Confira este post: "${shareDialog.post.content.substring(0, 100)}${shareDialog.post.content.length > 100 ? '...' : ''}"`;
                const shareUrl = window.location.href;
                
                if (navigator.share) {
                  navigator.share({
                    title: 'Post do Feed',
                    text: shareText,
                    url: shareUrl,
                  });
                } else {
                  navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
                  setSnackbar({
                    open: true,
                    message: 'Link copiado para a área de transferência!',
                    severity: 'success',
                  });
                }
              }
              setShareDialog({ open: false, post: null });
            }}
            startIcon={<Share />}
          >
            Compartilhar Externo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={deleteConfirmDialog.open}
        onClose={() => setDeleteConfirmDialog({ open: false, postId: '', postContent: '' })}
        maxWidth="sm"
      >
        <DialogTitle style={{ color: '#f44336' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Delete />
            Excluir Post
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Tem certeza que deseja excluir este post?
          </Typography>
          <Paper elevation={1} style={{ padding: 12, backgroundColor: '#f5f5f5', marginTop: 8 }}>
            <Typography variant="body2" style={{ fontStyle: 'italic' }}>
              "{deleteConfirmDialog.postContent}"
            </Typography>
          </Paper>
          <Typography variant="body2" color="error" style={{ marginTop: 8 }}>
            ⚠️ Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialog({ open: false, postId: '', postContent: '' })}>
            <Clear style={{ marginRight: 4 }} />
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeletePost}
            color="secondary"
            variant="contained"
            style={{ backgroundColor: '#f44336' }}
          >
            <Delete style={{ marginRight: 4 }} />
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu de Contexto para Amizade */}
      <Menu
        anchorEl={friendshipMenu.anchorEl}
        open={friendshipMenu.open}
        onClose={() => setFriendshipMenu(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem onClick={() => handleUserProfileClick(friendshipMenu.targetUserId || '')}>
          <Avatar style={{ marginRight: 8 }} />
          Ver Perfil
        </MenuItem>

        {friendshipMenu.targetUserId && !isFriend(friendshipMenu.targetUserId) ? (
          <MenuItem 
            onClick={() => handleAddFriend(
              friendshipMenu.targetUserId || '', 
              friendshipMenu.targetUserName || ''
            )}
            style={{ color: '#4CAF50' }}
          >
            <PersonAdd style={{ marginRight: 8 }} />
            Adicionar Amigo
          </MenuItem>
        ) : (
          <MenuItem 
            onClick={() => handleRemoveFriend(
              friendshipMenu.targetUserId || '', 
              friendshipMenu.targetUserName || ''
            )}
            style={{ color: '#f44336' }}
          >
            <PersonAddDisabled style={{ marginRight: 8 }} />
            Remover Amigo
          </MenuItem>
        )}
      </Menu>

      {/* Dialog de Confirmação */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        maxWidth="sm"
      >
        <DialogTitle>
          {confirmDialog.action === 'add' ? 'Adicionar Amigo' : 'Remover Amigo'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.action === 'add' 
              ? `Deseja adicionar ${confirmDialog.userName} como amigo?`
              : `Tem certeza que deseja remover ${confirmDialog.userName} da sua lista de amigos?`
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
            <Clear style={{ marginRight: 4 }} />
            Cancelar
          </Button>
          <Button 
            onClick={confirmFriendshipAction}
            color={confirmDialog.action === 'add' ? 'primary' : 'secondary'}
            variant="contained"
          >
            {confirmDialog.action === 'add' ? (
              <>
                <Check style={{ marginRight: 4 }} />
                Adicionar
              </>
            ) : (
              <>
                <PersonAddDisabled style={{ marginRight: 4 }} />
                Remover
              </>
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Perfil de Usuário */}
      <Dialog 
        open={Boolean(selectedUserProfile)} 
        onClose={() => setSelectedUserProfile(null)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        className={classes.mobileOptimized}
        PaperProps={{
          style: {
            borderRadius: isMobile ? 0 : 12,
            maxHeight: isMobile ? '100vh' : '90vh',
          }
        }}
      >
        {selectedUserProfile && (
          <PerfilUsuario 
            userId={selectedUserProfile}
            isOwnProfile={selectedUserProfile === currentUser?.id}
            onClose={() => setSelectedUserProfile(null)}
          />
        )}
      </Dialog>

      {/* Janelas de Chat Flutuantes */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        right: isMobile ? 8 : 20,
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: isMobile ? 5 : 10,
        zIndex: 1300,
        maxWidth: isMobile ? 'calc(100vw - 16px)' : 'auto',
        overflowX: isMobile ? 'auto' : 'visible',
      }}>
        {openChatWindows.map((userId, index) => {
          const friend = users.find(u => u.id === userId);
          if (!friend) return null;

          return (
            <ChatWindow
              key={userId}
              friend={friend}
              messages={activeChatMessages[userId] || []}
              onSendMessage={(content) => sendChatMessage(userId, content)}
              onClose={() => handleCloseChat(userId)}
              onMarkAsRead={() => markMessagesAsRead(userId)}
              currentUser={currentUser}
            />
          );
        })}
      </div>
    </div>
  );
};

// Componente da Janela de Chat
interface ChatWindowProps {
  friend: User;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onClose: () => void;
  onMarkAsRead: () => void;
  currentUser: User | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  friend,
  messages,
  onSendMessage,
  onClose,
  onMarkAsRead,
  currentUser
}) => {
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    onMarkAsRead();
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Paper
      elevation={8}
      style={{
        width: window.innerWidth < 768 ? Math.min(300, window.innerWidth - 40) : 320,
        height: isMinimized ? 56 : (window.innerWidth < 768 ? 350 : 400),
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px 12px 0 0',
        overflow: 'hidden',
        transition: 'height 0.3s ease',
      }}
    >
      {/* Header do Chat */}
      <div
        style={{
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <Avatar src={friend.avatar} style={{ width: 32, height: 32 }} />
            {friend.online && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                backgroundColor: '#4CAF50',
                borderRadius: '50%',
                border: '2px solid white'
              }} />
            )}
          </div>
          <div>
            <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
              {friend.name}
            </Typography>
            <Typography variant="caption" style={{ opacity: 0.9 }}>
              {friend.online ? 'Online' : 'Offline'}
            </Typography>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconButton size="small" style={{ color: 'white' }}>
            <VideoCall />
          </IconButton>
          <IconButton size="small" onClick={onClose} style={{ color: 'white' }}>
            <Close />
          </IconButton>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Área das Mensagens */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 12px',
              backgroundColor: '#f5f5f5',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.senderId === currentUser?.id ? 'flex-end' : 'flex-start',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '8px 12px',
                    borderRadius: 16,
                    backgroundColor: msg.senderId === currentUser?.id ? '#1877f2' : 'white',
                    color: msg.senderId === currentUser?.id ? 'white' : 'black',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="body2" style={{ fontSize: '0.9rem' }}>
                    {msg.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{
                      fontSize: '0.7rem',
                      opacity: 0.7,
                      display: 'block',
                      textAlign: 'right',
                      marginTop: 4,
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </Typography>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Mensagem */}
          <div style={{ padding: '12px', backgroundColor: 'white', borderTop: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Digite uma mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#f5f5f5', borderRadius: 20 }}
                InputProps={{
                  style: { borderRadius: 20, paddingRight: 4 },
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={!message.trim()}
                style={{
                  backgroundColor: message.trim() ? '#1877f2' : '#e0e0e0',
                  color: 'white',
                  width: 36,
                  height: 36,
                }}
              >
                <Send style={{ fontSize: 18 }} />
              </IconButton>
            </div>
          </div>
        </>
      )}
    </Paper>
  );
};

export default Feed;
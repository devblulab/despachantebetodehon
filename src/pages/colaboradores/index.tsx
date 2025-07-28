import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  Chip,
  Avatar,
  Badge,
  IconButton,
  Tooltip,
  Zoom,
  Fade,
  Backdrop,
  CircularProgress,
  LinearProgress,
  Switch,
  FormControlLabel,
  Button,
  ButtonGroup,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  useMediaQuery,
  Container,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Menu,
  Box,
} from '@material-ui/core';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';



import { Alert, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import {
  People,
  Dashboard as DashboardIcon,
  Chat,
  EmojiObjects,
  Business,
  Timeline,
  WhatsApp,
  Security,
  Assignment,
  Settings,
  NotificationsActive,

  Brightness4,
  Brightness7,
  Fullscreen,
  FullscreenExit,
  Refresh,

  Extension,
  Visibility,
  VisibilityOff,
  Lock,
  LockOpen,
  Star,
  StarBorder,
  Bookmark,
  BookmarkBorder,
  Share,
  GetApp,
  Print,
  Email,
  Phone,
  VideoCall,
  ScreenShare,
  RecordVoiceOver,
  Mic,
  MicOff,
  VolumeUp,
  VolumeOff,
  Headset,
  Forum,
  QuestionAnswer,
  LiveHelp,
  Help,
  Info,
  Warning,
  Error,
  CheckCircle,
  Cancel,
  PlayArrow,
  Pause,
  Stop,
  SkipNext,
  SkipPrevious,
  Loop,
  Shuffle,
  MoreVert,
  MoreHoriz,
  Close,
  ArrowBack,
  ArrowForward,
  KeyboardArrowUp,
  KeyboardArrowDown,
  ExpandMore,
  ExpandLess,
  Add,
  Edit,
  Delete,
  Save,
  SaveAlt,
  Publish,
  Schedule,
  Today,
  DateRange,
  AccessTime,
  History,
  Update,
  Sync,
  SyncDisabled,
  CloudDone,
  CloudOff,
  CloudUpload,
  WifiOff,
  Wifi,
  SignalWifi4Bar,
  Battery90,
  BatteryChargingFull,
  PowerSettingsNew,
  PowerOff,
  Code,
  DataUsage,
  Storage,
  Memory,
  SpeedOutlined,
 
  Person,
  AccountBalance,
  Dashboard,
  Gavel,
  TransferWithinAStation,
  Build
} from '@material-ui/icons';
import Collapse from '@material-ui/core/Collapse';


import ChatInterno from '@/components/chat/ChatInterno';
import ChatIA from '@/components/chat/ChatIA';
import CRM from '@/components/crm/CRM';
import DashboardIA from '@/components/dashboard/DashboardIA';
import Feed from '@/components/feed/Feed';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import WhatsAppDigisac from '@/components/whatsapp/WhatsAppDigisac';
import PermissionManager from '@/logic/core/permissions/PermissionManager';
import PermissionManagerComponent from '@/components/permissions/PermissionManager';
import BetoDashboard from '@/pages/beto/dashboard/index';
import AutenticacaoContext from '@/data/contexts/AutenticacaoContext';
import AuthDebug from '@/components/debug/AuthDebug';
import { usePermissions } from '@/hooks/usePermissions';
// Removidos imports do React Icons - usando apenas Material-UI
import IAColaborador from '@/components/dashboard/IAColaborador';
import ClienteLocalizador from '@/components/crm/ClienteLocalizador';
import WhatsAppTabs from '@/components/whatsapp/WhatsAppTabs';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    background: theme.palette.type === 'dark' 
      ? 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d2d2d 100%)'
      : 'linear-gradient(135deg,rgb(150, 150, 150) 0%, #c3cfe2 100%)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      overflow: 'auto',
    },
  },
  header: {
    padding: theme.spacing(4),
    background: theme.palette.type === 'dark'
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'black',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '0 0 30px 30px',
    boxShadow: theme.shadows[10],
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3),
      borderRadius: '0 0 20px 20px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      borderRadius: '0 0 15px 15px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.5),
      borderRadius: '0 0 10px 10px',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
      animation: '$shimmer 3s infinite',
    },
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
  tabsContainer: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    margin: theme.spacing(2),
    boxShadow: theme.shadows[8],
    overflow: 'hidden',
    color: 'black',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1.5),
      borderRadius: theme.spacing(1.5),
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      borderRadius: theme.spacing(1),
      boxShadow: theme.shadows[4],
    },
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(0.5),
      borderRadius: theme.spacing(0.5),
      boxShadow: theme.shadows[2],
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      [theme.breakpoints.down('xs')]: {
        height: 2,
      },
    },
  },
  tabs: {
    borderBottom: '1px solid #e0e0e0',
    '& .MuiTab-root': {
      minWidth: 120,
      fontSize: '0.875rem',
      padding: '12px 16px',
      [theme.breakpoints.down('sm')]: {
        minWidth: 80,
        fontSize: '0.7rem',
        padding: '8px 12px',
      },
    },
  },
  tabPanel: {
    padding: 0,
    minHeight: 'calc(100vh - 400px)',
  },
  welcomeCard: {
    margin: theme.spacing(2),
    background: theme.palette.type === 'dark'
      ? 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
    boxShadow: theme.shadows[12],
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: '200px',
      height: '200px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '50%',
      transform: 'translate(50px, -50px)',
    },
  },
  moduleCard: {
    textAlign: 'center',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    borderRadius: theme.spacing(2),
    position: 'relative',
    overflow: 'hidden',
    color: '#222',
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1.5),
      borderRadius: theme.spacing(1.5),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      borderRadius: theme.spacing(1),
      boxShadow: theme.shadows[2],
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.8),
      borderRadius: theme.spacing(0.8),
      boxShadow: theme.shadows[1],
    },
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: theme.shadows[16],
      [theme.breakpoints.down('sm')]: {
        transform: 'translateY(-4px) scale(1.01)',
        boxShadow: theme.shadows[8],
      },
      [theme.breakpoints.down('xs')]: {
        transform: 'translateY(-2px) scale(1.005)',
        boxShadow: theme.shadows[4],
      },
      '& $moduleIcon': {
        transform: 'scale(1.2) rotate(5deg)',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        [theme.breakpoints.down('xs')]: {
          transform: 'scale(1.1) rotate(3deg)',
        },
      },
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 6,
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      transform: 'scaleX(0)',
      transition: 'transform 0.3s ease',
      [theme.breakpoints.down('xs')]: {
        height: 3,
      },
    },
    '&:hover::before': {
      transform: 'scaleX(1)',
    },
  },
  moduleIcon: {
    fontSize: 64,
    marginBottom: theme.spacing(2),
    transition: 'all 0.3s ease',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
    [theme.breakpoints.down('md')]: {
      fontSize: 56,
      marginBottom: theme.spacing(1.5),
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 48,
      marginBottom: theme.spacing(1),
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 40,
      marginBottom: theme.spacing(0.5),
    },
  },
  aiAssistant: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  speedDial: {
    '& .MuiFab-primary': {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: theme.shadows[8],
      [theme.breakpoints.down('md')]: {
        width: 48,
        height: 48,
        boxShadow: theme.shadows[6],
      },
      [theme.breakpoints.down('sm')]: {
        width: 44,
        height: 44,
        boxShadow: theme.shadows[4],
      },
      [theme.breakpoints.down('xs')]: {
        width: 40,
        height: 40,
        boxShadow: theme.shadows[2],
      },
    },
    '& .MuiSpeedDial-fab': {
      [theme.breakpoints.down('md')]: {
        width: 48,
        height: 48,
      },
      [theme.breakpoints.down('sm')]: {
        width: 44,
        height: 44,
      },
      [theme.breakpoints.down('xs')]: {
        width: 40,
        height: 40,
      },
    },
  },
  notification: {
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 1000,
  },
  statusBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 4,

    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    zIndex: 1000,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  smartWidget: {
    position: 'absolute',
    top: 20,
    left: 20,
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    minWidth: 200,
    zIndex: 1,

    color: 'rgba(0,0,0,0.7)',
    boxShadow: theme.shadows[8],
    border: `2px solid ${theme.palette.primary.main}`,
    [theme.breakpoints.down('md')]: {
      top: 15,
      left: 15,
      padding: theme.spacing(1.5),
      minWidth: 180,
      borderRadius: theme.spacing(1.5),
    },
    [theme.breakpoints.down('sm')]: {
      top: 10,
      left: 10,
      padding: theme.spacing(1),
      minWidth: 160,
      borderRadius: theme.spacing(1),
      boxShadow: theme.shadows[4],
    },
    [theme.breakpoints.down('xs')]: {
      position: 'relative',
      top: 'auto',
      left: 'auto',
      margin: theme.spacing(1),
      minWidth: 'auto',
      width: 'calc(100% - 16px)',
    },
  },
  analyticsPanel: {
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    color: 'rgba(0,0,0,0.7)',
    boxShadow: theme.shadows[6],
    border: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2.5),
      margin: theme.spacing(1.5),
      borderRadius: theme.spacing(1.5),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      margin: theme.spacing(1),
      borderRadius: theme.spacing(1),
      boxShadow: theme.shadows[3],
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.5),
      margin: theme.spacing(0.5),
      borderRadius: theme.spacing(0.8),
      boxShadow: theme.shadows[1],
    },
  },
  performanceMetrics: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      marginTop: theme.spacing(1),
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      gap: theme.spacing(0.5),
    },
  },
  metricItem: {
    textAlign: 'center',
    padding: theme.spacing(1),
    minWidth: 80,
    [theme.breakpoints.down('md')]: {
      minWidth: 70,
      padding: theme.spacing(0.8),
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 60,
      padding: theme.spacing(0.6),
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: 50,
      padding: theme.spacing(0.4),
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      '& > *': {
        margin: '0 4px',
      },
    },
  },
  pulsingIcon: {
    animation: '$pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': { opacity: 1, transform: 'scale(1)' },
    '50%': { opacity: 0.7, transform: 'scale(1.1)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
  glowEffect: {
    animation: '$glow 2s ease-in-out infinite alternate',
  },
  '@keyframes glow': {
    from: { boxShadow: `0 0 10px ${theme.palette.primary.main}` },
    to: { boxShadow: `0 0 20px ${theme.palette.primary.main}` },
  },
  floatingWidget: {
    position: 'fixed',
    bottom: 100,
    left: 20,
    background: theme.palette.background.paper,
    borderRadius: '50%',
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows[12],
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 999,
    [theme.breakpoints.down('md')]: {
      width: 70,
      height: 70,
      bottom: 90,
      left: 15,
      boxShadow: theme.shadows[8],
    },
    [theme.breakpoints.down('sm')]: {
      width: 60,
      height: 60,
      bottom: 80,
      left: 10,
      boxShadow: theme.shadows[4],
    },
    [theme.breakpoints.down('xs')]: {
      width: 50,
      height: 50,
      bottom: 70,
      left: 8,
      boxShadow: theme.shadows[2],
    },
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: theme.shadows[20],
      [theme.breakpoints.down('sm')]: {
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[8],
      },
      [theme.breakpoints.down('xs')]: {
        transform: 'scale(1.02)',
        boxShadow: theme.shadows[4],
      },
    },
  },
  smartNotification: {
    position: 'fixed',
    top: 80,
    right: 20,
    maxWidth: 300,
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    boxShadow: theme.shadows[10],
    border: `2px solid ${theme.palette.success.main}`,
    zIndex: 1000,
    [theme.breakpoints.down('md')]: {
      top: 70,
      right: 15,
      maxWidth: 280,
      padding: theme.spacing(1.5),
    },
    [theme.breakpoints.down('sm')]: {
      top: 60,
      right: 10,
      left: 10,
      maxWidth: 'calc(100% - 20px)',
      padding: theme.spacing(1),
      borderRadius: theme.spacing(1),
      boxShadow: theme.shadows[6],
    },
    [theme.breakpoints.down('xs')]: {
      top: 50,
      right: 8,
      left: 8,
      maxWidth: 'calc(100% - 16px)',
      padding: theme.spacing(0.8),
      borderRadius: theme.spacing(0.8),
      border: `1px solid ${theme.palette.success.main}`,
    },
  },
  contextualMenu: {
    position: 'absolute',
      color: 'rgba(0,0,0,0.7)',
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(1),

    boxShadow: theme.shadows[8],
    padding: theme.spacing(1),
    minWidth: 150,
    zIndex: 1000,
  },
  immersiveMode: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: '#000',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceIndicator: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(102, 96, 96, 0.8)',
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
  collaborativePointer: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: theme.palette.secondary.main,
    border: '2px solid white',
    pointerEvents: 'none',
    zIndex: 1000,
    transition: 'all 0.1s ease',
  },
  realtimeStatus: {
    position: 'fixed',
    bottom: 180,
    right: 20,
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(3),
    padding: theme.spacing(1, 2),
    boxShadow: theme.shadows[6],
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  card: {
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[4],
    background: theme.palette.background.paper,
    transition: 'all 0.3s ease',
    [theme.breakpoints.down('md')]: {
      borderRadius: theme.spacing(1.5),
      boxShadow: theme.shadows[3],
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: theme.spacing(1),
      boxShadow: theme.shadows[2],
    },
    [theme.breakpoints.down('xs')]: {
      borderRadius: theme.spacing(0.8),
      boxShadow: theme.shadows[1],
    },
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[8],
      [theme.breakpoints.down('sm')]: {
        transform: 'translateY(-1px)',
        boxShadow: theme.shadows[4],
      },
      [theme.breakpoints.down('xs')]: {
        transform: 'none',
        boxShadow: theme.shadows[2],
      },
    },
  },
  chipContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    
    marginTop: theme.spacing(1),
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(0.5),
      marginTop: theme.spacing(0.5),
    },
    [theme.breakpoints.down('xs')]: {
      gap: theme.spacing(0.3),
      marginTop: theme.spacing(0.3),
      justifyContent: 'flex-start',
    },
  },
  permissionChip: {
    fontSize: '0.7rem',
    fontWeight: 'bold',
    color: theme.palette.getContrastText('#3f51b5'),
    backgroundColor: '#3f51b5',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.65rem',
      height: 18,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.6rem',
      height: 16,
    },
  },
  menuItem: {
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0.5, 0),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'translateX(4px)',
    },
  },
  menuItemAuthenticated: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    border: '1px solid rgba(76, 175, 80, 0.3)',
    '&:hover': {
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
    },
  },
  menuItemIcon: {
    color: theme.palette.primary.main,
    minWidth: 40,
  },
  menuItemText: {
    '& .MuiListItemText-primary': {
      fontWeight: 500,
      fontSize: '0.9rem',
    },
  },
  statusBadge: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(0.25, 0.75),
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: '0.7rem',
    fontWeight: 'bold',
  },
  lockedItem: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    border: '1px solid rgba(244, 67, 54, 0.3)',
    opacity: 0.7,
    '& .MuiListItemIcon-root': {
      color: '#f44336',
    },
    '& .MuiListItemText-primary': {
      color: '#666',
      textDecoration: 'line-through',
    },
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      className={classes.tabPanel}
      {...other}
    >
      {value === index && (
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

const Colaboradores: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const { usuario, estaAutenticado, carregando } = useContext(AutenticacaoContext);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [aiAssistantActive, setAiAssistantActive] = useState(true);
  const [voiceMode, setVoiceMode] = useState(false);
  const [collaboratorsCursor, setCollaboratorsCursor] = useState<any[]>([]);
  const [realtimeUsers, setRealtimeUsers] = useState(3);
  const [systemStatus, setSystemStatus] = useState('optimal');
  const [smartSuggestions, setSmartSuggestions] = useState<any[]>([]);
  const [contextualMenu, setContextualMenu] = useState<any>(null);
  const [usuariosList, setUsuariosList] = useState<any[]>([]);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState<{
    nome: string;
    email: string;
    senha: string;
    permissao: 'cliente' | 'empresa' | 'colaborador' | 'administrador' | 'Visualizador' | 'Operador' | 'Administrador' | 'CEO' | 'EnygmaDeveloper';
  }>({
    nome: '',
    email: '',
    senha: '',
    permissao: 'cliente'
  });
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [editUserData, setEditUserData] = useState<{
    id: string;
    nome: string;
    email: string;
    permissao: 'cliente' | 'empresa' | 'colaborador' | 'administrador' | 'Visualizador' | 'Operador' | 'Administrador' | 'CEO' | 'EnygmaDeveloper';
    ativo: boolean;
  }>({
    id: '',
    nome: '',
    email: '',
    permissao: 'cliente',
    ativo: true
  });
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newProfileDialogOpen, setNewProfileDialogOpen] = useState(false);
  const [newProfileData, setNewProfileData] = useState({
    nome: '',
    descricao: '',
    permissoes: {
      dashboard: false,
      chat: false,
      crm: false,
      relatorios: false,
      usuarios: false,
      configuracoes: false
    }
  });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    cpu: 85,
    memory: 67,
    network: 92,
    storage: 45
  });

  // Estados para Gestão de Permissões
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [profilePermissions, setProfilePermissions] = useState<any>({});
  const [dashboardExpanded, setDashboardExpanded] = useState<string | null>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<string>('');
  const [whatsappExpanded, setWhatsappExpanded] = useState(false);

  // Estados para sistema de permissões
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<any>(null);
  const [viewingDashboard, setViewingDashboard] = useState<string | null>(null);

// Verificar permissões do usuário usando o PermissionManager
  const { hasAreaAccess, hasModulePermission } = usePermissions();
  const isAuthenticated = estaAutenticado();
  const hasClienteAccess = isAuthenticated && hasAreaAccess('cliente');
  const hasEmpresarialAccess = isAuthenticated && hasAreaAccess('empresarial');
  const hasColaboradorAccess = isAuthenticated && hasAreaAccess('colaborador');

  // Verificar permissões específicas de módulos
  const hasUserManagement = isAuthenticated && (
    hasModulePermission('colaborador', 'usuarios', 'visualizar') ||
    hasModulePermission('empresarial', 'usuarios', 'visualizar')
  );

  const hasPermissionManagement = isAuthenticated && (
    hasModulePermission('colaborador', 'permissoes', 'visualizar') ||
    usuario?.permissao === 'Administrador' ||
    usuario?.permissao === 'EnygmaDeveloper'
  );

  const menuSections: any[] = [
    {
      title: "Áreas de Acesso",
      items: [
        // Área Cliente - apenas para usuários com permissão
        ...(hasClienteAccess ? [{
          icon: <Person />,
          text: "Área do Cliente",
          path: "/area-cliente",
          status: "CLIENTE"
        }] : []),
        // Área Empresarial - apenas para usuários com permissão
        ...(hasEmpresarialAccess ? [{
          icon: <Business />,
          text: "Área Empresarial", 
          path: "/beto/empresas",
          status: "EMPRESA"
        }] : []),
        // Área Colaboradores - apenas para usuários com permissão
        ...(hasColaboradorAccess ? [{

          icon: <People />,
          text: "Área Colaboradores",
          path: "/colaboradores",
          status: "COLABORADOR"
        }] : [])
      ]
    },
    // Serviços Jurídicos - baseado em permissões específicas
    ...(hasClienteAccess || hasEmpresarialAccess ? [{
      title: "Serviços Jurídicos",
      items: [
        ...(hasModulePermission(hasClienteAccess ? 'cliente' : 'empresarial', 'servicos', 'visualizar') ? [{
          icon: <Assignment />,
          text: "Requerimentos",
          subItems: [
            { text: "Novo Requerimento", path: "/beto/requerimento" },
            { text: "Versão Digital", path: "/beto/requerimento/digital" },
            { text: "Histórico", path: "/beto/requerimento/historico" }
          ]
        }] : []),
        ...(hasModulePermission(hasClienteAccess ? 'cliente' : 'empresarial', 'servicos', 'visualizar') ? [{
          icon: <TransferWithinAStation />,
          text: "Transferências",
          subItems: [
            { text: "Nova Transferência", path: "/beto/transferencia" },
            { text: "Acompanhar Status", path: "/beto/transferencia/status" }
          ]
        }] : []),
        ...(hasModulePermission(hasClienteAccess ? 'cliente' : 'empresarial', 'servicos', 'visualizar') ? [{
          icon: <Gavel />,
          text: "Anuência",
          path: "/beto/anuencia"
        }] : [])
      ]
    }] : []),
    // Gestão e Administração - baseado em permissões específicas
    ...(hasEmpresarialAccess || hasColaboradorAccess ? [{
      title: "Gestão e Relatórios",
      items: [
        ...(hasModulePermission(hasColaboradorAccess ? 'colaborador' : 'empresarial', 'dashboard', 'visualizar') ? [{
          icon: <Dashboard />,
          text: "Dashboard",
          path: "/beto/dashboard"
        }] : []),
        ...(hasModulePermission(hasColaboradorAccess ? 'colaborador' : 'empresarial', 'relatorios', 'visualizar') ? [{
          icon: <AccountBalance />,
          text: "Relatórios",
          subItems: [
            { text: "Relatório Mensal", path: "/beto/relatorios/mensal" },
            { text: "Relatório Anual", path: "/beto/relatorios/anual" }
          ]
        }] : []),
        ...(hasModulePermission(hasColaboradorAccess ? 'colaborador' : 'empresarial', 'financeiro', 'visualizar') ? [{
          icon: <AccountBalance />,
          text: "Financeiro",
          path: "/beto/financeiro"
        }] : [])
      ]
    }] : []),
    // Administração do Sistema - apenas para colaboradores com permissões específicas
    ...(hasColaboradorAccess ? [{
      title: "Administração",
      items: [
        ...(hasUserManagement ? [{
          icon: <People />,
          text: "Gestão de Usuários",
          path: "/colaboradores#usuarios"
        }] : []),
        ...(hasPermissionManagement ? [{
          icon: <Security />,
          text: "Gestão de Permissões",
          path: "/colaboradores#permissoes"
        }] : []),
        ...(hasModulePermission('colaborador', 'configuracoes', 'visualizar') ? [{
          icon: <Settings />,
          text: "Configurações",
          path: "/colaboradores#configuracoes"
        }] : [])
      ]
    }] : [])
  ];

  // Verificar se o usuário atual tem permissão para gerenciar usuários
  const hasUserManagementPermission = () => {
    if (!estaAutenticado()) return false;
    return hasUserManagement;
  };

  // Perfis de Acesso Pré-definidos
  const accessProfiles = [
    {
      id: 'administrador',
      nome: 'Administrador',
      descricao: 'Acesso total ao sistema',
      icon: <Star style={{ color: '#f44336' }} />,
      color: '#f44336',
      usuarios: usuariosList.filter(u => u.permissao === 'Administrador').length,
      permissoes: {
        dashboard: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        chat: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        crm: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        ia: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        feed: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        usuarios: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        whatsapp: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        whatsappmult: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        relatorios: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        configuracoes: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        permissoes: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true }
      }
    },
    {
      id: 'ceo',
      nome: 'CEO',
      descricao: 'Acesso executivo total',
      icon: <Extension style={{ color: '#9c27b0' }} />,
      color: '#9c27b0',
      usuarios: usuariosList.filter(u => u.permissao === 'CEO').length,
      permissoes: {
        dashboard: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        chat: { ativo: true, criar: true, editar: true, excluir: false, visualizar: true },
        crm: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        ia: { ativo: true, criar: true, editar: true, excluir: false, visualizar: true },
        feed: { ativo: true, criar: true, editar: true, excluir: false, visualizar: true },
        usuarios: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        whatsapp: { ativo: true, criar: false, editar: true, excluir: false, visualizar: true },
        whatsappmult: { ativo: true, criar: false, editar: true, excluir: false, visualizar: true },
        relatorios: { ativo: true, criar: true, editar: false, excluir: false, visualizar: true },
        configuracoes: { ativo: true, criar: false, editar: true, excluir: false, visualizar: true },
        permissoes: { ativo: true, criar: false, editar: true, excluir: false, visualizar: true }
      }
    },
    {
      id: 'enygmadeveloper',
      nome: 'EnygmaDeveloper',
      descricao: 'Desenvolvedor do sistema',
      icon: <Code style={{ color: '#00bcd4' }} />,
      color: '#00bcd4',
      usuarios: usuariosList.filter(u => u.permissao === 'EnygmaDeveloper').length,
      permissoes: {
        dashboard: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        chat: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        crm: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        ia: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        feed: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        usuarios: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        whatsapp: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        whatsappmult: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        relatorios: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        configuracoes: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true },
        permissoes: { ativo: true, criar: true, editar: true, excluir: true, visualizar: true }
      }
    },
    {
      id: 'operador',
      nome: 'Operador',
      descricao: 'Operações básicas',
      icon: <Extension style={{ color: '#ff9800' }} />,
      color: '#ff9800',
      usuarios: usuariosList.filter(u => u.permissao === 'Operador').length,
      permissoes: {
        dashboard: { ativo: true, criar: false, editar: false, excluir: false, visualizar: true },
        chat: { ativo: true, criar: true, editar: true, excluir: false, visualizar: true },
        crm: { ativo: true, criar: true, editar: true, excluir: false, visualizar: true },
        ia: { ativo: true, criar: false, editar: false, excluir: false, visualizar: true },
        feed: { ativo: true, criar: true, editar: false, excluir: false, visualizar: true },
        usuarios: { ativo: false, criar: false, editar: false, excluir: false, visualizar: false },
        whatsapp: { ativo: true, criar: true, editar: true, excluir: false, visualizar: true },
        whatsappmult: { ativo: true, criar: true, editar: true, excluir: false, visualizar: true },
        relatorios: { ativo: true, criar: false, editar: false, excluir: false, visualizar: true },
        configuracoes: { ativo: false, criar: false, editar: false, excluir: false, visualizar: false },
        permissoes: { ativo: false, criar: false, editar: false, excluir: false, visualizar: false }
      }
    },
    {
      id: 'visualizador',
      nome: 'Visualizador',
      descricao: 'Apenas visualização',
      icon: <Visibility style={{ color: '#2196f3' }} />,
      color: '#2196f3',
      usuarios: usuariosList.filter(u => u.permissao === 'Visualizador' || !u.permissao).length,
      permissoes: {
        dashboard: { ativo: true, criar: false, editar: false, excluir: false, visualizar: true },
        chat: { ativo: false, criar: false, editar: false, excluir: false, visualizar: false },
        crm: { ativo: true, criar: false, editar: false, excluir: false, visualizar: true },
        ia: { ativo: false, criar: false, editar: false, excluir: false, visualizar: false },
        feed: { ativo: true, criar: false, editar: false, excluir: false, visualizar: true },
        usuarios: { ativo: false, criar: false, editar: false, excluir: false, visualizar: false },
        whatsapp: { ativo: false, criar: false, editar: false, excluir: false, visualizar: false },
        whatsappmult: { ativo: false, criar: false, editar: false, excluir: false, visualizar: false },
        relatorios: { ativo: true, criar: false, editar: false, excluir: false, visualizar: true },
        configuracoes: { ativo: false, criar: false, editar: false, excluir: false, visualizar: false },
        permissoes: { ativo: false, criar: false, editar: false, excluir: false, visualizar: false }
      }
    }
  ];

  // Dashboards Disponíveis
  const dashboardsData = [
    {
      id: 'geral',
      nome: 'Dashboard Geral',
      descricao: 'Visão geral de todos os documentos',
      icon: <DashboardIcon />,
      color: '#4CAF50',
      documentos: 1247,
      acoes: [
        { id: 'visualizar', nome: 'Visualizar', icon: <Visibility />, color: '#2196F3' },
        { id: 'relatorio', nome: 'Relatório', icon: <Timeline />, color: '#FF9800' },
        { id: 'exportar', nome: 'Exportar', icon: <GetApp />, color: '#9C27B0' }
      ]
    },
    {
      id: 'requerimentos',
      nome: 'Dashboard Requerimentos',
      descricao: 'Gerenciamento de requerimentos',
      icon: <Assignment />,
      color: '#2196F3',
      documentos: 523,
      acoes: [
        { id: 'visualizar', nome: 'Visualizar', icon: <Visibility />, color: '#2196F3' },
        { id: 'processar', nome: 'Processar', icon: <PlayArrow />, color: '#4CAF50' },
        { id: 'aprovar', nome: 'Aprovar', icon: <CheckCircle />, color: '#8BC34A' },
        { id: 'rejeitar', nome: 'Rejeitar', icon: <Cancel />, color: '#F44336' }
      ]
    },
    {
      id: 'transferencias',
      nome: 'Dashboard Transferências',
      descricao: 'Controle de transferências',
      icon: <Extension />,
      color: '#FF9800',
      documentos: 321,
      acoes: [
        { id: 'visualizar', nome: 'Visualizar', icon: <Visibility />, color: '#2196F3' },
        { id: 'confirmar', nome: 'Confirmar', icon: <CheckCircle />, color: '#4CAF50' },
        { id: 'aguardar', nome: 'Aguardar', icon: <Schedule />, color: '#FF9800' },
        { id: 'cancelar', nome: 'Cancelar', icon: <Cancel />, color: '#F44336' }
      ]
    },
    {
      id: 'digital',
      nome: 'Dashboard Digital',
      descricao: 'Documentos digitais',
      icon: <Storage />,
      color: '#9C27B0',
      documentos: 892,
      acoes: [
        { id: 'visualizar', nome: 'Visualizar', icon: <Visibility />, color: '#2196F3' },
        { id: 'validar', nome: 'Validar', icon: <Security />, color: '#4CAF50' },
        { id: 'assinar', nome: 'Assinar', icon: <Edit />, color: '#2196F3' },
        { id: 'arquivar', nome: 'Arquivar', icon: <Save />, color: '#607D8B' }
      ]
    },
    {
      id: 'empresarial',
      nome: 'Dashboard Empresarial',
      descricao: 'Documentos empresariais',
      icon: <Business />,
      color: '#607D8B',
      documentos: 178,
      acoes: [
        { id: 'visualizar', nome: 'Visualizar', icon: <Visibility />, color: '#2196F3' },
        { id: 'analisar', nome: 'Analisar', icon: <Extension />, color: '#9C27B0' },
        { id: 'registrar', nome: 'Registrar', icon: <Add />, color: '#4CAF50' },
        { id: 'notificar', nome: 'Notificar', icon: <NotificationsActive />, color: '#FF9800' }
      ]
    },
    {
      id: 'anuencia',
      nome: 'Dashboard Anuência',
      descricao: 'Controle de anuências',
      icon: <Lock />,
      color: '#795548',
      documentos: 67,
      acoes: [
        { id: 'visualizar', nome: 'Visualizar', icon: <Visibility />, color: '#2196F3' },
        { id: 'autorizar', nome: 'Autorizar', icon: <LockOpen />, color: '#4CAF50' },
        { id: 'revisar', nome: 'Revisar', icon: <Visibility />, color: '#2196F3' },
        { id: 'documentar', nome: 'Documentar', icon: <Assignment />, color: '#FF9800' }
      ]
    },
    {
      id: 'documentos',
      nome: 'Dashboard Documentos',
      descricao: 'Gerenciamento de documentos',
      icon: <Assignment />,
      color: '#E91E63',
      documentos: 456,
      acoes: [
        { id: 'visualizar', nome: 'Visualizar', icon: <Visibility />, color: '#2196F3' },
        { id: 'upload', nome: 'Upload', icon: <CloudUpload />, color: '#4CAF50' },
        { id: 'organizar', nome: 'Organizar', icon: <Storage />, color: '#2196F3' },
        { id: 'compartilhar', nome: 'Compartilhar', icon: <Share />, color: '#FF9800' },
        { id: 'backup', nome: 'Backup', icon: <Save />, color: '#607D8B' }
      ]
    }
  ];

  // Módulos do Sistema
  const systemModules = [
    { id: 'dashboard', nome: 'Dashboard', icon: <DashboardIcon />, descricao: 'Painel principal' },
    { id: 'chat', nome: 'Chat', icon: <Chat />, descricao: 'Comunicação interna' },
    { id: 'crm', nome: 'CRM', icon: <Business />, descricao: 'Gestão de clientes' },
    { id: 'ia', nome: 'IA', icon: <EmojiObjects />, descricao: 'Inteligência artificial' },
    { id: 'feed', nome: 'Feed', icon: <Timeline />, descricao: 'Feed de notícias' },
    { id: 'usuarios', nome: 'Usuários', icon: <People />, descricao: 'Gestão de usuários' },
    { id: 'whatsapp', nome: 'WhatsApp', icon: <WhatsApp />, descricao: 'Integração WhatsApp' },
    
    { id: 'relatorios', nome: 'Relatórios', icon: <Timeline />, descricao: 'Relatórios gerenciais' },
    { id: 'configuracoes', nome: 'Configurações', icon: <Settings />, descricao: 'Configurações do sistema' },
    { id: 'permissoes', nome: 'Permissões', icon: <Security />, descricao: 'Gestão de permissões' },
    { id: 'whatsappmult', nome: 'whatsappmult', icon: <WhatsApp />, descricao: 'Integração WhatsApp Mult' }
  ];

  const speedDialActions = [
    { icon: <Extension />, name: 'IA Assistant', color: '#9C27B0' },
    { icon: <Extension />, name: 'Brain Mode', color: '#FF5722' },
    { icon: <Extension />, name: 'Magic Tools', color: '#4CAF50' },
    { icon: <Extension />, name: 'Quick Actions', color: '#2196F3' },
    { icon: <Extension />, name: 'Extensions', color: '#FF9800' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceMetrics(prev => ({
        cpu: Math.max(20, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(100, prev.memory + (Math.random() - 0.5) * 8)),
        network: Math.max(50, Math.min(100, prev.network + (Math.random() - 0.5) * 5)),
        storage: Math.max(10, Math.min(100, prev.storage + (Math.random() - 0.5) * 3)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    // Carregar usuários quando o componente montar
    console.log('🔄 Iniciando carregamento de usuários...');
    setIsLoading(true);
    carregarUsuarios().finally(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeUsers(prev => Math.max(1, prev + Math.floor((Math.random() - 0.5) * 3)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextualMenu({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode);
    if (!voiceMode) {
      setTimeout(() => setVoiceMode(false), 3000);
    }
  };

  const handleSmartAction = (action: string) => {
    setIsLoading(true);
    console.log(`Executando ação inteligente: ${action}`);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Funções para gestão de usuários
  const carregarUsuarios = async () => {
    try {
      console.log('🔄 Carregando usuários do Firestore...');

      const { default: Colecao } = await import('@/logic/firebase/db/Colecao');
      const colecao = new Colecao();

      const usuarios = await colecao.consultarTodos('usuarios');
      console.log('📊 Usuários carregados:', usuarios);

      if (Array.isArray(usuarios) && usuarios.length > 0) {
        const usuariosFormatados = usuarios.map(usuario => ({
          id: usuario.id || usuario.email,
          nome: usuario.nome || 'Nome não informado',
          email: usuario.email || 'Email não informado',
          permissao: usuario.permissao || 'Visualizador',
          ativo: usuario.ativo !== false,
          imagemUrl: usuario.imagemUrl || '/betologo.jpeg',
          dataCriacao: usuario.dataCriacao || new Date()
        }));

        setUsuariosList(usuariosFormatados);
        console.log('✅ Lista de usuários atualizada:', usuariosFormatados.length, 'usuários');
      } else {
        console.log('ℹ️ Nenhum usuário encontrado no banco');
        setUsuariosList([]);
      }

    } catch (error) {
      console.error('❌ Erro ao carregar usuários:', error);
      setUsuariosList([]);
    }
  };

  const handleToggleUserStatus = async (usuario: any) => {
    try {
      console.log('🔄 Alterando status do usuário:', usuario.email);

      const { default: Colecao } = await import('@/logic/firebase/db/Colecao');
      const colecao = new Colecao();

      const novoStatus = !usuario.ativo;

      await colecao.salvar('usuarios', {
        ...usuario,
        ativo: novoStatus,
        dataAtualizacao: new Date()
      }, usuario.email);

      setNotifications([{
        id: Date.now(),
        message: `Usuário ${usuario.nome} ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`,
        type: 'success'
      }]);

      // Recarregar lista de usuários
      await carregarUsuarios();

    } catch (error) {
      console.error('❌ Erro ao alterar status do usuário:', error);
      setNotifications([{
        id: Date.now(),
        message: 'Erro ao alterar status do usuário. Tente novamente.',
        type: 'error'
      }]);
    }
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>, usuario: any) => {
    setUserMenuAnchor(event.currentTarget);
    setSelectedUser(usuario);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleOpenPermissionManager = (usuario: any) => {
    setSelectedUserForPermissions(usuario);
    setPermissionDialogOpen(true);
    handleUserMenuClose();
  };

  const handleEditUser = (usuario: any) => {
    setEditUserData({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      permissao: usuario.permissao,
      ativo: usuario.ativo
    });
    setEditUserDialogOpen(true);
    handleUserMenuClose();
  };

  const handleDeleteUser = (usuario: any) => {
    setUserToDelete(usuario);
    setDeleteUserDialogOpen(true);
    handleUserMenuClose();
  };

  const handleNewUserInputChange = (field: keyof typeof newUserData, value: any) => {
    setNewUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditUserInputChange = (field: keyof typeof editUserData, value: any) => {
    setEditUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewUserSubmit = async () => {
    try {
      if (!newUserData.nome || !newUserData.email || !newUserData.senha) {
        setNotifications([{
          id: Date.now(),
          message: 'Por favor, preencha todos os campos obrigatórios',
          type: 'error'
        }]);
        return;
      }

      console.log('🔄 Criando novo usuário:', newUserData);

      const { createUserInFirestore } = await import('@/utils/createUser');
      await createUserInFirestore(newUserData);

      setNotifications([{
        id: Date.now(),
        message: `Usuário ${newUserData.nome} criado com sucesso!`,
        type: 'success'
      }]);

      setNewUserDialogOpen(false);
      setNewUserData({
        nome: '',
        email: '',
        senha: '',
        permissao: 'cliente'
      });

      // Recarregar lista de usuários
      await carregarUsuarios();

    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      setNotifications([{
        id: Date.now(),
        message: 'Erro ao criar usuário. Verifique se o email já não está sendo usado.',
        type: 'error'
      }]);
    }
  };

  const handleEditUserSubmit = async () => {
    try {
      console.log('🔄 Editando usuário:', editUserData);

      const { default: Colecao } = await import('@/logic/firebase/db/Colecao');
      const colecao = new Colecao();

      const dadosAtualizados = {
        nome: editUserData.nome,
        email: editUserData.email,
        permissao: editUserData.permissao,
        ativo: editUserData.ativo,
        dataAtualizacao: new Date()
      };

      await colecao.salvar('usuarios', dadosAtualizados, editUserData.email);

      setNotifications([{
        id: Date.now(),
        message: `Usuário ${editUserData.nome} atualizado com sucesso!`,
        type: 'success'
      }]);

      setEditUserDialogOpen(false);

      // Recarregar lista de usuários
      await carregarUsuarios();

    } catch (error) {
      console.error('❌ Erro ao editar usuário:', error);
      setNotifications([{
        id: Date.now(),
        message: 'Erro ao editar usuário. Tente novamente.',
        type: 'error'
      }]);
    }
  };

  const confirmDeleteUser = async () => {
    try {
      console.log('🔄 Deletando usuário:', userToDelete);

      const { default: Colecao } = await import('@/logic/firebase/db/Colecao');
      const colecao = new Colecao();

      await colecao.excluir('usuarios', userToDelete.email);

      setNotifications([{
        id: Date.now(),
        message: `Usuário ${userToDelete.nome} excluído com sucesso!`,
        type: 'success'
      }]);

      setDeleteUserDialogOpen(false);
      setUserToDelete(null);

      // Recarregar lista de usuários
      await carregarUsuarios();

    } catch (error) {
      console.error('❌ Erro ao excluir usuário:', error);
      setNotifications([{
        id: Date.now(),
        message: 'Erro ao excluir usuário. Tente novamente.',
        type: 'error'
      }]);
    }
  };

  const handleOpenPermissionDialog = (profile: any) => {
    setSelectedProfile(profile);
    setPermissionDialogOpen(true);
  };

  const handleNewProfileInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setNewProfileData(prev => ({
        ...prev,
        [parent]: {
          ...(typeof prev[parent as keyof typeof prev] === 'object' && prev[parent as keyof typeof prev] !== null 
            ? prev[parent as keyof typeof prev] as Record<string, any>
            : {}),
          [child]: value
        }
      }));
    } else {
      setNewProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNewProfileSubmit = () => {
    console.log('Criando novo perfil:', newProfileData);
    // Implementar criação de perfil
    setNewProfileDialogOpen(false);
    setNewProfileData({
      nome: '',
      descricao: '',
      permissoes: {
        dashboard: false,
        chat: false,
        crm: false,
        relatorios: false,
        usuarios: false,
        configuracoes: false
      }
    });
  };

  const handleDashboardExpand = (dashboardId: string) => {
    setDashboardExpanded(dashboardExpanded === dashboardId ? null : dashboardId);
  };

  const handleDashboardAction = (dashboardId: string, actionId: string) => {
    console.log(`Ação ${actionId} no dashboard ${dashboardId}`);
    if (actionId === 'visualizar') {
      setViewingDashboard(dashboardId);
      setTabValue(0); // Volta para a aba do dashboard
    }
  };

  const renderPermissionDialog = () => {
    return null; // Placeholder para o dialog de permissões
  };

  const renderMenuItems = (items: any[]) => {
    return items.map((item, index) => {
      return (
        // Verificar permissões de acesso para cada item específico
                  (() => {
                    let hasAccess = false;

                    // Verificar acesso baseado no tipo de item e permissões
                    if (item.text === "Área do Cliente") {
                      hasAccess = hasClienteAccess;
                    } else if (item.text === "Área Empresarial") {
                      hasAccess = hasEmpresarialAccess;
                    } else if (item.text === "Área Colaboradores") {
                      hasAccess = hasColaboradorAccess;
                                        } else if (item.text === "Dashboard") {
                      hasAccess = hasModulePermission(
                        hasColaboradorAccess ? 'colaborador' : 'empresarial', 
                        'dashboard', 
                        'visualizar'
                      );
                    } else if (item.text === "Relatórios") {
                      hasAccess = hasModulePermission(
                        hasColaboradorAccess ? 'colaborador' : 'empresarial', 
                        'relatorios', 
                        'visualizar'
                      );
                    } else if (item.text === "Financeiro") {
                      hasAccess = hasModulePermission(
                        hasColaboradorAccess ? 'colaborador' : 'empresarial', 
                        'financeiro', 
                        'visualizar'
                      );
                    } else if (item.text === "Gestão de Usuários") {
                      hasAccess = hasUserManagement;
                    } else if (item.text === "Gestão de Permissões") {
                      hasAccess = hasPermissionManagement;
                    } else if (item.text === "Configurações") {
                      hasAccess = hasModulePermission('colaborador', 'configuracoes', 'visualizar');
                    } else {
                      // Para outros itens, verificar se o usuário tem alguma área de acesso
                      hasAccess = hasClienteAccess || hasEmpresarialAccess || hasColaboradorAccess;
                    }

                    return hasAccess ? (
                      <Link href={item.path || '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItem button className={`${classes.menuItem} ${classes.menuItemAuthenticated}`}>
                          <ListItemIcon className={classes.menuItemIcon}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.text} 
                            className={classes.menuItemText}
                          />
                          {item.status && (
                            <Box className={classes.statusBadge}>
                              <Typography variant="caption" className={classes.statusText}>
                                {item.status}
                              </Typography>
                            </Box>
                          )}
                        </ListItem>
                      </Link>
                    ) : (
                      <ListItem className={`${classes.menuItem} ${classes.lockedItem}`}>
                        <ListItemIcon className={classes.menuItemIcon}>
                          <Lock />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.text} 
                          className={classes.menuItemText}
                        />
                        <Chip 
                          label="Sem Acesso" 
                          size="small" 
                          style={{ 
                            backgroundColor: '#f44336', 
                            color: 'white', 
                            fontSize: '0.6rem',
                            height: '18px'
                          }}
                        />
                      </ListItem>
                    );
                  })()
      );
    });
  };

  // Verificar se está carregando
  if (carregando) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <CircularProgress size={60} style={{ color: '#fff' }} />
      </div>
    );
  }

  // Verificar se está autenticado
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  return (
    <div className={classes.root} onContextMenu={handleContextMenu}>
      <CssBaseline />

      {/* Barra de Status */}
      <div className={classes.statusBar} />

      {/* Widget Inteligente */}
      <motion.div 
        className={classes.smartWidget}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
    
        <Typography variant="caption">
          {realtimeUsers} usuários online
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={performanceMetrics.cpu} 
          style={{ marginTop: 4, height: 4, borderRadius: 2 }}
        />
      </motion.div>

      {/* Notificação Inteligente */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <motion.div
            className={classes.smartNotification}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
          >
            <Alert severity="success" onClose={() => setNotifications([])}>
              {notifications[0]?.message}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Principal */}
      <Paper className={classes.header}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          
         
           {/* Informações de perfil do usuário */}
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing(-3) }}>
            <Avatar
              src={usuario?.imagemUrl || '/betologo.jpeg'}
              style={{ width: 50, height: 50, marginRight: theme.spacing(1) }}
            >
              {usuario?.nome?.charAt(0)?.toUpperCase() || usuario?.email?.charAt(0)?.toUpperCase() || '?'}
            </Avatar>
            <div>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                {usuario?.nome || usuario?.email || 'Usuário'}
              </Typography>
               <Box className={classes.chipContainer}>
            <Chip 
              label="Online" 
              size="small" 
              className={classes.permissionChip}
              style={{ backgroundColor: '#4caf50' }}
            />
            {usuario?.permissao && (
              <Chip 
                label={usuario.permissao}
                size="small"
                className={classes.permissionChip}
                style={{ 
                  backgroundColor: usuario.permissao === 'Administrador' ? '#f44336' : 
                                  usuario.permissao === 'CEO' ? '#9c27b0' :
                                  usuario.permissao === 'EnygmaDeveloper' ? '#00bcd4' :
                                  usuario.permissao === 'Colaborador' ? '#ff9800' : '#2196f3'
                }}
              />
            )}

            {/* Chips de áreas de acesso */}
            {hasClienteAccess && (
              <Chip 
                label="Cliente"
                size="small"
                style={{ 
                  backgroundColor: '#4caf50', 
                  color: 'white',
                  fontSize: '0.6rem',
                  height: '18px'
                }}
              />
            )}
            {hasEmpresarialAccess && (
              <Chip 
                label="Empresa"
                size="small"
                style={{ 
                  backgroundColor: '#2196f3', 
                  color: 'white',
                  fontSize: '0.6rem',
                  height: '18px'
                }}
              />
            )}
            {hasColaboradorAccess && (
              <Chip 
                label="Colaborador"
                size="small"
                style={{ 
                  backgroundColor: '#ff9800', 
                  color: 'white',
                  fontSize: '0.6rem',
                  height: '18px'
                }}
              />
            )}
          </Box>
            </div>
          </div>
           
         
        </motion.div>
      </Paper>

      {/* Container Principal */}
      <Container maxWidth="xl">



       
        {/* Sistema de Tabs */}
        <Paper className={classes.tabsContainer}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            className={classes.tabs}
          >
            <Tab 
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DashboardIcon style={{ marginRight: 8 }} />
                  Dashboard
                </div>
              } 
            />
            <Tab 
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Chat style={{ marginRight: 8 }} />
                  Chat
                </div>
              } 
            />
            <Tab 
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <EmojiObjects style={{ marginRight: 8 }} />
                  IA Lívia
                </div>
              } 
            />
            <Tab 
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Business style={{ marginRight: 8 }} />
                  CRM
                </div>
              } 
            />
            <Tab 
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Timeline style={{ marginRight: 8 }} />
                  Feed
                </div>
              } 
            />
            <Tab 
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <People style={{ marginRight: 8 }} />
                  Usuários
                </div>
              } 
            />
            <Tab 
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <WhatsApp style={{ marginRight: 8 }} />
                  WhatsApp
                </div>
              } 
            />
            
            <Tab 
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Security style={{ marginRight: 8 }} />
                  Permissões
                </div>
              } 
            />
            <Tab 
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Assignment style={{ marginRight: 8 }} />
                  Dashboard Documentos
                </div>
              } 
            />
            <Tab 
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Assignment style={{ marginRight: 8 }} />
                  Localizador Clientes
                </div>
              } 
            />
            <Tab 
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <WhatsApp style={{ marginRight: 8 }} />
                  WhatsApp MULT
                </div>
              } 
            />
          </Tabs>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            {viewingDashboard ? (
              <div style={{ position: 'relative' }}>
                {/* Header para mostrar qual dashboard está sendovisualizado */}
<div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '16px 24px',
                  background: 'linear-gradient(135deg,rgb(162, 164, 170) 0%,rgb(17, 114, 33) 100%)',
                  color: 'white',
                  borderRadius: '12px 12px 0 0',
                  marginBottom: 0
                }}>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    📊 {dashboardsData.find(d => d.id === viewingDashboard)?.nome || 'Dashboard'}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setViewingDashboard(null)}
                    style={{ 
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }}
                    startIcon={<ArrowBack />}
                  >
                    Voltar ao Dashboard Principal
                  </Button>
                </div>

                {/* Conteúdo do Dashboard específico */}
                {viewingDashboard === 'requerimentos' && (
                  <div style={{ 
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    overflow: 'hidden'
                  }}>
                    <BetoDashboard />
                  </div>
                )}

                {viewingDashboard === 'geral' && (
                  <div style={{ 
                    padding: '24px',
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" style={{ marginBottom: 16 }}>
                      🎯 Dashboard Geral - Visão Completa
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Dashboard com visão geral de todos os documentos será implementado aqui.
                    </Typography>
                  </div>
                )}

                {viewingDashboard === 'transferencias' && (
                  <div style={{ 
                    padding: '24px',
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" style={{ marginBottom: 16 }}>
                      🚗 Dashboard Transferências
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Dashboard de controle de transferências será implementado aqui.
                    </Typography>
                  </div>
                )}

                {viewingDashboard === 'digital' && (
                  <div style={{ 
                    padding: '24px',
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" style={{ marginBottom: 16 }}>
                      💾 Dashboard Digital
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Dashboard de documentos digitais será implementado aqui.
                    </Typography>
                  </div>
                )}

                {viewingDashboard === 'empresarial' && (
                  <div style={{ 
                    padding: '24px',
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" style={{ marginBottom: 16 }}>
                      🏢 Dashboard Empresarial
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Dashboard de documentos empresariais será implementado aqui.
                    </Typography>
                  </div>
                )}

                {viewingDashboard === 'anuencia' && (
                  <div style={{ 
                    padding: '24px',
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" style={{ marginBottom: 16 }}>
                      🔐 Dashboard Anuência
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Dashboard de controle de anuências será implementado aqui.
                    </Typography>
                  </div>
                )}

                {viewingDashboard === 'documentos' && (
                  <div style={{ 
                    padding: '24px',
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" style={{ marginBottom: 16 }}>
                      📄 Dashboard Documentos
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Dashboard de gerenciamento de documentos será implementado aqui.
                    </Typography>
                  </div>
                )}
              </div>
            ) : (
              <DashboardIA />
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <ChatInterno />
          </TabPanel>

          <TabPanel value={tabValue} index={10}>
            {/* WhatsApp Tab */}
        {tabValue === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {whatsappExpanded ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <WhatsAppTabs />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  padding: 20, 
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 12,
                  margin: 16
                }}
              >
                <WhatsApp style={{ fontSize: 48, color: '#25D366', marginBottom: 16 }} />
                <Typography variant="h6" gutterBottom>
                  Sistema WhatsApp Multi-Plataforma
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
                  Clique novamente na aba para expandir e acessar o WhatsApp Business, Pessoal e Digisac
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<WhatsApp />}
                  onClick={() => setWhatsappExpanded(true)}
                  style={{
                    background: 'linear-gradient(45deg, #25D366 30%, #128c7e 90%)',
                    color: 'white'
                  }}
                >
                  Expandir WhatsApp Center
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
          </TabPanel>
           <TabPanel value={tabValue} index={2}>
            <ChatIA  />
          </TabPanel>


          <TabPanel value={tabValue} index={3}>
            <CRM />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Feed />
          </TabPanel>

          <TabPanel value={tabValue} index={5}>
            {/* Gestão de Usuários */}
            <Container maxWidth="lg" style={{ padding: '24px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Typography variant="h4" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                  👥 Gestão de Usuários ({usuariosList?.length || 0})
                </Typography>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() => {
                      setIsLoading(true);
                      carregarUsuarios().finally(() => setIsLoading(false));
                    }}
                    disabled={isLoading}
                    style={{ borderRadius: 8 }}
                  >
                    Recarregar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setNewUserDialogOpen(true)}
                    style={{ borderRadius: 8 }}
                    disabled={!hasUserManagementPermission()}
                  >
                    Novo Usuário
                  </Button>
                </div>
              </div>

              <TableContainer 
                component={Paper} 
                style={{ 
                  borderRadius: isMobile ? 8 : 12, 
                  boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 16px rgba(0,0,0,0.1)',
                  overflowX: 'auto'
                }}
              >
                <Table size={isMobile ? 'small' : 'medium'}>
                  <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell style={{ minWidth: isMobile ? 120 : 150 }}>
                        <strong>Usuário</strong>
                      </TableCell>
                      {!isMobile && <TableCell><strong>Email</strong></TableCell>}
                      <TableCell><strong>Permissão</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell style={{ minWidth: 80 }}><strong>Ações</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usuariosList && usuariosList.length > 0 ? (
                      usuariosList.map((usuario, index) => (
                        <TableRow key={usuario.id || usuario.email || index} hover>
                          <TableCell>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={usuario.imagemUrl || '/betologo.jpeg'}
                                style={{ 
                                  width: isMobile ? 32 : 40, 
                                  height: isMobile ? 32 : 40, 
                                  marginRight: isMobile ? 8 : 12 
                                }}
                              >
                                {usuario.nome?.charAt(0)?.toUpperCase() || usuario.email?.charAt(0)?.toUpperCase() || '?'}
                              </Avatar>
                              <div>
                                <Typography 
                                  variant="body1" 
                                  style={{ 
                                    fontWeight: 'bold',
                                    fontSize: isMobile ? '0.8rem' : undefined
                                  }}
                                >
                                  {usuario.nome || usuario.email || 'Nome não informado'}
                                </Typography>
                                {isMobile && (
                                  <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.7rem' }}>
                                    {usuario.email}
                                  </Typography>
                                )}
                                <Typography 
                                  variant="caption" 
                                  color="textSecondary"
                                  style={{ fontSize: isMobile ? '0.65rem' : undefined }}
                                >
                                  ID: {usuario.id || usuario.email || 'N/A'}
                                </Typography>
                              </div>
                            </div>
                          </TableCell>
                          {!isMobile && (
                            <TableCell>
                              <Typography variant="body2" style={{ fontSize: isMobile ? '0.75rem' : undefined }}>
                                {usuario.email || 'Email não informado'}
                              </Typography>
                            </TableCell>
                          )}
                          <TableCell>
                            <Chip
                              label={usuario.permissao || 'Visualizador'}
                              color={usuario.permissao === 'Administrador' ? 'secondary' : 'default'}
                              size="small"
                              style={{
                                fontSize: isMobile ? '0.65rem' : undefined,
                                height: isMobile ? 20 : undefined
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={usuario.ativo !== false}
                                  onChange={() => handleToggleUserStatus(usuario)}
                                  color="primary"
                                  size="small"
                                />
                              }
                              label={usuario.ativo !== false ? 'Ativo' : 'Inativo'}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={(e) => handleUserMenuClick(e, usuario)}
                              size="small"
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} style={{ textAlign: 'center', padding: '48px' }}>
                          <Typography variant="h6" color="textSecondary">
                            {isLoading ? 'Carregando usuários...' : 'Nenhum usuário encontrado'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                            {!isLoading && 'Adicione o primeiro usuário clicando no botão "Novo Usuário"'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Menu de Contexto do Usuário */}
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
              >
                <MenuItem onClick={() => handleOpenPermissionManager(selectedUser)}>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText primary="Gerenciar Permissões" />
                </MenuItem>
                <MenuItem onClick={() => handleEditUser(selectedUser)}>
                  <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                  <ListItemText>Editar</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleDeleteUser(selectedUser)}>
                  <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
                  <ListItemText>Excluir</ListItemText>
                </MenuItem>
              </Menu>
            </Container>
          </TabPanel>

          <TabPanel value={tabValue} index={6}>
            <WhatsAppDigisac />
          </TabPanel>

          <TabPanel value={tabValue} index={7}>
            {/* Sistema de Permissões */}
            <Container maxWidth="lg" style={{ padding: '24px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Typography variant="h4" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                  🔐 Sistema de Permissões
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => setNewProfileDialogOpen(true)}
                  style={{ borderRadius: 8 }}
                >
                  Novo Perfil
                </Button>
              </div>

              <Grid container spacing={isMobile ? 2 : 3}>
                {accessProfiles.map((profile) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={profile.id}>
                    <Card className={classes.card} style={{ height: '100%' }}>
                      <CardContent>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                          {profile.icon}
                          <Typography variant="h6" style={{ marginLeft: 8, fontWeight: 'bold' }}>
                            {profile.nome}
                          </Typography>
                        </div>
                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
                          {profile.descricao}
                        </Typography>
                        <div style={{ marginBottom: 16 }}>
                          <Chip
                            label={`${profile.usuarios} usuários`}
                            size="small"
                            style={{ backgroundColor: profile.color, color: 'white' }}
                          />
                        </div>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="primary"
                          onClick={() => handleOpenPermissionDialog(profile)}
                          startIcon={<Settings />}
                        >
                          Configurar Permissões
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </TabPanel>

          <TabPanel value={tabValue} index={8}>
            {/* Dashboard Documentos */}
            <Container maxWidth="lg" style={{ padding: '24px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Typography variant="h4" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                  📊 Dashboard Documentos
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  style={{ borderRadius: 8 }}
                >
                  Novo Dashboard
                </Button>
              </div>

              <Grid container spacing={isMobile ? 2 : 3}>
                {dashboardsData.map((dashboard) => (
                  <Grid item xs={12} sm={6} md={6} lg={6} key={dashboard.id}>
                    <Card className={classes.card}>
                      <CardContent>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                          {dashboard.icon}
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                              {dashboard.nome}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {dashboard.descricao}
                            </Typography>
                            <Typography variant="caption" style={{ color: dashboard.color }}>
                              {dashboard.documentos} documentos
                            </Typography>
                          </div>
                          <IconButton
                            onClick={() => handleDashboardExpand(dashboard.id)}
                            size="small"
                          >
                            {dashboardExpanded === dashboard.id ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </div>

                        <Collapse in={dashboardExpanded === dashboard.id}>
                          <Typography variant="subtitle2" style={{ marginBottom: 8, fontWeight: 'bold' }}>
                            Ações Disponíveis:
                          </Typography>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {dashboard.acoes.map((acao) => (
                              <Button
                                key={acao.id}
                                size="small"
                                variant="outlined"
                                startIcon={acao.icon}
                                onClick={() => handleDashboardAction(dashboard.id, acao.id)}
                                style={{ borderColor: acao.color, color: acao.color }}
                              >
                                {acao.nome}
                              </Button>
                            ))}
                          </div>
                        </Collapse>
                      </CardContent>     
                        </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </TabPanel>

          <TabPanel value={tabValue} index={9}>
            {/* Localizador de Clientes */}
            <ClienteLocalizador />
          </TabPanel>
          
        </Paper>
      </Container>
      <TabPanel value={tabValue} index={10}>
            <WhatsAppTabs />
          </TabPanel>

      {/* SpeedDial IA */}
      <div className={classes.aiAssistant}>
        <SpeedDial
          ariaLabel="IA Assistant"
          className={classes.speedDial}
          icon={<SpeedDialIcon icon={<EmojiObjects />} openIcon={<Close />} />}
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
          open={speedDialOpen}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleSmartAction(action.name)}
              style={{ backgroundColor: action.color }}
            />
          ))}
        </SpeedDial>
      </div>

      {/* Widget Flutuante */}
      <motion.div
        className={classes.floatingWidget}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleVoiceMode}
      >
        {voiceMode ? <MicOff /> : <Mic />}
      </motion.div>

      {/* Indicador de Voz */}
      <AnimatePresence>
        {voiceMode && (
          <motion.div
            className={classes.voiceIndicator}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <RecordVoiceOver className={classes.pulsingIcon} />
            <Typography variant="caption">Escutando...</Typography>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Contextual */}
      {contextualMenu && (
        <div
          className={classes.contextualMenu}
          style={{
            top: contextualMenu.y,
            left: contextualMenu.x,
          }}
          onClick={() => setContextualMenu(null)}
        >
          <List dense>
            <ListItem button onClick={() => handleSmartAction('quick-action')}>
              <ListItemIcon><Extension /></ListItemIcon>
              <ListItemText primary="Ação Rápida" />
            </ListItem>
            <ListItem button onClick={() => handleSmartAction('analyze')}>
              <ListItemIcon><Extension /></ListItemIcon>
              <ListItemText primary="Analisar" />
            </ListItem>
          </List>
        </div>
      )}

      {/* Overlay de Carregamento */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className={classes.loadingOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CircularProgress size={60} style={{ color: '#667eea' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog - Novo Usuário */}
      <Dialog 
        open={newUserDialogOpen} 
        onClose={() => setNewUserDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          style: {
            margin: isMobile ? 0 : 32,
            borderRadius: isMobile ? 0 : 8
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
            <Add style={{ marginRight: 8 }} />
            Adicionar Novo Usuário
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ marginTop: 8 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={newUserData.nome}
                onChange={(e) => handleNewUserInputChange('nome', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUserData.email}
                onChange={(e) => handleNewUserInputChange('email', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Senha"
                type="password"
                value={newUserData.senha}
                onChange={(e) => handleNewUserInputChange('senha', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Permissão</InputLabel>
                <Select
                  value={newUserData.permissao}
                  onChange={(e) => handleNewUserInputChange('permissao', e.target.value as string)}
                  label="Permissão"
                >
                                    <MenuItem value="cliente">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Person style={{ color: '#4caf50', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Área Cliente</div>
                        <div style={{ fontSize: '0.75rem',color: '#666' }}>Acesso apenas à área do cliente</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="empresa">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Business style={{ color: '#2196f3', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Área Empresarial</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Acesso apenas à área empresarial</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="colaborador">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <People style={{ color: '#ff9800', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Colaborador</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Acesso à área de colaboradores</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="administrador">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Security style={{ color: '#f44336', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Administrador</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Acesso total ao sistema</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="Visualizador">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Visibility style={{ color: '#9e9e9e', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Visualizador</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Acesso apenas visualização básica</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="Operador">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Build style={{ color: '#607d8b', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Operador</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Operações básicas do sistema</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="CEO">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Star style={{ color: '#9c27b0', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>CEO</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Acesso executivo total</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="EnygmaDeveloper">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Code style={{ color: '#00bcd4', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>EnygmaDeveloper</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Desenvolvedor do sistema</div>
                      </div>
                    </div>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewUserDialogOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleNewUserSubmit} color="primary" variant="contained" disabled={!hasUserManagementPermission()}>
            Criar Usuário
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog - Editar Usuário */}
      <Dialog 
        open={editUserDialogOpen} 
        onClose={() => setEditUserDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          style: {
            margin: isMobile ? 0 : 32,
            borderRadius: isMobile ? 0 : 8
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
            <Edit style={{ marginRight: 8 }} />
            Editar Usuário
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ marginTop: 8 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={editUserData.nome}
                onChange={(e) => handleEditUserInputChange('nome', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editUserData.email}
                onChange={(e) => handleEditUserInputChange('email', e.target.value)}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Permissão</InputLabel>
                <Select
                  value={editUserData.permissao}
                  onChange={(e) => handleEditUserInputChange('permissao', e.target.value as string)}
                  label="Permissão"
                >
                  <MenuItem value="cliente">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Person style={{ color: '#4caf50', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Área Cliente</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Acesso apenas à área do cliente</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="empresa">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Business style={{ color: '#2196f3', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Área Empresarial</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Acesso apenas à área empresarial</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="colaborador">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <People style={{ color: '#ff9800', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Colaborador</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Acesso à área de colaboradores</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="administrador">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Security style={{ color: '#f44336', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Administrador</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Acesso total ao sistema</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="Visualizador">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Visibility style={{ color: '#9e9e9e', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Visualizador</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Acesso apenas visualização básica</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="Operador">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Build style={{ color: '#607d8b', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>Operador</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Operações básicas do sistema</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="CEO">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Star style={{ color: '#9c27b0', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>CEO</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Acesso executivo total</div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="EnygmaDeveloper">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Code style={{ color: '#00bcd4', fontSize: 18 }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>EnygmaDeveloper</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Desenvolvedor do sistema</div>
                      </div>
                    </div>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editUserData.ativo}
                    onChange={(e) => handleEditUserInputChange('ativo', e.target.checked)}
                    color="primary"
                  />
                }
                label="Usuário Ativo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserDialogOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleEditUserSubmit} color="primary" variant="contained" disabled={!hasUserManagementPermission()}>
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog - Confirmar Exclusão */}
      <Dialog open={deleteUserDialogOpen} onClose={() => setDeleteUserDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o usuário <strong>{userToDelete?.nome}</strong>?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserDialogOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmDeleteUser} color="primary" variant="contained" disabled={!hasUserManagementPermission()}>
            Confirmar Exclusão
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog - Novo Perfil */}
      <Dialog 
        open={newProfileDialogOpen} 
        onClose={() => setNewProfileDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          style: {
            margin: isMobile ? 0 : 32,
            borderRadius: isMobile ? 0 : 8
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
            <Add style={{ marginRight: 8 }} />
            Criar Novo Perfil de Acesso
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} style={{ marginTop: 8 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Perfil"
                value={newProfileData.nome}
                onChange={(e) => handleNewProfileInputChange('nome', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Descrição"
                value={newProfileData.descricao}
                onChange={(e) => handleNewProfileInputChange('descricao', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginTop: 16, marginBottom: 16 }}>
                Permissões do Módulo
              </Typography>
              <Grid container spacing={2}>
                {Object.keys(newProfileData.permissoes).map((permissao) => (
                  <Grid item xs={12} sm={6} md={4} key={permissao}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newProfileData.permissoes[permissao as keyof typeof newProfileData.permissoes]}
                          onChange={(e) => handleNewProfileInputChange(`permissoes.${permissao}`, e.target.checked)}
                          color="primary"
                        />
                      }
                      label={permissao.charAt(0).toUpperCase() + permissao.slice(1)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewProfileDialogOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleNewProfileSubmit} color="primary" variant="contained">
            Criar Perfil
          </Button>
        </DialogActions>
      </Dialog>




      {/* Dialog de Permissões */}
      {renderPermissionDialog()}

      {/* Snackbar para Notificações */}
      <Snackbar
        open={notifications.length > 0}
        autoHideDuration={6000}
        onClose={() => setNotifications([])}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setNotifications([])}>
          {notifications[0]?.message}
        </Alert>
      </Snackbar>

      {/* Gerenciador de Permissões */}
      <PermissionManagerComponent
        open={permissionDialogOpen}
        onClose={() => {
          setPermissionDialogOpen(false);
          setSelectedUserForPermissions(null);
        }}
        userId={selectedUserForPermissions?.uid}
        userProfile={selectedUserForPermissions?.permissionProfile || selectedUserForPermissions?.permissao}
      />
        {/* Ações Rápidas (Menu inferior direito) */}
      <SpeedDial
        ariaLabel="Ações Rápidas"
        className={classes.speedDial}
        style={{ 
          position: 'fixed', 
          bottom: isMobile ? theme.spacing(1) : theme.spacing(2), 
          right: isMobile ? theme.spacing(1) : theme.spacing(2),
          zIndex: 1000
        }}
        icon={<SpeedDialIcon />}
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => setSpeedDialOpen(true)}
        open={speedDialOpen}
        direction={isMobile ? 'up' : 'up'}
        FabProps={{
          style: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            width: isMobile ? 48 : 56,
            height: isMobile ? 48 : 56,
          },
        }}
      >
        {[
              { icon: <WhatsApp />, label: "WhatsApp", color: "#25d366" as string | undefined },
              ...(hasClienteAccess ? [{ 
                icon: <Person />, 
                label: "Área Cliente", 
                path: "/area-cliente", 
                color: "#4caf50" as string | undefined 
              }] : []),
              ...(hasEmpresarialAccess ? [{ 
                icon: <Business />, 
                label: "Área Empresarial", 
                path: "/beto/empresas", 
                color: "#2196f3" as string | undefined 
              }] : []),
              ...(hasColaboradorAccess ? [{ 
                icon: <People />, 
                label: "Área Colaborador", 
                path: "/colaboradores", 
                color: "#ff9800" as string | undefined 
              }] : []),
              ...(hasUserManagement ? [{ 
                icon: <Security />, 
                label: "Gerenciar Usuários", 
                path: "/colaboradores#usuarios", 
                color: "#9c27b0" as string | undefined 
              }] : [])
            ].map((btn, index) => (
          <SpeedDialAction
            key={index}
            icon={btn.icon}
            tooltipTitle={btn.label}
            onClick={() => {
              setSpeedDialOpen(false);
              if (btn.path) {
                router.push(btn.path);
              }
            }}
            FabProps={{
              style: {
                backgroundColor: btn.color || theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
              },
            }}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default Colaboradores;

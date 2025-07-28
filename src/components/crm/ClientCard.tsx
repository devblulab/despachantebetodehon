
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  Box
} from '@material-ui/core';
import {
  DragHandle,
  WhatsApp,
  Email,
  Edit,
  Delete,
  Phone,
  AttachMoney,
  Business,
  Star,
  TrendingUp
} from '@material-ui/icons';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  clientCard: {
    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(76, 175, 80, 0.3)',
    cursor: 'grab',
    transition: 'all 0.3s ease',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
    },
    '&.dragging': {
      cursor: 'grabbing',
      transform: 'rotate(5deg)',
      opacity: 0.8,
    },
  },
  dragHandle: {
    position: 'absolute',
    top: 8,
    left: 8,
    cursor: 'grab',
    color: 'rgba(255,255,255,0.7)',
    '&:active': {
      cursor: 'grabbing',
    },
  },
  clientInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  clientAvatar: {
    marginRight: theme.spacing(1),
    width: 40,
    height: 40,
  },
  valueChip: {
    background: 'linear-gradient(45deg, #4CAF50, #81C784)',
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(1),
    justifyContent: 'flex-end',
  },
  scoreBar: {
    height: 4,
    borderRadius: 2,
    marginTop: theme.spacing(1),
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  scoreBarHigh: {
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#4CAF50',
    },
  },
  scoreBarMedium: {
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#FF9800',
    },
  },
  scoreBarLow: {
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#F44336',
    },
  },
  serviceChip: {
    margin: theme.spacing(0.25),
    fontSize: '0.7rem',
    height: 18,
  }
}));

interface ClientCardProps {
  cliente: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    empresa?: string;
    avatar?: string;
    status: 'lead' | 'prospect' | 'cliente' | 'perdido';
    valor: number;
    score: number;
    potencial: 'alto' | 'medio' | 'baixo';
    servicos: string[];
  };
  dragHandleProps: any;
  isDragging: boolean;
  onEdit: () => void;
  onDelete: () => void;
  getStatusColor: (status: string) => string;
  getPotentialColor: (potencial: string) => string;
}

const ClientCard: React.FC<ClientCardProps> = ({
  cliente,
  dragHandleProps,
  isDragging,
  onEdit,
  onDelete,
  getStatusColor,
  getPotentialColor
}) => {
  const classes = useStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`${classes.clientCard} ${isDragging ? 'dragging' : ''}`}>
        <div {...dragHandleProps} className={classes.dragHandle}>
          <DragHandle />
        </div>
        
        <div className={classes.clientInfo}>
          <Avatar
            src={cliente.avatar}
            className={classes.clientAvatar}
            style={{ backgroundColor: getStatusColor(cliente.status) }}
          >
            {cliente.nome[0]?.toUpperCase()}
          </Avatar>
          <div style={{ flex: 1 }}>
            <Typography variant="subtitle2" style={{ color: '#fff', fontWeight: 'bold' }}>
              {cliente.nome}
            </Typography>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {cliente.empresa || cliente.email}
            </Typography>
          </div>
        </div>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip
            label={`R$ ${cliente.valor.toLocaleString()}`}
            className={classes.valueChip}
            size="small"
            icon={<AttachMoney />}
          />
          <Chip
            label={cliente.potencial}
            size="small"
            style={{
              backgroundColor: getPotentialColor(cliente.potencial),
              color: '#fff',
              fontSize: '0.7rem'
            }}
          />
        </Box>

        <Box mb={1}>
          <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Score: {cliente.score}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={cliente.score}
            className={`${classes.scoreBar} ${
              cliente.score > 75 
                ? classes.scoreBarHigh 
                : cliente.score > 50 
                ? classes.scoreBarMedium 
                : classes.scoreBarLow
            }`}
          />
        </Box>

        {cliente.servicos.length > 0 && (
          <Box mb={1}>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>
              Serviços:
            </Typography>
            <Box display="flex" flexWrap="wrap">
              {cliente.servicos.slice(0, 2).map((servico, index) => (
                <Chip
                  key={index}
                  label={servico}
                  size="small"
                  className={classes.serviceChip}
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                />
              ))}
              {cliente.servicos.length > 2 && (
                <Chip
                  label={`+${cliente.servicos.length - 2}`}
                  size="small"
                  className={classes.serviceChip}
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                />
              )}
            </Box>
          </Box>
        )}

        <div className={classes.actionButtons}>
          <IconButton
            size="small"
            style={{ color: '#25D366' }}
            onClick={() => window.open(`https://wa.me/55${cliente.telefone?.replace(/\D/g, '')}`, '_blank')}
            title="WhatsApp"
          >
            <WhatsApp fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            style={{ color: '#2196F3' }}
            onClick={() => window.open(`mailto:${cliente.email}`, '_blank')}
            title="Email"
          >
            <Email fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            style={{ color: '#FF9800' }}
            onClick={onEdit}
            title="Editar"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            style={{ color: '#F44336' }}
            onClick={onDelete}
            title="Excluir"
          >
            <Delete fontSize="small" />
          </IconButton>
        </div>
      </Card>
    </motion.div>
  );
};

export default ClientCard;

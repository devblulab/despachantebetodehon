
import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Tabs,
  Tab,
  Box,
  Badge,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import {
  WhatsApp,
  Business,
  Person,
  Extension,
  Settings,
  Refresh,
  CheckCircle,
  Warning,
  Memory,
  TrendingUp,
  Assessment,
  Notifications
} from '@material-ui/icons';
import CropFreeIcon from '@material-ui/icons/CropFree';


import WhatsAppBusinessTab from './WhatsAppDigisacTab';
import WhatsAppPessoalTab from './WhatsAppPessoalTab';
import WhatsAppDigisacTab from './WhatsAppDigisacTab';

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
    padding: theme.spacing(2),
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  tabsContainer: {
    backgroundColor: '#ffffff',
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  tabs: {
    '& .MuiTab-root': {
      minWidth: 'auto',
      padding: theme.spacing(1.5, 3),
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      color: '#666',
      '&.Mui-selected': {
        color: '#128c7e',
        fontWeight: 700
      }
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#128c7e',
      height: 3,
      borderRadius: '3px 3px 0 0'
    }
  },
  tabContent: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#ffffff'
  },
  statusCard: {
    margin: theme.spacing(1),
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    color: 'white',
    borderRadius: 12
  },
  connectionIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1)
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#4caf50',
    display: 'inline-block'
  },
  tabPanel: {
    height: '100%',
    minHeight: '600px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  },
  digisacBrand: {
    background: 'linear-gradient(45deg, #FF6B35 30%, #f7931e 90%)',
    color: 'white'
  }
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
      id={`whatsapp-tabpanel-${index}`}
      aria-labelledby={`whatsapp-tab-${index}`}
      className={classes.tabPanel}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default function WhatsAppTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tabValue, setTabValue] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState({
    business: false,
    pessoal: false,
    digisac: true // Digisac já conectado via API
  });
  const [notifications, setNotifications] = useState({
    business: 5,
    pessoal: 2,
    digisac: 12
  });

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    event.preventDefault();
    setTabValue(newValue);
  };

  const refreshConnections = useCallback(() => {
    console.log('Refreshing WhatsApp connections...');
    // Implementar lógica de refresh das conexões
  }, []);

  const getTabIcon = (type: string, connected: boolean) => {
    const iconProps = {
      style: { 
        marginRight: 8,
        color: connected ? '#4CAF50' : '#757575'
      }
    };

    switch (type) {
      case 'business':
        return <Business {...iconProps} />;
      case 'pessoal':
        return <Person {...iconProps} />;
      case 'digisac':
        return <Extension {...iconProps} />;
      default:
        return <WhatsApp {...iconProps} />;
    }
  };

  return (
    <div className={classes.root}>
      {/* Header */}
      <div className={classes.header}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <WhatsApp style={{ marginRight: 12, fontSize: 28 }} />
            <div>
              <Typography variant="h6" style={{ fontWeight: 700 }}>
                WhatsApp Business Center
              </Typography>
              <Typography variant="caption" style={{ opacity: 0.8 }}>
                Gestão Integrada Multi-Plataforma
              </Typography>
            </div>
          </Box>
          
          <div className={classes.headerActions}>
            <Tooltip title="Atualizar Conexões">
              <IconButton 
                color="inherit" 
                onClick={refreshConnections}
                size="small"
              >
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Configurações">
              <IconButton color="inherit" size="small">
                <Settings />
              </IconButton>
            </Tooltip>
          </div>
        </Box>

        {/* Status Cards */}
        <Grid container spacing={1} style={{ marginTop: 8 }}>
          <Grid item xs={4}>
            <Card className={classes.statusCard} elevation={0}>
              <CardContent style={{ padding: '8px 12px' }}>
                <Box display="flex" alignItems="center" justifyContent="between">
                  <div>
                    <Typography variant="caption" style={{ opacity: 0.9 }}>
                      Business
                    </Typography>
                    <div className={classes.connectionIndicator}>
                      <div 
                        className={classes.statusDot}
                        style={{ 
                          backgroundColor: connectionStatus.business ? '#4CAF50' : '#f44336' 
                        }}
                      />
                      <Typography variant="caption">
                        {connectionStatus.business ? 'Conectado' : 'Offline'}
                      </Typography>
                    </div>
                  </div>
                  <Badge badgeContent={notifications.business} color="error">
                    <Business />
                  </Badge>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={4}>
            <Card className={classes.statusCard} elevation={0}>
              <CardContent style={{ padding: '8px 12px' }}>
                <Box display="flex" alignItems="center" justifyContent="between">
                  <div>
                    <Typography variant="caption" style={{ opacity: 0.9 }}>
                      Pessoal
                    </Typography>
                    <div className={classes.connectionIndicator}>
                      <div 
                        className={classes.statusDot}
                        style={{ 
                          backgroundColor: connectionStatus.pessoal ? '#4CAF50' : '#f44336' 
                        }}
                      />
                      <Typography variant="caption">
                        {connectionStatus.pessoal ? 'Conectado' : 'Offline'}
                      </Typography>
                    </div>
                  </div>
                  <Badge badgeContent={notifications.pessoal} color="error">
                    <Person />
                  </Badge>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={4}>
            <Card className={`${classes.statusCard} ${classes.digisacBrand}`} elevation={0}>
              <CardContent style={{ padding: '8px 12px' }}>
                <Box display="flex" alignItems="center" justifyContent="between">
                  <div>
                    <Typography variant="caption" style={{ opacity: 0.9 }}>
                      Digisac
                    </Typography>
                    <div className={classes.connectionIndicator}>
                      <div 
                        className={classes.statusDot}
                        style={{ 
                          backgroundColor: connectionStatus.digisac ? '#4CAF50' : '#f44336' 
                        }}
                      />
                      <Typography variant="caption">
                        {connectionStatus.digisac ? 'API Ativa' : 'Offline'}
                      </Typography>
                    </div>
                  </div>
                  <Badge badgeContent={notifications.digisac} color="error">
                    <Extension />
                  </Badge>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* Tabs */}
      <div className={classes.tabsContainer}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
          className={classes.tabs}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            label={
              <Box display="flex" alignItems="center">
                {getTabIcon('business', connectionStatus.business)}
                <span>WhatsApp Business</span>
                {notifications.business > 0 && (
                  <Badge 
                    badgeContent={notifications.business} 
                    color="error" 
                    style={{ marginLeft: 8 }}
                  />
                )}
              </Box>
            }
            id="whatsapp-tab-0"
            aria-controls="whatsapp-tabpanel-0"
          />
          <Tab
            label={
              <Box display="flex" alignItems="center">
                {getTabIcon('pessoal', connectionStatus.pessoal)}
                <span>WhatsApp Pessoal</span>
                {notifications.pessoal > 0 && (
                  <Badge 
                    badgeContent={notifications.pessoal} 
                    color="error" 
                    style={{ marginLeft: 8 }}
                  />
                )}
              </Box>
            }
            id="whatsapp-tab-1"
            aria-controls="whatsapp-tabpanel-1"
          />
          <Tab
            label={
              <Box display="flex" alignItems="center">
                {getTabIcon('digisac', connectionStatus.digisac)}
                <span>Digisac Business</span>
                {notifications.digisac > 0 && (
                  <Badge 
                    badgeContent={notifications.digisac} 
                    color="error" 
                    style={{ marginLeft: 8 }}
                  />
                )}
                <Chip 
                  label="AI" 
                  size="small" 
                  style={{ 
                    marginLeft: 8, 
                    backgroundColor: '#FF6B35', 
                    color: 'white',
                    fontSize: '0.7rem',
                    height: 18
                  }} 
                />
              </Box>
            }
            id="whatsapp-tab-2"
            aria-controls="whatsapp-tabpanel-2"
          />
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className={classes.tabContent}>
        <TabPanel value={tabValue} index={0}>
          <WhatsAppBusinessTab 
            isConnected={connectionStatus.business}
            onConnectionChange={(status) => 
              setConnectionStatus(prev => ({ ...prev, business: status }))
            }
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <WhatsAppPessoalTab 
            isConnected={connectionStatus.pessoal}
            onConnectionChange={(status) => 
              setConnectionStatus(prev => ({ ...prev, pessoal: status }))
            }
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <WhatsAppDigisacTab 
            isConnected={connectionStatus.digisac}
            onConnectionChange={(status) => 
              setConnectionStatus(prev => ({ ...prev, digisac: status }))
            }
          />
        </TabPanel>
      </div>
    </div>
  );
}

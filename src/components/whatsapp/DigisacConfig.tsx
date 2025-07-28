import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Box,
  Divider,
  
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';
import {
  CloudDownload,
  Assessment as Analytics,
  Toys as SmartToy,

  Settings,
  Security,
  Speed,
  CheckCircle,
  Warning,
  Extension,
  Notifications,
  ExpandMore,
  Sync,
  Business,
  Assessment,
  ContactPhone,
  Message,
  TrendingUp,
  VpnKey,
  Refresh,
  GetApp,
 
  MonetizationOn,
  Timeline,
  DataUsage
  
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  configCard: {
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  statusCard: {
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    color: 'white',
  },
  warningCard: {
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    color: 'black',
  },
  aiCard: {
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  metricsCard: {
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
  },
  digisacBrand: {
    background: '#FF6B35',
    color: 'white',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  statItem: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  connectionIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  featureList: {
    '& .MuiListItem-root': {
      paddingLeft: 0,
      paddingRight: 0
    }
  }
}));

interface DigisacConfigProps {
  open: boolean;
  onClose: () => void;
}

const DigisacConfig: React.FC<DigisacConfigProps> = ({ open, onClose }) => {
  const classes = useStyles();
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_DIGISAC_TOKEN || '');
  const [serviceId, setServiceId] = useState(process.env.NEXT_PUBLIC_DIGISAC_SERVICE_ID || '');
  const [webhookUrl, setWebhookUrl] = useState('https://api.example.com/webhook');
  const [autoSync, setAutoSync] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [aiSalesBot, setAiSalesBot] = useState(true);
  const [autoResponses, setAutoResponses] = useState(true);
  const [leadScoring, setLeadScoring] = useState(true);
  const [sentimentAnalysis, setSentimentAnalysis] = useState(true);

  const integrationStatus = {
    api: true,
    webhook: true,
    sync: true,
    contacts: 1247,
    messages: 8932,
    leads: 89,
    conversions: 21,
    lastSync: new Date(),
    avgResponseTime: '1.5min',
    conversionRate: 23.5,
    satisfaction: 94
  };

  const aiMetrics = {
    messagesProcessed: 2847,
    leadsGenerated: 156,
    salesClosed: 34,
    revenue: 125000,
    aiAccuracy: 96.8,
    responseTime: 0.3
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Extension style={{ marginRight: 8, color: '#FF6B35' }} />
            Configurações Digisac + IA de Vendas
          </div>
          <Chip
            label="CONECTADO"
            style={{ backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold' }}
            icon={<CheckCircle />}
          />
        </div>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Branding Digisac */}
          <Grid item xs={12}>
            <div className={classes.digisacBrand}>
              <Typography variant="h5" gutterBottom>
                🚀 DIGISAC BUSINESS AI
              </Typography>
              <Typography variant="body2">
                Plataforma Avançada de WhatsApp Business com Inteligência Artificial
              </Typography>
            </div>
          </Grid>

          {/* Status da Integração */}
          <Grid item xs={12} md={6}>
            <Card className={classes.statusCard}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <CheckCircle style={{ marginRight: 8 }} />
                  Status da Integração
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} className={classes.statItem}>
                    <Typography variant="h4">{integrationStatus.contacts}</Typography>
                    <Typography variant="caption">Contatos</Typography>
                  </Grid>
                  <Grid item xs={6} className={classes.statItem}>
                    <Typography variant="h4">{integrationStatus.messages}</Typography>
                    <Typography variant="caption">Mensagens</Typography>
                  </Grid>
                  <Grid item xs={6} className={classes.statItem}>
                    <Typography variant="h4">{integrationStatus.leads}</Typography>
                    <Typography variant="caption">Leads Ativos</Typography>
                  </Grid>
                  <Grid item xs={6} className={classes.statItem}>
                    <Typography variant="h4">{integrationStatus.conversions}</Typography>
                    <Typography variant="caption">Conversões</Typography>
                  </Grid>
                </Grid>
                <Divider style={{ margin: '16px 0', backgroundColor: 'rgba(255,255,255,0.3)' }} />
                <Typography variant="caption">
                  Última sincronização: {integrationStatus.lastSync.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Métricas de IA */}
          <Grid item xs={12} md={6}>
            <Card className={classes.aiCard}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <SmartToy style={{ marginRight: 8 }} />
                  IA de Vendas - Performance
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} className={classes.statItem}>
                    <Typography variant="h4">{aiMetrics.aiAccuracy}%</Typography>
                    <Typography variant="caption">Precisão IA</Typography>
                  </Grid>
                  <Grid item xs={6} className={classes.statItem}>
                    <Typography variant="h4">{aiMetrics.responseTime}s</Typography>
                    <Typography variant="caption">Tempo Resposta</Typography>
                  </Grid>
                  <Grid item xs={6} className={classes.statItem}>
                    <Typography variant="h4">{aiMetrics.leadsGenerated}</Typography>
                    <Typography variant="caption">Leads IA</Typography>
                  </Grid>
                  <Grid item xs={6} className={classes.statItem}>
                    <Typography variant="h4">R$ {(aiMetrics.revenue / 1000).toFixed(0)}k</Typography>
                    <Typography variant="caption">Receita IA</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Configurações da API */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  <VpnKey style={{ marginRight: 8 }} />
                  Configurações da API
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Chave da API Digisac"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      margin="normal"
                      type="password"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <VpnKey style={{ marginRight: 8, color: '#FF6B35' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Service ID"
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Extension style={{ marginRight: 8, color: '#FF6B35' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="URL do Webhook"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <DataUsage style={{ marginRight: 8, color: '#2196F3' }} />
                      }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Configurações de IA */}
          <Grid item xs={12} md={6}>
            <Card className={classes.configCard}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <SmartToy style={{ marginRight: 8 }} />
                  Inteligência Artificial
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={aiSalesBot}
                      onChange={(e) => setAiSalesBot(e.target.checked)}
                      color="secondary"
                    />
                  }
                  label="IA Sales Bot"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoResponses}
                      onChange={(e) => setAutoResponses(e.target.checked)}
                      color="secondary"
                    />
                  }
                  label="Respostas Automáticas"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={leadScoring}
                      onChange={(e) => setLeadScoring(e.target.checked)}
                      color="secondary"
                    />
                  }
                  label="Lead Scoring Automático"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={sentimentAnalysis}
                      onChange={(e) => setSentimentAnalysis(e.target.checked)}
                      color="secondary"
                    />
                  }
                  label="Análise de Sentimento"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Configurações de Sincronização */}
          <Grid item xs={12} md={6}>
            <Card className={classes.configCard}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Sync style={{ marginRight: 8 }} />
                  Sincronização
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                      color="secondary"
                    />
                  }
                  label="Sincronização Automática"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      color="secondary"
                    />
                  }
                  label="Notificações Push"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      color="secondary"
                    />
                  }
                  label="Analytics Avançado"
                />
                <div style={{ marginTop: 16 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Sync />}
                    style={{ borderColor: 'white', color: 'white', marginRight: 8 }}
                    size="small"
                  >
                    Sync Manual
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<GetApp />}
                    style={{ borderColor: 'white', color: 'white' }}
                    size="small"
                  >
                    Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Recursos Disponíveis */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">
                  <DataUsage style={{ marginRight: 8 }} />
                  Recursos Premium Ativos
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <List dense className={classes.featureList}>
                      <ListItem>
                        <ListItemIcon><DataUsage style={{ color: '#9C27B0' }} /></ListItemIcon>
                        <ListItemText 
                          primary="IA Sales Assistant" 
                          secondary="Respostas inteligentes para vendas"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><TrendingUp style={{ color: '#4CAF50' }} /></ListItemIcon>
                        <ListItemText 
                          primary="Lead Scoring Automático" 
                          secondary="Classificação inteligente de prospects"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Assessment style={{ color: '#2196F3' }} /></ListItemIcon>
                        <ListItemText 
                          primary="Analytics Avançado" 
                          secondary="Métricas detalhadas de performance"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><MonetizationOn style={{ color: '#FF9800' }} /></ListItemIcon>
                        <ListItemText 
                          primary="Forecast de Vendas" 
                          secondary="Previsões baseadas em IA"
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <List dense className={classes.featureList}>
                      <ListItem>
                        <ListItemIcon><Business style={{ color: '#E91E63' }} /></ListItemIcon>
                        <ListItemText 
                          primary="Campanhas Automáticas" 
                          secondary="Marketing personalizado via IA"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><DataUsage style={{ color: '#673AB7' }} /></ListItemIcon>
                        <ListItemText 
                          primary="Análise de Sentimento" 
                          secondary="Detecção de humor do cliente"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Timeline style={{ color: '#009688' }} /></ListItemIcon>
                        <ListItemText 
                          primary="Funil de Vendas IA" 
                          secondary="Otimização automática do processo"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><DataUsage style={{ color: '#795548' }} /></ListItemIcon>
                        <ListItemText 
                          primary="Big Data Integration" 
                          secondary="Integração com múltiplas fontes"
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Alertas e Performance */}
          <Grid item xs={12}>
            <Card className={classes.metricsCard}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Assessment style={{ marginRight: 8 }} />
                  Performance Dashboard
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <div className={classes.statItem}>
                      <Typography variant="h3" style={{ color: '#4CAF50' }}>
                        {integrationStatus.conversionRate}%
                      </Typography>
                      <Typography variant="caption">Taxa de Conversão</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={integrationStatus.conversionRate} 
                        style={{ marginTop: 8, height: 6, borderRadius: 3 }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <div className={classes.statItem}>
                      <Typography variant="h3" style={{ color: '#2196F3' }}>
                        {integrationStatus.avgResponseTime}
                      </Typography>
                      <Typography variant="caption">Tempo Médio Resposta</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={85} 
                        style={{ marginTop: 8, height: 6, borderRadius: 3 }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <div className={classes.statItem}>
                      <Typography variant="h3" style={{ color: '#FF9800' }}>
                        {integrationStatus.satisfaction}%
                      </Typography>
                      <Typography variant="caption">Satisfação NPS</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={integrationStatus.satisfaction} 
                        style={{ marginTop: 8, height: 6, borderRadius: 3 }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <div className={classes.statItem}>
                      <Typography variant="h3" style={{ color: '#9C27B0' }}>
                        89.3%
                      </Typography>
                      <Typography variant="caption">Limite de Uso</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={89.3} 
                        style={{ marginTop: 8, height: 6, borderRadius: 3 }}
                      />
                    </div>
                  </Grid>
                </Grid>

                <Divider style={{ margin: '16px 0', backgroundColor: 'rgba(255,255,255,0.3)' }} />

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <Chip 
                    label="Premium Plan" 
                    style={{ backgroundColor: '#FFD700', color: 'black', fontWeight: 'bold' }} 
                  />
                  <Chip 
                    label="WhatsApp Business API" 
                    style={{ backgroundColor: '#25D366', color: 'white' }} 
                  />
                  <Chip 
                    label="IA Engine V3.0" 
                    style={{ backgroundColor: '#9C27B0', color: 'white' }} 
                  />
                  <Chip 
                    label="Multi-Device" 
                    style={{ backgroundColor: '#2196F3', color: 'white' }} 
                  />
                  <Chip 
                    label="Advanced Analytics" 
                    style={{ backgroundColor: '#FF6B35', color: 'white' }} 
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          style={{ backgroundColor: '#25D366', color: 'white' }}
          startIcon={<CheckCircle />}
        >
          Salvar Configurações
        </Button>
        <Button 
          variant="contained" 
          style={{ backgroundColor: '#FF6B35', color: 'white' }}
          onClick={() => window.open('https://app.digisac.com', '_blank')}
          startIcon={<Extension />}
        >
          Abrir Digisac
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DigisacConfig;
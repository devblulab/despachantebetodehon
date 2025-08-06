import React, { useState, useMemo, useEffect } from 'react';
import {
  Button, Typography, Paper, Box, Grid, Card, CardContent, TextField,
  makeStyles, MenuItem, Select, FormControl, InputLabel, Snackbar,
  IconButton, CircularProgress, Chip
} from '@material-ui/core';
import { Close, Person, Message, Business, Check } from '@material-ui/icons';
import Pagination from '@material-ui/lab/Pagination';
import * as mammoth from 'mammoth';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/logic/firebase/config/app';
import { serverTimestamp } from 'firebase/firestore';

interface Cliente {
  placa: string;
  renavam: string;
  proprietarioatual: string;
  marca_modelo: string;
  origem: string;
  municipio: string;
  fone_residencial: string;
  fone_comercial: string;
  fone_celular: string;
  usuario: string;
  observacao?: string;
  statusCRM?: string;
  dataAtualizacao?: string;
}

interface StatusOption {
  label: string;
  value: string;
  icon?: JSX.Element;
}

interface Funil {
  id: string;
  nome: string;
}

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: theme.spacing(1),
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    marginBottom: theme.spacing(2),
    backgroundColor: '#f9f9f9',
    padding: theme.spacing(2)
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: theme.spacing(8),
      paddingRight: theme.spacing(8),
    },
    [theme.breakpoints.up('xl')]: {
      paddingLeft: theme.spacing(10),
      paddingRight: theme.spacing(10),
    },
},
  searchBox: {
    marginBottom: theme.spacing(3),
  },
  statusNovo: {
    backgroundColor: '#7F8C8D',
    color: 'white'
  },
  statusContatado: {
    backgroundColor: '#3498DB',
    color: 'white'
  },
  statusInteressado: {
    backgroundColor: '#E67E22',
    color: 'white'
  },
  statusVendido: {
    backgroundColor: '#2ECC71',
    color: 'white'
  },
  statusPerdido: {
    backgroundColor: '#E74C3C',
    color: 'white'
  },
  statusPersonalizado: {
    backgroundColor: '#8E44AD',
    color: 'white'
  },
}));

const STATUS_OPTIONS = [
  { value: 'novo', label: 'Novo', icon: <Person fontSize="small" /> },
  { value: 'contatado', label: 'Contatado', icon: <Message fontSize="small" /> },
  { value: 'interessado', label: 'Interessado', icon: <Business fontSize="small" /> },
  { value: 'vendido', label: 'Vendido', icon: <Check fontSize="small" /> },
  { value: 'perdido', label: 'Perdido', icon: <Close fontSize="small" /> },
];

const UpClientePage = () => {
  const classes = useStyles();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesSalvos, setClientesSalvos] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [observacoes, setObservacoes] = useState<Record<string, string>>({});
  const [statusCrmPorPlaca, setStatusCrmPorPlaca] = useState<Record<string, string>>({});
  const [usuarioFiltro, setUsuarioFiltro] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [funis, setFunis] = useState<Funil[]>([]);
  const [funilSelecionado, setFunilSelecionado] = useState<string>('');
  const itensPorPagina = 12;

  useEffect(() => {
    const carregarFunils = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'FunisParcelamento'));
        const funisData = snapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome
        }));
        setFunis(funisData);
        if (funisData.length > 0) {
          setFunilSelecionado(funisData[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar funis:', error);
      }
    };
    carregarFunils();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setErro(null);

    if (!file) return;
    if (!file.name.endsWith('.docx')) {
      setErro('Apenas arquivos .docx são suportados.');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const texto = result.value;
      const blocos = texto.split(/(?=\n?[A-Z]{3}[0-9][A-Z0-9]{3}\s+\d{6,10}\s+)/g);

      const dados: Cliente[] = blocos.map((bloco) => {
        const item = bloco.replace(/\n+/g, '\n').trim();
        const matchCabecalho = item.match(/([A-Z]{3}[0-9][A-Z0-9]{3})\s+(\d{8,10})\s+(.*)/);
        const placa = matchCabecalho?.[1] || '';
        const renavam = matchCabecalho?.[2] || '';
        const proprietarioatual = matchCabecalho?.[3]?.split('\n')[0].trim() || '';
        const marca_modelo = item.match(/Marca\/Modelo:\s*(.*)/)?.[1]?.trim() || '';
        const origem = item.match(/Origem:\s*(.*?)\s+Munic/)?.[1]?.trim() || '';
        const municipio = item.match(/Munic[ií]pio:\s*(.*)/)?.[1]?.trim() || '';
        const fone_residencial = item.match(/Fone Resid\.:\s*([^\t\n]*)/)?.[1]?.trim() || '';
        const fone_comercial = item.match(/Fone Com\.:\s*([^\t\n]*)/)?.[1]?.trim() || '';
        const fone_celular = item.match(/Fone Cel\.:\s*([^\t\n]*)/)?.[1]?.trim() || '';
        const usuario = item.match(/Usu[áa]rio:\s*(.*)/)?.[1]?.trim() || '';
        return { 
          placa, 
          renavam, 
          proprietarioatual, 
          marca_modelo, 
          origem, 
          municipio, 
          fone_residencial, 
          fone_comercial, 
          fone_celular, 
          usuario,
          statusCRM: 'novo',
          dataAtualizacao: new Date().toISOString()
        };
      });

      setClientes(dados.filter((c) => c.placa));
    } catch (error) {
      console.error('Erro ao ler o arquivo:', error);
      setErro('Erro ao processar o arquivo.');
    }
  };

  const salvarCliente = async (cliente: Cliente) => {
    if (!funilSelecionado) {
      setSnackbarMsg('Selecione um funil antes de salvar');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const observacao = observacoes[cliente.placa] || '';
      const statusCRM = statusCrmPorPlaca[cliente.placa] || 'novo';
      
      // Salva no funil selecionado
      await setDoc(doc(db, `FunisParcelamento/${funilSelecionado}/Clientes`, cliente.placa), {
        ...cliente,
        observacao,
        statusCRM,
        dataAtualizacao: serverTimestamp()
      });

      // Também salva na coleção DadosclientesExtraidos para backup
      await setDoc(doc(db, 'Bancodecontatos', cliente.placa), {
        ...cliente,
        observacao,
        statusCRM,
        dataAtualizacao: serverTimestamp(),
        funnelId: funilSelecionado
      });

      setClientesSalvos((prev) => [...prev, cliente.placa]);
      setSnackbarMsg(`Cliente ${cliente.placa} salvo no funil com sucesso!`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setSnackbarMsg('Erro ao salvar cliente');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const clientesFiltrados = useMemo(() => {
    let lista = clientes.filter((c) => !clientesSalvos.includes(c.placa));
    if (usuarioFiltro) lista = lista.filter((c) => c.usuario === usuarioFiltro);
    return lista.filter((c) => {
      const termo = busca.toLowerCase();
      return (
        c.placa.toLowerCase().includes(termo) ||
        c.renavam.toLowerCase().includes(termo) ||
        c.proprietarioatual.toLowerCase().includes(termo) ||
        c.usuario.toLowerCase().includes(termo) ||
        c.origem.toLowerCase().includes(termo) ||
        c.fone_residencial.toLowerCase().includes(termo) ||
        c.municipio.toLowerCase().includes(termo)
      );
    });
  }, [clientes, busca, usuarioFiltro, clientesSalvos]);

  const usuariosDisponiveis = Array.from(new Set(clientes.map(c => c.usuario)));

  const clientesPaginados = useMemo(() => {
    const inicio = (pagina - 1) * itensPorPagina;
    return clientesFiltrados.slice(inicio, inicio + itensPorPagina);
  }, [clientesFiltrados, pagina]);

  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'novo': return classes.statusNovo;
      case 'contatado': return classes.statusContatado;
      case 'interessado': return classes.statusInteressado;
      case 'vendido': return classes.statusVendido;
      case 'perdido': return classes.statusPerdido;
      default: return classes.statusPersonalizado;
    }
  };

  return (
     <Box px={2}>
    <Paper className={classes.container}>
      <Typography variant="h5" gutterBottom>
        Upload de Arquivo .docx com Dados de Clientes
      </Typography>

      <input 
        accept=".docx" 
        type="file" 
        onChange={handleFileUpload} 
        style={{ marginBottom: 16 }} 
      />

      <Box display="flex" alignItems="center" mb={2}>
        <FormControl variant="outlined" style={{ minWidth: 200, marginRight: 16 }}>
          <InputLabel>Selecionar Funil</InputLabel>
          <Select
            value={funilSelecionado}
            onChange={(e) => setFunilSelecionado(e.target.value as string)}
            label="Selecionar Funil"
          >
            {funis.map(funil => (
              <MenuItem key={funil.id} value={funil.id}>
                {funil.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          variant="outlined"
          label="Buscar cliente, placa, renavam, usuário ou município"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </Box>

      {erro && <Typography color="error">{erro}</Typography>}

      <Box display="flex" flexWrap="wrap" style={{ gap: 8 }} mb={2}>
        {usuariosDisponiveis.map((user) => (
          <Button
            key={user}
            variant={usuarioFiltro === user ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => setUsuarioFiltro(user === usuarioFiltro ? null : user)}
          >
            Usuário: {user}
          </Button>
        ))}
      </Box>

      <Box mb={2}>
        <Pagination
          count={Math.ceil(clientesFiltrados.length / itensPorPagina)}
          page={pagina}
          onChange={(_, value) => setPagina(value)}
          color="primary"
        />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={2}>
        {clientesPaginados.map((cliente) => (
          <Grid item xs={12} sm={6} md={4} key={cliente.placa}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="subtitle1"><strong>Placa:</strong> {cliente.placa}</Typography>
                <Typography variant="body2"><strong>Renavam:</strong> {cliente.renavam}</Typography>
                <Typography variant="body2"><strong>Proprietário:</strong> {cliente.proprietarioatual}</Typography>
                <Typography variant="body2"><strong>Marca/Modelo:</strong> {cliente.marca_modelo}</Typography>
                <Typography variant="body2"><strong>Origem:</strong> {cliente.origem}</Typography>
                <Typography variant="body2"><strong>Município:</strong> {cliente.municipio}</Typography>
                <Typography variant="body2"><strong>Fone Cel.:</strong> {cliente.fone_celular}</Typography>
                <Typography variant="body2"><strong>Usuário:</strong> {cliente.usuario}</Typography>

                <Box mt={2}>
                  <FormControl fullWidth variant="outlined" size="small" style={{ marginBottom: 8 }}>
                    <InputLabel>Status CRM</InputLabel>
                    <Select
                      value={statusCrmPorPlaca[cliente.placa] || 'novo'}
                      onChange={(e) =>
                        setStatusCrmPorPlaca({ ...statusCrmPorPlaca, [cliente.placa]: e.target.value as string })
                      }
                      label="Status CRM"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box mb={1}>
                    <Chip
                      label={STATUS_OPTIONS.find(s => s.value === (statusCrmPorPlaca[cliente.placa] || 'novo'))?.label || 'Novo'}
                      size="small"
                      className={getStatusClass(statusCrmPorPlaca[cliente.placa])}
                      style={{ width: '100%', justifyContent: 'center' }}
                    />
                  </Box>

                  <TextField
                    label="Observação"
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    value={observacoes[cliente.placa] || ''}
                    onChange={(e) =>
                      setObservacoes({ ...observacoes, [cliente.placa]: e.target.value })
                    }
                    style={{ marginBottom: 8 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    fullWidth
                    onClick={() => salvarCliente(cliente)}
                    disabled={loading}
                  >
                    Salvar no Firebase
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        action={
          <IconButton size="small" color="inherit" onClick={() => setSnackbarOpen(false)}>
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Paper>
    </Box>
  );
};

export default UpClientePage;

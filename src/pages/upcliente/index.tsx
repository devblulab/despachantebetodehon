// ✅ Arquivo: pages/upcliente/index.tsx
import React, { useState } from 'react';
import {
  Button,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  makeStyles
} from '@material-ui/core';
import * as mammoth from 'mammoth';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/logic/firebase/config/app';

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
  

}

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: theme.spacing(1),
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    marginBottom: theme.spacing(2),
    backgroundColor: '#f9f9f9',
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  container: {
    padding: theme.spacing(3),
  },
  searchBox: {
    marginBottom: theme.spacing(3),
  },
}));

const UpClientePage = () => {
  const classes = useStyles();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [observacoes, setObservacoes] = useState<Record<string, string>>({});
  const [observacaoGeral, setObservacaoGeral] = useState('');



  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setErro(null);

    if (!file) return;
    if (!file.name.endsWith('.docx')) {
      setErro('Apenas arquivos .docx são suportados. Converta .doc para .docx antes de enviar.');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const texto = result.value;

      const blocos = texto.split(/(?=\n?[A-Z]{3}[0-9][A-Z0-9]{3}\s+\d{6,10}\s+)/g);

      const dados: Cliente[] = blocos.map((bloco) => {
        const item = bloco.replace(/\n+/g, '\n').trim();

        // Correção da linha do cabeçalho
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
        const usuario = item.match(/Usu[aá]rio:\s*(.*)/)?.[1]?.trim() || '';
        

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
        };
      });

      setClientes(dados.filter((c) => c.placa));
    } catch (error) {
      console.error('Erro ao ler o arquivo .docx:', error);
      setErro('Erro ao processar o arquivo. Verifique se é um .docx válido.');
    }
  };

  const salvarCliente = async (cliente: Cliente) => {
  try {
    const observacao = observacoes[cliente.placa] || '';
    await addDoc(collection(db, 'DadosclientesExtraidos'), {
      ...cliente,
      observacao,
      statusCRM: 'novo'
    });
  } catch (error) {
    console.error('Erro ao salvar no Firebase:', error);
  }
};


 const salvarTodos = async () => {
  const novasObservacoes = { ...observacoes };
  for (const cliente of clientes) {
    // Se já tem observação individual, mantém, senão aplica a geral
    if (!novasObservacoes[cliente.placa]) {
      novasObservacoes[cliente.placa] = observacaoGeral;
    }
    await salvarCliente(cliente);
  }
  setObservacoes(novasObservacoes);
  alert('Todos os clientes foram salvos no Firebase com observações.');
};


  const exportarJSON = () => {
    if (!clientes.length) return;
    const blob = new Blob([JSON.stringify(clientes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportarCSV = () => {
    if (!clientes.length) return;
    const csv = [
      Object.keys(clientes[0]).join(',')
    ].concat(
      clientes.map((c) =>
        Object.values(c).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
      )
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clientesFiltrados = clientes.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      c.placa.toLowerCase().includes(termo) ||
      c.renavam.toLowerCase().includes(termo) ||
      c.proprietarioatual.toLowerCase().includes(termo) ||
      c.usuario.toLowerCase().includes(termo) ||
      c.origem.toLowerCase().includes(termo) ||
      c.municipio.toLowerCase().includes(termo)
    );
  });

  const clientesPorUsuario = clientesFiltrados.reduce<Record<string, Cliente[]>>((acc, cliente) => {
    const user = cliente.usuario || 'SEM USUÁRIO';
    if (!acc[user]) acc[user] = [];
    acc[user].push(cliente);
    return acc;
  }, {});

  return (
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

      <TextField
        fullWidth
        variant="outlined"
        label="Buscar cliente, placa, renavam, usuário ou município"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className={classes.searchBox}
      />

      {erro && <Typography color="error">{erro}</Typography>}
<Box display="flex" flexDirection="column" style={{ gap: 8 }} mb={2}>
  <TextField
    fullWidth
    variant="outlined"
    label="Observação para todos os clientes"
    value={observacaoGeral}
    onChange={(e) => setObservacaoGeral(e.target.value)}
  />
  <Box display="flex" style={{ gap: 8 }}>
    <Button variant="contained" color="primary" onClick={exportarJSON}>
      Exportar JSON
    </Button>
    <Button variant="contained" color="secondary" onClick={exportarCSV}>
      Exportar CSV
    </Button>
    <Button variant="contained" onClick={salvarTodos}>
      Salvar Todos no Firebase
    </Button>
  </Box>
</Box>

      {Object.entries(clientesPorUsuario).map(([usuario, lista]) => (
        <Box key={usuario} className={classes.section}>
          <Typography variant="h6" gutterBottom>
            Usuário: {usuario}
          </Typography>
          <Grid container spacing={2}>
            {lista.map((cliente, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="subtitle1"><strong>Placa:</strong> {cliente.placa}</Typography>
                    <Typography variant="body2"><strong>Renavam:</strong> {cliente.renavam}</Typography>
                    <Typography variant="body2"><strong>Proprietário:</strong> {cliente.proprietarioatual}</Typography>
                    <Typography variant="body2"><strong>Marca/Modelo:</strong> {cliente.marca_modelo}</Typography>
                    <Typography variant="body2"><strong>Origem:</strong> {cliente.origem}</Typography>
                    <Typography variant="body2"><strong>Município:</strong> {cliente.municipio}</Typography>
                    <Typography variant="body2"><strong>Fone Res.:</strong> {cliente.fone_residencial}</Typography>
                    <Typography variant="body2"><strong>Fone Com.:</strong> {cliente.fone_comercial}</Typography>
                    <Typography variant="body2"><strong>Fone Cel.:</strong> {cliente.fone_celular}</Typography>
                   <Box mt={2}>
  <TextField
    label="Observação"
    variant="outlined"
    size="small"
    fullWidth
    value={observacoes[cliente.placa] || ''}
    onChange={(e) =>
      setObservacoes({ ...observacoes, [cliente.placa]: e.target.value })
    }
    style={{ marginBottom: 8 }}
  />
  <Button
    variant="outlined"
    color="primary"
    size="small"
    fullWidth
    onClick={() => salvarCliente(cliente)}
  >
    Salvar no Firebase
  </Button>
</Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Paper>
  );
};

export default UpClientePage;

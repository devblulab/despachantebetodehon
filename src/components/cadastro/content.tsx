// ✅ Novo Content.tsx com extração refinada e suporte real para .docx com mammoth

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Grid,
  TextField,
  Typography,
  Paper,
  makeStyles,
  Box,
  useMediaQuery,
  useTheme,
  Button,
  LinearProgress
} from '@material-ui/core';
import { DirectionsCar, Person, AttachMoney, CloudUpload } from '@material-ui/icons';
import { db } from '@/logic/firebase/config/app';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import mammoth from 'mammoth';

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(2),
    backgroundColor: '#ffffff',
    borderRadius: theme.spacing(2),
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
    marginBottom: theme.spacing(2),
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    fontSize: '1rem',
    marginBottom: theme.spacing(1),
    color: '#2e7d32',
  },
  icon: {
    marginRight: theme.spacing(1),
    fontSize: '1.2rem'
  },
  field: {
    marginBottom: theme.spacing(1.5),
  },
  upload: {
    marginBottom: theme.spacing(2),
    backgroundColor: '#2e7d32',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#25662a'
    }
  }
}));

const Content = forwardRef((_, ref) => {
  const classes = useStyles();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));

  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useImperativeHandle(ref, () => ({
    getFormData: () => formData
  }));

  const extractFields = (textBlock: string): any => {
    const get = (label: string) => {
      const regex = new RegExp(`${label}\\s*[:|-]?\\s*(.+)`, 'i');
      const match = textBlock.match(regex);
      return match ? match[1].trim().replace(/\\r|\\n/g, '') : '';
    };

    return {
      placa: get('Placa'),
      nome: get('Propriet[aá]rio Atual'),
      renavam: get('RENAVAM'),
      cpf: get('CPF'),
      rg: get('RG'),
      endereco: get('Endere[cç]o'),
      municipio: get('Munic[íi]pio'),
      uf: get('UF'),
      modelo: get('Modelo'),
      marca: get('Marca'),
      cor: get('Cor'),
      combustivel: get('Combust[ií]vel'),
      especie: get('Esp[ée]cie'),
      anoFab: get('Ano Fab'),
      anoMod: get('Ano Mod'),
      tipo: get('Tipo'),
      origem: get('Origem'),
      valorNF: get('Valor NF|Valor da Nota'),
      crv: get('CRV'),
      exercicio: get('Exerc[ií]cio'),
      servico: get('Servi[cç]o'),
      itens: get('Itens|Item'),
      valorTotal: get('Total'),
      criadoEm: serverTimestamp()
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      let text = '';

      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        text = await file.text();
      }

      const rawClients = text.split(/(?=Propriet[aá]rio Atual\s*:)/gi);
      const clients = rawClients.filter(c => c.trim().length > 100);
      let saved = 0;

      for (let i = 0; i < clients.length; i++) {
        const data = extractFields(clients[i]);
        if (data.nome || data.cpf || data.placa) {
          await addDoc(collection(db, 'DadosclientesExtraidos'), data);
          saved++;
          setUploadProgress((saved / clients.length) * 100);
        }
      }

      alert(`${saved} registros importados com sucesso!`);
    } catch (e) {
      console.error(e);
      alert('Erro ao importar dados. Verifique o formato.');
    } finally {
      setUploading(false);
    }
  };

  const renderFields = (fields: string[]) => (
    <Grid container spacing={1}>
      {fields.map((field) => (
        <Grid item xs={12} sm={6} md={4} key={field}>
          <TextField
            fullWidth
            size="small"
            label={field.toUpperCase()}
            name={field}
            value={(formData as any)[field] || ''}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            className={classes.field}
            variant="outlined"
            InputLabelProps={{ style: { fontSize: '0.75rem' } }}
            InputProps={{ style: { fontSize: '0.8rem' } }}
          />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box>
      <Button
        variant="contained"
        component="label"
        className={classes.upload}
        startIcon={<CloudUpload />}
      >
        Importar arquivo DOC
        <input type="file" hidden accept=".doc,.docx,.txt" onChange={handleFileUpload} />
      </Button>
      {uploading && <LinearProgress variant="determinate" value={uploadProgress} />}

      <Paper className={classes.section}>
        <Typography variant="h6" className={classes.title}><Person className={classes.icon} /> Dados do Cliente</Typography>
        {renderFields(['nome', 'cpf', 'rg', 'cep', 'endereco', 'numero', 'bairro', 'municipio', 'uf', 'foneRes', 'foneCom', 'celular'])}
      </Paper>

      <Paper className={classes.section}>
        <Typography variant="h6" className={classes.title}><DirectionsCar className={classes.icon} /> Dados do Veículo</Typography>
        {renderFields(['placa', 'chassi', 'renavam', 'marca', 'modelo', 'anoFab', 'anoMod', 'tipo', 'categoria', 'cor', 'combustivel', 'especie', 'origem', 'valorNF', 'crv', 'dataDoc'])}
      </Paper>

      <Paper className={classes.section}>
        <Typography variant="h6" className={classes.title}><AttachMoney className={classes.icon} /> Ordem de Serviço</Typography>
        {renderFields(['numeroOS', 'dataEmissao', 'exercicio', 'servico', 'itens', 'valorTotal'])}
      </Paper>
    </Box>
  );
});

export default Content;

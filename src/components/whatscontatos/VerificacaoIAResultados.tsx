'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@material-ui/core';

interface Resultado {
  numero: string;
  nome?: string;
  statusAnterior: string;
  statusAtual: string;
  ultimaMensagem?: string;
}

const VerificacaoIAResultados: React.FC = () => {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [verificacaoFeita, setVerificacaoFeita] = useState(false);

  const buscarResultados = async () => {
    try {
      setCarregando(true);
      setErro(null);
      setResultados([]);

      const res = await fetch('/api/verificaRespostas');
      const data = await res.json();

      if (!data.success || !Array.isArray(data.resultados)) {
        throw new Error('Formato de resposta inválido.');
      }

      setResultados(data.resultados);
      setVerificacaoFeita(true);
    } catch (e: any) {
      console.error('Erro ao buscar resultados:', e);
      setErro(e.message || 'Erro ao consultar API.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Paper style={{ padding: 24, marginTop: 24 }}>
      <Typography variant="h6" gutterBottom>
        🔍 Verificação Inteligente de Respostas
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={buscarResultados}
        disabled={carregando}
        style={{ marginBottom: 16 }}
      >
        Iniciar Verificação IA
      </Button>

      {carregando && (
        <Box display="flex" alignItems="center">
          <CircularProgress size={24} style={{ marginRight: 12 }} />
          <Typography>Verificando respostas e atualizando status...</Typography>
        </Box>
      )}

      {!carregando && erro && (
        <Typography color="error">{erro}</Typography>
      )}

      {!carregando && verificacaoFeita && resultados.length === 0 && (
        <Typography>Nenhuma atualização encontrada.</Typography>
      )}

      {!carregando && resultados.length > 0 && (
        <List dense>
          {resultados.map((r, idx) => (
            <React.Fragment key={`${r.numero}-${idx}`}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`📱 ${r.numero} (${r.nome || 'sem nome'})`}
                  secondary={
                    <>
                      <Typography variant="body2">
                        <strong>Status:</strong> {r.statusAnterior} →{' '}
                        <strong>{r.statusAtual}</strong>
                      </Typography>
                      {r.ultimaMensagem && (
                        <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                          Última: {r.ultimaMensagem}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
              {idx < resultados.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default VerificacaoIAResultados;

'use client';

import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, CircularProgress, Divider
} from '@material-ui/core';
import { Send, Save } from '@material-ui/icons';

export default function ChatContatos() {
  const [numero, setNumero] = useState('');
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [salvo, setSalvo] = useState(false);

  const handleBuscarHistorico = async () => {
    setErro('');
    setCarregando(true);
    setMensagens([]);
    setSalvo(false);

    const numeroLimpo = numero.replace(/\D/g, '');
    const numeroFinal = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;

    try {
      const res = await fetch(`/api/mensagensPorContato/${numeroFinal}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || 'Erro ao buscar mensagens.');

      setMensagens(data.mensagens || []);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvarHistorico = async () => {
    if (!numero) return;
    const res = await fetch(`/api/mensagensPorContato/${numero}`);
    const data = await res.json();
    if (res.ok) setSalvo(true);
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>Ver histórico de mensagens</Typography>

      <Box display="flex" alignItems="center" style={{gap:2}} mb={2}>
        <TextField
          label="Número com DDD"
          variant="outlined"
          value={numero}
          onChange={e => setNumero(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Send />}
          onClick={handleBuscarHistorico}
          disabled={carregando || !numero}
        >
          Ver histórico
        </Button>
      </Box>

      {carregando && <CircularProgress />}
      {erro && <Typography color="error">{erro}</Typography>}
      {salvo && <Typography color="primary">Histórico salvo no Firestore!</Typography>}

      {mensagens.length > 0 && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Chat com: {numero}</Typography>
            <Button variant="outlined" onClick={handleSalvarHistorico} startIcon={<Save />}>
              Salvar no Firestore
            </Button>
          </Box>

          <Paper style={{ maxHeight: '70vh', overflowY: 'auto', padding: 16 }}>
            {mensagens.map((msg, index) => (
              <Box
                key={msg.id || index}
                display="flex"
                justifyContent={msg.isFromMe ? 'flex-end' : 'flex-start'}
                mb={2}
              >
                <Box
                  bgcolor={msg.isFromMe ? '#dcf8c6' : '#fff'}
                  p={2}
                  borderRadius={10}
                  boxShadow={1}
                  maxWidth="75%"
                >
                  <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                    {msg.text || msg.data?.text || '[sem texto]'}
                  </Typography>
                  <Typography variant="caption" align="right" display="block">
                    {new Date(msg.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </>
      )}
    </Box>
  );
}

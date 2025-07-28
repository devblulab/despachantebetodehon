'use client';
import React, { useState } from 'react';
import { Button, Typography, CircularProgress, Box } from '@material-ui/core';

const SyncContatos: React.FC = () => {
  const [totalContatos, setTotalContatos] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [etapa, setEtapa] = useState<'idle' | 'carregando' | 'contado' | 'salvando' | 'finalizado'>('idle');
  const [mensagem, setMensagem] = useState<string | null>(null);

  const contarContatos = async () => {
    setLoading(true);
    setMensagem(null);
    setEtapa('carregando');

    try {
      const res = await fetch('/api/sincronizarContatos?modo=contar');
      const data = await res.json();
      setTotalContatos(data.total || 0);
      setEtapa('contado');
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao carregar contatos.');
      setEtapa('idle');
    } finally {
      setLoading(false);
    }
  };

  const salvarContatos = async () => {
    setLoading(true);
    setMensagem(null);
    setEtapa('salvando');

    try {
      const res = await fetch('/api/sincronizarContatos?modo=salvar');
      const data = await res.json();
      setMensagem(data.message || 'Contatos salvos com sucesso.');
      setEtapa('finalizado');
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao salvar contatos.');
      setEtapa('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" p={4}>
      <Typography variant="h5">📇 Sincronizar Contatos da Digisac</Typography>

      <Box m={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={contarContatos}
          disabled={loading}
        >
          🔄 Carregar Contatos
        </Button>
      </Box>

      {etapa === 'contado' && totalContatos !== null && (
        <Box>
          <Typography>Encontrado: {totalContatos} contatos</Typography>
          <Box mt={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={salvarContatos}
              disabled={loading}
            >
              💾 Salvar todos no Firebase
            </Button>
          </Box>
        </Box>
      )}

      {loading && <CircularProgress style={{ marginTop: 16 }} />}
      {mensagem && <Typography style={{ marginTop: 16 }}>{mensagem}</Typography>}
    </Box>
  );
};

export default SyncContatos;

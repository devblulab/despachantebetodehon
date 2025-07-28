'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, IconButton, TextField, Button, Paper, Divider,
  Snackbar, Tabs, Tab, Tooltip
} from '@material-ui/core';
import { Close, Send, BugReport, Update } from '@material-ui/icons';
import Computer from '@material-ui/icons/Computer';
import {
  getFirestore, collection, query, orderBy, onSnapshot, doc,
  setDoc, getDocs, QuerySnapshot, QueryDocumentSnapshot, DocumentData
} from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';

interface ChatProps {
  numero: string;
  nome: string;
  onClose: () => void;
  iaAtiva?: boolean;
}

interface Mensagem {
  id: string;
  text: string;
  direction: 'in' | 'out';
  timestamp: string;
}

const ChatFlutuante: React.FC<ChatProps> = ({ numero, nome, onClose }) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [iaAtiva, setIaAtiva] = useState(false);
  const [alertaNovaMensagem, setAlertaNovaMensagem] = useState(false);
  const [logVisivel, setLogVisivel] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState(0);
  const [estatisticas, setEstatisticas] = useState({ total: 0, recebidas: 0, enviadas: 0, tempoMedio: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);
  const db = getFirestore(app);
  const chatId = numero.replace(/\D/g, '');

  const calcularEstatisticas = async () => {
    const mensagensRef = collection(db, 'chatparcelamento', chatId, 'mensagens');
    const snapshot = await getDocs(mensagensRef);
    const todas = snapshot.docs.map((doc) => doc.data());
    const recebidas = todas.filter((m: any) => m.direction === 'in');
    const enviadas = todas.filter((m: any) => m.direction === 'out');
    const tempos: number[] = [];
    for (let i = 1; i < todas.length; i++) {
      const anterior = new Date(todas[i - 1].timestamp);
      const atual = new Date(todas[i].timestamp);
      tempos.push((atual.getTime() - anterior.getTime()) / 1000);
    }
    const tempoMedio = tempos.length ? tempos.reduce((a, b) => a + b, 0) / tempos.length : 0;
    setEstatisticas({
      total: todas.length,
      recebidas: recebidas.length,
      enviadas: enviadas.length,
      tempoMedio: Math.round(tempoMedio)
    });
  };

  const sincronizarHistorico = async () => {
    try {
      const numeroLimpo = numero.replace(/\D/g, '');
      const res = await fetch(`/api/mensagensPorContato/${numeroLimpo}`);
      const data = await res.json();

      if (!data.mensagens) return;

      const msgsApi: Mensagem[] = data.mensagens
        .filter((m: any) => m.text && typeof m.text === 'string' && m.text.trim().length > 0)
        .map((m: any) => ({
          id: m.id,
          text: m.text,
          direction: m.direction || (m.isFromMe ? 'out' : 'in'),
          timestamp: m.timestamp || new Date().toISOString()
        }));

      const mensagensRef = collection(db, 'chatparcelamento', chatId, 'mensagens');
      const snapshot = await getDocs(mensagensRef);
      const firestoreIds = new Set(snapshot.docs.map(doc => doc.id));

      for (const msg of msgsApi) {
        if (!msg.id || !msg.text || !msg.timestamp || firestoreIds.has(msg.id)) continue;
        await setDoc(doc(db, 'chatparcelamento', chatId, 'mensagens', msg.id), msg);
      }

      setAlertaNovaMensagem(true);
      if (audioRef.current) audioRef.current.play();
    } catch (err) {
      console.error('Erro ao buscar mensagens:', err);
    }
  };

  useEffect(() => {
    sincronizarHistorico();
    const interval = setInterval(sincronizarHistorico, 15000);
    return () => clearInterval(interval);
  }, [chatId, numero]);

  useEffect(() => {
    const mensagensRef = collection(db, 'chatparcelamento', chatId, 'mensagens');
    const q = query(mensagensRef, orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const msgs: Mensagem[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          direction: data.direction,
          timestamp: data.timestamp
        };
      });
      setMensagens(msgs);
      calcularEstatisticas();
    });
    return () => unsubscribe();
  }, [chatId]);

  const enviarMensagem = async () => {
    if (!novaMensagem.trim()) return;
    const payload = { numero: numero, mensagem: novaMensagem.trim() };
    await fetch('/api/digisac', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    await setDoc(doc(db, 'chatparcelamento', chatId, 'mensagens', Date.now().toString()), {
      text: novaMensagem.trim(),
      direction: 'out',
      timestamp: new Date().toISOString()
    });
    setNovaMensagem('');
  };

  return (
    <Paper elevation={5} style={{ position: 'fixed', bottom: 20, right: 20, width: 400, height: 550, display: 'flex', flexDirection: 'column', borderRadius: 16, overflow: 'hidden', zIndex: 1500, background: '#fff' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" bgcolor="#25D366" color="#fff" p={2}>
        <Typography variant="subtitle1">Chat com {nome}</Typography>
        <Box>
          <Tooltip title="IA automática">
            <IconButton onClick={() => setIaAtiva(!iaAtiva)} size="small" style={{ color: iaAtiva ? '#FFF' : '#C8E6C9' }}>
              <Computer fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Log de mensagens">
            <IconButton onClick={() => setLogVisivel(!logVisivel)} size="small" style={{ color: '#fff' }}>
              <BugReport fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Forçar histórico">
            <IconButton onClick={sincronizarHistorico} size="small" style={{ color: '#fff' }}>
              <Update fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fechar">
            <IconButton onClick={onClose} size="small" style={{ color: '#fff' }}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Tabs value={abaSelecionada} onChange={(_, v) => setAbaSelecionada(v)} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Chat" />
        <Tab label="Estatísticas" />
        {logVisivel && <Tab label="Log" />}
      </Tabs>

      {abaSelecionada === 0 ? (
        <Box flex={1} p={2} style={{ overflowY: 'auto', background: '#f0f0f0' }}>
          {mensagens.map((msg) => {
            const isIncoming = msg.direction === 'in';
            const hora = new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <Box key={msg.id} display="flex" justifyContent={isIncoming ? 'flex-start' : 'flex-end'} mb={1}>
                <Box
                  style={{
                    background: isIncoming ? '#e1f5fe' : '#dcedc8',
                    color: '#000',
                    padding: '10px 14px',
                    borderRadius: 20,
                    maxWidth: '75%',
                    wordBreak: 'break-word',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderTopLeftRadius: isIncoming ? 0 : 20,
                    borderTopRightRadius: isIncoming ? 20 : 0,
                    position: 'relative'
                  }}
                >
                  <Typography variant="body2" style={{ fontSize: '0.95rem' }}>{msg.text}</Typography>
                  <Typography variant="caption" style={{ display: 'block', marginTop: 4, fontSize: '0.7rem', textAlign: isIncoming ? 'left' : 'right', opacity: 0.6 }}>{hora}</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : abaSelecionada === 1 ? (
        <Box p={2}>
          <Typography>Total: {estatisticas.total}</Typography>
          <Typography>Recebidas: {estatisticas.recebidas}</Typography>
          <Typography>Enviadas: {estatisticas.enviadas}</Typography>
          <Typography>Tempo médio entre mensagens: {estatisticas.tempoMedio}s</Typography>
        </Box>
      ) : (
        <Box p={2} style={{ maxHeight: 300, overflowY: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
          {mensagens.map((m) => (
            <Typography key={m.id} color={m.direction === 'in' ? 'primary' : 'secondary'}>
              [{m.timestamp}] ({m.direction}): {m.text}
            </Typography>
          ))}
        </Box>
      )}

      <Divider />
      <Box p={2} display="flex" style={{ gap: 8 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Digite sua mensagem..."
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
        />
        <Button onClick={enviarMensagem} variant="contained" style={{ background: '#25D366', color: 'white' }}>
          <Send fontSize="small" />
        </Button>
      </Box>

      <Snackbar open={alertaNovaMensagem} onClose={() => setAlertaNovaMensagem(false)} autoHideDuration={5000} message="📩 Nova mensagem recebida!" />
      <audio ref={audioRef} src="/notificacao.mp3" preload="auto" />
    </Paper>
  );
};

export default ChatFlutuante;
import React, { useState } from 'react';
import { TextField, Button, Typography, Grid } from '@material-ui/core';
import { addDoc, collection } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import styles from './Aviso.module.css';
import Autenticacao from '../../logic/firebase/auth/Autenticacao';
import { Aviso } from './Aviso';
import Colecao from '../../logic/firebase/db/Colecao';

const autenticacao = new Autenticacao();

interface AvisoPostProps {
  setAvisos: (avisos: Aviso) => void;
}

const AvisoPost: React.FC<AvisoPostProps> = ({ setAvisos }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const addNewAviso = async () => {
    try {
      const usuarioLogado = autenticacao.obterUsuarioLogado();
      if (usuarioLogado) {
        const colecao = new Colecao();
        const avisoSalvo = await colecao.salvar('avisos', {
          titulo: title,
          conteudo: text,
          userId: usuarioLogado.id,
        });

        const newAviso: Aviso = {
          id: avisoSalvo.id,
          titulo: avisoSalvo.titulo,
          conteudo: avisoSalvo.conteudo,
          userId: avisoSalvo.userId,
        };

        setAvisos(newAviso);
        setTitle('');
        setText('');
      }
    } catch (error) {
      console.error('Erro ao adicionar o aviso:', error);
    }
  };

  return (
    <div className={`${styles.avisoPost} ${styles.flexCenter}`}>
      <div className="mb-8 px-4">
        <Typography variant="h4" align="center" gutterBottom>
          Adicionar Aviso
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Título"
              value={title}
              onChange={handleTitleChange}
              variant="outlined"
              fullWidth
              InputProps={{
                className: styles.inputField,
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              label="Conteúdo"
              value={text}
              onChange={handleTextChange}
              variant="outlined"
              fullWidth
              InputProps={{
                className: styles.inputField,
              }}
            />
          </Grid>
        </Grid>
        <Button
          onClick={addNewAviso}
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          style={{ marginTop: '1rem' }}
        >
          Adicionar Aviso
        </Button>
      </div>
    </div>
  );
};

export default AvisoPost;

import React, { useRef } from 'react';
import { Container, Paper, makeStyles } from '@material-ui/core';
import Header from '@/components/cadastro/header';
import Content from '@/components/cadastro/content';
import Rodape from '@/components/cadastro/rodape';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
  },
  paper: {
    padding: theme.spacing(3),
  },
}));

export default function CadastroOrigem() {
  const classes = useStyles();
  const contentRef = useRef<any>();

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper} elevation={3}>
        <Header />
        <Content ref={contentRef} />
        <Rodape getFormData={() => contentRef.current.getFormData()} />
      </Paper>
    </Container>
  );
}

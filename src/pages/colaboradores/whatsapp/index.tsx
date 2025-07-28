
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper, Typography } from '@material-ui/core';
import WhatsAppDigisac from '@/components/whatsapp/WhatsAppDigisac';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    padding: 0,
  },
  container: {
    maxWidth: '100%',
    padding: 0,
  },
  paper: {
    minHeight: '100vh',
    borderRadius: 0,
    overflow: 'hidden',
  },
}));

const WhatsAppPage: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <Paper className={classes.paper} elevation={0}>
          <WhatsAppDigisac />
        </Paper>
      </Container>
    </div>
  );
};

export default WhatsAppPage;

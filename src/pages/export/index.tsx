// pages/export/index.tsx
import React, { useState } from 'react';
import { Button, Typography, CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    maxWidth: 500,
    margin: '0 auto',
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing(2),
  },
  status: {
    marginTop: theme.spacing(2),
  },
}));

export default function ExportPage() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/export', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        setStatus(`✅ ${data.message}`);
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (err) {
      setStatus('❌ Erro ao conectar com servidor.');
    }

    setLoading(false);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h5">Exportar coleção "usuarios"</Typography>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={handleExport}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Exportar agora'}
      </Button>
      {status && (
        <Typography className={classes.status} color="textSecondary">
          {status}
        </Typography>
      )}
    </div>
  );
}

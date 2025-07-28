
import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, TextField, Grid } from '@material-ui/core';
import Head from 'next/head';

export default function TestePage() {
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState('');

  const handleClick = () => {
    setResultado(`Você digitou: "${texto}"`);
  };

  return (
    <>
      <Head>
        <title>Página de Teste | Enygma</title>
        <meta name="description" content="Página de teste para verificar funcionalidades" />
      </Head>
      
      <Box p={4} style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom align="center" style={{ color: '#000' }}>
                  📝 Página de Teste
                </Typography>
                
                <Typography variant="body1" paragraph style={{ color: '#000' }}>
                  Esta é uma página de teste para verificar se tudo está funcionando corretamente.
                </Typography>

                <Box mt={3}>
                  <TextField
                    fullWidth
                    label="Digite algo para testar"
                    variant="outlined"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                    fullWidth
                    style={{ marginBottom: 16 }}
                  >
                    Testar
                  </Button>

                  {resultado && (
                    <Card style={{ backgroundColor: '#e8f5e8' }}>
                      <CardContent>
                        <Typography variant="h6" style={{ color: '#000' }}>
                          Resultado:
                        </Typography>
                        <Typography variant="body1" style={{ color: '#000' }}>
                          {resultado}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>

                <Box mt={4}>
                  <Typography variant="h6" gutterBottom style={{ color: '#000' }}>
                    Status do Sistema:
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" style={{ color: '#000' }}>
                        ✅ React: Funcionando
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" style={{ color: '#000' }}>
                        ✅ Material-UI: Funcionando
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" style={{ color: '#000' }}>
                        ✅ Next.js: Funcionando
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" style={{ color: '#000' }}>
                        ✅ TypeScript: Funcionando
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Box mt={3}>
                  <Typography variant="body2" align="center" style={{ color: '#666' }}>
                    Página criada para teste de funcionalidades básicas
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

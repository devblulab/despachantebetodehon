import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, TextField, Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { collection, getFirestore, onSnapshot, deleteDoc, doc, updateDoc, where, query } from 'firebase/firestore';
import { app } from '../../logic/firebase/config/app';
import Colecao from '../../logic/firebase/db/Colecao';
import { Aviso } from './Avisoss';
import { useMediaQuery } from '@material-ui/core';
import Autenticacao from '../../logic/firebase/auth/Autenticacao';
import Usuario from '../../logic/core/usuario/Usuario';

import {
  motion,
  useMotionTemplate,
  useSpring,
} from 'framer-motion';

const db = getFirestore(app);
const avisosCollectionRef = collection(db, 'avisos');

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mobileRoot: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '100%',
  },
  item: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#004000', // Cor verde para o botão
    color: 'white',
  },
  card: {
    marginBottom: theme.spacing(2),
  },
}));

interface AvisoListProps {
  avisos: Aviso[];
}

const AvisoList: React.FC<AvisoListProps> = ({ avisos }) => {
  const classes = useStyles();
  const [updatedAvisos, setUpdatedAvisos] = useState<Aviso[]>([]);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const autenticacao = new Autenticacao();
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const cancelarMonitoramento = autenticacao.monitorar((usuario) => {
      setUser(usuario);
    });

    return () => {
      cancelarMonitoramento();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const userAvisosQuery = query(avisosCollectionRef, where('userId', '==', user.id));
      const unsubscribe = onSnapshot(userAvisosQuery, (querySnapshot) => {
        const fetchedAvisos: Aviso[] = [];
        querySnapshot.forEach((doc) => {
          fetchedAvisos.push({
            id: doc.id,
            titulo: doc.data().titulo,
            conteudo: doc.data().conteudo,
            userId: doc.data().userId,
          });
        });
        setUpdatedAvisos(fetchedAvisos);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  const colecao = new Colecao();

  const editTitulo = async (avisoId: string, newTitulo: string) => {
    try {
      const db = getFirestore(app);
      const avisosCollectionRef = collection(db, 'avisos');
      await updateDoc(doc(avisosCollectionRef, avisoId), { titulo: newTitulo });
    } catch (error) {
      console.error('Erro ao editar o título do aviso:', error);
    }
  };

  const removeAviso = async (avisoId: string) => {
    try {
      const db = getFirestore(app);
      const avisosCollectionRef = collection(db, 'avisos');
      await deleteDoc(doc(avisosCollectionRef, avisoId));
    } catch (error) {
      console.error('Erro ao remover o aviso:', error);
    }
  };

  const editTexto = async (avisoId: string, newTexto: string) => {
    try {
      const db = getFirestore(app);
      const avisosCollectionRef = collection(db, 'avisos');
      await updateDoc(doc(avisosCollectionRef, avisoId), { conteudo: newTexto });
    } catch (error) {
      console.error('Erro ao editar o texto do aviso:', error);
    }
  };

  const salvarAvisos = async (avisoId: string) => {
    try {
      const db = getFirestore(app);
      const avisosCollectionRef = collection(db, 'avisos');
      const avisoToSave = updatedAvisos.find((aviso) => aviso.id === avisoId);
      if (avisoToSave) {
        await colecao.salvar('avisos', avisoToSave, avisoId);
      }
    } catch (error) {
      console.error('Erro ao salvar o aviso:', error);
    }
  };

  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="mb-8 px-4">
      <div className={`${classes.root} ${isMobile ? classes.mobileRoot : ''}`}>
        <Typography variant="h4" align="center" gutterBottom>
          Lista de Avisos
        </Typography>
        <List>
          <div className="bg-gray-200 mx-auto p-4 rounded-md">
            {updatedAvisos.map((aviso) => (
              <motion.div
                key={aviso.id}
                onMouseMove={onMouseMove}
                className={`${classes.card} ${isMobile ? '' : classes.item} overflow-hidden relative duration-700 border rounded-xl hover:bg-zinc-800/10 group md:gap-8 hover:border-zinc-400/50 border-zinc-600`}
              >
                <div className="pointer-events-none">
                  <div className="absolute inset-0 z-0  transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
                  <motion.div
                    className="absolute inset-0 z-10  bg-gradient-to-br opacity-100  via-zinc-100/10  transition duration-1000 group-hover:opacity-50 "
                    style={style}
                  />
                  <motion.div
                    className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
                    style={style}
                  />
                </div>

                <CardContent>
                  <Typography variant="body1" color="textPrimary">
                    {/* Conteúdo */}
                  </Typography>
                  <TextField
                    label="Título"
                    value={aviso.titulo}
                    onChange={(e) => editTitulo(aviso.id, e.target.value)}
                    variant="outlined"
                    size="small"
                    style={{ width: isMobile ? '100%' : '200px' }}
                  />
                  <TextField
                    label="Texto"
                    value={aviso.conteudo}
                    onChange={(e) => editTexto(aviso.id, e.target.value)}
                    variant="outlined"
                    size="small"
                    style={{ width: isMobile ? '100%' : '200px' }}
                  />
                  <Button onClick={() => removeAviso(aviso.id)} variant="contained" color="secondary" size="small">
                    Remover
                  </Button>

                  <Button onClick={() => salvarAvisos(aviso.id)} variant="contained" className={classes.button}>
                    Salvar
                  </Button>
                </CardContent>
              </motion.div>
            ))}
          </div>
        </List>
      </div>
    </div>
  );
};

export default AvisoList;

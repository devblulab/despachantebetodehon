import React, { useState } from 'react';
import Cabecalho from '../../components/template/Cabecalho';
import AvisoPost from '../../components/avisos/AvisoPost';
import AvisoList from '../../components/avisos/AvisoList';
import { Aviso } from '../../components/avisos/Aviso';
import ForcarAutenticacao from '../../components/autenticacao/ForcarAutenticacao';

const AvisosPage: React.FC = () => {
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  const addAviso = (avisos: Aviso): void => {
    setAvisos((prevAvisos) => [...prevAvisos, avisos]);
  };

  return (
    <>
      <ForcarAutenticacao>
        <Cabecalho />
        <AvisoPost setAvisos={addAviso} />
        <AvisoList avisos={avisos} />
      </ForcarAutenticacao>
    </>
  );
};

export default AvisosPage;

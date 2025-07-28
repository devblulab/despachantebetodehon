import React from 'react';
import { Button, Box } from '@material-ui/core';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/logic/firebase/config/app';

interface RodapeProps {
  getFormData: () => any;
}

export default function Rodape({ getFormData }: RodapeProps) {
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
    const formData = getFormData();
    setLoading(true);
    try {
      await addDoc(collection(db, 'DadosclientesExtraidos'), {
        ...formData,
        criadoEm: serverTimestamp(),
      });
      alert('Dados salvos no Firebase!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar no Firebase.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarWhats = () => {
    const celular = getFormData().celular?.replace(/\D/g, '');
    if (celular) {
      window.open(`https://wa.me/55${celular}?text=Olá, tudo bem? Aqui é do despachante.`, '_blank');
    }
  };

  return (
    <Box mt={3} display="flex" justifyContent="space-between">
      <Button color="primary" variant="contained" onClick={handleSave} disabled={loading}>
        Salvar no Firebase
      </Button>
      <Button color="secondary" variant="outlined" onClick={handleEnviarWhats}>
        Enviar WhatsApp
      </Button>
    </Box>
  );
}

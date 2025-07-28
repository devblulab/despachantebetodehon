import { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { app } from '@/logic/firebase/config/app';

export interface PendenciaIA {
  numero: string;
  nome: string;
  mensagemRecebida: string;
  timestamp: string;
  status: string;
}

export function useIAPendentes() {
  const [pendentes, setPendentes] = useState<PendenciaIA[]>([]);
  const db = getFirestore(app);

  useEffect(() => {
    const ref = collection(db, 'chatparcelamento');
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const lista: PendenciaIA[] = snapshot.docs.map(doc => ({
        numero: doc.id,
        ...doc.data(),
      })) as PendenciaIA[];

      setPendentes(lista);
    });

    return () => unsubscribe();
  }, []);

  return pendentes;
}

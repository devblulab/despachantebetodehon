import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { app } from '../config/app';

const db = getFirestore(app);
const STATUS_COLLECTION = 'StatusCRM';

export interface StatusExtra {
  id: string;
  value: string;
  label: string;
}

/**
 * Busca os status extras (personalizados) salvos no Firestore.
 */
export const getStatusExtras = async (): Promise<StatusExtra[]> => {
  const snapshot = await getDocs(collection(db, STATUS_COLLECTION));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      value: data.value ?? '',
      label: data.label ?? ''
    };
  });
};

/**
 * Adiciona um novo status ao Firestore.
 * @param value Identificador do status (ex: "em-negociacao")
 * @param label Nome legível (ex: "Em Negociação")
 */
export const addStatusExtra = async (value: string, label: string) => {
  return await addDoc(collection(db, STATUS_COLLECTION), { value, label });
};

/**
 * Remove um status extra do Firestore por ID.
 * @param docId ID do documento
 */
export const removeStatusExtra = async (docId: string) => {
  return await deleteDoc(doc(db, STATUS_COLLECTION, docId));
};

import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, query, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { app } from '../config/app';

export default class Colecao {
    private _db = getFirestore(app);

    async salvar(nomeColecao: string, dados: any, docId?: string) {
        try {
            if (docId) {
                const docRef = doc(this._db, nomeColecao, docId);
                await setDoc(docRef, dados, { merge: true });
                return { ...dados, id: docId };
            } else {
                const docRef = await addDoc(collection(this._db, nomeColecao), dados);
                return { ...dados, id: docRef.id };
            }
        } catch (error) {
            console.error(`Erro ao salvar em ${nomeColecao}:`, error);
            throw error;
        }
    }

    async consultarPorId(nomeColecao: string, docId: string) {
        try {
            const docRef = doc(this._db, nomeColecao, docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Erro ao consultar por ID em ${nomeColecao}:`, error);
            return null;
        }
    }

    async excluir(nomeColecao: string, docId: string) {
        try {
            const docRef = doc(this._db, nomeColecao, docId);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error(`Erro ao excluir de ${nomeColecao}:`, error);
            throw error;
        }
    }

    async consultar(nomeColecao: string, campoOrdenacao?: string) {
        try {
            const colecaoRef = collection(this._db, nomeColecao);

            let q;
            if (campoOrdenacao) {
                q = query(colecaoRef, orderBy(campoOrdenacao));
            } else {
                q = query(colecaoRef);
            }

            const querySnapshot = await getDocs(q);
            const resultados: any[] = [];

            querySnapshot.forEach((doc) => {
                resultados.push({ id: doc.id, ...doc.data() });
            });

            return resultados;
        } catch (error) {
            console.error(`Erro ao consultar ${nomeColecao}:`, error);
            return [];
        }
    }

    async consultarTodos(nomeColecao: string) {
        try {
            const colecaoRef = collection(this._db, nomeColecao);
            const querySnapshot = await getDocs(colecaoRef);
            const resultados: any[] = [];

            querySnapshot.forEach((doc) => {
                resultados.push({ 
                    id: doc.id, 
                    ...doc.data() 
                });
            });

            console.log(`📊 Consultando todos de ${nomeColecao}:`, resultados);
            return resultados;
        } catch (error) {
            console.error(`Erro ao consultar todos de ${nomeColecao}:`, error);
            return [];
        }
    }
}
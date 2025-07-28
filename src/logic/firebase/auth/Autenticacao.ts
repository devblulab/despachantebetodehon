import Usuario from "@/logic/core/usuario/Usuario";
import {
    Auth,
    getAuth,
    GoogleAuthProvider,
    onIdTokenChanged,
    signInWithPopup,
    signInWithEmailAndPassword,
    signOut,
    User
} from "firebase/auth";
import { app } from "../config/app";

export type MonitorarUsuario = (usuario: Usuario | null) => void;
export type CancelarMonitoramento = () => void;

export default class Autenticacao {
    private _auth: Auth;

    constructor() {
        this._auth = getAuth(app);
    }

    async loginGoogle(): Promise<Usuario | null> {
        const resp = await signInWithPopup(this._auth, new GoogleAuthProvider());
        return this.converterParaUsuario(resp.user);
    }

    async loginEmailSenha(email: string, senha: string): Promise<Usuario | null> {
        // Validações básicas
        if (!email || !senha) {
            throw new Error('Email e senha são obrigatórios');
        }

        // Limpar espaços em branco
        email = email.trim().toLowerCase();
        senha = senha.trim();

        console.log('🔍 Tentando fazer login para:', email);

        try {
            // Aguardar um pouco para garantir que o Firebase está inicializado
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const { getFirestore, collection, query, where, getDocs } = await import('firebase/firestore');
            const { app } = await import('../config/app');
            
            const db = getFirestore(app);
            const usuariosRef = collection(db, 'usuarios');
            
            // Buscar por email exato (case insensitive)
            const q = query(usuariosRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);
            
            console.log('📊 Documentos encontrados para', email, ':', querySnapshot.size);

            if (!querySnapshot.empty) {
                const usuarioDoc = querySnapshot.docs[0];
                const usuarioDados = usuarioDoc.data();
                
                console.log('👤 Dados do usuário:', {
                    email: usuarioDados.email,
                    nome: usuarioDados.nome,
                    ativo: usuarioDados.ativo,
                    temSenha: !!usuarioDados.senha
                });
                
                // Verificar se o usuário está ativo
                if (usuarioDados.ativo === false) {
                    throw new Error('Usuário desativado. Entre em contato com o administrador.');
                }
                
                // Verificar senha (comparação exata)
                if (usuarioDados.senha === senha) {
                    console.log('✅ Credenciais válidas, criando sessão...');
                    
                    const usuario = this.converterParaUsuario({
                        uid: usuarioDoc.id,
                        email: usuarioDados.email,
                        displayName: usuarioDados.nome,
                        photoURL: usuarioDados.imagemUrl || '/betologo.jpg',
                        providerData: [{ providerId: "email" }],
                        permissao: usuarioDados.permissao // Passar a permissão diretamente
                    });
                    
                    if (usuario) {
                        usuario.permissao = usuarioDados.permissao || 'Visualizador';
                        
                        // Salvar sessão
                        localStorage.setItem('usuarioAutenticado', JSON.stringify({
                            uid: usuario.uid,
                            email: usuario.email,
                            nome: usuario.nome,
                            imagemUrl: usuario.imagemUrl,
                            permissao: usuario.permissao,
                            timestamp: Date.now()
                        }));
                        
                        console.log('💾 Login realizado com sucesso para:', usuario.email);
                    }
                    
                    return usuario;
                } else {
                    console.log('❌ Senha incorreta para:', email);
                    throw new Error('Email ou senha incorretos');
                }
            } else {
                console.log('❌ Usuário não encontrado:', email);
                
                // Tentar buscar todos os usuários para debug (apenas em desenvolvimento)
                try {
                    const todosUsuarios = await getDocs(collection(db, 'usuarios'));
                    console.log('📋 Todos os usuários cadastrados:');
                    todosUsuarios.forEach(doc => {
                        const data = doc.data();
                        console.log(`  - ${data.email} (${data.nome})`);
                    });
                } catch (debugError) {
                    console.log('⚠️ Não foi possível listar usuários para debug');
                }
                
                throw new Error('Email ou senha incorretos');
            }
        } catch (error: any) {
            // Se é um erro que já tratamos, repassa
            if (error.message.includes('incorretos') || error.message.includes('desativado')) {
                throw error;
            }
            
            console.error('❌ Erro no processo de login:', error);
            
            // Tratamento específico para erros do Firebase
            if (error.code === 'failed-precondition') {
                throw new Error('Problema de configuração do banco de dados. Entre em contato com o suporte.');
            }
            
            if (error.code === 'permission-denied') {
                throw new Error('Acesso negado ao banco de dados. Verifique as permissões.');
            }
            
            if (error.code === 'unavailable') {
                throw new Error('Serviço temporariamente indisponível. Tente novamente.');
            }
            
            // Erro genérico
            throw new Error('Erro interno no sistema de login. Tente novamente.');
        }
    }

    logout(): Promise<void> {
        return signOut(this._auth);
    }

    monitorar(notificar: MonitorarUsuario): CancelarMonitoramento {
        return onIdTokenChanged(this._auth, async (usuarioFirebase) => {
            const usuario = this.converterParaUsuario(usuarioFirebase);
            notificar(usuario);
        });
    }

    obterUsuarioLogado(): Usuario | null {
        // Primeiro verificar se há usuário no Firebase Auth
        const usuarioFirebase = this._auth.currentUser;
        if (usuarioFirebase) {
            return this.converterParaUsuario(usuarioFirebase);
        }
        
        // Se não há usuário no Firebase Auth, verificar localStorage
        try {
            const usuarioSalvo = localStorage.getItem('usuarioAutenticado');
            if (usuarioSalvo) {
                const dadosUsuario = JSON.parse(usuarioSalvo);
                
                // Verificar se a sessão não expirou (24 horas)
                const agora = Date.now();
                const tempoSessao = 24 * 60 * 60 * 1000; // 24 horas
                
                if (agora - dadosUsuario.timestamp < tempoSessao) {
                    console.log('📱 Recuperando sessão do localStorage:', dadosUsuario);
                    return {
                        uid: dadosUsuario.uid,
                        id: dadosUsuario.id || dadosUsuario.email,
                        email: dadosUsuario.email,
                        nome: dadosUsuario.nome,
                        imagemUrl: dadosUsuario.imagemUrl,
                        permissao: dadosUsuario.permissao
                    };
                } else {
                    // Sessão expirada, remover
                    localStorage.removeItem('usuarioAutenticado');
                }
            }
        } catch (error) {
            console.error('Erro ao recuperar sessão:', error);
            localStorage.removeItem('usuarioAutenticado');
        }
        
        return null;
    }

    private converterParaUsuario(firebaseUser: any): Usuario | null {
        if (!firebaseUser) return null;

        return {
            uid: firebaseUser.uid,
            id: firebaseUser.uid || firebaseUser.email,
            email: firebaseUser.email,
            nome: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
            imagemUrl: firebaseUser.photoURL,
            provedor: firebaseUser.providerData?.[0]?.providerId,
            permissao: firebaseUser.permissao || undefined
        }
    }
}
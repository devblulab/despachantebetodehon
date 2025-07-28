import Autenticacao, { CancelarMonitoramento, MonitorarUsuario } from "@/logic/firebase/auth/Autenticacao"
import Colecao from "@/logic/firebase/db/Colecao"
import Usuario from "./Usuario"

export default class ServicosUsuario {
    private _autenticacao = new Autenticacao()
    private _colecao = new Colecao()

    monitorarAutenticacao(observador: MonitorarUsuario): CancelarMonitoramento {
        return this._autenticacao.monitorar(async usuario => {
            observador(usuario ? {
                ...usuario,
                ...await this.consultar(usuario.email)
            } : null)
        })
    }

    async loginGoogle(): Promise<Usuario | null> {
        try {
            const usuario = await this._autenticacao.loginGoogle()
            if (!usuario) return null

            let usuarioDoBanco = await this.consultar(usuario.email)
            if (!usuarioDoBanco) {
                // Cria novo usuário com a estrutura correta
                const novoUsuario = {
                    email: usuario.email,
                    nome: usuario.nome,
                    imagemUrl: usuario.imagemUrl,
                    id: usuario.uid || usuario.email
                }
                usuarioDoBanco = await this.salvar(novoUsuario)
            }

            return { ...usuario, ...usuarioDoBanco }
        } catch (error) {
            console.error('Erro no login:', error)
            return null
        }
    }

    async loginEmailSenha(email: string, senha: string): Promise<Usuario | null> {
        try {
            const usuario = await this._autenticacao.loginEmailSenha(email, senha)
            if (!usuario) return null

            let usuarioDoBanco = await this.consultar(usuario.email)
            if (!usuarioDoBanco) {
                // Cria novo usuário com a estrutura correta
                const novoUsuario = {
                    email: usuario.email,
                    nome: 'Nome Padrao',
                    imagemUrl: 'URL Padrao',
                    id: usuario.email
                }
                usuarioDoBanco = await this.salvar(novoUsuario)
            }

            return { ...usuario, ...usuarioDoBanco }
        } catch (error) {
            console.error('Erro ao logar com email e senha:', error)
            return null
        }
    }

    logout(): Promise<void> {
        return this._autenticacao.logout()
    }

    async salvar(usuario: Usuario) {
        try {
            // Estrutura completa do usuário conforme especificado
            const usuarioCompleto = {
                email: usuario.email,
                nome: usuario.nome,
                imagemUrl: usuario.imagemUrl || '/betologo.jpg',
                permissao: (usuario as any).permissao || 'Visualizador',
                ativo: (usuario as any).ativo !== undefined ? (usuario as any).ativo : true,
                dataCriacao: (usuario as any).dataCriacao || new Date(),
                id: usuario.uid || usuario.email
            };

            // Usa o email como ID do documento para manter consistência
            return await this._colecao.salvar(
                'usuarios', 
                usuarioCompleto, 
                usuario.email
            )
        } catch (error) {
            console.error('Erro ao salvar usuário:', error)
            throw error
        }
    }

    async consultar(email: string) {
        try {
            return await this._colecao.consultarPorId('usuarios', email)
        } catch (error) {
            console.error('Erro ao consultar usuário:', error)
            return null
        }
    }

    async obterTodos(): Promise<Usuario[]> {
        const usuarios = await this._colecao.consultarTodos('usuarios')
        return usuarios.map(usuario => {
            return {
                ...usuario,
                permissao: (usuario as any).permissao || 'Visualizador',
                ativo: (usuario as any).ativo !== undefined ? (usuario as any).ativo : true,
                dataCriacao: (usuario as any).dataCriacao || new Date(),
                id: usuario.uid || usuario.email
            };

        })
    }

    async obterUsuario(identificador: string): Promise<Usuario | null> {
        try {
            // Primeiro tenta buscar por UID
            let usuario = await this._colecao.consultarPorId('usuarios', identificador)

            // Se não encontrar por UID, busca por email
            if (!usuario) {
                const usuarios = await this.obterTodos()
                const usuarioEncontrado = usuarios.find(u => u.email === identificador)
                usuario = usuarioEncontrado || null
            }

            if (usuario) {
                const usuarioCompleto = usuario as any; // Type cast to access all properties
                return {
                    ...usuarioCompleto,
                    email: usuarioCompleto.email,
                    nome: usuarioCompleto.nome,
                    permissao: usuarioCompleto.permissao || 'cliente',
                    ativo: usuarioCompleto.ativo !== undefined ? usuarioCompleto.ativo : true,
                    dataCriacao: usuarioCompleto.dataCriacao || new Date(),
                    id: usuarioCompleto.uid || usuarioCompleto.email || identificador // Garantir que id nunca seja undefined
                }
            }

            return null
        } catch (error) {
            console.error('Erro ao buscar usuário:', error)
            return null
        }
    }
}
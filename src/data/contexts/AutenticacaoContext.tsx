import servicos from "@/logic/core"
import Usuario from "@/logic/core/usuario/Usuario"
import Autenticacao from "@/logic/firebase/auth/Autenticacao"
import { createContext, useEffect, useState } from "react"

interface AutenticacaoProps {
    carregando: boolean
    usuario: Usuario | null
    loginGoogle: () => Promise<Usuario | null>
    loginEmailSenha: (email: string, senha: string, lembrarSenha?: boolean, manterConectado?: boolean) => Promise<Usuario | null>
    logout: () => Promise<void>
    atualizarUsuario: (novoUsuario: Usuario) => Promise<void>
    estaAutenticado: () => boolean
}

const AutenticacaoContext = createContext<AutenticacaoProps>({
    carregando: true,
    usuario: null,
    loginGoogle: async () => null,
    loginEmailSenha: async () => null,
    logout: async () => {},
    atualizarUsuario: async () => {},
    estaAutenticado: () => false
})

export function AutenticacaoProvider(props: any) {

    const [carregando, setCarregando] = useState<boolean>(true)
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const auth = new Autenticacao()

    useEffect(() => {
        let isMounted = true;

        const initializeAuth = () => {
            // Verificar se há usuário salvo no localStorage (apenas no browser)
            let usuarioSalvo = null
            let manterConectado = null
            
            if (typeof window !== 'undefined') {
                usuarioSalvo = localStorage.getItem('usuarioAutenticado')
                manterConectado = localStorage.getItem('manterConectado')
            }

            console.log('🔄 Inicializando autenticação...', { usuarioSalvo: !!usuarioSalvo, manterConectado })

            if (usuarioSalvo && manterConectado === 'true') {
                try {
                    const usuarioData = JSON.parse(usuarioSalvo)
                    console.log('✅ Usuário recuperado do localStorage:', usuarioData)

                    if (isMounted) {
                        setUsuario(usuarioData)
                        setCarregando(false)
                    }
                    return () => {} // Retorna função vazia se já tem usuário salvo
                } catch (error) {
                    console.error('❌ Erro ao recuperar usuário salvo:', error)
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('usuarioAutenticado')
                        localStorage.removeItem('manterConectado')
                    }
                }
            }

            // Só inicia o monitoramento se não há usuário salvo
            try {
                const cancelar = servicos.usuario.monitorarAutenticacao(async (usuario) => {
                    if (!isMounted) return;

                    console.log('🔍 Mudança na autenticação:', { usuario: !!usuario })

                    if (usuario) {
                        try {
                            // Buscar dados completos do usuário do banco
                            const usuarioCompleto = await servicos.usuario.obterUsuario(usuario.uid || usuario.email)
                            if (usuarioCompleto && isMounted) {
                                console.log('✅ Usuário completo carregado:', usuarioCompleto)
                                setUsuario(usuarioCompleto)

                                // Salvar usuário se "manter conectado" estiver ativo
                                if (typeof window !== 'undefined' && localStorage.getItem('manterConectado') === 'true') {
                                    localStorage.setItem('usuarioAutenticado', JSON.stringify(usuarioCompleto))
                                }
                            } else if (isMounted) {
                                setUsuario(usuario)
                            }
                        } catch (error) {
                            console.error('❌ Erro ao carregar dados do usuário:', error)
                            if (isMounted) setUsuario(usuario)
                        }
                    } else if (isMounted) {
                        setUsuario(null)
                        // Limpar localStorage apenas se não for para manter conectado
                        if (typeof window !== 'undefined' && localStorage.getItem('manterConectado') !== 'true') {
                            localStorage.removeItem('usuarioAutenticado')
                        }
                    }

                    if (isMounted) setCarregando(false)
                })

                return cancelar
            } catch (error) {
                console.error('❌ Erro na inicialização da autenticação:', error)
                if (isMounted) setCarregando(false)
                return () => {} // Retorna função vazia em caso de erro
            }
        }

        const cancelar = initializeAuth()

        return () => {
            isMounted = false;
            if (cancelar && typeof cancelar === 'function') {
                cancelar()
            }
        }
    }, [])

    async function atualizarUsuario(novoUsuario: Usuario) {
        if (usuario && usuario.email !== novoUsuario.email) return logout()
        if (usuario && novoUsuario && usuario.email === novoUsuario.email) {
            await servicos.usuario.salvar(novoUsuario)
            setUsuario(novoUsuario)
        }
    }

    async function loginGoogle() {
        try {
            setCarregando(true)
            const usuario = await auth.loginGoogle()
            if(usuario){
                const usuarioCompleto = await servicos.usuario.obterUsuario(usuario.uid || usuario.email)
                setUsuario(usuarioCompleto)
            }
            return usuario
        } catch (error) {
            console.error("Erro ao logar com google", error)
            return null
        } finally{
            setCarregando(false)
        }

    }

    async function loginEmailSenha(email: string, senha: string, lembrarSenha?: boolean, manterConectado?: boolean) {
        try {
            setCarregando(true)
            console.log("🚀 Iniciando login com email e senha para:", email)
            
            const usuarioFirebase = await auth.loginEmailSenha(email, senha)

            if (usuarioFirebase) {
                console.log("✅ Usuário autenticado pelo Firebase:", usuarioFirebase)
                
                // Buscar dados completos do usuário do banco
                let usuarioCompleto = await servicos.usuario.obterUsuario(usuarioFirebase.uid || email)

                if (!usuarioCompleto) {
                    console.log("❌ Usuário não encontrado no banco, usando dados do Firebase...")
                    // Usar os dados que já vêm do Firebase (que já tem a permissão correta)
                    usuarioCompleto = {
                        nome: usuarioFirebase.nome || email.split('@')[0],
                        email: email,
                        ativo: true,
                        permissao: usuarioFirebase.permissao || 'Visualizador', // Usar a permissão do Firebase
                        imagemUrl: usuarioFirebase.imagemUrl || '/betologo.jpg',
                        id: email
                    };
                    
                    console.log("✅ Usando dados do Firebase com permissão:", usuarioCompleto.permissao);
                }

                console.log("✅ Usuário completo:", usuarioCompleto)
                
                // Definir o usuário no estado
                setUsuario(usuarioCompleto)

                // Salvar credenciais se "lembrar senha" estiver ativo (apenas no browser)
                if (typeof window !== 'undefined') {
                    if (lembrarSenha) {
                        localStorage.setItem('lembrarCredenciais', JSON.stringify({ email, senha }))
                    } else {
                        localStorage.removeItem('lembrarCredenciais')
                    }

                    // Salvar usuário se "manter conectado" estiver ativo
                    if (manterConectado) {
                        const dadosParaSalvar = {
                            ...usuarioCompleto,
                            timestamp: Date.now()
                        }
                        localStorage.setItem('manterConectado', 'true')
                        localStorage.setItem('usuarioAutenticado', JSON.stringify(dadosParaSalvar))
                        console.log("💾 Usuário salvo no localStorage para manter conectado")
                    } else {
                        localStorage.removeItem('manterConectado')
                        localStorage.removeItem('usuarioAutenticado')
                    }
                }

                console.log("🎉 Login realizado com sucesso!")
                return usuarioCompleto
            }

            console.log("❌ Falha na autenticação")
            return null
        } catch (erro: any) {
            console.error("❌ Erro no login:", erro)
            throw erro // Re-throw para que o componente possa exibir o erro
        } finally {
            setCarregando(false)
        }
    }

    async function logout() {
        try {
            console.log('🚪 Fazendo logout...')
            await servicos.usuario.logout()
            setUsuario(null)

            // Limpar dados salvos (apenas no browser)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('usuarioAutenticado')
                localStorage.removeItem('manterConectado')

                // Manter credenciais salvas apenas se "lembrar senha" estiver ativo
                const lembrarCredenciais = localStorage.getItem('lembrarCredenciais')
                if (!lembrarCredenciais) {
                    localStorage.removeItem('lembrarCredenciais')
                }
            }

            console.log('✅ Logout realizado com sucesso')
        } catch (error) {
            console.error('❌ Erro no logout:', error)
            // Mesmo com erro, limpar estado local
            setUsuario(null)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('usuarioAutenticado')
                localStorage.removeItem('manterConectado')
            }
        }
    }

    function estaAutenticado(): boolean {
        // Verificar se há usuário no estado
        if (usuario && usuario.email) {
            console.log('✅ Usuário autenticado via estado:', usuario.email)
            return true
        }

        // Verificar se há usuário salvo no localStorage (apenas no browser)
        if (typeof window !== 'undefined') {
            try {
                const usuarioSalvo = localStorage.getItem('usuarioAutenticado')
                const manterConectado = localStorage.getItem('manterConectado')
                
                if (usuarioSalvo && manterConectado === 'true') {
                    const dadosUsuario = JSON.parse(usuarioSalvo)
                    
                    // Verificar se a sessão não expirou (24 horas)
                    const agora = Date.now()
                    const tempoSessao = 24 * 60 * 60 * 1000 // 24 horas
                    
                    if (agora - dadosUsuario.timestamp < tempoSessao) {
                        console.log('✅ Usuário autenticado via localStorage:', dadosUsuario.email)
                        
                        // Se não há usuário no estado mas há no localStorage, restaurar
                        if (!usuario) {
                            setUsuario(dadosUsuario)
                        }
                        
                        return true
                    } else {
                        console.log('⏰ Sessão expirada, removendo localStorage')
                        localStorage.removeItem('usuarioAutenticado')
                        localStorage.removeItem('manterConectado')
                    }
                }
            } catch (error) {
                console.error('❌ Erro ao verificar localStorage:', error)
                localStorage.removeItem('usuarioAutenticado')
                localStorage.removeItem('manterConectado')
            }
        }

        console.log('❌ Usuário não autenticado')
        return false
    }

    return (
        <AutenticacaoContext.Provider value={{
            carregando,
            usuario,
            loginGoogle,
            loginEmailSenha,
            logout,
            atualizarUsuario,
            estaAutenticado
        }}>
            {props.children}
        </AutenticacaoContext.Provider>
    )
}

export default AutenticacaoContext
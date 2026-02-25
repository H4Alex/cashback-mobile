/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Auth
 * Arquivo: authStore.ts
 * Descrição: Store de autenticação com Zustand. Gerencia estado
 *            do usuário, login (single/multi-empresa), refresh,
 *            2FA e sincronização com multilojaStore.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 2 — Módulo de Autenticação
 * ============================================================
 */

import { create } from 'zustand'
import { authService } from '../services/auth.service'
import { captureError, setUserContext } from '../services/errorReporting'
import { onLoginSuccess, onLogout } from '../services/authOrchestrator'
import { salvarToken, removerToken } from '../utils/token.utils'
import { obterMensagemErro } from '../utils/error.utils'
import type {
  Usuario,
  EmpresaPerfil,
  EmpresaRef,
  LoginResponse,
  LoginSingleEmpresaResponse,
  RegisterRequest,
  MeResponse,
} from '../types'
import { isMultiEmpresaLogin } from '../types'

interface AuthState {
  /** Dados do usuário autenticado. */
  usuario: Usuario | null
  /** Token JWT (null quando usa httpOnly cookie). */
  token: string | null
  /** Perfil do usuário na empresa selecionada. */
  perfil: EmpresaPerfil | null
  /** Se o usuário está autenticado. */
  isAuthenticated: boolean
  /** Se o login requer seleção de empresa (multi-tenant). */
  requiresEmpresaSelection: boolean
  /** Lista de empresas para seleção (multi-tenant). */
  empresasDisponiveis: EmpresaRef[]
  /** Se o login requer verificação 2FA. */
  requires2FA: boolean
  /** Se está carregando. */
  isLoading: boolean
  /** Mensagem de erro. */
  error: string | null

  // Métodos
  login: (email: string, senha: string) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  switchEmpresa: (empresaId: number) => Promise<void>
  initAuth: () => Promise<void>
  logout: () => void
  setUsuario: (usuario: Usuario) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  token: null,
  perfil: null,
  isAuthenticated: false,
  requiresEmpresaSelection: false,
  empresasDisponiveis: [],
  requires2FA: false,
  isLoading: false,
  error: null,

  login: async (email: string, senha: string) => {
    try {
      set({ isLoading: true, error: null })

      const response = await authService.login({ email, senha, plataforma: 'web' })
      const loginData: LoginResponse = response.data.data

      // Cenário: múltiplas empresas — seleção necessária
      if (isMultiEmpresaLogin(loginData)) {
        await salvarToken(loginData.token_temporario)
        set({
          isLoading: false,
          requiresEmpresaSelection: true,
          empresasDisponiveis: loginData.empresas,
          isAuthenticated: false,
        })
        return
      }

      // Cenário: empresa única ou admin
      const { token, usuario, perfil } = loginData
      await salvarToken(token)

      setUserContext({ id: String(usuario.id), email: usuario.email })
      onLoginSuccess(loginData)

      set({
        usuario,
        token,
        perfil: perfil as EmpresaPerfil,
        isAuthenticated: true,
        isLoading: false,
        requiresEmpresaSelection: false,
        empresasDisponiveis: [],
        error: null,
      })
    } catch (error: unknown) {
      set({
        error: obterMensagemErro(error),
        isLoading: false,
      })
      throw error
    }
  },

  register: async (data: RegisterRequest) => {
    try {
      set({ isLoading: true, error: null })

      const response = await authService.register(data)
      const { token, usuario } = response.data.data

      await salvarToken(token)
      setUserContext({ id: String(usuario.id), email: usuario.email })

      set({ isLoading: false, error: null })
    } catch (error: unknown) {
      set({
        error: obterMensagemErro(error),
        isLoading: false,
      })
      throw error
    }
  },

  switchEmpresa: async (empresaId: number) => {
    try {
      set({ isLoading: true, error: null })

      const response = await authService.switchEmpresa({
        empresa_id: empresaId,
        plataforma: 'web',
      })
      const { token, empresa, perfil } = response.data.data

      await salvarToken(token)

      // Recarregar dados do usuário com a empresa selecionada
      const meResponse = await authService.me()
      const meData: MeResponse = meResponse.data.data
      const usuario: Usuario = {
        id: meData.id,
        nome: meData.nome,
        email: meData.email,
        telefone: meData.telefone,
        tipo_global: meData.tipo_global,
        created_at: '',
        updated_at: '',
        ...(meData.perfil ? { perfil: meData.perfil } : {}),
      }

      setUserContext({ id: String(usuario.id), email: usuario.email })
      onLoginSuccess({
        token,
        token_type: 'bearer',
        expires_in: 0,
        usuario,
        empresa: { id: empresa.id, nome_fantasia: empresa.nome_fantasia, cnpj: '', perfil },
        perfil,
      } as LoginSingleEmpresaResponse)

      set({
        usuario,
        token,
        perfil,
        isAuthenticated: true,
        isLoading: false,
        requiresEmpresaSelection: false,
        empresasDisponiveis: [],
        error: null,
      })
    } catch (error: unknown) {
      set({
        error: obterMensagemErro(error),
        isLoading: false,
      })
      throw error
    }
  },

  initAuth: async () => {
    try {
      const response = await authService.me()
      const meData: MeResponse = response.data.data
      const usuario: Usuario = {
        id: meData.id,
        nome: meData.nome,
        email: meData.email,
        telefone: meData.telefone,
        tipo_global: meData.tipo_global,
        created_at: '',
        updated_at: '',
        ...(meData.perfil ? { perfil: meData.perfil } : {}),
      }

      if (meData.empresa) {
        onLoginSuccess({
          token: '',
          token_type: 'bearer',
          expires_in: 0,
          usuario,
          empresa: meData.empresa,
          perfil: meData.perfil ?? 'operador',
        })
      } else {
        onLoginSuccess({
          token: '',
          token_type: 'bearer',
          expires_in: 0,
          usuario,
          empresa: null,
          perfil: 'admin',
        })
      }

      set({
        usuario,
        perfil: meData.perfil ?? null,
        isAuthenticated: true,
      })
    } catch {
      setUserContext(null)
      removerToken()
      set({
        usuario: null,
        token: null,
        perfil: null,
        isAuthenticated: false,
      })
    }
  },

  logout: () => {
    authService.logout().catch((err) => captureError(err, { source: 'logout' }))
    setUserContext(null)
    removerToken()
    onLogout()
    set({
      usuario: null,
      token: null,
      perfil: null,
      isAuthenticated: false,
      requiresEmpresaSelection: false,
      empresasDisponiveis: [],
      requires2FA: false,
      error: null,
    })
  },

  setUsuario: (usuario: Usuario) => {
    set({ usuario })
  },

  clearError: () => {
    set({ error: null })
  },
}))

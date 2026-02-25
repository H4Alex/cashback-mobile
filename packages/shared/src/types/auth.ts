/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Auth
 * Arquivo: auth.ts
 * Descrição: Tipos de autenticação espelhando o backend real.
 *            Campos e valores extraídos de AuthController,
 *            AuthService, UserResource e modelos do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

// ─── Enums/Union Types ──────────────────────────────────────

/** Perfil do usuário na empresa (pivot usuario_empresa). */
export type EmpresaPerfil = 'proprietario' | 'gestor' | 'operador' | 'vendedor'

/** Tipo global do usuário (admin do SaaS ou null para usuário normal). */
export type TipoGlobal = 'admin' | null

// ─── Entidades ──────────────────────────────────────────────

/** Dados do usuário retornados por GET /auth/me (UserResource). */
export interface Usuario {
  id: number
  nome: string
  email: string
  telefone: string | null
  tipo_global: TipoGlobal
  created_at: string
  updated_at: string
  /** Presente quando há empresa selecionada no token. */
  perfil?: EmpresaPerfil
}

/** Referência de empresa retornada no login multi-empresa. */
export interface EmpresaRef {
  id: number
  nome_fantasia: string
  cnpj: string
  perfil: EmpresaPerfil
}

// ─── DTOs de Request ────────────────────────────────────────

/** POST /api/v1/auth/login — campos do LoginRequest do backend. */
export interface LoginRequest {
  email: string
  senha: string
  plataforma?: 'web' | 'mobile'
}

/** POST /api/v1/auth/register — campos do RegisterRequest do backend. */
export interface RegisterRequest {
  nome: string
  email: string
  senha: string
  telefone?: string
  cnpj: string
  nome_fantasia?: string
  telefone_empresa?: string
}

/** POST /api/v1/auth/forgot-password */
export interface ForgotPasswordRequest {
  email: string
}

/** POST /api/v1/auth/reset-password */
export interface ResetPasswordRequest {
  email: string
  token: string
  senha: string
}

/** POST /api/v1/auth/switch-empresa */
export interface SwitchEmpresaRequest {
  empresa_id: number
  plataforma?: 'web' | 'mobile'
}

/** POST /api/v1/auth/2fa/verify */
export interface TwoFactorVerifyRequest {
  code: string
  plataforma?: 'web' | 'mobile'
}

/** POST /api/v1/auth/2fa/confirm */
export interface TwoFactorConfirmRequest {
  code: string
}

/** POST /api/v1/auth/2fa/disable */
export interface TwoFactorDisableRequest {
  senha: string
}

// ─── DTOs de Response ───────────────────────────────────────

/** Response de login — cenário empresa única. */
export interface LoginSingleEmpresaResponse {
  token: string
  token_type: 'bearer'
  expires_in: number
  usuario: Usuario
  empresa: EmpresaRef
  perfil: EmpresaPerfil
}

/** Response de login — cenário admin (sem empresa). */
export interface LoginAdminResponse {
  token: string
  token_type: 'bearer'
  expires_in: number
  usuario: Usuario
  empresa: null
  perfil: 'admin'
}

/** Response de login — cenário multi-empresa (seleção necessária). */
export interface LoginMultiEmpresaResponse {
  token_temporario: string
  expires_in: number
  empresas: EmpresaRef[]
  selecionar_empresa: true
}

/** Union type de todas as responses possíveis do login. */
export type LoginResponse = LoginSingleEmpresaResponse | LoginAdminResponse | LoginMultiEmpresaResponse

/** Verifica se o login requer seleção de empresa. */
export function isMultiEmpresaLogin(data: LoginResponse): data is LoginMultiEmpresaResponse {
  return 'selecionar_empresa' in data && data.selecionar_empresa === true
}

/** Verifica se o login é de admin. */
export function isAdminLogin(data: LoginResponse): data is LoginAdminResponse {
  return 'perfil' in data && data.perfil === 'admin'
}

/** Response de registro — POST /auth/register */
export interface RegisterResponse {
  token: string
  token_type: 'bearer'
  usuario: {
    id: number
    nome: string
    email: string
  }
  empresa: {
    id: number
    nome_fantasia: string
    cnpj: string
  }
}

/** Response de switch empresa — POST /auth/switch-empresa */
export interface SwitchEmpresaResponse {
  token: string
  token_type: 'bearer'
  expires_in: number
  empresa: {
    id: number
    nome_fantasia: string
  }
  perfil: EmpresaPerfil
}

/** Response de refresh token — POST /auth/refresh */
export interface RefreshTokenResponse {
  token: string
  token_type: 'bearer'
  expires_in: number
}

/** Response de GET /auth/me */
export interface MeResponse {
  id: number
  nome: string
  email: string
  telefone: string | null
  tipo_global: TipoGlobal
  empresa?: EmpresaRef
  perfil?: EmpresaPerfil
}

/** Response de POST /auth/2fa/setup */
export interface TwoFactorSetupResponse {
  qr_code: string
  secret: string
}

/** Response de POST /auth/2fa/confirm */
export interface TwoFactorConfirmResponse {
  backup_codes: string[]
}

/** Response de POST /auth/2fa/verify */
export interface TwoFactorVerifyResponse {
  token: string
  token_type: 'bearer'
  expires_in: number
}

/** Response de POST /auth/2fa/backup-codes */
export interface TwoFactorBackupCodesResponse {
  backup_codes: string[]
}

// ─── Tipos legados para compatibilidade ─────────────────────

/**
 * @deprecated Use `Usuario` em vez de `User`.
 * Mantido temporariamente para compatibilidade com componentes existentes.
 */
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'operator' | 'customer'
  avatar?: string
  empresas?: Array<{
    empresa_id: number
    nome_empresa: string
    perfil: EmpresaPerfil
    logo: string
    ativo: 'S' | 'N'
  }>
  subscription?: {
    isActive: boolean
    planId: string | null
  }
}

/**
 * @deprecated Use `RegisterRequest` em vez de `RegisterData`.
 */
export interface RegisterData {
  name: string
  email: string
  phone: string
  cpfCnpj: string
  storeName: string
  password: string
}

/**
 * @deprecated Use `LoginResponse` em vez de `LoginResponseLegacy`.
 */
export interface LoginResponseLegacy {
  user: User
}

/** Tipo legado de Subscription. */
export interface Subscription {
  isActive: boolean
  planId: string | null
}

/** Tipo legado de UserRole. */
export type UserRole = 'admin' | 'manager' | 'operator' | 'customer'

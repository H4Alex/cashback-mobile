/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Auth
 * Arquivo: auth.service.ts
 * Descrição: Service de autenticação — encapsula todas as
 *            chamadas HTTP aos endpoints de auth do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 2 — Módulo de Autenticação
 * ============================================================
 */

import api from './apiClient'
import type { ApiResponse } from '../types/api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  MeResponse,
  RefreshTokenResponse,
  SwitchEmpresaRequest,
  SwitchEmpresaResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  TwoFactorSetupResponse,
  TwoFactorConfirmRequest,
  TwoFactorConfirmResponse,
  TwoFactorVerifyRequest,
  TwoFactorVerifyResponse,
  TwoFactorDisableRequest,
  TwoFactorBackupCodesResponse,
} from '../types/auth'

/** Service de autenticação com métodos tipados para cada endpoint do backend. */
export const authService = {
  /** POST /auth/login — Autenticação por email/senha. */
  login: (data: LoginRequest) => api.post<ApiResponse<LoginResponse>>('/auth/login', data),

  /** POST /auth/register — Registra novo usuário + empresa com trial. */
  register: (data: RegisterRequest) => api.post<ApiResponse<RegisterResponse>>('/auth/register', data),

  /** POST /auth/logout — Invalida token JWT (blacklist). */
  logout: () => api.post<ApiResponse<null>>('/auth/logout'),

  /** GET /auth/me — Retorna dados do usuário autenticado. */
  me: () => api.get<ApiResponse<MeResponse>>('/auth/me'),

  /** POST /auth/refresh — Renova token JWT. */
  refresh: () => api.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh'),

  /** POST /auth/switch-empresa — Seleciona empresa (multi-tenant). */
  switchEmpresa: (data: SwitchEmpresaRequest) =>
    api.post<ApiResponse<SwitchEmpresaResponse>>('/auth/switch-empresa', data),

  /** POST /auth/forgot-password — Solicita reset de senha. */
  forgotPassword: (data: ForgotPasswordRequest) => api.post<ApiResponse<null>>('/auth/forgot-password', data),

  /** POST /auth/reset-password — Confirma reset de senha. */
  resetPassword: (data: ResetPasswordRequest) => api.post<ApiResponse<null>>('/auth/reset-password', data),

  /** POST /auth/2fa/setup — Inicia setup de 2FA (TOTP). */
  twoFactorSetup: () => api.post<ApiResponse<TwoFactorSetupResponse>>('/auth/2fa/setup'),

  /** POST /auth/2fa/confirm — Confirma ativação do 2FA. */
  twoFactorConfirm: (data: TwoFactorConfirmRequest) =>
    api.post<ApiResponse<TwoFactorConfirmResponse>>('/auth/2fa/confirm', data),

  /** POST /auth/2fa/verify — Verifica código TOTP durante login. */
  twoFactorVerify: (data: TwoFactorVerifyRequest) =>
    api.post<ApiResponse<TwoFactorVerifyResponse>>('/auth/2fa/verify', data),

  /** POST /auth/2fa/disable — Desativa 2FA. */
  twoFactorDisable: (data: TwoFactorDisableRequest) => api.post<ApiResponse<null>>('/auth/2fa/disable', data),

  /** POST /auth/2fa/backup-codes — Regenera backup codes. */
  twoFactorBackupCodes: () => api.post<ApiResponse<TwoFactorBackupCodesResponse>>('/auth/2fa/backup-codes'),
}

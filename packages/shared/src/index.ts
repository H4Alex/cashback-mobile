/**
 * @cashback/shared — Main barrel export
 *
 * Re-exports all shared modules for consumption by web and mobile apps.
 * Import from '@cashback/shared' instead of individual files.
 */

// ─── Types ──────────────────────────────────────────────────
export * from './types'

// ─── Services ───────────────────────────────────────────────
export { initApiClient } from './services/apiClient'
export { authService } from './services/auth.service'
export { default as cashbackService } from './services/cashback.service'
export { default as clienteService } from './services/cliente.service'
export { default as campanhaService } from './services/campanha.service'
export { default as dashboardService } from './services/dashboard.service'
export { default as empresaService } from './services/empresa.service'
export { default as configService } from './services/config.service'
export { default as contestacaoService } from './services/contestacao.service'
export { default as assinaturaService } from './services/assinatura.service'
export { default as faturaService } from './services/fatura.service'
export { default as notificacaoService } from './services/notificacao.service'
export { default as relatorioService } from './services/relatorio.service'
export { default as unidadeService } from './services/unidade.service'
export { default as usuarioService } from './services/usuario.service'
export { default as auditoriaService } from './services/auditoria.service'
export { initErrorReporting, captureError, setUserContext } from './services/errorReporting'
export { initAuthOrchestrator, onLoginSuccess, onLogout } from './services/authOrchestrator'

// ─── Stores ─────────────────────────────────────────────────
export { useAuthStore } from './stores/authStore'
export { useMultilojaStore } from './stores/multilojaStore'
export { useSubscriptionStore } from './stores/subscriptionStore'
export { useThemeStore } from './stores/themeStore'
export type { Theme } from './stores/themeStore'
export { useUnidadeNegocioStore } from './stores/unidadeNegocioStore'

// ─── Utils ──────────────────────────────────────────────────
export * from './utils/validation'
export * from './utils/formatters'
export * from './utils/masks'
export * from './utils/errorMessages'
export * from './utils/error.utils'
export * from './utils/rateLimiter'
export * from './utils/asyncValidation'
export { initSecureStorage } from './utils/secureStorage'
export type { SecureStorageAdapter } from './utils/secureStorage'
export { getPasswordStrength } from './utils/security'

// ─── Hooks ──────────────────────────────────────────────────
export { useDebounce } from './hooks/useDebounce'
export { useDashboard } from './hooks/useDashboard'
export { useSimulatedLoading } from './hooks/useSimulatedLoading'
export { useRecuperacaoWizard } from './hooks/useRecuperacaoWizard'
export { useCompanyLookups } from './hooks/useCompanyLookups'

// ─── i18n ───────────────────────────────────────────────────
export { initI18n, defaultResources } from './i18n/i18n'
export { default as i18n } from './i18n/i18n'

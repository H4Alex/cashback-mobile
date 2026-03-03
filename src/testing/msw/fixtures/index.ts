/**
 * Barrel export — MSW test fixtures.
 */

// Auth (mobile consumer)
export {
  createMockClienteResource,
  createMockLoginResponseData,
  createMockOAuthResponseData,
  createMockTokenPair,
  createMockBiometricEnrollResponse,
} from './auth.fixtures'

// Cashback / Extrato / QRCode (mobile consumer)
export {
  createMockSaldoData,
  createMockExtratoEntry,
  createMockExtratoList,
  createMockQRCodeToken,
  createMockValidarQRCodeResponse,
} from './cashback.fixtures'

// Contestacao (mobile consumer)
export {
  createMockContestacao,
  createMockContestacaoList,
} from './contestacao.fixtures'

// Notificacao (mobile consumer)
export {
  createMockNotification,
  createMockNotificationList,
  createMockNotificationPreferences,
} from './notificacao.fixtures'

// Merchant (lojista)
export {
  createMockEmpresaMerchant,
  createMockCampanhaMerchant,
  createMockClienteSearchResult,
  createMockClienteSaldo,
  createMockGerarCashbackResponse,
  createMockUtilizarCashbackResponse,
  createMockSwitchEmpresaResponse,
  createMockMerchantDashboardStats,
} from './merchant.fixtures'

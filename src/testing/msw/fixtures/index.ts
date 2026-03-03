/**
 * Barrel export — MSW Fixtures (schema-validated mock factories).
 */

// ─── Auth ────────────────────────────────────────────────────
export {
  createMockClienteResource,
  createMockLoginResponseData,
  createMockOAuthResponseData,
} from "./auth.fixtures";

// ─── Cashback / Extrato ─────────────────────────────────────
export {
  createMockSaldoData,
  createMockExtratoEntry,
  createMockExtratoList,
  createMockQRCodeToken,
  createMockValidarQRCodeResponse,
} from "./cashback.fixtures";

// ─── Contestacao ────────────────────────────────────────────
export {
  createMockContestacao,
  createMockContestacaoList,
} from "./contestacao.fixtures";

// ─── Notificacao ────────────────────────────────────────────
export {
  createMockNotification,
  createMockNotificationList,
  createMockNotificationPreferences,
} from "./notificacao.fixtures";

// ─── Merchant ───────────────────────────────────────────────
export {
  createMockEmpresaMerchant,
  createMockCampanhaMerchant,
  createMockCampanhaMerchantList,
  createMockClienteSearchResult,
  createMockClienteSaldo,
  createMockGerarCashbackResponse,
  createMockUtilizarCashbackResponse,
  createMockSwitchEmpresaResponse,
  createMockMerchantDashboardStats,
} from "./merchant.fixtures";

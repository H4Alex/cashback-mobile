/**
 * Barrel export — Contract Schemas (Single Source of Truth) — Mobile
 */

// ─── Common ──────────────────────────────────────────────────
export {
  monetarioSchema,
  isoTimestampSchema,
  paginationMetaSchema,
  cursorPaginationMetaSchema,
  laravelValidationErrorSchema,
  apiErrorDetailSchema,
  apiErrorResponseSchema,
  apiResponseSchema,
  paginatedResponseSchema,
  cursorPaginatedResponseSchema,
} from "./common.schemas";
export type {
  PaginationMeta,
  CursorPaginationMeta,
  LaravelValidationError,
  ApiErrorDetail,
  ApiErrorResponse,
} from "./common.schemas";

// ─── Auth ────────────────────────────────────────────────────
export {
  clienteResourceSchema,
  loginResponseDataSchema,
  oauthResponseDataSchema,
  loginRequestSchema,
  registerRequestSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  updateProfileRequestSchema,
  changePasswordRequestSchema,
  deleteAccountRequestSchema,
  oauthRequestSchema,
  biometricEnrollRequestSchema,
} from "./auth.schemas";
export type {
  ClienteResource,
  LoginResponseData,
  OAuthResponseData,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  OAuthRequest,
  BiometricEnrollRequest,
} from "./auth.schemas";

// ─── Cashback / Extrato ──────────────────────────────────────
export {
  cashbackStatusEnum,
  saldoDataSchema,
  extratoEntrySchema,
  qrCodeTokenSchema,
  validarQRCodeResponseSchema,
  gerarQRCodeRequestSchema,
  validarQRCodeRequestSchema,
} from "./cashback.schemas";
export type {
  CashbackStatus,
  SaldoData,
  ExtratoEntry,
  QRCodeToken,
  ValidarQRCodeResponse,
  GerarQRCodeRequest,
  ValidarQRCodeRequest,
} from "./cashback.schemas";

// ─── Contestação ─────────────────────────────────────────────
export {
  contestacaoTipoEnum,
  contestacaoStatusEnum,
  contestacaoSchema,
  createContestacaoRequestSchema,
} from "./contestacao.schemas";
export type {
  ContestacaoTipo,
  ContestacaoStatus,
  Contestacao,
  CreateContestacaoRequest,
} from "./contestacao.schemas";

// ─── Notificação ─────────────────────────────────────────────
export {
  notificationSchema,
  notificationPreferencesSchema,
} from "./notificacao.schemas";
export type {
  MobileNotification,
  NotificationPreferences,
} from "./notificacao.schemas";

// ─── Merchant ────────────────────────────────────────────────
export {
  perfilMerchantEnum,
  campanhaStatusEnum,
  empresaMerchantSchema,
  campanhaMerchantSchema,
  clienteSearchResultSchema,
  clienteSaldoSchema,
  gerarCashbackResponseSchema,
  utilizarCashbackResponseSchema,
  switchEmpresaResponseSchema,
  merchantDashboardStatsSchema,
  gerarCashbackMerchantRequestSchema,
  utilizarCashbackRequestSchema,
  criarCampanhaMerchantRequestSchema,
} from "./merchant.schemas";
export type {
  PerfilMerchant,
  CampanhaStatusMerchant,
  EmpresaMerchant,
  CampanhaMerchant,
  ClienteSearchResult,
  ClienteSaldo,
  GerarCashbackResponse,
  UtilizarCashbackResponse,
  SwitchEmpresaResponse,
  MerchantDashboardStats,
  GerarCashbackMerchantRequest,
  UtilizarCashbackRequest,
  CriarCampanhaMerchantRequest,
} from "./merchant.schemas";

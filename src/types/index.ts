export type { ApiResponse, ApiErrorResponse, PaginatedResponse, CursorPaginatedResponse, ApiError } from "./api";

export type {
  OAuthProvider,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ClienteResource,
  TokenPair,
  OAuthRequest,
  OAuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  BiometricEnrollRequest,
} from "./auth";

export type {
  CashbackStatus,
  CashbackEntry,
  CashbackSaldo,
  EmpresaSaldo,
  QRCodeToken,
  GerarQRCodeRequest,
  ValidarQRCodeRequest,
  ValidarQRCodeResponse,
  ExtratoEntry,
} from "./cashback";

export type {
  NotificationType,
  MobileNotification,
  NotificationListResponse,
  NotificationPreferences,
} from "./notification";

export type {
  ContestacaoStatus,
  ContestacaoTipo,
  Contestacao,
  ContestacaoListResponse,
  CreateContestacaoRequest,
} from "./contestacao";

export type { HistoricoUso, HistoricoUsoResponse } from "./historico";

export type {
  Empresa,
  Campanha,
  ClienteSearchResult,
  ClienteSaldo,
  GerarCashbackRequest,
  GerarCashbackResponse,
  UtilizarCashbackRequest,
  UtilizarCashbackResponse,
  SwitchEmpresaResponse,
  DashboardStats,
  DashboardTransacao,
  DashboardTopCliente,
  ChartDataPoint,
  CampanhaFull,
  CreateCampanhaRequest,
  ClienteDetail,
  VendaResource,
  ContestacaoMerchant,
  EmpresaConfig,
  RelatorioData,
} from "./merchant";

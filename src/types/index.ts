export type { ApiResponse, PaginatedResponse, CursorPaginatedResponse, ApiError } from "./api";

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
  ExtratoResponse,
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
} from "./merchant";

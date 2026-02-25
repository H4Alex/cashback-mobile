/**
 * @cashback/shared — Types barrel export
 * Clean re-export of all shared types (legacy aliases removed).
 */

// ─── API / Infraestrutura ───────────────────────────────────
export type {
  ApiResponse,
  ApiErrorResponse,
  ApiErrorDetail,
  PaginationMeta,
  PaginatedResponse,
  CursorPaginationMeta,
  CursorPaginatedResponse,
  ListParams,
  TransacaoListParams,
  ClienteListParams,
  CampanhaListParams,
  ContestacaoListParams,
  AuditoriaListParams,
  FaturaListParams,
  DashboardChartParams,
  DashboardTransactionParams,
  HypermediaLink,
  HypermediaLinks,
} from './api'

// ─── Auth ───────────────────────────────────────────────────
export type {
  EmpresaPerfil,
  TipoGlobal,
  Usuario,
  EmpresaRef,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SwitchEmpresaRequest,
  TwoFactorVerifyRequest,
  TwoFactorConfirmRequest,
  TwoFactorDisableRequest,
  LoginSingleEmpresaResponse,
  LoginAdminResponse,
  LoginMultiEmpresaResponse,
  LoginResponse,
  RegisterResponse,
  SwitchEmpresaResponse,
  RefreshTokenResponse,
  MeResponse,
  TwoFactorSetupResponse,
  TwoFactorConfirmResponse,
  TwoFactorVerifyResponse,
  TwoFactorBackupCodesResponse,
} from './auth'
export { isMultiEmpresaLogin, isAdminLogin } from './auth'

// ─── Cashback / Transações ──────────────────────────────────
export type {
  StatusVenda,
  StatusCashback,
  Transacao,
  GerarCashbackRequest,
  UtilizarCashbackRequest,
} from './cashback'

// ─── Clientes ───────────────────────────────────────────────
export type {
  Cliente,
  CriarClienteRequest,
  AtualizarClienteRequest,
  ClienteSaldo,
} from './customer'

// ─── Campanhas ──────────────────────────────────────────────
export type {
  CampanhaStatus,
  Campanha,
  CriarCampanhaRequest,
  AtualizarCampanhaRequest,
} from './campaign'

// ─── Empresa ────────────────────────────────────────────────
export type { ModoSaldo, Empresa, AtualizarConfigRequest } from './empresa'

// ─── Unidade de Negócio ─────────────────────────────────────
export type { UnidadeStatus, UnidadeNegocio, CriarUnidadeRequest, AtualizarUnidadeRequest } from './unidadeNegocio'

// ─── Usuários Internos ──────────────────────────────────────
export type {
  UsuarioInterno,
  PerfilUsuarioInterno,
  CriarUsuarioInternoRequest,
  AtualizarUsuarioInternoRequest,
} from './usuarioInterno'

// ─── Assinaturas e Faturas ──────────────────────────────────
export type {
  AssinaturaCiclo,
  AssinaturaStatus,
  FaturaStatus,
  NivelRelatorio,
  NivelSuporte,
  Plano,
  Assinatura,
  Fatura,
  UpgradeAssinaturaRequest,
} from './assinatura'

// ─── Notificações ───────────────────────────────────────────
export type { CanalNotificacao, NotificacaoConfig, AtualizarNotificacaoConfigRequest } from './notificacao'

// ─── Contestações ───────────────────────────────────────────
export type {
  ContestacaoTipo,
  ContestacaoStatus,
  Contestacao,
  CriarContestacaoRequest,
  ResolverContestacaoRequest,
} from './contestacao'

// ─── Auditoria ──────────────────────────────────────────────
export type { LogAuditoria, AuditAction, AuditEntity } from './auditLog'

// ─── Vendas ─────────────────────────────────────────────────
export type { Venda, VendaStatus } from './venda'

// ─── Extrato ────────────────────────────────────────────────
export type { ExtratoEntry, ExtratoTipo, ExtratoStatus } from './extrato'

// ─── Dashboard ──────────────────────────────────────────────
export type {
  DashboardStats,
  ChartDataPoint,
  TopCliente,
  MetricDetail,
  DashboardMetrics,
  StatusSummary,
  Transaction,
  CashbackTransactionStatus,
  CashbackTransaction,
  SummaryCardsData,
  DashboardData,
} from './dashboard'

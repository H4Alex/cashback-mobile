/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Infraestrutura
 * Arquivo: api.ts
 * Descrição: Tipos genéricos da API — espelham o formato real
 *            de response do backend (trait ApiResponse).
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

// ─── Response padronizada do backend ────────────────────────

/** Envelope padrão de sucesso retornado pelo backend. */
export interface ApiResponse<T> {
  status: true
  data: T
  error: null
  message: string
}

/** Envelope padrão de erro retornado pelo backend. */
export interface ApiErrorResponse {
  status: false
  data: null
  error: ApiErrorDetail
  message?: string
}

/** Detalhe do erro dentro do envelope de erro. */
export interface ApiErrorDetail {
  code: string
  message: string
  correlation_id?: string
  /** Erros de validação por campo (status 422). */
  details?: Record<string, string[]>
}

// ─── Paginação ──────────────────────────────────────────────

/** Metadados de paginação offset-based (LengthAwarePaginator do Laravel). */
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  next_page_url: string | null
  prev_page_url: string | null
}

/** Response paginada offset-based do backend. */
export interface PaginatedResponse<T> {
  status: true
  data: T[]
  pagination: PaginationMeta
  error: null
  message: string
}

/** Metadados de paginação cursor-based (CursorPaginator do Laravel). */
export interface CursorPaginationMeta {
  next_cursor: string | null
  prev_cursor: string | null
  per_page: number
  has_more_pages: boolean
}

/** Response paginada cursor-based do backend. */
export interface CursorPaginatedResponse<T> {
  status: true
  data: {
    data: T[]
    meta: CursorPaginationMeta
  }
  error: null
  message: string
}

// ─── Parâmetros de listagem ─────────────────────────────────

/** Parâmetros comuns para endpoints de listagem paginada. */
export interface ListParams {
  page?: number
  limit?: number
  sort_by?: string
  order?: 'asc' | 'desc'
}

/** Parâmetros para listagem de transações de cashback. */
export interface TransacaoListParams extends ListParams {
  data_inicio?: string
  data_fim?: string
  status_venda?: string
  status_cashback?: string
  cliente_id?: number
  campanha_id?: number
}

/** Parâmetros para listagem de clientes. */
export interface ClienteListParams extends ListParams {
  search?: string
}

/** Parâmetros para listagem de campanhas. */
export interface CampanhaListParams extends ListParams {
  status?: 'ativa' | 'inativa' | 'encerrada'
}

/** Parâmetros para listagem de contestações. */
export interface ContestacaoListParams extends ListParams {
  status?: 'pendente' | 'aprovada' | 'rejeitada'
  tipo?: string
}

/** Parâmetros para listagem de auditoria. */
export interface AuditoriaListParams extends ListParams {
  acao?: string
  entidade?: string
  usuario_id?: number
  data_inicio?: string
  data_fim?: string
}

/** Parâmetros para listagem de faturas. */
export interface FaturaListParams extends ListParams {
  status?: 'gerada' | 'enviada' | 'paga' | 'vencida'
}

/** Parâmetros para o endpoint de gráfico do dashboard. */
export interface DashboardChartParams {
  periodo?: '7d' | '30d' | '90d' | '12m'
}

/** Parâmetros para transações recentes do dashboard. */
export interface DashboardTransactionParams {
  limit?: number
}

// ─── HATEOAS Links ──────────────────────────────────────────

/** Link HATEOAS retornado nos resources do backend. */
export interface HypermediaLink {
  href: string
  method: string
  rel?: string
}

/** Mapa de links HATEOAS. */
export type HypermediaLinks = Record<string, HypermediaLink>

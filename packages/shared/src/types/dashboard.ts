/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Dashboard
 * Arquivo: dashboard.ts
 * Descrição: Tipos do dashboard espelhando os retornos reais
 *            do DashboardService/DashboardRepository do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

// ─── Tipos do backend (GET /api/v1/dashboard/stats) ─────────

/** Estatísticas gerais retornadas por GET /dashboard/stats. */
export interface DashboardStats {
  total_transacoes: number
  clientes_unicos: number
  ticket_medio: string
  total_cashback_concedido: string
  cashbacks_validos: string
  cashbacks_utilizados: string
  cashbacks_expirados: string
}

// ─── Tipos do backend (GET /api/v1/dashboard/chart) ─────────

/** Ponto de dados do gráfico retornado por GET /dashboard/chart. */
export interface ChartDataPoint {
  periodo: string
  total_vendas: number | null
  total_cashback: number | null
  quantidade: number
}

// ─── Tipos do backend (GET /api/v1/dashboard/top-clientes) ──

/** Item do ranking de top clientes. */
export interface TopCliente {
  cliente_id: number
  total_cashback: string
  total_transacoes: number
  cliente: {
    id: number
    cpf: string | null
    nome: string | null
    telefone: string | null
    email: string | null
  } | null
}

// ─── View Models do frontend ────────────────────────────────

/** Detalhe de uma métrica no card de resumo (frontend view model). */
export interface MetricDetail {
  valor?: number
  quantidade?: number
  variacao?: number
  tendencia?: 'up' | 'down'
  status?: string
  alerta?: boolean
}

/** Métricas de resumo para os cards do dashboard (frontend view model). */
export interface DashboardMetrics {
  saldoTotal: MetricDetail
  geradosHoje: MetricDetail
  utilizadosHoje: MetricDetail
  expiram7Dias: MetricDetail
}

/** Resumo de status para gráfico de donut. */
export interface StatusSummary {
  validos: number
  utilizados: number
  expirados: number
}

/** Transação recente para tabela do dashboard (frontend view model). */
export interface Transaction {
  id: string
  dataHora: string
  cliente: string
  tipo: string
  valor: number
  status: 'valido' | 'usado' | 'expirado'
}

/** Status de transação de cashback (frontend view model). */
export type CashbackTransactionStatus = 'credited' | 'pending' | 'redeemed' | 'expired' | 'processing'

/** Transação de cashback para tabela de transações (frontend view model). */
export interface CashbackTransaction {
  id: number
  date: string
  customer: string
  store: string
  cashback: number
  percentage: number
  status: CashbackTransactionStatus
}

/** Dados de sparkline para cards de resumo. */
export interface SummaryCardsData {
  total: number
  credited: number
  redeemed: number
  totalSparkline: number[]
  creditedSparkline: number[]
  redeemedSparkline: number[]
}

/** Dados completos do dashboard (frontend view model combinado). */
export interface DashboardData {
  metricas: DashboardMetrics
  grafico7Dias: ChartDataPoint[]
  porStatus: StatusSummary
  ultimasTransacoes: Transaction[]
  summaryCards: SummaryCardsData
}

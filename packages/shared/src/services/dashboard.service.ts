/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Dashboard
 * Arquivo: dashboard.service.ts
 * Descrição: Service para endpoints do dashboard — estatísticas,
 *            transações recentes, top clientes e dados de gráfico.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type {
  ApiResponse,
  DashboardStats,
  Transacao,
  TopCliente,
  ChartDataPoint,
  DashboardChartParams,
  DashboardTransactionParams,
} from '../types'

const dashboardService = {
  /**
   * Busca estatísticas gerais do dashboard.
   * GET /dashboard/stats
   */
  getStats() {
    return api.get<ApiResponse<DashboardStats>>('/dashboard/stats')
  },

  /**
   * Busca transações recentes para o dashboard.
   * GET /dashboard/transacoes
   */
  getTransacoes(params?: DashboardTransactionParams) {
    return api.get<ApiResponse<Transacao[]>>('/dashboard/transacoes', { params })
  },

  /**
   * Busca ranking de top clientes por cashback.
   * GET /dashboard/top-clientes
   */
  getTopClientes() {
    return api.get<ApiResponse<TopCliente[]>>('/dashboard/top-clientes')
  },

  /**
   * Busca dados do gráfico de evolução.
   * GET /dashboard/chart
   */
  getChart(params?: DashboardChartParams) {
    return api.get<ApiResponse<ChartDataPoint[]>>('/dashboard/chart', { params })
  },
}

export default dashboardService

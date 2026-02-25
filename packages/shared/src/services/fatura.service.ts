/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Faturas
 * Arquivo: fatura.service.ts
 * Descrição: Service para endpoints de faturas — listagem,
 *            link de pagamento e nota fiscal.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type { ApiResponse, PaginatedResponse, Fatura, FaturaListParams } from '../types'

const faturaService = {
  /**
   * Lista faturas com paginação e filtros.
   * GET /faturas
   */
  listar(params?: FaturaListParams) {
    return api.get<PaginatedResponse<Fatura>>('/faturas', { params })
  },

  /**
   * Busca o link de pagamento de uma fatura.
   * GET /faturas/:id/link-pagamento
   */
  getLinkPagamento(id: number) {
    return api.get<ApiResponse<{ link: string }>>(`/faturas/${id}/link-pagamento`)
  },

  /**
   * Busca a URL da nota fiscal de uma fatura.
   * GET /faturas/:id/nota-fiscal
   */
  getNotaFiscal(id: number) {
    return api.get<ApiResponse<{ url: string }>>(`/faturas/${id}/nota-fiscal`)
  },
}

export default faturaService

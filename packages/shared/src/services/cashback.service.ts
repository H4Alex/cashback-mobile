/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Cashback
 * Arquivo: cashback.service.ts
 * Descrição: Service para endpoints de transações de cashback —
 *            listagem, detalhes, geração, utilização e cancelamento.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type {
  ApiResponse,
  PaginatedResponse,
  Transacao,
  TransacaoListParams,
  GerarCashbackRequest,
  UtilizarCashbackRequest,
} from '../types'
import { gerarIdempotencyKey } from '../utils/token.utils'

const cashbackService = {
  /**
   * Lista transações de cashback com paginação e filtros.
   * GET /cashback
   */
  listar(params?: TransacaoListParams) {
    return api.get<PaginatedResponse<Transacao>>('/cashback', { params })
  },

  /**
   * Busca detalhes de uma transação de cashback pelo ID.
   * GET /cashback/:id
   */
  buscarPorId(id: number) {
    return api.get<ApiResponse<Transacao>>(`/cashback/${id}`)
  },

  /**
   * Gera um novo cashback para o cliente.
   * POST /cashback
   */
  gerar(data: GerarCashbackRequest) {
    return api.post<ApiResponse<Transacao>>('/cashback', data, {
      headers: { 'Idempotency-Key': gerarIdempotencyKey() },
    })
  },

  /**
   * Utiliza saldo de cashback do cliente em uma compra.
   * POST /cashback/utilizar
   */
  utilizar(data: UtilizarCashbackRequest) {
    return api.post<ApiResponse<Transacao>>('/cashback/utilizar', data, {
      headers: { 'Idempotency-Key': gerarIdempotencyKey() },
    })
  },

  /**
   * Cancela uma transação de cashback pelo ID.
   * POST /cashback/:id/cancelar
   */
  cancelar(id: number) {
    return api.post<ApiResponse<Transacao>>(`/cashback/${id}/cancelar`)
  },
}

export default cashbackService

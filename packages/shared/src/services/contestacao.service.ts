/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Contestações
 * Arquivo: contestacao.service.ts
 * Descrição: Service para endpoints de contestações/disputas —
 *            listagem, criação e resolução.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type {
  ApiResponse,
  PaginatedResponse,
  Contestacao,
  ContestacaoListParams,
  CriarContestacaoRequest,
  ResolverContestacaoRequest,
} from '../types'

const contestacaoService = {
  /**
   * Lista contestações com paginação e filtros.
   * GET /contestacoes
   */
  listar(params?: ContestacaoListParams) {
    return api.get<PaginatedResponse<Contestacao>>('/contestacoes', { params })
  },

  /**
   * Cria uma nova contestação.
   * POST /contestacoes
   */
  criar(data: CriarContestacaoRequest) {
    return api.post<ApiResponse<Contestacao>>('/contestacoes', data)
  },

  /**
   * Resolve (aprova ou rejeita) uma contestação.
   * PATCH /contestacoes/:id
   */
  resolver(id: number, data: ResolverContestacaoRequest) {
    return api.patch<ApiResponse<Contestacao>>(`/contestacoes/${id}`, data)
  },
}

export default contestacaoService

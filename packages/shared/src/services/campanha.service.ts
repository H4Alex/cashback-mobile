/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Campanhas
 * Arquivo: campanha.service.ts
 * Descrição: Service para endpoints de campanhas de cashback —
 *            listagem, detalhes, criação, atualização e exclusão.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type {
  ApiResponse,
  PaginatedResponse,
  Campanha,
  CampanhaListParams,
  CriarCampanhaRequest,
  AtualizarCampanhaRequest,
} from '../types'

const campanhaService = {
  /**
   * Lista campanhas com paginação e filtros.
   * GET /campanhas
   */
  listar(params?: CampanhaListParams) {
    return api.get<PaginatedResponse<Campanha>>('/campanhas', { params })
  },

  /**
   * Busca detalhes de uma campanha pelo ID.
   * GET /campanhas/:id
   */
  buscarPorId(id: number) {
    return api.get<ApiResponse<Campanha>>(`/campanhas/${id}`)
  },

  /**
   * Cria uma nova campanha.
   * POST /campanhas
   */
  criar(data: CriarCampanhaRequest) {
    return api.post<ApiResponse<Campanha>>('/campanhas', data)
  },

  /**
   * Atualiza dados de uma campanha existente.
   * PATCH /campanhas/:id
   */
  atualizar(id: number, data: AtualizarCampanhaRequest) {
    return api.patch<ApiResponse<Campanha>>(`/campanhas/${id}`, data)
  },

  /**
   * Remove uma campanha pelo ID.
   * DELETE /campanhas/:id
   */
  excluir(id: number) {
    return api.delete<ApiResponse<null>>(`/campanhas/${id}`)
  },
}

export default campanhaService

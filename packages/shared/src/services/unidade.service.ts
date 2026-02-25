/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Unidades de Negócio
 * Arquivo: unidade.service.ts
 * Descrição: Service para endpoints de unidades de negócio —
 *            listagem, criação, atualização e exclusão.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type { ApiResponse, UnidadeNegocio, CriarUnidadeRequest, AtualizarUnidadeRequest } from '../types'

const unidadeService = {
  /**
   * Lista todas as unidades de negócio da empresa.
   * GET /unidades
   */
  listar() {
    return api.get<ApiResponse<UnidadeNegocio[]>>('/unidades')
  },

  /**
   * Cria uma nova unidade de negócio.
   * POST /unidades
   */
  criar(data: CriarUnidadeRequest) {
    return api.post<ApiResponse<UnidadeNegocio>>('/unidades', data)
  },

  /**
   * Atualiza dados de uma unidade de negócio existente.
   * PATCH /unidades/:id
   */
  atualizar(id: number, data: AtualizarUnidadeRequest) {
    return api.patch<ApiResponse<UnidadeNegocio>>(`/unidades/${id}`, data)
  },

  /**
   * Remove uma unidade de negócio pelo ID.
   * DELETE /unidades/:id
   */
  excluir(id: number) {
    return api.delete<ApiResponse<null>>(`/unidades/${id}`)
  },
}

export default unidadeService

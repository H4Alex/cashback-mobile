/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Auditoria
 * Arquivo: auditoria.service.ts
 * Descrição: Service para endpoint de logs de auditoria —
 *            listagem paginada com filtros.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type { PaginatedResponse, LogAuditoria, AuditoriaListParams } from '../types'

const auditoriaService = {
  /**
   * Lista logs de auditoria com paginação e filtros.
   * GET /auditoria
   */
  listar(params?: AuditoriaListParams) {
    return api.get<PaginatedResponse<LogAuditoria>>('/auditoria', { params })
  },
}

export default auditoriaService

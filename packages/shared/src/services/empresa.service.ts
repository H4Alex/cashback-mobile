/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Empresas
 * Arquivo: empresa.service.ts
 * Descrição: Service para endpoint de empresas — listagem de
 *            empresas associadas ao usuário autenticado.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type { ApiResponse, EmpresaRef } from '../types'

const empresaService = {
  /**
   * Lista as empresas associadas ao usuário autenticado.
   * GET /empresas
   */
  listar() {
    return api.get<ApiResponse<EmpresaRef[]>>('/empresas')
  },
}

export default empresaService

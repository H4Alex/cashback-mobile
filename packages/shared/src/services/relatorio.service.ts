/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Relatórios
 * Arquivo: relatorio.service.ts
 * Descrição: Service para endpoint de relatórios — geração de
 *            relatórios com parâmetros dinâmicos por tipo.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type { ApiResponse } from '../types'

/** Parâmetros genéricos para geração de relatórios. */
interface RelatorioParams {
  tipo: string
  data_inicio?: string
  data_fim?: string
  formato?: 'json' | 'csv' | 'pdf'
  [key: string]: string | number | boolean | undefined
}

const relatorioService = {
  /**
   * Gera um relatório com base nos parâmetros informados.
   * GET /relatorios
   */
  gerar<T = unknown>(params: RelatorioParams) {
    return api.get<ApiResponse<T>>('/relatorios', { params })
  },
}

export default relatorioService

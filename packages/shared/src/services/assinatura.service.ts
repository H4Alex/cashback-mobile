/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Assinaturas
 * Arquivo: assinatura.service.ts
 * Descrição: Service para endpoints de assinaturas — planos
 *            disponíveis, assinatura atual e upgrade de plano.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type { ApiResponse, Plano, Assinatura, UpgradeAssinaturaRequest } from '../types'

const assinaturaService = {
  /**
   * Lista todos os planos disponíveis.
   * GET /assinaturas/planos
   */
  getPlanos() {
    return api.get<ApiResponse<Plano[]>>('/assinaturas/planos')
  },

  /**
   * Busca a assinatura ativa da empresa autenticada.
   * GET /assinaturas/minha
   */
  getMinha() {
    return api.get<ApiResponse<Assinatura>>('/assinaturas/minha')
  },

  /**
   * Realiza upgrade do plano da assinatura.
   * POST /assinaturas/upgrade
   */
  upgrade(data: UpgradeAssinaturaRequest) {
    return api.post<ApiResponse<Assinatura>>('/assinaturas/upgrade', data)
  },
}

export default assinaturaService

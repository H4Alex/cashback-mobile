/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Configurações
 * Arquivo: config.service.ts
 * Descrição: Service para endpoints de configuração da empresa —
 *            dados gerais, atualização e upload de logo.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type { ApiResponse, Empresa, AtualizarConfigRequest } from '../types'

const configService = {
  /**
   * Busca as configurações da empresa autenticada.
   * GET /config
   */
  get() {
    return api.get<ApiResponse<Empresa>>('/config')
  },

  /**
   * Atualiza as configurações da empresa.
   * PATCH /config
   */
  atualizar(data: AtualizarConfigRequest) {
    return api.patch<ApiResponse<Empresa>>('/config', data)
  },

  /**
   * Faz upload da logo da empresa.
   * POST /config/logo
   */
  uploadLogo(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return api.post<ApiResponse<{ logo_url: string }>>('/config/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default configService

/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Notificações
 * Arquivo: notificacao.service.ts
 * Descrição: Service para endpoints de configuração de notificações —
 *            listagem e atualização de canais (email, sms, push).
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type { ApiResponse, NotificacaoConfig, AtualizarNotificacaoConfigRequest } from '../types'

const notificacaoService = {
  /**
   * Busca todas as configurações de notificação da empresa.
   * GET /notificacoes/config
   */
  getConfig() {
    return api.get<ApiResponse<NotificacaoConfig[]>>('/notificacoes/config')
  },

  /**
   * Atualiza a configuração de um canal de notificação.
   * PATCH /notificacoes/config
   */
  atualizarConfig(data: AtualizarNotificacaoConfigRequest) {
    return api.patch<ApiResponse<NotificacaoConfig>>('/notificacoes/config', data)
  },
}

export default notificacaoService

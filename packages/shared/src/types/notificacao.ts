/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Notificações
 * Arquivo: notificacao.ts
 * Descrição: Tipos de configuração de notificações espelhando
 *            o model NotificacaoConfig do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

// ─── Enums/Union Types ──────────────────────────────────────

/** Canais de notificação suportados. */
export type CanalNotificacao = 'email' | 'sms' | 'push'

// ─── Entidade principal ─────────────────────────────────────

/** Configuração de canal de notificação retornada pelo backend. */
export interface NotificacaoConfig {
  id: number
  empresa_id: number
  canal: CanalNotificacao
  ativo: boolean
  created_at: string
  updated_at: string
}

// ─── DTOs de Request ────────────────────────────────────────

/** PATCH /api/v1/notificacoes/config — AtualizarNotificacaoConfigRequest do backend. */
export interface AtualizarNotificacaoConfigRequest {
  canal: CanalNotificacao
  ativo: boolean
}

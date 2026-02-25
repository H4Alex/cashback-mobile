/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Auditoria
 * Arquivo: auditLog.ts
 * Descrição: Tipos de log de auditoria espelhando o model
 *            Auditoria do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

// ─── Enums/Union Types ──────────────────────────────────────

/** Ações registradas na auditoria (model Auditoria do backend). */
export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout'

/** Entidades auditadas. */
export type AuditEntity = string

// ─── Entidade principal ─────────────────────────────────────

/** Log de auditoria retornado pelo backend. */
export interface LogAuditoria {
  id: number
  empresa_id: number | null
  usuario_id: number | null
  acao: AuditAction
  entidade: string
  entidade_id: number | null
  dados_anteriores: Record<string, unknown> | null
  dados_novos: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
  /** Relação carregada (opcional). */
  usuario?: {
    id: number
    nome: string
    email: string
  }
}

/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Unidade de Negócio
 * Arquivo: unidadeNegocio.ts
 * Descrição: Tipos de unidade de negócio espelhando o model
 *            UnidadeNegocio do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

// ─── Enums/Union Types ──────────────────────────────────────

/** Status da unidade de negócio. */
export type UnidadeStatus = 'ativa' | 'inativa'

// ─── Entidade principal ─────────────────────────────────────

/** Unidade de negócio retornada pelo backend. */
export interface UnidadeNegocio {
  id: number
  empresa_id: number
  nome: string
  status: UnidadeStatus
  created_at: string
  updated_at: string
}

// ─── DTOs de Request ────────────────────────────────────────

/** POST /api/v1/unidades — CriarUnidadeRequest do backend. */
export interface CriarUnidadeRequest {
  nome: string
  status?: UnidadeStatus
}

/** PATCH /api/v1/unidades/:id — AtualizarUnidadeRequest do backend. */
export interface AtualizarUnidadeRequest {
  nome?: string
  status?: UnidadeStatus
}

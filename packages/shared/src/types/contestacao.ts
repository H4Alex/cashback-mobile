/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Contestações
 * Arquivo: contestacao.ts
 * Descrição: Tipos de contestação/disputa espelhando o model
 *            Contestacao e DTOs do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

// ─── Enums/Union Types ──────────────────────────────────────

/** Tipo de contestação (model Contestacao do backend). */
export type ContestacaoTipo = 'cashback_nao_gerado' | 'valor_incorreto' | 'expiracao_indevida' | 'venda_cancelada'

/** Status da contestação (model Contestacao do backend). */
export type ContestacaoStatus = 'pendente' | 'aprovada' | 'rejeitada'

// ─── Entidade principal ─────────────────────────────────────

/** Contestação retornada pelo backend. */
export interface Contestacao {
  id: number
  empresa_id: number
  transacao_id: number
  cliente_id: number | null
  tipo: ContestacaoTipo
  descricao: string
  status: ContestacaoStatus
  resposta: string | null
  respondido_por: number | null
  created_at: string
  updated_at: string
}

// ─── DTOs de Request ────────────────────────────────────────

/** POST /api/v1/contestacoes — CriarContestacaoRequest do backend. */
export interface CriarContestacaoRequest {
  transacao_id: number
  tipo: ContestacaoTipo
  descricao: string
}

/** PATCH /api/v1/contestacoes/:id — ResolverContestacaoRequest do backend. */
export interface ResolverContestacaoRequest {
  status: 'aprovada' | 'rejeitada'
  resposta: string
}

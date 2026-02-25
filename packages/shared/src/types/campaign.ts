/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Campanhas
 * Arquivo: campaign.ts
 * Descrição: Tipos de campanha espelhando o model Campanha e
 *            resource CampanhaResource do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

import type { HypermediaLinks } from './api'

// ─── Enums/Union Types ──────────────────────────────────────

/** Status da campanha (model Campanha do backend). */
export type CampanhaStatus = 'ativa' | 'inativa' | 'encerrada'

// ─── Entidade principal ─────────────────────────────────────

/** Campanha retornada pelo CampanhaResource do backend. */
export interface Campanha {
  id: number
  empresa_id: number
  nome: string
  data_inicio: string
  data_fim: string
  percentual: number
  validade_padrao: number
  status: CampanhaStatus
  created_at: string
  updated_at: string
  /** Links HATEOAS. */
  _links?: HypermediaLinks
}

// ─── DTOs de Request ────────────────────────────────────────

/** POST /api/v1/campanhas — CriarCampanhaRequest do backend. */
export interface CriarCampanhaRequest {
  nome: string
  data_inicio: string
  data_fim: string
  percentual: number
  validade_padrao: number
}

/** PATCH /api/v1/campanhas/:id — AtualizarCampanhaRequest do backend. */
export interface AtualizarCampanhaRequest {
  nome?: string
  data_inicio?: string
  data_fim?: string
  percentual?: number
  validade_padrao?: number
  status?: CampanhaStatus
}

// ─── Tipos legados para compatibilidade ─────────────────────

/** @deprecated Use `CampanhaStatus`. */
export type CampaignStatus = 'ativa' | 'agendada' | 'finalizada'

/** @deprecated Use `Campanha`. */
export interface Campaign {
  id: string
  nome: string
  dataInicio: string
  dataFim: string
  percentual: number
  validadePadrao?: number
  status: CampaignStatus
}

/** @deprecated Use `CriarCampanhaRequest`. */
export interface CreateCampaignDTO {
  nome: string
  dataInicio: string
  dataFim: string
  percentual: number
  validadePadrao?: number
}

/** @deprecated Use `AtualizarCampanhaRequest`. */
export interface UpdateCampaignDTO {
  nome?: string
  dataInicio?: string
  dataFim?: string
  percentual?: number
  validadePadrao?: number
  status?: CampaignStatus
}

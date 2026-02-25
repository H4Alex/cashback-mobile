/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Cashback
 * Arquivo: cashback.ts
 * Descrição: Tipos de transação de cashback espelhando os
 *            models Transacao e resources TransacaoResource
 *            do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

import type { HypermediaLinks } from './api'
import type { Cliente } from './customer'
import type { Campanha } from './campaign'

// ─── Enums/Union Types ──────────────────────────────────────

/** Status da venda (model Transacao). */
export type StatusVenda = 'concluida' | 'cancelada'

/** Status do cashback (model Transacao). */
export type StatusCashback = 'pendente' | 'confirmado' | 'utilizado' | 'rejeitado' | 'expirado' | 'congelado'

// ─── Entidade principal ─────────────────────────────────────

/** Transação de cashback retornada pelo TransacaoResource do backend. */
export interface Transacao {
  id: number
  empresa_id: number
  unidade_negocio_id: number | null
  cliente_id: number
  campanha_id: number | null
  operador_id: number
  valor_compra: string
  percentual_cashback: string
  valor_cashback: string
  status_venda: StatusVenda
  status_cashback: StatusCashback
  data_expiracao: string | null
  data_confirmacao: string | null
  transacao_origem_id: number | null
  dias_restantes_congelamento: number | null
  created_at: string
  updated_at: string
  /** Relação carregada (whenLoaded). */
  cliente?: Cliente
  /** Relação carregada (whenLoaded). */
  campanha?: Campanha
  /** Relação carregada (whenLoaded). */
  operador?: {
    id: number
    nome: string
    email: string
  }
  /** Relação carregada (whenLoaded). */
  unidade_negocio?: {
    id: number
    nome: string
    status: 'ativa' | 'inativa'
  }
  /** Links HATEOAS. */
  _links?: HypermediaLinks
}

// ─── DTOs de Request ────────────────────────────────────────

/** POST /api/v1/cashback — GerarCashbackRequest do backend. */
export interface GerarCashbackRequest {
  cpf: string
  valor_compra: number
  campanha_id?: number
  unidade_negocio_id?: number
}

/** POST /api/v1/cashback/utilizar — UtilizarCashbackRequest do backend. */
export interface UtilizarCashbackRequest {
  cpf: string
  valor_compra: number
  unidade_negocio_id?: number
}

// ─── Tipos legados para compatibilidade ─────────────────────

/**
 * @deprecated Use `Transacao` em vez de `Cashback`.
 */
export interface Cashback {
  id: string
  customer_id: string
  transaction_id: string
  amount: number
  percentage: number
  status: 'credited' | 'pending' | 'redeemed' | 'expired' | 'processing'
  expires_at: string
  created_at: string
}

/**
 * @deprecated Use `GerarCashbackRequest` em vez de `CashbackCreatePayload`.
 */
export interface CashbackCreatePayload {
  customer_id: string
  transaction_id: string
  amount: number
  percentage: number
}

/**
 * @deprecated Use `UtilizarCashbackRequest`.
 */
export interface CashbackRedeemPayload {
  amount: number
}

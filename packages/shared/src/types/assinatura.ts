/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Assinaturas e Faturas
 * Arquivo: assinatura.ts
 * Descrição: Tipos de assinatura, plano e fatura espelhando
 *            os models Assinatura, Plano e Fatura do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

// ─── Enums/Union Types ──────────────────────────────────────

/** Ciclo de cobrança da assinatura. */
export type AssinaturaCiclo = 'mensal' | 'anual'

/** Status da assinatura. */
export type AssinaturaStatus = 'trial' | 'ativa' | 'inadimplente' | 'cancelada'

/** Status da fatura. */
export type FaturaStatus = 'gerada' | 'enviada' | 'paga' | 'vencida'

/** Nível de relatório do plano. */
export type NivelRelatorio = 'simples' | 'completos' | 'avancados'

/** Nível de suporte do plano. */
export type NivelSuporte = 'email' | 'prioritario' | '24_7_gerente'

// ─── Entidades ──────────────────────────────────────────────

/** Plano de assinatura do SaaS. */
export interface Plano {
  id: number
  nome: string
  slug: string
  preco_mensal: number
  preco_anual: number
  max_clientes: number | null
  max_campanhas: number | null
  max_usuarios: number
  tem_unidades_negocio: boolean
  nivel_relatorio: NivelRelatorio
  nivel_suporte: NivelSuporte
  created_at: string
  updated_at: string
}

/** Assinatura ativa da empresa. */
export interface Assinatura {
  id: number
  empresa_id: number
  plano_id: number
  ciclo: AssinaturaCiclo
  status: AssinaturaStatus
  data_inicio: string
  data_fim_trial: string | null
  data_proxima_cobranca: string | null
  created_at: string
  updated_at: string
  /** Relação carregada. */
  plano?: Plano
}

/** Fatura de cobrança. */
export interface Fatura {
  id: number
  empresa_id: number
  assinatura_id: number
  valor: number
  status: FaturaStatus
  starkbank_invoice_id: string | null
  link_pagamento: string | null
  nfe_url: string | null
  referencia: string | null
  data_vencimento: string
  data_pagamento: string | null
  created_at: string
  updated_at: string
}

// ─── DTOs de Request ────────────────────────────────────────

/** POST /api/v1/assinaturas/upgrade */
export interface UpgradeAssinaturaRequest {
  plano_id: number
  ciclo?: AssinaturaCiclo
}

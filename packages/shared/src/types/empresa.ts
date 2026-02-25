/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Empresa
 * Arquivo: empresa.ts
 * Descrição: Tipos de empresa espelhando o model Empresa e
 *            resource EmpresaResource do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

import type { HypermediaLinks } from './api'

// ─── Enums/Union Types ──────────────────────────────────────

/** Modo de saldo do cashback. */
export type ModoSaldo = 'individual' | 'global'

// ─── Entidade principal ─────────────────────────────────────

/** Empresa retornada pelo EmpresaResource do backend. */
export interface Empresa {
  id: number
  nome_fantasia: string
  razao_social: string | null
  cnpj: string
  telefone: string | null
  email: string | null
  cep: string | null
  rua: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  logo_url: string | null
  carencia_horas: number
  modo_saldo: ModoSaldo
  percentual_cashback: number
  validade_cashback: number
  percentual_max_utilizacao: number
  created_at: string
  updated_at: string
  /** Relação carregada (whenLoaded). */
  assinatura_ativa?: import('./assinatura').Assinatura
  /** Links HATEOAS. */
  _links?: HypermediaLinks
}

// ─── DTOs de Request ────────────────────────────────────────

/** PATCH /api/v1/config — AtualizarConfigRequest do backend. */
export interface AtualizarConfigRequest {
  nome_fantasia?: string
  razao_social?: string | null
  telefone?: string | null
  email?: string | null
  cep?: string | null
  rua?: string | null
  numero?: string | null
  complemento?: string | null
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
  percentual_cashback?: number
  validade_cashback?: number
  percentual_max_utilizacao?: number
  carencia_horas?: number
}

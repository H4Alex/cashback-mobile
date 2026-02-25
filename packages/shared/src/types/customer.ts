/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Clientes
 * Arquivo: customer.ts
 * Descrição: Tipos de cliente espelhando o model Cliente e
 *            resource ClienteResource do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

import type { HypermediaLinks } from './api'

// ─── Entidade principal ─────────────────────────────────────

/** Cliente retornado pelo ClienteResource do backend. */
export interface Cliente {
  id: number
  /** CPF mascarado (***.___.___-**) retornado pelo backend. */
  cpf: string | null
  nome: string | null
  telefone: string | null
  email: string | null
  created_at: string
  updated_at: string
  /** Links HATEOAS. */
  _links?: HypermediaLinks
}

// ─── DTOs de Request ────────────────────────────────────────

/** POST /api/v1/clientes — CriarClienteRequest do backend. */
export interface CriarClienteRequest {
  cpf: string
  nome?: string
  telefone?: string
  email?: string
}

/** PATCH /api/v1/clientes/:id — AtualizarClienteRequest do backend. */
export interface AtualizarClienteRequest {
  nome?: string
  telefone?: string | null
  email?: string | null
}

// ─── Saldo do cliente ───────────────────────────────────────

/** Resposta de GET /api/v1/clientes/:id/saldo */
export interface ClienteSaldo {
  cliente_id: number
  saldo_total: string
  saldo_disponivel: string
  saldo_pendente: string
  saldo_congelado: string
}

// ─── Tipos legados para compatibilidade ─────────────────────

/**
 * @deprecated Use `Cliente` em vez de `Customer`.
 */
export interface Customer {
  id: string
  nome: string
  cpf: string
  telefone: string
  email: string
  ultimoCashback: { valor: number; data: string } | null
}

/**
 * @deprecated Use `Cliente` em vez de `CustomerDetail`.
 */
export interface CustomerDetail {
  id: string
  nome: string
  cpf: string
  telefone: string
  email: string
  saldo: number
  ultimoCashback: string | null
  status: 'ativo' | 'inativo'
}

/**
 * @deprecated Use `CriarClienteRequest` em vez de `CreateCustomerDTO`.
 */
export interface CreateCustomerDTO {
  nome: string
  cpf: string
  telefone: string
  email: string
}

/**
 * @deprecated Use `AtualizarClienteRequest` em vez de `UpdateCustomerDTO`.
 */
export interface UpdateCustomerDTO {
  nome?: string
  telefone?: string
  email?: string
}

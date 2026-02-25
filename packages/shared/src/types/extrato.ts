/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Extrato
 * Arquivo: extrato.ts
 * Descrição: Tipos de extrato de cashback — derivados das
 *            transações retornadas pelo endpoint
 *            GET /api/v1/clientes/:id/extrato do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

/** Tipo de movimentação no extrato. */
export type ExtratoTipo = 'gerado' | 'utilizado' | 'expirado'

/** Status de validade do cashback. */
export type ExtratoStatus = 'valido' | 'usado' | 'expirado'

/** Entrada no extrato de cashback do cliente. */
export interface ExtratoEntry {
  id: number
  tipo: ExtratoTipo
  valor: number
  data: string
  loja: string
  status: ExtratoStatus
  expiracao?: string
  compraId?: number
}

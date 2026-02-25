/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Vendas
 * Arquivo: venda.ts
 * Descrição: Tipo de venda — view model do frontend que mapeia
 *            dados da Transacao do backend para exibição na
 *            tela de vendas.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

export type VendaStatus = 'concluida' | 'cancelada'

/**
 * View model para a tela de vendas.
 * Derivado de Transacao do backend, com campos simplificados
 * para exibição na tabela de vendas.
 */
export interface Venda {
  id: number
  dataHora: string
  cliente: string
  valorVenda: number
  cashbackGerado: number
  percentualAplicado: number
  status: VendaStatus
  campanha?: string
}

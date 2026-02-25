/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Clientes
 * Arquivo: cliente.service.ts
 * Descrição: Service para endpoints de clientes — listagem,
 *            detalhes, criação, atualização, saldo e extrato.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type {
  ApiResponse,
  PaginatedResponse,
  Cliente,
  ClienteListParams,
  CriarClienteRequest,
  AtualizarClienteRequest,
  ClienteSaldo,
  Transacao,
  TransacaoListParams,
} from '../types'

const clienteService = {
  /**
   * Lista clientes com paginação e filtros.
   * GET /clientes
   */
  listar(params?: ClienteListParams) {
    return api.get<PaginatedResponse<Cliente>>('/clientes', { params })
  },

  /**
   * Busca detalhes de um cliente pelo ID.
   * GET /clientes/:id
   */
  buscarPorId(id: number) {
    return api.get<ApiResponse<Cliente>>(`/clientes/${id}`)
  },

  /**
   * Cria um novo cliente.
   * POST /clientes
   */
  criar(data: CriarClienteRequest) {
    return api.post<ApiResponse<Cliente>>('/clientes', data)
  },

  /**
   * Atualiza dados de um cliente existente.
   * PATCH /clientes/:id
   */
  atualizar(id: number, data: AtualizarClienteRequest) {
    return api.patch<ApiResponse<Cliente>>(`/clientes/${id}`, data)
  },

  /**
   * Busca o saldo de cashback do cliente.
   * GET /clientes/:id/saldo
   */
  getSaldo(id: number) {
    return api.get<ApiResponse<ClienteSaldo>>(`/clientes/${id}/saldo`)
  },

  /**
   * Busca o extrato de transações do cliente com paginação.
   * GET /clientes/:id/extrato
   */
  getExtrato(id: number, params?: TransacaoListParams) {
    return api.get<PaginatedResponse<Transacao>>(`/clientes/${id}/extrato`, { params })
  },
}

export default clienteService

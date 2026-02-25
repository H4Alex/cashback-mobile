/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Usuários Internos
 * Arquivo: usuario.service.ts
 * Descrição: Service para endpoints de usuários internos da empresa —
 *            listagem, criação, atualização e exclusão.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3 — Módulos de Domínio
 * ============================================================
 */

import api from './apiClient'
import type { ApiResponse, UsuarioInterno, CriarUsuarioInternoRequest, AtualizarUsuarioInternoRequest } from '../types'

const usuarioService = {
  /**
   * Lista todos os usuários internos da empresa.
   * GET /usuarios
   */
  listar() {
    return api.get<ApiResponse<UsuarioInterno[]>>('/usuarios')
  },

  /**
   * Cria um novo usuário interno.
   * POST /usuarios
   */
  criar(data: CriarUsuarioInternoRequest) {
    return api.post<ApiResponse<UsuarioInterno>>('/usuarios', data)
  },

  /**
   * Atualiza dados de um usuário interno existente.
   * PATCH /usuarios/:id
   */
  atualizar(id: number, data: AtualizarUsuarioInternoRequest) {
    return api.patch<ApiResponse<UsuarioInterno>>(`/usuarios/${id}`, data)
  },

  /**
   * Remove um usuário interno pelo ID.
   * DELETE /usuarios/:id
   */
  excluir(id: number) {
    return api.delete<ApiResponse<null>>(`/usuarios/${id}`)
  },
}

export default usuarioService

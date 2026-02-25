/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Usuários Internos
 * Arquivo: usuarioInterno.ts
 * Descrição: Tipos de usuário interno da empresa espelhando
 *            DTOs e UserResource do backend.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

import type { EmpresaPerfil } from './auth'

// ─── Entidade principal ─────────────────────────────────────

/** Usuário interno retornado pelo UserResource do backend. */
export interface UsuarioInterno {
  id: number
  nome: string
  email: string
  telefone: string | null
  tipo_global: 'admin' | null
  created_at: string
  updated_at: string
  /** Perfil dentro da empresa (vem do pivot). */
  perfil?: EmpresaPerfil
}

// ─── DTOs de Request ────────────────────────────────────────

/** Perfis que podem ser atribuídos a usuários internos (exceto proprietário). */
export type PerfilUsuarioInterno = 'gestor' | 'operador' | 'vendedor'

/** POST /api/v1/usuarios — CriarUsuarioRequest do backend. */
export interface CriarUsuarioInternoRequest {
  nome: string
  email: string
  senha: string
  telefone?: string
  perfil: PerfilUsuarioInterno
  unidade_negocio_ids?: number[]
}

/** PATCH /api/v1/usuarios/:id — AtualizarUsuarioRequest do backend. */
export interface AtualizarUsuarioInternoRequest {
  nome?: string
  email?: string
  telefone?: string | null
  perfil?: PerfilUsuarioInterno
  unidade_negocio_ids?: number[]
}

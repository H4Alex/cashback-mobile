/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Infraestrutura
 * Arquivo: token.utils.ts
 * Descrição: Gestão de tokens JWT. O backend usa httpOnly cookies
 *            para o token principal, mas retorna tokens em body
 *            para cenários de multi-empresa e 2FA. Este utilitário
 *            gerencia o token no header Authorization quando necessário.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

import { secureSetItem, secureGetItem, secureRemoveItem } from './secureStorage'

const TOKEN_KEY = 'h4cb_access_token'

/**
 * Armazena o token JWT de forma segura (AES-GCM via secureStorage).
 * Usado quando o backend retorna token explícito no body (multi-empresa, 2FA).
 */
export async function salvarToken(token: string): Promise<void> {
  await secureSetItem(TOKEN_KEY, token)
}

/**
 * Recupera o token JWT armazenado.
 * Retorna null se não houver token salvo.
 */
export async function obterToken(): Promise<string | null> {
  return secureGetItem<string>(TOKEN_KEY)
}

/**
 * Remove o token JWT armazenado (usado no logout).
 */
export function removerToken(): void {
  secureRemoveItem(TOKEN_KEY)
}

/**
 * Verifica se existe um token armazenado.
 */
export async function possuiToken(): Promise<boolean> {
  const token = await obterToken()
  return token !== null
}

/**
 * Gera uma chave de idempotência única (UUID v4).
 * Requerida pelo backend para POST cashback e cashback/utilizar.
 */
export function gerarIdempotencyKey(): string {
  return crypto.randomUUID()
}

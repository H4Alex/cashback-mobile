/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Infraestrutura
 * Arquivo: error.utils.ts
 * Descrição: Parser de erros da API compatível com o formato
 *            real do backend (ApiResponse + exception handler).
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 1 — Infraestrutura Base
 * ============================================================
 */

import axios from 'axios'
import type { ApiErrorDetail } from '../types/api'

/** Resultado do parsing de um erro da API. */
export interface ParsedApiError {
  /** Código de erro do backend (ex: 'VALIDATION_ERROR', 'INVALID_CREDENTIALS'). */
  code: string
  /** Mensagem legível para exibição ao usuário. */
  message: string
  /** Erros de validação por campo (apenas para status 422). */
  fieldErrors: Record<string, string[]>
  /** Status HTTP da response. */
  statusCode: number | null
  /** ID de correlação para rastreamento. */
  correlationId: string | null
}

/** Mensagens padrão por status HTTP em pt-BR. */
const MENSAGENS_POR_STATUS: Record<number, string> = {
  400: 'Requisição inválida.',
  401: 'Sessão expirada. Faça login novamente.',
  402: 'Assinatura inativa. Ative seu plano para continuar.',
  403: 'Você não tem permissão para realizar esta ação.',
  404: 'Recurso não encontrado.',
  409: 'Conflito com o estado atual do recurso.',
  422: 'Erro de validação. Verifique os campos.',
  423: 'Conta bloqueada temporariamente.',
  429: 'Muitas requisições. Aguarde um momento.',
  500: 'Erro interno do servidor. Tente novamente mais tarde.',
  503: 'Serviço temporariamente indisponível.',
}

/**
 * Extrai informações estruturadas de um erro da API.
 * Compatível com o formato { status, data, error: { code, message, details } } do backend.
 */
export function parseApiError(error: unknown): ParsedApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null
    const responseData = error.response?.data

    // Backend retorna { status: false, error: { code, message, details?, correlation_id? } }
    if (responseData && typeof responseData === 'object' && 'error' in responseData) {
      const apiError = responseData.error as ApiErrorDetail | null

      if (apiError && typeof apiError === 'object') {
        return {
          code: apiError.code || 'UNKNOWN_ERROR',
          message: apiError.message || mensagemPorStatus(status),
          fieldErrors: apiError.details ?? {},
          statusCode: status,
          correlationId: apiError.correlation_id ?? null,
        }
      }
    }

    // Fallback: backend retornou mensagem simples (sem envelope de erro)
    const mensagemServidor = responseData?.message
    if (mensagemServidor && typeof mensagemServidor === 'string') {
      return {
        code: `HTTP_${status}`,
        message: mensagemServidor,
        fieldErrors: {},
        statusCode: status,
        correlationId: null,
      }
    }

    // Erro de rede (sem response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return {
          code: 'TIMEOUT',
          message: 'Tempo limite excedido. Verifique sua conexão.',
          fieldErrors: {},
          statusCode: null,
          correlationId: null,
        }
      }
      return {
        code: 'NETWORK_ERROR',
        message: 'Sem conexão com o servidor. Verifique sua internet.',
        fieldErrors: {},
        statusCode: null,
        correlationId: null,
      }
    }

    // Fallback por status HTTP
    return {
      code: `HTTP_${status}`,
      message: mensagemPorStatus(status),
      fieldErrors: {},
      statusCode: status,
      correlationId: null,
    }
  }

  // Rate limiter do frontend
  if (error instanceof Error && error.message.includes('Rate limit')) {
    return {
      code: 'CLIENT_RATE_LIMIT',
      message: 'Muitas requisições. Aguarde um momento.',
      fieldErrors: {},
      statusCode: 429,
      correlationId: null,
    }
  }

  // Erro genérico
  return {
    code: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.',
    fieldErrors: {},
    statusCode: null,
    correlationId: null,
  }
}

/**
 * Extrai a mensagem de erro amigável em pt-BR de qualquer erro.
 * Atalho para parseApiError(error).message.
 */
export function obterMensagemErro(error: unknown): string {
  return parseApiError(error).message
}

/**
 * Verifica se o erro é de validação (422) e possui erros por campo.
 */
export function isValidationError(error: unknown): boolean {
  const parsed = parseApiError(error)
  return parsed.statusCode === 422 && Object.keys(parsed.fieldErrors).length > 0
}

/**
 * Extrai os erros de validação por campo do backend.
 * Retorna objeto vazio se não for erro de validação.
 */
export function obterErrosValidacao(error: unknown): Record<string, string[]> {
  return parseApiError(error).fieldErrors
}

function mensagemPorStatus(status: number | null): string {
  if (status === null) return 'Erro desconhecido.'
  return MENSAGENS_POR_STATUS[status] ?? `Erro ${status}.`
}

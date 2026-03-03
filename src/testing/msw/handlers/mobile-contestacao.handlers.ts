/**
 * MSW handlers — Mobile Contestacao endpoints.
 *
 * Base: /api/mobile/v1
 */
import { http, HttpResponse } from 'msw'
import {
  createMockContestacao,
  createMockContestacaoList,
} from '../fixtures'

const BASE = '*/api/mobile/v1'

// ─── Happy-path handlers ────────────────────────────────────

export const mobileContestacaoHandlers = [
  /** GET /contestacoes */
  http.get(`${BASE}/contestacoes`, () => {
    const contestacoes = createMockContestacaoList(5)
    return HttpResponse.json({
      status: true,
      data: contestacoes,
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: contestacoes.length,
        next_page_url: null,
        prev_page_url: null,
      },
      error: null,
      message: 'Contestações carregadas.',
    })
  }),

  /** POST /contestacoes */
  http.post(`${BASE}/contestacoes`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockContestacao({ status: 'pendente' }),
      error: null,
      message: 'Contestação criada com sucesso.',
    })
  }),
]

// ─── Error handlers ─────────────────────────────────────────

export const mobileContestacaoErrorHandlers = {
  unauthorized: http.get(`${BASE}/contestacoes`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token expirado ou inválido.',
        },
        message: 'Token expirado ou inválido.',
      },
      { status: 401 },
    )
  }),

  forbidden: http.post(`${BASE}/contestacoes`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'FORBIDDEN',
          message: 'Acesso negado.',
        },
        message: 'Acesso negado.',
      },
      { status: 403 },
    )
  }),

  notFound: http.get(`${BASE}/contestacoes`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Contestação não encontrada.',
        },
        message: 'Contestação não encontrada.',
      },
      { status: 404 },
    )
  }),

  validationError: http.post(`${BASE}/contestacoes`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos.',
          details: {
            transacao_id: ['A transação informada não existe.'],
            descricao: ['A descrição deve ter no mínimo 10 caracteres.'],
          },
        },
        message: 'Dados inválidos.',
      },
      { status: 422 },
    )
  }),

  serverError: http.post(`${BASE}/contestacoes`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro interno do servidor.',
        },
        message: 'Erro interno do servidor.',
      },
      { status: 500 },
    )
  }),
}

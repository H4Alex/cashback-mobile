/**
 * MSW handlers — Mobile Cashback / Extrato / Lojas endpoints.
 *
 * Base: /api/mobile/v1
 */
import { http, HttpResponse } from 'msw'
import {
  createMockSaldoData,
  createMockExtratoList,
  createMockEmpresaMerchant,
} from '../fixtures'
import { faker } from '@faker-js/faker/locale/pt_BR'

const BASE = '*/api/mobile/v1'

// ─── Happy-path handlers ────────────────────────────────────

export const mobileCashbackHandlers = [
  /** GET /saldo */
  http.get(`${BASE}/saldo`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockSaldoData(),
      error: null,
      message: 'Saldo carregado.',
    })
  }),

  /** GET /extrato */
  http.get(`${BASE}/extrato`, () => {
    const entries = createMockExtratoList(10)
    return HttpResponse.json({
      status: true,
      data: entries,
      pagination: {
        next_cursor: faker.string.alphanumeric(20),
        prev_cursor: null,
        per_page: 10,
        has_more_pages: true,
      },
      error: null,
      message: 'Extrato carregado.',
    })
  }),

  /** GET /utilizacao/lojas */
  http.get(`${BASE}/utilizacao/lojas`, () => {
    const lojas = Array.from({ length: 3 }, () => ({
      empresa_id: faker.number.int({ min: 1, max: 999 }),
      nome_fantasia: faker.company.name(),
      logo_url: faker.image.url(),
      saldo: faker.number.float({ min: 5, max: 200, fractionDigits: 2 }),
    }))
    return HttpResponse.json({
      status: true,
      data: lojas,
      error: null,
      message: 'Lojas carregadas.',
    })
  }),
]

// ─── Error handlers ─────────────────────────────────────────

export const mobileCashbackErrorHandlers = {
  unauthorized: http.get(`${BASE}/saldo`, () => {
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

  forbidden: http.get(`${BASE}/saldo`, () => {
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

  notFound: http.get(`${BASE}/extrato`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Extrato não encontrado.',
        },
        message: 'Extrato não encontrado.',
      },
      { status: 404 },
    )
  }),

  validationError: http.get(`${BASE}/extrato`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Parâmetros inválidos.',
          details: {
            cursor: ['Cursor inválido.'],
          },
        },
        message: 'Parâmetros inválidos.',
      },
      { status: 422 },
    )
  }),

  serverError: http.get(`${BASE}/saldo`, () => {
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

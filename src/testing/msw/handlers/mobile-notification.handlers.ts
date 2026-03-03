/**
 * MSW handlers — Mobile Notification endpoints.
 *
 * Base: /api/mobile/v1/notifications
 */
import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker/locale/pt_BR'
import {
  createMockNotificationList,
  createMockNotificationPreferences,
} from '../fixtures'

const BASE = '*/api/mobile/v1/notifications'

// ─── Happy-path handlers ────────────────────────────────────

export const mobileNotificationHandlers = [
  /** GET /notifications */
  http.get(BASE, () => {
    const notifications = createMockNotificationList(10)
    return HttpResponse.json({
      status: true,
      data: notifications,
      pagination: {
        next_cursor: faker.string.alphanumeric(20),
        prev_cursor: null,
        per_page: 10,
        has_more_pages: true,
      },
      error: null,
      message: 'Notificações carregadas.',
    })
  }),

  /** PATCH /notifications/:id/read */
  http.patch(`${BASE}/:id/read`, () => {
    return HttpResponse.json({
      status: true,
      data: null,
      error: null,
      message: 'Notificação marcada como lida.',
    })
  }),

  /** POST /notifications/read-all */
  http.post(`${BASE}/read-all`, () => {
    return HttpResponse.json({
      status: true,
      data: { updated: faker.number.int({ min: 1, max: 20 }) },
      error: null,
      message: 'Todas as notificações foram marcadas como lidas.',
    })
  }),

  /** GET /notifications/preferences */
  http.get(`${BASE}/preferences`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockNotificationPreferences(),
      error: null,
      message: 'Preferências carregadas.',
    })
  }),

  /** PATCH /notifications/preferences */
  http.patch(`${BASE}/preferences`, () => {
    return HttpResponse.json({
      status: true,
      data: null,
      error: null,
      message: 'Preferências atualizadas.',
    })
  }),
]

// ─── Error handlers ─────────────────────────────────────────

export const mobileNotificationErrorHandlers = {
  unauthorized: http.get(BASE, () => {
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

  forbidden: http.patch(`${BASE}/:id/read`, () => {
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

  notFound: http.patch(`${BASE}/:id/read`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Notificação não encontrada.',
        },
        message: 'Notificação não encontrada.',
      },
      { status: 404 },
    )
  }),

  validationError: http.patch(`${BASE}/preferences`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos.',
          details: {
            push_enabled: ['O campo push_enabled deve ser booleano.'],
          },
        },
        message: 'Dados inválidos.',
      },
      { status: 422 },
    )
  }),

  serverError: http.get(BASE, () => {
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

/**
 * MSW handlers — Mobile QR Code endpoints.
 *
 * Consumer generates QR code via /api/mobile/v1/utilizacao/qrcode.
 * Merchant validates via /api/v1/qrcode/validate.
 */
import { http, HttpResponse } from 'msw'
import {
  createMockQRCodeToken,
  createMockValidarQRCodeResponse,
} from '../fixtures'

// ─── Happy-path handlers ────────────────────────────────────

export const mobileQRCodeHandlers = [
  /** POST /api/mobile/v1/utilizacao/qrcode — Consumer generates QR code */
  http.post('*/api/mobile/v1/utilizacao/qrcode', () => {
    return HttpResponse.json({
      status: true,
      data: createMockQRCodeToken(),
      error: null,
      message: 'QR Code gerado com sucesso.',
    })
  }),

  /** POST /api/v1/qrcode/validate — Merchant validates QR code */
  http.post('*/api/v1/qrcode/validate', () => {
    return HttpResponse.json({
      status: true,
      data: createMockValidarQRCodeResponse(),
      error: null,
      message: 'QR Code válido.',
    })
  }),
]

// ─── Error handlers ─────────────────────────────────────────

export const mobileQRCodeErrorHandlers = {
  unauthorized: http.post('*/api/mobile/v1/utilizacao/qrcode', () => {
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

  forbidden: http.post('*/api/mobile/v1/utilizacao/qrcode', () => {
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

  notFound: http.post('*/api/v1/qrcode/validate', () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'QR Code não encontrado ou expirado.',
        },
        message: 'QR Code não encontrado ou expirado.',
      },
      { status: 404 },
    )
  }),

  validationError: http.post('*/api/mobile/v1/utilizacao/qrcode', () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos.',
          details: {
            empresa_id: ['A empresa informada não existe.'],
            valor: ['O valor deve ser positivo.'],
          },
        },
        message: 'Dados inválidos.',
      },
      { status: 422 },
    )
  }),

  serverError: http.post('*/api/v1/qrcode/validate', () => {
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

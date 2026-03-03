/**
 * MSW handlers — Mobile Auth endpoints.
 *
 * Base: /api/mobile/v1/auth
 */
import { http, HttpResponse } from 'msw'
import {
  createMockLoginResponseData,
  createMockClienteResource,
  createMockTokenPair,
  createMockBiometricEnrollResponse,
} from '../fixtures'

const BASE = '*/api/mobile/v1/auth'

// ─── Happy-path handlers ────────────────────────────────────

export const mobileAuthHandlers = [
  /** POST /auth/register */
  http.post(`${BASE}/register`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockLoginResponseData(),
      error: null,
      message: 'Conta criada com sucesso.',
    })
  }),

  /** POST /auth/login */
  http.post(`${BASE}/login`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockLoginResponseData(),
      error: null,
      message: 'Login efetuado com sucesso.',
    })
  }),

  /** POST /auth/logout */
  http.post(`${BASE}/logout`, () => {
    return HttpResponse.json({
      status: true,
      data: null,
      error: null,
      message: 'Logout efetuado com sucesso.',
    })
  }),

  /** POST /auth/refresh */
  http.post(`${BASE}/refresh`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockTokenPair(),
      error: null,
      message: 'Token atualizado.',
    })
  }),

  /** GET /auth/me */
  http.get(`${BASE}/me`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockClienteResource(),
      error: null,
      message: 'Perfil carregado.',
    })
  }),

  /** POST /auth/oauth */
  http.post(`${BASE}/oauth`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockLoginResponseData(),
      error: null,
      message: 'Login social efetuado com sucesso.',
    })
  }),

  /** POST /auth/forgot-password */
  http.post(`${BASE}/forgot-password`, () => {
    return HttpResponse.json({
      status: true,
      data: null,
      error: null,
      message: 'E-mail de recuperação enviado.',
    })
  }),

  /** POST /auth/reset-password */
  http.post(`${BASE}/reset-password`, () => {
    return HttpResponse.json({
      status: true,
      data: null,
      error: null,
      message: 'Senha redefinida com sucesso.',
    })
  }),

  /** PATCH /auth/profile */
  http.patch(`${BASE}/profile`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockClienteResource(),
      error: null,
      message: 'Perfil atualizado.',
    })
  }),

  /** PATCH /auth/password */
  http.patch(`${BASE}/password`, () => {
    return HttpResponse.json({
      status: true,
      data: null,
      error: null,
      message: 'Senha alterada com sucesso.',
    })
  }),

  /** DELETE /auth/delete-account */
  http.delete(`${BASE}/delete-account`, () => {
    return HttpResponse.json({
      status: true,
      data: null,
      error: null,
      message: 'Conta excluída com sucesso.',
    })
  }),

  /** POST /auth/biometric/enroll */
  http.post(`${BASE}/biometric/enroll`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockBiometricEnrollResponse(),
      error: null,
      message: 'Biometria cadastrada.',
    })
  }),

  /** POST /auth/biometric/verify */
  http.post(`${BASE}/biometric/verify`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockTokenPair(),
      error: null,
      message: 'Biometria verificada.',
    })
  }),
]

// ─── Error handlers ─────────────────────────────────────────

export const mobileAuthErrorHandlers = {
  unauthorized: http.post(`${BASE}/login`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Credenciais inválidas.',
        },
        message: 'Credenciais inválidas.',
      },
      { status: 401 },
    )
  }),

  forbidden: http.get(`${BASE}/me`, () => {
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

  notFound: http.get(`${BASE}/me`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Recurso não encontrado.',
        },
        message: 'Recurso não encontrado.',
      },
      { status: 404 },
    )
  }),

  validationError: http.post(`${BASE}/register`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos.',
          details: {
            email: ['O campo email já está em uso.'],
            cpf: ['O campo cpf já está em uso.'],
          },
        },
        message: 'Dados inválidos.',
      },
      { status: 422 },
    )
  }),

  serverError: http.post(`${BASE}/login`, () => {
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

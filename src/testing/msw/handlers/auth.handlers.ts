/**
 * MSW Handlers — Auth domain (Mobile)
 *
 * Happy-path + sad-path handlers for all auth endpoints.
 * Base URL: /api/mobile/v1/auth/*
 */
import { http, HttpResponse } from "msw";
import {
  createMockClienteResource,
  createMockLoginResponseData,
  createMockOAuthResponseData,
} from "../fixtures";

const BASE = "*/api/mobile/v1/auth";

// ─── Helpers ────────────────────────────────────────────────

function successEnvelope(data: unknown, message = "Sucesso") {
  return { status: true, data, error: null, message };
}

function errorEnvelope(code: string, message: string, details?: Record<string, string[]>) {
  return {
    status: false,
    data: null,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    message,
  };
}

// ─── Happy-path handlers ────────────────────────────────────

export const authHandlers = [
  // POST /auth/register
  http.post(`${BASE}/register`, () => {
    return HttpResponse.json(
      successEnvelope(createMockLoginResponseData(), "Registro realizado com sucesso"),
      { status: 201 },
    );
  }),

  // POST /auth/login
  http.post(`${BASE}/login`, () => {
    return HttpResponse.json(
      successEnvelope(createMockLoginResponseData(), "Login realizado com sucesso"),
    );
  }),

  // POST /auth/logout
  http.post(`${BASE}/logout`, () => {
    return HttpResponse.json(
      successEnvelope(null, "Logout realizado com sucesso"),
    );
  }),

  // POST /auth/refresh
  http.post(`${BASE}/refresh`, () => {
    return HttpResponse.json(
      successEnvelope(createMockLoginResponseData(), "Token renovado com sucesso"),
    );
  }),

  // GET /auth/me
  http.get(`${BASE}/me`, () => {
    return HttpResponse.json(
      successEnvelope(createMockClienteResource(), "Perfil carregado"),
    );
  }),

  // POST /auth/oauth
  http.post(`${BASE}/oauth`, () => {
    return HttpResponse.json(
      successEnvelope(createMockOAuthResponseData(), "Login OAuth realizado com sucesso"),
    );
  }),

  // POST /auth/forgot-password
  http.post(`${BASE}/forgot-password`, () => {
    return HttpResponse.json(
      successEnvelope(null, "E-mail de recuperacao enviado com sucesso"),
    );
  }),

  // POST /auth/reset-password
  http.post(`${BASE}/reset-password`, () => {
    return HttpResponse.json(
      successEnvelope(null, "Senha redefinida com sucesso"),
    );
  }),

  // PATCH /auth/profile
  http.patch(`${BASE}/profile`, () => {
    return HttpResponse.json(
      successEnvelope(createMockClienteResource(), "Perfil atualizado com sucesso"),
    );
  }),

  // PATCH /auth/password
  http.patch(`${BASE}/password`, () => {
    return HttpResponse.json(
      successEnvelope(null, "Senha alterada com sucesso"),
    );
  }),

  // POST /auth/verify-reset-token
  http.post(`${BASE}/verify-reset-token`, () => {
    return HttpResponse.json(
      successEnvelope({ valid: true }, "Token valido"),
    );
  }),

  // DELETE /auth/delete-account
  http.delete(`${BASE}/delete-account`, () => {
    return HttpResponse.json(
      successEnvelope(null, "Conta excluida com sucesso"),
    );
  }),

  // POST /auth/biometric/enroll
  http.post(`${BASE}/biometric/enroll`, () => {
    return HttpResponse.json(
      successEnvelope(null, "Biometria cadastrada com sucesso"),
    );
  }),

  // POST /auth/biometric/verify
  http.post(`${BASE}/biometric/verify`, () => {
    return HttpResponse.json(
      successEnvelope(createMockLoginResponseData(), "Biometria verificada com sucesso"),
    );
  }),

  // POST /auth/biometric/unenroll
  http.post(`${BASE}/biometric/unenroll`, () => {
    return HttpResponse.json(
      successEnvelope(null, "Biometria removida com sucesso"),
    );
  }),

  // GET /auth/sessions
  http.get(`${BASE}/sessions`, () => {
    return HttpResponse.json(
      successEnvelope(
        [
          {
            id: 1,
            device_name: "iPhone 15",
            ip_address: "192.168.1.1",
            last_active_at: new Date().toISOString(),
            is_current: true,
          },
          {
            id: 2,
            device_name: "Android Galaxy S24",
            ip_address: "192.168.1.2",
            last_active_at: new Date().toISOString(),
            is_current: false,
          },
        ],
        "Sessoes carregadas",
      ),
    );
  }),

  // DELETE /auth/sessions/:id
  http.delete(`${BASE}/sessions/:id`, () => {
    return HttpResponse.json(
      successEnvelope(null, "Sessao encerrada com sucesso"),
    );
  }),
];

// ─── Sad-path handlers ──────────────────────────────────────

export const authErrorHandlers = {
  /** 422 — Validation error (e.g. invalid email, short password). */
  loginValidationError: http.post(`${BASE}/login`, () => {
    return HttpResponse.json(
      {
        message: "Os dados fornecidos sao invalidos.",
        errors: {
          email: ["O campo email deve ser um endereco de e-mail valido."],
          senha: ["O campo senha deve ter pelo menos 6 caracteres."],
        },
      },
      { status: 422 },
    );
  }),

  /** 401 — Invalid credentials. */
  loginUnauthorized: http.post(`${BASE}/login`, () => {
    return HttpResponse.json(
      errorEnvelope("INVALID_CREDENTIALS", "Credenciais invalidas"),
      { status: 401 },
    );
  }),

  /** 401 — Expired / invalid token on protected routes. */
  meUnauthorized: http.get(`${BASE}/me`, () => {
    return HttpResponse.json(
      errorEnvelope("UNAUTHENTICATED", "Token invalido ou expirado"),
      { status: 401 },
    );
  }),

  /** 422 — Register validation error. */
  registerValidationError: http.post(`${BASE}/register`, () => {
    return HttpResponse.json(
      {
        message: "Os dados fornecidos sao invalidos.",
        errors: {
          email: ["O email ja esta em uso."],
          cpf: ["O CPF ja esta cadastrado."],
        },
      },
      { status: 422 },
    );
  }),

  /** 404 — Forgot password with unknown email. */
  forgotPasswordNotFound: http.post(`${BASE}/forgot-password`, () => {
    return HttpResponse.json(
      errorEnvelope("NOT_FOUND", "E-mail nao encontrado"),
      { status: 404 },
    );
  }),

  /** 422 — Reset password with invalid token. */
  resetPasswordInvalidToken: http.post(`${BASE}/reset-password`, () => {
    return HttpResponse.json(
      {
        message: "Token invalido ou expirado.",
        errors: {
          token: ["O token de redefinicao e invalido ou expirou."],
        },
      },
      { status: 422 },
    );
  }),

  /** 422 — Change password mismatch. */
  changePasswordValidationError: http.patch(`${BASE}/password`, () => {
    return HttpResponse.json(
      {
        message: "Os dados fornecidos sao invalidos.",
        errors: {
          senha_atual: ["A senha atual esta incorreta."],
        },
      },
      { status: 422 },
    );
  }),

  /** 401 — Delete account wrong password. */
  deleteAccountUnauthorized: http.delete(`${BASE}/delete-account`, () => {
    return HttpResponse.json(
      errorEnvelope("INVALID_CREDENTIALS", "Senha incorreta"),
      { status: 401 },
    );
  }),

  /** 500 — Internal server error (generic). */
  serverError: http.post(`${BASE}/login`, () => {
    return HttpResponse.json(
      errorEnvelope("SERVER_ERROR", "Erro interno do servidor"),
      { status: 500 },
    );
  }),

  /** 404 — Session not found. */
  sessionNotFound: http.delete(`${BASE}/sessions/:id`, () => {
    return HttpResponse.json(
      errorEnvelope("NOT_FOUND", "Sessao nao encontrada"),
      { status: 404 },
    );
  }),
};

/**
 * MSW Handlers — Contestacao domain (Mobile)
 *
 * Happy-path + sad-path handlers.
 * Base URL: /api/mobile/v1/contestacoes
 */
import { http, HttpResponse } from "msw";
import {
  createMockContestacao,
  createMockContestacaoList,
} from "../fixtures";

const BASE = "*/api/mobile/v1/contestacoes";

// ─── Helpers ────────────────────────────────────────────────

function successEnvelope(data: unknown, message = "Sucesso") {
  return { status: true, data, error: null, message };
}

function cursorPaginatedEnvelope(data: unknown[], message = "Sucesso") {
  return {
    status: true,
    data,
    pagination: {
      next_cursor: data.length > 0 ? "cursor_xyz789" : null,
      prev_cursor: null,
      per_page: 15,
      has_more_pages: data.length >= 15,
    },
    error: null,
    message,
  };
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

export const contestacaoHandlers = [
  // GET /contestacoes
  http.get(BASE, () => {
    return HttpResponse.json(
      cursorPaginatedEnvelope(createMockContestacaoList(5), "Contestacoes carregadas"),
    );
  }),

  // POST /contestacoes
  http.post(BASE, () => {
    return HttpResponse.json(
      successEnvelope(
        createMockContestacao({ status: "pendente" }),
        "Contestacao criada com sucesso",
      ),
      { status: 201 },
    );
  }),
];

// ─── Sad-path handlers ──────────────────────────────────────

export const contestacaoErrorHandlers = {
  /** 422 — Validation error on create. */
  createValidationError: http.post(BASE, () => {
    return HttpResponse.json(
      {
        message: "Os dados fornecidos sao invalidos.",
        errors: {
          transacao_id: ["O campo transacao_id e obrigatorio."],
          descricao: ["O campo descricao deve ter pelo menos 10 caracteres."],
        },
      },
      { status: 422 },
    );
  }),

  /** 401 — Unauthenticated. */
  listUnauthorized: http.get(BASE, () => {
    return HttpResponse.json(
      errorEnvelope("UNAUTHENTICATED", "Token invalido ou expirado"),
      { status: 401 },
    );
  }),

  /** 404 — Transaction not found for contestacao. */
  transactionNotFound: http.post(BASE, () => {
    return HttpResponse.json(
      errorEnvelope("NOT_FOUND", "Transacao nao encontrada"),
      { status: 404 },
    );
  }),

  /** 500 — Server error. */
  serverError: http.get(BASE, () => {
    return HttpResponse.json(
      errorEnvelope("SERVER_ERROR", "Erro interno do servidor"),
      { status: 500 },
    );
  }),

  /** Empty list. */
  emptyList: http.get(BASE, () => {
    return HttpResponse.json(
      cursorPaginatedEnvelope([], "Nenhuma contestacao encontrada"),
    );
  }),
};

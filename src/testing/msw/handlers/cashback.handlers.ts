/**
 * MSW Handlers — Cashback / Extrato domain (Mobile)
 *
 * Happy-path + sad-path handlers.
 * Base URL: /api/mobile/v1/*
 */
import { http, HttpResponse } from "msw";
import {
  createMockSaldoData,
  createMockExtratoList,
  createMockQRCodeToken,
} from "../fixtures";

const BASE = "*/api/mobile/v1";

// ─── Helpers ────────────────────────────────────────────────

function successEnvelope(data: unknown, message = "Sucesso") {
  return { status: true, data, error: null, message };
}

function cursorPaginatedEnvelope(data: unknown[], message = "Sucesso") {
  return {
    status: true,
    data,
    pagination: {
      next_cursor: "cursor_abc123",
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

export const cashbackHandlers = [
  // GET /saldo
  http.get(`${BASE}/saldo`, () => {
    return HttpResponse.json(
      successEnvelope(createMockSaldoData(), "Saldo carregado"),
    );
  }),

  // GET /extrato — cursor-paginated
  http.get(`${BASE}/extrato`, () => {
    const entries = createMockExtratoList(15);
    return HttpResponse.json(
      cursorPaginatedEnvelope(entries, "Extrato carregado"),
    );
  }),

  // GET /utilizacao/lojas — list of stores where cashback can be used
  http.get(`${BASE}/utilizacao/lojas`, () => {
    return HttpResponse.json(
      successEnvelope(
        [
          {
            id: 1,
            nome_fantasia: "Loja Exemplo",
            logo_url: "https://example.com/logo.png",
            saldo: 45.5,
          },
          {
            id: 2,
            nome_fantasia: "Mercado Central",
            logo_url: null,
            saldo: 120.0,
          },
        ],
        "Lojas carregadas",
      ),
    );
  }),

  // POST /utilizacao/qrcode — generate QR code for utilization
  http.post(`${BASE}/utilizacao/qrcode`, () => {
    return HttpResponse.json(
      successEnvelope(createMockQRCodeToken(), "QR Code gerado com sucesso"),
      { status: 201 },
    );
  }),
];

// ─── Sad-path handlers ──────────────────────────────────────

export const cashbackErrorHandlers = {
  /** 401 — Unauthenticated access to saldo. */
  saldoUnauthorized: http.get(`${BASE}/saldo`, () => {
    return HttpResponse.json(
      errorEnvelope("UNAUTHENTICATED", "Token invalido ou expirado"),
      { status: 401 },
    );
  }),

  /** 401 — Unauthenticated access to extrato. */
  extratoUnauthorized: http.get(`${BASE}/extrato`, () => {
    return HttpResponse.json(
      errorEnvelope("UNAUTHENTICATED", "Token invalido ou expirado"),
      { status: 401 },
    );
  }),

  /** 422 — QR Code generation with invalid data. */
  qrCodeValidationError: http.post(`${BASE}/utilizacao/qrcode`, () => {
    return HttpResponse.json(
      {
        message: "Os dados fornecidos sao invalidos.",
        errors: {
          empresa_id: ["O campo empresa_id e obrigatorio."],
          valor: ["O campo valor deve ser maior que 0."],
        },
      },
      { status: 422 },
    );
  }),

  /** 404 — Empresa not found for utilization. */
  utilizacaoLojasNotFound: http.get(`${BASE}/utilizacao/lojas`, () => {
    return HttpResponse.json(
      errorEnvelope("NOT_FOUND", "Nenhuma loja encontrada"),
      { status: 404 },
    );
  }),

  /** 500 — Server error on saldo. */
  saldoServerError: http.get(`${BASE}/saldo`, () => {
    return HttpResponse.json(
      errorEnvelope("SERVER_ERROR", "Erro interno do servidor"),
      { status: 500 },
    );
  }),

  /** Empty extrato — no transactions. */
  extratoEmpty: http.get(`${BASE}/extrato`, () => {
    return HttpResponse.json(
      cursorPaginatedEnvelope([], "Nenhuma transacao encontrada"),
    );
  }),
};

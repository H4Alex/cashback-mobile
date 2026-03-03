/**
 * MSW Handlers — Notificacao domain (Mobile)
 *
 * Happy-path + sad-path handlers.
 * Base URL: /api/mobile/v1/notifications
 */
import { http, HttpResponse } from "msw";
import {
  createMockNotificationList,
  createMockNotification,
  createMockNotificationPreferences,
} from "../fixtures";

const BASE = "*/api/mobile/v1/notifications";

// ─── Helpers ────────────────────────────────────────────────

function successEnvelope(data: unknown, message = "Sucesso") {
  return { status: true, data, error: null, message };
}

function cursorPaginatedEnvelope(data: unknown[], message = "Sucesso") {
  return {
    status: true,
    data,
    pagination: {
      next_cursor: data.length > 0 ? "cursor_notif_abc" : null,
      prev_cursor: null,
      per_page: 20,
      has_more_pages: data.length >= 20,
    },
    error: null,
    message,
  };
}

function errorEnvelope(code: string, message: string) {
  return {
    status: false,
    data: null,
    error: { code, message },
    message,
  };
}

// ─── Happy-path handlers ────────────────────────────────────

export const notificacaoHandlers = [
  // GET /notifications — cursor-paginated
  http.get(BASE, () => {
    return HttpResponse.json(
      cursorPaginatedEnvelope(
        createMockNotificationList(10),
        "Notificacoes carregadas",
      ),
    );
  }),

  // PATCH /notifications/:id/read
  http.patch(`${BASE}/:id/read`, ({ params }) => {
    return HttpResponse.json(
      successEnvelope(
        createMockNotification({
          id: Number(params.id),
          lida: true,
        }),
        "Notificacao marcada como lida",
      ),
    );
  }),

  // POST /notifications/read-all
  http.post(`${BASE}/read-all`, () => {
    return HttpResponse.json(
      successEnvelope(null, "Todas as notificacoes marcadas como lidas"),
    );
  }),

  // GET /notifications/preferences
  http.get(`${BASE}/preferences`, () => {
    return HttpResponse.json(
      successEnvelope(
        createMockNotificationPreferences(),
        "Preferencias carregadas",
      ),
    );
  }),

  // PATCH /notifications/preferences
  http.patch(`${BASE}/preferences`, () => {
    return HttpResponse.json(
      successEnvelope(
        createMockNotificationPreferences(),
        "Preferencias atualizadas com sucesso",
      ),
    );
  }),
];

// ─── Sad-path handlers ──────────────────────────────────────

export const notificacaoErrorHandlers = {
  /** 401 — Unauthenticated. */
  listUnauthorized: http.get(BASE, () => {
    return HttpResponse.json(
      errorEnvelope("UNAUTHENTICATED", "Token invalido ou expirado"),
      { status: 401 },
    );
  }),

  /** 404 — Notification not found for mark-as-read. */
  notificationNotFound: http.patch(`${BASE}/:id/read`, () => {
    return HttpResponse.json(
      errorEnvelope("NOT_FOUND", "Notificacao nao encontrada"),
      { status: 404 },
    );
  }),

  /** 422 — Invalid preferences data. */
  preferencesValidationError: http.patch(`${BASE}/preferences`, () => {
    return HttpResponse.json(
      {
        message: "Os dados fornecidos sao invalidos.",
        errors: {
          push_enabled: ["O campo push_enabled deve ser verdadeiro ou falso."],
        },
      },
      { status: 422 },
    );
  }),

  /** 500 — Server error. */
  serverError: http.get(BASE, () => {
    return HttpResponse.json(
      errorEnvelope("SERVER_ERROR", "Erro interno do servidor"),
      { status: 500 },
    );
  }),

  /** Empty notification list. */
  emptyList: http.get(BASE, () => {
    return HttpResponse.json(
      cursorPaginatedEnvelope([], "Nenhuma notificacao encontrada"),
    );
  }),
};

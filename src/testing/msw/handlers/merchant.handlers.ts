/**
 * MSW Handlers — Merchant domain
 *
 * Happy-path + sad-path handlers for merchant/lojista endpoints.
 * Base URL: /api/v1/*
 */
import { http, HttpResponse } from "msw";
import {
  createMockEmpresaMerchant,
  createMockCampanhaMerchant,
  createMockCampanhaMerchantList,
  createMockClienteSearchResult,
  createMockClienteSaldo,
  createMockGerarCashbackResponse,
  createMockUtilizarCashbackResponse,
  createMockSwitchEmpresaResponse,
  createMockMerchantDashboardStats,
  createMockValidarQRCodeResponse,
  createMockContestacao,
  createMockContestacaoList,
  createMockExtratoList,
} from "../fixtures";

const BASE = "*/api/v1";

// ─── Helpers ────────────────────────────────────────────────

function successEnvelope(data: unknown, message = "Sucesso") {
  return { status: true, data, error: null, message };
}

function paginatedEnvelope(
  data: unknown[],
  message = "Sucesso",
  page = 1,
  total = 25,
) {
  const perPage = 15;
  const lastPage = Math.ceil(total / perPage);
  return {
    status: true,
    data,
    pagination: {
      current_page: page,
      last_page: lastPage,
      per_page: perPage,
      total,
      next_page_url: page < lastPage ? `/api/v1/?page=${page + 1}` : null,
      prev_page_url: page > 1 ? `/api/v1/?page=${page - 1}` : null,
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

export const merchantHandlers = [
  // ── QR Code ─────────────────────────────────────────────
  // POST /qrcode/validate
  http.post(`${BASE}/qrcode/validate`, () => {
    return HttpResponse.json(
      successEnvelope(createMockValidarQRCodeResponse(), "QR Code validado"),
    );
  }),

  // ── Cashback operations ─────────────────────────────────
  // GET /clientes — search clients (paginated)
  http.get(`${BASE}/clientes`, () => {
    const results = Array.from({ length: 5 }, () =>
      createMockClienteSearchResult(),
    );
    return HttpResponse.json(
      paginatedEnvelope(results, "Clientes carregados"),
    );
  }),

  // GET /clientes/:id — single client detail
  http.get(`${BASE}/clientes/:id`, () => {
    return HttpResponse.json(
      successEnvelope(createMockClienteSearchResult(), "Cliente carregado"),
    );
  }),

  // GET /clientes/:id/saldo
  http.get(`${BASE}/clientes/:id/saldo`, () => {
    return HttpResponse.json(
      successEnvelope(createMockClienteSaldo(), "Saldo do cliente carregado"),
    );
  }),

  // GET /campanhas — list campaigns
  http.get(`${BASE}/campanhas`, () => {
    return HttpResponse.json(
      paginatedEnvelope(
        createMockCampanhaMerchantList(5),
        "Campanhas carregadas",
        1,
        5,
      ),
    );
  }),

  // POST /campanhas — create campaign
  http.post(`${BASE}/campanhas`, () => {
    return HttpResponse.json(
      successEnvelope(
        createMockCampanhaMerchant({ status: "ativa" }),
        "Campanha criada com sucesso",
      ),
      { status: 201 },
    );
  }),

  // PATCH /campanhas/:id — update campaign
  http.patch(`${BASE}/campanhas/:id`, () => {
    return HttpResponse.json(
      successEnvelope(
        createMockCampanhaMerchant(),
        "Campanha atualizada com sucesso",
      ),
    );
  }),

  // DELETE /campanhas/:id — delete campaign
  http.delete(`${BASE}/campanhas/:id`, () => {
    return HttpResponse.json(
      successEnvelope(null, "Campanha excluida com sucesso"),
    );
  }),

  // POST /cashback — generate cashback
  http.post(`${BASE}/cashback`, () => {
    return HttpResponse.json(
      successEnvelope(
        createMockGerarCashbackResponse(),
        "Cashback gerado com sucesso",
      ),
      { status: 201 },
    );
  }),

  // POST /cashback/utilizar — use cashback
  http.post(`${BASE}/cashback/utilizar`, () => {
    return HttpResponse.json(
      successEnvelope(
        createMockUtilizarCashbackResponse(),
        "Cashback utilizado com sucesso",
      ),
    );
  }),

  // GET /cashback — list cashback transactions (paginated)
  http.get(`${BASE}/cashback`, () => {
    return HttpResponse.json(
      paginatedEnvelope(createMockExtratoList(10), "Transacoes carregadas", 1, 10),
    );
  }),

  // ── Empresa ─────────────────────────────────────────────
  // GET /empresas
  http.get(`${BASE}/empresas`, () => {
    return HttpResponse.json(
      successEnvelope(
        [createMockEmpresaMerchant(), createMockEmpresaMerchant()],
        "Empresas carregadas",
      ),
    );
  }),

  // POST /auth/switch-empresa
  http.post(`${BASE}/auth/switch-empresa`, () => {
    return HttpResponse.json(
      successEnvelope(
        createMockSwitchEmpresaResponse(),
        "Empresa alterada com sucesso",
      ),
    );
  }),

  // ── Dashboard ───────────────────────────────────────────
  // GET /dashboard/stats
  http.get(`${BASE}/dashboard/stats`, () => {
    return HttpResponse.json(
      successEnvelope(
        createMockMerchantDashboardStats(),
        "Estatisticas carregadas",
      ),
    );
  }),

  // GET /dashboard/transacoes
  http.get(`${BASE}/dashboard/transacoes`, () => {
    return HttpResponse.json(
      paginatedEnvelope(createMockExtratoList(10), "Transacoes carregadas", 1, 50),
    );
  }),

  // GET /dashboard/top-clientes
  http.get(`${BASE}/dashboard/top-clientes`, () => {
    const topClientes = Array.from({ length: 5 }, () => ({
      ...createMockClienteSearchResult(),
      total_cashback: Math.round(Math.random() * 5000 * 100) / 100,
    }));
    return HttpResponse.json(
      successEnvelope(topClientes, "Top clientes carregados"),
    );
  }),

  // GET /dashboard/chart
  http.get(`${BASE}/dashboard/chart`, () => {
    return HttpResponse.json(
      successEnvelope(
        {
          labels: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
          ],
          datasets: [
            {
              label: "Cashback Gerado",
              data: [1200, 1500, 980, 2100, 1800, 2300],
            },
            {
              label: "Cashback Utilizado",
              data: [800, 1100, 700, 1400, 1200, 1600],
            },
          ],
        },
        "Dados do grafico carregados",
      ),
    );
  }),

  // ── Contestacoes (merchant side) ────────────────────────
  // GET /contestacoes
  http.get(`${BASE}/contestacoes`, () => {
    return HttpResponse.json(
      paginatedEnvelope(
        createMockContestacaoList(5),
        "Contestacoes carregadas",
        1,
        5,
      ),
    );
  }),

  // PATCH /contestacoes/:id — respond to contestacao
  http.patch(`${BASE}/contestacoes/:id`, () => {
    return HttpResponse.json(
      successEnvelope(
        createMockContestacao({ status: "aprovada", resposta: "Contestacao aprovada pelo lojista." }),
        "Contestacao atualizada com sucesso",
      ),
    );
  }),

  // ── Config ──────────────────────────────────────────────
  // GET /config
  http.get(`${BASE}/config`, () => {
    return HttpResponse.json(
      successEnvelope(
        {
          empresa_id: 1,
          max_utilizacao_percentual: 100,
          cashback_ativo: true,
          notificacoes_ativas: true,
        },
        "Configuracoes carregadas",
      ),
    );
  }),

  // PATCH /config
  http.patch(`${BASE}/config`, () => {
    return HttpResponse.json(
      successEnvelope(
        {
          empresa_id: 1,
          max_utilizacao_percentual: 100,
          cashback_ativo: true,
          notificacoes_ativas: true,
        },
        "Configuracoes atualizadas com sucesso",
      ),
    );
  }),

  // POST /config/logo
  http.post(`${BASE}/config/logo`, () => {
    return HttpResponse.json(
      successEnvelope(
        { logo_url: "https://example.com/new-logo.png" },
        "Logo atualizado com sucesso",
      ),
    );
  }),

  // ── Relatorios ──────────────────────────────────────────
  // GET /relatorios
  http.get(`${BASE}/relatorios`, () => {
    return HttpResponse.json(
      successEnvelope(
        {
          url: "https://example.com/relatorio.pdf",
          gerado_em: new Date().toISOString(),
        },
        "Relatorio gerado com sucesso",
      ),
    );
  }),
];

// ─── Sad-path handlers ──────────────────────────────────────

export const merchantErrorHandlers = {
  /** 401 — Unauthenticated access. */
  unauthorized: http.get(`${BASE}/empresas`, () => {
    return HttpResponse.json(
      errorEnvelope("UNAUTHENTICATED", "Token invalido ou expirado"),
      { status: 401 },
    );
  }),

  /** 422 — Validation error on cashback generation. */
  gerarCashbackValidationError: http.post(`${BASE}/cashback`, () => {
    return HttpResponse.json(
      {
        message: "Os dados fornecidos sao invalidos.",
        errors: {
          cpf: ["O campo CPF deve ter 11 digitos."],
          valor_compra: ["O campo valor_compra deve ser maior que 0."],
        },
      },
      { status: 422 },
    );
  }),

  /** 404 — Client not found. */
  clienteNotFound: http.get(`${BASE}/clientes/:id`, () => {
    return HttpResponse.json(
      errorEnvelope("NOT_FOUND", "Cliente nao encontrado"),
      { status: 404 },
    );
  }),

  /** 404 — Client saldo not found. */
  clienteSaldoNotFound: http.get(`${BASE}/clientes/:id/saldo`, () => {
    return HttpResponse.json(
      errorEnvelope("NOT_FOUND", "Cliente nao encontrado"),
      { status: 404 },
    );
  }),

  /** 422 — Utilizar cashback insufficient balance. */
  utilizarCashbackInsufficientBalance: http.post(
    `${BASE}/cashback/utilizar`,
    () => {
      return HttpResponse.json(
        {
          message: "Saldo insuficiente.",
          errors: {
            valor: ["O saldo do cliente e insuficiente para esta operacao."],
          },
        },
        { status: 422 },
      );
    },
  ),

  /** 422 — QR code invalid or expired. */
  qrCodeInvalid: http.post(`${BASE}/qrcode/validate`, () => {
    return HttpResponse.json(
      {
        message: "QR Code invalido.",
        errors: {
          qr_token: ["O QR Code e invalido ou expirou."],
        },
      },
      { status: 422 },
    );
  }),

  /** 422 — Campaign validation error. */
  criarCampanhaValidationError: http.post(`${BASE}/campanhas`, () => {
    return HttpResponse.json(
      {
        message: "Os dados fornecidos sao invalidos.",
        errors: {
          nome: ["O campo nome e obrigatorio."],
          percentual: [
            "O campo percentual deve ser entre 0.01 e 100.",
          ],
        },
      },
      { status: 422 },
    );
  }),

  /** 404 — Campaign not found. */
  campanhaNotFound: http.patch(`${BASE}/campanhas/:id`, () => {
    return HttpResponse.json(
      errorEnvelope("NOT_FOUND", "Campanha nao encontrada"),
      { status: 404 },
    );
  }),

  /** 404 — Contestacao not found. */
  contestacaoNotFound: http.patch(`${BASE}/contestacoes/:id`, () => {
    return HttpResponse.json(
      errorEnvelope("NOT_FOUND", "Contestacao nao encontrada"),
      { status: 404 },
    );
  }),

  /** 500 — Server error on dashboard. */
  dashboardServerError: http.get(`${BASE}/dashboard/stats`, () => {
    return HttpResponse.json(
      errorEnvelope("SERVER_ERROR", "Erro interno do servidor"),
      { status: 500 },
    );
  }),

  /** 422 — Config update validation error. */
  configValidationError: http.patch(`${BASE}/config`, () => {
    return HttpResponse.json(
      {
        message: "Os dados fornecidos sao invalidos.",
        errors: {
          max_utilizacao_percentual: [
            "O campo deve ser entre 0 e 100.",
          ],
        },
      },
      { status: 422 },
    );
  }),

  /** 500 — Logo upload server error. */
  logoUploadServerError: http.post(`${BASE}/config/logo`, () => {
    return HttpResponse.json(
      errorEnvelope("SERVER_ERROR", "Erro ao processar upload do logo"),
      { status: 500 },
    );
  }),
};

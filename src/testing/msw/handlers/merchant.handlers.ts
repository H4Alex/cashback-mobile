/**
 * MSW handlers — Merchant (lojista) endpoints.
 *
 * Base: /api/v1
 */
import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker/locale/pt_BR'
import {
  createMockClienteSearchResult,
  createMockClienteSaldo,
  createMockCampanhaMerchant,
  createMockGerarCashbackResponse,
  createMockUtilizarCashbackResponse,
  createMockEmpresaMerchant,
  createMockSwitchEmpresaResponse,
  createMockMerchantDashboardStats,
  createMockContestacao,
} from '../fixtures'

const BASE = '*/api/v1'

// ─── Happy-path handlers ────────────────────────────────────

export const merchantHandlers = [
  // ─── Cashback Service ──────────────────────────────────

  /** GET /clientes — search by CPF */
  http.get(`${BASE}/clientes`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    const page = url.searchParams.get('page')

    // Paginated management endpoint (has page param, no search param)
    if (page && !search) {
      const clientes = [...Array(10)].map(() => ({
        id: faker.number.int({ min: 1, max: 99_999 }),
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        cpf: faker.string.numeric(11),
        telefone: faker.phone.number(),
        total_cashback: faker.number.float({ min: 0, max: 1000, fractionDigits: 2 }),
        created_at: faker.date.past().toISOString(),
      }))
      return HttpResponse.json({
        status: true,
        data: {
          data: clientes,
          total: 50,
          total_pages: 5,
        },
        error: null,
        message: 'Clientes carregados.',
      })
    }

    // Search endpoint
    const results = [...Array(2)].map(() => createMockClienteSearchResult())
    return HttpResponse.json({
      status: true,
      data: results,
      error: null,
      message: 'Clientes encontrados.',
    })
  }),

  /** GET /clientes/:id — single client detail */
  http.get(`${BASE}/clientes/:id`, ({ params }) => {
    const url = params.id as string

    // Check if it's /clientes/:id/saldo
    // This handler won't match /saldo because of the more specific route below
    return HttpResponse.json({
      status: true,
      data: {
        id: Number(url),
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        cpf: faker.string.numeric(11),
        telefone: faker.phone.number(),
        total_cashback: faker.number.float({ min: 0, max: 1000, fractionDigits: 2 }),
        created_at: faker.date.past().toISOString(),
      },
      error: null,
      message: 'Cliente carregado.',
    })
  }),

  /** GET /clientes/:id/saldo */
  http.get(`${BASE}/clientes/:id/saldo`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockClienteSaldo(),
      error: null,
      message: 'Saldo do cliente carregado.',
    })
  }),

  /** GET /campanhas */
  http.get(`${BASE}/campanhas`, () => {
    const campanhas = [...Array(5)].map(() => createMockCampanhaMerchant())
    return HttpResponse.json({
      status: true,
      data: campanhas,
      error: null,
      message: 'Campanhas carregadas.',
    })
  }),

  /** POST /campanhas */
  http.post(`${BASE}/campanhas`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockCampanhaMerchant({ status: 'ativa' }),
      error: null,
      message: 'Campanha criada com sucesso.',
    })
  }),

  /** PATCH /campanhas/:id */
  http.patch(`${BASE}/campanhas/:id`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockCampanhaMerchant(),
      error: null,
      message: 'Campanha atualizada com sucesso.',
    })
  }),

  /** DELETE /campanhas/:id */
  http.delete(`${BASE}/campanhas/:id`, () => {
    return HttpResponse.json({
      status: true,
      data: null,
      error: null,
      message: 'Campanha excluída com sucesso.',
    })
  }),

  /** POST /cashback — Gerar cashback */
  http.post(`${BASE}/cashback`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockGerarCashbackResponse(),
      error: null,
      message: 'Cashback gerado com sucesso.',
    })
  }),

  /** POST /cashback/utilizar — Utilizar cashback */
  http.post(`${BASE}/cashback/utilizar`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockUtilizarCashbackResponse(),
      error: null,
      message: 'Cashback utilizado com sucesso.',
    })
  }),

  /** GET /cashback — List vendas/cashback transactions */
  http.get(`${BASE}/cashback`, () => {
    const vendas = [...Array(10)].map(() => ({
      id: faker.number.int({ min: 1, max: 99_999 }),
      cliente_nome: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      valor_compra: faker.number.float({ min: 20, max: 1000, fractionDigits: 2 }),
      valor_cashback: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
      status: faker.helpers.arrayElement(['pendente', 'confirmado', 'utilizado', 'expirado']),
      created_at: faker.date.past().toISOString(),
    }))
    return HttpResponse.json({
      status: true,
      data: {
        data: vendas,
        total: 100,
        total_pages: 10,
      },
      error: null,
      message: 'Vendas carregadas.',
    })
  }),

  // ─── Empresa Service ───────────────────────────────────

  /** GET /empresas */
  http.get(`${BASE}/empresas`, () => {
    const empresas = [...Array(3)].map(() => createMockEmpresaMerchant())
    return HttpResponse.json({
      status: true,
      data: empresas,
      error: null,
      message: 'Empresas carregadas.',
    })
  }),

  /** POST /auth/switch-empresa */
  http.post(`${BASE}/auth/switch-empresa`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockSwitchEmpresaResponse(),
      error: null,
      message: 'Empresa alterada com sucesso.',
    })
  }),

  // ─── Dashboard ─────────────────────────────────────────

  /** GET /dashboard/stats */
  http.get(`${BASE}/dashboard/stats`, () => {
    return HttpResponse.json({
      status: true,
      data: createMockMerchantDashboardStats(),
      error: null,
      message: 'Estatísticas carregadas.',
    })
  }),

  /** GET /dashboard/transacoes */
  http.get(`${BASE}/dashboard/transacoes`, () => {
    const transacoes = [...Array(10)].map(() => ({
      id: faker.number.int({ min: 1, max: 99_999 }),
      cliente_nome: faker.person.fullName(),
      tipo: faker.helpers.arrayElement(['compra', 'utilizacao']),
      valor: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
      created_at: faker.date.recent().toISOString(),
    }))
    return HttpResponse.json({
      status: true,
      data: transacoes,
      error: null,
      message: 'Transações recentes carregadas.',
    })
  }),

  /** GET /dashboard/top-clientes */
  http.get(`${BASE}/dashboard/top-clientes`, () => {
    const topClientes = [...Array(5)].map(() => ({
      id: faker.number.int({ min: 1, max: 99_999 }),
      nome: faker.person.fullName(),
      total_compras: faker.number.int({ min: 5, max: 100 }),
      total_cashback: faker.number.float({ min: 50, max: 5000, fractionDigits: 2 }),
    }))
    return HttpResponse.json({
      status: true,
      data: topClientes,
      error: null,
      message: 'Top clientes carregados.',
    })
  }),

  /** GET /dashboard/chart */
  http.get(`${BASE}/dashboard/chart`, () => {
    const chartData = [...Array(12)].map((_, i: number) => ({
      label: faker.date.month(),
      valor: faker.number.float({ min: 100, max: 10_000, fractionDigits: 2 }),
      quantidade: faker.number.int({ min: 5, max: 200 }),
    }))
    return HttpResponse.json({
      status: true,
      data: chartData,
      error: null,
      message: 'Dados do gráfico carregados.',
    })
  }),

  // ─── Contestacoes (merchant side) ──────────────────────

  /** GET /contestacoes */
  http.get(`${BASE}/contestacoes`, () => {
    const contestacoes = [...Array(5)].map(() =>
      createMockContestacao()
    )
    return HttpResponse.json({
      status: true,
      data: contestacoes,
      error: null,
      message: 'Contestações carregadas.',
    })
  }),

  /** PATCH /contestacoes/:id */
  http.patch(`${BASE}/contestacoes/:id`, () => {
    return HttpResponse.json({
      status: true,
      data: null,
      error: null,
      message: 'Contestação resolvida com sucesso.',
    })
  }),

  // ─── Config ────────────────────────────────────────────

  /** GET /config */
  http.get(`${BASE}/config`, () => {
    return HttpResponse.json({
      status: true,
      data: {
        nome_fantasia: faker.company.name(),
        cnpj: faker.string.numeric(14),
        logo_url: faker.image.url(),
        cor_primaria: faker.color.rgb(),
        endereco: faker.location.streetAddress(),
        telefone: faker.phone.number(),
        email: faker.internet.email(),
        max_utilizacao_percentual: faker.number.int({ min: 50, max: 100 }),
      },
      error: null,
      message: 'Configuração carregada.',
    })
  }),

  /** PATCH /config */
  http.patch(`${BASE}/config`, () => {
    return HttpResponse.json({
      status: true,
      data: {
        nome_fantasia: faker.company.name(),
        cnpj: faker.string.numeric(14),
        logo_url: faker.image.url(),
        cor_primaria: faker.color.rgb(),
        endereco: faker.location.streetAddress(),
        telefone: faker.phone.number(),
        email: faker.internet.email(),
        max_utilizacao_percentual: faker.number.int({ min: 50, max: 100 }),
      },
      error: null,
      message: 'Configuração atualizada.',
    })
  }),

  /** POST /config/logo */
  http.post(`${BASE}/config/logo`, () => {
    return HttpResponse.json({
      status: true,
      data: { logo_url: faker.image.url() },
      error: null,
      message: 'Logo atualizado com sucesso.',
    })
  }),

  // ─── Relatorios ────────────────────────────────────────

  /** GET /relatorios */
  http.get(`${BASE}/relatorios`, () => {
    return HttpResponse.json({
      status: true,
      data: {
        periodo: 'mensal',
        total_vendas: faker.number.int({ min: 100, max: 10_000 }),
        total_cashback_gerado: faker.number.float({ min: 500, max: 50_000, fractionDigits: 2 }),
        total_cashback_utilizado: faker.number.float({ min: 200, max: 30_000, fractionDigits: 2 }),
        total_clientes_novos: faker.number.int({ min: 5, max: 500 }),
        ticket_medio: faker.number.float({ min: 30, max: 300, fractionDigits: 2 }),
        taxa_retorno: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
      },
      error: null,
      message: 'Relatório gerado.',
    })
  }),
]

// ─── Error handlers ─────────────────────────────────────────

export const merchantErrorHandlers = {
  unauthorized: http.get(`${BASE}/dashboard/stats`, () => {
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

  forbidden: http.post(`${BASE}/cashback`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'FORBIDDEN',
          message: 'Sem permissão para gerar cashback.',
        },
        message: 'Sem permissão para gerar cashback.',
      },
      { status: 403 },
    )
  }),

  notFound: http.get(`${BASE}/clientes/:id/saldo`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Cliente não encontrado.',
        },
        message: 'Cliente não encontrado.',
      },
      { status: 404 },
    )
  }),

  validationError: http.post(`${BASE}/cashback`, () => {
    return HttpResponse.json(
      {
        status: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos.',
          details: {
            cpf: ['CPF inválido ou não cadastrado.'],
            valor_compra: ['O valor da compra deve ser positivo.'],
          },
        },
        message: 'Dados inválidos.',
      },
      { status: 422 },
    )
  }),

  serverError: http.post(`${BASE}/cashback/utilizar`, () => {
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

/**
 * Merchant fixtures — merchant-side (lojista) operations.
 *
 * Every factory calls `schema.parse()` to guarantee the mock
 * matches the contract schemas exactly.
 */
import { faker } from '@faker-js/faker/locale/pt_BR'
import {
  empresaMerchantSchema,
  campanhaMerchantSchema,
  clienteSearchResultSchema,
  clienteSaldoSchema,
  gerarCashbackResponseSchema,
  utilizarCashbackResponseSchema,
  switchEmpresaResponseSchema,
  merchantDashboardStatsSchema,
} from '@/src/contracts/schemas'
import type {
  EmpresaMerchant,
  CampanhaMerchant,
  ClienteSearchResult,
  ClienteSaldo,
  GerarCashbackResponse,
  UtilizarCashbackResponse,
  SwitchEmpresaResponse,
  MerchantDashboardStats,
} from '@/src/contracts/schemas'

// ─── Helpers ────────────────────────────────────────────────

function randomPerfilMerchant() {
  return faker.helpers.arrayElement([
    'proprietario',
    'gestor',
    'operador',
    'vendedor',
  ] as const)
}

function randomCampanhaStatus() {
  return faker.helpers.arrayElement([
    'ativa',
    'inativa',
    'finalizada',
    'encerrada',
  ] as const)
}

// ─── Factories ──────────────────────────────────────────────

export function createMockEmpresaMerchant(
  overrides: Partial<EmpresaMerchant> = {},
): EmpresaMerchant {
  return empresaMerchantSchema.parse({
    id: faker.number.int({ min: 1, max: 999 }),
    nome_fantasia: faker.company.name(),
    cnpj: faker.string.numeric(14),
    logo_url: faker.image.url(),
    perfil: randomPerfilMerchant(),
    ...overrides,
  })
}

export function createMockCampanhaMerchant(
  overrides: Partial<CampanhaMerchant> = {},
): CampanhaMerchant {
  return campanhaMerchantSchema.parse({
    id: faker.number.int({ min: 1, max: 999 }),
    nome: faker.commerce.productName(),
    percentual: faker.number.float({ min: 1, max: 20, fractionDigits: 1 }),
    status: randomCampanhaStatus(),
    validade_padrao: faker.number.int({ min: 7, max: 90 }),
    ...overrides,
  })
}

export function createMockClienteSearchResult(
  overrides: Partial<ClienteSearchResult> = {},
): ClienteSearchResult {
  return clienteSearchResultSchema.parse({
    id: faker.number.int({ min: 1, max: 99_999 }),
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: faker.string.numeric(11),
    ...overrides,
  })
}

export function createMockClienteSaldo(
  overrides: Partial<ClienteSaldo> = {},
): ClienteSaldo {
  return clienteSaldoSchema.parse({
    cliente: {
      id: faker.number.int({ min: 1, max: 99_999 }),
      nome: faker.person.fullName(),
    },
    saldo: faker.number.float({ min: 0, max: 1000, fractionDigits: 2 }),
    max_utilizacao_percentual: faker.number.int({ min: 50, max: 100 }),
    ...overrides,
  })
}

export function createMockGerarCashbackResponse(
  overrides: Partial<GerarCashbackResponse> = {},
): GerarCashbackResponse {
  return gerarCashbackResponseSchema.parse({
    id: faker.number.int({ min: 1, max: 99_999 }),
    valor_compra: faker.number.float({ min: 20, max: 1000, fractionDigits: 2 }),
    percentual: faker.number.float({ min: 1, max: 20, fractionDigits: 1 }),
    cashback_gerado: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
    validade_dias: faker.number.int({ min: 7, max: 90 }),
    cliente_nome: faker.person.fullName(),
    ...overrides,
  })
}

export function createMockUtilizarCashbackResponse(
  overrides: Partial<UtilizarCashbackResponse> = {},
): UtilizarCashbackResponse {
  return utilizarCashbackResponseSchema.parse({
    id: faker.number.int({ min: 1, max: 99_999 }),
    cashback_usado: faker.number.float({ min: 5, max: 100, fractionDigits: 2 }),
    valor_dinheiro: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
    novo_saldo: faker.number.float({ min: 0, max: 300, fractionDigits: 2 }),
    cliente_nome: faker.person.fullName(),
    ...overrides,
  })
}

export function createMockSwitchEmpresaResponse(
  overrides: Partial<SwitchEmpresaResponse> = {},
): SwitchEmpresaResponse {
  return switchEmpresaResponseSchema.parse({
    token: faker.string.alphanumeric(128),
    token_type: 'bearer' as const,
    expires_in: 3600,
    empresa: createMockEmpresaMerchant(),
    ...overrides,
  })
}

export function createMockMerchantDashboardStats(
  overrides: Partial<MerchantDashboardStats> = {},
): MerchantDashboardStats {
  return merchantDashboardStatsSchema.parse({
    total_vendas: faker.number.int({ min: 100, max: 10_000 }),
    total_cashback_gerado: faker.number.float({ min: 500, max: 50_000, fractionDigits: 2 }),
    total_cashback_utilizado: faker.number.float({ min: 200, max: 30_000, fractionDigits: 2 }),
    total_clientes: faker.number.int({ min: 10, max: 5_000 }),
    ticket_medio: faker.number.float({ min: 30, max: 300, fractionDigits: 2 }),
    ...overrides,
  })
}

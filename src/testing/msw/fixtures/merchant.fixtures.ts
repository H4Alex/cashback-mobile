/**
 * Merchant domain fixtures — schema-validated mock factories.
 */
import { faker } from "@faker-js/faker/locale/pt_BR";
import {
  empresaMerchantSchema,
  campanhaMerchantSchema,
  clienteSearchResultSchema,
  clienteSaldoSchema,
  gerarCashbackResponseSchema,
  utilizarCashbackResponseSchema,
  switchEmpresaResponseSchema,
  merchantDashboardStatsSchema,
} from "@/src/contracts/schemas";

// ─── EmpresaMerchant ────────────────────────────────────────

export function createMockEmpresaMerchant(
  overrides?: Record<string, unknown>,
) {
  return empresaMerchantSchema.parse({
    id: faker.number.int({ min: 1, max: 999 }),
    nome_fantasia: faker.company.name(),
    cnpj: faker.string.numeric(14),
    logo_url: faker.image.url(),
    perfil: faker.helpers.arrayElement([
      "proprietario",
      "gestor",
      "operador",
      "vendedor",
    ]),
    ...overrides,
  });
}

// ─── CampanhaMerchant ───────────────────────────────────────

export function createMockCampanhaMerchant(
  overrides?: Record<string, unknown>,
) {
  return campanhaMerchantSchema.parse({
    id: faker.number.int({ min: 1, max: 999 }),
    nome: faker.commerce.productName(),
    percentual: faker.number.float({ min: 1, max: 20, fractionDigits: 2 }),
    status: faker.helpers.arrayElement([
      "ativa",
      "inativa",
      "finalizada",
      "encerrada",
    ]),
    validade_padrao: faker.number.int({ min: 7, max: 90 }),
    ...overrides,
  });
}

export function createMockCampanhaMerchantList(count = 3) {
  return Array.from({ length: count }, () => createMockCampanhaMerchant());
}

// ─── ClienteSearchResult ────────────────────────────────────

export function createMockClienteSearchResult(
  overrides?: Record<string, unknown>,
) {
  return clienteSearchResultSchema.parse({
    id: faker.number.int({ min: 1, max: 9999 }),
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: faker.string.numeric(11),
    ...overrides,
  });
}

// ─── ClienteSaldo ───────────────────────────────────────────

export function createMockClienteSaldo(overrides?: Record<string, unknown>) {
  return clienteSaldoSchema.parse({
    cliente: {
      id: faker.number.int({ min: 1, max: 9999 }),
      nome: faker.person.fullName(),
    },
    saldo: faker.number.float({ min: 0, max: 500, fractionDigits: 2 }),
    max_utilizacao_percentual: 100,
    ...overrides,
  });
}

// ─── GerarCashbackResponse ──────────────────────────────────

export function createMockGerarCashbackResponse(
  overrides?: Record<string, unknown>,
) {
  return gerarCashbackResponseSchema.parse({
    id: faker.number.int({ min: 1, max: 99999 }),
    valor_compra: faker.number.float({
      min: 10,
      max: 500,
      fractionDigits: 2,
    }),
    percentual: faker.number.float({ min: 1, max: 20, fractionDigits: 2 }),
    cashback_gerado: faker.number.float({
      min: 1,
      max: 100,
      fractionDigits: 2,
    }),
    validade_dias: faker.number.int({ min: 7, max: 90 }),
    cliente_nome: faker.person.fullName(),
    ...overrides,
  });
}

// ─── UtilizarCashbackResponse ───────────────────────────────

export function createMockUtilizarCashbackResponse(
  overrides?: Record<string, unknown>,
) {
  return utilizarCashbackResponseSchema.parse({
    id: faker.number.int({ min: 1, max: 99999 }),
    cashback_usado: faker.number.float({
      min: 1,
      max: 100,
      fractionDigits: 2,
    }),
    valor_dinheiro: faker.number.float({
      min: 10,
      max: 400,
      fractionDigits: 2,
    }),
    novo_saldo: faker.number.float({ min: 0, max: 500, fractionDigits: 2 }),
    cliente_nome: faker.person.fullName(),
    ...overrides,
  });
}

// ─── SwitchEmpresaResponse ──────────────────────────────────

export function createMockSwitchEmpresaResponse(
  overrides?: Record<string, unknown>,
) {
  return switchEmpresaResponseSchema.parse({
    token: faker.string.alphanumeric(64),
    token_type: "bearer" as const,
    expires_in: 3600,
    empresa: createMockEmpresaMerchant(),
    ...overrides,
  });
}

// ─── MerchantDashboardStats ─────────────────────────────────

export function createMockMerchantDashboardStats(
  overrides?: Record<string, unknown>,
) {
  return merchantDashboardStatsSchema.parse({
    total_vendas: faker.number.int({ min: 100, max: 10000 }),
    total_cashback_gerado: faker.number.float({
      min: 100,
      max: 5000,
      fractionDigits: 2,
    }),
    total_cashback_utilizado: faker.number.float({
      min: 50,
      max: 3000,
      fractionDigits: 2,
    }),
    total_clientes: faker.number.int({ min: 10, max: 500 }),
    ticket_medio: faker.number.float({
      min: 30,
      max: 200,
      fractionDigits: 2,
    }),
    ...overrides,
  });
}

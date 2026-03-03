/**
 * Cashback / Extrato / QRCode fixtures — mobile consumer.
 *
 * Every factory calls `schema.parse()` to guarantee the mock
 * matches the contract schemas exactly.
 */
import { faker } from '@faker-js/faker/locale/pt_BR'
import {
  saldoDataSchema,
  extratoEntrySchema,
  qrCodeTokenSchema,
  validarQRCodeResponseSchema,
} from '@/src/contracts/schemas'
import type {
  SaldoData,
  ExtratoEntry,
  QRCodeToken,
  ValidarQRCodeResponse,
} from '@/src/contracts/schemas'

// ─── Helpers ────────────────────────────────────────────────

function randomCashbackStatus() {
  return faker.helpers.arrayElement([
    'pendente',
    'confirmado',
    'utilizado',
    'rejeitado',
    'expirado',
    'congelado',
  ] as const)
}

// ─── Factories ──────────────────────────────────────────────

export function createMockSaldoData(
  overrides: Partial<SaldoData> = {},
): SaldoData {
  const empresaCount = faker.number.int({ min: 1, max: 4 })
  return saldoDataSchema.parse({
    saldo_total: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
    por_empresa: Array.from({ length: empresaCount }, () => ({
      empresa_id: faker.number.int({ min: 1, max: 999 }),
      nome_fantasia: faker.company.name(),
      logo_url: faker.image.url(),
      saldo: faker.number.float({ min: 5, max: 200, fractionDigits: 2 }),
    })),
    proximo_a_expirar: {
      valor: faker.number.float({ min: 1, max: 50, fractionDigits: 2 }),
      data_expiracao: faker.date.future().toISOString(),
    },
    ...overrides,
  })
}

export function createMockExtratoEntry(
  overrides: Partial<ExtratoEntry> = {},
): ExtratoEntry {
  return extratoEntrySchema.parse({
    id: faker.number.int({ min: 1, max: 99_999 }),
    tipo: faker.helpers.arrayElement(['compra', 'utilizacao', 'estorno']),
    valor_compra: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
    valor_cashback: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
    status_cashback: randomCashbackStatus(),
    data_expiracao: faker.date.future().toISOString(),
    created_at: faker.date.past().toISOString(),
    empresa: {
      id: faker.number.int({ min: 1, max: 999 }),
      nome_fantasia: faker.company.name(),
    },
    campanha: {
      id: faker.number.int({ min: 1, max: 99 }),
      nome: faker.commerce.productName(),
    },
    ...overrides,
  })
}

export function createMockExtratoList(count = 10): ExtratoEntry[] {
  return Array.from({ length: count }, () => createMockExtratoEntry())
}

export function createMockQRCodeToken(
  overrides: Partial<QRCodeToken> = {},
): QRCodeToken {
  return qrCodeTokenSchema.parse({
    qr_token: faker.string.uuid(),
    cliente_id: faker.number.int({ min: 1, max: 99_999 }),
    empresa_id: faker.number.int({ min: 1, max: 999 }),
    valor: faker.number.float({ min: 5, max: 200, fractionDigits: 2 }),
    expira_em: faker.date.soon({ days: 1 }).toISOString(),
    ...overrides,
  })
}

export function createMockValidarQRCodeResponse(
  overrides: Partial<ValidarQRCodeResponse> = {},
): ValidarQRCodeResponse {
  return validarQRCodeResponseSchema.parse({
    valid: true,
    cliente: {
      id: faker.number.int({ min: 1, max: 99_999 }),
      nome: faker.person.fullName(),
    },
    valor: faker.number.float({ min: 5, max: 200, fractionDigits: 2 }),
    saldo_cliente: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
    expira_em: faker.date.soon({ days: 1 }).toISOString(),
    ...overrides,
  })
}

/**
 * Cashback / Extrato domain fixtures — schema-validated mock factories.
 */
import { faker } from "@faker-js/faker/locale/pt_BR";
import {
  saldoDataSchema,
  extratoEntrySchema,
  qrCodeTokenSchema,
  validarQRCodeResponseSchema,
} from "@/src/contracts/schemas";

// ─── SaldoData ──────────────────────────────────────────────

export function createMockSaldoData(overrides?: Record<string, unknown>) {
  return saldoDataSchema.parse({
    saldo_total: faker.number.float({ min: 0, max: 500, fractionDigits: 2 }),
    por_empresa: [
      {
        empresa_id: faker.number.int({ min: 1, max: 999 }),
        nome_fantasia: faker.company.name(),
        logo_url: faker.image.url(),
        saldo: faker.number.float({ min: 0, max: 200, fractionDigits: 2 }),
      },
    ],
    proximo_a_expirar: {
      valor: faker.number.float({ min: 1, max: 50, fractionDigits: 2 }),
      data_expiracao: faker.date.future().toISOString(),
    },
    ...overrides,
  });
}

// ─── ExtratoEntry ───────────────────────────────────────────

export function createMockExtratoEntry(overrides?: Record<string, unknown>) {
  return extratoEntrySchema.parse({
    id: faker.number.int({ min: 1, max: 99999 }),
    tipo: faker.helpers.arrayElement(["compra", "utilizacao", "expiracao"]),
    valor_compra: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
    valor_cashback: faker.number.float({
      min: 1,
      max: 50,
      fractionDigits: 2,
    }),
    status_cashback: faker.helpers.arrayElement([
      "pendente",
      "confirmado",
      "utilizado",
      "rejeitado",
      "expirado",
      "congelado",
    ]),
    data_expiracao: faker.date.future().toISOString(),
    created_at: faker.date.past().toISOString(),
    empresa: {
      id: faker.number.int({ min: 1, max: 999 }),
      nome_fantasia: faker.company.name(),
    },
    campanha: {
      id: faker.number.int({ min: 1, max: 999 }),
      nome: faker.commerce.productName(),
    },
    ...overrides,
  });
}

export function createMockExtratoList(count = 5) {
  return Array.from({ length: count }, () => createMockExtratoEntry());
}

// ─── QRCodeToken ────────────────────────────────────────────

export function createMockQRCodeToken(overrides?: Record<string, unknown>) {
  return qrCodeTokenSchema.parse({
    qr_token: faker.string.uuid(),
    cliente_id: faker.number.int({ min: 1, max: 9999 }),
    empresa_id: faker.number.int({ min: 1, max: 999 }),
    valor: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
    expira_em: faker.date.future().toISOString(),
    ...overrides,
  });
}

// ─── ValidarQRCodeResponse ──────────────────────────────────

export function createMockValidarQRCodeResponse(
  overrides?: Record<string, unknown>,
) {
  return validarQRCodeResponseSchema.parse({
    valid: true,
    cliente: {
      id: faker.number.int({ min: 1, max: 9999 }),
      nome: faker.person.fullName(),
    },
    valor: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
    saldo_cliente: faker.number.float({
      min: 0,
      max: 1000,
      fractionDigits: 2,
    }),
    expira_em: faker.date.future().toISOString(),
    ...overrides,
  });
}

/**
 * Auth domain fixtures — schema-validated mock factories.
 *
 * Every factory calls `schema.parse()` so data is guaranteed
 * to match the Zod contract at compile-time AND run-time.
 */
import { faker } from "@faker-js/faker/locale/pt_BR";
import {
  clienteResourceSchema,
  loginResponseDataSchema,
  oauthResponseDataSchema,
} from "@/src/contracts/schemas";

// ─── ClienteResource ────────────────────────────────────────

export function createMockClienteResource(
  overrides?: Record<string, unknown>,
) {
  return clienteResourceSchema.parse({
    id: faker.number.int({ min: 1, max: 9999 }),
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: faker.string.numeric(11),
    telefone: faker.phone.number(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    ...overrides,
  });
}

// ─── LoginResponseData ──────────────────────────────────────

export function createMockLoginResponseData(
  overrides?: Record<string, unknown>,
) {
  return loginResponseDataSchema.parse({
    token: faker.string.alphanumeric(64),
    token_type: "bearer" as const,
    expires_in: 3600,
    cliente: createMockClienteResource(),
    ...overrides,
  });
}

// ─── OAuthResponseData ──────────────────────────────────────

export function createMockOAuthResponseData(
  overrides?: Record<string, unknown>,
) {
  return oauthResponseDataSchema.parse({
    token: faker.string.alphanumeric(64),
    token_type: "bearer" as const,
    expires_in: 3600,
    cliente: createMockClienteResource(),
    ...overrides,
  });
}

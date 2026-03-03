/**
 * Auth fixtures — mobile consumer authentication.
 *
 * Every factory calls `schema.parse()` to guarantee the mock
 * matches the contract schemas exactly.
 */
import { faker } from '@faker-js/faker/locale/pt_BR'
import {
  clienteResourceSchema,
  loginResponseDataSchema,
} from '@/src/contracts/schemas'
import type { ClienteResource, LoginResponseData } from '@/src/contracts/schemas'

// ─── Factories ──────────────────────────────────────────────

export function createMockClienteResource(
  overrides: Partial<ClienteResource> = {},
): ClienteResource {
  return clienteResourceSchema.parse({
    id: faker.number.int({ min: 1, max: 99_999 }),
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: faker.string.numeric(11),
    telefone: faker.phone.number(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    ...overrides,
  })
}

export function createMockLoginResponseData(
  overrides: Partial<LoginResponseData> = {},
): LoginResponseData {
  return loginResponseDataSchema.parse({
    token: faker.string.alphanumeric(128),
    token_type: 'bearer' as const,
    expires_in: 3600,
    cliente: createMockClienteResource(),
    ...overrides,
  })
}

/**
 * OAuth response uses the same schema as login.
 */
export function createMockOAuthResponseData(
  overrides: Partial<LoginResponseData> = {},
): LoginResponseData {
  return createMockLoginResponseData(overrides)
}

export function createMockTokenPair() {
  return {
    token: faker.string.alphanumeric(128),
    token_type: 'bearer' as const,
    expires_in: 3600,
  }
}

export function createMockBiometricEnrollResponse() {
  return { enrolled: true }
}

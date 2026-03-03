/**
 * Contestacao fixtures — mobile consumer disputes.
 *
 * Every factory calls `schema.parse()` to guarantee the mock
 * matches the contract schemas exactly.
 */
import { faker } from '@faker-js/faker/locale/pt_BR'
import { contestacaoSchema } from '@/src/contracts/schemas'
import type { Contestacao } from '@/src/contracts/schemas'

// ─── Helpers ────────────────────────────────────────────────

function randomContestacaoTipo() {
  return faker.helpers.arrayElement([
    'cashback_nao_gerado',
    'valor_incorreto',
    'expiracao_indevida',
    'venda_cancelada',
  ] as const)
}

function randomContestacaoStatus() {
  return faker.helpers.arrayElement([
    'pendente',
    'aprovada',
    'rejeitada',
  ] as const)
}

// ─── Factories ──────────────────────────────────────────────

export function createMockContestacao(
  overrides: Partial<Contestacao> = {},
): Contestacao {
  return contestacaoSchema.parse({
    id: faker.number.int({ min: 1, max: 99_999 }),
    empresa_id: faker.number.int({ min: 1, max: 999 }),
    transacao_id: faker.number.int({ min: 1, max: 99_999 }),
    cliente_id: faker.number.int({ min: 1, max: 99_999 }),
    tipo: randomContestacaoTipo(),
    descricao: faker.lorem.sentence({ min: 5, max: 15 }),
    status: randomContestacaoStatus(),
    resposta: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }) ?? null,
    respondido_por: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 999 }), { probability: 0.3 }) ?? null,
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    empresa_nome: faker.company.name(),
    valor: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
    ...overrides,
  })
}

export function createMockContestacaoList(count = 5): Contestacao[] {
  return Array.from({ length: count }, () => createMockContestacao())
}

/**
 * Contestacao domain fixtures — schema-validated mock factories.
 */
import { faker } from "@faker-js/faker/locale/pt_BR";
import { contestacaoSchema } from "@/src/contracts/schemas";

// ─── Contestacao ────────────────────────────────────────────

export function createMockContestacao(overrides?: Record<string, unknown>) {
  return contestacaoSchema.parse({
    id: faker.number.int({ min: 1, max: 99999 }),
    empresa_id: faker.number.int({ min: 1, max: 999 }),
    transacao_id: faker.number.int({ min: 1, max: 99999 }),
    cliente_id: faker.number.int({ min: 1, max: 9999 }),
    tipo: faker.helpers.arrayElement([
      "cashback_nao_gerado",
      "valor_incorreto",
      "expiracao_indevida",
      "venda_cancelada",
    ]),
    descricao: faker.lorem.sentence({ min: 5, max: 15 }),
    status: faker.helpers.arrayElement(["pendente", "aprovada", "rejeitada"]),
    resposta: faker.helpers.maybe(() => faker.lorem.sentence(), {
      probability: 0.3,
    }) ?? null,
    respondido_por: faker.helpers.maybe(
      () => faker.number.int({ min: 1, max: 999 }),
      { probability: 0.3 },
    ) ?? null,
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    empresa_nome: faker.company.name(),
    valor: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
    ...overrides,
  });
}

export function createMockContestacaoList(count = 3) {
  return Array.from({ length: count }, () => createMockContestacao());
}

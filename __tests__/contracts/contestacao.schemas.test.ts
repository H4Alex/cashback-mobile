import {
  contestacaoSchema,
  createContestacaoRequestSchema,
} from "../../src/contracts/schemas/contestacao.schemas";

const VALID_CONTESTACAO = {
  id: 1,
  empresa_id: 1,
  transacao_id: 10,
  cliente_id: null,
  tipo: "valor_incorreto" as const,
  descricao: "O valor do cashback está incorreto para esta compra",
  status: "pendente" as const,
  created_at: "2026-03-15T10:00:00Z",
  updated_at: "2026-03-15T10:00:00Z",
};

describe("contestacaoSchema", () => {
  it("aceita payload válido", () => {
    expect(contestacaoSchema.safeParse(VALID_CONTESTACAO).success).toBe(true);
  });

  it("aceita com campos opcionais empresa_nome e valor", () => {
    expect(
      contestacaoSchema.safeParse({
        ...VALID_CONTESTACAO,
        empresa_nome: "Loja A",
        valor: 50.0,
      }).success
    ).toBe(true);
  });

  it("rejeita tipo inválido", () => {
    expect(
      contestacaoSchema.safeParse({ ...VALID_CONTESTACAO, tipo: "outro" }).success
    ).toBe(false);
  });

  it("rejeita status inválido", () => {
    expect(
      contestacaoSchema.safeParse({ ...VALID_CONTESTACAO, status: "cancelada" }).success
    ).toBe(false);
  });

  it("rejeita payload vazio", () => {
    expect(contestacaoSchema.safeParse({}).success).toBe(false);
  });
});

describe("createContestacaoRequestSchema", () => {
  it("aceita payload válido", () => {
    expect(
      createContestacaoRequestSchema.safeParse({
        transacao_id: 10,
        tipo: "cashback_nao_gerado",
        descricao: "Não recebi cashback na compra de R$100",
      }).success
    ).toBe(true);
  });

  it("aceita descrição com até 1000 caracteres", () => {
    expect(
      createContestacaoRequestSchema.safeParse({
        transacao_id: 10,
        tipo: "valor_incorreto",
        descricao: "A".repeat(1000),
      }).success
    ).toBe(true);
  });

  it("rejeita descrição com mais de 1000 caracteres", () => {
    expect(
      createContestacaoRequestSchema.safeParse({
        transacao_id: 10,
        tipo: "valor_incorreto",
        descricao: "A".repeat(1001),
      }).success
    ).toBe(false);
  });

  it("rejeita descrição muito curta (menos de 10)", () => {
    expect(
      createContestacaoRequestSchema.safeParse({
        transacao_id: 10,
        tipo: "valor_incorreto",
        descricao: "curta",
      }).success
    ).toBe(false);
  });

  it("rejeita transacao_id zero ou negativo", () => {
    expect(
      createContestacaoRequestSchema.safeParse({
        transacao_id: 0,
        tipo: "venda_cancelada",
        descricao: "A venda foi cancelada mas o cashback não foi estornado",
      }).success
    ).toBe(false);
  });

  it("rejeita payload vazio", () => {
    expect(createContestacaoRequestSchema.safeParse({}).success).toBe(false);
  });
});

import { createContestacaoSchema } from "@/src/schemas/contestacao";

describe("createContestacaoSchema", () => {
  it("validates correct contestacao data", () => {
    const result = createContestacaoSchema.safeParse({
      cashback_entry_id: "cb_123",
      tipo: "valor_incorreto",
      descricao: "O valor do cashback está incorreto na minha conta",
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid tipo values", () => {
    const tipos = [
      "cashback_nao_gerado",
      "valor_incorreto",
      "expiracao_indevida",
      "venda_cancelada",
    ] as const;

    for (const tipo of tipos) {
      const result = createContestacaoSchema.safeParse({
        cashback_entry_id: "cb_1",
        tipo,
        descricao: "Descrição com pelo menos 10 caracteres",
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects empty cashback_entry_id", () => {
    const result = createContestacaoSchema.safeParse({
      cashback_entry_id: "",
      tipo: "valor_incorreto",
      descricao: "Descrição com pelo menos 10 caracteres",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid tipo value", () => {
    const result = createContestacaoSchema.safeParse({
      cashback_entry_id: "cb_1",
      tipo: "outro_motivo",
      descricao: "Descrição com pelo menos 10 caracteres",
    });
    expect(result.success).toBe(false);
  });

  it("rejects description shorter than 10 characters", () => {
    const result = createContestacaoSchema.safeParse({
      cashback_entry_id: "cb_1",
      tipo: "valor_incorreto",
      descricao: "Curto",
    });
    expect(result.success).toBe(false);
  });

  it("rejects description longer than 500 characters", () => {
    const result = createContestacaoSchema.safeParse({
      cashback_entry_id: "cb_1",
      tipo: "valor_incorreto",
      descricao: "A".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepts description at exactly 10 characters", () => {
    const result = createContestacaoSchema.safeParse({
      cashback_entry_id: "cb_1",
      tipo: "valor_incorreto",
      descricao: "1234567890",
    });
    expect(result.success).toBe(true);
  });

  it("accepts description at exactly 500 characters", () => {
    const result = createContestacaoSchema.safeParse({
      cashback_entry_id: "cb_1",
      tipo: "valor_incorreto",
      descricao: "A".repeat(500),
    });
    expect(result.success).toBe(true);
  });
});

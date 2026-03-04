/**
 * Contract tests: Zod REQUEST schemas (S9-E1 trivial fixes).
 */
import { utilizarCashbackRequestSchema } from "@/src/contracts/schemas/merchant.schemas";

// ─── A5: UtilizarCashback valor→valor_compra ────────────────

describe("A5: utilizarCashbackRequestSchema uses valor_compra", () => {
  it("accepts valor_compra field", () => {
    const result = utilizarCashbackRequestSchema.safeParse({
      cpf: "52998224725",
      valor_compra: 50.0,
      unidade_negocio_id: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects old 'valor' field name", () => {
    const result = utilizarCashbackRequestSchema.safeParse({
      cpf: "52998224725",
      valor: 50.0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative valor_compra", () => {
    const result = utilizarCashbackRequestSchema.safeParse({
      cpf: "52998224725",
      valor_compra: -10,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing valor_compra", () => {
    const result = utilizarCashbackRequestSchema.safeParse({
      cpf: "52998224725",
    });
    expect(result.success).toBe(false);
  });
});

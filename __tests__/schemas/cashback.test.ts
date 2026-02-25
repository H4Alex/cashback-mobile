import { gerarQRCodeSchema, validarQRCodeSchema } from "@/src/schemas/cashback";

describe("gerarQRCodeSchema", () => {
  it("validates correct data", () => {
    const result = gerarQRCodeSchema.safeParse({
      empresa_id: 1,
      valor: 50.0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative valor", () => {
    const result = gerarQRCodeSchema.safeParse({
      empresa_id: 1,
      valor: -10,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero valor", () => {
    const result = gerarQRCodeSchema.safeParse({
      empresa_id: 1,
      valor: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe("validarQRCodeSchema", () => {
  it("validates correct token", () => {
    const result = validarQRCodeSchema.safeParse({
      qr_token: "abc-123-def",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty token", () => {
    const result = validarQRCodeSchema.safeParse({ qr_token: "" });
    expect(result.success).toBe(false);
  });
});

import {
  gerarCashbackMerchantSchema,
  utilizarCashbackSchema,
} from "@/src/schemas/merchant";

describe("gerarCashbackMerchantSchema", () => {
  it("validates correct data", () => {
    const result = gerarCashbackMerchantSchema.safeParse({
      cpf: "52998224725",
      valor: 100.0,
    });
    expect(result.success).toBe(true);
  });

  it("validates with optional campanha_id", () => {
    const result = gerarCashbackMerchantSchema.safeParse({
      cpf: "52998224725",
      valor: 50.0,
      campanha_id: 5,
    });
    expect(result.success).toBe(true);
  });

  it("strips non-numeric characters from CPF via transform", () => {
    const result = gerarCashbackMerchantSchema.safeParse({
      cpf: "529.982.247-25",
      valor: 100.0,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cpf).toBe("52998224725");
    }
  });

  it("rejects CPF shorter than 11 digits", () => {
    const result = gerarCashbackMerchantSchema.safeParse({
      cpf: "123",
      valor: 100.0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative valor", () => {
    const result = gerarCashbackMerchantSchema.safeParse({
      cpf: "52998224725",
      valor: -10,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero valor", () => {
    const result = gerarCashbackMerchantSchema.safeParse({
      cpf: "52998224725",
      valor: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe("utilizarCashbackSchema", () => {
  it("validates correct data", () => {
    const result = utilizarCashbackSchema.safeParse({
      cpf: "52998224725",
      valor: 50.0,
    });
    expect(result.success).toBe(true);
  });

  it("strips non-numeric characters from CPF via transform", () => {
    const result = utilizarCashbackSchema.safeParse({
      cpf: "529.982.247-25",
      valor: 25.0,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cpf).toBe("52998224725");
    }
  });

  it("rejects CPF shorter than 11 digits", () => {
    const result = utilizarCashbackSchema.safeParse({
      cpf: "123",
      valor: 50.0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative valor", () => {
    const result = utilizarCashbackSchema.safeParse({
      cpf: "52998224725",
      valor: -5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero valor", () => {
    const result = utilizarCashbackSchema.safeParse({
      cpf: "52998224725",
      valor: 0,
    });
    expect(result.success).toBe(false);
  });
});

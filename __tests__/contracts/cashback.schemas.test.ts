import {
  saldoDataSchema,
  extratoEntrySchema,
  qrCodeTokenSchema,
  validarQRCodeResponseSchema,
  gerarQRCodeRequestSchema,
  validarQRCodeRequestSchema,
} from "../../src/contracts/schemas/cashback.schemas";

const VALID_SALDO = {
  saldo_total: 150.75,
  por_empresa: [
    { empresa_id: 1, nome_fantasia: "Loja A", logo_url: null, saldo: 100.5 },
    { empresa_id: 2, nome_fantasia: "Loja B", logo_url: "https://example.com/logo.png", saldo: 50.25 },
  ],
};

const VALID_EXTRATO = {
  id: 1,
  tipo: "credito",
  valor_compra: 200.0,
  valor_cashback: 20.0,
  status_cashback: "confirmado" as const,
  data_expiracao: null,
  created_at: "2026-03-15T10:00:00Z",
};

const VALID_QR_TOKEN = {
  qr_token: "abc123",
  cliente_id: 1,
  empresa_id: 1,
  valor: 50.0,
  expira_em: "2026-03-15T11:00:00Z",
};

describe("saldoDataSchema", () => {
  it("aceita payload válido", () => {
    expect(saldoDataSchema.safeParse(VALID_SALDO).success).toBe(true);
  });

  it("aceita sem proximo_a_expirar", () => {
    expect(saldoDataSchema.safeParse(VALID_SALDO).success).toBe(true);
  });

  it("rejeita sem saldo_total", () => {
    const { saldo_total, ...rest } = VALID_SALDO;
    expect(saldoDataSchema.safeParse(rest).success).toBe(false);
  });

  it("rejeita payload vazio", () => {
    expect(saldoDataSchema.safeParse({}).success).toBe(false);
  });
});

describe("extratoEntrySchema", () => {
  it("aceita payload válido", () => {
    expect(extratoEntrySchema.safeParse(VALID_EXTRATO).success).toBe(true);
  });

  it("rejeita status_cashback inválido", () => {
    expect(
      extratoEntrySchema.safeParse({ ...VALID_EXTRATO, status_cashback: "invalido" }).success
    ).toBe(false);
  });

  it("rejeita sem campo obrigatório id", () => {
    const { id, ...rest } = VALID_EXTRATO;
    expect(extratoEntrySchema.safeParse(rest).success).toBe(false);
  });

  it("rejeita payload vazio", () => {
    expect(extratoEntrySchema.safeParse({}).success).toBe(false);
  });
});

describe("qrCodeTokenSchema", () => {
  it("aceita payload válido", () => {
    expect(qrCodeTokenSchema.safeParse(VALID_QR_TOKEN).success).toBe(true);
  });

  it("rejeita sem qr_token", () => {
    const { qr_token, ...rest } = VALID_QR_TOKEN;
    expect(qrCodeTokenSchema.safeParse(rest).success).toBe(false);
  });

  it("rejeita payload vazio", () => {
    expect(qrCodeTokenSchema.safeParse({}).success).toBe(false);
  });
});

describe("validarQRCodeResponseSchema", () => {
  it("aceita payload com campos opcionais", () => {
    expect(
      validarQRCodeResponseSchema.safeParse({ valid: true, valor: 50.0 }).success
    ).toBe(true);
  });

  it("aceita payload vazio (todos opcionais)", () => {
    expect(validarQRCodeResponseSchema.safeParse({}).success).toBe(true);
  });
});

describe("gerarQRCodeRequestSchema", () => {
  it("aceita payload válido", () => {
    expect(
      gerarQRCodeRequestSchema.safeParse({ empresa_id: 1, valor: 50.0 }).success
    ).toBe(true);
  });

  it("rejeita valor zero ou negativo", () => {
    expect(
      gerarQRCodeRequestSchema.safeParse({ empresa_id: 1, valor: 0 }).success
    ).toBe(false);
  });

  it("rejeita payload vazio", () => {
    expect(gerarQRCodeRequestSchema.safeParse({}).success).toBe(false);
  });
});

describe("validarQRCodeRequestSchema", () => {
  it("aceita qr_token válido", () => {
    expect(
      validarQRCodeRequestSchema.safeParse({ qr_token: "token123" }).success
    ).toBe(true);
  });

  it("rejeita sem qr_token", () => {
    expect(validarQRCodeRequestSchema.safeParse({}).success).toBe(false);
  });
});

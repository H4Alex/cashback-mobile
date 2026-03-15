import {
  gerarCashbackMerchantRequestSchema,
  utilizarCashbackRequestSchema,
  gerarCashbackResponseSchema,
  merchantDashboardStatsSchema,
  clienteSaldoSchema,
} from "../../src/contracts/schemas/merchant.schemas";

const VALID_GERAR_REQUEST = {
  cpf: "12345678901",
  valor_compra: 100.0,
  campanha_id: 1,
  unidade_negocio_id: 1,
};

const VALID_UTILIZAR_REQUEST = {
  cpf: "12345678901",
  valor_compra: 50.0,
};

describe("gerarCashbackMerchantRequestSchema", () => {
  it("aceita payload válido completo", () => {
    expect(gerarCashbackMerchantRequestSchema.safeParse(VALID_GERAR_REQUEST).success).toBe(true);
  });

  it("aceita sem campos opcionais", () => {
    const { campanha_id, unidade_negocio_id, ...rest } = VALID_GERAR_REQUEST;
    expect(gerarCashbackMerchantRequestSchema.safeParse(rest).success).toBe(true);
  });

  it("rejeita CPF com tamanho errado", () => {
    expect(
      gerarCashbackMerchantRequestSchema.safeParse({ ...VALID_GERAR_REQUEST, cpf: "123" }).success
    ).toBe(false);
  });

  it("rejeita valor_compra zero ou negativo", () => {
    expect(
      gerarCashbackMerchantRequestSchema.safeParse({ ...VALID_GERAR_REQUEST, valor_compra: 0 }).success
    ).toBe(false);
  });

  it("rejeita sem CPF", () => {
    const { cpf, ...rest } = VALID_GERAR_REQUEST;
    expect(gerarCashbackMerchantRequestSchema.safeParse(rest).success).toBe(false);
  });

  it("rejeita payload vazio", () => {
    expect(gerarCashbackMerchantRequestSchema.safeParse({}).success).toBe(false);
  });
});

describe("utilizarCashbackRequestSchema", () => {
  it("aceita payload válido", () => {
    expect(utilizarCashbackRequestSchema.safeParse(VALID_UTILIZAR_REQUEST).success).toBe(true);
  });

  it("rejeita sem cpf", () => {
    expect(
      utilizarCashbackRequestSchema.safeParse({ valor_compra: 50 }).success
    ).toBe(false);
  });

  it("rejeita valor_compra negativo", () => {
    expect(
      utilizarCashbackRequestSchema.safeParse({ ...VALID_UTILIZAR_REQUEST, valor_compra: -1 }).success
    ).toBe(false);
  });

  it("rejeita payload vazio", () => {
    expect(utilizarCashbackRequestSchema.safeParse({}).success).toBe(false);
  });
});

describe("gerarCashbackResponseSchema", () => {
  it("aceita payload válido", () => {
    const payload = {
      id: 1,
      valor_compra: 100.0,
      percentual: 5.0,
      cashback_gerado: 5.0,
      validade_dias: 30,
      cliente_nome: "João",
    };
    expect(gerarCashbackResponseSchema.safeParse(payload).success).toBe(true);
  });

  it("rejeita sem id", () => {
    expect(
      gerarCashbackResponseSchema.safeParse({
        valor_compra: 100,
        percentual: 5,
        cashback_gerado: 5,
        validade_dias: 30,
        cliente_nome: "João",
      }).success
    ).toBe(false);
  });

  it("rejeita payload vazio", () => {
    expect(gerarCashbackResponseSchema.safeParse({}).success).toBe(false);
  });
});

describe("merchantDashboardStatsSchema", () => {
  it("aceita payload válido", () => {
    const payload = {
      total_vendas: 10000,
      total_cashback_gerado: 500,
      total_cashback_utilizado: 300,
      total_clientes: 50,
      ticket_medio: 200,
    };
    expect(merchantDashboardStatsSchema.safeParse(payload).success).toBe(true);
  });

  it("rejeita payload vazio", () => {
    expect(merchantDashboardStatsSchema.safeParse({}).success).toBe(false);
  });
});

describe("clienteSaldoSchema", () => {
  it("aceita payload válido", () => {
    const payload = {
      cliente: { id: 1, nome: "João", cpf: "12345678901" },
      saldo: 150.75,
    };
    expect(clienteSaldoSchema.safeParse(payload).success).toBe(true);
  });

  it("rejeita sem saldo", () => {
    expect(
      clienteSaldoSchema.safeParse({ cliente: { id: 1, nome: "João", cpf: "123" } }).success
    ).toBe(false);
  });
});

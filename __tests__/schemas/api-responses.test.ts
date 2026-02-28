import {
  apiResponseSchema,
  cursorPaginatedResponseSchema,
  clienteResourceSchema,
  loginResponseDataSchema,
  loginResponseSchema,
  saldoDataSchema,
  extratoEntrySchema,
  contestacaoSchema,
  notificationSchema,
} from "@/src/schemas/api-responses";
import { z } from "zod";

describe("API Response Schemas", () => {
  describe("apiResponseSchema", () => {
    const stringResponseSchema = apiResponseSchema(z.string());

    it("accepts a valid API response", () => {
      const result = stringResponseSchema.safeParse({
        status: true,
        data: "hello",
        error: null,
        message: "Success",
      });
      expect(result.success).toBe(true);
    });

    it("rejects when status is not true", () => {
      const result = stringResponseSchema.safeParse({
        status: false,
        data: "hello",
        error: null,
        message: "Success",
      });
      expect(result.success).toBe(false);
    });

    it("rejects when status is a string instead of boolean", () => {
      const result = stringResponseSchema.safeParse({
        status: "success",
        data: "hello",
        error: null,
        message: "ok",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("cursorPaginatedResponseSchema", () => {
    const paginatedSchema = cursorPaginatedResponseSchema(z.number());

    it("accepts a valid cursor-paginated response", () => {
      const result = paginatedSchema.safeParse({
        status: true,
        data: {
          data: [1, 2, 3],
          meta: {
            next_cursor: "abc123",
            prev_cursor: null,
            per_page: 10,
            has_more_pages: true,
          },
        },
        error: null,
        message: "Listed",
      });
      expect(result.success).toBe(true);
    });

    it("rejects when meta is missing", () => {
      const result = paginatedSchema.safeParse({
        status: true,
        data: { data: [1, 2, 3] },
        error: null,
        message: "Listed",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("clienteResourceSchema", () => {
    it("accepts a valid ClienteResource", () => {
      const result = clienteResourceSchema.safeParse({
        id: 1,
        nome: "João Silva",
        email: "joao@email.com",
        cpf: "***.***.789-00",
        telefone: "(11) 99999-1234",
        created_at: "2025-01-01T00:00:00.000Z",
        updated_at: "2025-01-01T00:00:00.000Z",
      });
      expect(result.success).toBe(true);
    });

    it("accepts ClienteResource without optional fields", () => {
      const result = clienteResourceSchema.safeParse({
        id: 1,
        nome: "João Silva",
        email: "joao@email.com",
        created_at: "2025-01-01T00:00:00.000Z",
      });
      expect(result.success).toBe(true);
    });

    it("rejects ClienteResource without required nome", () => {
      const result = clienteResourceSchema.safeParse({
        id: 1,
        email: "joao@email.com",
        created_at: "2025-01-01T00:00:00.000Z",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("loginResponseDataSchema", () => {
    it("accepts valid login response data", () => {
      const result = loginResponseDataSchema.safeParse({
        token: "eyJ...",
        token_type: "bearer",
        expires_in: 28800,
        cliente: {
          id: 1,
          nome: "Maria",
          email: "maria@test.com",
          created_at: "2025-01-01T00:00:00.000Z",
        },
      });
      expect(result.success).toBe(true);
    });
  });

  describe("loginResponseSchema", () => {
    it("accepts full login response with envelope", () => {
      const result = loginResponseSchema.safeParse({
        status: true,
        data: {
          token: "eyJ...",
          token_type: "bearer",
          expires_in: 28800,
          cliente: {
            id: 1,
            nome: "Maria",
            email: "maria@test.com",
            created_at: "2025-01-01T00:00:00.000Z",
          },
        },
        error: null,
        message: "Login realizado com sucesso",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("saldoDataSchema", () => {
    it("accepts valid saldo data", () => {
      const result = saldoDataSchema.safeParse({
        saldo_total: 150.5,
        por_empresa: [
          {
            empresa_id: 1,
            nome_fantasia: "Loja Teste",
            logo_url: null,
            saldo: "100.50",
          },
          {
            empresa_id: 2,
            nome_fantasia: null,
            logo_url: "https://cdn.example.com/logo.png",
            saldo: "50.00",
          },
        ],
        proximo_a_expirar: {
          valor: 30.0,
          quantidade: 2,
        },
      });
      expect(result.success).toBe(true);
    });

    it("rejects when using old field names (total, disponivel, pendente)", () => {
      const result = saldoDataSchema.safeParse({
        total: 150.5,
        disponivel: 120,
        pendente: 30,
        empresas: [],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("extratoEntrySchema", () => {
    it("accepts valid extrato entry (MobileExtratoResource shape)", () => {
      const result = extratoEntrySchema.safeParse({
        id: 123,
        tipo: "cashback",
        valor_compra: 200.0,
        valor_cashback: 10.0,
        status_cashback: "confirmado",
        data_expiracao: "2025-03-01T00:00:00.000Z",
        created_at: "2025-01-15T10:30:00.000Z",
        empresa: {
          id: 1,
          nome_fantasia: "Loja Teste",
          logo_url: null,
        },
      });
      expect(result.success).toBe(true);
    });

    it("accepts extrato entry without optional relations", () => {
      const result = extratoEntrySchema.safeParse({
        id: 123,
        tipo: "cashback",
        valor_compra: 200.0,
        valor_cashback: 10.0,
        status_cashback: "pendente",
        data_expiracao: null,
        created_at: "2025-01-15T10:30:00.000Z",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("contestacaoSchema", () => {
    it("accepts valid contestacao with correct enums", () => {
      const result = contestacaoSchema.safeParse({
        id: 1,
        tipo: "cashback_nao_gerado",
        descricao: "Cashback não foi creditado",
        status: "pendente",
        cashback_entry_id: "123",
        empresa_nome: "Loja Teste",
        valor: 50.0,
        created_at: "2025-01-01T00:00:00.000Z",
        updated_at: "2025-01-01T00:00:00.000Z",
      });
      expect(result.success).toBe(true);
    });

    it("rejects old tipo values (cashback_nao_creditado, empresa_errada, outro)", () => {
      expect(
        contestacaoSchema.safeParse({
          id: 1,
          tipo: "cashback_nao_creditado",
          descricao: "test",
          status: "pendente",
          cashback_entry_id: "123",
          empresa_nome: "Test",
          valor: 10,
          created_at: "2025-01-01T00:00:00.000Z",
          updated_at: "2025-01-01T00:00:00.000Z",
        }).success,
      ).toBe(false);
    });

    it("rejects old status value (em_analise)", () => {
      expect(
        contestacaoSchema.safeParse({
          id: 1,
          tipo: "valor_incorreto",
          descricao: "test",
          status: "em_analise",
          cashback_entry_id: "123",
          empresa_nome: "Test",
          valor: 10,
          created_at: "2025-01-01T00:00:00.000Z",
          updated_at: "2025-01-01T00:00:00.000Z",
        }).success,
      ).toBe(false);
    });
  });

  describe("notificationSchema", () => {
    it("accepts valid notification", () => {
      const result = notificationSchema.safeParse({
        id: 1,
        titulo: "Cashback recebido",
        mensagem: "Você recebeu R$ 10,00 de cashback",
        tipo: "cashback_recebido",
        lida: false,
        dados_extras: null,
        created_at: "2025-01-15T10:30:00.000Z",
      });
      expect(result.success).toBe(true);
    });

    it("accepts notification with dados_extras", () => {
      const result = notificationSchema.safeParse({
        id: 2,
        titulo: "Promoção",
        mensagem: "Nova campanha disponível",
        tipo: "campanha_nova",
        lida: true,
        dados_extras: { campanha_id: 123, empresa_id: 1 },
        created_at: "2025-01-15T10:30:00.000Z",
      });
      expect(result.success).toBe(true);
    });
  });
});

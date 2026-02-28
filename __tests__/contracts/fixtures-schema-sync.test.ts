/**
 * Contract-sync tests: every fixture factory must produce data that
 * conforms to the corresponding Zod schema defined in
 * `src/schemas/api-responses.ts`.
 *
 * These tests act as an early-warning system: if either a fixture or a
 * schema drifts, the suite fails and points directly to the mismatch.
 */

import {
  buildCliente,
  buildCashbackEntry,
  buildCashbackSaldo,
  buildEmpresaSaldo,
  buildExtratoEntry,
  buildContestacao,
  buildNotification,
  buildApiResponse,
  buildCursorPaginated,
  resetFixtureSequence,
} from '../fixtures';
import {
  apiResponseSchema,
  cursorPaginatedResponseSchema,
  clienteResourceSchema,
  loginResponseDataSchema,
  saldoDataSchema,
  extratoEntrySchema,
  contestacaoSchema,
  notificationSchema,
} from '@/src/schemas/api-responses';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convenience – parse and expect success, returning ZodError on failure. */
function expectValid(schema: { safeParse: (d: unknown) => { success: boolean; error?: unknown } }, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    // Surface the Zod issues in the Jest failure message for easier debugging
    throw new Error(`Zod validation failed:\n${JSON.stringify(result.error, null, 2)}`);
  }
  expect(result.success).toBe(true);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Fixture -> Zod Schema Contract Sync', () => {
  beforeEach(() => {
    resetFixtureSequence();
  });

  // -----------------------------------------------------------------------
  // buildCliente -> clienteResourceSchema
  // -----------------------------------------------------------------------
  describe('buildCliente', () => {
    it('conforms to clienteResourceSchema with defaults', () => {
      const cliente = buildCliente();
      expectValid(clienteResourceSchema, cliente);
    });

    it('conforms with overrides', () => {
      const cliente = buildCliente({ nome: 'Custom Name', telefone: null });
      expectValid(clienteResourceSchema, cliente);
    });

    it('conforms when optional fields are omitted', () => {
      const { cpf, telefone, ...minimal } = buildCliente();
      expectValid(clienteResourceSchema, minimal);
    });

    it('conforms inside a loginResponseDataSchema envelope', () => {
      const loginData = {
        token: 'eyJhbGciOiJIUzI1NiJ9.test',
        token_type: 'bearer',
        expires_in: 28800,
        cliente: buildCliente(),
      };
      expectValid(loginResponseDataSchema, loginData);
    });
  });

  // -----------------------------------------------------------------------
  // buildCashbackSaldo -> saldoDataSchema
  // -----------------------------------------------------------------------
  describe('buildCashbackSaldo', () => {
    it('conforms to saldoDataSchema with defaults', () => {
      const saldo = buildCashbackSaldo();
      expectValid(saldoDataSchema, saldo);
    });

    it('conforms with overridden saldo_total', () => {
      const saldo = buildCashbackSaldo({ saldo_total: 0 });
      expectValid(saldoDataSchema, saldo);
    });

    it('conforms with multiple empresas', () => {
      const saldo = buildCashbackSaldo({
        por_empresa: [
          buildEmpresaSaldo({ empresa_id: 1, nome_fantasia: 'Loja A' }),
          buildEmpresaSaldo({ empresa_id: 2, nome_fantasia: null }),
        ],
      });
      expectValid(saldoDataSchema, saldo);
    });

    it('conforms with empty por_empresa array', () => {
      const saldo = buildCashbackSaldo({ por_empresa: [] });
      expectValid(saldoDataSchema, saldo);
    });

    it('conforms when wrapped in apiResponseSchema', () => {
      const response = buildApiResponse(buildCashbackSaldo());
      expectValid(apiResponseSchema(saldoDataSchema), response);
    });
  });

  // -----------------------------------------------------------------------
  // buildExtratoEntry -> extratoEntrySchema
  // -----------------------------------------------------------------------
  describe('buildExtratoEntry', () => {
    it('conforms to extratoEntrySchema with defaults', () => {
      const entry = buildExtratoEntry();
      expectValid(extratoEntrySchema, entry);
    });

    it('conforms without optional empresa/campanha', () => {
      const { empresa, campanha, ...minimal } = buildExtratoEntry();
      expectValid(extratoEntrySchema, minimal);
    });

    it('conforms with null data_expiracao', () => {
      const entry = buildExtratoEntry({ data_expiracao: null });
      expectValid(extratoEntrySchema, entry);
    });

    it('conforms inside cursorPaginatedResponseSchema', () => {
      const paginated = buildCursorPaginated([
        buildExtratoEntry({ id: 1 }),
        buildExtratoEntry({ id: 2 }),
      ]);
      expectValid(cursorPaginatedResponseSchema(extratoEntrySchema), paginated);
    });

    it('conforms with pagination meta having next_cursor', () => {
      const paginated = buildCursorPaginated(
        [buildExtratoEntry()],
        { next_cursor: 'cursor_abc', has_more_pages: true },
      );
      expectValid(cursorPaginatedResponseSchema(extratoEntrySchema), paginated);
    });
  });

  // -----------------------------------------------------------------------
  // buildContestacao -> contestacaoSchema
  // -----------------------------------------------------------------------
  describe('buildContestacao', () => {
    it('conforms to contestacaoSchema with defaults', () => {
      const contestacao = buildContestacao();
      expectValid(contestacaoSchema, contestacao);
    });

    it('conforms with each valid tipo', () => {
      const tipos = ['cashback_nao_gerado', 'valor_incorreto', 'expiracao_indevida', 'venda_cancelada'] as const;
      for (const tipo of tipos) {
        const contestacao = buildContestacao({ tipo });
        expectValid(contestacaoSchema, contestacao);
      }
    });

    it('conforms with each valid status', () => {
      const statuses = ['pendente', 'aprovada', 'rejeitada'] as const;
      for (const status of statuses) {
        const contestacao = buildContestacao({ status });
        expectValid(contestacaoSchema, contestacao);
      }
    });

    it('conforms with optional resposta field', () => {
      const contestacao = buildContestacao({ resposta: 'Resolvido conforme solicitado.' });
      expectValid(contestacaoSchema, contestacao);
    });

    it('conforms inside cursorPaginatedResponseSchema', () => {
      const paginated = buildCursorPaginated([
        buildContestacao({ id: 1 }),
        buildContestacao({ id: 2, status: 'aprovada' }),
      ]);
      expectValid(cursorPaginatedResponseSchema(contestacaoSchema), paginated);
    });
  });

  // -----------------------------------------------------------------------
  // buildNotification -> notificationSchema
  // -----------------------------------------------------------------------
  describe('buildNotification', () => {
    it('conforms to notificationSchema with defaults', () => {
      const notification = buildNotification();
      expectValid(notificationSchema, notification);
    });

    it('conforms with each valid tipo', () => {
      const tipos = [
        'cashback_recebido',
        'cashback_expirado',
        'cashback_utilizado',
        'campanha_nova',
        'contestacao_atualizada',
        'sistema',
      ] as const;
      for (const tipo of tipos) {
        const notification = buildNotification({ tipo });
        expectValid(notificationSchema, notification);
      }
    });

    it('conforms when lida is true', () => {
      const notification = buildNotification({ lida: true });
      expectValid(notificationSchema, notification);
    });

    it('conforms with dados_extras as record', () => {
      const notification = buildNotification({
        dados_extras: { campanha_id: 42, url: 'https://example.com' },
      });
      expectValid(notificationSchema, notification);
    });

    it('conforms with dados_extras as null', () => {
      const notification = buildNotification({ dados_extras: null });
      expectValid(notificationSchema, notification);
    });
  });

  // -----------------------------------------------------------------------
  // buildCashbackEntry  (no dedicated Zod schema – verify structural shape)
  // -----------------------------------------------------------------------
  describe('buildCashbackEntry', () => {
    it('produces required fields (structural sanity check)', () => {
      const entry = buildCashbackEntry();
      expect(entry).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          valor: expect.any(Number),
          status: expect.any(String),
          empresa_nome: expect.any(String),
          empresa_id: expect.any(Number),
          created_at: expect.any(String),
        }),
      );
    });

    it('respects overrides', () => {
      const entry = buildCashbackEntry({ valor: 99.99, status: 'pendente' });
      expect(entry.valor).toBe(99.99);
      expect(entry.status).toBe('pendente');
    });
  });

  // -----------------------------------------------------------------------
  // buildEmpresaSaldo (sub-schema of saldoDataSchema.por_empresa items)
  // -----------------------------------------------------------------------
  describe('buildEmpresaSaldo', () => {
    it('conforms to the por_empresa item shape inside saldoDataSchema', () => {
      // saldoDataSchema expects por_empresa to be an array of a specific shape;
      // validate by wrapping in a minimal saldo envelope.
      const saldo = buildCashbackSaldo({
        por_empresa: [buildEmpresaSaldo()],
      });
      expectValid(saldoDataSchema, saldo);
    });

    it('conforms with nullable fields set to null', () => {
      const saldo = buildCashbackSaldo({
        por_empresa: [buildEmpresaSaldo({ nome_fantasia: null, logo_url: null })],
      });
      expectValid(saldoDataSchema, saldo);
    });
  });

  // -----------------------------------------------------------------------
  // Envelope wrappers
  // -----------------------------------------------------------------------
  describe('buildApiResponse', () => {
    it('wraps arbitrary data and conforms to apiResponseSchema', () => {
      const response = buildApiResponse({ foo: 'bar' });
      const schema = apiResponseSchema(
        // Accept any object for this generic test
        z.object({ foo: z.string() }),
      );
      expectValid(schema, response);
    });

    it('uses custom message', () => {
      const response = buildApiResponse(buildCliente(), 'Cliente criado');
      expect(response.message).toBe('Cliente criado');
      expectValid(apiResponseSchema(clienteResourceSchema), response);
    });

    it('has status true and error null', () => {
      const response = buildApiResponse('anything');
      expect(response.status).toBe(true);
      expect(response.error).toBeNull();
    });
  });

  describe('buildCursorPaginated', () => {
    it('wraps items and conforms to cursorPaginatedResponseSchema', () => {
      const paginated = buildCursorPaginated([buildExtratoEntry()]);
      expectValid(cursorPaginatedResponseSchema(extratoEntrySchema), paginated);
    });

    it('defaults to has_more_pages false and null cursors', () => {
      const paginated = buildCursorPaginated([]);
      expect(paginated.data.meta.has_more_pages).toBe(false);
      expect(paginated.data.meta.next_cursor).toBeNull();
      expect(paginated.data.meta.prev_cursor).toBeNull();
    });

    it('applies meta overrides', () => {
      const paginated = buildCursorPaginated(
        [buildNotification()],
        { next_cursor: 'next_abc', has_more_pages: true, per_page: 5 },
      );
      expect(paginated.data.meta.next_cursor).toBe('next_abc');
      expect(paginated.data.meta.has_more_pages).toBe(true);
      expect(paginated.data.meta.per_page).toBe(5);
      expectValid(cursorPaginatedResponseSchema(notificationSchema), paginated);
    });

    it('handles empty items array', () => {
      const paginated = buildCursorPaginated<ReturnType<typeof buildContestacao>>([]);
      expectValid(cursorPaginatedResponseSchema(contestacaoSchema), paginated);
    });
  });

  // -----------------------------------------------------------------------
  // Negative cases – schemas MUST reject invalid shapes
  // -----------------------------------------------------------------------
  describe('negative cases', () => {
    it('rejects contestacao with invalid tipo', () => {
      const contestacao = { ...buildContestacao(), tipo: 'cashback_nao_creditado' };
      const result = contestacaoSchema.safeParse(contestacao);
      expect(result.success).toBe(false);
    });

    it('rejects contestacao with invalid status', () => {
      const contestacao = { ...buildContestacao(), status: 'em_analise' };
      const result = contestacaoSchema.safeParse(contestacao);
      expect(result.success).toBe(false);
    });

    it('rejects notification with invalid tipo', () => {
      const notification = { ...buildNotification(), tipo: 'unknown_type' };
      const result = notificationSchema.safeParse(notification);
      expect(result.success).toBe(false);
    });

    it('rejects API response with string status instead of boolean true', () => {
      const response = { status: 'success', data: {}, error: null, message: '' };
      const result = apiResponseSchema(clienteResourceSchema).safeParse(response);
      expect(result.success).toBe(false);
    });

    it('rejects API response with status false', () => {
      const response = { status: false, data: buildCliente(), error: null, message: 'ok' };
      const result = apiResponseSchema(clienteResourceSchema).safeParse(response);
      expect(result.success).toBe(false);
    });

    it('rejects saldo with missing proximo_a_expirar', () => {
      const { proximo_a_expirar, ...saldoWithout } = buildCashbackSaldo();
      const result = saldoDataSchema.safeParse(saldoWithout);
      expect(result.success).toBe(false);
    });

    it('rejects extrato entry with missing created_at', () => {
      const { created_at, ...entryWithout } = buildExtratoEntry();
      const result = extratoEntrySchema.safeParse(entryWithout);
      expect(result.success).toBe(false);
    });

    it('rejects cliente with missing nome', () => {
      const { nome, ...clienteWithout } = buildCliente();
      const result = clienteResourceSchema.safeParse(clienteWithout);
      expect(result.success).toBe(false);
    });

    it('rejects cursor-paginated response with missing meta', () => {
      const paginated = buildCursorPaginated([buildExtratoEntry()]);
      const broken = { ...paginated, data: { data: paginated.data.data } };
      const result = cursorPaginatedResponseSchema(extratoEntrySchema).safeParse(broken);
      expect(result.success).toBe(false);
    });

    it('rejects cursor-paginated response with non-array data.data', () => {
      const broken = {
        status: true as const,
        data: { data: 'not-an-array', meta: { next_cursor: null, prev_cursor: null, per_page: 15, has_more_pages: false } },
        error: null,
        message: 'ok',
      };
      const result = cursorPaginatedResponseSchema(extratoEntrySchema).safeParse(broken);
      expect(result.success).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Sequence isolation – resetFixtureSequence must reset IDs
  // -----------------------------------------------------------------------
  describe('resetFixtureSequence', () => {
    it('resets IDs between tests', () => {
      const first = buildCliente();
      expect(first.id).toBe(1);

      resetFixtureSequence();

      const second = buildCliente();
      expect(second.id).toBe(1);
    });

    it('produces incrementing IDs within a single test', () => {
      const a = buildCliente();
      const b = buildExtratoEntry();
      const c = buildContestacao();
      expect(a.id).toBe(1);
      expect(b.id).toBe(2);
      expect(c.id).toBe(3);
    });
  });
});

import { z } from "zod";

// ---------------------------------------------------------------------------
// Generic envelope helpers
// ---------------------------------------------------------------------------

/** Wraps any item schema in the standard API success envelope. */
export function apiResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    status: z.literal(true),
    data: dataSchema,
    error: z.null(),
    message: z.string(),
  });
}

/** Wraps any item schema in the offset-paginated API envelope. */
export function paginatedResponseSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    status: z.literal(true),
    data: z.array(itemSchema),
    pagination: z.object({
      current_page: z.number(),
      last_page: z.number(),
      per_page: z.number(),
      total: z.number(),
      next_page_url: z.string().nullable(),
      prev_page_url: z.string().nullable(),
    }),
    error: z.null(),
    message: z.string(),
  });
}

/** Wraps any item schema in the cursor-paginated API envelope. */
export function cursorPaginatedResponseSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    status: z.literal(true),
    data: z.object({
      data: z.array(itemSchema),
      meta: z.object({
        next_cursor: z.string().nullable(),
        prev_cursor: z.string().nullable(),
        per_page: z.number(),
        has_more_pages: z.boolean(),
      }),
    }),
    error: z.null(),
    message: z.string(),
  });
}

// ---------------------------------------------------------------------------
// Domain schemas
// ---------------------------------------------------------------------------

/** ClienteResource returned by the backend. */
export const clienteResourceSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string(),
  cpf: z.string().nullable().optional(),
  telefone: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

/** Login / OAuth response data (inside envelope). */
export const loginResponseDataSchema = z.object({
  token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  cliente: clienteResourceSchema,
});

export const loginResponseSchema = apiResponseSchema(loginResponseDataSchema);

/** Saldo response data (inside envelope). */
export const saldoDataSchema = z.object({
  saldo_total: z.number(),
  por_empresa: z.array(
    z.object({
      empresa_id: z.number(),
      nome_fantasia: z.string().nullable(),
      logo_url: z.string().nullable(),
      saldo: z.number(),
    }),
  ),
  proximo_a_expirar: z.object({
    valor: z.number(),
    quantidade: z.number(),
  }),
});

export const saldoResponseSchema = apiResponseSchema(saldoDataSchema);

/** MobileExtratoResource – a single extrato entry. */
export const extratoEntrySchema = z.object({
  id: z.number(),
  tipo: z.string(),
  valor_compra: z.number(),
  valor_cashback: z.number(),
  status_cashback: z.enum(["pendente", "confirmado", "utilizado", "rejeitado", "expirado", "congelado"]),
  data_expiracao: z.string().nullable(),
  created_at: z.string(),
  empresa: z
    .object({
      id: z.number(),
      nome_fantasia: z.string(),
      logo_url: z.string().nullable(),
    })
    .optional(),
  campanha: z
    .object({
      id: z.number(),
      nome: z.string(),
    })
    .optional(),
});

export const extratoResponseSchema = cursorPaginatedResponseSchema(extratoEntrySchema);

/** Contestacao resource. */
export const contestacaoSchema = z.object({
  id: z.number(),
  empresa_id: z.number(),
  transacao_id: z.number(),
  cliente_id: z.number().nullable(),
  tipo: z.enum(["cashback_nao_gerado", "valor_incorreto", "expiracao_indevida", "venda_cancelada"]),
  descricao: z.string(),
  status: z.enum(["pendente", "aprovada", "rejeitada"]),
  resposta: z.string().nullable(),
  respondido_por: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  // Optional fields populated when backend eager-loads relationships
  empresa_nome: z.string().optional(),
  valor: z.number().optional(),
});

export const contestacaoListResponseSchema = paginatedResponseSchema(contestacaoSchema);

/** MobileNotification resource. */
export const notificationSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  mensagem: z.string(),
  tipo: z.enum([
    "cashback_recebido",
    "cashback_expirado",
    "cashback_utilizado",
    "campanha_nova",
    "contestacao_atualizada",
    "sistema",
  ]),
  lida: z.boolean(),
  dados_extras: z.record(z.unknown()).nullable(),
  created_at: z.string(),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type LoginResponseData = z.infer<typeof loginResponseDataSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type SaldoData = z.infer<typeof saldoDataSchema>;
export type SaldoResponse = z.infer<typeof saldoResponseSchema>;
export type ExtratoEntrySchema = z.infer<typeof extratoEntrySchema>;
export type ExtratoResponse = z.infer<typeof extratoResponseSchema>;
export type ContestacaoSchema = z.infer<typeof contestacaoSchema>;
export type ContestacaoListResponse = z.infer<typeof contestacaoListResponseSchema>;
export type NotificationSchema = z.infer<typeof notificationSchema>;

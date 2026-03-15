/**
 * Schemas comuns de contrato API — Envelope, Paginação, Erros.
 *
 * Estes schemas representam o contrato real do backend Laravel.
 * Divergências conhecidas (audit S3-E1) são tratadas via Zod transforms.
 *
 * @see docs/generated/pipeline/S3-E1-audit-report.md
 */
import { z } from "zod";

// ─── Helpers ─────────────────────────────────────────────────

export const monetarioSchema = z.union([
  z.number(),
  z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().finite()),
]);
export const isoTimestampSchema = z.string().min(1);

// ─── Paginação ───────────────────────────────────────────────

/**
 * PaginationMeta — offset-based (padrão Laravel).
 *
 * [C2/C8] Backend retorna meta+links, apiCall normaliza para este formato.
 */
export const paginationMetaSchema = z.object({
  current_page: z.number(),
  last_page: z.number(),
  per_page: z.number(),
  total: z.number(),
  next_page_url: z.string().nullable(),
  prev_page_url: z.string().nullable(),
});

/**
 * CursorPaginationMeta — cursor-based para mobile.
 *
 * [C4] Mobile usa cursor pagination para extrato e notificações.
 */
export const cursorPaginationMetaSchema = z.object({
  next_cursor: z.string().nullable(),
  prev_cursor: z.string().nullable(),
  per_page: z.number(),
  has_more_pages: z.boolean(),
});

// ─── Erros ───────────────────────────────────────────────────

export const laravelValidationErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.array(z.string())),
});

export const apiErrorDetailSchema = z.object({
  code: z.string(),
  message: z.string(),
  correlation_id: z.string().optional(),
  details: z.record(z.array(z.string())).optional(),
});

export const apiErrorResponseSchema = z.object({
  status: z.literal(false),
  data: z.null(),
  error: apiErrorDetailSchema,
  message: z.string().optional(),
});

// ─── Envelopes de Sucesso ────────────────────────────────────

export function apiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    status: z.literal(true),
    data: dataSchema,
    error: z.null(),
    message: z.string(),
  });
}

export function paginatedResponseSchema<T extends z.ZodTypeAny>(
  itemSchema: T
) {
  return z.object({
    status: z.literal(true),
    data: z.array(itemSchema),
    pagination: paginationMetaSchema,
    error: z.null(),
    message: z.string(),
  });
}

export function cursorPaginatedResponseSchema<T extends z.ZodTypeAny>(
  itemSchema: T
) {
  return z.object({
    status: z.literal(true),
    data: z.object({
      data: z.array(itemSchema),
      meta: cursorPaginationMetaSchema,
    }),
    error: z.null(),
    message: z.string(),
  });
}

// ─── Tipos derivados ─────────────────────────────────────────

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type CursorPaginationMeta = z.infer<typeof cursorPaginationMetaSchema>;
export type LaravelValidationError = z.infer<
  typeof laravelValidationErrorSchema
>;
export type ApiErrorDetail = z.infer<typeof apiErrorDetailSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

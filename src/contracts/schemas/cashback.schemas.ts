/**
 * Contrato API — Domínio CASHBACK / EXTRATO (Mobile)
 *
 * [C4] Extrato pagination: backend Swagger mostra offset, mobile espera cursor.
 *      Schema usa cursor pagination (o que o mobile espera).
 */
import { z } from "zod";
import { isoTimestampSchema } from "./common.schemas";

// ─── Enums ───────────────────────────────────────────────────

export const cashbackStatusEnum = z.enum([
  "pendente",
  "confirmado",
  "utilizado",
  "rejeitado",
  "expirado",
  "congelado",
]);

// ─── Response Schemas ────────────────────────────────────────

/** Saldo de cashback do cliente. */
export const saldoDataSchema = z.object({
  saldo_total: z.number(),
  por_empresa: z.array(
    z.object({
      empresa_id: z.number(),
      nome_fantasia: z.string().nullable(),
      logo_url: z.string().nullable(),
      saldo: z.number(),
    })
  ),
  proximo_a_expirar: z
    .object({
      valor: z.number(),
      quantidade: z.number(),
    })
    .nullable()
    .optional(),
});

/**
 * Entrada individual do extrato.
 *
 * [C4] Extrato usa cursor pagination no mobile.
 */
export const extratoEntrySchema = z.object({
  id: z.number(),
  tipo: z.string(),
  valor_compra: z.number(),
  valor_cashback: z.number(),
  status_cashback: cashbackStatusEnum,
  data_expiracao: z.string().nullable(),
  created_at: isoTimestampSchema,
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

/** QR Code gerado. */
export const qrCodeTokenSchema = z.object({
  qr_token: z.string(),
  cliente_id: z.number(),
  empresa_id: z.number(),
  valor: z.number(),
  expira_em: z.string(),
});

/** Validação de QR Code. */
export const validarQRCodeResponseSchema = z.object({
  valid: z.boolean().optional(),
  cliente: z
    .object({
      id: z.number(),
      nome: z.string(),
    })
    .optional(),
  valor: z.number().optional(),
  saldo_cliente: z.number().optional(),
  expira_em: z.string().optional(),
});

// ─── Request Schemas ─────────────────────────────────────────

export const gerarQRCodeRequestSchema = z.object({
  empresa_id: z.number().positive(),
  valor: z.number().positive(),
});

export const validarQRCodeRequestSchema = z.object({
  qr_token: z.string().min(1),
});

// ─── Tipos derivados ─────────────────────────────────────────

export type CashbackStatus = z.infer<typeof cashbackStatusEnum>;
export type SaldoData = z.infer<typeof saldoDataSchema>;
export type ExtratoEntry = z.infer<typeof extratoEntrySchema>;
export type QRCodeToken = z.infer<typeof qrCodeTokenSchema>;
export type ValidarQRCodeResponse = z.infer<typeof validarQRCodeResponseSchema>;
export type GerarQRCodeRequest = z.infer<typeof gerarQRCodeRequestSchema>;
export type ValidarQRCodeRequest = z.infer<typeof validarQRCodeRequestSchema>;

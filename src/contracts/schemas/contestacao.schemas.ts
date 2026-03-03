/**
 * Contrato API — Domínio CONTESTAÇÕES (Mobile)
 *
 * [A10] Mobile espera empresa_nome/valor extras — campos opcionais no schema.
 */
import { z } from "zod";
import { isoTimestampSchema } from "./common.schemas";

// ─── Enums ───────────────────────────────────────────────────

export const contestacaoTipoEnum = z.enum([
  "cashback_nao_gerado",
  "valor_incorreto",
  "expiracao_indevida",
  "venda_cancelada",
]);

export const contestacaoStatusEnum = z.enum([
  "pendente",
  "aprovada",
  "rejeitada",
]);

// ─── Response Schemas ────────────────────────────────────────

/**
 * [A10] empresa_nome e valor são opcionais — mobile espera mas backend
 *       não garante estes campos extras.
 */
export const contestacaoSchema = z.object({
  id: z.number(),
  empresa_id: z.number(),
  transacao_id: z.number(),
  cliente_id: z.number().nullable(),
  tipo: contestacaoTipoEnum,
  descricao: z.string(),
  status: contestacaoStatusEnum,
  resposta: z.string().nullable().optional(),
  respondido_por: z.number().nullable().optional(),
  created_at: isoTimestampSchema,
  updated_at: isoTimestampSchema,
  empresa_nome: z.string().optional(),
  valor: z.number().optional(),
});

// ─── Request Schemas ─────────────────────────────────────────

export const createContestacaoRequestSchema = z.object({
  transacao_id: z.number().positive(),
  tipo: contestacaoTipoEnum,
  descricao: z.string().min(10).max(500),
});

// ─── Tipos derivados ─────────────────────────────────────────

export type ContestacaoTipo = z.infer<typeof contestacaoTipoEnum>;
export type ContestacaoStatus = z.infer<typeof contestacaoStatusEnum>;
export type Contestacao = z.infer<typeof contestacaoSchema>;
export type CreateContestacaoRequest = z.infer<
  typeof createContestacaoRequestSchema
>;

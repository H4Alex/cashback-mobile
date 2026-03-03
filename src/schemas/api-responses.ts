/**
 * ============================================================
 * Re-export shim — delegates to canonical contracts/schemas.
 *
 * [Consolidation] This file previously held duplicated schema
 * definitions. It now re-exports from src/contracts/schemas/*
 * so that every consumer uses a single source of truth.
 * ============================================================
 */

// ─── Envelope helpers (from contracts/common) ───────────────
export {
  apiResponseSchema,
  paginatedResponseSchema,
  cursorPaginatedResponseSchema,
} from "@/src/contracts/schemas/common.schemas";

// ─── Auth domain ────────────────────────────────────────────
export {
  clienteResourceSchema,
  loginResponseDataSchema,
} from "@/src/contracts/schemas/auth.schemas";

// ─── Cashback domain ────────────────────────────────────────
export {
  saldoDataSchema,
  extratoEntrySchema,
} from "@/src/contracts/schemas/cashback.schemas";

// ─── Contestação domain ─────────────────────────────────────
export { contestacaoSchema } from "@/src/contracts/schemas/contestacao.schemas";

// ─── Notificação domain ─────────────────────────────────────
export { notificationSchema } from "@/src/contracts/schemas/notificacao.schemas";

// ─── Composed response schemas ──────────────────────────────
// These combine domain schemas with envelope helpers, matching
// the names that consumers already import.

import { apiResponseSchema, paginatedResponseSchema, cursorPaginatedResponseSchema } from "@/src/contracts/schemas/common.schemas";
import { loginResponseDataSchema } from "@/src/contracts/schemas/auth.schemas";
import { saldoDataSchema, extratoEntrySchema } from "@/src/contracts/schemas/cashback.schemas";
import { contestacaoSchema } from "@/src/contracts/schemas/contestacao.schemas";

export const loginResponseSchema = apiResponseSchema(loginResponseDataSchema);
export const saldoResponseSchema = apiResponseSchema(saldoDataSchema);
export const extratoResponseSchema = cursorPaginatedResponseSchema(extratoEntrySchema);
export const contestacaoListResponseSchema = paginatedResponseSchema(contestacaoSchema);

// ─── Inferred types ─────────────────────────────────────────
import type { z } from "zod";
import type { notificationSchema as _notifSchema } from "@/src/contracts/schemas/notificacao.schemas";

export type LoginResponseData = z.infer<typeof loginResponseDataSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type SaldoData = z.infer<typeof saldoDataSchema>;
export type SaldoResponse = z.infer<typeof saldoResponseSchema>;
export type ExtratoEntrySchema = z.infer<typeof extratoEntrySchema>;
export type ExtratoResponse = z.infer<typeof extratoResponseSchema>;
export type ContestacaoSchema = z.infer<typeof contestacaoSchema>;
export type ContestacaoListResponse = z.infer<typeof contestacaoListResponseSchema>;
export type NotificationSchema = z.infer<typeof _notifSchema>;

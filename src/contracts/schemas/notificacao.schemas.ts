/**
 * Contrato API — Domínio NOTIFICAÇÕES (Mobile)
 *
 * [A11] Cursor pagination para notifications não documentada no Swagger.
 * [I38] Schema detalhado do mobile — Swagger incompleto.
 */
import { z } from "zod";
import { isoTimestampSchema } from "./common.schemas";

// ─── Response Schemas ────────────────────────────────────────

export const notificationSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  mensagem: z.string(),
  tipo: z.string(),
  lida: z.boolean(),
  dados_extras: z.record(z.string(), z.unknown()).nullable().optional(),
  created_at: isoTimestampSchema,
});

// ─── Request Schemas ─────────────────────────────────────────

export const notificationPreferencesSchema = z.object({
  push_enabled: z.boolean(),
  email_enabled: z.boolean(),
  marketing_enabled: z.boolean(),
});

// ─── Tipos derivados ─────────────────────────────────────────

export type MobileNotification = z.infer<typeof notificationSchema>;
export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>;

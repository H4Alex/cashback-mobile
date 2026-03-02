import type { z } from "zod";
import type { saldoDataSchema, extratoEntrySchema } from "@/src/schemas/api-responses";
import type { gerarQRCodeSchema, validarQRCodeSchema } from "@/src/schemas/cashback";

// ---------------------------------------------------------------------------
// Derived from Zod schemas (single source of truth)
// ---------------------------------------------------------------------------

export type CashbackSaldo = z.infer<typeof saldoDataSchema>;
export type ExtratoEntry = z.infer<typeof extratoEntrySchema>;
export type GerarQRCodeRequest = z.infer<typeof gerarQRCodeSchema>;
export type ValidarQRCodeRequest = z.infer<typeof validarQRCodeSchema>;

// ---------------------------------------------------------------------------
// Manual types (no corresponding Zod schema)
// ---------------------------------------------------------------------------

export type CashbackStatus = "pendente" | "confirmado" | "utilizado" | "rejeitado" | "expirado" | "congelado";

export interface CashbackEntry {
  id: number;
  valor: number;
  status: CashbackStatus;
  empresa_nome: string;
  empresa_id: number;
  created_at: string;
  expires_at?: string;
  descricao?: string;
}

export interface EmpresaLoja {
  id: number;
  nome_fantasia: string;
  logo_url: string | null;
  cidade: string | null;
  estado: string | null;
}

export interface EmpresaSaldo {
  empresa_id: number;
  nome_fantasia: string | null;
  logo_url: string | null;
  saldo: number;
}

export interface QRCodeToken {
  qr_token: string;
  cliente_id: number;
  empresa_id: number;
  valor: number;
  expira_em: string;
}

export interface ValidarQRCodeResponse {
  valid?: boolean;
  cliente: { id: number; nome: string; cpf: string };
  valor: number;
  saldo_cliente: number;
  expira_em: string;
}

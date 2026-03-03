/**
 * Contrato API — Domínio MERCHANT (Mobile — modo lojista)
 *
 * [A6] validade_padrao vs validade_dias: mobile usa validade_dias na UI
 *      mas o backend FormRequest espera validade_padrao.
 *      Schema do request usa validade_padrao (match backend).
 * [C3] Status campanha: encerrada vs finalizada — schema aceita ambos.
 */
import { z } from "zod";
import { isoTimestampSchema } from "./common.schemas";

// ─── Enums ───────────────────────────────────────────────────

export const perfilMerchantEnum = z.enum([
  "proprietario",
  "gestor",
  "operador",
  "vendedor",
]);

/**
 * [C3] Status de campanha — aceita encerrada e finalizada.
 */
export const campanhaStatusEnum = z.enum([
  "ativa",
  "inativa",
  "finalizada",
  "encerrada",
]);

// ─── Response Schemas ────────────────────────────────────────

export const empresaMerchantSchema = z.object({
  id: z.number(),
  nome_fantasia: z.string(),
  cnpj: z.string(),
  logo_url: z.string().nullable().optional(),
  perfil: perfilMerchantEnum,
});

export const campanhaMerchantSchema = z.object({
  id: z.number(),
  nome: z.string(),
  percentual: z.number(),
  status: campanhaStatusEnum,
  validade_padrao: z.number(),
});

export const clienteSearchResultSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string(),
  cpf: z.string(),
});

export const clienteSaldoSchema = z.object({
  cliente: z.object({
    id: z.number(),
    nome: z.string(),
  }),
  saldo: z.number(),
  max_utilizacao_percentual: z.number().optional(),
});

export const gerarCashbackResponseSchema = z.object({
  id: z.number(),
  valor_compra: z.number(),
  percentual: z.number(),
  cashback_gerado: z.number(),
  validade_dias: z.number(),
  cliente_nome: z.string(),
});

export const utilizarCashbackResponseSchema = z.object({
  id: z.number(),
  cashback_usado: z.number(),
  valor_dinheiro: z.number(),
  novo_saldo: z.number(),
  cliente_nome: z.string(),
});

export const switchEmpresaResponseSchema = z.object({
  token: z.string(),
  token_type: z.literal("bearer"),
  expires_in: z.number(),
  empresa: empresaMerchantSchema,
});

/** Dashboard stats do lojista. */
export const merchantDashboardStatsSchema = z.object({
  total_vendas: z.number(),
  total_cashback_gerado: z.number(),
  total_cashback_utilizado: z.number(),
  total_clientes: z.number(),
  ticket_medio: z.number(),
});

// ─── Request Schemas ─────────────────────────────────────────

/** POST /api/v1/cashback — GerarCashbackRequest (merchant). */
export const gerarCashbackMerchantRequestSchema = z.object({
  cpf: z.string().length(11),
  valor_compra: z.number().positive(),
  campanha_id: z.number().positive().optional(),
  unidade_negocio_id: z.number().positive().optional(),
});

/** POST /api/v1/cashback/utilizar — UtilizarCashbackRequest. */
export const utilizarCashbackRequestSchema = z.object({
  cpf: z.string().length(11),
  valor: z.number().positive(),
  unidade_negocio_id: z.number().positive().optional(),
});

/**
 * POST /api/v1/campanhas — CriarCampanhaRequest.
 *
 * [A6] Backend espera validade_padrao (não validade_dias).
 *      Schema usa validade_padrao (match FormRequest).
 */
export const criarCampanhaMerchantRequestSchema = z.object({
  nome: z.string().min(1),
  data_inicio: z.string().min(1),
  data_fim: z.string().min(1),
  percentual: z.number().min(0.01).max(100),
  validade_padrao: z.number().int().positive(),
});

// ─── Tipos derivados ─────────────────────────────────────────

export type PerfilMerchant = z.infer<typeof perfilMerchantEnum>;
export type CampanhaStatusMerchant = z.infer<typeof campanhaStatusEnum>;
export type EmpresaMerchant = z.infer<typeof empresaMerchantSchema>;
export type CampanhaMerchant = z.infer<typeof campanhaMerchantSchema>;
export type ClienteSearchResult = z.infer<typeof clienteSearchResultSchema>;
export type ClienteSaldo = z.infer<typeof clienteSaldoSchema>;
export type GerarCashbackResponse = z.infer<typeof gerarCashbackResponseSchema>;
export type UtilizarCashbackResponse = z.infer<typeof utilizarCashbackResponseSchema>;
export type SwitchEmpresaResponse = z.infer<typeof switchEmpresaResponseSchema>;
export type MerchantDashboardStats = z.infer<typeof merchantDashboardStatsSchema>;
export type GerarCashbackMerchantRequest = z.infer<typeof gerarCashbackMerchantRequestSchema>;
export type UtilizarCashbackRequest = z.infer<typeof utilizarCashbackRequestSchema>;
export type CriarCampanhaMerchantRequest = z.infer<typeof criarCampanhaMerchantRequestSchema>;

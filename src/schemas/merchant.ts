import { z } from "zod";

export const gerarCashbackMerchantSchema = z.object({
  cpf: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF inválido")
    .transform((v) => v.replace(/\D/g, "")),
  valor: z.number().positive("Valor deve ser positivo"),
  campanha_id: z.number().int().optional(),
});
export type GerarCashbackMerchantFormData = z.infer<typeof gerarCashbackMerchantSchema>;

export const utilizarCashbackSchema = z.object({
  cpf: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF inválido")
    .transform((v) => v.replace(/\D/g, "")),
  valor: z.number().positive("Valor deve ser positivo"),
});
export type UtilizarCashbackFormData = z.infer<typeof utilizarCashbackSchema>;

import { z } from "zod";

function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  for (let t = 9; t < 11; t++) {
    let sum = 0;
    for (let i = 0; i < t; i++) sum += parseInt(digits[i]) * (t + 1 - i);
    const remainder = (sum * 10) % 11;
    if ((remainder === 10 ? 0 : remainder) !== parseInt(digits[t])) return false;
  }
  return true;
}

const cpfField = z
  .string()
  .min(11, "CPF deve ter 11 dígitos")
  .max(14, "CPF inválido")
  .transform((v) => v.replace(/\D/g, ""))
  .refine(isValidCPF, "CPF inválido (dígito verificador incorreto)");

export const gerarCashbackMerchantSchema = z.object({
  cpf: cpfField,
  valor: z.number().positive("Valor deve ser positivo"),
  campanha_id: z.number().int().optional(),
});
export type GerarCashbackMerchantFormData = z.infer<typeof gerarCashbackMerchantSchema>;

export const utilizarCashbackSchema = z.object({
  cpf: cpfField,
  valor: z.number().positive("Valor deve ser positivo"),
});
export type UtilizarCashbackFormData = z.infer<typeof utilizarCashbackSchema>;

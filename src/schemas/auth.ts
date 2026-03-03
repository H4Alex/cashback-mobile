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

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const registerSchema = z
  .object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    cpf: z.string().length(11, "CPF deve ter 11 dígitos").refine(isValidCPF, "CPF inválido"),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    senha_confirmation: z.string(),
  })
  .refine((data) => data.senha === data.senha_confirmation, {
    message: "Senhas não conferem",
    path: ["senha_confirmation"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
  token: z.string().min(1, "Código é obrigatório"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const updateProfileSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  email: z.string().email("E-mail inválido").optional(),
  telefone: z.string().min(10, "Telefone inválido").optional(),
});

export const changePasswordSchema = z
  .object({
    senha_atual: z.string().min(1, "Senha atual é obrigatória"),
    nova_senha: z.string().min(6, "Nova senha deve ter no mínimo 6 caracteres"),
    nova_senha_confirmation: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.nova_senha === data.nova_senha_confirmation, {
    message: "As senhas não conferem",
    path: ["nova_senha_confirmation"],
  });

export const deleteAccountSchema = z.object({
  senha: z.string().min(1, "Senha é obrigatória"),
  motivo: z.string().optional(),
});

export const oauthSchema = z.object({
  provider: z.enum(["google", "apple"]),
  token: z.string().min(1, "Token é obrigatório"),
  nonce: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
export type OAuthFormData = z.infer<typeof oauthSchema>;

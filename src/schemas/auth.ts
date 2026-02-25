import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    cpf: z
      .string()
      .regex(/^\d{11}$/, 'CPF deve conter 11 dígitos numéricos'),
    telefone: z.string().optional(),
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    senha_confirmation: z.string(),
  })
  .refine((data) => data.senha === data.senha_confirmation, {
    message: 'Senhas não conferem',
    path: ['senha_confirmation'],
  });
export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
  token: z.string().min(1, 'Token obrigatório'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
  telefone: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
});
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  senha_atual: z.string().min(1, 'Senha atual obrigatória'),
  nova_senha: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
});
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const deleteAccountSchema = z.object({
  senha: z.string().min(1, 'Senha obrigatória para confirmar exclusão'),
  motivo: z.string().optional(),
});
export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

export const oauthSchema = z.object({
  provider: z.enum(['google', 'apple']),
  id_token: z.string().min(1, 'Token obrigatório'),
  nonce: z.string().optional(),
});
export type OAuthFormData = z.infer<typeof oauthSchema>;

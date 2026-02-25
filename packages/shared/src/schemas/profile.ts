import { z } from 'zod'

const profileBaseSchema = z.object({
  senhaAtual: z.string().min(1, 'Informe a senha atual'),
  novaSenha: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'Deve conter ao menos uma letra minúscula')
    .regex(/\d/, 'Deve conter ao menos um número'),
  confirmaSenha: z.string().min(1, 'Confirme a nova senha'),
})

export const profileSchema = profileBaseSchema.refine((d) => d.novaSenha === d.confirmaSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmaSenha'],
})

export type ProfileFormData = z.infer<typeof profileSchema>

/** Schema used when no password change is needed — all fields optional, accepts empty strings */
export const profileSchemaOptional = z.object({
  senhaAtual: z.string().optional().or(z.literal('')),
  novaSenha: z.string().optional().or(z.literal('')),
  confirmaSenha: z.string().optional().or(z.literal('')),
})
export type ProfileFormDataOptional = z.infer<typeof profileSchemaOptional>

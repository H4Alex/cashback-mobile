import { z } from 'zod'
import i18n from '../i18n/i18n'

const t = (key: string) => i18n.t(key)

export const userSchema = z.object({
  nome: z
    .string()
    .min(1, { error: () => t('errors.nameRequired') })
    .max(120, { error: () => t('errors.nameTooLong') }),
  email: z
    .string()
    .min(1, { error: () => t('errors.emailRequired') })
    .email({ error: () => t('errors.emailInvalid') }),
  perfil: z.string().min(1, { error: () => t('errors.perfilRequired') }),
})

export type UserFormData = z.infer<typeof userSchema>

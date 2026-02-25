import { z } from 'zod'
import i18n from '../i18n/i18n'
import { isValidCnpj } from '../utils/validation'

const t = (key: string) => i18n.t(key)

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { error: () => t('errors.emailRequired') })
    .email({ error: () => t('errors.emailInvalid') }),
  password: z
    .string()
    .min(1, { error: () => t('errors.passwordRequired') })
    .min(8, { error: () => t('errors.passwordMinLength') }),
  remember: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    nome: z
      .string()
      .min(1, { error: () => t('errors.nameRequired') })
      .max(120, { error: () => t('errors.nameTooLong') }),
    email: z
      .string()
      .min(1, { error: () => t('errors.emailRequired') })
      .email({ error: () => t('errors.emailInvalid') }),
    telefone: z
      .string()
      .min(1, { error: () => t('errors.phoneRequired') })
      .superRefine((val, ctx) => {
        const digits = val.replace(/\D/g, '')
        if (!(digits.length >= 10 && digits.length <= 11)) {
          ctx.addIssue({ code: 'custom', message: t('errors.phoneInvalid') })
        }
      }),
    cnpj: z
      .string()
      .min(1, { error: () => t('errors.cnpjRequired') })
      .superRefine((val, ctx) => {
        if (!isValidCnpj(val)) {
          ctx.addIssue({ code: 'custom', message: t('errors.cnpjInvalid') })
        }
      }),
    nomeLoja: z
      .string()
      .min(1, { error: () => t('errors.storeNameRequired') })
      .max(120, { error: () => t('errors.nameTooLong') }),
    senha: z
      .string()
      .min(1, { error: () => t('errors.passwordRequired') })
      .min(8, { error: () => t('errors.passwordMinLength') })
      .regex(/[A-Z]/, { error: () => t('errors.passwordUppercase') })
      .regex(/[a-z]/, { error: () => t('errors.passwordLowercase') })
      .regex(/\d/, { error: () => t('errors.passwordNumber') }),
    confirmarSenha: z.string().min(1, { error: () => t('errors.passwordRequired') }),
    aceitoTermos: z.boolean().superRefine((val, ctx) => {
      if (!val) ctx.addIssue({ code: 'custom', message: t('errors.termsRequired') })
    }),
  })
  .superRefine((data, ctx) => {
    if (data.senha !== data.confirmarSenha) {
      ctx.addIssue({ code: 'custom', message: t('errors.passwordMismatch'), path: ['confirmarSenha'] })
    }
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export const emailStepSchema = z.object({
  email: z
    .string()
    .min(1, { error: () => t('errors.emailRequired') })
    .email({ error: () => t('errors.emailInvalid') }),
})

export const codeStepSchema = z.object({
  codigo: z
    .string()
    .min(1, { error: () => t('errors.codeRequired') })
    .length(6, { error: () => t('errors.codeLength') })
    .regex(/^\d+$/, { error: () => t('errors.codeDigitsOnly') }),
})

export const newPasswordStepSchema = z
  .object({
    novaSenha: z
      .string()
      .min(8, { error: () => t('errors.passwordMinLength') })
      .regex(/[A-Z]/, { error: () => t('errors.passwordUppercase') })
      .regex(/[a-z]/, { error: () => t('errors.passwordLowercase') })
      .regex(/\d/, { error: () => t('errors.passwordNumber') }),
    confirmarSenha: z.string().min(1, { error: () => t('errors.passwordRequired') }),
  })
  .superRefine((data, ctx) => {
    if (data.novaSenha !== data.confirmarSenha) {
      ctx.addIssue({ code: 'custom', message: t('errors.passwordMismatch'), path: ['confirmarSenha'] })
    }
  })

export type EmailStepData = z.infer<typeof emailStepSchema>
export type CodeStepData = z.infer<typeof codeStepSchema>
export type NewPasswordStepData = z.infer<typeof newPasswordStepSchema>

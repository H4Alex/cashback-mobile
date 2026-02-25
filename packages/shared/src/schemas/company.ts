import { z } from 'zod'
import i18n from '../i18n/i18n'
import { isValidCnpj } from '../utils/validation'

const t = (key: string) => i18n.t(key)

export const companyDataSchema = z.object({
  nomeLoja: z
    .string()
    .min(1, { error: () => t('errors.storeNameRequired') })
    .max(120, { error: () => t('errors.nameTooLong') }),
  telefone: z
    .string()
    .min(1, { error: () => t('errors.phoneRequired') })
    .superRefine((val, ctx) => {
      const digits = val.replace(/\D/g, '')
      if (!(digits.length >= 10 && digits.length <= 11)) {
        ctx.addIssue({ code: 'custom', message: t('errors.phoneInvalid') })
      }
    }),
  emailLoja: z
    .string()
    .min(1, { error: () => t('errors.emailRequired') })
    .email({ error: () => t('errors.emailInvalid') }),
  cnpj: z
    .string()
    .min(1, { error: () => t('errors.cnpjRequired') })
    .superRefine((val, ctx) => {
      if (!isValidCnpj(val)) {
        ctx.addIssue({ code: 'custom', message: t('errors.cnpjInvalid') })
      }
    }),
  razaoSocial: z
    .string()
    .max(200, { error: () => t('errors.nameTooLong') })
    .optional()
    .or(z.literal('')),
  cep: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val) return true
        return val.replace(/\D/g, '').length === 8
      },
      { message: 'CEP inválido' }
    ),
  rua: z.string().max(200).optional().or(z.literal('')),
  numero: z.string().max(20).optional().or(z.literal('')),
  complemento: z.string().max(100).optional().or(z.literal('')),
  bairro: z.string().max(100).optional().or(z.literal('')),
  cidade: z.string().max(100).optional().or(z.literal('')),
  estado: z.string().max(2).optional().or(z.literal('')),
})

export type CompanyFormData = z.infer<typeof companyDataSchema>

export const cashbackPolicySchema = z.object({
  cbPercentualPadrao: z
    .number()
    .min(0, { error: () => t('errors.policyPercentMin') })
    .max(100, { error: () => t('errors.policyPercentMax') }),
  cbPercentualMaxUtilizacao: z
    .number()
    .min(1, { error: () => t('errors.policyMaxUtilMin') })
    .max(100, { error: () => t('errors.policyPercentMax') }),
  cbValidadePadrao: z.number().min(1, { error: () => t('errors.policyValidityMin') }),
})

export type CashbackPolicyFormData = z.infer<typeof cashbackPolicySchema>

export const securitySchema = z.object({
  mfaEnabled: z.boolean(),
  sessionTimeout: z
    .number()
    .min(5, { error: () => t('errors.sessionTimeoutMin') })
    .max(480, { error: () => t('errors.sessionTimeoutMax') }),
})

export type SecurityFormData = z.infer<typeof securitySchema>

export const apiConfigSchema = z.object({
  apiKey: z.string(),
  webhookUrl: z
    .string()
    .optional()
    .or(z.literal(''))
    .superRefine((val, ctx) => {
      if (!val) return
      try {
        const parsed = new URL(val)
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          ctx.addIssue({ code: 'custom', message: t('errors.urlInvalid') })
        }
      } catch {
        ctx.addIssue({ code: 'custom', message: t('errors.urlInvalid') })
      }
    }),
})

export type ApiConfigFormData = z.infer<typeof apiConfigSchema>

export const notificacoesSchema = z.object({
  emailNotif: z.boolean(),
  smsNotif: z.boolean(),
  pushNotif: z.boolean(),
})

export type NotificacoesFormData = z.infer<typeof notificacoesSchema>

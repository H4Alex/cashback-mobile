import { z } from 'zod'
import i18n from '../i18n/i18n'
import { isValidCpf } from '../utils/validation'

const t = (key: string) => i18n.t(key)

export const gerarCashbackSchema = z.object({
  valorVenda: z
    .string()
    .min(1, { error: () => t('errors.saleValueRequired') })
    .superRefine((val, ctx) => {
      const num = Number(val)
      if (!(num > 0 && isFinite(num))) {
        ctx.addIssue({ code: 'custom', message: t('errors.saleValuePositive') })
      }
    }),
  dataVenda: z.string().min(1, { error: () => t('errors.saleDateRequired') }),
  campanhaId: z.string().optional(),
})

export type GerarCashbackFormData = z.infer<typeof gerarCashbackSchema>

export const cpfSearchSchema = z.object({
  cpf: z
    .string()
    .min(1, { error: () => t('errors.required') })
    .superRefine((val, ctx) => {
      const digits = val.replace(/\D/g, '')
      if (digits.length !== 11) {
        ctx.addIssue({ code: 'custom', message: t('errors.cpfLength') })
        return
      }
      if (!isValidCpf(digits)) {
        ctx.addIssue({ code: 'custom', message: t('errors.cpfInvalid') })
      }
    }),
})

export type CpfSearchFormData = z.infer<typeof cpfSearchSchema>

export const customerSearchSchema = z.object({
  cpf: z.string(),
  nome: z.string(),
  email: z.string(),
  telefone: z.string().superRefine((val, ctx) => {
    const digits = val.replace(/\D/g, '')
    if (!(digits.length === 0 || (digits.length >= 10 && digits.length <= 11))) {
      ctx.addIssue({ code: 'custom', message: t('errors.phoneInvalid') })
    }
  }),
})

export type CustomerSearchFormData = z.infer<typeof customerSearchSchema>

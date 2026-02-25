import { z } from 'zod'
import i18n from '../i18n/i18n'

const t = (key: string) => i18n.t(key)

export const campaignSchema = z
  .object({
    nome: z
      .string()
      .min(1, { error: () => t('errors.campaignNameRequired') })
      .max(120, { error: () => t('errors.nameTooLong') }),
    dataInicio: z.string().min(1, { error: () => t('errors.startDateRequired') }),
    dataFim: z.string().min(1, { error: () => t('errors.endDateRequired') }),
    percentual: z
      .string()
      .min(1, { error: () => t('errors.percentRequired') })
      .superRefine((val, ctx) => {
        const num = parseFloat(val)
        if (!(num > 0 && num <= 100)) {
          ctx.addIssue({ code: 'custom', message: t('errors.percentRange') })
        }
      }),
    validadePadrao: z
      .string()
      .min(1, { error: () => t('errors.validityRequired') })
      .superRefine((val, ctx) => {
        if (parseInt(val) < 1) {
          ctx.addIssue({ code: 'custom', message: t('errors.validityMin') })
        }
      }),
  })
  .superRefine((data, ctx) => {
    if (data.dataInicio && data.dataFim && new Date(data.dataInicio) > new Date(data.dataFim)) {
      ctx.addIssue({ code: 'custom', message: t('errors.endDateAfterStart'), path: ['dataFim'] })
    }
  })

export type CampaignFormData = z.infer<typeof campaignSchema>

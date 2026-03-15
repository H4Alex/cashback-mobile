import { z } from "zod";

export const createContestacaoSchema = z.object({
  transacao_id: z.number({ error: "Selecione uma transação" }),
  tipo: z.enum(
    ["cashback_nao_gerado", "valor_incorreto", "expiracao_indevida", "venda_cancelada"],
    {
      error: "Selecione o tipo da contestação",
    },
  ),
  descricao: z
    .string()
    .min(10, "Descreva o problema com pelo menos 10 caracteres")
    .max(500, "Máximo de 500 caracteres"),
});

export type CreateContestacaoFormData = z.infer<typeof createContestacaoSchema>;

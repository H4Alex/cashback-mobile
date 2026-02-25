import { z } from "zod";

export const createContestacaoSchema = z.object({
  cashback_entry_id: z.string().min(1, "Selecione uma transação"),
  tipo: z.enum(["valor_incorreto", "cashback_nao_creditado", "empresa_errada", "outro"], {
    required_error: "Selecione o tipo da contestação",
  }),
  descricao: z
    .string()
    .min(10, "Descreva o problema com pelo menos 10 caracteres")
    .max(500, "Máximo de 500 caracteres"),
});

export type CreateContestacaoFormData = z.infer<typeof createContestacaoSchema>;

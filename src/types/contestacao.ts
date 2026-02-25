export type ContestacaoStatus = "pendente" | "em_analise" | "aprovada" | "rejeitada";

export type ContestacaoTipo =
  | "valor_incorreto"
  | "cashback_nao_creditado"
  | "empresa_errada"
  | "outro";

export interface Contestacao {
  id: string;
  tipo: ContestacaoTipo;
  descricao: string;
  status: ContestacaoStatus;
  cashback_entry_id: string;
  empresa_nome: string;
  valor: number;
  created_at: string;
  updated_at: string;
  resposta?: string;
}

export interface ContestacaoListResponse {
  contestacoes: Contestacao[];
  meta: {
    next_cursor: string | null;
    has_more: boolean;
  };
}

export interface CreateContestacaoRequest {
  cashback_entry_id: string;
  tipo: ContestacaoTipo;
  descricao: string;
}

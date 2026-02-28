export type ContestacaoStatus = "pendente" | "aprovada" | "rejeitada";

export type ContestacaoTipo =
  | "cashback_nao_gerado"
  | "valor_incorreto"
  | "expiracao_indevida"
  | "venda_cancelada";

export interface Contestacao {
  id: number;
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
  status: true;
  data: {
    data: Contestacao[];
    meta: {
      next_cursor: string | null;
      prev_cursor: string | null;
      per_page: number;
      has_more_pages: boolean;
    };
  };
  error: null;
  message: string;
}

export interface CreateContestacaoRequest {
  cashback_entry_id: string;
  tipo: ContestacaoTipo;
  descricao: string;
}

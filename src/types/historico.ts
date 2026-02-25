export interface HistoricoUso {
  id: string;
  empresa_nome: string;
  empresa_id: string;
  valor_original: number;
  cashback_usado: number;
  created_at: string;
  descricao?: string;
}

export interface HistoricoUsoResponse {
  historico: HistoricoUso[];
  meta: {
    next_cursor: string | null;
    has_more: boolean;
  };
}

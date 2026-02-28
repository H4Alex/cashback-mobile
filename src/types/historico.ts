export interface HistoricoUso {
  id: number;
  empresa_nome: string;
  empresa_id: number;
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

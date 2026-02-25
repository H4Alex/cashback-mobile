export type CashbackStatus =
  | "creditado"
  | "pendente"
  | "resgatado"
  | "expirado"
  | "processando";

export interface CashbackEntry {
  id: string;
  valor: number;
  status: CashbackStatus;
  empresa_nome: string;
  empresa_id: string;
  created_at: string;
  expires_at?: string;
  descricao?: string;
}

export interface CashbackSaldo {
  total: number;
  disponivel: number;
  pendente: number;
  empresas: EmpresaSaldo[];
}

export interface EmpresaSaldo {
  empresa_id: string;
  empresa_nome: string;
  saldo: number;
  logo_url?: string;
}

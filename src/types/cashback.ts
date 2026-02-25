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

export interface QRCodeToken {
  qr_token: string;
  cliente_id: number;
  empresa_id: number;
  valor: number;
  expira_em: string;
}

export interface GerarQRCodeRequest {
  empresa_id: number;
  valor: number;
}

export interface ValidarQRCodeRequest {
  qr_token: string;
}

export interface ValidarQRCodeResponse {
  valid?: boolean;
  cliente: { id: number; nome: string };
  valor: number;
  saldo: number;
  expira_em: string;
}

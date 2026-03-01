export type CashbackStatus = "pendente" | "confirmado" | "utilizado" | "rejeitado" | "expirado" | "congelado";

export interface CashbackEntry {
  id: number;
  valor: number;
  status: CashbackStatus;
  empresa_nome: string;
  empresa_id: number;
  created_at: string;
  expires_at?: string;
  descricao?: string;
}

export interface CashbackSaldo {
  saldo_total: number;
  por_empresa: {
    empresa_id: number;
    nome_fantasia: string | null;
    logo_url: string | null;
    saldo: string;
  }[];
  proximo_a_expirar: {
    valor: number;
    quantidade: number;
  };
}

export interface ExtratoEntry {
  id: number;
  tipo: string;
  valor_compra: number;
  valor_cashback: number;
  status_cashback: string;
  data_expiracao: string | null;
  created_at: string;
  empresa?: {
    id: number;
    nome_fantasia: string;
    logo_url: string | null;
  };
  campanha?: {
    id: number;
    nome: string;
  };
}

export interface EmpresaLoja {
  id: number;
  nome_fantasia: string;
  logo_url: string | null;
  cidade: string | null;
  estado: string | null;
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
  saldo_cliente: number;
  expira_em: string;
}

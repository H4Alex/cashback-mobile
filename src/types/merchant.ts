export interface Empresa {
  id: number;
  nome_fantasia: string;
  cnpj: string;
  logo_url?: string;
  perfil: "proprietario" | "gestor" | "operador" | "vendedor";
}

export interface Campanha {
  id: number;
  nome: string;
  percentual: number;
  status: "ativa" | "inativa" | "expirada";
  validade_dias: number;
}

export interface ClienteSearchResult {
  id: number;
  nome: string;
  email: string;
  cpf: string;
}

export interface ClienteSaldo {
  cliente: ClienteSearchResult;
  saldo: number;
  max_utilizacao_percentual: number;
}

export interface GerarCashbackRequest {
  cliente_id: number;
  valor: number;
  campanha_id?: number;
}

export interface GerarCashbackResponse {
  id: string;
  valor_compra: number;
  percentual: number;
  cashback_gerado: number;
  validade_dias: number;
  cliente_nome: string;
}

export interface UtilizarCashbackRequest {
  cliente_id: number;
  valor: number;
}

export interface UtilizarCashbackResponse {
  id: string;
  cashback_usado: number;
  valor_dinheiro: number;
  novo_saldo: number;
  cliente_nome: string;
}

export interface SwitchEmpresaResponse {
  token: string;
  token_type: string;
  expires_in: number;
  empresa: Empresa;
}

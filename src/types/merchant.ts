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
  status: "ativa" | "inativa" | "encerrada";
  validade_padrao: number;
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

// --- Sprint 7: Merchant Management Types ---

export interface DashboardStats {
  total_cashback: number;
  total_creditado: number;
  total_resgatado: number;
  variacao_cashback: number;
  variacao_creditado: number;
  variacao_resgatado: number;
}

export interface DashboardTransacao {
  id: string;
  cliente_nome: string;
  valor: number;
  tipo: "gerado" | "utilizado" | "cancelado";
  created_at: string;
}

export interface DashboardTopCliente {
  id: number;
  nome: string;
  saldo_total: number;
}

export interface ChartDataPoint {
  data: string;
  gerado: number;
  utilizado: number;
}

export interface CampanhaFull extends Campanha {
  data_inicio: string;
  data_fim: string;
  transacoes_count: number;
}

export interface CreateCampanhaRequest {
  nome: string;
  percentual: number;
  validade_dias: number;
  data_inicio: string;
  data_fim: string;
}

export interface ClienteDetail {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  created_at: string;
  saldo: number;
  cashbacks_ativos: number;
}

export interface VendaResource {
  id: string;
  cliente_nome: string;
  valor_compra: number;
  valor_cashback: number;
  status: "confirmado" | "pendente" | "cancelado";
  created_at: string;
}

export interface ContestacaoMerchant {
  id: number;
  tipo: string;
  status: "pendente" | "aprovada" | "rejeitada";
  descricao: string;
  cliente_nome: string;
  created_at: string;
  resposta?: string;
}

export interface EmpresaConfig {
  nome_fantasia: string;
  cnpj: string;
  telefone: string;
  email: string;
  logo_url?: string;
  percentual_cashback: number;
  validade_cashback: number;
  max_utilizacao: number;
  plano: string;
  plano_status: string;
  proxima_cobranca?: string;
}

export interface RelatorioData {
  cashback_gerado: number;
  cashback_utilizado: number;
  cashback_expirado: number;
  clientes_ativos: number;
  ticket_medio: number;
}

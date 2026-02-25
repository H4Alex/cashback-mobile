/** QR Code token for cashback redemption */
export interface QRCodeToken {
  qr_token: string;
  cliente_id: number;
  empresa_id: number;
  valor: number;
  expira_em: string; // ISO 8601
}

/** QR code generation request */
export interface GerarQRCodeRequest {
  empresa_id: number;
  valor: number;
}

/** QR code validation request (merchant side) */
export interface ValidarQRCodeRequest {
  qr_token: string;
}

/** QR code validation response */
export interface ValidarQRCodeResponse {
  cliente: {
    id: number;
    nome: string;
  };
  valor: number;
  saldo: number;
  expira_em: string;
}

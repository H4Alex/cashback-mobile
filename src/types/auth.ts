export type OAuthProvider = "google" | "apple";

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  token_type: string;
  expires_in: number;
  cliente: ClienteResource;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  senha_confirmation: string;
}

export interface ClienteResource {
  id: number;
  nome: string;
  email: string;
  cpf?: string | null;
  telefone?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface TokenPair {
  token: string;
  token_type: string;
  expires_in: number;
}

export interface OAuthRequest {
  provider: OAuthProvider;
  id_token: string;
  nonce?: string;
}

export interface OAuthResponse {
  token: string;
  token_type: string;
  expires_in: number;
  cliente: ClienteResource;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  senha: string;
}

export interface UpdateProfileRequest {
  nome?: string;
  email?: string;
  telefone?: string;
}

export interface ChangePasswordRequest {
  senha_atual: string;
  nova_senha: string;
}

export interface DeleteAccountRequest {
  senha: string;
  motivo?: string;
}

export interface BiometricEnrollRequest {
  biometric_token: string;
  device_id: string;
}

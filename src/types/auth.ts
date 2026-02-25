/** Cliente (consumer) resource returned by the API */
export interface ClienteResource {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/** JWT token pair */
export interface TokenPair {
  token: string;
  token_type: 'bearer';
  expires_in: number;
}

/** Login request */
export interface LoginRequest {
  email: string;
  senha: string;
}

/** Login response */
export interface LoginResponse extends TokenPair {
  cliente: ClienteResource;
}

/** Register request */
export interface RegisterRequest {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  senha: string;
  senha_confirmation: string;
}

/** OAuth provider type */
export type OAuthProvider = 'google' | 'apple';

/** OAuth request */
export interface OAuthRequest {
  provider: OAuthProvider;
  id_token: string;
  nonce?: string;
}

/** OAuth response (same as login) */
export type OAuthResponse = LoginResponse;

/** Forgot password request */
export interface ForgotPasswordRequest {
  email: string;
}

/** Reset password request */
export interface ResetPasswordRequest {
  email: string;
  token: string;
  senha: string;
}

/** Update profile request */
export interface UpdateProfileRequest {
  nome?: string;
  telefone?: string;
  email?: string;
}

/** Change password request */
export interface ChangePasswordRequest {
  senha_atual: string;
  nova_senha: string;
}

/** Delete account request */
export interface DeleteAccountRequest {
  senha: string;
  motivo?: string;
}

/** Biometric enroll request */
export interface BiometricEnrollRequest {
  biometric_token: string;
  device_id: string;
}

/** Device session */
export interface DeviceSession {
  id: string;
  device_name: string;
  plataforma: 'ios' | 'android';
  last_active: string;
  current: boolean;
}

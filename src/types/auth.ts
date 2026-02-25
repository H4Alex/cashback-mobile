export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  tipo: "consumidor" | "lojista";
  avatar_url?: string;
  created_at: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  password: string;
}

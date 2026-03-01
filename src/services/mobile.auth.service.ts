import { apiClient, saveTokens, clearTokens } from "@/src/lib/api-client";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  OAuthRequest,
  OAuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  ClienteResource,
  BiometricEnrollRequest,
  TokenPair,
} from "@/src/types";
import { validateResponse } from "@/src/schemas/validateResponse";
import { loginResponseSchema, clienteResourceSchema } from "@/src/schemas/api-responses";

const PREFIX = "/api/mobile/v1/auth";

export const mobileAuthService = {
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const res = await apiClient.post<ApiResponse<LoginResponse>>(`${PREFIX}/register`, data);
    validateResponse(loginResponseSchema, res.data, "POST /auth/register");
    await saveTokens(res.data.data.token);
    return res.data.data;
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await apiClient.post<ApiResponse<LoginResponse>>(`${PREFIX}/login`, data);
    validateResponse(loginResponseSchema, res.data, "POST /auth/login");
    await saveTokens(res.data.data.token);
    return res.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(`${PREFIX}/logout`);
    } catch {
      // Ignore network errors — we still need to clear local tokens
    } finally {
      await clearTokens();
    }
  },

  async refresh(): Promise<TokenPair> {
    const res = await apiClient.post<ApiResponse<TokenPair>>(`${PREFIX}/refresh`);
    await saveTokens(res.data.data.token);
    return res.data.data;
  },

  async me(): Promise<ClienteResource> {
    const res = await apiClient.get<ApiResponse<{ cliente: ClienteResource }>>(`${PREFIX}/me`);
    validateResponse(clienteResourceSchema, res.data.data.cliente, "GET /auth/me");
    return res.data.data.cliente;
  },

  /** OAuth social login (Google / Apple) */
  async oauth(data: OAuthRequest): Promise<OAuthResponse> {
    const res = await apiClient.post<ApiResponse<OAuthResponse>>(`${PREFIX}/oauth`, data);
    validateResponse(loginResponseSchema, res.data, "POST /auth/oauth");
    await saveTokens(res.data.data.token);
    return res.data.data;
  },

  /** Request password reset email */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(`${PREFIX}/forgot-password`, data);
  },

  /** Reset password using token from email */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post(`${PREFIX}/reset-password`, data);
  },

  /** Update consumer profile */
  async updateProfile(data: UpdateProfileRequest): Promise<ClienteResource> {
    const res = await apiClient.patch<ApiResponse<{ cliente: ClienteResource }>>(`${PREFIX}/profile`, data);
    validateResponse(clienteResourceSchema, res.data.data.cliente, "PATCH /auth/profile");
    return res.data.data.cliente;
  },

  /** Change password (requires current password) */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.patch(`${PREFIX}/password`, data);
  },

  /** Delete account permanently (LGPD compliance) */
  async deleteAccount(data: DeleteAccountRequest): Promise<void> {
    await apiClient.post(`${PREFIX}/delete-account`, data);
    await clearTokens();
  },

  /** Enroll biometric authentication */
  async enrollBiometric(data: BiometricEnrollRequest): Promise<{ enrolled: boolean }> {
    const res = await apiClient.post<ApiResponse<{ enrolled: boolean }>>(`${PREFIX}/biometric/enroll`, data);
    return res.data.data;
  },

  /** Verify biometric and get token */
  async verifyBiometric(data: BiometricEnrollRequest): Promise<TokenPair> {
    const res = await apiClient.post<ApiResponse<TokenPair>>(`${PREFIX}/biometric/verify`, data);
    await saveTokens(res.data.data.token);
    return res.data.data;
  },
};

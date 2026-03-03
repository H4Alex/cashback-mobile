import type { z } from "zod";
import type {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  oauthSchema,
} from "@/src/schemas/auth";
import type {
  clienteResourceSchema,
  loginResponseDataSchema,
} from "@/src/schemas/api-responses";

// ---------------------------------------------------------------------------
// Derived from Zod schemas (single source of truth)
// ---------------------------------------------------------------------------

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
export type ChangePasswordRequest = Pick<
  z.infer<typeof changePasswordSchema>,
  "senha_atual" | "nova_senha"
>;
export type DeleteAccountRequest = z.infer<typeof deleteAccountSchema>;
export type OAuthRequest = z.infer<typeof oauthSchema>;
export type ClienteResource = z.infer<typeof clienteResourceSchema>;
export type LoginResponse = z.infer<typeof loginResponseDataSchema>;

/** OAuthResponse shares the same shape as LoginResponse (token + cliente). */
export type OAuthResponse = LoginResponse;

// ---------------------------------------------------------------------------
// Manual types (no corresponding Zod schema)
// ---------------------------------------------------------------------------

export type OAuthProvider = "google" | "apple";

export interface TokenPair {
  token: string;
  token_type: string;
  expires_in: number;
}

export interface BiometricEnrollRequest {
  biometric_token: string;
  device_id: string;
}

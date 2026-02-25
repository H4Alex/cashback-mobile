export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  oauthSchema,
} from "./auth";

export type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  UpdateProfileFormData,
  ChangePasswordFormData,
  DeleteAccountFormData,
  OAuthFormData,
} from "./auth";

export { gerarQRCodeSchema, validarQRCodeSchema } from "./cashback";
export type { GerarQRCodeFormData, ValidarQRCodeFormData } from "./cashback";

export { notificationPreferencesSchema } from "./notification";
export type { NotificationPreferencesFormData } from "./notification";

export { createContestacaoSchema } from "./contestacao";
export type { CreateContestacaoFormData } from "./contestacao";

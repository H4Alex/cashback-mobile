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

export { gerarCashbackMerchantSchema, utilizarCashbackSchema } from "./merchant";
export type { GerarCashbackMerchantFormData, UtilizarCashbackFormData } from "./merchant";

export {
  apiResponseSchema,
  cursorPaginatedResponseSchema,
  clienteResourceSchema,
  loginResponseDataSchema,
  loginResponseSchema,
  saldoDataSchema,
  saldoResponseSchema,
  extratoEntrySchema,
  extratoResponseSchema,
  contestacaoSchema,
  contestacaoListResponseSchema,
  notificationSchema,
} from "./api-responses";

export type {
  LoginResponseData,
  LoginResponse as LoginResponseValidated,
  SaldoData,
  SaldoResponse,
  ExtratoEntrySchema,
  ExtratoResponse as ExtratoResponseValidated,
  ContestacaoSchema,
  ContestacaoListResponse as ContestacaoListResponseValidated,
  NotificationSchema,
} from "./api-responses";

export { validateResponse } from "./validateResponse";

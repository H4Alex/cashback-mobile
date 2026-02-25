import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mobileAuthService } from '@/src/services';
import { useAuthStore } from '@/src/stores';
import type {
  LoginRequest,
  RegisterRequest,
  OAuthRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
} from '@/src/types';

export function useLogin() {
  const setCliente = useAuthStore((s) => s.setCliente);
  return useMutation({
    mutationFn: (data: LoginRequest) => mobileAuthService.login(data),
    onSuccess: (res) => setCliente(res.cliente),
  });
}

export function useRegister() {
  const setCliente = useAuthStore((s) => s.setCliente);
  return useMutation({
    mutationFn: (data: RegisterRequest) => mobileAuthService.register(data),
    onSuccess: (res) => setCliente(res.cliente),
  });
}

export function useOAuth() {
  const setCliente = useAuthStore((s) => s.setCliente);
  return useMutation({
    mutationFn: (data: OAuthRequest) => mobileAuthService.oauth(data),
    onSuccess: (res) => setCliente(res.cliente),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      mobileAuthService.forgotPassword(data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      mobileAuthService.resetPassword(data),
  });
}

export function useUpdateProfile() {
  const setCliente = useAuthStore((s) => s.setCliente);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      mobileAuthService.updateProfile(data),
    onSuccess: (cliente) => {
      setCliente(cliente);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      mobileAuthService.changePassword(data),
  });
}

export function useDeleteAccount() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteAccountRequest) =>
      mobileAuthService.deleteAccount(data),
    onSuccess: async () => {
      queryClient.clear();
      await logout();
    },
  });
}

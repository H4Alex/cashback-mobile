import { useMutation } from '@tanstack/react-query';
import { mobileQRCodeService } from '@/src/services';
import type { GerarQRCodeRequest, ValidarQRCodeRequest } from '@/src/types';

/**
 * Hook to generate a QR code for cashback redemption.
 * The backend persists the token in Redis with a 5-minute TTL.
 */
export function useGerarQRCode() {
  return useMutation({
    mutationFn: (data: GerarQRCodeRequest) =>
      mobileQRCodeService.gerarQRCode(data),
  });
}

/**
 * Hook for merchants to validate a scanned QR code token.
 * The backend checks the token against Redis and verifies TTL.
 */
export function useValidarQRCode() {
  return useMutation({
    mutationFn: (data: ValidarQRCodeRequest) =>
      mobileQRCodeService.validarQRCode(data),
  });
}

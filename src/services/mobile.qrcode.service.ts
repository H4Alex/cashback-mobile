import { apiClient } from '@/src/lib/api-client';
import type {
  QRCodeToken,
  GerarQRCodeRequest,
  ValidarQRCodeRequest,
  ValidarQRCodeResponse,
} from '@/src/types';

/**
 * QR Code service for cashback redemption.
 * Consumer generates QR code → persisted in Redis with TTL → merchant validates.
 */
export const mobileQRCodeService = {
  /**
   * Generate a QR code token for cashback redemption.
   * Token is persisted in Redis with TTL (5 min) on the backend.
   * Returns the token data including `expira_em` (ISO 8601).
   */
  async gerarQRCode(data: GerarQRCodeRequest): Promise<QRCodeToken> {
    const res = await apiClient.post<QRCodeToken>(
      '/api/mobile/v1/utilizacao/qrcode',
      data,
    );
    return res.data;
  },

  /**
   * Validate a QR code token (merchant side).
   * Checks Redis for token existence and TTL validity.
   */
  async validarQRCode(
    data: ValidarQRCodeRequest,
  ): Promise<ValidarQRCodeResponse> {
    const res = await apiClient.post<ValidarQRCodeResponse>(
      '/api/v1/qrcode/validate',
      data,
    );
    return res.data;
  },
};

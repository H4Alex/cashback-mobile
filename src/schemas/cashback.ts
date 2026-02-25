import { z } from 'zod';

export const gerarQRCodeSchema = z.object({
  empresa_id: z.number().int().positive('Empresa obrigatória'),
  valor: z.number().positive('Valor deve ser positivo'),
});
export type GerarQRCodeFormData = z.infer<typeof gerarQRCodeSchema>;

export const validarQRCodeSchema = z.object({
  qr_token: z.string().min(1, 'Token QR obrigatório'),
});
export type ValidarQRCodeFormData = z.infer<typeof validarQRCodeSchema>;

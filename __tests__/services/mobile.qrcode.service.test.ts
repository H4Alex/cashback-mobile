import { mobileQRCodeService } from "@/src/services/mobile.qrcode.service";
import { apiClient } from "@/src/lib/api-client";

jest.mock("@/src/lib/api-client", () => ({
  apiClient: {
    post: jest.fn(),
  },
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getToken: jest.fn(),
}));

const mockPost = apiClient.post as jest.Mock;

describe("mobileQRCodeService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("gerarQRCode", () => {
    it("generates QR code with Redis-persisted token", async () => {
      const mockToken = {
        qr_token: "uuid-token-123",
        cliente_id: 1,
        empresa_id: 5,
        valor: 50.0,
        expira_em: "2026-02-25T14:30:00Z",
      };
      mockPost.mockResolvedValue({ data: { status: true, data: mockToken, error: null, message: 'Sucesso' } });

      const result = await mobileQRCodeService.gerarQRCode({
        empresa_id: 5,
        valor: 50.0,
      });

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/utilizacao/qrcode", {
        empresa_id: 5,
        valor: 50.0,
      });
      expect(result.qr_token).toBe("uuid-token-123");
      expect(result.expira_em).toBe("2026-02-25T14:30:00Z");
    });
  });

  describe("validarQRCode", () => {
    it("validates QR code token (merchant side)", async () => {
      const mockResponse = {
        cliente: { id: 1, nome: "João" },
        valor: 50.0,
        saldo: 100.0,
        expira_em: "2026-02-25T14:30:00Z",
      };
      mockPost.mockResolvedValue({ data: { status: true, data: mockResponse, error: null, message: 'Sucesso' } });

      const result = await mobileQRCodeService.validarQRCode({
        qr_token: "uuid-token-123",
      });

      expect(mockPost).toHaveBeenCalledWith("/api/v1/qrcode/validate", {
        qr_token: "uuid-token-123",
      });
      expect(result.cliente.nome).toBe("João");
      expect(result.valor).toBe(50.0);
    });
  });
});

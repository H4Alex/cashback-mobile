import { merchantEmpresaService } from "@/src/services/merchant.empresa.service";
import { apiClient, saveTokens } from "@/src/lib/api-client";

jest.mock("@/src/lib/api-client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getToken: jest.fn(),
}));

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;

describe("merchantEmpresaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getEmpresas", () => {
    it("fetches empresa list", async () => {
      const empresas = [{ id: 1, nome_fantasia: "Loja A" }];
      mockGet.mockResolvedValue({ data: { status: true, data: empresas, error: null, message: 'Sucesso' } });

      const result = await merchantEmpresaService.getEmpresas();

      expect(mockGet).toHaveBeenCalledWith("/api/v1/empresas");
      expect(result).toEqual(empresas);
    });
  });

  describe("switchEmpresa", () => {
    it("switches empresa and saves new token", async () => {
      const response = {
        token: "new-jwt",
        token_type: "bearer",
        expires_in: 3600,
        empresa: { id: 2, nome_fantasia: "Loja B" },
      };
      mockPost.mockResolvedValue({ data: { status: true, data: response, error: null, message: 'Sucesso' } });

      const result = await merchantEmpresaService.switchEmpresa(2);

      expect(mockPost).toHaveBeenCalledWith("/api/v1/auth/switch-empresa", { empresa_id: 2 });
      expect(saveTokens).toHaveBeenCalledWith("new-jwt");
      expect(result.empresa.nome_fantasia).toBe("Loja B");
    });
  });
});

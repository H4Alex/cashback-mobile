import { mobileAuthService } from "@/src/services/mobile.auth.service";
import { apiClient, saveTokens, clearTokens } from "@/src/lib/api-client";

jest.mock("@/src/lib/api-client", () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
  },
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getToken: jest.fn(),
}));

const mockPost = apiClient.post as jest.Mock;
const mockGet = apiClient.get as jest.Mock;
const mockPatch = apiClient.patch as jest.Mock;

describe("mobileAuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("calls login endpoint and saves token", async () => {
      const mockResponse = {
        data: { status: true, data: {
          token: "jwt-token",
          token_type: "bearer",
          expires_in: 3600,
          cliente: { id: 1, nome: "Test" },
        }, error: null, message: 'Sucesso' },
      };
      mockPost.mockResolvedValue(mockResponse);

      const result = await mobileAuthService.login({
        email: "test@example.com",
        senha: "123456",
      });

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/auth/login", {
        email: "test@example.com",
        senha: "123456",
      });
      expect(saveTokens).toHaveBeenCalledWith("jwt-token");
      expect(result.token).toBe("jwt-token");
    });
  });

  describe("oauth", () => {
    it("calls oauth endpoint with Google provider", async () => {
      const mockResponse = {
        data: { status: true, data: {
          token: "oauth-token",
          token_type: "bearer",
          expires_in: 3600,
          cliente: { id: 1, nome: "Test" },
        }, error: null, message: 'Sucesso' },
      };
      mockPost.mockResolvedValue(mockResponse);

      const result = await mobileAuthService.oauth({
        provider: "google",
        id_token: "google-id-token",
      });

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/auth/oauth", {
        provider: "google",
        id_token: "google-id-token",
      });
      expect(saveTokens).toHaveBeenCalledWith("oauth-token");
      expect(result.token).toBe("oauth-token");
    });

    it("calls oauth endpoint with Apple provider and nonce", async () => {
      const mockResponse = {
        data: { status: true, data: {
          token: "apple-token",
          token_type: "bearer",
          expires_in: 3600,
          cliente: { id: 1, nome: "Test" },
        }, error: null, message: 'Sucesso' },
      };
      mockPost.mockResolvedValue(mockResponse);

      await mobileAuthService.oauth({
        provider: "apple",
        id_token: "apple-id-token",
        nonce: "random-nonce",
      });

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/auth/oauth", {
        provider: "apple",
        id_token: "apple-id-token",
        nonce: "random-nonce",
      });
    });
  });

  describe("forgotPassword", () => {
    it("calls forgot-password endpoint", async () => {
      mockPost.mockResolvedValue({ data: { status: true, data: { success: true }, error: null, message: 'Sucesso' } });

      await mobileAuthService.forgotPassword({ email: "test@example.com" });

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/auth/forgot-password", {
        email: "test@example.com",
      });
    });
  });

  describe("resetPassword", () => {
    it("calls reset-password endpoint", async () => {
      mockPost.mockResolvedValue({ data: { status: true, data: { success: true }, error: null, message: 'Sucesso' } });

      await mobileAuthService.resetPassword({
        email: "test@example.com",
        token: "reset-token",
        senha: "newpass123",
      });

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/auth/reset-password", {
        email: "test@example.com",
        token: "reset-token",
        senha: "newpass123",
      });
    });
  });

  describe("updateProfile", () => {
    it("calls profile patch endpoint", async () => {
      mockPatch.mockResolvedValue({
        data: { status: true, data: { cliente: { id: 1, nome: "Updated Name" } }, error: null, message: 'Sucesso' },
      });

      const result = await mobileAuthService.updateProfile({
        nome: "Updated Name",
      });

      expect(mockPatch).toHaveBeenCalledWith("/api/mobile/v1/auth/profile", {
        nome: "Updated Name",
      });
      expect(result.nome).toBe("Updated Name");
    });
  });

  describe("changePassword", () => {
    it("calls password patch endpoint", async () => {
      mockPatch.mockResolvedValue({ data: { status: true, data: { success: true }, error: null, message: 'Sucesso' } });

      await mobileAuthService.changePassword({
        senha_atual: "oldpass",
        nova_senha: "newpass",
      });

      expect(mockPatch).toHaveBeenCalledWith("/api/mobile/v1/auth/password", {
        senha_atual: "oldpass",
        nova_senha: "newpass",
      });
    });
  });

  describe("deleteAccount", () => {
    it("calls delete-account endpoint and clears tokens", async () => {
      mockPost.mockResolvedValue({ data: { status: true, data: { success: true }, error: null, message: 'Sucesso' } });

      await mobileAuthService.deleteAccount({
        senha: "mypassword",
        motivo: "Não uso mais",
      });

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/auth/delete-account", {
        senha: "mypassword",
        motivo: "Não uso mais",
      });
      expect(clearTokens).toHaveBeenCalled();
    });

    it("clears tokens even with password only", async () => {
      mockPost.mockResolvedValue({ data: { status: true, data: { success: true }, error: null, message: 'Sucesso' } });

      await mobileAuthService.deleteAccount({ senha: "mypassword" });

      expect(clearTokens).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("calls logout endpoint and clears tokens", async () => {
      mockPost.mockResolvedValue({ data: { status: true, data: {}, error: null, message: 'Sucesso' } });

      await mobileAuthService.logout();

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/auth/logout");
      expect(clearTokens).toHaveBeenCalled();
    });

    it("clears tokens even if logout endpoint fails", async () => {
      mockPost.mockRejectedValue(new Error("Network error"));

      await mobileAuthService.logout();

      expect(clearTokens).toHaveBeenCalled();
    });
  });

  describe("me", () => {
    it("returns client data", async () => {
      mockGet.mockResolvedValue({
        data: { status: true, data: { cliente: { id: 1, nome: "Test", email: "test@example.com" } }, error: null, message: 'Sucesso' },
      });

      const result = await mobileAuthService.me();

      expect(mockGet).toHaveBeenCalledWith("/api/mobile/v1/auth/me");
      expect(result.nome).toBe("Test");
    });
  });
});

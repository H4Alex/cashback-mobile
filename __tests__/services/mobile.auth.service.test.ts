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

  describe("register", () => {
    it("calls register endpoint and saves token", async () => {
      const mockResponse = {
        data: { status: true, data: {
          token: "register-token",
          token_type: "bearer",
          expires_in: 3600,
          cliente: { id: 2, nome: "Novo Usuário" },
        }, error: null, message: 'Sucesso' },
      };
      mockPost.mockResolvedValue(mockResponse);

      const result = await mobileAuthService.register({
        nome: "Novo Usuário",
        email: "novo@example.com",
        cpf: "12345678901",
        senha: "123456",
        senha_confirmation: "123456",
      });

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/auth/register", {
        nome: "Novo Usuário",
        email: "novo@example.com",
        cpf: "12345678901",
        senha: "123456",
        senha_confirmation: "123456",
      });
      expect(saveTokens).toHaveBeenCalledWith("register-token");
      expect(result.token).toBe("register-token");
    });

    it("propagates 422 validation error", async () => {
      const error = Object.assign(new Error("Unprocessable Entity"), {
        response: { status: 422, data: { errors: { email: ["E-mail já cadastrado"] } } },
      });
      mockPost.mockRejectedValue(error);

      await expect(
        mobileAuthService.register({
          nome: "Test",
          email: "existing@example.com",
          cpf: "12345678901",
          senha: "123456",
          senha_confirmation: "123456",
        }),
      ).rejects.toThrow("Unprocessable Entity");
    });
  });

  describe("refresh", () => {
    it("refreshes token and saves new token", async () => {
      const mockResponse = {
        data: { status: true, data: {
          token: "refreshed-token",
          token_type: "bearer",
          expires_in: 3600,
        }, error: null, message: 'Sucesso' },
      };
      mockPost.mockResolvedValue(mockResponse);

      const result = await mobileAuthService.refresh();

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/auth/refresh");
      expect(saveTokens).toHaveBeenCalledWith("refreshed-token");
      expect(result.token).toBe("refreshed-token");
    });

    it("propagates 401 error when refresh token is expired", async () => {
      const error = Object.assign(new Error("Unauthorized"), {
        response: { status: 401 },
      });
      mockPost.mockRejectedValue(error);

      await expect(mobileAuthService.refresh()).rejects.toThrow("Unauthorized");
    });
  });

  describe("enrollBiometric", () => {
    it("enrolls biometric authentication", async () => {
      mockPost.mockResolvedValue({
        data: { status: true, data: { enrolled: true }, error: null, message: 'Sucesso' },
      });

      const result = await mobileAuthService.enrollBiometric({
        biometric_token: "bio-token",
        device_id: "device-123",
      });

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/auth/biometric/enroll", {
        biometric_token: "bio-token",
        device_id: "device-123",
      });
      expect(result.enrolled).toBe(true);
    });

    it("propagates errors", async () => {
      mockPost.mockRejectedValue(new Error("Server Error"));

      await expect(
        mobileAuthService.enrollBiometric({
          biometric_token: "bio-token",
          device_id: "device-123",
        }),
      ).rejects.toThrow("Server Error");
    });
  });

  describe("verifyBiometric", () => {
    it("verifies biometric and saves token", async () => {
      mockPost.mockResolvedValue({
        data: { status: true, data: {
          token: "biometric-jwt",
          token_type: "bearer",
          expires_in: 3600,
        }, error: null, message: 'Sucesso' },
      });

      const result = await mobileAuthService.verifyBiometric({
        biometric_token: "bio-token",
        device_id: "device-123",
      });

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/auth/biometric/verify", {
        biometric_token: "bio-token",
        device_id: "device-123",
      });
      expect(saveTokens).toHaveBeenCalledWith("biometric-jwt");
      expect(result.token).toBe("biometric-jwt");
    });

    it("propagates 401 error when biometric token is invalid", async () => {
      const error = Object.assign(new Error("Unauthorized"), {
        response: { status: 401 },
      });
      mockPost.mockRejectedValue(error);

      await expect(
        mobileAuthService.verifyBiometric({
          biometric_token: "invalid-token",
          device_id: "device-123",
        }),
      ).rejects.toThrow("Unauthorized");
    });
  });
});

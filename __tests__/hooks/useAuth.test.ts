import { renderHook, act, waitFor } from "@testing-library/react-native";
import { createWrapper } from "@/src/testing/hook-test-helpers";
import { useLogin, useRegister, useForgotPassword, useDeleteAccount } from "@/src/hooks/useAuth";

// Mock services
jest.mock("@/src/services", () => ({
  mobileAuthService: {
    login: jest.fn().mockResolvedValue({ cliente: { id: 1, nome: "Teste" } }),
    register: jest.fn().mockResolvedValue({ cliente: { id: 2, nome: "Novo" } }),
    forgotPassword: jest.fn().mockResolvedValue({ message: "Email enviado" }),
    deleteAccount: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock stores
jest.mock("@/src/stores", () => ({
  useAuthStore: jest.fn((selector) =>
    selector({
      setCliente: jest.fn(),
      logout: jest.fn().mockResolvedValue(undefined),
    }),
  ),
}));

describe("useAuth hooks", () => {
  describe("useLogin", () => {
    it("returns mutate function", () => {
      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBe(false);
    });

    it("calls login service on mutate", async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { mobileAuthService } = require("@/src/services");
      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
      act(() => {
        result.current.mutate({ email: "test@test.com", senha: "12345678" });
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mobileAuthService.login).toHaveBeenCalledWith({
        email: "test@test.com",
        senha: "12345678",
      });
    });
  });

  describe("useRegister", () => {
    it("returns mutate function", () => {
      const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() });
      expect(result.current.mutate).toBeDefined();
    });
  });

  describe("useForgotPassword", () => {
    it("returns mutate function", () => {
      const { result } = renderHook(() => useForgotPassword(), { wrapper: createWrapper() });
      expect(result.current.mutate).toBeDefined();
    });

    it("calls forgotPassword service", async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { mobileAuthService } = require("@/src/services");
      const { result } = renderHook(() => useForgotPassword(), { wrapper: createWrapper() });
      act(() => {
        result.current.mutate({ email: "test@test.com" });
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mobileAuthService.forgotPassword).toHaveBeenCalledWith({ email: "test@test.com" });
    });
  });

  describe("useDeleteAccount", () => {
    it("returns mutate function", () => {
      const { result } = renderHook(() => useDeleteAccount(), { wrapper: createWrapper() });
      expect(result.current.mutate).toBeDefined();
    });
  });
});

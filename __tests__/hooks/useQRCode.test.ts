import { renderHook, act, waitFor } from "@testing-library/react-native";
import { createWrapper } from "@/src/testing/hook-test-helpers";
import { useGerarQRCode, useValidarQRCode } from "@/src/hooks/useQRCode";

jest.mock("@/src/services", () => ({
  mobileQRCodeService: {
    gerarQRCode: jest.fn().mockResolvedValue({ qr_token: "abc123", expira_em: "2025-01-01" }),
    validarQRCode: jest.fn().mockResolvedValue({ valid: true, cliente: { id: 1, nome: "Test" } }),
  },
}));

describe("useQRCode hooks", () => {
  describe("useGerarQRCode", () => {
    it("returns mutate function", () => {
      const { result } = renderHook(() => useGerarQRCode(), { wrapper: createWrapper() });
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBe(false);
    });

    it("calls gerarQRCode service", async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { mobileQRCodeService } = require("@/src/services");
      const { result } = renderHook(() => useGerarQRCode(), { wrapper: createWrapper() });
      act(() => {
        result.current.mutate({ empresa_id: 1, valor: 50 });
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mobileQRCodeService.gerarQRCode).toHaveBeenCalledWith({ empresa_id: 1, valor: 50 });
    });
  });

  describe("useValidarQRCode", () => {
    it("returns mutate function", () => {
      const { result } = renderHook(() => useValidarQRCode(), { wrapper: createWrapper() });
      expect(result.current.mutate).toBeDefined();
    });

    it("calls validarQRCode service", async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { mobileQRCodeService } = require("@/src/services");
      const { result } = renderHook(() => useValidarQRCode(), { wrapper: createWrapper() });
      act(() => {
        result.current.mutate({ qr_token: "abc123" });
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mobileQRCodeService.validarQRCode).toHaveBeenCalledWith({ qr_token: "abc123" });
    });
  });
});

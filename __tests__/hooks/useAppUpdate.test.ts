import { renderHook, act, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import * as Updates from "expo-updates";
import { useAppUpdate } from "@/src/hooks/useAppUpdate";

jest.mock("expo-updates", () => ({
  isEnabled: true,
  checkForUpdateAsync: jest.fn().mockResolvedValue({ isAvailable: false }),
  fetchUpdateAsync: jest.fn().mockResolvedValue(undefined),
  reloadAsync: jest.fn(),
}));

describe("useAppUpdate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("starts with initial state", () => {
    const { result } = renderHook(() => useAppUpdate());
    expect(result.current.isDownloading).toBe(false);
    expect(result.current.isAvailable).toBe(false);
  });

  it("provides checkForUpdate function", () => {
    const { result } = renderHook(() => useAppUpdate());
    expect(typeof result.current.checkForUpdate).toBe("function");
  });

  it("provides downloadAndApply function", () => {
    const { result } = renderHook(() => useAppUpdate());
    expect(typeof result.current.downloadAndApply).toBe("function");
  });

  it("checks for update and sets isAvailable when update found", async () => {
    (Updates.checkForUpdateAsync as jest.Mock).mockResolvedValue({ isAvailable: true });

    const { result } = renderHook(() => useAppUpdate());
    await act(async () => {
      await result.current.checkForUpdate();
    });
    await waitFor(() => {
      expect(result.current.isAvailable).toBe(true);
    });
    expect(result.current.isChecking).toBe(false);
    expect(result.current.lastChecked).not.toBeNull();
  });

  it("checks for update and sets isAvailable=false when no update", async () => {
    (Updates.checkForUpdateAsync as jest.Mock).mockResolvedValue({ isAvailable: false });

    const { result } = renderHook(() => useAppUpdate());
    await act(async () => {
      await result.current.checkForUpdate();
    });
    expect(result.current.isAvailable).toBe(false);
    expect(result.current.isChecking).toBe(false);
  });

  it("handles check error gracefully", async () => {
    (Updates.checkForUpdateAsync as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useAppUpdate());
    await act(async () => {
      await result.current.checkForUpdate();
    });
    expect(result.current.isChecking).toBe(false);
    expect(result.current.lastChecked).not.toBeNull();
  });

  it("returns lastChecked after check completes", async () => {
    const { result } = renderHook(() => useAppUpdate());
    await act(async () => {
      await result.current.checkForUpdate();
    });
    expect(result.current.lastChecked).toBeInstanceOf(Date);
  });

  it("downloads update and shows alert", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    const { result } = renderHook(() => useAppUpdate());

    await act(async () => {
      await result.current.downloadAndApply();
    });

    expect(Updates.fetchUpdateAsync).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      "Atualização disponível",
      expect.any(String),
      expect.any(Array),
    );
  });

  it("handles download error and shows error alert", async () => {
    (Updates.fetchUpdateAsync as jest.Mock).mockRejectedValue(new Error("Download failed"));
    const alertSpy = jest.spyOn(Alert, "alert");

    const { result } = renderHook(() => useAppUpdate());
    await act(async () => {
      await result.current.downloadAndApply();
    });

    expect(alertSpy).toHaveBeenCalledWith("Erro", "Não foi possível baixar a atualização.");
    expect(result.current.isDownloading).toBe(false);
  });
});

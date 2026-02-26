import { renderHook, waitFor } from "@testing-library/react-native";
import { useBiometric } from "@/src/hooks/useBiometric";
import { useDeviceStore } from "@/src/stores/device.store";

jest.mock("@/src/services/biometric.service", () => ({
  biometricService: {
    checkAvailability: jest.fn().mockResolvedValue({ available: true }),
    authenticate: jest.fn().mockResolvedValue(true),
    enroll: jest.fn().mockResolvedValue(undefined),
  },
}));

import { biometricService } from "@/src/services/biometric.service";

describe("useBiometric", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDeviceStore.setState({
      biometricAvailable: false,
      biometricEnrolled: false,
      deviceId: "test-device-id",
    });
  });

  it("checks biometric availability on mount", async () => {
    renderHook(() => useBiometric());
    await waitFor(() => {
      expect(biometricService.checkAvailability).toHaveBeenCalled();
    });
  });

  it("returns biometricAvailable and biometricEnrolled state", () => {
    useDeviceStore.setState({ biometricAvailable: true, biometricEnrolled: true });
    const { result } = renderHook(() => useBiometric());
    expect(result.current.biometricAvailable).toBe(true);
    expect(result.current.biometricEnrolled).toBe(true);
  });

  it("authenticate returns false when biometric not available", async () => {
    useDeviceStore.setState({ biometricAvailable: false });
    const { result } = renderHook(() => useBiometric());
    const success = await result.current.authenticate();
    expect(success).toBe(false);
  });

  it("authenticate calls biometricService when available", async () => {
    useDeviceStore.setState({ biometricAvailable: true });
    const { result } = renderHook(() => useBiometric());
    await result.current.authenticate("Test prompt");
    expect(biometricService.authenticate).toHaveBeenCalledWith("Test prompt");
  });

  it("enroll returns false when no deviceId", async () => {
    useDeviceStore.setState({ deviceId: null });
    const { result } = renderHook(() => useBiometric());
    const success = await result.current.enroll();
    expect(success).toBe(false);
  });
});

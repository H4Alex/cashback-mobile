import { useDeviceStore } from "@/src/stores/device.store";

describe("useDeviceStore", () => {
  beforeEach(() => {
    useDeviceStore.getState().reset();
  });

  it("starts with null values and false flags", () => {
    const state = useDeviceStore.getState();
    expect(state.deviceId).toBeNull();
    expect(state.pushToken).toBeNull();
    expect(state.biometricAvailable).toBe(false);
    expect(state.biometricEnrolled).toBe(false);
  });

  it("sets device ID", () => {
    useDeviceStore.getState().setDeviceId("device-123");
    expect(useDeviceStore.getState().deviceId).toBe("device-123");
  });

  it("sets push token", () => {
    useDeviceStore.getState().setPushToken("ExponentPushToken[xxx]");
    expect(useDeviceStore.getState().pushToken).toBe("ExponentPushToken[xxx]");
  });

  it("sets biometric availability", () => {
    useDeviceStore.getState().setBiometricAvailable(true);
    expect(useDeviceStore.getState().biometricAvailable).toBe(true);
  });

  it("sets biometric enrollment", () => {
    useDeviceStore.getState().setBiometricEnrolled(true);
    expect(useDeviceStore.getState().biometricEnrolled).toBe(true);
  });

  it("resets all values", () => {
    useDeviceStore.getState().setDeviceId("device-123");
    useDeviceStore.getState().setPushToken("token");
    useDeviceStore.getState().setBiometricAvailable(true);
    useDeviceStore.getState().setBiometricEnrolled(true);

    useDeviceStore.getState().reset();

    const state = useDeviceStore.getState();
    expect(state.deviceId).toBeNull();
    expect(state.pushToken).toBeNull();
    expect(state.biometricAvailable).toBe(false);
    expect(state.biometricEnrolled).toBe(false);
  });
});

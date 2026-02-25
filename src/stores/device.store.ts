import { create } from "zustand";

interface DeviceState {
  deviceId: string | null;
  pushToken: string | null;
  biometricAvailable: boolean;
  biometricEnrolled: boolean;
  setDeviceId: (id: string) => void;
  setPushToken: (token: string) => void;
  setBiometricAvailable: (available: boolean) => void;
  setBiometricEnrolled: (enrolled: boolean) => void;
  reset: () => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  deviceId: null,
  pushToken: null,
  biometricAvailable: false,
  biometricEnrolled: false,

  setDeviceId: (deviceId) => set({ deviceId }),
  setPushToken: (pushToken) => set({ pushToken }),
  setBiometricAvailable: (biometricAvailable) => set({ biometricAvailable }),
  setBiometricEnrolled: (biometricEnrolled) => set({ biometricEnrolled }),

  reset: () =>
    set({
      deviceId: null,
      pushToken: null,
      biometricAvailable: false,
      biometricEnrolled: false,
    }),
}));

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "@/src/lib/mmkv";

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

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "device-store",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

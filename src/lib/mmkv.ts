import { MMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

export const storage = new MMKV();

/**
 * Zustand-compatible StateStorage backed by MMKV.
 * Use with zustand persist middleware for fast synchronous storage.
 */
export const mmkvStorage: StateStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

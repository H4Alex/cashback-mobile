import { create } from "zustand";

type ConnectionType = "wifi" | "cellular" | "ethernet" | "unknown" | "none";

interface ConnectivityState {
  isOnline: boolean;
  connectionType: ConnectionType;
  setOnline: (isOnline: boolean) => void;
  setConnectionType: (type: ConnectionType) => void;
}

export const useConnectivityStore = create<ConnectivityState>((set) => ({
  isOnline: true,
  connectionType: "unknown",

  setOnline: (isOnline) => set({ isOnline }),
  setConnectionType: (connectionType) => set({ connectionType }),
}));

import { create } from "zustand";
import type { ClienteResource } from "@/src/types";
import { mobileAuthService } from "@/src/services";
import { clearTokens, getToken } from "@/src/lib/api-client";

interface AuthState {
  cliente: ClienteResource | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setCliente: (cliente: ClienteResource | null) => void;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  cliente: null,
  isAuthenticated: false,
  isLoading: true,

  setCliente: (cliente) => set({ cliente, isAuthenticated: cliente !== null }),

  initialize: async () => {
    try {
      const token = await getToken();
      if (!token) {
        set({ isLoading: false, isAuthenticated: false, cliente: null });
        return;
      }
      const cliente = await mobileAuthService.me();
      set({ cliente, isAuthenticated: true, isLoading: false });
    } catch {
      await clearTokens();
      set({ cliente: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await mobileAuthService.logout();
    } finally {
      set({ cliente: null, isAuthenticated: false });
    }
  },
}));

import { create } from "zustand";
import type { Empresa } from "@/src/types/merchant";

interface MultilojaState {
  empresas: Empresa[];
  empresaAtiva: Empresa | null;
  setEmpresas: (empresas: Empresa[]) => void;
  setEmpresaAtiva: (empresa: Empresa) => void;
  isMultiloja: () => boolean;
  reset: () => void;
}

export const useMultilojaStore = create<MultilojaState>((set, get) => ({
  empresas: [],
  empresaAtiva: null,

  setEmpresas: (empresas) => set({ empresas }),

  setEmpresaAtiva: (empresa) => set({ empresaAtiva: empresa }),

  isMultiloja: () => get().empresas.length > 1,

  reset: () => set({ empresas: [], empresaAtiva: null }),
}));

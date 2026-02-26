import { useMultilojaStore } from "@/src/stores/multiloja.store";
import type { Empresa } from "@/src/types/merchant";

const EMPRESA_A: Empresa = {
  id: 1,
  nome_fantasia: "Loja A",
  cnpj: "12345678000101",
  perfil: "proprietario",
};

const EMPRESA_B: Empresa = {
  id: 2,
  nome_fantasia: "Loja B",
  cnpj: "98765432000102",
  perfil: "gestor",
};

describe("useMultilojaStore", () => {
  beforeEach(() => {
    useMultilojaStore.getState().reset();
  });

  it("starts with empty state", () => {
    const state = useMultilojaStore.getState();
    expect(state.empresas).toEqual([]);
    expect(state.empresaAtiva).toBeNull();
  });

  it("sets empresas list", () => {
    useMultilojaStore.getState().setEmpresas([EMPRESA_A, EMPRESA_B]);

    expect(useMultilojaStore.getState().empresas).toHaveLength(2);
  });

  it("sets empresa ativa", () => {
    useMultilojaStore.getState().setEmpresaAtiva(EMPRESA_A);

    expect(useMultilojaStore.getState().empresaAtiva).toEqual(EMPRESA_A);
  });

  describe("isMultiloja", () => {
    it("returns false for single empresa", () => {
      useMultilojaStore.getState().setEmpresas([EMPRESA_A]);

      expect(useMultilojaStore.getState().isMultiloja()).toBe(false);
    });

    it("returns true for multiple empresas", () => {
      useMultilojaStore.getState().setEmpresas([EMPRESA_A, EMPRESA_B]);

      expect(useMultilojaStore.getState().isMultiloja()).toBe(true);
    });

    it("returns false for empty list", () => {
      expect(useMultilojaStore.getState().isMultiloja()).toBe(false);
    });
  });

  it("resets state", () => {
    useMultilojaStore.getState().setEmpresas([EMPRESA_A]);
    useMultilojaStore.getState().setEmpresaAtiva(EMPRESA_A);
    useMultilojaStore.getState().reset();

    const state = useMultilojaStore.getState();
    expect(state.empresas).toEqual([]);
    expect(state.empresaAtiva).toBeNull();
  });
});

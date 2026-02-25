import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { merchantCashbackService } from "@/src/services/merchant.cashback.service";
import { merchantEmpresaService } from "@/src/services/merchant.empresa.service";
import { useMultilojaStore } from "@/src/stores/multiloja.store";
import type {
  GerarCashbackRequest,
  UtilizarCashbackRequest,
  ClienteSearchResult,
} from "@/src/types/merchant";

const KEYS = {
  clientes: ["merchant", "clientes"] as const,
  clienteSaldo: ["merchant", "clienteSaldo"] as const,
  campanhas: ["merchant", "campanhas"] as const,
  empresas: ["merchant", "empresas"] as const,
};

export function useClienteSearch() {
  const [cpf, setCpf] = useState("");
  const [selectedCliente, setSelectedCliente] = useState<ClienteSearchResult | null>(null);

  const query = useQuery({
    queryKey: [...KEYS.clientes, cpf],
    queryFn: () => merchantCashbackService.searchCliente(cpf),
    enabled: cpf.replace(/\D/g, "").length === 11,
  });

  const search = useCallback((value: string) => {
    setCpf(value);
    setSelectedCliente(null);
  }, []);

  const selectCliente = useCallback((cliente: ClienteSearchResult) => {
    setSelectedCliente(cliente);
  }, []);

  const reset = useCallback(() => {
    setCpf("");
    setSelectedCliente(null);
  }, []);

  return { cpf, setCpf: search, query, selectedCliente, selectCliente, reset };
}

export function useClienteSaldo(clienteId: number | undefined) {
  return useQuery({
    queryKey: [...KEYS.clienteSaldo, clienteId],
    queryFn: () => merchantCashbackService.getClienteSaldo(clienteId!),
    enabled: !!clienteId,
  });
}

export function useCampanhas() {
  return useQuery({
    queryKey: KEYS.campanhas,
    queryFn: () => merchantCashbackService.getCampanhas(),
    staleTime: 5 * 60_000, // 5 min — campaigns don't change often
  });
}

export function useCashbackCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      idempotencyKey,
    }: {
      data: GerarCashbackRequest;
      idempotencyKey: string;
    }) => merchantCashbackService.gerarCashback(data, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.clientes });
      queryClient.invalidateQueries({ queryKey: KEYS.clienteSaldo });
    },
  });
}

export function useCashbackUtilizar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      idempotencyKey,
    }: {
      data: UtilizarCashbackRequest;
      idempotencyKey: string;
    }) => merchantCashbackService.utilizarCashback(data, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.clientes });
      queryClient.invalidateQueries({ queryKey: KEYS.clienteSaldo });
    },
  });
}

export function useEmpresas() {
  const setEmpresas = useMultilojaStore((s) => s.setEmpresas);

  return useQuery({
    queryKey: KEYS.empresas,
    queryFn: async () => {
      const empresas = await merchantEmpresaService.getEmpresas();
      setEmpresas(empresas);
      return empresas;
    },
  });
}

export function useSwitchEmpresa() {
  const queryClient = useQueryClient();
  const setEmpresaAtiva = useMultilojaStore((s) => s.setEmpresaAtiva);

  return useMutation({
    mutationFn: (empresaId: number) => merchantEmpresaService.switchEmpresa(empresaId),
    onSuccess: (data) => {
      setEmpresaAtiva(data.empresa);
      queryClient.invalidateQueries();
    },
  });
}

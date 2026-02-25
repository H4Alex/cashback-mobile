import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { merchantManagementService } from "@/src/services/merchant.management.service";
import type { CreateCampanhaRequest } from "@/src/types/merchant";

const KEYS = {
  stats: ["merchant", "dashboard", "stats"] as const,
  transacoes: ["merchant", "dashboard", "transacoes"] as const,
  topClientes: ["merchant", "dashboard", "topClientes"] as const,
  chart: ["merchant", "dashboard", "chart"] as const,
  clientes: ["merchant", "clientes"] as const,
  cliente: ["merchant", "cliente"] as const,
  campanhas: ["merchant", "campanhas"] as const,
  vendas: ["merchant", "vendas"] as const,
  contestacoes: ["merchant", "contestacoes"] as const,
  config: ["merchant", "config"] as const,
  relatorios: ["merchant", "relatorios"] as const,
};

// --- Dashboard ---
export function useDashboardStats() {
  return useQuery({
    queryKey: KEYS.stats,
    queryFn: () => merchantManagementService.getStats(),
  });
}

export function useDashboardTransacoes() {
  return useQuery({
    queryKey: KEYS.transacoes,
    queryFn: () => merchantManagementService.getTransacoes(),
  });
}

export function useDashboardTopClientes() {
  return useQuery({
    queryKey: KEYS.topClientes,
    queryFn: () => merchantManagementService.getTopClientes(),
  });
}

export function useDashboardChart(periodo: string) {
  return useQuery({
    queryKey: [...KEYS.chart, periodo],
    queryFn: () => merchantManagementService.getChart(periodo),
  });
}

// --- Clientes ---
export function useClientes(params?: { search?: string; page?: number }) {
  return useQuery({
    queryKey: [...KEYS.clientes, params],
    queryFn: () =>
      merchantManagementService.getClientes({
        search: params?.search,
        page: params?.page ?? 1,
        limit: 20,
      }),
  });
}

export function useClienteDetail(id: number) {
  return useQuery({
    queryKey: [...KEYS.cliente, id],
    queryFn: () => merchantManagementService.getCliente(id),
    enabled: id > 0,
  });
}

export function useClienteSearchDebounced() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const query = useClientes({ search: search || undefined, page });

  const onSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  return { search, setSearch: onSearch, page, setPage, query };
}

// --- Campanhas CRUD ---
export function useCampanhasList(status?: string) {
  return useQuery({
    queryKey: [...KEYS.campanhas, status],
    queryFn: () => merchantManagementService.getCampanhas(status),
  });
}

export function useCreateCampanha() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCampanhaRequest) => merchantManagementService.createCampanha(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.campanhas }),
  });
}

export function useUpdateCampanha() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCampanhaRequest> }) =>
      merchantManagementService.updateCampanha(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.campanhas }),
  });
}

export function useDeleteCampanha() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => merchantManagementService.deleteCampanha(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.campanhas }),
  });
}

// --- Vendas ---
export function useVendas(params?: { page?: number; status?: string }) {
  return useQuery({
    queryKey: [...KEYS.vendas, params],
    queryFn: () =>
      merchantManagementService.getVendas({
        page: params?.page ?? 1,
        limit: 20,
        status: params?.status,
      }),
  });
}

// --- Contestações ---
export function useContestacoesMerchant(status?: string) {
  return useQuery({
    queryKey: [...KEYS.contestacoes, status],
    queryFn: () => merchantManagementService.getContestacoes(status),
  });
}

export function useResolveContestacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { status: "aprovada" | "rejeitada"; resposta: string };
    }) => merchantManagementService.resolveContestacao(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.contestacoes }),
  });
}

// --- Config ---
export function useEmpresaConfig() {
  return useQuery({
    queryKey: KEYS.config,
    queryFn: () => merchantManagementService.getConfig(),
  });
}

export function useUpdateConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: merchantManagementService.updateConfig,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.config }),
  });
}

// --- Relatórios ---
export function useRelatorios(periodo: string) {
  return useQuery({
    queryKey: [...KEYS.relatorios, periodo],
    queryFn: () => merchantManagementService.getRelatorios(periodo),
  });
}

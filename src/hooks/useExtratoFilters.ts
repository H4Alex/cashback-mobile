import { useState, useCallback } from "react";
import type { CashbackStatus } from "@/src/types";

export interface ExtratoFilters {
  empresa_id?: string;
  status?: CashbackStatus;
  data_inicio?: string;
  data_fim?: string;
}

export function useExtratoFilters() {
  const [filters, setFilters] = useState<ExtratoFilters>({});

  const setEmpresa = useCallback((empresa_id?: string) => {
    setFilters((prev) => ({ ...prev, empresa_id }));
  }, []);

  const setStatus = useCallback((status?: CashbackStatus) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setPeriodo = useCallback((data_inicio?: string, data_fim?: string) => {
    setFilters((prev) => ({ ...prev, data_inicio, data_fim }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters =
    !!filters.empresa_id || !!filters.status || !!filters.data_inicio || !!filters.data_fim;

  return {
    filters,
    setEmpresa,
    setStatus,
    setPeriodo,
    clearFilters,
    hasActiveFilters,
  };
}

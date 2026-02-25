/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Unidade de Negócio
 * Arquivo: unidadeNegocioStore.ts
 * Descrição: Store de unidades de negócio com CRUD via API real
 *            e multi-select para filtros de dashboard/relatórios.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 3-E — Configurações
 * ============================================================
 */

import { create } from 'zustand'
import api from '../services/apiClient'
import type { UnidadeNegocio } from '../types/unidadeNegocio'

interface UnidadeNegocioState {
  unidades: UnidadeNegocio[]
  unidadesSelecionadas: string[]
  isHydrating: boolean
  setUnidades: (unidades: UnidadeNegocio[]) => void
  toggleSelecionarUnidade: (id: string) => void
  selecionarTodas: () => void
  limparSelecao: () => void
  selecionarUnidade: (id: string | null) => void
  hasUnidades: () => boolean
  hasUnidadesAtivas: () => boolean
  hydrate: () => Promise<void>
}

export const useUnidadeNegocioStore = create<UnidadeNegocioState>((set, get) => ({
  unidades: [],
  unidadesSelecionadas: [],
  isHydrating: false,

  setUnidades: (unidades) => set({ unidades }),

  toggleSelecionarUnidade: (id: string) => {
    set((state) => {
      const jaSelecionada = state.unidadesSelecionadas.includes(id)
      return {
        unidadesSelecionadas: jaSelecionada
          ? state.unidadesSelecionadas.filter((uid) => uid !== id)
          : [...state.unidadesSelecionadas, id],
      }
    })
  },

  selecionarTodas: () => {
    const ativas = get()
      .unidades.filter((u) => u.status === 'ativa')
      .map((u) => String(u.id))
    set({ unidadesSelecionadas: ativas })
  },

  limparSelecao: () => set({ unidadesSelecionadas: [] }),

  selecionarUnidade: (id: string | null) => {
    if (id === null) {
      set({ unidadesSelecionadas: [] })
    } else {
      set({ unidadesSelecionadas: [id] })
    }
  },

  hasUnidades: () => get().unidades.length > 0,

  hasUnidadesAtivas: () => get().unidades.some((u) => u.status === 'ativa'),

  hydrate: async () => {
    set({ isHydrating: true })
    try {
      const response = await api.get<{ status: boolean; data: UnidadeNegocio[] }>('/unidades')
      const unidades = response.data.data ?? []
      set({ unidades, isHydrating: false })
    } catch {
      set({ isHydrating: false })
    }
  },
}))

/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Auth / Multiloja
 * Arquivo: multilojaStore.ts
 * Descrição: Store de multi-empresa (multi-tenant). Gerencia
 *            lista de empresas do usuário e empresa selecionada.
 *            Usa API real GET /empresas em vez de mocks.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 2 — Módulo de Autenticação
 * ============================================================
 */

import { create } from 'zustand'
import api from '../services/apiClient'
import { secureSetItem, secureGetItem, secureRemoveItem } from '../utils/secureStorage'
import type { EmpresaRef } from '../types/auth'

interface MultilojaState {
  empresas: EmpresaRef[]
  empresaSelecionada: EmpresaRef | null
  isHydrating: boolean
  setEmpresas: (empresas: EmpresaRef[]) => void
  setEmpresaSelecionada: (empresa: EmpresaRef) => void
  selecionarEmpresa: (empresa: EmpresaRef) => void
  limparSelecao: () => void
  isMultiloja: () => boolean
  hydrate: () => Promise<void>
}

const STORAGE_KEY = 'empresaSelecionada'

export const useMultilojaStore = create<MultilojaState>((set, get) => ({
  empresas: [],
  empresaSelecionada: null,
  isHydrating: false,

  setEmpresas: (empresas) => set({ empresas }),

  setEmpresaSelecionada: (empresa) => {
    set({ empresaSelecionada: empresa })
    secureSetItem(STORAGE_KEY, empresa).catch(() => {
      /* escrita no storage é best-effort */
    })
  },

  selecionarEmpresa: (empresa) => {
    set({ empresaSelecionada: empresa })
    secureSetItem(STORAGE_KEY, empresa).catch(() => {
      /* escrita no storage é best-effort */
    })
  },

  limparSelecao: () => {
    set({ empresaSelecionada: null })
    secureRemoveItem(STORAGE_KEY)
  },

  isMultiloja: () => get().empresas.length > 1,

  hydrate: async () => {
    set({ isHydrating: true })
    try {
      // Buscar empresas via API real
      const response = await api.get<{ status: boolean; data: EmpresaRef[] }>('/empresas')

      const empresas = response.data.data ?? []

      // Restaurar empresa persistida do storage seguro
      const savedEmpresa = await secureGetItem<EmpresaRef>(STORAGE_KEY)

      set({
        empresas,
        isHydrating: false,
        ...(savedEmpresa ? { empresaSelecionada: savedEmpresa } : {}),
      })
    } catch {
      set({ isHydrating: false })
    }
  },
}))

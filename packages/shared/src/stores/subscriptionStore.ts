/**
 * ============================================================
 * Projeto: H4Cashback
 * Módulo:  Assinatura
 * Arquivo: subscriptionStore.ts
 * Descrição: Store de assinatura SaaS. Verifica status da
 *            assinatura via API real GET /assinaturas/minha.
 * Gerado via: Claude Code — Integração Frontend ↔ Backend
 * Data: 2026-02-24
 * Fase: Fase 2 — Módulo de Autenticação
 * ============================================================
 */

import { create } from 'zustand'
import api from '../services/apiClient'
import type { Assinatura, AssinaturaStatus } from '../types/assinatura'

interface SubscriptionState {
  isActive: boolean
  planId: string | null
  assinatura: Assinatura | null
  isLoading: boolean
  setSubscription: (isActive: boolean, planId: string | null) => void
  hydrate: () => Promise<void>
}

/** Status que indicam assinatura ativa. */
const STATUS_ATIVOS: AssinaturaStatus[] = ['trial', 'ativa']

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  isActive: false,
  planId: null,
  assinatura: null,
  isLoading: false,

  setSubscription: (isActive, planId) => set({ isActive, planId }),

  hydrate: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get<{ status: boolean; data: Assinatura }>('/assinaturas/minha')

      const assinatura = response.data.data
      const isActive = STATUS_ATIVOS.includes(assinatura.status)

      set({
        isActive,
        planId: String(assinatura.plano_id),
        assinatura,
        isLoading: false,
      })
    } catch {
      set({ isActive: false, planId: null, assinatura: null, isLoading: false })
    }
  },
}))

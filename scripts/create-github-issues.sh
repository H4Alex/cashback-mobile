#!/bin/bash
# =============================================================================
# create-github-issues.sh
# Cria labels, milestones e issues no GitHub para os 9 sprints do Cashback Mobile
# Uso: ./scripts/create-github-issues.sh
# Requer: gh CLI autenticado (gh auth login)
# =============================================================================

set -euo pipefail

REPO="H4Alex/cashback-mobile"

echo "============================================"
echo "  Cashback Mobile — GitHub Issues Setup"
echo "============================================"
echo ""

# Verificar autenticação
if ! gh auth status &>/dev/null; then
  echo "ERRO: gh CLI não autenticado. Execute 'gh auth login' primeiro."
  exit 1
fi

echo "Repo: $REPO"
echo ""

# =============================================================================
# FASE 1: LABELS
# =============================================================================
echo ">>> Criando Labels de Pilar (P1-P16)..."

declare -A PILLAR_LABELS=(
  ["P1:arquitetura"]="1D76DB:Pilar 1 — Arquitetura e Estrutura de Projeto"
  ["P2:navegacao"]="0075CA:Pilar 2 — Navegação e Roteamento"
  ["P3:estado"]="5319E7:Pilar 3 — Gerenciamento de Estado"
  ["P4:rede-api"]="0E8A16:Pilar 4 — Camada de Rede e API"
  ["P5:auth-seguranca"]="D93F0B:Pilar 5 — Autenticação e Segurança"
  ["P6:ui-ux"]="FBCA04:Pilar 6 — UI/UX e Design System"
  ["P7:performance"]="B60205:Pilar 7 — Performance e Otimização"
  ["P8:offline"]="006B75:Pilar 8 — Persistência e Offline"
  ["P9:nativo"]="E99695:Pilar 9 — Funcionalidades Nativas"
  ["P10:push"]="F9D0C4:Pilar 10 — Push Notifications"
  ["P11:testes"]="C2E0C6:Pilar 11 — Testes"
  ["P12:ci-cd"]="BFD4F2:Pilar 12 — CI/CD"
  ["P13:monitoramento"]="D4C5F9:Pilar 13 — Monitoramento"
  ["P14:acessibilidade"]="7057FF:Pilar 14 — Acessibilidade"
  ["P15:i18n"]="2EA44F:Pilar 15 — Internacionalização"
  ["P16:app-stores"]="8B5CF6:Pilar 16 — App Stores"
)

for label in "${!PILLAR_LABELS[@]}"; do
  IFS=':' read -r color desc <<< "${PILLAR_LABELS[$label]}"
  gh label create "$label" --repo "$REPO" --color "$color" --description "$desc" --force 2>/dev/null || true
  echo "  ✓ $label"
done

echo ""
echo ">>> Criando Labels de Tipo..."

declare -A TYPE_LABELS=(
  ["epic"]="3E4B9E:Issue épica — agrupa um sprint inteiro"
  ["task"]="C5DEF5:Task individual dentro de um epic"
  ["backend-dep"]="D93F0B:Depende de implementação no backend"
  ["blocker"]="B60205:Bloqueante para outro sprint"
  ["infra"]="BFD4F2:Tarefa de infraestrutura/configuração"
  ["screen"]="FBCA04:Implementação de tela"
  ["component"]="0E8A16:Implementação de componente UI"
  ["hook-store"]="5319E7:Implementação de hook ou store"
)

for label in "${!TYPE_LABELS[@]}"; do
  IFS=':' read -r color desc <<< "${TYPE_LABELS[$label]}"
  gh label create "$label" --repo "$REPO" --color "$color" --description "$desc" --force 2>/dev/null || true
  echo "  ✓ $label"
done

echo ""
echo ">>> Criando Labels de Prioridade..."

declare -A PRIORITY_LABELS=(
  ["priority:critical"]="B60205:Bloqueante para App Store"
  ["priority:high"]="D93F0B:Essencial para MVP"
  ["priority:medium"]="FBCA04:Recomendado para MVP"
)

for label in "${!PRIORITY_LABELS[@]}"; do
  IFS=':' read -r color desc <<< "${PRIORITY_LABELS[$label]}"
  gh label create "$label" --repo "$REPO" --color "$color" --description "$desc" --force 2>/dev/null || true
  echo "  ✓ $label"
done

echo ""

# =============================================================================
# FASE 2: MILESTONES
# =============================================================================
echo ">>> Criando Milestones..."

gh api repos/$REPO/milestones -f title="Sprint 0 — Fundação" -f description="Semanas 1-2: Monorepo + @cashback/shared + Expo setup" -f due_on="2026-03-13T23:59:59Z" 2>/dev/null || echo "  (Sprint 0 já existe)"
echo "  ✓ Sprint 0 — Fundação (2026-03-02 → 2026-03-13)"

gh api repos/$REPO/milestones -f title="Sprint 1 — Autenticação" -f description="Semanas 3-4: Auth completa (consumer + merchant + OAuth + LGPD)" -f due_on="2026-03-27T23:59:59Z" 2>/dev/null || echo "  (Sprint 1 já existe)"
echo "  ✓ Sprint 1 — Autenticação (2026-03-16 → 2026-03-27)"

gh api repos/$REPO/milestones -f title="Sprint 2 — Dashboard + Saldo" -f description="Semanas 5-6: Home do consumidor + saldo + tabs" -f due_on="2026-04-10T23:59:59Z" 2>/dev/null || echo "  (Sprint 2 já existe)"
echo "  ✓ Sprint 2 — Dashboard + Saldo (2026-03-30 → 2026-04-10)"

gh api repos/$REPO/milestones -f title="Sprint 3 — Transações + Histórico" -f description="Semanas 7-8: Extrato infinite scroll + contestações" -f due_on="2026-04-24T23:59:59Z" 2>/dev/null || echo "  (Sprint 3 já existe)"
echo "  ✓ Sprint 3 — Transações + Histórico (2026-04-13 → 2026-04-24)"

gh api repos/$REPO/milestones -f title="Sprint 4 — Cashback + Resgate" -f description="Semanas 9-10: Core lojista: gerar/utilizar cashback" -f due_on="2026-05-08T23:59:59Z" 2>/dev/null || echo "  (Sprint 4 já existe)"
echo "  ✓ Sprint 4 — Cashback + Resgate (2026-04-27 → 2026-05-08)"

gh api repos/$REPO/milestones -f title="Sprint 5 — QR Code + Push" -f description="Semanas 11-12: QR Code E2E + central notificações" -f due_on="2026-05-22T23:59:59Z" 2>/dev/null || echo "  (Sprint 5 já existe)"
echo "  ✓ Sprint 5 — QR Code + Push (2026-05-11 → 2026-05-22)"

gh api repos/$REPO/milestones -f title="Sprint 6 — Biometria + Config" -f description="Semanas 13-14: Biometria + dark mode + offline + a11y" -f due_on="2026-06-05T23:59:59Z" 2>/dev/null || echo "  (Sprint 6 já existe)"
echo "  ✓ Sprint 6 — Biometria + Config (2026-05-25 → 2026-06-05)"

gh api repos/$REPO/milestones -f title="Sprint 7 — Gestão Lojista" -f description="Semanas 15-16: Todas telas de gestão do lojista" -f due_on="2026-06-19T23:59:59Z" 2>/dev/null || echo "  (Sprint 7 já existe)"
echo "  ✓ Sprint 7 — Gestão Lojista (2026-06-08 → 2026-06-19)"

gh api repos/$REPO/milestones -f title="Sprint 8 — Polish + Publicação" -f description="Semanas 17-18: E2E + performance + App Store submit" -f due_on="2026-07-03T23:59:59Z" 2>/dev/null || echo "  (Sprint 8 já existe)"
echo "  ✓ Sprint 8 — Polish + Publicação (2026-06-22 → 2026-07-03)"

echo ""

# =============================================================================
# FASE 3: EPIC ISSUES (1 por sprint)
# =============================================================================
echo ">>> Criando Epic Issues..."

# Helper function
create_epic() {
  local title="$1"
  local labels="$2"
  local milestone="$3"
  local body="$4"

  gh issue create \
    --repo "$REPO" \
    --title "$title" \
    --label "$labels" \
    --milestone "$milestone" \
    --body "$body" 2>/dev/null || echo "  ERRO ao criar: $title"
}

# --- EPIC #1: Sprint 0 ---
create_epic \
  "[EPIC] Sprint 0 — Fundação" \
  "epic,P1:arquitetura,P11:testes,P12:ci-cd,P13:monitoramento,P15:i18n,infra" \
  "Sprint 0 — Fundação" \
  "$(cat <<'BODY'
## Objetivo
Migrar cashback-frontend para monorepo npm workspaces, extrair @cashback/shared, criar projeto Expo e configurar toda a infraestrutura base.

## Pilares Endereçados
- **P1** Arquitetura 🟢🟡 — Monorepo, @cashback/shared, barrels
- **P11** Testes 🟢 — Jest setup
- **P12** CI/CD 🟢 — GitHub Actions, EAS Build
- **P13** Monitoramento 🟢 — Sentry setup
- **P15** i18n 🟢 — Locales compartilhados

## Tasks
- [ ] S0-T01: Criar estrutura monorepo npm workspaces
- [ ] S0-T02: Extrair types/ (15 arquivos)
- [ ] S0-T03: Extrair utils/ (9 arquivos)
- [ ] S0-T04: Extrair schemas/ Zod (6 arquivos)
- [ ] S0-T05: Criar StorageAdapter + createApiClient factory
- [ ] S0-T06: Extrair services/ (15 arquivos)
- [ ] S0-T07: Extrair stores/ Zustand (5 arquivos)
- [ ] S0-T08: Extrair hooks/ + i18n/locales
- [ ] S0-T09: Atualizar imports no cashback-frontend
- [ ] S0-T10: Criar projeto Expo + configs base
- [ ] S0-T11: Instalar dependências + configurar ferramentas
- [ ] S0-T12: Setup CI/CD + Testes + EAS Build
- [ ] S0-T13: ⚠️ [BACKEND] Configurar CORS + verificar FCM/APNs

## Critérios de Aceite
- [ ] Monorepo funcional: `npm install` resolve workspaces
- [ ] Web build + tests passam sem regressões
- [ ] @cashback/shared compila e exporta todos módulos
- [ ] Expo inicia no simulador/emulador
- [ ] EAS Build gera APK + IPA dev client
- [ ] CI < 5 min (lint + type-check + tests)
- [ ] Sentry recebe test event
- [ ] i18n pt-BR/en funcional

## Dependências
- Sprint: Nenhuma (primeiro sprint)
- Backend: CORS configurado para mobile

## Riscos
- R10: Tipos legados poluem exports → Remover
- R11: secureStorage Web Crypto → expo-secure-store
- R15: CORS não configurado → Configurar antes Sprint 1
BODY
)"
echo "  ✓ [EPIC] Sprint 0 — Fundação"

# --- EPIC #2: Sprint 1 ---
create_epic \
  "[EPIC] Sprint 1 — Autenticação" \
  "epic,P2:navegacao,P4:rede-api,P5:auth-seguranca,P6:ui-ux,P14:acessibilidade,P15:i18n" \
  "Sprint 1 — Autenticação" \
  "$(cat <<'BODY'
## Objetivo
Fluxo completo de autenticação para consumidor e lojista, incluindo OAuth Apple/Google e requisitos LGPD.

## Pilares Endereçados
- **P2** Navegação 🟢 — AuthStack, guards
- **P4** Rede/API 🟢🟡 — Endpoints auth
- **P5** Auth/Segurança 🟢 — JWT, SecureStore, OAuth
- **P6** UI/UX 🟢 — Componentes base
- **P14** Acessibilidade 🟢 — Labels
- **P15** i18n 🟢 — Textos auth

## Telas (10)
- [ ] S1-T01: LoginScreen (email+senha + OAuth)
- [ ] S1-T02: RegisterScreen (CPF/CNPJ)
- [ ] S1-T03: ForgotPasswordScreen (wizard 4 steps) `backend-dep`
- [ ] S1-T04: OnboardingScreen (slides)
- [ ] S1-T05: ProfileScreen + EditProfileScreen `backend-dep`
- [ ] S1-T06: ChangePasswordScreen `backend-dep`
- [ ] S1-T07: DeleteAccountScreen (LGPD) ⚠️ `priority:critical` `backend-dep`
- [ ] S1-T08: PrivacyPolicyScreen + ConsentScreen

## Infra
- [ ] S1-T09: Criar componentes base (Button, Input, Card, Toast, Loading, OfflineBanner, Badge)
- [ ] S1-T10: ⚠️ [BACKEND] Criar 6 endpoints auth mobile `priority:critical` `blocker`
- [ ] S1-T11: Stores/hooks conectividade + schemas mobile
- [ ] S1-T12: Navegação Auth + guards + deep linking

## Endpoints Backend a CRIAR (6) — BLOQUEANTES
- `POST /api/mobile/v1/auth/forgot-password`
- `POST /api/mobile/v1/auth/reset-password`
- `PATCH /api/mobile/v1/auth/profile`
- `PATCH /api/mobile/v1/auth/password`
- `POST /api/mobile/v1/auth/delete-account`
- Implementar OAuth Google+Apple no `POST /api/mobile/v1/auth/oauth` (stub 501)

## Critérios de Aceite
- [ ] Consumidor: registro CPF, login, logout, forgot password, perfil, alterar senha, excluir conta
- [ ] Lojista: registro CNPJ, login, logout
- [ ] OAuth Apple (iOS) + Google (ambas) funcional
- [ ] JWT em expo-secure-store
- [ ] Refresh token automático ao 401
- [ ] Logout limpa tudo (tokens, cache, stores)
- [ ] Onboarding apenas primeiro acesso
- [ ] Consentimento LGPD no primeiro acesso
- [ ] Delete account funcional (requisito Apple/Google)
- [ ] accessibilityLabel em todos inputs
- [ ] Touch targets >= 48dp

## Dependências
- **Sprint:** Sprint 0
- **Backend:** 6 endpoints novos + OAuth

## Riscos
- R1: OAuth stub 501 — Apple rejeita sem Apple Sign-In
- R2: Delete account inexistente — Apple/Google exigem
- R5: Password reset mobile não existe
BODY
)"
echo "  ✓ [EPIC] Sprint 1 — Autenticação"

# --- EPIC #3: Sprint 2 ---
create_epic \
  "[EPIC] Sprint 2 — Dashboard + Saldo" \
  "epic,P2:navegacao,P3:estado,P6:ui-ux,P7:performance,P8:offline" \
  "Sprint 2 — Dashboard + Saldo" \
  "$(cat <<'BODY'
## Objetivo
Experiência home do consumidor — dashboard com saldo, alerta expiração, últimas transações, tabs.

## Pilares Endereçados
- **P2** Navegação 🟢 — ConsumerTabs
- **P3** Estado 🟢 — React Query saldo/extrato
- **P6** UI/UX 🟢 — Pull-to-refresh, skeletons, empty states
- **P7** Performance 🟢 — FlashList
- **P8** Persistência 🟢 — Cache MMKV

## Tasks
- [ ] S2-T01: Consumer Dashboard (Home)
- [ ] S2-T02: Saldo Detail Screen
- [ ] S2-T03: Componentes: SaldoCard, CashbackTimeline, EmptyState, Skeleton, PullToRefresh, NotificationBell
- [ ] S2-T04: Hooks/stores: notificationStore, useSaldo, useExtrato, useRefreshOnFocus
- [ ] S2-T05: ConsumerTabs + cache MMKV + AppState
- [ ] S2-T06: ⚠️ [BACKEND] Ajustar saldo (proximo_a_expirar) + fix N+1 extrato + criar biometric endpoints

## Critérios de Aceite
- [ ] Dashboard: saldo total, expirando, 5 últimas transações, badge notificação
- [ ] Saldo Detail: breakdown por empresa com logos
- [ ] Pull-to-refresh funcional
- [ ] Skeleton loading + EmptyState
- [ ] staleTime 30s para dados financeiros
- [ ] Cache MMKV persiste entre sessões
- [ ] ConsumerTabs bottom bar funcional

## Dependências
- **Sprint:** Sprint 1
- **Backend:** Ajuste saldo + fix N+1 extrato
BODY
)"
echo "  ✓ [EPIC] Sprint 2 — Dashboard + Saldo"

# --- EPIC #4: Sprint 3 ---
create_epic \
  "[EPIC] Sprint 3 — Transações + Histórico" \
  "epic,P4:rede-api,P6:ui-ux,P7:performance,P8:offline" \
  "Sprint 3 — Transações + Histórico" \
  "$(cat <<'BODY'
## Objetivo
Jornada completa do consumidor: extrato (infinite scroll cursor-based), histórico de uso, contestações.

## Pilares Endereçados
- **P4** Rede 🟢 — Cursor pagination, abort controller
- **P6** UI/UX 🟢 — Infinite scroll, swipe actions
- **P7** Performance 🟢 — FlashList + cursor
- **P8** Persistência 🟡 — Cache extrato

## Tasks
- [ ] S3-T01: Extrato Screen (infinite scroll cursor-based)
- [ ] S3-T02: Histórico de Uso Screen
- [ ] S3-T03: Contestação (Lista + Criar)
- [ ] S3-T04: Componentes: SwipeAction, FilterChips, TransactionCard, ContestacaoForm
- [ ] S3-T05: Hooks: useExtratoInfinite, useContestacoes, useContestacaoCreate, useExtratoFilters
- [ ] S3-T06: ⚠️ [BACKEND] QR validate + sessions + Redis QR token `blocker`

## Endpoints Backend a CRIAR
- `POST /api/v1/qrcode/validate` — lojista valida QR (prep Sprint 5)
- `GET /api/mobile/v1/auth/sessions`
- `DELETE /api/mobile/v1/auth/sessions/{id}`
- Ajustar QR token → Redis TTL 5min (prep Sprint 5)

## Critérios de Aceite
- [ ] Extrato infinite scroll +20/página com cursor
- [ ] Filtros: empresa, status cashback, período
- [ ] Histórico com detalhes
- [ ] Contestações: lista + criar com validação
- [ ] Performance: sem flicker em infinite scroll
- [ ] Offline: cache + indicador
- [ ] Abort controller cancela ao navegar

## Dependências
- **Sprint:** Sprint 2
- **Backend:** QR token persistence, sessions endpoints

## Riscos
- R3: QR sem persistência — BLOQUEANTE para Sprint 5
BODY
)"
echo "  ✓ [EPIC] Sprint 3 — Transações + Histórico"

# --- EPIC #5: Sprint 4 ---
create_epic \
  "[EPIC] Sprint 4 — Cashback + Resgate" \
  "epic,P4:rede-api,P5:auth-seguranca,P6:ui-ux,P9:nativo" \
  "Sprint 4 — Cashback + Resgate" \
  "$(cat <<'BODY'
## Objetivo
Core do lojista: gerar cashback (CPF + valor), utilizar cashback (FEFO), seleção multi-empresa.

## Pilares Endereçados
- **P4** Rede 🟢 — Idempotency key, retry
- **P5** Auth 🟢 — Guard API lojista
- **P6** UI/UX 🟢 — Feedback tátil, confirmação
- **P9** Nativo 🟡 — Haptic feedback

## Tasks
- [ ] S4-T01: Cashback Menu Screen
- [ ] S4-T02: Gerar Cashback Screen (CPF → valor → campanha → confirmar)
- [ ] S4-T03: Utilizar Cashback Screen (CPF → saldo → FEFO → confirmar)
- [ ] S4-T04: Multiloja Screen (seleção empresa)
- [ ] S4-T05: Componentes: FAB, BottomSheetSelect, CPFSearchInput, CashbackConfirmation, MultilojaSelector
- [ ] S4-T06: Hooks: useCashbackCreate, useCashbackUtilizar, useClienteSearch, useCampanhas
- [ ] S4-T07: MerchantTabs + haptics + idempotency

## Backend
Nenhum endpoint novo — todos os 62 endpoints web do lojista já existem.

## Critérios de Aceite
- [ ] Gerar cashback: CPF → campanha → valor → confirmar → sucesso + haptic
- [ ] Utilizar: CPF → saldo → valor → FEFO → sucesso
- [ ] Cancelar venda funcional
- [ ] Idempotency key previne duplicação
- [ ] Multiloja: switch empresa → refetch
- [ ] Offline queue para cashback
- [ ] Bottom sheet confirmação
- [ ] Haptic feedback (expo-haptics)
- [ ] MerchantTabs funcional

## Dependências
- **Sprint:** Sprint 1 (auth lojista), Sprint 0 (shared)
- **Backend:** Nenhum novo
BODY
)"
echo "  ✓ [EPIC] Sprint 4 — Cashback + Resgate"

# --- EPIC #6: Sprint 5 ---
create_epic \
  "[EPIC] Sprint 5 — QR Code + Push Notifications" \
  "epic,P5:auth-seguranca,P9:nativo,P10:push" \
  "Sprint 5 — QR Code + Push" \
  "$(cat <<'BODY'
## Objetivo
QR Code end-to-end (consumidor gera, lojista escaneia+valida) e central de notificações push.

## Pilares Endereçados
- **P9** Nativo 🟢 — Câmera, QR
- **P10** Push 🟢 — Registro, handlers, preferências
- **P5** Segurança 🟡 — QR token efêmero

## Tasks
- [ ] S5-T01: QR Code Screen (consumidor gera + countdown)
- [ ] S5-T02: QR Scan Screen (lojista escaneia + valida) `backend-dep`
- [ ] S5-T03: Notifications Screen + Preferences `backend-dep`
- [ ] S5-T04: Componentes: QRCodeDisplay, QRCodeScanner, PermissionRequest, NotificationItem, CountdownTimer
- [ ] S5-T05: Hooks: usePushNotifications, useNotifications, useNotificationPreferences, useQRCode, useCamera
- [ ] S5-T06: Configurar expo-camera + expo-notifications + deep linking
- [ ] S5-T07: ⚠️ [BACKEND] Criar tabela notifications + 6 endpoints `priority:high` `blocker`

## Endpoints Backend a CRIAR (6) — BLOQUEANTES
- Criar tabela `notifications` + model + migration
- `GET /api/mobile/v1/notifications`
- `PATCH /api/mobile/v1/notifications/{id}/read`
- `POST /api/mobile/v1/notifications/read-all`
- `GET /api/mobile/v1/notifications/preferences`
- `PATCH /api/mobile/v1/notifications/preferences`

## Critérios de Aceite
- [ ] QR Code com countdown 5min + auto-regenerar
- [ ] Lojista escaneia → valida → dados cliente+saldo
- [ ] Permissão câmera com UX amigável
- [ ] Push token registrado no backend
- [ ] Push foreground: toast; background: badge + tap navega
- [ ] Central notificações: lista, mark read, mark all
- [ ] Preferências: toggle push/email/marketing
- [ ] Haptic em QR gerado/validado

## Dependências
- **Sprint:** Sprint 3 (QR Redis), Sprint 2 (NotificationBell)
- **Backend:** 6 endpoints + tabela + QR validate

## Riscos
- R3: QR sem persistência → DEVE estar resolvido no Sprint 3
- R4: Tabela notifications inexistente
- R7: FCM/APNs não verificado
BODY
)"
echo "  ✓ [EPIC] Sprint 5 — QR Code + Push Notifications"

# --- EPIC #7: Sprint 6 ---
create_epic \
  "[EPIC] Sprint 6 — Biometria + Configurações" \
  "epic,P5:auth-seguranca,P7:performance,P8:offline,P9:nativo,P14:acessibilidade" \
  "Sprint 6 — Biometria + Config" \
  "$(cat <<'BODY'
## Objetivo
Login biométrico, modo offline robusto, dark mode, acessibilidade — sprint cross-cutting.

## Pilares Endereçados
- **P5** Segurança 🟡 — Biometria, session timeout
- **P7** Performance 🟡 — Lazy loading, images
- **P8** Offline 🟡 — Queue, stale indicator
- **P9** Nativo 🟢 — Biometria
- **P14** Acessibilidade 🟢🟡 — Labels, contraste, screen reader

## Tasks
- [ ] S6-T01: Login biométrico (FaceID/TouchID) + fallback
- [ ] S6-T02: Dark mode (toggle + persist + sistema)
- [ ] S6-T03: Offline queue + stale indicator
- [ ] S6-T04: Session timeout + sessions management
- [ ] S6-T05: Accessibility audit (WCAG AA)
- [ ] S6-T06: Componentes: BiometricPrompt, SessionCard, OfflineIndicator, ThemeToggle
- [ ] S6-T07: Stores/hooks: deviceStore, useBiometric, useSessionTimeout, useOfflineQueue, themeStore

## Critérios de Aceite
- [ ] Login biométrico com fallback após 3 falhas
- [ ] Check hardware antes de oferecer biometria
- [ ] Dark mode: toggle + persiste + respeita sistema
- [ ] Offline queue: enfileira + executa ao reconectar
- [ ] Session timeout: auto-logout 15min + tela mascarada
- [ ] accessibilityLabel em todos elementos; contraste >= 4.5:1
- [ ] Dados mascarados ao background
- [ ] Sessions: visualizar + revogar

## Dependências
- **Sprint:** Sprint 5, Sprint 2 (endpoints biometria)
- **Backend:** Endpoints biometria e sessões prontos
BODY
)"
echo "  ✓ [EPIC] Sprint 6 — Biometria + Configurações"

# --- EPIC #8: Sprint 7 ---
create_epic \
  "[EPIC] Sprint 7 — Gestão Lojista" \
  "epic,P4:rede-api,P6:ui-ux,P7:performance,P11:testes" \
  "Sprint 7 — Gestão Lojista" \
  "$(cat <<'BODY'
## Objetivo
Todas as telas de gestão do lojista — dashboard, clientes, campanhas, vendas, contestações, configurações, relatórios.

## Pilares Endereçados
- **P4** Rede 🟢 — Múltiplos endpoints
- **P6** UI/UX 🟢🟡 — Tabelas, charts, forms
- **P7** Performance 🟡 — Virtualização listas
- **P11** Testes 🟡 — Cobertura lojista

## Telas (9)
- [ ] S7-T01: Merchant Dashboard (stats + gráfico + transações + top clientes)
- [ ] S7-T02: Clientes (lista + detalhe + extrato)
- [ ] S7-T03: Campanhas CRUD
- [ ] S7-T04: Vendas (filtros + paginação)
- [ ] S7-T05: Contestações (listar + responder)
- [ ] S7-T06: Configurações + Upload Logo
- [ ] S7-T07: Relatórios
- [ ] S7-T08: Menu "Mais"

## Infra
- [ ] S7-T09: Componentes: StatsCard, ChartCard, DataTable, SearchBar, CampanhaForm, ContestacaoResponseForm, ConfigForm, LogoUpload, MenuList
- [ ] S7-T10: Hooks: useDashboard, useClientes, useCampanhasCRUD, useVendas, useContestacoes, useConfig

## Backend
Nenhum endpoint novo — todos os 62 endpoints web já existem.

## Critérios de Aceite
- [ ] Dashboard: 4 cards + gráfico + transações + top clientes
- [ ] Clientes: busca + paginação + detalhe + extrato
- [ ] Campanhas: CRUD completo
- [ ] Vendas: filtros + paginação
- [ ] Contestações: listar + responder
- [ ] Config: editar + upload logo
- [ ] Relatórios: métricas + filtro período
- [ ] Menu "Mais" com navegação
- [ ] Todas listas: pull-to-refresh + skeleton + empty state

## Dependências
- **Sprint:** Sprint 4, Sprint 0
- **Backend:** Nenhum novo
BODY
)"
echo "  ✓ [EPIC] Sprint 7 — Gestão Lojista"

# --- EPIC #9: Sprint 8 ---
create_epic \
  "[EPIC] Sprint 8 — Polish + E2E + Publicação" \
  "epic,P7:performance,P11:testes,P12:ci-cd,P13:monitoramento,P16:app-stores" \
  "Sprint 8 — Polish + Publicação" \
  "$(cat <<'BODY'
## Objetivo
Polimento final, testes E2E, otimizações de performance, preparação de assets e submissão para App Store e Google Play.

## Pilares Endereçados
- **P7** Performance 🟡🔴 — Bundle analysis, startup time
- **P11** Testes 🟡 — E2E top 3 fluxos
- **P12** CI/CD 🟡 — EAS Submit, OTA
- **P13** Monitoramento 🟡 — Sentry production, analytics
- **P16** App Stores 🟢 — Screenshots, metadata, review

## Tasks
- [ ] S8-T01: Testes E2E — 3 fluxos críticos (Login+Dashboard, Gerar Cashback, QR Code)
- [ ] S8-T02: Performance audit (cold start < 3s, TTI < 2s, bundle < 10MB, 60fps)
- [ ] S8-T03: Splash screen + app icon (assets finais)
- [ ] S8-T04: OTA updates (expo-updates) + Sentry production
- [ ] S8-T05: Screenshots + metadata App Stores
- [ ] S8-T06: EAS Build production + submissão Apple/Google `priority:critical`
- [ ] S8-T07: Dog-fooding + QA final (2 dias, zero crashes)

## Targets
| Métrica | Target |
|---------|--------|
| Cold start | < 3s (device mid-range) |
| TTI Dashboard | < 2s |
| JS bundle | < 10MB |
| FPS scroll | 60fps |
| Unitários | >= 70% |
| Componentes | >= 50% |
| Integração | >= 30% |
| E2E | 3 fluxos |
| Crash-free | > 99.5% |

## Critérios de Aceite
- [ ] 3 E2E passam (iOS + Android)
- [ ] Cobertura: unit 70%, comp 50%, integ 30%
- [ ] Cold start < 3s
- [ ] JS bundle < 10MB
- [ ] Zero crashes no dog-fooding (2 dias)
- [ ] Assets finais aprovados
- [ ] Screenshots todas resoluções
- [ ] Metadata pt-BR + en
- [ ] Política privacidade URL + in-app
- [ ] Privacy labels / data safety
- [ ] EAS Build: APK/AAB + IPA assinados
- [ ] Submetido Apple App Review
- [ ] Submetido Google Play
- [ ] OTA configurado

## Dependências
- **Sprint:** Sprints 0-7 completos
- **Backend:** Todos endpoints em produção
- **Design:** Assets finais aprovados
- **Legal:** Política privacidade publicada

## Riscos
- Apple Review: prever 1-2 ciclos (5-7 dias)
- Google Play data safety: prever ajustes
- OTA: apenas JS bundle, não native
BODY
)"
echo "  ✓ [EPIC] Sprint 8 — Polish + E2E + Publicação"

echo ""
echo "============================================"
echo "  Setup completo!"
echo "  Labels: 27 criados"
echo "  Milestones: 9 criados"
echo "  Epics: 9 criados"
echo "============================================"
echo ""
echo "Próximos passos:"
echo "  1. Verificar issues em: https://github.com/$REPO/issues"
echo "  2. Verificar milestones em: https://github.com/$REPO/milestones"
echo "  3. Para criar tasks individuais, desmarque os checkboxes nos epics"
echo "     ou use: gh issue create --repo $REPO --title 'S0-T01: ...' --label task,P1:arquitetura"

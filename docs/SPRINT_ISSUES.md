# Sprint Issues — Cashback Mobile

> Documento estruturado com os 9 sprints transformados em issues GitHub.
> Cada sprint é 1 Epic com tasks detalhadas, labels por pilar, milestones e dependências.
> Gerado em: 2026-02-25
> Base: CONVERGENCE_ANALYSIS.md + MOBILE_PROJECT_SPEC.md

---

## Estrutura de Labels

### Labels de Pilar (P1-P16)

| Label | Cor | Descrição |
|-------|-----|-----------|
| `P1:arquitetura` | `#1D76DB` | Pilar 1 — Arquitetura e Estrutura |
| `P2:navegacao` | `#0075CA` | Pilar 2 — Navegação e Roteamento |
| `P3:estado` | `#5319E7` | Pilar 3 — Gerenciamento de Estado |
| `P4:rede-api` | `#0E8A16` | Pilar 4 — Camada de Rede e API |
| `P5:auth-seguranca` | `#D93F0B` | Pilar 5 — Autenticação e Segurança |
| `P6:ui-ux` | `#FBCA04` | Pilar 6 — UI/UX e Design System |
| `P7:performance` | `#B60205` | Pilar 7 — Performance e Otimização |
| `P8:offline` | `#006B75` | Pilar 8 — Persistência e Offline |
| `P9:nativo` | `#E99695` | Pilar 9 — Funcionalidades Nativas |
| `P10:push` | `#F9D0C4` | Pilar 10 — Push Notifications |
| `P11:testes` | `#C2E0C6` | Pilar 11 — Testes |
| `P12:ci-cd` | `#BFD4F2` | Pilar 12 — CI/CD |
| `P13:monitoramento` | `#D4C5F9` | Pilar 13 — Monitoramento |
| `P14:acessibilidade` | `#1D76DB` | Pilar 14 — Acessibilidade |
| `P15:i18n` | `#0075CA` | Pilar 15 — Internacionalização |
| `P16:app-stores` | `#5319E7` | Pilar 16 — App Stores |

### Labels de Tipo

| Label | Cor | Descrição |
|-------|-----|-----------|
| `epic` | `#3E4B9E` | Issue épica — agrupa um sprint inteiro |
| `task` | `#C5DEF5` | Task individual dentro de um epic |
| `backend-dep` | `#D93F0B` | Depende de implementação no backend |
| `blocker` | `#B60205` | Bloqueante para outro sprint |
| `infra` | `#BFD4F2` | Tarefa de infraestrutura/configuração |
| `screen` | `#FBCA04` | Implementação de tela |
| `component` | `#0E8A16` | Implementação de componente UI |
| `hook-store` | `#5319E7` | Implementação de hook ou store |

### Labels de Prioridade

| Label | Cor | Descrição |
|-------|-----|-----------|
| `priority:critical` | `#B60205` | Bloqueante para App Store |
| `priority:high` | `#D93F0B` | Essencial para MVP |
| `priority:medium` | `#FBCA04` | Recomendado para MVP |

---

## Milestones

| Milestone | Sprint | Semanas | Data Início | Data Fim | Descrição |
|-----------|--------|---------|-------------|----------|-----------|
| `Sprint 0 — Fundação` | S0 | 1-2 | 2026-03-02 | 2026-03-13 | Monorepo + @cashback/shared + Expo setup |
| `Sprint 1 — Autenticação` | S1 | 3-4 | 2026-03-16 | 2026-03-27 | Auth completa (consumer + merchant + OAuth + LGPD) |
| `Sprint 2 — Dashboard + Saldo` | S2 | 5-6 | 2026-03-30 | 2026-04-10 | Home do consumidor + saldo + tabs |
| `Sprint 3 — Transações + Histórico` | S3 | 7-8 | 2026-04-13 | 2026-04-24 | Extrato infinite scroll + contestações |
| `Sprint 4 — Cashback + Resgate` | S4 | 9-10 | 2026-04-27 | 2026-05-08 | Core lojista: gerar/utilizar cashback |
| `Sprint 5 — QR Code + Push` | S5 | 11-12 | 2026-05-11 | 2026-05-22 | QR Code E2E + central notificações |
| `Sprint 6 — Biometria + Config` | S6 | 13-14 | 2026-05-25 | 2026-06-05 | Biometria + dark mode + offline + a11y |
| `Sprint 7 — Gestão Lojista` | S7 | 15-16 | 2026-06-08 | 2026-06-19 | Todas telas de gestão do lojista |
| `Sprint 8 — Polish + Publicação` | S8 | 17-18 | 2026-06-22 | 2026-07-03 | E2E + performance + App Store submit |

---

## Diagrama de Dependências

```
Sprint 0 (Fundação)
  ├──→ Sprint 1 (Auth)
  │     ├──→ Sprint 2 (Dashboard + Saldo)
  │     │     ├──→ Sprint 3 (Transações + Histórico)
  │     │     │     └──→ Sprint 5 (QR + Push)  ←── depende de S2 e S3
  │     │     └──→ Sprint 6 (Biometria)         ←── depende de S5
  │     └──→ Sprint 4 (Cashback + Resgate)
  │           └──→ Sprint 7 (Gestão Lojista)     ←── depende de S4
  └──────────────────────→ Sprint 8 (Polish)     ←── depende de TODOS
```

**Caminhos críticos:**
- **Consumer:** S0 → S1 → S2 → S3 → S5 → S6
- **Merchant:** S0 → S1 → S4 → S7
- **Publicação:** S8 depende de S0-S7

---

## EPIC #1 — Sprint 0: Fundação

**Milestone:** `Sprint 0 — Fundação`
**Labels:** `epic`, `P1:arquitetura`, `P11:testes`, `P12:ci-cd`, `P13:monitoramento`, `P15:i18n`, `infra`
**Semanas:** 1-2 (2026-03-02 → 2026-03-13)

### Objetivo
Migrar cashback-frontend para monorepo npm workspaces, extrair @cashback/shared, criar projeto Expo e configurar toda a infraestrutura base.

### Tasks

#### S0-T01: Criar estrutura monorepo npm workspaces
- **Labels:** `task`, `P1:arquitetura`, `infra`
- **Descrição:** Criar `package.json` raiz com workspaces config, `tsconfig.base.json` compartilhado, reorganizar `cashback-frontend` como `packages/web/`
- **Ref:** CONVERGENCE_ANALYSIS.md §3.1, §3.5 passo 1

#### S0-T02: Extrair types/ para @cashback/shared (15 arquivos)
- **Labels:** `task`, `P1:arquitetura`
- **Descrição:** Mover 15 arquivos de tipos (api, auth, cashback, customer, campaign, empresa, dashboard, assinatura, contestacao, unidadeNegocio, usuarioInterno, notificacao, auditLog, extrato, venda). Remover `store.ts` legado e tipos `@deprecated`. Criar barrel export limpo.
- **Ref:** CONVERGENCE_ANALYSIS.md §3.2.1

#### S0-T03: Extrair utils/ para @cashback/shared (9 arquivos)
- **Labels:** `task`, `P1:arquitetura`
- **Descrição:** Mover validation, formatters, masks, errorMessages, error.utils, optimisticUpdate, asyncValidation, rateLimiter, token.utils. Refatorar `token.utils` para usar `StorageAdapter`.
- **Ref:** CONVERGENCE_ANALYSIS.md §3.2.6

#### S0-T04: Extrair schemas/ Zod para @cashback/shared (6 arquivos)
- **Labels:** `task`, `P1:arquitetura`
- **Descrição:** Mover auth, campaign, cashback, company, profile, user schemas Zod puros.
- **Ref:** CONVERGENCE_ANALYSIS.md §3.2.2

#### S0-T05: Criar StorageAdapter + createApiClient factory
- **Labels:** `task`, `P1:arquitetura`, `P4:rede-api`
- **Descrição:** Implementar interface `StorageAdapter` (getItem/setItem/removeItem) para abstrair expo-secure-store e MMKV. Implementar `createApiClient` factory com interceptors (JWT injection, refresh token, rate limiting, error formatting).
- **Ref:** CONVERGENCE_ANALYSIS.md §3.2.4, §3.2.5

#### S0-T06: Extrair services/ para @cashback/shared (15 arquivos)
- **Labels:** `task`, `P1:arquitetura`, `P4:rede-api`
- **Descrição:** Mover 15 services de domínio (auth, cashback, cliente, campanha, dashboard, empresa, config, contestacao, auditoria, assinatura, fatura, notificacao, relatorio, unidade, usuario). Ajustar imports para usar `createApiClient`.
- **Depende de:** S0-T05 (createApiClient)
- **Ref:** CONVERGENCE_ANALYSIS.md §3.2.3

#### S0-T07: Extrair stores/ Zustand para @cashback/shared (5 arquivos)
- **Labels:** `task`, `P1:arquitetura`, `P3:estado`
- **Descrição:** Mover authStore, multilojaStore, subscriptionStore, themeStore, unidadeNegocioStore. Adaptar persistência via `StorageAdapter`.
- **Depende de:** S0-T05 (StorageAdapter)
- **Ref:** CONVERGENCE_ANALYSIS.md §3.2.5

#### S0-T08: Extrair hooks/ e i18n/ para @cashback/shared
- **Labels:** `task`, `P1:arquitetura`, `P15:i18n`
- **Descrição:** Mover 5 hooks (useDebounce, useDashboard, useSimulatedLoading, useRecuperacaoWizard, useCompanyLookups) e 2 locales (pt-BR.json, en.json).
- **Ref:** CONVERGENCE_ANALYSIS.md §3.2.7, §3.2.8

#### S0-T09: Atualizar imports no cashback-frontend
- **Labels:** `task`, `P1:arquitetura`
- **Descrição:** Atualizar todos os imports no cashback-frontend (web) para usar `@cashback/shared`. Garantir que build e testes passam sem regressões.
- **Depende de:** S0-T02 a S0-T08

#### S0-T10: Criar projeto Expo + configurações base
- **Labels:** `task`, `P1:arquitetura`, `infra`
- **Descrição:** `npx create-expo-app` em `packages/mobile/`. Configurar app.config.ts (permissions, plugins, scheme h4cashback), eas.json (dev/preview/prod), metro.config.js (monorepo resolver), babel.config.js (reanimated plugin).
- **Ref:** MOBILE_PROJECT_SPEC.md §7.1

#### S0-T11: Instalar dependências e configurar ferramentas
- **Labels:** `task`, `P1:arquitetura`, `infra`
- **Descrição:** Instalar dependências core (expo, react-native, typescript, expo-router), estado (zustand, react-query, axios, zod), storage (expo-secure-store, MMKV), UI (reanimated, gesture-handler, safe-area-context, expo-font). Configurar ThemeProvider, i18n (i18next + expo-localization), Sentry, React Query (MMKV persistence), Axios mobile instance.
- **Depende de:** S0-T10

#### S0-T12: Setup CI/CD + Testes + EAS Build
- **Labels:** `task`, `P11:testes`, `P12:ci-cd`, `P13:monitoramento`, `infra`
- **Descrição:** Setup Jest + @testing-library/react-native. Setup GitHub Actions CI (lint, type-check, test). Primeiro EAS Build (development client + preview). Configurar Sentry com test event. Carregar fontes DM Sans e Space Mono.
- **Depende de:** S0-T10, S0-T11

#### S0-T13: Configurar CORS + verificar FCM/APNs (backend)
- **Labels:** `task`, `backend-dep`, `P4:rede-api`
- **Descrição:** [BACKEND] Configurar CORS para origins do app mobile. Verificar integração real FCM/APNs no PushChannel.
- **Ref:** CONVERGENCE_ANALYSIS.md §2.5

### Critérios de Aceite
- [ ] Monorepo funcional: `npm install` na raiz resolve todos os workspaces
- [ ] `npm run build` e `npm run test` do web passam sem regressões
- [ ] `@cashback/shared` compila e exporta todos os módulos
- [ ] Projeto Expo inicia no simulador/emulador
- [ ] EAS Build gera APK e IPA development client
- [ ] CI roda lint + type-check + tests em < 5 min
- [ ] Sentry recebe test event do app mobile
- [ ] i18n exibe texto em pt-BR e troca para en

### Dependências
- **Sprint:** Nenhuma (primeiro sprint)
- **Backend:** CORS configurado para mobile origins

### Riscos
- **R10:** Tipos legados poluem barrel exports → Remover na extração
- **R11:** secureStorage web usa Web Crypto → Substituir por expo-secure-store
- **R15:** CORS não configurado para mobile → Configurar antes do Sprint 1

---

## EPIC #2 — Sprint 1: Autenticação

**Milestone:** `Sprint 1 — Autenticação`
**Labels:** `epic`, `P2:navegacao`, `P4:rede-api`, `P5:auth-seguranca`, `P6:ui-ux`, `P14:acessibilidade`, `P15:i18n`
**Semanas:** 3-4 (2026-03-16 → 2026-03-27)
**Depende de:** Epic #1 (Sprint 0)

### Objetivo
Implementar o fluxo completo de autenticação para ambos os perfis (consumidor e lojista), incluindo OAuth Apple/Google e requisitos LGPD.

### Tasks

#### S1-T01: Implementar LoginScreen
- **Labels:** `task`, `screen`, `P2:navegacao`, `P4:rede-api`, `P5:auth-seguranca`, `P6:ui-ux`
- **Descrição:** Tela de login email+senha + OAuth Apple/Google. Toggle Consumidor/Lojista alternando endpoint. Integrar com `POST /api/mobile/v1/auth/login` (consumidor) e `POST /api/v1/auth/login` (lojista). Armazenar JWT em expo-secure-store.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Auth > Login

#### S1-T02: Implementar RegisterScreen
- **Labels:** `task`, `screen`, `P4:rede-api`, `P5:auth-seguranca`, `P6:ui-ux`
- **Descrição:** Registro consumidor (CPF + nome + email + telefone + senha) e lojista (CNPJ + nome fantasia). Toggle entre perfis. Validação Zod inline. Aceite de termos/LGPD.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Auth > Register

#### S1-T03: Implementar ForgotPasswordScreen (wizard 4 steps)
- **Labels:** `task`, `screen`, `P4:rede-api`, `P5:auth-seguranca`, `P6:ui-ux`, `backend-dep`
- **Descrição:** Wizard: email → código 6 dígitos → nova senha → sucesso. Countdown para reenvio (30s). Indicador de força da senha.
- **Depende de:** S1-T10 (endpoints forgot/reset password no backend)
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Auth > Forgot Password

#### S1-T04: Implementar OnboardingScreen
- **Labels:** `task`, `screen`, `P2:navegacao`, `P6:ui-ux`
- **Descrição:** 3 slides com ilustrações e texto (i18n). Swipe horizontal. Botão "Pular" e "Começar". Exibir apenas no primeiro acesso (flag MMKV).
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Auth > Onboarding

#### S1-T05: Implementar ProfileScreen + EditProfileScreen
- **Labels:** `task`, `screen`, `P5:auth-seguranca`, `P6:ui-ux`, `backend-dep`
- **Descrição:** Menu do perfil consumidor (dados pessoais, segurança, sobre). Editar nome, email, telefone. Integrar com `PATCH /api/mobile/v1/auth/profile`.
- **Depende de:** S1-T10 (endpoint PATCH profile no backend)
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Consumer > Perfil / Editar

#### S1-T06: Implementar ChangePasswordScreen
- **Labels:** `task`, `screen`, `P5:auth-seguranca`, `backend-dep`
- **Descrição:** Alterar senha (senha atual + nova senha + confirmação). Indicador de força. Integrar com `PATCH /api/mobile/v1/auth/password`.
- **Depende de:** S1-T10 (endpoint PATCH password no backend)

#### S1-T07: Implementar DeleteAccountScreen (LGPD)
- **Labels:** `task`, `screen`, `P5:auth-seguranca`, `P16:app-stores`, `priority:critical`, `backend-dep`
- **Descrição:** Exclusão de conta LGPD. Confirmação com senha + motivo opcional. Requisito obrigatório Apple/Google. Integrar com `POST /api/mobile/v1/auth/delete-account`.
- **Depende de:** S1-T10 (endpoint delete-account no backend)

#### S1-T08: Implementar PrivacyPolicyScreen + ConsentScreen
- **Labels:** `task`, `screen`, `P5:auth-seguranca`, `P16:app-stores`
- **Descrição:** Política de privacidade (WebView ou markdown). Consentimento LGPD no primeiro acesso consumidor. Registrar via `POST /api/v1/lgpd/customers/{id}/consents`.

#### S1-T09: Criar componentes base do Design System
- **Labels:** `task`, `component`, `P6:ui-ux`, `P14:acessibilidade`
- **Descrição:** Criar Button (primary/secondary/outline/ghost/danger), Input (text/email/password/masked CPF/CNPJ/phone), Card (Header+Content), Toast, Loading, OfflineBanner, Badge. Todos com accessibilityLabel e touch targets >= 48dp.
- **Ref:** CONVERGENCE_ANALYSIS.md §4.2

#### S1-T10: [BACKEND] Criar 6 endpoints de auth mobile
- **Labels:** `task`, `backend-dep`, `P4:rede-api`, `P5:auth-seguranca`, `priority:critical`, `blocker`
- **Descrição:** Endpoints a criar no backend:
  - `POST /api/mobile/v1/auth/forgot-password` — recuperação de senha
  - `POST /api/mobile/v1/auth/reset-password` — reset com token
  - `PATCH /api/mobile/v1/auth/profile` — editar perfil consumidor
  - `PATCH /api/mobile/v1/auth/password` — alterar senha
  - `POST /api/mobile/v1/auth/delete-account` — exclusão LGPD
  - Implementar OAuth Google + Apple no `POST /api/mobile/v1/auth/oauth` (atualmente stub 501)
- **Ref:** CONVERGENCE_ANALYSIS.md §2.3 #1-5, §2.4 #4

#### S1-T11: Configurar stores/hooks de conectividade e app state
- **Labels:** `task`, `hook-store`, `P4:rede-api`, `P8:offline`
- **Descrição:** Criar `useConnectivity` (NetInfo), `connectivityStore` (isOnline, connectionType), `useAppState` (foreground/background lifecycle). Criar schemas novos: `mobileRegisterSchema`, `deleteAccountSchema`.

#### S1-T12: Configurar navegação Auth + guards + deep linking
- **Labels:** `task`, `P2:navegacao`, `P5:auth-seguranca`, `infra`
- **Descrição:** Configurar AuthStack layout (sem bottom tabs). Navigation guards (redirect baseado em auth state). expo-auth-session para Apple/Google. Deep linking scheme `h4cashback://`.

### Critérios de Aceite
- [ ] Consumidor: registrar CPF, login, logout, forgot password, editar perfil, alterar senha, excluir conta
- [ ] Lojista: registrar CNPJ, login, logout
- [ ] OAuth Apple (iOS) e Google (ambas plataformas) funcionais
- [ ] JWT em expo-secure-store (nunca MMKV/AsyncStorage)
- [ ] Refresh token automático ao 401
- [ ] Logout limpa: tokens, React Query, Zustand, SecureStore, MMKV
- [ ] Onboarding apenas primeiro acesso
- [ ] Consentimento LGPD no primeiro acesso consumidor
- [ ] Tela de exclusão funcional (requisito Apple/Google)
- [ ] accessibilityLabel em todos os inputs (P14)
- [ ] Textos em pt-BR e en (P15)
- [ ] Touch targets >= 48dp (P6)

### Dependências
- **Sprint:** Sprint 0
- **Backend:** 6 endpoints novos + OAuth implementado

### Riscos
- **R1:** OAuth social não implementado (stub 501) — Apple rejeita apps sem Apple Sign-In
- **R2:** Delete account inexistente — Apple e Google exigem
- **R5:** Password reset mobile não existe
- **R6:** Perfil sem edição
- **R9:** Recuperação web usa mocks

---

## EPIC #3 — Sprint 2: Dashboard + Saldo

**Milestone:** `Sprint 2 — Dashboard + Saldo`
**Labels:** `epic`, `P2:navegacao`, `P3:estado`, `P6:ui-ux`, `P7:performance`, `P8:offline`
**Semanas:** 5-6 (2026-03-30 → 2026-04-10)
**Depende de:** Epic #2 (Sprint 1)

### Objetivo
Construir a experiência home do consumidor — dashboard com saldo, alerta de cashback expirando, últimas transações e navegação por tabs.

### Tasks

#### S2-T01: Implementar Consumer Dashboard (Home)
- **Labels:** `task`, `screen`, `P3:estado`, `P4:rede-api`, `P6:ui-ux`, `P7:performance`, `P8:offline`
- **Descrição:** Dashboard com: saldo total, valor expirando (campo `proximo_a_expirar`), 5 últimas transações, badge notificação. Pull-to-refresh. Skeleton loading. Empty state. Offline: dados do cache MMKV + banner.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Consumer > Dashboard

#### S2-T02: Implementar Saldo Detail Screen
- **Labels:** `task`, `screen`, `P3:estado`, `P4:rede-api`, `P6:ui-ux`
- **Descrição:** Breakdown de saldo por empresa. Logo, nome_fantasia, saldo, quantidade de cashbacks. Tap empresa → extrato filtrado. Pull-to-refresh.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Consumer > Saldo Detail

#### S2-T03: Criar componentes SaldoCard + CashbackTimeline + EmptyState + Skeleton
- **Labels:** `task`, `component`, `P6:ui-ux`
- **Descrição:** `SaldoCard` (saldo total + breakdown + alerta expiração), `CashbackTimeline` (timeline visual extrato com ícones por status), `NotificationBell` (sino + badge unread), `EmptyState` (ilustração + mensagem + CTA), `Skeleton` (skeleton-placeholder), `PullToRefresh` (RefreshControl wrapper).
- **Ref:** CONVERGENCE_ANALYSIS.md §4.3

#### S2-T04: Criar hooks/stores de saldo e extrato
- **Labels:** `task`, `hook-store`, `P3:estado`, `P7:performance`
- **Descrição:** `notificationStore` ({unreadCount, preferences}), `useSaldo` (React Query, staleTime: 30s), `useExtrato` (React Query infinite query cursor), `useRefreshOnFocus` (refetch quando tela ganha foco).

#### S2-T05: Configurar ConsumerTabs + cache MMKV + AppState
- **Labels:** `task`, `P2:navegacao`, `P8:offline`, `infra`
- **Descrição:** Bottom navigation 4 tabs (Home, QR, Notificações, Perfil) com lucide-react-native. React Query cache persistence via MMKV. AppState listener para refetch ao voltar do background.

#### S2-T06: [BACKEND] Ajustar endpoints saldo + extrato + criar biometric
- **Labels:** `task`, `backend-dep`, `P4:rede-api`, `P7:performance`
- **Descrição:** Endpoints a criar/ajustar no backend:
  - Ajustar `GET /api/mobile/v1/saldo` — adicionar `proximo_a_expirar: { valor, quantidade }`
  - Ajustar `GET /api/mobile/v1/extrato` — eager load `with('empresa')` (fix N+1)
  - Criar `POST /api/mobile/v1/auth/biometric/enroll`
  - Criar `POST /api/mobile/v1/auth/biometric/verify`
- **Ref:** CONVERGENCE_ANALYSIS.md §2.3 #6-7, §2.4 #1-2

### Critérios de Aceite
- [ ] Dashboard exibe: saldo total, valor expirando, 5 últimas transações, badge notificação
- [ ] Saldo Detail exibe breakdown por empresa com logos
- [ ] Pull-to-refresh funcional
- [ ] Skeleton loading durante fetch inicial
- [ ] EmptyState quando sem transações
- [ ] Dados financeiros com staleTime curto (30s)
- [ ] Cache persiste em MMKV — app reaberto exibe dados do cache
- [ ] ConsumerTabs bottom bar funcional
- [ ] Touch targets >= 48dp

### Dependências
- **Sprint:** Sprint 1 (auth + token + perfil consumidor)
- **Backend:** Ajuste saldo (proximo_a_expirar) + fix N+1 extrato

### Riscos
- **R4:** Tabela notificações in-app inexistente → unreadCount pode usar endpoint separado
- **R8:** Extrato mobile com N+1 query → Backend deve corrigir eager load

---

## EPIC #4 — Sprint 3: Transações + Histórico

**Milestone:** `Sprint 3 — Transações + Histórico`
**Labels:** `epic`, `P4:rede-api`, `P6:ui-ux`, `P7:performance`, `P8:offline`
**Semanas:** 7-8 (2026-04-13 → 2026-04-24)
**Depende de:** Epic #3 (Sprint 2)

### Objetivo
Completar a jornada do consumidor com extrato detalhado (infinite scroll cursor-based), histórico de uso e contestações.

### Tasks

#### S3-T01: Implementar Extrato Screen (infinite scroll)
- **Labels:** `task`, `screen`, `P4:rede-api`, `P6:ui-ux`, `P7:performance`
- **Descrição:** Extrato completo com infinite scroll cursor-based (+20 por página). Filtros: empresa, status cashback (pendente/confirmado/utilizado/expirado), período. FlashList com estimatedItemSize. Abort controller ao sair da tela. Offline: dados do cache.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Consumer > Extrato

#### S3-T02: Implementar Histórico de Uso Screen
- **Labels:** `task`, `screen`, `P6:ui-ux`
- **Descrição:** Histórico de transações de utilização com detalhes (empresa, valor original, cashback usado). Filtros por período.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Consumer > Histórico

#### S3-T03: Implementar Contestação (Lista + Criar)
- **Labels:** `task`, `screen`, `P4:rede-api`, `P6:ui-ux`
- **Descrição:** Lista de contestações com status por badge colorido (pendente/em_analise/aprovada/rejeitada). Criar contestação: selecionar tipo + descrição. Integrar com `GET/POST /api/mobile/v1/contestacoes`.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Consumer > Contestação

#### S3-T04: Criar componentes SwipeAction + FilterChips + TransactionCard
- **Labels:** `task`, `component`, `P6:ui-ux`
- **Descrição:** `SwipeAction` (swipe-to-action em listas), `FilterChips` (chips de filtro por status + período), `TransactionCard` (card detalhado com empresa/valor/status/data), `ContestacaoForm` (tipo select + descrição textarea).

#### S3-T05: Criar hooks de extrato + contestações
- **Labels:** `task`, `hook-store`, `P3:estado`, `P4:rede-api`
- **Descrição:** `useExtratoInfinite` (useInfiniteQuery cursor), `useContestacoes` (listar), `useContestacaoCreate` (mutation + invalidação), `useExtratoFilters` (estado local filtros).

#### S3-T06: [BACKEND] Criar endpoints QR validate + sessions
- **Labels:** `task`, `backend-dep`, `P4:rede-api`, `P5:auth-seguranca`, `blocker`
- **Descrição:** Endpoints a criar no backend:
  - `POST /api/v1/qrcode/validate` — lojista valida QR token (prep Sprint 5)
  - `GET /api/mobile/v1/auth/sessions` — listar sessões ativas
  - `DELETE /api/mobile/v1/auth/sessions/{id}` — revogar sessão
  - Ajustar `POST /api/mobile/v1/utilizacao/qrcode` — persistir token Redis TTL 5min (prep Sprint 5)
- **Ref:** CONVERGENCE_ANALYSIS.md §2.3 #11-13, §2.4 #3

### Critérios de Aceite
- [ ] Extrato infinite scroll cursor-based (+20/página)
- [ ] Filtros funcionais: empresa, status cashback, período
- [ ] Histórico de utilização com detalhes
- [ ] Contestações: lista com badges + criar com validação
- [ ] Infinite scroll performático: sem flicker
- [ ] Offline: dados do cache + indicador
- [ ] Abort controller cancela requests ao navegar

### Dependências
- **Sprint:** Sprint 2 (ConsumerTabs, SaldoCard, hooks base)
- **Backend:** Fix N+1 extrato (se pendente), QR token persistence (para Sprint 5)

### Riscos
- **R3:** QR sem persistência — bloqueante para Sprint 5, deve começar agora

---

## EPIC #5 — Sprint 4: Cashback + Resgate

**Milestone:** `Sprint 4 — Cashback + Resgate`
**Labels:** `epic`, `P4:rede-api`, `P5:auth-seguranca`, `P6:ui-ux`, `P9:nativo`
**Semanas:** 9-10 (2026-04-27 → 2026-05-08)
**Depende de:** Epic #2 (Sprint 1), Epic #1 (Sprint 0)

### Objetivo
Construir o core do lojista — gerar cashback (CPF + valor), utilizar cashback (FEFO) e seleção multi-empresa.

### Tasks

#### S4-T01: Implementar Cashback Menu Screen
- **Labels:** `task`, `screen`, `P6:ui-ux`
- **Descrição:** Menu principal do lojista com opções: Gerar Cashback, Utilizar Cashback. FAB para ação rápida.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Merchant > Cashback Menu

#### S4-T02: Implementar Gerar Cashback Screen
- **Labels:** `task`, `screen`, `P4:rede-api`, `P6:ui-ux`, `P9:nativo`
- **Descrição:** Fluxo: busca CPF → selecionar campanha → digitar valor → bottom sheet confirmação → sucesso com haptic. Idempotency-Key via `crypto.randomUUID()`. Integrar com `POST /api/v1/cashback`.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Merchant > Gerar Cashback

#### S4-T03: Implementar Utilizar Cashback Screen
- **Labels:** `task`, `screen`, `P4:rede-api`, `P6:ui-ux`, `P9:nativo`
- **Descrição:** Fluxo: busca CPF → ver saldo disponível → digitar valor → FEFO aplicado → confirmar → sucesso com haptic. Integrar com `POST /api/v1/cashback/utilizar`.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Merchant > Utilizar Cashback

#### S4-T04: Implementar Multiloja Screen
- **Labels:** `task`, `screen`, `P2:navegacao`, `P5:auth-seguranca`
- **Descrição:** Modal/tela de seleção de empresa para lojistas multi-tenant. Avatar + nome fantasia. Switch empresa via `POST /api/v1/auth/switch-empresa`. Header atualiza + dados refetchados.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Merchant > Multiloja

#### S4-T05: Criar componentes FAB + BottomSheetSelect + CPFSearchInput
- **Labels:** `task`, `component`, `P6:ui-ux`
- **Descrição:** `FAB` (flutuante bottom-right 56x56dp), `BottomSheetSelect` (selector em bottom sheet para campanhas/unidades), `CPFSearchInput` (máscara CPF + busca ao completar 11 dígitos), `CashbackConfirmation` (bottom sheet resumo), `MultilojaSelector` (seleção empresa).

#### S4-T06: Criar hooks de cashback + cliente search
- **Labels:** `task`, `hook-store`, `P3:estado`, `P4:rede-api`
- **Descrição:** Reutilizar `multilojaStore` do shared. Criar `useCashbackCreate` (mutation + idempotency), `useCashbackUtilizar` (mutation FEFO), `useClienteSearch` (query + debounce CPF), `useCampanhas` (campanhas ativas).

#### S4-T07: Configurar MerchantTabs + haptics + idempotency
- **Labels:** `task`, `P2:navegacao`, `P9:nativo`, `infra`
- **Descrição:** Bottom navigation 4 tabs (Dashboard, Cashback, Clientes, Mais) com lucide-react-native. Configurar expo-haptics para feedback tátil. Configurar Idempotency-Key header no Axios interceptor. Guard de navegação para perfil lojista.

### Critérios de Aceite
- [ ] Gerar cashback: CPF → campanha → valor → confirmar → sucesso + haptic
- [ ] Utilizar cashback: CPF → saldo → valor → FEFO → confirmar → sucesso
- [ ] Cancelar venda: swipe/botão → confirmação → cancelamento
- [ ] Idempotency key previne duplicação
- [ ] Multiloja: lista → selecionar → header atualiza → refetch
- [ ] Offline queue para gerar cashback
- [ ] Bottom sheet de confirmação com resumo
- [ ] Feedback tátil (expo-haptics)
- [ ] MerchantTabs bottom navigation funcional

### Dependências
- **Sprint:** Sprint 1 (auth lojista), Sprint 0 (shared services)
- **Backend:** Nenhum endpoint novo (todos existentes — 62 endpoints web)

### Riscos
- Idempotency key em offline queue: gerar antes de enfileirar
- Lojista com assinatura inativa (402): interceptor redireciona para Config

---

## EPIC #6 — Sprint 5: QR Code + Push Notifications

**Milestone:** `Sprint 5 — QR Code + Push`
**Labels:** `epic`, `P5:auth-seguranca`, `P9:nativo`, `P10:push`
**Semanas:** 11-12 (2026-05-11 → 2026-05-22)
**Depende de:** Epic #4 (Sprint 3), Epic #3 (Sprint 2)

### Objetivo
Implementar o fluxo QR Code end-to-end (consumidor gera, lojista escaneia e valida) e a central de notificações push com preferências.

### Tasks

#### S5-T01: Implementar QR Code Screen (consumidor)
- **Labels:** `task`, `screen`, `P9:nativo`, `P5:auth-seguranca`
- **Descrição:** Gerar QR code com token efêmero. Countdown de 5min. Auto-regenerar ao expirar. Haptic feedback. Integrar com `POST /api/mobile/v1/utilizacao/qrcode`.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Consumer > QR Code

#### S5-T02: Implementar QR Scan Screen (lojista)
- **Labels:** `task`, `screen`, `P9:nativo`, `P4:rede-api`
- **Descrição:** Câmera com overlay para scan QR. Solicitar permissão câmera com UX amigável. Validar via `POST /api/v1/qrcode/validate`. Exibir dados do cliente + saldo.
- **Depende de:** S3-T06 (endpoint QR validate no backend)

#### S5-T03: Implementar Notifications Screen + Preferences
- **Labels:** `task`, `screen`, `P10:push`, `P6:ui-ux`
- **Descrição:** Lista paginada de notificações. Swipe to mark read. "Marcar todas como lidas". Tela de preferências: toggle push/email/marketing.
- **Depende de:** S5-T07 (endpoints notificação no backend)

#### S5-T04: Criar componentes QRCodeDisplay + QRCodeScanner + PermissionRequest
- **Labels:** `task`, `component`, `P9:nativo`
- **Descrição:** `QRCodeDisplay` (QR + countdown + animação), `QRCodeScanner` (câmera + overlay), `PermissionRequest` (UX solicitação permissão), `NotificationItem` (item lida/não-lida), `CountdownTimer` (expiração QR).

#### S5-T05: Criar hooks push + notifications + QR
- **Labels:** `task`, `hook-store`, `P10:push`, `P9:nativo`
- **Descrição:** `usePushNotifications` (register device token, foreground/background/tap handlers), `useNotifications` (query cursor), `useNotificationPreferences` (GET/PATCH), `useQRCode` (gerar + countdown + auto-refresh), `useCamera` (permissão + estado).

#### S5-T06: Configurar expo-camera + expo-notifications + deep linking
- **Labels:** `task`, `P9:nativo`, `P10:push`, `infra`
- **Descrição:** Configurar expo-camera (permissão, preview). Configurar expo-notifications (token registration, foreground/background/tap handlers, channels Android, categories iOS). Deep linking para notification tap.

#### S5-T07: [BACKEND] Criar tabela notifications + 6 endpoints
- **Labels:** `task`, `backend-dep`, `P10:push`, `priority:high`, `blocker`
- **Descrição:** Endpoints a criar no backend:
  - Criar tabela `notifications` (in-app) + model + migration
  - `GET /api/mobile/v1/notifications` — listar paginadas
  - `PATCH /api/mobile/v1/notifications/{id}/read` — marcar como lida
  - `POST /api/mobile/v1/notifications/read-all` — marcar todas
  - `GET /api/mobile/v1/notifications/preferences` — preferências
  - `PATCH /api/mobile/v1/notifications/preferences` — atualizar
- **Ref:** CONVERGENCE_ANALYSIS.md §2.3 #8-10, #14-15, §2.5

### Critérios de Aceite
- [ ] Consumidor gera QR com countdown de 5min, regenera ao expirar
- [ ] Lojista escaneia QR → valida → exibe dados (cliente, saldo)
- [ ] Permissão câmera com UX amigável
- [ ] Push: token registrado no backend ao primeiro login
- [ ] Push foreground: toast sem interromper
- [ ] Push background: badge + ação ao tap (navega corretamente)
- [ ] Central notificações: lista paginada, swipe mark read, "marcar todas"
- [ ] Preferências: toggle push/email/marketing via API
- [ ] Haptic feedback em QR gerado/validado

### Dependências
- **Sprint:** Sprint 3 (QR token persistence Redis), Sprint 2 (NotificationBell)
- **Backend:** 6 endpoints notificação + tabela notifications + QR validate

### Riscos
- **R3:** QR sem persistência — bloqueante, deve estar resolvido no Sprint 3
- **R4:** Tabela notificações inexistente
- **R7:** Push sem integração FCM/APNs verificada

---

## EPIC #7 — Sprint 6: Biometria + Configurações

**Milestone:** `Sprint 6 — Biometria + Config`
**Labels:** `epic`, `P5:auth-seguranca`, `P7:performance`, `P8:offline`, `P9:nativo`, `P14:acessibilidade`
**Semanas:** 13-14 (2026-05-25 → 2026-06-05)
**Depende de:** Epic #6 (Sprint 5), Epic #3 (Sprint 2 — endpoints biometria)

### Objetivo
Login biométrico (FaceID/TouchID), modo offline robusto, dark mode, acessibilidade avançada — sprint cross-cutting que melhora features existentes.

### Tasks

#### S6-T01: Implementar login biométrico
- **Labels:** `task`, `P5:auth-seguranca`, `P9:nativo`
- **Descrição:** Após primeiro login com senha, oferecer ativar biometria. Logins seguintes usam biometria. Fallback para senha após 3 falhas. Check disponibilidade de hardware. Integrar com endpoints biometric enroll/verify.
- **Depende de:** S2-T06 (endpoints biometria no backend)

#### S6-T02: Implementar dark mode
- **Labels:** `task`, `P6:ui-ux`
- **Descrição:** Toggle dark/light no perfil. Persistir em MMKV. Respeitar preferência do sistema como default. Aplicar tokens lightTheme/darkTheme do @cashback/shared.

#### S6-T03: Implementar offline queue + stale indicator
- **Labels:** `task`, `P8:offline`
- **Descrição:** Mutations offline enfileiradas em MMKV. Executar automaticamente ao reconectar. Limite: 50 items + TTL 24h. Indicador visual de "dados possivelmente desatualizados" em telas com cache.

#### S6-T04: Implementar session timeout + sessions management
- **Labels:** `task`, `P5:auth-seguranca`
- **Descrição:** Auto-logout após 15min inatividade. Tela mascarada ao voltar do background. Visualizar e revogar sessões ativas de outros devices.
- **Depende de:** S3-T06 (endpoints sessions no backend)

#### S6-T05: Accessibility audit (WCAG AA)
- **Labels:** `task`, `P14:acessibilidade`
- **Descrição:** accessibilityLabel em todos os elementos interativos. Verificar contraste >= 4.5:1 em ambos os temas. Testar com screen reader (VoiceOver/TalkBack). Corrigir problemas encontrados.

#### S6-T06: Criar componentes BiometricPrompt + SessionCard + ThemeToggle
- **Labels:** `task`, `component`, `P9:nativo`, `P5:auth-seguranca`, `P6:ui-ux`
- **Descrição:** `BiometricPrompt` (prompt nativo + fallback senha), `SessionCard` (device, plataforma, last active, revogar), `OfflineIndicator` (dados desatualizados), `ThemeToggle` (switch dark/light).

#### S6-T07: Criar stores/hooks biometria + offline + timeout
- **Labels:** `task`, `hook-store`, `P5:auth-seguranca`, `P8:offline`, `P9:nativo`
- **Descrição:** `deviceStore` ({deviceId, pushToken, biometricAvailable, biometricEnrolled}), `useBiometric` (check/enroll/verify), `useSessionTimeout` (auto-logout), `useOfflineQueue` (enqueue/flush), `themeStore` adaptado (useColorScheme + MMKV).

### Critérios de Aceite
- [ ] Login biométrico funcional com fallback
- [ ] Biometria check de hardware antes de oferecer
- [ ] Dark mode: toggle funcional, persiste, respeita sistema
- [ ] Offline queue: mutations enfileiradas e executadas ao reconectar
- [ ] Session timeout: auto-logout 15min + tela mascarada
- [ ] Acessibilidade: labels, contraste >= 4.5:1
- [ ] Dados sensíveis mascarados ao background (P5)
- [ ] Sessions: visualizar e revogar

### Dependências
- **Sprint:** Sprint 5, Sprint 2 (endpoints biometria no backend)
- **Backend:** Endpoints biometria e sessões prontos

### Riscos
- Biometria não disponível em todos devices → Fallback obrigatório
- Dark mode contraste em third-party → Testar manualmente
- Offline queue crescimento → Limitar 50 items + 24h TTL

---

## EPIC #8 — Sprint 7: Gestão Lojista

**Milestone:** `Sprint 7 — Gestão Lojista`
**Labels:** `epic`, `P4:rede-api`, `P6:ui-ux`, `P7:performance`, `P11:testes`
**Semanas:** 15-16 (2026-06-08 → 2026-06-19)
**Depende de:** Epic #5 (Sprint 4), Epic #1 (Sprint 0)

### Objetivo
Construir todas as telas de gestão do lojista — dashboard, clientes, campanhas, vendas, contestações, configurações, relatórios.

### Tasks

#### S7-T01: Implementar Merchant Dashboard
- **Labels:** `task`, `screen`, `P4:rede-api`, `P6:ui-ux`, `P7:performance`
- **Descrição:** 4 cards de métricas (stats), gráfico de evolução (chart), últimas transações, top clientes. 4 queries em paralelo. Pull-to-refresh.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Merchant > Dashboard

#### S7-T02: Implementar Clientes (Lista + Detalhe + Extrato)
- **Labels:** `task`, `screen`, `P4:rede-api`, `P6:ui-ux`, `P7:performance`
- **Descrição:** Lista paginada com busca (nome/email/CPF). Detalhe do cliente com saldo. Extrato do cliente. FlashList para virtualização.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Merchant > Clientes

#### S7-T03: Implementar Campanhas CRUD
- **Labels:** `task`, `screen`, `P4:rede-api`, `P6:ui-ux`
- **Descrição:** Listar campanhas (ativas/inativas). Criar/editar via bottom sheet form (nome, datas, percentual, validade). Excluir com confirmação.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Merchant > Campanhas

#### S7-T04: Implementar Vendas Screen
- **Labels:** `task`, `screen`, `P4:rede-api`, `P6:ui-ux`
- **Descrição:** Listagem com filtros (status, data, campanha, cliente). Paginação. Pull-to-refresh.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Merchant > Vendas

#### S7-T05: Implementar Contestações Lojista
- **Labels:** `task`, `screen`, `P4:rede-api`, `P6:ui-ux`
- **Descrição:** Lista com filtros (status, tipo, data). Responder: aprovar/rejeitar com resposta texto.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Merchant > Contestações

#### S7-T06: Implementar Configurações + Upload Logo
- **Labels:** `task`, `screen`, `P4:rede-api`, `P6:ui-ux`
- **Descrição:** Editar dados da empresa + percentual + validade + modo saldo + carência. Upload logo com preview (expo-image-picker + FormData).
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Merchant > Configurações

#### S7-T07: Implementar Relatórios Screen
- **Labels:** `task`, `screen`, `P4:rede-api`, `P6:ui-ux`
- **Descrição:** Métricas resumidas com filtro de período. Reutilizar `relatorio.service` do shared.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Merchant > Relatórios

#### S7-T08: Implementar Menu "Mais" Screen
- **Labels:** `task`, `screen`, `P2:navegacao`, `P6:ui-ux`
- **Descrição:** Lista de itens com ícones + badge notificação. Links para: campanhas, vendas, contestações, config, relatórios.
- **Ref:** MOBILE_PROJECT_SPEC.md §3 Merchant > More Menu

#### S7-T09: Criar componentes StatsCard + ChartCard + DataTable + forms
- **Labels:** `task`, `component`, `P6:ui-ux`
- **Descrição:** `StatsCard` (métrica + ícone + variação), `ChartCard` (gráfico evolução), `DataTable` (tabela mobile scrollable), `SearchBar` (busca com debounce), `CampanhaForm`, `ContestacaoResponseForm`, `ConfigForm`, `LogoUpload`, `MenuList`.

#### S7-T10: Criar hooks lojista
- **Labels:** `task`, `hook-store`, `P3:estado`, `P4:rede-api`
- **Descrição:** Reutilizar `useDashboard` do shared. Criar `useClientes` (busca + paginação), `useCampanhasCRUD` (mutations + invalidação), `useVendas` (filtros), `useContestacoes` (filtros), `useConfig` (GET/PATCH + logo upload).

### Critérios de Aceite
- [ ] Dashboard: 4 cards + gráfico + transações + top clientes
- [ ] Clientes: busca + paginação + detalhe + extrato
- [ ] Campanhas: CRUD completo com confirmação
- [ ] Vendas: filtros + paginação
- [ ] Contestações: listar + responder (aprovar/rejeitar)
- [ ] Configurações: editar + upload logo com preview
- [ ] Relatórios: métricas com filtro de período
- [ ] Menu "Mais": lista com navegação
- [ ] Todas listas: pull-to-refresh + skeleton + empty state
- [ ] Upload logo funcional

### Dependências
- **Sprint:** Sprint 4 (MerchantTabs, cashback flow), Sprint 0 (shared services)
- **Backend:** Nenhum endpoint novo (62 endpoints web prontos)

### Riscos
- Biblioteca de gráficos: performance em low-end → Testar em device real
- Upload logo em rede lenta → Progresso + timeout 60s
- Volume de dados → FlashList + paginação obrigatória

---

## EPIC #9 — Sprint 8: Polish + E2E + Publicação

**Milestone:** `Sprint 8 — Polish + Publicação`
**Labels:** `epic`, `P7:performance`, `P11:testes`, `P12:ci-cd`, `P13:monitoramento`, `P16:app-stores`
**Semanas:** 17-18 (2026-06-22 → 2026-07-03)
**Depende de:** Epics #1-#8 (Sprints 0-7 completos)

### Objetivo
Polimento final, testes E2E dos fluxos críticos, otimizações de performance, preparação de assets e submissão para Apple App Store e Google Play.

### Tasks

#### S8-T01: Testes E2E — 3 fluxos críticos
- **Labels:** `task`, `P11:testes`, `priority:high`
- **Descrição:** Implementar com Maestro ou Detox:
  1. **Login + Dashboard:** app → login → dashboard → saldo → pull-to-refresh → logout
  2. **Gerar Cashback:** login lojista → Cashback tab → CPF → valor → campanha → confirmar → sucesso
  3. **QR Code:** login consumidor → gerar QR → (switch lojista) → scan → validar → utilizar
- Target cobertura: unitários >= 70%, componentes >= 50%, integração >= 30%, 3 E2E

#### S8-T02: Performance audit + otimizações
- **Labels:** `task`, `P7:performance`
- **Descrição:** Medir cold start (< 3s), TTI Dashboard (< 2s), JS bundle (< 10MB), FPS scroll (60fps). Bundle analysis. Image optimization. Lazy loading de telas. Remover console.log. `useStartupPerformance` hook para Sentry timing.

#### S8-T03: Configurar splash screen + app icon
- **Labels:** `task`, `P16:app-stores`
- **Descrição:** Splash screen com assets finais (logo + cores). App icon: iOS 1024x1024, Android adaptive icon. expo-splash-screen configurado.

#### S8-T04: Configurar OTA updates + Sentry production
- **Labels:** `task`, `P12:ci-cd`, `P13:monitoramento`
- **Descrição:** expo-updates para OTA em produção. EAS Submit (auto-submit). Sentry production (environment, source maps). `useAppUpdate` hook. Configurar analytics (a definir).

#### S8-T05: Preparar assets e metadata para App Stores
- **Labels:** `task`, `P16:app-stores`, `priority:high`
- **Descrição:** Screenshots para App Store (6.7", 6.1", iPad) e Google Play (phone, tablet). Metadata: título, descrição, keywords, categoria, classificação etária. Política de privacidade URL. Privacy labels / data safety.

#### S8-T06: EAS Build production + submissão
- **Labels:** `task`, `P12:ci-cd`, `P16:app-stores`, `priority:critical`
- **Descrição:** EAS Build production gera APK/AAB (Android) e IPA (iOS) assinados. Certificados de assinatura (Android keystore, Apple distribution cert). Submeter Apple App Review. Submeter Google Play review.

#### S8-T07: Dog-fooding + QA final
- **Labels:** `task`, `P11:testes`
- **Descrição:** Mínimo 2 dias de dog-fooding interno. Nenhum crash no Sentry. Verificar todos os fluxos E2E em devices reais. Corrigir issues encontrados.

### Critérios de Aceite
- [ ] 3 E2E passam em simulador iOS e emulador Android
- [ ] Cobertura: unitários >= 70%, componentes >= 50%, integração >= 30%
- [ ] Cold start < 3s em device mid-range
- [ ] JS bundle < 10MB
- [ ] Zero crashes no Sentry durante dog-fooding (2 dias)
- [ ] App icon + splash com assets finais
- [ ] Screenshots para todas resoluções obrigatórias
- [ ] Metadata em pt-BR e en
- [ ] Política de privacidade acessível (URL + in-app)
- [ ] Privacy labels / data safety preenchidos
- [ ] EAS Build production: APK/AAB + IPA assinados
- [ ] App submetido Apple App Review
- [ ] App submetido Google Play review
- [ ] OTA updates configurado

### Dependências
- **Sprint:** Sprints 0-7 completos
- **Backend:** Todos endpoints em produção e estáveis
- **Design:** Assets finais aprovados
- **Legal:** Política de privacidade publicada

### Riscos
- Apple Review pode rejeitar → Prever 1-2 ciclos (5-7 dias cada)
- Google Play data safety → Prever ajustes
- OTA: apenas JS bundle, não mudanças nativas

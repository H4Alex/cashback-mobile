# MOBILE_PROJECT_SPEC
# Projeto: SaaS Cashback — App Mobile
# Fase: 4 — Spec Completa
# Baseado em: BACKEND_ANALYSIS + FRONTEND_ANALYSIS + CONVERGENCE_ANALYSIS
# Gerado em: 2026-02-25
# Prompt: MOBILE_ANALYSIS_PROMPTS v4

---

## 1. Visão Geral

**Nome do app:** H4 Cashback

**Descrição:** Aplicativo mobile para o ecossistema SaaS Cashback que permite consumidores consultarem saldos, resgatarem cashback via QR Code e receberem notificações, enquanto lojistas gerenciam operações de cashback, clientes e campanhas diretamente do celular.

**Público-alvo por perfil:**

| Perfil | Descrição | Funcionalidades principais |
|--------|-----------|---------------------------|
| **Consumidor** | Cliente final que acumula e resgata cashback em lojas parceiras | Saldo, extrato, QR Code para resgate, push notifications, contestações |
| **Lojista** | Proprietário, gestor, operador ou vendedor de empresa cadastrada | Gerar/utilizar cashback, gerenciar clientes, campanhas, vendas, dashboard |

**Plataformas:** iOS 15+ e Android 10+ via Expo managed workflow (SDK ~52)

**Objetivos do MVP (Features P0):**
(Ref: CONVERGENCE_ANALYSIS.md — Seção 1, features com status FALTANTE/A CONSTRUIR)

1. Autenticação completa: login, registro, forgot password, OAuth Apple/Google, delete account (LGPD)
2. Dashboard do consumidor com saldo total, breakdown por empresa, extrato cursor-based e histórico
3. Geração de QR Code pelo consumidor e validação pelo lojista para resgate de cashback
4. Push notifications com registro de device, histórico in-app e preferências
5. Operações de cashback do lojista: gerar (CPF + valor), utilizar (FEFO), cancelar
6. Dashboard simplificado do lojista com stats, gráfico e top clientes
7. Perfil do consumidor: edição, alteração de senha, exclusão de conta
8. Modo offline com dados em cache (stale-while-revalidate)

**Roadmap pós-MVP (Features P1/P2):**

| Prioridade | Feature | Sprint estimado |
|-----------|---------|-----------------|
| P1 | Biometria (FaceID/TouchID) para login rápido | Sprint 6 |
| P1 | Gestão completa do lojista (campanhas CRUD, relatórios, configurações) | Sprint 7 |
| P1 | Dark mode completo com toggle persistente | Sprint 6 |
| P1 | Accessibility audit (WCAG AA) | Sprint 8 |
| P1 | Animações e micro-interações (Reanimated) | Sprint 8 |
| P2 | Gerenciamento de sessões multi-device | Futuro |
| P2 | Offline-first com sync queue | Futuro |
| P2 | 2FA (TOTP) no mobile | Futuro |
| P2 | Widget de saldo na home screen | Futuro |
| P2 | In-app review prompt | Futuro |

---

## 2. Arquitetura Técnica

### 2.1 Estrutura de Pastas de packages/mobile/

```
packages/mobile/
├── app/                                # Expo Router — file-based routing
│   ├── _layout.tsx                     # Root layout (providers, auth guard global)
│   ├── index.tsx                       # Entry — redirect baseado em auth state
│   ├── (auth)/                         # Auth stack (público)
│   │   ├── _layout.tsx                 # Stack layout sem header
│   │   ├── login.tsx                   # Tela de login
│   │   ├── register.tsx                # Registro (consumer CPF / merchant CNPJ)
│   │   ├── forgot-password.tsx         # Wizard 4 steps
│   │   └── onboarding.tsx              # Primeiro acesso / boas-vindas
│   ├── (consumer)/                     # Consumer area (guard: api_mobile JWT)
│   │   ├── _layout.tsx                 # Tab layout consumidor
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx             # Bottom tab bar config (4 tabs)
│   │   │   ├── home/
│   │   │   │   ├── index.tsx           # Dashboard consumidor
│   │   │   │   ├── saldo.tsx           # Saldo detalhado por empresa
│   │   │   │   ├── extrato.tsx         # Extrato cashback (cursor pagination)
│   │   │   │   └── historico.tsx        # Histórico de uso/resgates
│   │   │   ├── qrcode.tsx              # Gerar QR Code para resgate
│   │   │   ├── notifications/
│   │   │   │   ├── index.tsx           # Lista de notificações
│   │   │   │   └── preferences.tsx     # Preferências de notificação
│   │   │   └── profile/
│   │   │       ├── index.tsx           # Perfil do consumidor
│   │   │       ├── edit.tsx            # Editar dados pessoais
│   │   │       ├── change-password.tsx # Alterar senha
│   │   │       └── delete-account.tsx  # Excluir conta (LGPD)
│   │   └── contestacao/
│   │       ├── index.tsx               # Listar contestações
│   │       └── create.tsx              # Criar contestação
│   ├── (merchant)/                     # Merchant area (guard: api JWT)
│   │   ├── _layout.tsx                 # Tab layout lojista
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx             # Bottom tab bar config (4 tabs)
│   │   │   ├── dashboard.tsx           # Dashboard lojista
│   │   │   ├── cashback/
│   │   │   │   ├── index.tsx           # Menu gerar/utilizar
│   │   │   │   ├── gerar.tsx           # Gerar cashback (CPF + valor)
│   │   │   │   ├── utilizar.tsx        # Utilizar cashback (FEFO)
│   │   │   │   └── qr-scan.tsx         # Escanear QR do consumidor
│   │   │   ├── clientes/
│   │   │   │   ├── index.tsx           # Listagem de clientes
│   │   │   │   ├── [id].tsx            # Detalhe do cliente
│   │   │   │   └── [id]/extrato.tsx    # Extrato do cliente
│   │   │   └── more/
│   │   │       ├── index.tsx           # Menu expandido
│   │   │       ├── campanhas.tsx       # Gestão de campanhas
│   │   │       ├── vendas.tsx          # Listagem de vendas
│   │   │       ├── contestacoes.tsx    # Contestações do lojista
│   │   │       ├── config.tsx          # Configurações da empresa
│   │   │       └── relatorios.tsx      # Relatórios simplificados
│   │   └── multiloja.tsx               # Seleção de empresa (multi-tenant)
│   └── (shared)/                       # Telas compartilhadas
│       ├── privacy-policy.tsx          # Política de privacidade
│       └── consent.tsx                 # Consentimento LGPD
├── src/
│   ├── components/                     # Componentes UI nativos
│   │   ├── base/                       # Atômicos: Button, Input, Card, Badge, Loading...
│   │   ├── cards/                      # MetricCard, CashbackCard, SaldoCard
│   │   ├── cashback/                   # CustomerSearch, CashbackSummary, Sucesso
│   │   ├── feedback/                   # Skeleton, EmptyState, OfflineBanner, Toast
│   │   ├── navigation/                 # TabBar customizada, Header
│   │   └── mobile-only/               # QRCodeScanner, QRCodeDisplay, BiometricPrompt
│   ├── hooks/                          # Hooks mobile-specific
│   │   ├── useAppState.ts              # Lifecycle foreground/background
│   │   ├── useConnectivity.ts          # Status de rede (NetInfo)
│   │   ├── useBiometric.ts             # Biometria
│   │   └── usePushNotifications.ts     # Push token + handlers
│   ├── services/                       # Infra services mobile-specific
│   │   ├── mobileApiClient.ts          # Axios instance + interceptors mobile
│   │   ├── pushNotificationService.ts  # expo-notifications wrapper
│   │   ├── biometricService.ts         # expo-local-authentication wrapper
│   │   ├── connectivityService.ts      # NetInfo wrapper
│   │   ├── secureStorageService.ts     # expo-secure-store wrapper
│   │   ├── cacheService.ts             # MMKV wrapper
│   │   └── errorReportingService.ts    # @sentry/react-native wrapper
│   ├── stores/                         # Stores mobile-only
│   │   ├── deviceStore.ts              # Device info, push token, biometric
│   │   ├── notificationStore.ts        # Unread count, preferences
│   │   └── connectivityStore.ts        # Online/offline, connection type
│   ├── theme/                          # Sistema de tema
│   │   ├── ThemeProvider.tsx            # Context provider
│   │   ├── tokens.ts                   # Re-exporta de @cashback/shared
│   │   └── platformAdapters.ts         # Sombras, tipografia platform-specific
│   ├── config/                         # Configuração
│   │   ├── env.ts                      # Variáveis de ambiente (expo-constants)
│   │   ├── queryClient.ts             # React Query config mobile
│   │   └── i18n.ts                     # i18next config (expo-localization)
│   └── utils/                          # Utils mobile-specific
│       ├── storageAdapters.ts          # Implementações de StorageAdapter
│       └── permissions.ts              # Helpers de permissões nativas
├── assets/
│   ├── fonts/                          # DM Sans, Space Mono
│   ├── images/                         # Ilustrações, ícones, splash
│   └── animations/                     # Lottie files (se aplicável)
├── app.config.ts                       # Configuração Expo (dinâmica)
├── eas.json                            # EAS Build profiles
├── metro.config.js                     # Metro bundler (monorepo support)
├── babel.config.js                     # Babel config (reanimated plugin)
├── jest.config.ts                      # Jest para testes
├── tsconfig.json                       # TypeScript (extends base)
└── package.json                        # Dependências mobile
```

### 2.2 Stack Tecnológica

(Ref: CONVERGENCE_ANALYSIS.md — Seção 9)

| Categoria | Pacote | Versão | Função |
|-----------|--------|--------|--------|
| **Core** | `expo` | ~52 | Framework managed workflow |
| | `react` | 18.3.x | UI runtime |
| | `react-native` | 0.76.x | Plataforma nativa |
| | `typescript` | ~5.3 | Linguagem (strict mode) |
| **Navegação** | `expo-router` | latest | File-based routing (sobre React Navigation) |
| | `@react-navigation/bottom-tabs` | latest | Tab navigator |
| | `@react-navigation/native-stack` | latest | Stack navigator |
| **Estado** | `zustand` | ^4.4 | Estado global (via @cashback/shared) |
| | `@tanstack/react-query` | ^5.14 | Cache do servidor |
| | `@tanstack/query-async-storage-persister` | ^5 | Persistência de cache em MMKV |
| **Rede** | `axios` | ^1.6 | HTTP client (via @cashback/shared) |
| **Validação** | `zod` | ^4.3 | Schemas (via @cashback/shared) |
| | `react-hook-form` | ^7.71 | Formulários |
| | `@hookform/resolvers` | latest | Integração Zod ↔ RHF |
| **Storage** | `expo-secure-store` | latest | Tokens e dados sensíveis |
| | `react-native-mmkv` | latest | Cache e preferências |
| **Segurança** | `expo-local-authentication` | latest | Biometria |
| | `expo-crypto` | latest | Funções criptográficas |
| **UI** | `react-native-reanimated` | latest | Animações nativas (UI thread) |
| | `react-native-gesture-handler` | latest | Gestos (swipe, pan) |
| | `@gorhom/bottom-sheet` | latest | Bottom sheets |
| | `react-native-safe-area-context` | latest | Safe areas (notch, home indicator) |
| | `expo-font` | latest | Fontes customizadas |
| | `expo-image` | latest | Imagens otimizadas com cache |
| | `lucide-react-native` | latest | Ícones SVG |
| | `react-native-svg` | latest | SVG rendering |
| | `react-native-toast-message` | latest | Toasts |
| | `react-native-skeleton-placeholder` | latest | Skeletons de loading |
| | `@shopify/flash-list` | latest | Listas virtualizadas |
| | `react-native-qrcode-svg` | latest | Geração de QR code |
| **Nativo** | `expo-camera` | latest | QR Code scanner |
| | `expo-notifications` | latest | Push notifications |
| | `expo-haptics` | latest | Feedback tátil |
| | `expo-splash-screen` | latest | Splash screen |
| | `expo-device` | latest | Informações do device |
| | `expo-constants` | latest | Variáveis de ambiente |
| | `expo-localization` | latest | Locale do device |
| | `@react-native-community/netinfo` | latest | Status de conectividade |
| | `expo-sharing` | latest | Compartilhar comprovantes |
| | `expo-file-system` | latest | Sistema de arquivos |
| **i18n** | `i18next` | ^23.7 | Framework i18n (via @cashback/shared) |
| | `react-i18next` | ^14.0 | Integração React |
| **Monitoramento** | `@sentry/react-native` | latest | Crash reporting + performance |
| **Testes** | `jest` | latest | Test runner |
| | `@testing-library/react-native` | latest | Renderização + queries |
| | `msw` | ^2.12 | Mock HTTP |
| **CI/CD** | `eas-cli` | latest | EAS Build + Submit |
| | `expo-updates` | latest | OTA updates |

### 2.3 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────────┐
│  COMPONENTE (Tela)                                                  │
│  └─ Renderiza dados, captura interações do usuário                  │
│     └─ usa: estados locais (useState), tema (ThemeContext)          │
└───────────────┬──────────────────────────────────────┬──────────────┘
                │ leitura                              │ escrita
                ▼                                      ▼
┌───────────────────────────┐    ┌────────────────────────────────────┐
│  HOOK (useQuery/custom)   │    │  MUTATION (useMutation)             │
│  └─ React Query cache     │    │  └─ Optimistic update              │
│     staleTime: 60s        │    │     invalidation automática         │
│     gcTime: 15min         │    │     onError: rollback               │
│     persistência: MMKV    │    └─────────────┬──────────────────────┘
└───────────────┬───────────┘                  │
                │                              │
                ▼                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SERVICE (@cashback/shared)                                         │
│  └─ Funções tipadas por domínio (auth, cashback, cliente...)        │
│     └─ Retorna Promise<T> com tipos TypeScript                      │
└───────────────┬─────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  API CLIENT (mobileApiClient.ts)                                    │
│  └─ Axios instance com interceptors:                                │
│     Request:  JWT injection (SecureStore) → Rate limiting → CorrelID│
│     Response: 401 refresh → 402 alert → 429 backoff → Error format  │
└───────────────┬─────────────────────────────────────────────────────┘
                │ HTTPS
                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  BACKEND (Laravel 11.31)                                            │
│  └─ Guard api (lojista) ou api_mobile (consumidor)                  │
│     └─ empresa.scope → check.assinatura → check.perfil             │
└─────────────────────────────────────────────────────────────────────┘
```

**Onde cada tipo de estado vive:**

| Tipo de Estado | Tecnologia | Exemplo | Persistência |
|---------------|-----------|---------|-------------|
| **Local (UI)** | `useState` / `useReducer` | Form inputs, modal open/close, tab selecionada | Em memória |
| **Global (App)** | Zustand stores | Auth, theme, multiloja, device, connectivity | SecureStore (tokens), MMKV (prefs) |
| **Servidor (Cache)** | React Query | Transações, saldo, extrato, clientes, campanhas | MMKV (24h, exclui PII) |
| **Derivado** | Zustand selectors / useMemo | `isAuthenticated`, `isMultiloja`, `hasUnidades` | Não persistido |

### 2.4 Diagrama de Navegação

(Ref: CONVERGENCE_ANALYSIS.md — Seção 5, refinado com FRONTEND_ANALYSIS.md — Seção 5)

```
app/_layout.tsx (Root)
│
├─ Providers: ThemeProvider → QueryClientProvider → i18n → Sentry → SafeAreaProvider
│
├─ index.tsx — Redirect condicional:
│   ├─ token ausente/expirado → (auth)/login
│   ├─ token válido + consumidor → (consumer)/(tabs)/home
│   └─ token válido + lojista → (merchant)/(tabs)/dashboard
│
├─ (auth)/ ──────────────────── STACK (público, sem bottom tabs)
│   ├─ login.tsx                Login email+senha, OAuth Apple/Google
│   ├─ register.tsx             Toggle Consumidor (CPF) / Lojista (CNPJ)
│   ├─ forgot-password.tsx      Wizard: email → código → nova senha → sucesso
│   └─ onboarding.tsx           Slides de boas-vindas (primeiro acesso)
│
├─ (consumer)/ ──────────────── TABS (guard: JWT api_mobile)
│   ├─ Tab 1: Home 🏠
│   │   ├─ home/index.tsx       Dashboard (saldo, expirando, recentes)
│   │   ├─ home/saldo.tsx       Breakdown por empresa
│   │   ├─ home/extrato.tsx     Timeline com filtros + cursor pagination
│   │   └─ home/historico.tsx   Histórico de resgates
│   ├─ Tab 2: QR Code 📱
│   │   └─ qrcode.tsx           Gerar QR para resgate na loja
│   ├─ Tab 3: Avisos 🔔
│   │   ├─ notifications/       Lista de notificações + badge
│   │   └─ notifications/preferences  Toggle por categoria
│   └─ Tab 4: Perfil 👤
│       ├─ profile/index.tsx    Dados pessoais, config, sobre
│       ├─ profile/edit.tsx     Editar nome, email, telefone
│       ├─ profile/change-password.tsx
│       └─ profile/delete-account.tsx   Exclusão LGPD
│   └─ contestacao/             Stack: listar + criar contestação
│
├─ (merchant)/ ──────────────── TABS (guard: JWT api)
│   ├─ Tab 1: Dashboard 📊
│   │   └─ dashboard.tsx        Stats, gráfico, top clientes
│   ├─ Tab 2: Cashback 💰
│   │   ├─ cashback/index.tsx   Menu: gerar ou utilizar
│   │   ├─ cashback/gerar.tsx   CPF → valor → campanha → confirmar
│   │   ├─ cashback/utilizar.tsx CPF → saldo → método → confirmar
│   │   └─ cashback/qr-scan.tsx Escanear QR do consumidor
│   ├─ Tab 3: Clientes 👥
│   │   ├─ clientes/index.tsx   Lista paginada + search
│   │   ├─ clientes/[id].tsx    Detalhe do cliente
│   │   └─ clientes/[id]/extrato.tsx
│   └─ Tab 4: Mais ☰
│       ├─ more/index.tsx       Menu com links para sub-telas
│       ├─ more/campanhas.tsx   CRUD campanhas
│       ├─ more/vendas.tsx      Listagem de vendas
│       ├─ more/contestacoes.tsx Gestão de contestações
│       ├─ more/config.tsx      Configurações da empresa
│       └─ more/relatorios.tsx  Relatórios simplificados
│   └─ multiloja.tsx            Modal seleção de empresa
│
└─ (shared)/ ────────────────── STACK (acessível de qualquer perfil)
    ├─ privacy-policy.tsx       Política de privacidade (requisito App Store)
    └─ consent.tsx              Consentimento LGPD (primeiro acesso)
```

---

## 3. Mapa Completo de Telas

> Para cada tela: rota, perfil, auth, pilares, sprint, endpoints, layout, dados, ações, estados, componentes e testes.
> Ref primário: CONVERGENCE_ANALYSIS.md — Seções 4 e 5; FRONTEND_ANALYSIS.md — Seção 5; BACKEND_ANALYSIS.md — Seção 1.

---

### Auth > Login

**Rota (mobile):** `app/(auth)/login.tsx`
**Perfil:** Ambos
**Autenticação:** Pública
**Pilares:** P2, P4, P5, P6, P14
**Sprint:** 1

**Endpoints consumidos:**
- `POST /api/mobile/v1/auth/login` → Login consumidor (Ref: BACKEND_ANALYSIS.md §1.3)
- `POST /api/v1/auth/login` → Login lojista (Ref: BACKEND_ANALYSIS.md §1.2)
- `POST /api/mobile/v1/auth/oauth` → Login social Apple/Google (Ref: BACKEND_ANALYSIS.md §1.3)

**Layout descritivo:**
```
┌──────────────────────────┐
│      [Logo H4 Cashback]  │
│                          │
│  ┌────────────────────┐  │
│  │ Email              │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ Senha         [👁] │  │
│  └────────────────────┘  │
│                          │
│  [Esqueceu a senha?]     │
│                          │
│  ┌────────────────────┐  │
│  │   ENTRAR (primary) │  │
│  └────────────────────┘  │
│                          │
│  ─── ou continue com ─── │
│                          │
│  [🍎 Apple] [G Google]   │
│                          │
│  Não tem conta? Cadastre  │
│  Toggle: Consumidor|Lojista│
└──────────────────────────┘
```

**Dados exibidos:**
- Nenhum dado do servidor (tela pública)

**Ações do usuário:**
- Preencher email e senha → Submit → Dashboard (consumer ou merchant)
- Tap "Esqueceu a senha?" → `(auth)/forgot-password`
- Tap "Apple" → OAuth Apple Sign-In → Dashboard
- Tap "Google" → OAuth Google Sign-In → Dashboard
- Tap "Cadastre" → `(auth)/register`
- Toggle Consumidor/Lojista → alterna endpoint de login

**Estados:**
- Loading: Botão "ENTRAR" com spinner, inputs desabilitados
- Empty: N/A (formulário)
- Error: Mensagem inline sob inputs (credenciais inválidas, conta bloqueada, 2FA pendente)
- Offline: Banner "Sem conexão" + botão desabilitado

**Componentes utilizados:**
- `Input` (email, password com toggle visibility)
- `Button` (primary, social variants)
- `Toast` (erros de auth)
- `OfflineBanner`

**Testes:**
- Unitário: Validação Zod do loginSchema (email format, senha min 8)
- Componente: Renderiza inputs, botões, toggle; submit com credenciais válidas
- Integração: Fluxo login → armazena token SecureStore → navega para Dashboard

---

### Auth > Register

**Rota (mobile):** `app/(auth)/register.tsx`
**Perfil:** Ambos
**Autenticação:** Pública
**Pilares:** P4, P5, P6, P14, P15
**Sprint:** 1

**Endpoints consumidos:**
- `POST /api/mobile/v1/auth/register` → Registro consumidor CPF (Ref: BACKEND_ANALYSIS.md §1.3)
- `POST /api/v1/auth/register` → Registro lojista CNPJ (Ref: BACKEND_ANALYSIS.md §1.2)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar     Cadastro   │
│                          │
│  [Consumidor] [Lojista]  │  ← SegmentedControl
│                          │
│  === Consumidor ===      │
│  ┌────────────────────┐  │
│  │ CPF (máscara)      │  │
│  │ Nome completo      │  │
│  │ Email              │  │
│  │ Telefone (máscara) │  │
│  │ Senha              │  │
│  │ Confirmar senha    │  │
│  └────────────────────┘  │
│  ☑ Aceito termos e LGPD  │
│                          │
│  === Lojista ===         │
│  [Mesmos campos web +    │
│   CNPJ, nome fantasia]   │
│                          │
│  ┌────────────────────┐  │
│  │  CRIAR CONTA       │  │
│  └────────────────────┘  │
│  Já tem conta? Entrar    │
└──────────────────────────┘
```

**Dados exibidos:**
- Indicador de força da senha (barra colorida)
- Validações inline em tempo real

**Ações do usuário:**
- Toggle Consumidor/Lojista → alterna formulário
- Preencher campos → validação inline via Zod
- Tap "Termos e LGPD" → `(shared)/privacy-policy`
- Tap "CRIAR CONTA" → POST register → Dashboard
- Tap "Entrar" → `(auth)/login`

**Estados:**
- Loading: Botão com spinner durante POST
- Empty: N/A
- Error: Erros inline por campo (CPF inválido, email já existe: 409, CNPJ inválido)
- Offline: Banner + botão desabilitado

**Componentes utilizados:**
- `Input` (text, masked CPF/CNPJ/telefone, password)
- `Button` (primary)
- `Badge` (strength indicator)
- `Toast`

**Testes:**
- Unitário: registerSchema (CPF dígitos, CNPJ dígitos, senha forte, confirmação)
- Componente: Toggle perfil, validação inline, submit
- Integração: Registro → token → redirect para onboarding ou dashboard

---

### Auth > Forgot Password

**Rota (mobile):** `app/(auth)/forgot-password.tsx`
**Perfil:** Ambos
**Autenticação:** Pública
**Pilares:** P4, P5, P6
**Sprint:** 1

**Endpoints consumidos:**
- `POST /api/mobile/v1/auth/forgot-password` → Enviar email de recuperação (Ref: BACKEND_ANALYSIS.md §7.1.6 — A CRIAR)
- `POST /api/mobile/v1/auth/reset-password` → Redefinir senha com token (Ref: BACKEND_ANALYSIS.md §7.1.6 — A CRIAR)

**Layout descritivo:**
```
Wizard 4 steps com progress bar:

Step 1 — Email:
┌──────────────────────────┐
│  ● ○ ○ ○                 │
│  Recuperar Senha         │
│  Digite seu email        │
│  ┌────────────────────┐  │
│  │ Email              │  │
│  └────────────────────┘  │
│  [ENVIAR CÓDIGO]         │
└──────────────────────────┘

Step 2 — Código:
┌──────────────────────────┐
│  ● ● ○ ○                 │
│  Verificação             │
│  Código enviado para     │
│  u***@email.com          │
│  ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐│
│  │ │ │ │ │ │ │ │ │ │ │ ││  ← 6 dígitos
│  └─┘ └─┘ └─┘ └─┘ └─┘ └─┘│
│  Reenviar em 0:30        │
│  [VERIFICAR]             │
└──────────────────────────┘

Step 3 — Nova Senha:
┌──────────────────────────┐
│  ● ● ● ○                 │
│  Nova Senha              │
│  ┌────────────────────┐  │
│  │ Nova senha         │  │
│  │ Confirmar senha    │  │
│  └────────────────────┘  │
│  [strength indicator]    │
│  [REDEFINIR SENHA]       │
└──────────────────────────┘

Step 4 — Sucesso:
┌──────────────────────────┐
│  ● ● ● ●                 │
│  ✓ Senha redefinida!     │
│  [VOLTAR AO LOGIN]       │
└──────────────────────────┘
```

**Dados exibidos:**
- Email mascarado no step 2
- Contador regressivo para reenvio (30s)
- Indicador de força da senha no step 3

**Ações do usuário:**
- Step 1: Digitar email → "ENVIAR CÓDIGO"
- Step 2: Digitar 6 dígitos → "VERIFICAR" | "Reenviar"
- Step 3: Nova senha + confirmação → "REDEFINIR SENHA"
- Step 4: "VOLTAR AO LOGIN" → `(auth)/login`

**Estados:**
- Loading: Botão com spinner em cada step
- Empty: N/A
- Error: "Email não encontrado" (step 1), "Código inválido" (step 2), "Token expirado" (step 2, com CTA reenviar)
- Offline: Banner + botão desabilitado

**Componentes utilizados:**
- `Input` (email, code, password)
- `Button` (primary)
- `Badge` (password strength)
- Progress bar customizada (4 steps)

**Testes:**
- Unitário: emailStepSchema, codeStepSchema, newPasswordStepSchema
- Componente: Navegação entre steps, validação por step
- Integração: Fluxo completo 4 steps → redirect login

---

### Auth > Onboarding

**Rota (mobile):** `app/(auth)/onboarding.tsx`
**Perfil:** Ambos
**Autenticação:** Pública (pós-registro, primeiro acesso)
**Pilares:** P2, P6
**Sprint:** 1

**Endpoints consumidos:**
- Nenhum (conteúdo local)

**Layout descritivo:**
```
┌──────────────────────────┐
│                          │
│    [Ilustração animada]  │
│                          │
│  Slide 1: "Acumule       │
│  cashback em cada compra" │
│                          │
│  Slide 2: "Resgate com   │
│  QR Code na loja"        │
│                          │
│  Slide 3: "Acompanhe     │
│  seu saldo em tempo real" │
│                          │
│       ● ○ ○              │  ← dots indicator
│                          │
│  [PRÓXIMO] ou [PULAR]    │
│  No último: [COMEÇAR]    │
└──────────────────────────┘
```

**Dados exibidos:**
- 3 slides com ilustrações e texto descritivo (i18n)

**Ações do usuário:**
- Swipe horizontal entre slides
- Tap "PRÓXIMO" → próximo slide
- Tap "PULAR" → Dashboard
- Tap "COMEÇAR" (último slide) → Dashboard

**Estados:**
- Loading: N/A
- Empty: N/A
- Error: N/A
- Offline: Funciona offline (conteúdo local)

**Componentes utilizados:**
- FlatList horizontal com paging
- Dot indicator
- `Button` (primary, ghost)

**Testes:**
- Componente: Swipe entre slides, botões "Pular" e "Começar"

---

### Consumer > Dashboard (Home)

**Rota (mobile):** `app/(consumer)/(tabs)/home/index.tsx`
**Perfil:** Consumidor
**Autenticação:** Requerida (JWT api_mobile)
**Pilares:** P3, P4, P6, P7, P8, P14
**Sprint:** 2

**Endpoints consumidos:**
- `GET /api/mobile/v1/saldo` → Saldo total + por empresa (Ref: BACKEND_ANALYSIS.md §1.7)
- `GET /api/mobile/v1/extrato?limit=5` → Últimas transações (Ref: BACKEND_ANALYSIS.md §1.7)

**Layout descritivo:**
```
┌──────────────────────────┐
│  Olá, {nome}!     🔔(3) │  ← header com notif badge
│                          │
│  ┌────────────────────┐  │
│  │  Seu Saldo         │  │
│  │  R$ 1.234,56       │  │  ← SaldoCard principal
│  │  ▲ R$ 85,00 este mês │  │
│  │  ⚠ R$ 45 expira em 5d│  │  ← alerta expiração
│  │  [Ver detalhes →]   │  │
│  └────────────────────┘  │
│                          │
│  Últimas Transações      │
│  ┌────────────────────┐  │
│  │ 🟢 Loja ABC +R$25  │  │
│  │ 🟣 Loja XYZ -R$10  │  │
│  │ 🟡 Loja DEF +R$15  │  │
│  │ ...                 │  │
│  │ [Ver extrato →]     │  │
│  └────────────────────┘  │
│                          │
│  [Resgatar Cashback]     │  ← FAB ou banner
└──────────────────────────┘
```

**Dados exibidos:**
- `saldo_total` (decimal, formatado R$ X.XXX,XX)
- `proximo_a_expirar.valor` + `proximo_a_expirar.quantidade` (alerta)
- `por_empresa[]` (resumo: nome_fantasia, saldo)
- Últimas 5 transações do extrato (tipo, valor, empresa, data)

**Ações do usuário:**
- Tap 🔔 → `notifications/`
- Tap "Ver detalhes" → `home/saldo`
- Tap "Ver extrato" → `home/extrato`
- Tap transação → `home/extrato` com filtro
- Tap "Resgatar Cashback" → `(tabs)/qrcode`
- Pull-to-refresh → refetch saldo + extrato

**Estados:**
- Loading: Skeleton do SaldoCard + 3 skeleton rows de transação
- Empty: Ilustração "Nenhum cashback ainda" + CTA "Visite uma loja parceira"
- Error: Mensagem "Erro ao carregar saldo" + botão "Tentar novamente"
- Offline: Dados do cache MMKV + banner "Dados podem estar desatualizados"

**Componentes utilizados:**
- `SaldoCard` (mobile-only), `CashbackCard` (timeline item)
- `Skeleton`, `EmptyState`, `OfflineBanner`
- `NotificationBell` (badge unread count)
- PullToRefresh (`RefreshControl`)

**Testes:**
- Unitário: Formatação de saldo, cálculo de "expirando em X dias"
- Componente: Renderiza com dados, renderiza skeleton, renderiza empty state
- Integração: Pull-to-refresh refetch, tap navega para saldo detail

---

### Consumer > Saldo Detail

**Rota (mobile):** `app/(consumer)/(tabs)/home/saldo.tsx`
**Perfil:** Consumidor
**Autenticação:** Requerida
**Pilares:** P3, P4, P6, P7, P14
**Sprint:** 2

**Endpoints consumidos:**
- `GET /api/mobile/v1/saldo` → Saldo total + breakdown por empresa (Ref: BACKEND_ANALYSIS.md §1.7)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar     Meu Saldo  │
│                          │
│  ┌────────────────────┐  │
│  │ Saldo Total        │  │
│  │ R$ 1.234,56        │  │
│  │ ⚠ R$ 45 expira 5d  │  │
│  └────────────────────┘  │
│                          │
│  Por Empresa:            │
│  ┌────────────────────┐  │
│  │ [logo] Loja ABC    │  │
│  │        R$ 800,00   │  │
│  │        3 cashbacks  │  │
│  ├────────────────────┤  │
│  │ [logo] Loja XYZ    │  │
│  │        R$ 434,56   │  │
│  │        5 cashbacks  │  │
│  └────────────────────┘  │
│                          │
│  Estatísticas:           │
│  Total recebido: R$2.500 │
│  Total resgatado: R$1.265│
│  Total expirado: R$ 0,44 │
└──────────────────────────┘
```

**Dados exibidos:**
- `saldo_total` (R$ formatado)
- `proximo_a_expirar` (valor + dias)
- `por_empresa[]`: empresa.nome_fantasia, empresa.logo_url, saldo, quantidade de cashbacks

**Ações do usuário:**
- Tap empresa → `home/extrato?empresa_id=X`
- Pull-to-refresh → refetch saldo

**Estados:**
- Loading: Skeleton card + 3 skeleton empresa rows
- Empty: "Nenhum saldo disponível" + CTA "Visite uma loja parceira"
- Error: Mensagem + retry
- Offline: Cache + banner "Dados podem estar desatualizados"

**Componentes utilizados:**
- `SaldoCard`, `Card`, `Badge`
- `Skeleton`, `EmptyState`, `OfflineBanner`
- `expo-image` (logos das empresas)

**Testes:**
- Unitário: Formatação monetária, ordenação por saldo
- Componente: Renderiza breakdown por empresa, tap navega com empresa_id

---

### Consumer > Extrato

**Rota (mobile):** `app/(consumer)/(tabs)/home/extrato.tsx`
**Perfil:** Consumidor
**Autenticação:** Requerida
**Pilares:** P3, P4, P6, P7, P8
**Sprint:** 3

**Endpoints consumidos:**
- `GET /api/mobile/v1/extrato` → Extrato cursor-based (Ref: BACKEND_ANALYSIS.md §1.7)
  Query params: `empresa_id?, status_cashback?, data_inicio?, data_fim?, limit=20`

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar     Extrato    │
│                          │
│  [Filtros]    [Período]  │
│  Todos ▼     Este mês ▼ │
│                          │
│  Fev 2026                │
│  ┌────────────────────┐  │
│  │ 🟢 25 Fev          │  │
│  │ Loja ABC            │  │
│  │ Recebido +R$ 25,00  │  │
│  │ Expira: 27/03/2026  │  │
│  ├────────────────────┤  │
│  │ 🟣 24 Fev          │  │
│  │ Loja XYZ            │  │
│  │ Resgatado -R$ 10,00 │  │
│  ├────────────────────┤  │
│  │ 🟡 23 Fev          │  │
│  │ Loja DEF            │  │
│  │ Pendente +R$ 15,00  │  │
│  │ Confirma: ~24h      │  │
│  └────────────────────┘  │
│                          │
│  [Carregando mais...]    │  ← infinite scroll
└──────────────────────────┘
```

**Dados exibidos:**
- `MobileExtratoResource[]`: tipo (Recebido/Usado/status), valor_cashback, status_cashback, data_expiracao, created_at
- empresa.nome_fantasia, empresa.logo_url
- campanha.nome (se aplicável)
- Agrupamento por mês/dia

**Ações do usuário:**
- Filtrar por status (todos, recebido, usado, expirado, pendente)
- Filtrar por período (este mês, últimos 3 meses, personalizado)
- Scroll para carregar mais (cursor pagination)
- Tap item → bottom sheet com detalhes expandidos
- Tap "Contestar" no bottom sheet → `contestacao/create`
- Pull-to-refresh

**Estados:**
- Loading: Skeleton timeline (5 items)
- Empty: "Nenhuma transação encontrada" + ilustração (com filtro ativo: "Tente outro filtro")
- Error: Mensagem + retry
- Offline: Cache das últimas páginas + banner

**Componentes utilizados:**
- `CashbackTimeline` (mobile-only, FlatList + ícones por status)
- `BottomSheet` (detalhes da transação)
- `FilterBar` (status + período)
- `Skeleton`, `EmptyState`, `OfflineBanner`

**Testes:**
- Unitário: Formatação de data, agrupamento por mês, cores por status
- Componente: Renderiza timeline, filtros, infinite scroll
- Integração: Cursor pagination, filtros aplicam query params

---

### Consumer > Histórico de Uso

**Rota (mobile):** `app/(consumer)/(tabs)/home/historico.tsx`
**Perfil:** Consumidor
**Autenticação:** Requerida
**Pilares:** P3, P4, P6
**Sprint:** 3

**Endpoints consumidos:**
- `GET /api/mobile/v1/extrato?status_cashback=utilizado` → Apenas resgates (Ref: BACKEND_ANALYSIS.md §1.7)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar  Meus Resgates │
│                          │
│  ┌────────────────────┐  │
│  │ Total Economizado   │  │
│  │ R$ 1.265,00         │  │
│  │ 47 resgates         │  │
│  └────────────────────┘  │
│                          │
│  Fev 2026 (3 resgates)  │
│  ┌────────────────────┐  │
│  │ 24 Fev  Loja XYZ   │  │
│  │ Resgatado R$ 10,00  │  │
│  ├────────────────────┤  │
│  │ ...                 │  │
│  └────────────────────┘  │
│  [Carregando mais...]    │
└──────────────────────────┘
```

**Dados exibidos:**
- Total economizado (soma de valor_cashback dos utilizados)
- Contagem total de resgates
- Lista de resgates agrupados por mês

**Ações do usuário:**
- Scroll infinito para mais resgates
- Tap item → bottom sheet com detalhes
- Pull-to-refresh

**Estados:**
- Loading: Skeleton card + timeline
- Empty: "Você ainda não resgatou cashback" + CTA "Gerar QR Code"
- Error: Mensagem + retry
- Offline: Cache + banner

**Componentes utilizados:**
- `SaldoCard` (total economizado), `CashbackTimeline`
- `Skeleton`, `EmptyState`

**Testes:**
- Unitário: Soma de valores, agrupamento por mês
- Componente: Renderiza lista filtrada por status=utilizado

---

### Consumer > QR Code

**Rota (mobile):** `app/(consumer)/(tabs)/qrcode.tsx`
**Perfil:** Consumidor
**Autenticação:** Requerida
**Pilares:** P4, P6, P9, P10
**Sprint:** 5

**Endpoints consumidos:**
- `GET /api/mobile/v1/utilizacao/lojas` → Empresas com cashback disponível (Ref: BACKEND_ANALYSIS.md §1.7)
- `GET /api/mobile/v1/saldo` → Saldo por empresa (Ref: BACKEND_ANALYSIS.md §1.7)
- `POST /api/mobile/v1/utilizacao/qrcode` → Gerar QR token (Ref: BACKEND_ANALYSIS.md §1.7)

**Layout descritivo:**
```
┌──────────────────────────┐
│        Resgatar           │
│                          │
│  Selecione a loja:       │
│  ┌────────────────────┐  │
│  │ [logo] Loja ABC    │  │
│  │ Saldo: R$ 800,00 ✓ │  │  ← selected
│  ├────────────────────┤  │
│  │ [logo] Loja XYZ    │  │
│  │ Saldo: R$ 434,56   │  │
│  └────────────────────┘  │
│                          │
│  Valor do resgate:       │
│  ┌────────────────────┐  │
│  │ R$ [___________]   │  │
│  └────────────────────┘  │
│  Máx: R$ 800,00          │
│                          │
│  ┌────────────────────┐  │
│  │   GERAR QR CODE    │  │
│  └────────────────────┘  │
│                          │
│  === Após gerar ===      │
│  ┌────────────────────┐  │
│  │    ┌──────────┐    │  │
│  │    │ QR CODE  │    │  │
│  │    │ [image]  │    │  │
│  │    └──────────┘    │  │
│  │ Válido por 5:00    │  │  ← countdown
│  │ Apresente ao caixa │  │
│  │ R$ 100,00          │  │
│  │ Loja ABC           │  │
│  └────────────────────┘  │
│  [GERAR NOVO]            │
└──────────────────────────┘
```

**Dados exibidos:**
- Lista de empresas com saldo disponível (nome_fantasia, logo_url, saldo)
- QR code gerado (SVG via `react-native-qrcode-svg`)
- Countdown timer (5 minutos TTL do token)
- Valor e empresa selecionada

**Ações do usuário:**
- Selecionar empresa da lista
- Digitar valor do resgate (máx = saldo na empresa)
- Tap "GERAR QR CODE" → POST qrcode → exibir QR
- Countdown expira → "QR expirado, gerar novo?"
- Tap "GERAR NOVO" → reset form
- Haptic feedback no sucesso (expo-haptics)

**Estados:**
- Loading: Spinner ao gerar QR
- Empty: "Nenhuma loja com saldo" + CTA voltar ao home
- Error: "Erro ao gerar QR" + retry
- Offline: "Necessário conexão para gerar QR Code" + desabilitar botão

**Componentes utilizados:**
- `Card` (seleção de empresa), `Input` (valor monetário com máscara)
- `QRCodeDisplay` (mobile-only), `Button`
- Countdown timer customizado

**Testes:**
- Unitário: Validação do valor (> 0, <= saldo)
- Componente: Seleção de empresa, geração de QR, countdown
- Integração: Fluxo selecionar loja → valor → gerar QR → exibir

---

### Consumer > Notificações

**Rota (mobile):** `app/(consumer)/(tabs)/notifications/index.tsx`
**Perfil:** Consumidor
**Autenticação:** Requerida
**Pilares:** P4, P6, P10
**Sprint:** 5

**Endpoints consumidos:**
- `GET /api/mobile/v1/notifications` → Lista de notificações (Ref: BACKEND_ANALYSIS.md §7.1.3 — A CRIAR)
- `PATCH /api/mobile/v1/notifications/{id}/read` → Marcar como lida (Ref: BACKEND_ANALYSIS.md §7.1.3 — A CRIAR)
- `POST /api/mobile/v1/notifications/read-all` → Marcar todas como lidas (Ref: BACKEND_ANALYSIS.md §7.1.3 — A CRIAR)

**Layout descritivo:**
```
┌──────────────────────────┐
│  Notificações    [✓ Todas]│  ← marcar todas lidas
│                          │
│  Hoje                    │
│  ┌────────────────────┐  │
│  │ 🟢 Cashback recebido│  │  ← não lida (fundo destaque)
│  │ R$ 25,00 na Loja ABC│  │
│  │ há 2 horas          │  │
│  ├────────────────────┤  │
│  │ ⚠️ Cashback expirando│  │
│  │ R$ 45 expira em 5d  │  │
│  │ há 5 horas          │  │
│  └────────────────────┘  │
│                          │
│  Ontem                   │
│  ┌────────────────────┐  │
│  │ 🟣 Resgate confirmado│  │  ← lida (fundo normal)
│  │ R$ 10,00 na Loja XYZ│  │
│  │ ontem às 14:30      │  │
│  └────────────────────┘  │
│                          │
│  [Carregando mais...]    │
└──────────────────────────┘
```

**Dados exibidos:**
- `notifications[]`: titulo, mensagem, tipo, lida (boolean), created_at, dados_extras
- Agrupamento por dia (Hoje, Ontem, data)
- Badge de não lidas (no tab bar)
- `meta.total_unread`

**Ações do usuário:**
- Tap notificação → marcar como lida + deep link (se dados_extras contém rota)
- Tap "✓ Todas" → marcar todas como lidas
- Swipe left → deletar/arquivar
- Pull-to-refresh
- Scroll infinito

**Estados:**
- Loading: Skeleton (5 notification rows)
- Empty: Ilustração "Nenhuma notificação" + "Você será avisado quando receber cashback"
- Error: Mensagem + retry
- Offline: Cache + banner

**Componentes utilizados:**
- `Card` (notification item, com fundo diferenciado para não lida)
- `SwipeAction` (swipe to delete)
- `Badge` (tipo de notificação)
- `Skeleton`, `EmptyState`

**Testes:**
- Unitário: Agrupamento por dia, formatação "há X horas"
- Componente: Renderiza lista, tap marca como lida, swipe deleta
- Integração: Deep link da notificação navega para tela correta

---

### Consumer > Preferências de Notificação

**Rota (mobile):** `app/(consumer)/(tabs)/notifications/preferences.tsx`
**Perfil:** Consumidor
**Autenticação:** Requerida
**Pilares:** P6, P10
**Sprint:** 5

**Endpoints consumidos:**
- `GET /api/mobile/v1/notifications/preferences` → Preferências atuais (Ref: BACKEND_ANALYSIS.md §7.1.7 — A CRIAR)
- `PATCH /api/mobile/v1/notifications/preferences` → Atualizar preferências (Ref: BACKEND_ANALYSIS.md §7.1.7 — A CRIAR)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar  Preferências  │
│                          │
│  Canais                  │
│  ┌────────────────────┐  │
│  │ Push Notifications  │  │
│  │ [toggle ON]         │  │
│  ├────────────────────┤  │
│  │ Email               │  │
│  │ [toggle ON]         │  │
│  └────────────────────┘  │
│                          │
│  Categorias              │
│  ┌────────────────────┐  │
│  │ Transações          │  │
│  │ Cashback, resgates  │  │
│  │ [toggle ON]         │  │
│  ├────────────────────┤  │
│  │ Promoções           │  │
│  │ Ofertas de lojistas │  │
│  │ [toggle OFF]        │  │
│  ├────────────────────┤  │
│  │ Marketing           │  │
│  │ Novidades, dicas    │  │
│  │ [toggle OFF]        │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

**Dados exibidos:**
- `push_enabled`, `email_enabled`, `marketing_enabled` (booleans)

**Ações do usuário:**
- Toggle cada preferência → PATCH imediato (debounce 500ms)
- Haptic feedback no toggle

**Estados:**
- Loading: Skeleton toggles
- Error: Toast "Erro ao salvar preferência" + retry automático
- Offline: Toggles desabilitados + banner

**Componentes utilizados:**
- Switch nativo (com `expo-haptics`)
- `Card` (agrupamento de seções)
- `Toast`

**Testes:**
- Componente: Toggle atualiza estado, PATCH chamado com debounce

---

### Consumer > Perfil

**Rota (mobile):** `app/(consumer)/(tabs)/profile/index.tsx`
**Perfil:** Consumidor
**Autenticação:** Requerida
**Pilares:** P5, P6, P14
**Sprint:** 1

**Endpoints consumidos:**
- `GET /api/mobile/v1/auth/me` → Dados do cliente (Ref: BACKEND_ANALYSIS.md §1.3)

**Layout descritivo:**
```
┌──────────────────────────┐
│        Meu Perfil        │
│                          │
│     [Avatar (iniciais)]  │
│     João Silva           │
│     joao@email.com       │
│                          │
│  ┌────────────────────┐  │
│  │ 📝 Editar perfil   │→ │
│  ├────────────────────┤  │
│  │ 🔒 Alterar senha   │→ │
│  ├────────────────────┤  │
│  │ 🔔 Notificações    │→ │
│  ├────────────────────┤  │
│  │ 🌙 Tema escuro  [⬤]│  │  ← toggle dark mode
│  ├────────────────────┤  │
│  │ 🌐 Idioma   pt-BR ▼│  │
│  ├────────────────────┤  │
│  │ 🔐 Biometria [OFF] │  │  ← P1, Sprint 6
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ 📄 Política de     │→ │
│  │    Privacidade      │  │
│  ├────────────────────┤  │
│  │ ℹ️ Sobre o app      │  │
│  │    v1.0.0 (build 1) │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ 🗑 Excluir conta   │→ │  ← vermelho, LGPD
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │   SAIR (danger)    │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

**Dados exibidos:**
- `cliente.nome`, `cliente.email`, `cliente.telefone`
- Versão do app (expo-constants)
- Status da biometria (disponível/ativada)

**Ações do usuário:**
- Tap "Editar perfil" → `profile/edit`
- Tap "Alterar senha" → `profile/change-password`
- Tap "Notificações" → `notifications/preferences`
- Toggle dark mode → atualiza themeStore + MMKV
- Tap idioma → picker pt-BR/en → atualiza i18n + MMKV
- Toggle biometria → fluxo enroll/disable
- Tap "Política" → `(shared)/privacy-policy`
- Tap "Excluir conta" → `profile/delete-account`
- Tap "SAIR" → confirmação → logout → `(auth)/login`

**Estados:**
- Loading: Skeleton avatar + dados
- Error: Toast "Erro ao carregar perfil"
- Offline: Cache do me + banner

**Componentes utilizados:**
- `Card` (seções de menu), Avatar (iniciais)
- Switch (dark mode, biometria)
- `Button` (danger para logout)

**Testes:**
- Componente: Renderiza dados do cliente, toggle dark mode, tap navega
- Integração: Logout limpa stores + SecureStore + React Query → redirect login

---

### Consumer > Editar Perfil

**Rota (mobile):** `app/(consumer)/(tabs)/profile/edit.tsx`
**Perfil:** Consumidor
**Autenticação:** Requerida
**Pilares:** P4, P5, P6
**Sprint:** 1

**Endpoints consumidos:**
- `GET /api/mobile/v1/auth/me` → Dados atuais (Ref: BACKEND_ANALYSIS.md §1.3)
- `PATCH /api/mobile/v1/auth/profile` → Atualizar perfil (Ref: BACKEND_ANALYSIS.md §7.1.5 — A CRIAR)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar   Editar Perfil│
│                          │
│  ┌────────────────────┐  │
│  │ Nome completo      │  │
│  │ [João Silva]       │  │
│  ├────────────────────┤  │
│  │ Email              │  │
│  │ [joao@email.com]   │  │
│  ├────────────────────┤  │
│  │ Telefone           │  │
│  │ [(11) 99999-9999]  │  │
│  ├────────────────────┤  │
│  │ CPF (somente leitura)│ │
│  │ [***456.789-**]    │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │    SALVAR           │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

**Dados exibidos:**
- `cliente.nome`, `cliente.email`, `cliente.telefone` (editáveis)
- `cliente.cpf` (mascarado, somente leitura)

**Ações do usuário:**
- Editar campos → validação inline
- Tap "SALVAR" → PATCH profile → Toast sucesso → voltar
- Teclado: tipo correto por campo (email, phone, default)

**Estados:**
- Loading: Spinner no botão SALVAR
- Error: Erros inline por campo (email já existe: 409) + Toast
- Offline: Campos desabilitados + banner

**Componentes utilizados:**
- `Input` (text, email, masked phone)
- `Button` (primary)
- `Toast`

**Testes:**
- Unitário: Validação profileSchema
- Componente: Preenche campos, submit chama PATCH, exibe erros inline

---

### Consumer > Alterar Senha

**Rota (mobile):** `app/(consumer)/(tabs)/profile/change-password.tsx`
**Perfil:** Consumidor
**Autenticação:** Requerida
**Pilares:** P4, P5, P6
**Sprint:** 1

**Endpoints consumidos:**
- `PATCH /api/mobile/v1/auth/password` → Alterar senha (Ref: BACKEND_ANALYSIS.md §7.1.5 — A CRIAR)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar  Alterar Senha │
│                          │
│  ┌────────────────────┐  │
│  │ Senha atual    [👁] │  │
│  ├────────────────────┤  │
│  │ Nova senha     [👁] │  │
│  │ [strength bar]      │  │
│  ├────────────────────┤  │
│  │ Confirmar nova [👁] │  │
│  └────────────────────┘  │
│                          │
│  Requisitos:             │
│  ✓ Mín. 8 caracteres    │
│  ✓ 1 maiúscula          │
│  ✓ 1 minúscula          │
│  ✓ 1 número             │
│  ✓ 1 especial           │
│                          │
│  ┌────────────────────┐  │
│  │  ALTERAR SENHA     │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

**Dados exibidos:**
- Indicador de força da senha (barra colorida)
- Checklist de requisitos (verde/cinza em tempo real)

**Ações do usuário:**
- Preencher campos → validação inline
- Tap "ALTERAR SENHA" → PATCH → Toast sucesso → voltar

**Estados:**
- Loading: Spinner no botão
- Error: "Senha atual incorreta" (401), erros de validação inline
- Offline: Botão desabilitado + banner

**Componentes utilizados:**
- `Input` (password com toggle visibility)
- `Button`, `Badge` (strength), `Toast`

**Testes:**
- Unitário: changePasswordSchema (senha forte, confirmação match)
- Componente: Checklist atualiza em real-time, submit valida

---

### Consumer > Excluir Conta

**Rota (mobile):** `app/(consumer)/(tabs)/profile/delete-account.tsx`
**Perfil:** Consumidor
**Autenticação:** Requerida
**Pilares:** P5, P6, P16
**Sprint:** 1

**Endpoints consumidos:**
- `POST /api/mobile/v1/auth/delete-account` → Solicitar exclusão (Ref: BACKEND_ANALYSIS.md §7.1.8 — A CRIAR)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar  Excluir Conta │
│                          │
│  ⚠️ Atenção              │
│                          │
│  Ao excluir sua conta:   │
│  • Seu saldo de cashback │
│    será perdido           │
│  • Seus dados pessoais   │
│    serão removidos em 30d │
│  • Esta ação não pode ser │
│    desfeita               │
│                          │
│  Motivo (opcional):      │
│  ┌────────────────────┐  │
│  │ [textarea]         │  │
│  └────────────────────┘  │
│                          │
│  Para confirmar, digite  │
│  sua senha:              │
│  ┌────────────────────┐  │
│  │ Senha          [👁] │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │  EXCLUIR CONTA     │  │  ← danger button
│  └────────────────────┘  │
└──────────────────────────┘
```

**Dados exibidos:**
- Aviso sobre consequências (i18n)
- Saldo atual que será perdido (opcional)

**Ações do usuário:**
- (Opcional) digitar motivo
- Digitar senha para confirmar
- Tap "EXCLUIR CONTA" → confirmação (Alert) → POST → logout → `(auth)/login`

**Estados:**
- Loading: Spinner no botão danger
- Error: "Senha incorreta" (401)
- Offline: Botão desabilitado + banner

**Componentes utilizados:**
- `Input` (textarea, password)
- `Button` (danger)
- Alert nativo (confirmação final)

**Testes:**
- Unitário: deleteAccountSchema (senha obrigatória)
- Componente: Confirmação dupla (Alert), submit chama POST
- Integração: Após exclusão → logout completo → redirect login

---

### Consumer > Contestação (Lista)

**Rota (mobile):** `app/(consumer)/contestacao/index.tsx`
**Perfil:** Consumidor
**Autenticação:** Requerida
**Pilares:** P4, P6
**Sprint:** 3

**Endpoints consumidos:**
- `GET /api/mobile/v1/contestacoes` → Lista de contestações do cliente (Ref: BACKEND_ANALYSIS.md §1.7)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar  Contestações  │
│                          │
│  ┌────────────────────┐  │
│  │ 🟡 Pendente        │  │
│  │ Cashback não gerado │  │
│  │ Loja ABC - 20/02    │  │
│  ├────────────────────┤  │
│  │ 🟢 Aprovada        │  │
│  │ Valor incorreto     │  │
│  │ Loja XYZ - 15/02    │  │
│  ├────────────────────┤  │
│  │ 🔴 Rejeitada       │  │
│  │ Expiração indevida  │  │
│  │ Loja DEF - 10/02    │  │
│  └────────────────────┘  │
│                          │
│  [+ Nova Contestação]    │  ← FAB
└──────────────────────────┘
```

**Dados exibidos:**
- `ContestacaoResource[]`: tipo, status, descricao, created_at, transacao.empresa

**Ações do usuário:**
- Tap item → bottom sheet com detalhes + resposta (se houver)
- Tap FAB → `contestacao/create`
- Pull-to-refresh

**Estados:**
- Loading: Skeleton list
- Empty: "Nenhuma contestação" + "Se houver um problema, abra uma contestação"
- Error: Mensagem + retry
- Offline: Cache + banner

**Componentes utilizados:**
- `Card` (contestação), `Badge` (status), `FAB`
- `BottomSheet` (detalhes), `Skeleton`, `EmptyState`

**Testes:**
- Componente: Renderiza lista, badges por status, FAB navega

---

### Consumer > Contestação (Criar)

**Rota (mobile):** `app/(consumer)/contestacao/create.tsx`
**Perfil:** Consumidor
**Autenticação:** Requerida
**Pilares:** P4, P6
**Sprint:** 3

**Endpoints consumidos:**
- `POST /api/mobile/v1/contestacoes` → Criar contestação (Ref: BACKEND_ANALYSIS.md §1.7)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar  Nova Contest. │
│                          │
│  Transação:              │
│  ┌────────────────────┐  │
│  │ #123 - R$ 50,00    │  │
│  │ Loja ABC - 20/02    │  │
│  └────────────────────┘  │
│                          │
│  Tipo:                   │
│  ┌────────────────────┐  │
│  │ ▼ Selecionar tipo  │  │
│  │ • Cashback não gerado│ │
│  │ • Valor incorreto    │ │
│  │ • Expiração indevida │ │
│  │ • Venda cancelada    │ │
│  └────────────────────┘  │
│                          │
│  Descrição:              │
│  ┌────────────────────┐  │
│  │ [textarea]         │  │
│  │ (mín. 10 chars)    │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │  ENVIAR             │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

**Dados exibidos:**
- Dados da transação selecionada (id, valor, empresa, data)
- Enum de tipos de contestação (4 opções)

**Ações do usuário:**
- Selecionar tipo (bottom sheet picker)
- Digitar descrição (min 10 chars)
- Tap "ENVIAR" → POST → Toast sucesso → voltar para lista

**Estados:**
- Loading: Spinner no botão
- Error: "Transação não encontrada" (404), erros de validação
- Offline: Enfileirável (offline queue)

**Componentes utilizados:**
- `Card` (transação), `BottomSheetSelect`, `Input` (textarea)
- `Button`, `Toast`

**Testes:**
- Unitário: Validação contestação (tipo obrigatório, descrição min 10)
- Componente: Seleção de tipo, submit, exibe erros

---

### Merchant > Dashboard

**Rota (mobile):** `app/(merchant)/(tabs)/dashboard.tsx`
**Perfil:** Lojista
**Autenticação:** Requerida (JWT api)
**Pilares:** P3, P4, P6, P7
**Sprint:** 7

**Endpoints consumidos:**
- `GET /api/v1/dashboard/stats` → Métricas consolidadas (Ref: BACKEND_ANALYSIS.md §1.8)
- `GET /api/v1/dashboard/transacoes` → Últimas transações (Ref: BACKEND_ANALYSIS.md §1.8)
- `GET /api/v1/dashboard/top-clientes` → Top clientes (Ref: BACKEND_ANALYSIS.md §1.8)
- `GET /api/v1/dashboard/chart?periodo=7d` → Dados do gráfico (Ref: BACKEND_ANALYSIS.md §1.8)

**Layout descritivo:**
```
┌──────────────────────────┐
│  {Empresa}     [🔔] [⚙️] │
│                          │
│  ┌──────┐ ┌──────┐      │
│  │ Total │ │Crédit│      │  ← MetricCards scroll horiz.
│  │R$5.2k │ │R$3.1k│      │
│  │▲ 12%  │ │▲ 8%  │      │
│  └──────┘ └──────┘      │
│  ┌──────┐                │
│  │Resgat│                │
│  │R$2.1k│                │
│  └──────┘                │
│                          │
│  [Gráfico 7 dias]        │
│  ──── Gerado             │
│  ---- Utilizado           │
│                          │
│  Últimas Transações      │
│  ┌────────────────────┐  │
│  │ João S. +R$25 🟢   │  │
│  │ Maria L. -R$10 🟣  │  │
│  │ Pedro M. +R$15 🟡  │  │
│  └────────────────────┘  │
│                          │
│  Top Clientes            │
│  1. João Silva R$800     │
│  2. Maria Lima R$650     │
│  3. Pedro Mota R$420     │
└──────────────────────────┘
```

**Dados exibidos:**
- `DashboardStats`: total_cashback, total_creditado, total_resgatado (formatados R$)
- Tendência % (variação vs período anterior)
- `ChartDataPoint[]`: dados do gráfico 7 dias (gerado vs utilizado)
- Últimas 5 transações (cliente.nome, valor, status)
- Top 3 clientes (nome, saldo total)

**Ações do usuário:**
- Scroll horizontal nos metric cards
- Tap gráfico → alterar período (7d, 30d, 90d)
- Tap transação → detalhe (bottom sheet)
- Tap cliente → `clientes/[id]`
- Pull-to-refresh

**Estados:**
- Loading: Skeleton cards + skeleton gráfico + skeleton lista
- Empty: "Nenhuma transação ainda" + CTA "Gerar primeiro cashback"
- Error: Mensagem + retry por seção
- Offline: Cache + banner

**Componentes utilizados:**
- `MetricCard` (3x), Gráfico (react-native-svg + victory-native [A DEFINIR])
- `Card` (transações, top clientes), `Skeleton`, `OfflineBanner`

**Testes:**
- Unitário: Formatação de métricas, cálculo de tendência %
- Componente: Renderiza cards, gráfico, listas
- Integração: Pull-to-refresh invalida queries

---

### Merchant > Cashback (Menu)

**Rota (mobile):** `app/(merchant)/(tabs)/cashback/index.tsx`
**Perfil:** Lojista
**Autenticação:** Requerida
**Pilares:** P2, P6
**Sprint:** 4

**Endpoints consumidos:**
- Nenhum (menu de navegação)

**Layout descritivo:**
```
┌──────────────────────────┐
│        Cashback           │
│                          │
│  ┌────────────────────┐  │
│  │ 💚 Gerar Cashback  │  │
│  │ Registrar nova venda│  │
│  │ e gerar cashback    │  │
│  │ para o cliente      │→ │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ 💜 Utilizar         │  │
│  │ Cliente resgata     │  │
│  │ cashback na compra  │→ │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ 📷 Escanear QR     │  │
│  │ Validar QR Code do  │  │
│  │ cliente para resgate│→ │
│  └────────────────────┘  │
└──────────────────────────┘
```

**Ações do usuário:**
- Tap "Gerar Cashback" → `cashback/gerar`
- Tap "Utilizar" → `cashback/utilizar`
- Tap "Escanear QR" → `cashback/qr-scan`

**Estados:**
- Loading: N/A (conteúdo estático)
- Offline: Funciona offline (links desabilitados com banner)

**Componentes utilizados:**
- `Card` (3 opções com ícone, título, descrição, chevron)

**Testes:**
- Componente: Tap em cada card navega para rota correta

---

### Merchant > Gerar Cashback

**Rota (mobile):** `app/(merchant)/(tabs)/cashback/gerar.tsx`
**Perfil:** Lojista
**Autenticação:** Requerida
**Pilares:** P4, P5, P6, P9
**Sprint:** 4

**Endpoints consumidos:**
- `GET /api/v1/clientes?search={cpf}` → Buscar cliente por CPF (Ref: BACKEND_ANALYSIS.md §1.5)
- `POST /api/v1/clientes` → Cadastrar cliente se não existe (Ref: BACKEND_ANALYSIS.md §1.5)
- `GET /api/v1/campanhas?status=ativa` → Campanhas ativas (Ref: BACKEND_ANALYSIS.md §1.6)
- `POST /api/v1/cashback` → Gerar cashback (Ref: BACKEND_ANALYSIS.md §1.4) + Header `Idempotency-Key`

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar  Gerar Cashback│
│                          │
│  CPF do cliente:         │
│  ┌────────────────────┐  │
│  │ [___.___.___-__]   │  │
│  │ [🔍 BUSCAR]        │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ ✓ João Silva       │  │  ← cliente encontrado
│  │ joao@email.com     │  │
│  └────────────────────┘  │
│  OU                      │
│  [Cadastrar novo cliente]│  ← se não encontrado
│                          │
│  Valor da compra:        │
│  ┌────────────────────┐  │
│  │ R$ [___________]   │  │
│  └────────────────────┘  │
│                          │
│  Campanha (opcional):    │
│  ┌────────────────────┐  │
│  │ ▼ Selecionar       │  │
│  │ Padrão (5%)        │  │
│  │ Black Friday (10%)  │  │
│  └────────────────────┘  │
│                          │
│  ── Resumo ──            │
│  Valor compra: R$ 100,00 │
│  Percentual: 5%          │
│  Cashback: R$ 5,00       │
│  Validade: 30 dias       │
│                          │
│  ┌────────────────────┐  │
│  │   GERAR CASHBACK   │  │
│  └────────────────────┘  │
│                          │
│  ── Sucesso ──           │
│  ✓ Cashback gerado!      │
│  R$ 5,00 para João Silva │
│  Confirma em ~24h        │
│  [GERAR OUTRO] [VOLTAR]  │
└──────────────────────────┘
```

**Dados exibidos:**
- Cliente encontrado (nome, email)
- Campanhas ativas (nome, percentual)
- Resumo pré-confirmação (valor, percentual, cashback, validade)
- Tela de sucesso (valor, cliente, prazo de confirmação)

**Ações do usuário:**
- Digitar CPF (máscara) → buscar cliente (debounce)
- Se não encontrado → formulário de cadastro inline
- Digitar valor da compra
- Selecionar campanha (bottom sheet) ou usar padrão da empresa
- Tap "GERAR CASHBACK" → POST com Idempotency-Key → tela sucesso
- Tap "GERAR OUTRO" → reset form

**Estados:**
- Loading: Skeleton do cliente, spinner no botão
- Empty: N/A
- Error: "CPF inválido", "Limite de clientes atingido" (plano), "Erro ao gerar" + retry
- Offline: "Sem conexão — operação será enviada quando online" (offline queue)

**Componentes utilizados:**
- `Input` (masked CPF, currency), `BottomSheetSelect` (campanha)
- `Card` (cliente, resumo), `Button`
- `CashbackSummary`, `Sucesso` (reutilizados via adaptação)
- `Toast`

**Testes:**
- Unitário: gerarCashbackSchema (valor > 0), cálculo cashback
- Componente: Busca CPF, seleção campanha, resumo, submit
- Integração: POST com Idempotency-Key, tela sucesso, idempotência (retry sem duplicar)

---

### Merchant > Utilizar Cashback

**Rota (mobile):** `app/(merchant)/(tabs)/cashback/utilizar.tsx`
**Perfil:** Lojista
**Autenticação:** Requerida
**Pilares:** P4, P5, P6
**Sprint:** 4

**Endpoints consumidos:**
- `GET /api/v1/clientes?search={cpf}` → Buscar cliente (Ref: BACKEND_ANALYSIS.md §1.5)
- `GET /api/v1/clientes/{id}/saldo` → Saldo do cliente (Ref: BACKEND_ANALYSIS.md §1.4)
- `POST /api/v1/cashback/utilizar` → Utilizar cashback FEFO (Ref: BACKEND_ANALYSIS.md §1.4) + `Idempotency-Key`

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar    Utilizar     │
│                          │
│  CPF do cliente:         │
│  ┌────────────────────┐  │
│  │ [___.___.___-__]   │  │
│  │ [🔍 BUSCAR]        │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ João Silva          │  │
│  │ Saldo: R$ 800,00   │  │
│  │ Máx utilização: 100%│  │
│  └────────────────────┘  │
│                          │
│  Valor da compra:        │
│  ┌────────────────────┐  │
│  │ R$ [___________]   │  │
│  └────────────────────┘  │
│                          │
│  ── Resumo ──            │
│  Valor compra: R$ 200,00 │
│  Cashback usado: R$200,00│
│  Pago em dinheiro: R$ 0  │
│  Novo cashback: R$ 0,00  │
│  Troco FEFO: R$ 600,00   │
│                          │
│  ┌────────────────────┐  │
│  │  CONFIRMAR RESGATE  │  │
│  └────────────────────┘  │
│                          │
│  ── Sucesso ──           │
│  ✓ Resgate realizado!    │
│  Cashback usado: R$200,00│
│  [NOVA OPERAÇÃO] [VOLTAR]│
└──────────────────────────┘
```

**Dados exibidos:**
- Cliente (nome, saldo, % máx utilização)
- Cálculo FEFO: cashback_usado, valor_dinheiro, troco, novo_cashback
- Registros debitados (quais cashbacks foram consumidos, FEFO order)

**Ações do usuário:**
- Buscar cliente por CPF → exibir saldo
- Digitar valor da compra → cálculo automático
- Tap "CONFIRMAR RESGATE" → POST utilizar → sucesso
- Haptic feedback no sucesso

**Estados:**
- Loading: Spinner na busca e no submit
- Error: "Saldo insuficiente", "Nenhum cashback confirmado", erros FEFO
- Offline: Não enfileirável — "Requer conexão para validar saldo"

**Componentes utilizados:**
- `Input` (masked CPF, currency), `Card` (cliente, resumo)
- `ConfirmacaoCompra` (adaptado), `Sucesso` (adaptado)
- `Button`, `Toast`

**Testes:**
- Unitário: Cálculo FEFO (valor usado, troco, novo cashback)
- Componente: Busca CPF → saldo → resumo → confirmar
- Integração: POST utilizar com Idempotency-Key, tela sucesso

---

### Merchant > QR Code Scan

**Rota (mobile):** `app/(merchant)/(tabs)/cashback/qr-scan.tsx`
**Perfil:** Lojista
**Autenticação:** Requerida
**Pilares:** P4, P6, P9
**Sprint:** 5

**Endpoints consumidos:**
- `POST /api/v1/qrcode/validate` → Validar QR token (Ref: BACKEND_ANALYSIS.md §7.1.4 — A CRIAR)
- `POST /api/v1/cashback/utilizar` → Utilizar cashback após validação (Ref: BACKEND_ANALYSIS.md §1.4)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar   Escanear QR  │
│                          │
│  ┌────────────────────┐  │
│  │                    │  │
│  │   [Camera Preview] │  │
│  │                    │  │
│  │   ┌──────────┐    │  │
│  │   │ ▢ scan   │    │  │  ← overlay com moldura
│  │   │  area    │    │  │
│  │   └──────────┘    │  │
│  │                    │  │
│  └────────────────────┘  │
│                          │
│  Aponte para o QR Code   │
│  do cliente              │
│                          │
│  === Após scan ===       │
│  ┌────────────────────┐  │
│  │ ✓ QR Válido        │  │
│  │ Cliente: João Silva │  │
│  │ Valor: R$ 100,00   │  │
│  │ Saldo: R$ 800,00   │  │
│  │ Expira em: 4:32     │  │
│  │                    │  │
│  │ [CONFIRMAR RESGATE] │  │
│  │ [CANCELAR]          │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

**Dados exibidos:**
- Preview da câmera com overlay de scan
- Pós-scan: cliente (nome), valor do resgate, saldo disponível, tempo restante

**Ações do usuário:**
- Permissão de câmera (just-in-time)
- Scan QR code → vibração + som de confirmação (haptics)
- Tap "CONFIRMAR RESGATE" → POST utilizar → tela sucesso
- Tap "CANCELAR" → voltar ao scan

**Estados:**
- Loading: Spinner durante validação do QR
- Error: "QR inválido" (formato), "QR expirado" (TTL), "Saldo insuficiente"
- Offline: "Câmera disponível, mas validação requer conexão"

**Componentes utilizados:**
- `QRCodeScanner` (mobile-only, expo-camera)
- `Card` (resultado da validação)
- `Button` (primary + ghost)
- Haptics (expo-haptics)

**Testes:**
- Unitário: Parsing do QR token
- Componente: Mock da câmera, exibe resultado do scan
- Integração: Scan → validate → utilizar → sucesso

---

### Merchant > Clientes (Lista)

**Rota (mobile):** `app/(merchant)/(tabs)/clientes/index.tsx`
**Perfil:** Lojista
**Autenticação:** Requerida
**Pilares:** P4, P6, P7
**Sprint:** 7

**Endpoints consumidos:**
- `GET /api/v1/clientes?search=&page=1&limit=20` → Lista paginada (Ref: BACKEND_ANALYSIS.md §1.5)

**Layout descritivo:**
```
┌──────────────────────────┐
│  Clientes          [🔍]  │
│                          │
│  ┌────────────────────┐  │
│  │ Buscar por nome,   │  │
│  │ email ou CPF       │  │
│  └────────────────────┘  │
│                          │
│  87 clientes             │
│  ┌────────────────────┐  │
│  │ [J] João Silva      │  │
│  │ ***456.789-**       │  │
│  │ Saldo: R$ 800     →│  │
│  ├────────────────────┤  │
│  │ [M] Maria Lima      │  │
│  │ ***789.012-**       │  │
│  │ Saldo: R$ 650     →│  │
│  ├────────────────────┤  │
│  │ ...                 │  │
│  └────────────────────┘  │
│                          │
│  [+ Novo Cliente]        │  ← FAB (gestor/proprietário)
└──────────────────────────┘
```

**Dados exibidos:**
- `ClienteResource[]`: nome, cpf (mascarado), email
- Contagem total
- Search com debounce 300ms

**Ações do usuário:**
- Digitar no search → debounce → refetch com search param
- Tap cliente → `clientes/[id]`
- Tap FAB → bottom sheet formulário de cadastro
- Pull-to-refresh
- Scroll infinito (offset pagination)

**Estados:**
- Loading: Skeleton (8 client rows)
- Empty: "Nenhum cliente encontrado" (com search: "Tente outro termo")
- Error: Mensagem + retry
- Offline: Cache + banner

**Componentes utilizados:**
- `Input` (search), `Card` (client row), Avatar (iniciais)
- `FAB`, `BottomSheet` (cadastro)
- `FlashList` (virtualizada), `Skeleton`, `EmptyState`

**Testes:**
- Componente: Search debounce, lista renderiza, tap navega
- Integração: Search filtra server-side, pagination carrega mais

---

### Merchant > Cliente Detalhe

**Rota (mobile):** `app/(merchant)/(tabs)/clientes/[id].tsx`
**Perfil:** Lojista
**Autenticação:** Requerida
**Pilares:** P4, P6
**Sprint:** 7

**Endpoints consumidos:**
- `GET /api/v1/clientes/{id}` → Dados do cliente (Ref: BACKEND_ANALYSIS.md §1.5)
- `GET /api/v1/clientes/{id}/saldo` → Saldo do cliente (Ref: BACKEND_ANALYSIS.md §1.4)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar    João Silva  │
│                          │
│  ┌────────────────────┐  │
│  │ [J]  João Silva    │  │
│  │ joao@email.com     │  │
│  │ (11) 99999-9999    │  │
│  │ CPF: ***456.789-** │  │
│  │ Cliente desde: Jan 25│ │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ Saldo              │  │
│  │ R$ 800,00          │  │
│  │ 12 cashbacks ativos │  │
│  │ [Ver extrato →]    │  │
│  └────────────────────┘  │
│                          │
│  Ações rápidas:          │
│  [Gerar cashback]        │
│  [Utilizar cashback]     │
│  [Editar dados]          │
└──────────────────────────┘
```

**Dados exibidos:**
- `ClienteResource`: nome, email, telefone, cpf (mascarado), created_at
- Saldo total + contagem de cashbacks ativos

**Ações do usuário:**
- Tap "Ver extrato" → `clientes/[id]/extrato`
- Tap "Gerar cashback" → `cashback/gerar` com CPF pré-preenchido
- Tap "Utilizar cashback" → `cashback/utilizar` com CPF pré-preenchido
- Tap "Editar dados" → bottom sheet de edição (gestor/proprietário)

**Estados:**
- Loading: Skeleton card + saldo
- Error: "Cliente não encontrado" (404)
- Offline: Cache + banner

**Componentes utilizados:**
- `Card`, Avatar, `Badge`
- `BottomSheet` (edição)
- `Skeleton`

**Testes:**
- Componente: Renderiza dados, ações navegam corretamente
- Integração: Param [id] carrega cliente correto

---

### Merchant > Campanhas

**Rota (mobile):** `app/(merchant)/(tabs)/more/campanhas.tsx`
**Perfil:** Lojista
**Autenticação:** Requerida
**Pilares:** P4, P6
**Sprint:** 7

**Endpoints consumidos:**
- `GET /api/v1/campanhas` → Lista de campanhas (Ref: BACKEND_ANALYSIS.md §1.6)
- `POST /api/v1/campanhas` → Criar campanha (Ref: BACKEND_ANALYSIS.md §1.6)
- `PATCH /api/v1/campanhas/{id}` → Editar campanha (Ref: BACKEND_ANALYSIS.md §1.6)
- `DELETE /api/v1/campanhas/{id}` → Excluir campanha (Ref: BACKEND_ANALYSIS.md §1.6)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar   Campanhas    │
│                          │
│  [Ativas] [Encerradas]   │  ← tabs
│                          │
│  ┌────────────────────┐  │
│  │ 🟢 Black Friday    │  │
│  │ 10% · 30 dias      │  │
│  │ 01/11 — 30/11      │  │
│  │ 45 transações       │  │
│  ├────────────────────┤  │
│  │ 🟢 Verão 2026      │  │
│  │ 7% · 15 dias       │  │
│  │ 01/01 — 28/02      │  │
│  │ 120 transações      │  │
│  └────────────────────┘  │
│                          │
│  [+ Nova Campanha]       │  ← FAB
└──────────────────────────┘
```

**Dados exibidos:**
- `CampanhaResource[]`: nome, percentual, validade_padrao, data_inicio, data_fim, status
- Contagem de transações por campanha

**Ações do usuário:**
- Tabs Ativas/Encerradas → filtro por status
- Tap campanha → bottom sheet com detalhes + editar/excluir
- Tap FAB → bottom sheet formulário de criação (Zod validation)
- Swipe left → opções editar/excluir
- Pull-to-refresh

**Estados:**
- Loading: Skeleton list
- Empty: "Nenhuma campanha" + CTA "Criar primeira campanha"
- Error: Mensagem + retry
- Offline: Cache + banner

**Componentes utilizados:**
- `Card` (campanha), `Badge` (status), `FAB`
- `BottomSheet` (CRUD form), `SwipeAction`
- `Skeleton`, `EmptyState`

**Testes:**
- Unitário: campaignSchema (data_fim > data_inicio, percentual 0.01-100)
- Componente: Tabs filtram, CRUD via bottom sheet, swipe actions

---

### Merchant > Vendas

**Rota (mobile):** `app/(merchant)/(tabs)/more/vendas.tsx`
**Perfil:** Lojista
**Autenticação:** Requerida
**Pilares:** P4, P6, P7
**Sprint:** 7

**Endpoints consumidos:**
- `GET /api/v1/cashback` → Lista de transações paginada (Ref: BACKEND_ANALYSIS.md §1.4)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar      Vendas    │
│                          │
│  [Filtros ▼]   [Período] │
│                          │
│  ┌────────────────────┐  │
│  │ #1234  25/02 10:30 │  │
│  │ João Silva          │  │
│  │ R$ 100,00  🟢 +R$5 │  │
│  ├────────────────────┤  │
│  │ #1233  24/02 15:45 │  │
│  │ Maria Lima          │  │
│  │ R$ 200,00  🟣 -R$10│  │
│  ├────────────────────┤  │
│  │ ...                 │  │
│  └────────────────────┘  │
│  [Carregando mais...]    │
└──────────────────────────┘
```

**Dados exibidos:**
- `TransacaoResource[]`: id, cliente.nome, valor_compra, valor_cashback, status_venda, status_cashback, created_at
- Filtros: status_venda, status_cashback, período

**Ações do usuário:**
- Filtrar por status (bottom sheet)
- Filtrar por período
- Tap item → bottom sheet detalhe completo (com opção cancelar se elegível)
- Pull-to-refresh, scroll infinito

**Estados:**
- Loading: Skeleton (8 rows)
- Empty: "Nenhuma venda encontrada" (com filtro: "Tente outro filtro")
- Error: Mensagem + retry
- Offline: Cache + banner

**Componentes utilizados:**
- `Card` (transação), `Badge` (status), `FilterBar`
- `BottomSheet` (detalhe + ação cancelar)
- `FlashList`, `Skeleton`, `EmptyState`

**Testes:**
- Componente: Filtros aplicam query params, lista renderiza, detalhe abre

---

### Merchant > Contestações

**Rota (mobile):** `app/(merchant)/(tabs)/more/contestacoes.tsx`
**Perfil:** Lojista
**Autenticação:** Requerida
**Pilares:** P4, P6
**Sprint:** 7

**Endpoints consumidos:**
- `GET /api/v1/contestacoes` → Lista de contestações (Ref: BACKEND_ANALYSIS.md §1.15)
- `PATCH /api/v1/contestacoes/{id}` → Resolver contestação (Ref: BACKEND_ANALYSIS.md §1.15)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar  Contestações  │
│                          │
│  [Pendentes] [Resolvidas]│
│                          │
│  ┌────────────────────┐  │
│  │ 🟡 Cashback não    │  │
│  │    gerado           │  │
│  │ João Silva - 20/02  │  │
│  │ "Fiz compra mas..." │  │
│  ├────────────────────┤  │
│  │ 🟡 Valor incorreto │  │
│  │ Maria Lima - 18/02  │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

**Dados exibidos:**
- `ContestacaoResource[]`: tipo, status, descricao (preview), cliente.nome, created_at

**Ações do usuário:**
- Tabs Pendentes/Resolvidas
- Tap item → bottom sheet com detalhes completos
- Ações: Aprovar ou Rejeitar (PATCH) com resposta obrigatória
- Pull-to-refresh

**Estados:**
- Loading: Skeleton list
- Empty: "Nenhuma contestação pendente"
- Error: Mensagem + retry
- Offline: Cache + banner

**Componentes utilizados:**
- `Card` (contestação), `Badge` (status/tipo)
- `BottomSheet` (detalhe + ações), `Input` (resposta)
- `Skeleton`, `EmptyState`

**Testes:**
- Componente: Tabs filtram, ações aprovar/rejeitar chamam PATCH

---

### Merchant > Configurações

**Rota (mobile):** `app/(merchant)/(tabs)/more/config.tsx`
**Perfil:** Lojista (proprietário/gestor)
**Autenticação:** Requerida
**Pilares:** P4, P6
**Sprint:** 7

**Endpoints consumidos:**
- `GET /api/v1/config` → Configuração da empresa (Ref: BACKEND_ANALYSIS.md §1.9)
- `PATCH /api/v1/config` → Atualizar configuração (Ref: BACKEND_ANALYSIS.md §1.9)
- `POST /api/v1/config/logo` → Upload logo (Ref: BACKEND_ANALYSIS.md §1.9)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar  Configurações │
│                          │
│  Dados da Empresa        │
│  ┌────────────────────┐  │
│  │ [logo] Editar logo  │  │
│  │ Nome Fantasia       │  │
│  │ CNPJ (somente leit.)│  │
│  │ Telefone            │  │
│  │ Email               │  │
│  └────────────────────┘  │
│                          │
│  Política de Cashback    │
│  ┌────────────────────┐  │
│  │ Percentual: [5%]   │  │
│  │ Validade: [30 dias] │  │
│  │ Máx utilização:[100%]│ │
│  └────────────────────┘  │
│                          │
│  Notificações            │
│  ┌────────────────────┐  │
│  │ Email [ON]          │  │
│  │ SMS   [OFF]         │  │
│  │ Push  [ON]          │  │
│  └────────────────────┘  │
│                          │
│  Assinatura              │
│  ┌────────────────────┐  │
│  │ Plano: Profissional │  │
│  │ Status: Ativa ✓     │  │
│  │ Próx cobrança: 15/03│  │
│  └────────────────────┘  │
│                          │
│  [SALVAR ALTERAÇÕES]     │
└──────────────────────────┘
```

**Dados exibidos:**
- `EmpresaResource`: nome_fantasia, cnpj, telefone, email, logo_url
- Configurações de cashback: percentual, validade, max_utilizacao
- `NotificacaoConfigResource[]`: canais (email, sms, push) e status
- `AssinaturaResource`: plano, status, próxima cobrança

**Ações do usuário:**
- Editar logo (image picker → POST multipart)
- Editar dados da empresa → PATCH config
- Ajustar política de cashback
- Toggle canais de notificação
- Tap assinatura → info detalhada (somente leitura no mobile)

**Estados:**
- Loading: Skeleton sections
- Error: Toast por seção
- Offline: Cache + banner

**Componentes utilizados:**
- `Input` (text, masked, numeric), Switch (notificações)
- `Card` (seções), `Button`
- Image picker (expo-image-picker)

**Testes:**
- Unitário: companyConfigSchema, cashbackPolicySchema
- Componente: Edição de campos, toggle notificações, upload logo

---

### Merchant > Relatórios

**Rota (mobile):** `app/(merchant)/(tabs)/more/relatorios.tsx`
**Perfil:** Lojista (proprietário/gestor)
**Autenticação:** Requerida
**Pilares:** P4, P6
**Sprint:** 7

**Endpoints consumidos:**
- `GET /api/v1/relatorios` → Métricas calculadas (Ref: BACKEND_ANALYSIS.md §1.17)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar   Relatórios   │
│                          │
│  Período: [Este mês ▼]  │
│                          │
│  ┌────────────────────┐  │
│  │ Cashback Gerado    │  │
│  │ R$ 5.200,00        │  │
│  ├────────────────────┤  │
│  │ Cashback Utilizado │  │
│  │ R$ 2.100,00        │  │
│  ├────────────────────┤  │
│  │ Cashback Expirado  │  │
│  │ R$ 300,00          │  │
│  ├────────────────────┤  │
│  │ Clientes Ativos    │  │
│  │ 87                 │  │
│  ├────────────────────┤  │
│  │ Ticket Médio       │  │
│  │ R$ 150,00          │  │
│  └────────────────────┘  │
│                          │
│  [A DEFINIR — export PDF │
│   no mobile requer       │
│   expo-sharing]          │
└──────────────────────────┘
```

**Dados exibidos:**
- Métricas consolidadas por período (cashback gerado, utilizado, expirado, clientes, ticket médio)

**Ações do usuário:**
- Alterar período (este mês, últimos 3 meses, este ano)
- Pull-to-refresh

**Estados:**
- Loading: Skeleton metrics
- Empty: "Sem dados para o período"
- Error: Mensagem + retry
- Offline: Cache + banner

**Componentes utilizados:**
- `MetricCard` (5x), período selector (BottomSheet)
- `Skeleton`

**Testes:**
- Componente: Renderiza métricas, troca de período

---

### Merchant > Multiloja (Seleção de Empresa)

**Rota (mobile):** `app/(merchant)/multiloja.tsx`
**Perfil:** Lojista (multi-empresa)
**Autenticação:** Requerida
**Pilares:** P2, P4, P5
**Sprint:** 4

**Endpoints consumidos:**
- `GET /api/v1/empresas` → Lista de empresas do usuário (Ref: BACKEND_ANALYSIS.md §1.18)
- `POST /api/v1/auth/switch-empresa` → Trocar empresa ativa (Ref: BACKEND_ANALYSIS.md §1.2)

**Layout descritivo:**
```
┌──────────────────────────┐
│     Selecionar Empresa   │
│                          │
│  ┌────────────────────┐  │
│  │ [logo] Loja ABC ✓  │  │  ← empresa atual
│  │ CNPJ: 12.345...    │  │
│  │ Perfil: Proprietário│  │
│  ├────────────────────┤  │
│  │ [logo] Loja XYZ    │  │
│  │ CNPJ: 67.890...    │  │
│  │ Perfil: Gestor     │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

**Dados exibidos:**
- `empresas[]`: nome_fantasia, cnpj, logo_url, perfil

**Ações do usuário:**
- Tap empresa → switch-empresa → novo JWT → reload dashboard

**Estados:**
- Loading: Skeleton (2-3 cards)
- Error: "Erro ao trocar empresa" + retry
- Offline: Lista do cache + banner "Troca requer conexão"

**Componentes utilizados:**
- `Card` (empresa), `Badge` (perfil), checkmark (selecionada)

**Testes:**
- Componente: Lista empresas, tap chama switchEmpresa, JWT renovado

---

### Merchant > Menu "Mais"

**Rota (mobile):** `app/(merchant)/(tabs)/more/index.tsx`
**Perfil:** Lojista
**Autenticação:** Requerida
**Pilares:** P2, P6
**Sprint:** 7

**Endpoints consumidos:**
- Nenhum (menu de navegação estático)

**Layout descritivo:**
```
┌──────────────────────────┐
│           Mais           │
│                          │
│  ┌────────────────────┐  │
│  │ 📢 Campanhas      →│  │
│  ├────────────────────┤  │
│  │ 🛒 Vendas         →│  │
│  ├────────────────────┤  │
│  │ ⚖️ Contestações   →│  │
│  ├────────────────────┤  │
│  │ 📊 Relatórios     →│  │
│  ├────────────────────┤  │
│  │ ⚙️ Configurações  →│  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ 🔄 Trocar empresa →│  │  ← se multiloja
│  ├────────────────────┤  │
│  │ 📄 Política Priv. →│  │
│  ├────────────────────┤  │
│  │ ℹ️ Sobre          →│  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │    SAIR (danger)   │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

**Ações do usuário:**
- Tap cada item → navega para tela correspondente
- Tap "Trocar empresa" → `multiloja` (visível apenas se multiloja)
- Tap "SAIR" → confirmação → logout → `(auth)/login`

**Estados:**
- Offline: Funciona (links que requerem rede mostram indicador)

**Componentes utilizados:**
- `Card` (menu rows com ícone + chevron)
- `Button` (danger para logout)

**Testes:**
- Componente: Todos os links navegam corretamente, multiloja condicional

---

### Shared > Política de Privacidade

**Rota (mobile):** `app/(shared)/privacy-policy.tsx`
**Perfil:** Ambos
**Autenticação:** Pública (acessível de qualquer lugar)
**Pilares:** P16
**Sprint:** 1

**Endpoints consumidos:**
- Nenhum (conteúdo estático ou WebView com URL da política)

**Layout descritivo:**
```
┌──────────────────────────┐
│  ← Voltar  Privacidade   │
│                          │
│  Política de Privacidade │
│  H4 Cashback             │
│                          │
│  Última atualização:     │
│  25/02/2026              │
│                          │
│  [ScrollView com texto   │
│   completo da política   │
│   de privacidade em      │
│   formato markdown ou    │
│   HTML renderizado]      │
│                          │
│  Seções:                 │
│  1. Dados coletados      │
│  2. Uso dos dados        │
│  3. Compartilhamento     │
│  4. Direitos LGPD        │
│  5. Contato DPO          │
│                          │
└──────────────────────────┘
```

**Ações do usuário:**
- Scroll para ler
- Links externos abrem no browser

**Estados:**
- Offline: Conteúdo embutido no app (não depende de rede)

**Componentes utilizados:**
- ScrollView, Text (ou WebView se HTML externo)

**Testes:**
- Componente: Renderiza conteúdo, scroll funciona

---

### Shared > Consentimento LGPD

**Rota (mobile):** `app/(shared)/consent.tsx`
**Perfil:** Consumidor (primeiro acesso)
**Autenticação:** Requerida
**Pilares:** P5, P16
**Sprint:** 1

**Endpoints consumidos:**
- `POST /api/v1/lgpd/customers/{clienteId}/consents` → Registrar consentimento (Ref: BACKEND_ANALYSIS.md §1.19)

**Layout descritivo:**
```
┌──────────────────────────┐
│   Consentimento de Dados │
│                          │
│  Para utilizar o H4      │
│  Cashback, precisamos    │
│  do seu consentimento:   │
│                          │
│  ☐ Aceito o tratamento   │
│    de dados pessoais     │
│    conforme a LGPD       │
│    [Ler política →]      │
│                          │
│  ☐ Aceito receber        │
│    comunicações de       │
│    marketing (opcional)  │
│                          │
│  ┌────────────────────┐  │
│  │    CONTINUAR       │  │  ← habilitado com 1º check
│  └────────────────────┘  │
└──────────────────────────┘
```

**Dados exibidos:**
- Textos de consentimento (i18n)

**Ações do usuário:**
- Marcar checkbox LGPD (obrigatório)
- Marcar checkbox marketing (opcional)
- Tap "Ler política" → `(shared)/privacy-policy`
- Tap "CONTINUAR" → POST consent → navegar para dashboard

**Estados:**
- Loading: Spinner no botão
- Error: Toast "Erro ao registrar consentimento"
- Offline: Desabilitado + banner

**Componentes utilizados:**
- Checkbox nativo, `Button` (primary)
- Link para política

**Testes:**
- Componente: Botão desabilitado sem check LGPD, habilitado com check
- Integração: POST registra consentimento, navega para dashboard

---

## 4. Sprint Plan

> Sprints de 2 semanas. Total: 9 sprints (0-8), ~18 semanas.
> Ref: CONVERGENCE_ANALYSIS.md — Seções 2, 3, 10, 11; MOBILE_PILLARS_FRAMEWORK.md — Matriz de Priorização.

---

### SPRINT 0 — Fundação

**Objetivo:** Migrar cashback-frontend para monorepo npm workspaces, extrair @cashback/shared, criar projeto Expo e configurar toda a infraestrutura base.

**Pilares endereçados:** P1 (Arquitetura 🟢🟡), P11 (Testes 🟢 setup), P12 (CI/CD 🟢), P13 (Monitoramento 🟢 setup), P15 (i18n 🟢)

**Telas:**
- Nenhuma tela de usuário neste sprint (infraestrutura only)

**Endpoints consumidos:**
- Nenhum diretamente (setup de infra)

**Endpoints a CRIAR no backend:**
- [ ] Configurar CORS para origins do app mobile (ref: CONVERGENCE_ANALYSIS.md §2.5)
- [ ] Verificar integração FCM/APNs no PushChannel (ref: CONVERGENCE_ANALYSIS.md §2.5)

**Componentes novos:**
- Nenhum componente de UI (sprint de infra)

**Stores/Hooks novos:**
- [ ] Implementar `StorageAdapter` para expo-secure-store e MMKV (ref: CONVERGENCE_ANALYSIS.md §3.2.5)
- [ ] Implementar `createApiClient` factory com interceptors mobile (ref: CONVERGENCE_ANALYSIS.md §3.2.4)

**@cashback/shared:**
- [ ] Criar estrutura monorepo npm workspaces (`package.json` raiz, `tsconfig.base.json`)
- [ ] Extrair `types/` — 15 arquivos (ref: CONVERGENCE_ANALYSIS.md §3.2.1)
- [ ] Extrair `utils/` — 9 arquivos: validation, formatters, masks, errorMessages, error.utils, optimisticUpdate, asyncValidation, rateLimiter, token.utils (ref: CONVERGENCE_ANALYSIS.md §3.2.6)
- [ ] Extrair `schemas/` — 6 arquivos Zod (ref: CONVERGENCE_ANALYSIS.md §3.2.2)
- [ ] Extrair `services/` — 15 services de domínio + `createApiClient` factory (ref: CONVERGENCE_ANALYSIS.md §3.2.3)
- [ ] Extrair `stores/` — 5 stores Zustand com `StorageAdapter` (ref: CONVERGENCE_ANALYSIS.md §3.2.5)
- [ ] Extrair `hooks/` — 5 hooks (useDebounce, useDashboard, useSimulatedLoading, useRecuperacaoWizard, useCompanyLookups) (ref: CONVERGENCE_ANALYSIS.md §3.2.7)
- [ ] Extrair `i18n/locales/` — pt-BR.json, en.json (ref: CONVERGENCE_ANALYSIS.md §3.2.8)
- [ ] Atualizar imports no cashback-frontend para usar `@cashback/shared`
- [ ] Remover tipos `@deprecated` e `store.ts` legado (ref: CONVERGENCE_ANALYSIS.md §3.2.1)

**Testes:**
- Unitários: Testes existentes de schemas, utils, stores passam no monorepo
- Componente: N/A
- Integração: `npm run build` e `npm run test` do web passam no monorepo

**Configurações/Setup:**
- [ ] Criar projeto Expo em `packages/mobile/` (`npx create-expo-app`)
- [ ] Configurar `app.config.ts` (permissions, plugins, scheme `h4cashback`)
- [ ] Configurar `eas.json` (profiles: development, preview, production)
- [ ] Configurar `metro.config.js` para monorepo (resolver packages/shared)
- [ ] Configurar `babel.config.js` (reanimated plugin)
- [ ] Instalar dependências core: expo, react-native, typescript, expo-router
- [ ] Instalar dependências de estado: zustand, @tanstack/react-query, axios, zod
- [ ] Instalar dependências de storage: expo-secure-store, react-native-mmkv
- [ ] Instalar dependências de UI: reanimated, gesture-handler, safe-area-context, expo-font
- [ ] Configurar tema (ThemeProvider com tokens de @cashback/shared)
- [ ] Configurar i18n (i18next + expo-localization + locales do shared)
- [ ] Configurar Sentry (@sentry/react-native)
- [ ] Configurar React Query (queryClient com persistência MMKV)
- [ ] Configurar Axios mobile instance (mobileApiClient.ts)
- [ ] Setup Jest + @testing-library/react-native
- [ ] Setup GitHub Actions CI: lint, type-check, test em PRs
- [ ] Primeiro EAS Build: development client + preview
- [ ] Carregar fontes DM Sans e Space Mono via expo-font
- [ ] Variáveis de ambiente por profile (.env.development, .env.preview, .env.production)

**Critérios de aceite:**
- [ ] Monorepo funcional: `npm install` na raiz resolve todos os workspaces
- [ ] `npm run build` do cashback-frontend (web) passa sem erros no monorepo
- [ ] `npm run test` do cashback-frontend passa sem regressões
- [ ] `@cashback/shared` compila e exporta todos os módulos (types, schemas, services, stores, utils, hooks, i18n)
- [ ] Projeto Expo inicia no simulador/emulador (`npx expo start`)
- [ ] EAS Build gera APK (Android) e IPA (iOS) development client
- [ ] CI roda lint + type-check + tests em menos de 5 minutos
- [ ] Sentry recebe test event do app mobile
- [ ] i18n exibe texto em pt-BR por padrão, troca para en

**Dependências:**
- Sprint: Nenhuma (primeiro sprint)
- Backend: CORS configurado para mobile origins

**Riscos:**
- R10: Tipos legados poluem barrel exports → Remover na extração (ref: CONVERGENCE_ANALYSIS.md §10.3)
- R11: secureStorage web usa Web Crypto → Substituir por expo-secure-store (ref: CONVERGENCE_ANALYSIS.md §10.3)
- R15: CORS não configurado para mobile → Configurar antes do Sprint 1 (ref: CONVERGENCE_ANALYSIS.md §10.3)

---

### SPRINT 1 — Autenticação

**Objetivo:** Implementar o fluxo completo de autenticação para ambos os perfis (consumidor e lojista), incluindo OAuth Apple/Google e requisitos LGPD.

**Pilares endereçados:** P2 (Navegação 🟢), P4 (Rede/API 🟢🟡), P5 (Auth/Segurança 🟢), P6 (UI/UX 🟢), P14 (Acessibilidade 🟢), P15 (i18n 🟢)

**Telas:**
- [ ] LoginScreen — login email+senha + OAuth (ref: seção 3 — Auth > Login)
- [ ] RegisterScreen — registro consumidor CPF / lojista CNPJ (ref: seção 3 — Auth > Register)
- [ ] ForgotPasswordScreen — wizard 4 steps (ref: seção 3 — Auth > Forgot Password)
- [ ] OnboardingScreen — slides de boas-vindas (ref: seção 3 — Auth > Onboarding)
- [ ] ProfileScreen — menu do perfil consumidor (ref: seção 3 — Consumer > Perfil)
- [ ] EditProfileScreen — editar dados (ref: seção 3 — Consumer > Editar Perfil)
- [ ] ChangePasswordScreen — alterar senha (ref: seção 3 — Consumer > Alterar Senha)
- [ ] DeleteAccountScreen — exclusão LGPD (ref: seção 3 — Consumer > Excluir Conta)
- [ ] PrivacyPolicyScreen — política de privacidade (ref: seção 3 — Shared > Política)
- [ ] ConsentScreen — consentimento LGPD (ref: seção 3 — Shared > Consentimento)

**Endpoints consumidos:**
- POST `/api/mobile/v1/auth/login` — login consumidor (Ref: BACKEND_ANALYSIS.md §1.3)
- POST `/api/mobile/v1/auth/register` — registro consumidor (Ref: BACKEND_ANALYSIS.md §1.3)
- POST `/api/mobile/v1/auth/refresh` — refresh token (Ref: BACKEND_ANALYSIS.md §1.3)
- POST `/api/mobile/v1/auth/logout` — logout (Ref: BACKEND_ANALYSIS.md §1.3)
- GET `/api/mobile/v1/auth/me` — dados do cliente (Ref: BACKEND_ANALYSIS.md §1.3)
- POST `/api/mobile/v1/auth/oauth` — OAuth social (Ref: BACKEND_ANALYSIS.md §1.3)
- POST `/api/v1/auth/login` — login lojista (Ref: BACKEND_ANALYSIS.md §1.2)
- POST `/api/v1/auth/register` — registro lojista (Ref: BACKEND_ANALYSIS.md §1.2)
- POST `/api/v1/lgpd/customers/{id}/consents` — registrar consentimento (Ref: BACKEND_ANALYSIS.md §1.19)

**Endpoints a CRIAR no backend:**
- [ ] `POST /api/mobile/v1/auth/forgot-password` — recuperação de senha mobile (ref: CONVERGENCE_ANALYSIS.md §2.3 #1)
- [ ] `POST /api/mobile/v1/auth/reset-password` — reset de senha mobile (ref: CONVERGENCE_ANALYSIS.md §2.3 #2)
- [ ] `PATCH /api/mobile/v1/auth/profile` — editar perfil consumidor (ref: CONVERGENCE_ANALYSIS.md §2.3 #3)
- [ ] `PATCH /api/mobile/v1/auth/password` — alterar senha (ref: CONVERGENCE_ANALYSIS.md §2.3 #4)
- [ ] `POST /api/mobile/v1/auth/delete-account` — exclusão de conta LGPD (ref: CONVERGENCE_ANALYSIS.md §2.3 #5)
- [ ] Implementar OAuth Google + Apple Sign-In no endpoint existente `POST /api/mobile/v1/auth/oauth` (ref: CONVERGENCE_ANALYSIS.md §2.4 #4)

**Componentes novos:**
- [ ] `Button` — variantes primary, secondary, outline, ghost, danger (ref: CONVERGENCE_ANALYSIS.md §4.2)
- [ ] `Input` — text, email, password (toggle visibility), masked CPF/CNPJ/phone (ref: CONVERGENCE_ANALYSIS.md §4.2)
- [ ] `Card` — composable com Header, Content (ref: CONVERGENCE_ANALYSIS.md §4.2)
- [ ] `Toast` — wrapper react-native-toast-message (ref: CONVERGENCE_ANALYSIS.md §4.2)
- [ ] `Loading` — ActivityIndicator com variantes inline/fullscreen (ref: CONVERGENCE_ANALYSIS.md §4.2)
- [ ] `OfflineBanner` — banner de status offline (ref: CONVERGENCE_ANALYSIS.md §4.2)
- [ ] `Badge` — status + password strength (ref: CONVERGENCE_ANALYSIS.md §4.2)

**Stores/Hooks novos:**
- [ ] `useConnectivity` — hook para status de rede via NetInfo (ref: CONVERGENCE_ANALYSIS.md §6.2)
- [ ] `connectivityStore` — isOnline, connectionType (ref: CONVERGENCE_ANALYSIS.md §6.2)
- [ ] `useAppState` — lifecycle foreground/background (ref: CONVERGENCE_ANALYSIS.md §6.5)

**@cashback/shared:**
- [ ] `loginSchema`, `registerSchema`, `emailStepSchema`, `codeStepSchema`, `newPasswordStepSchema` (schemas já extraídos no Sprint 0)
- [ ] `mobileRegisterSchema` — novo schema para registro consumidor CPF (ref: CONVERGENCE_ANALYSIS.md §3.2.2)
- [ ] `deleteAccountSchema` — novo schema senha + motivo (ref: CONVERGENCE_ANALYSIS.md §3.2.2)
- [ ] Adicionar chaves i18n: `mobile.auth.*`, `mobile.profile.*`, `mobile.onboarding.*`

**Testes:**
- Unitários: loginSchema, registerSchema, mobileRegisterSchema, deleteAccountSchema, profileSchema, changePasswordSchema
- Componente: LoginScreen (inputs, submit, OAuth buttons), RegisterScreen (toggle perfil, validação), ForgotPasswordScreen (wizard steps), ProfileScreen (menu items)
- Integração: Login → token SecureStore → navigate dashboard; Logout → clear all → navigate login; Register → token → onboarding → dashboard

**Configurações/Setup:**
- [ ] Configurar AuthStack layout (sem bottom tabs)
- [ ] Configurar navigation guards (redirect baseado em auth state)
- [ ] Configurar expo-auth-session para Apple Sign-In + Google Sign-In
- [ ] Configurar deep linking scheme `h4cashback://`

**Critérios de aceite:**
- [ ] Consumidor consegue: registrar com CPF, login, logout, forgot password (4 steps), editar perfil, alterar senha, excluir conta
- [ ] Lojista consegue: registrar com CNPJ, login, logout
- [ ] OAuth Apple Sign-In funciona no iOS
- [ ] OAuth Google Sign-In funciona em ambas plataformas
- [ ] Token JWT armazenado em expo-secure-store (nunca em MMKV/AsyncStorage)
- [ ] Refresh token automático ao receber 401
- [ ] Logout limpa: tokens, React Query cache, Zustand stores, SecureStore, MMKV
- [ ] Onboarding exibe apenas no primeiro acesso
- [ ] Consentimento LGPD exibido no primeiro acesso do consumidor
- [ ] Tela de exclusão de conta funcional (requisito Apple/Google)
- [ ] Todos os inputs com accessibilityLabel (Pilar 14)
- [ ] Textos em pt-BR e en (Pilar 15)
- [ ] Touch targets >= 48dp (Pilar 6)

**Dependências:**
- Sprint: Sprint 0 (monorepo, shared, Expo project)
- Backend: 6 endpoints novos + OAuth implementado

**Riscos:**
- R1: OAuth social não implementado → Backend precisa implementar antes deste sprint (ref: CONVERGENCE_ANALYSIS.md §10.1)
- R2: Delete account inexistente → Backend precisa criar endpoint (ref: CONVERGENCE_ANALYSIS.md §10.1)
- R5: Password reset mobile não existe → Backend precisa criar endpoints (ref: CONVERGENCE_ANALYSIS.md §10.2)
- R6: Perfil sem edição → Backend precisa criar endpoint PATCH profile (ref: CONVERGENCE_ANALYSIS.md §10.2)
- R9: Recuperação de senha web usa mocks → Integrar com endpoints reais (ref: CONVERGENCE_ANALYSIS.md §10.2)

---

### SPRINT 2 — Dashboard + Saldo

**Objetivo:** Construir a experiência home do consumidor — dashboard com resumo de saldo, alerta de cashback expirando, últimas transações e navegação por tabs.

**Pilares endereçados:** P2 (Navegação 🟢 — ConsumerTabs), P3 (Estado 🟢 — React Query saldo/extrato), P6 (UI/UX 🟢 — pull-to-refresh, skeletons, empty states), P7 (Performance 🟢 — FlashList), P8 (Persistência 🟢 — cache MMKV)

**Telas:**
- Consumer > Dashboard (Home) — `app/(consumer)/(tabs)/dashboard.tsx` (ref: Seção 3)
- Consumer > Saldo Detail — `app/(consumer)/saldo-detail.tsx` (ref: Seção 3)

**Endpoints consumidos:**
- `GET /api/mobile/v1/auth/me` → Dados do consumidor logado (Ref: BACKEND_ANALYSIS.md §1.3)
- `GET /api/mobile/v1/saldo` → Saldo total + breakdown por empresa (Ref: BACKEND_ANALYSIS.md §1.5)
- `GET /api/mobile/v1/extrato` → Últimas transações cursor-based (Ref: BACKEND_ANALYSIS.md §1.5)
- `GET /api/mobile/v1/utilizacao/lojas` → Lojas com cashback disponível (Ref: BACKEND_ANALYSIS.md §1.5)

**Endpoints a CRIAR no backend:**
- [ ] Ajustar `GET /api/mobile/v1/saldo` — adicionar campo `proximo_a_expirar: { valor, quantidade }` com cashbacks expirando em 7 dias (ref: CONVERGENCE_ANALYSIS.md §2.4 #1)
- [ ] Ajustar `GET /api/mobile/v1/extrato` — eager load `with('empresa')` para evitar N+1 queries (ref: CONVERGENCE_ANALYSIS.md §2.4 #2)
- [ ] `POST /api/mobile/v1/auth/biometric/enroll` — vincular biometria ao device (ref: CONVERGENCE_ANALYSIS.md §2.3 #6)
- [ ] `POST /api/mobile/v1/auth/biometric/verify` — login via biometria (ref: CONVERGENCE_ANALYSIS.md §2.3 #7)

**Componentes novos:**
- [ ] `SaldoCard` — card de saldo total + breakdown por empresa com animação de valor (ref: CONVERGENCE_ANALYSIS.md §4.3)
- [ ] `CashbackTimeline` — timeline visual do extrato com ícones por status (ref: CONVERGENCE_ANALYSIS.md §4.3)
- [ ] `NotificationBell` — sino com badge de unread count no header (ref: CONVERGENCE_ANALYSIS.md §4.3)
- [ ] `EmptyState` — ilustração + mensagem + ação para telas sem dados (ref: CONVERGENCE_ANALYSIS.md §4.2)
- [ ] `Skeleton` — placeholder de loading via react-native-skeleton-placeholder (ref: CONVERGENCE_ANALYSIS.md §4.2)
- [ ] `PullToRefresh` — RefreshControl wrapper consistente (ref: CONVERGENCE_ANALYSIS.md §4.2)

**Stores/Hooks novos:**
- [ ] `notificationStore` — `{ unreadCount, preferences }` com `setUnreadCount()` (ref: CONVERGENCE_ANALYSIS.md §6.2)
- [ ] `useSaldo` — React Query hook para GET saldo com staleTime: 30s (dados financeiros)
- [ ] `useExtrato` — React Query infinite query hook com cursor pagination
- [ ] `useRefreshOnFocus` — hook para refetch queries quando tela ganha foco

**@cashback/shared:**
- [ ] Reutilizar `mobile.saldo.service` (`getSaldo`, `getLojas`) do Sprint 0 setup
- [ ] Reutilizar `mobile.extrato.service` (`getExtrato` cursor-based)
- [ ] Reutilizar formatadores de moeda: `formatCurrency`, `formatDate` de `utils/formatters.ts`
- [ ] Adicionar chaves i18n: `mobile.dashboard.*`, `mobile.saldo.*`, `mobile.extrato.*`

**Testes:**
- Unitários: formatCurrency com valores edge (0, negativo, grande), formatDate i18n
- Componente: SaldoCard renderiza saldo, breakdown, alerta expirando; CashbackTimeline renderiza lista de transações; EmptyState com CTA
- Integração: Dashboard carrega → exibe saldo + extrato recente; pull-to-refresh atualiza dados; tap saldo → navega para SaldoDetail

**Configurações/Setup:**
- [ ] Configurar ConsumerTabs bottom navigation (4 tabs: Home, QR, Notificações, Perfil)
- [ ] Configurar tab icons com lucide-react-native
- [ ] Configurar React Query cache persistence via MMKV para saldo/extrato
- [ ] Configurar `AppState` listener para refetch ao voltar do background

**Critérios de aceite:**
- [ ] Consumer Dashboard exibe: saldo total, valor expirando, 5 últimas transações, badge de notificação
- [ ] Saldo Detail exibe: breakdown por empresa, lista de lojas com cashback disponível
- [ ] Pull-to-refresh funcional em ambas as telas
- [ ] Skeleton loading exibido durante fetch inicial
- [ ] EmptyState exibido quando consumidor não possui transações
- [ ] Dados financeiros com staleTime curto (30s) — atualizam automaticamente
- [ ] Cache persiste em MMKV — app reaberto exibe dados do cache enquanto refetcha
- [ ] Navegação por tabs funcional (ConsumerTabs bottom bar)
- [ ] Touch targets >= 48dp em todos os elementos interativos (Pilar 6)

**Dependências:**
- Sprint: Sprint 1 (autenticação + token + perfil consumidor)
- Backend: Ajuste no endpoint saldo (proximo_a_expirar) + fix N+1 no extrato

**Riscos:**
- R4: Tabela de notificações in-app inexistente → Backend precisa criar migration antes do Sprint 5, mas unreadCount pode usar endpoint separado (ref: CONVERGENCE_ANALYSIS.md §10.1)
- R8: Extrato mobile com N+1 query → Backend precisa corrigir eager load (ref: CONVERGENCE_ANALYSIS.md §10.2)

---

### SPRINT 3 — Transações + Histórico

**Objetivo:** Completar a jornada do consumidor com extrato detalhado (infinite scroll cursor-based), histórico de uso e fluxo de contestações mobile.

**Pilares endereçados:** P4 (Rede 🟢 — cursor pagination, abort controller), P6 (UI/UX 🟢 — infinite scroll, swipe actions), P7 (Performance 🟢 — FlashList com cursor), P8 (Persistência 🟡 — cache de extrato)

**Telas:**
- Consumer > Extrato — `app/(consumer)/extrato.tsx` (ref: Seção 3)
- Consumer > Histórico de Uso — `app/(consumer)/historico.tsx` (ref: Seção 3)
- Consumer > Contestação (Lista) — `app/(consumer)/contestacoes.tsx` (ref: Seção 3)
- Consumer > Contestação (Criar) — `app/(consumer)/contestacao-criar.tsx` (ref: Seção 3)

**Endpoints consumidos:**
- `GET /api/mobile/v1/extrato` → Extrato completo cursor-based com filtros (Ref: BACKEND_ANALYSIS.md §1.5)
- `GET /api/mobile/v1/saldo` → Saldo por empresa para contexto (Ref: BACKEND_ANALYSIS.md §1.5)
- `GET /api/mobile/v1/contestacoes` → Listar contestações do consumidor (Ref: BACKEND_ANALYSIS.md §1.5)
- `POST /api/mobile/v1/contestacoes` → Criar nova contestação (Ref: BACKEND_ANALYSIS.md §1.5)

**Endpoints a CRIAR no backend:**
- [ ] `POST /api/v1/qrcode/validate` — lojista valida QR token do consumidor (ref: CONVERGENCE_ANALYSIS.md §2.3 #11) — preparar para Sprint 5
- [ ] `GET /api/mobile/v1/auth/sessions` — listar sessões ativas do device (ref: CONVERGENCE_ANALYSIS.md §2.3 #12)
- [ ] `DELETE /api/mobile/v1/auth/sessions/{id}` — revogar sessão específica (ref: CONVERGENCE_ANALYSIS.md §2.3 #13)
- [ ] Ajustar `POST /api/mobile/v1/utilizacao/qrcode` — persistir token em Redis com TTL 5min (ref: CONVERGENCE_ANALYSIS.md §2.4 #3) — preparar para Sprint 5

**Componentes novos:**
- [ ] `SwipeAction` — ação swipe-to-delete/archive em itens de lista (ref: CONVERGENCE_ANALYSIS.md §4.2)
- [ ] `FilterChips` — chips de filtro por status (pendente, confirmado, utilizado, expirado) + período
- [ ] `TransactionCard` — card detalhado de transação com empresa, valor, status, data
- [ ] `ContestacaoForm` — formulário de criação de contestação com tipo (select) + descrição (textarea)

**Stores/Hooks novos:**
- [ ] `useExtratoInfinite` — React Query `useInfiniteQuery` com cursor-based pagination
- [ ] `useContestacoes` — React Query hook para listar contestações
- [ ] `useContestacaoCreate` — React Query mutation com invalidação automática
- [ ] `useExtratoFilters` — hook local para gerenciar estado de filtros (empresa_id, status, data_inicio, data_fim)

**@cashback/shared:**
- [ ] Reutilizar `mobile.extrato.service` (`getExtrato` com cursor params)
- [ ] Reutilizar `contestacao.service` (`getContestacoes`, `createContestacao`)
- [ ] Reutilizar tipos: `ExtratoEntry`, `Contestacao`, `ContestacaoStatus`, `ContestacaoTipo`
- [ ] Reutilizar formatadores: `formatCurrency`, `formatDate`, `formatCPF` (mascarado)
- [ ] Adicionar chaves i18n: `mobile.extrato.*`, `mobile.historico.*`, `mobile.contestacao.*`

**Testes:**
- Unitários: Cursor pagination helper (next cursor extraction), filtro combinando status + data
- Componente: TransactionCard exibe dados corretos; SwipeAction abre ação; FilterChips toggle; ContestacaoForm validação de campos obrigatórios
- Integração: Extrato → infinite scroll → carrega próxima página; Filtrar por empresa → re-fetcha com cursor; Criar contestação → success → volta para lista atualizada

**Configurações/Setup:**
- [ ] Configurar FlashList para extrato (estimatedItemSize, keyExtractor com cursor)
- [ ] Configurar abort controller para cancelar fetch ao sair da tela
- [ ] Configurar React Query infinite query com `getNextPageParam` baseado em cursor

**Critérios de aceite:**
- [ ] Extrato exibe transações em infinite scroll cursor-based (carrega +20 por página)
- [ ] Filtros funcionais: por empresa, por status de cashback, por período (data_inicio/data_fim)
- [ ] Histórico exibe transações de utilização com detalhes (empresa, valor original, cashback usado)
- [ ] Lista de contestações exibe status por badge colorido (pendente/em_analise/aprovada/rejeitada)
- [ ] Criar contestação: selecionar tipo, descrever, submeter → feedback de sucesso
- [ ] Infinite scroll performático: sem flicker, sem re-render de itens já carregados
- [ ] Offline: exibe dados do cache; indicador de dados possivelmente desatualizados
- [ ] Abort controller cancela requests ao navegar para outra tela

**Dependências:**
- Sprint: Sprint 2 (ConsumerTabs, SaldoCard, extrato hooks base)
- Backend: Fix N+1 no extrato (se não feito no Sprint 2), QR token persistence (para Sprint 5)

**Riscos:**
- R3: QR Code sem persistência → Backend precisa persistir em Redis (bloqueante para Sprint 5, deve começar agora) (ref: CONVERGENCE_ANALYSIS.md §10.1)
- Performance de infinite scroll com muitas transações → Usar FlashList + estimatedItemSize + cache React Query

---

### SPRINT 4 — Cashback + Resgate

**Objetivo:** Construir o core do lojista — tela de menu cashback, gerar cashback (CPF + valor), utilizar cashback (FEFO) e seleção multi-empresa.

**Pilares endereçados:** P4 (Rede 🟢 — idempotency key, retry), P5 (Auth 🟢 — guard api lojista), P6 (UI/UX 🟢 — feedback tátil, confirmação), P9 (Nativo 🟡 — haptic feedback)

**Telas:**
- Merchant > Cashback (Menu) — `app/(merchant)/(tabs)/cashback.tsx` (ref: Seção 3)
- Merchant > Gerar Cashback — `app/(merchant)/gerar-cashback.tsx` (ref: Seção 3)
- Merchant > Utilizar Cashback — `app/(merchant)/utilizar-cashback.tsx` (ref: Seção 3)
- Merchant > Multiloja (Seleção de Empresa) — `app/(merchant)/multiloja.tsx` (ref: Seção 3)

**Endpoints consumidos:**
- `POST /api/v1/cashback` → Gerar cashback com idempotency key (Ref: BACKEND_ANALYSIS.md §1.4)
- `POST /api/v1/cashback/utilizar` → Utilizar cashback FEFO (Ref: BACKEND_ANALYSIS.md §1.4)
- `GET /api/v1/cashback` → Listar transações de cashback (Ref: BACKEND_ANALYSIS.md §1.4)
- `POST /api/v1/cashback/cancelar` → Cancelar venda (Ref: BACKEND_ANALYSIS.md §1.4)
- `GET /api/v1/clientes` → Buscar cliente por CPF (Ref: BACKEND_ANALYSIS.md §1.6)
- `GET /api/v1/clientes/{id}/saldo` → Saldo do cliente selecionado (Ref: BACKEND_ANALYSIS.md §1.6)
- `GET /api/v1/campanhas` → Listar campanhas ativas (Ref: BACKEND_ANALYSIS.md §1.7)
- `POST /api/v1/auth/switch-empresa` → Trocar empresa ativa (Ref: BACKEND_ANALYSIS.md §1.2)
- `GET /api/v1/empresas` → Listar empresas do lojista (Ref: BACKEND_ANALYSIS.md §1.18)

**Endpoints a CRIAR no backend:**
- Nenhum novo — todos os endpoints web do lojista já existem e são reutilizáveis (ref: CONVERGENCE_ANALYSIS.md §2.2)

**Componentes novos:**
- [ ] `FAB` (Floating Action Button) — botão flutuante para ação principal: "Gerar Cashback" (ref: CONVERGENCE_ANALYSIS.md §4.2)
- [ ] `BottomSheetSelect` — selector em bottom sheet para campanhas, unidades de negócio (ref: CONVERGENCE_ANALYSIS.md §4.2)
- [ ] `CPFSearchInput` — input com máscara CPF + busca ao completar 11 dígitos
- [ ] `CashbackConfirmation` — bottom sheet de confirmação com resumo (cliente, valor, % cashback, campanha)
- [ ] `MultilojaSelector` — tela/modal de seleção de empresa com avatar e nome

**Stores/Hooks novos:**
- [ ] `multilojaStore` — reutilizar do @cashback/shared (empresa selecionada, lista de empresas)
- [ ] `useCashbackCreate` — React Query mutation com idempotency key (`crypto.randomUUID()`)
- [ ] `useCashbackUtilizar` — React Query mutation para utilização FEFO
- [ ] `useClienteSearch` — React Query hook com debounce para busca por CPF
- [ ] `useCampanhas` — React Query hook para campanhas ativas da empresa

**@cashback/shared:**
- [ ] Reutilizar `cashback.service.ts` (`criarCashback`, `utilizarCashback`, `cancelarVenda`)
- [ ] Reutilizar `cliente.service.ts` (`getClientes`, `getClienteSaldo`)
- [ ] Reutilizar `campanha.service.ts` (`getCampanhas`)
- [ ] Reutilizar `empresa.service.ts` (`getEmpresas`)
- [ ] Reutilizar schemas: `cashbackSchema` (valor_compra, cpf), `masks.ts` (CPF, CNPJ, moeda)
- [ ] Reutilizar `multilojaStore` com `StorageAdapter` para expo-secure-store
- [ ] Adicionar chaves i18n: `mobile.cashback.*`, `mobile.merchant.*`, `mobile.multiloja.*`

**Testes:**
- Unitários: cashbackSchema validation, idempotency key generation, FEFO calculation display
- Componente: CPFSearchInput busca ao completar; CashbackConfirmation exibe resumo; FAB posicionado bottom-right; MultilojaSelector lista empresas
- Integração: Gerar cashback → CPF → valor → campanha → confirmar → success feedback + haptic; Utilizar cashback → CPF → saldo disponível → valor → confirmar → FEFO aplicado; Switch empresa → troca header + refetch dados

**Configurações/Setup:**
- [ ] Configurar MerchantTabs bottom navigation (4 tabs: Dashboard, Cashback, Clientes, Mais)
- [ ] Configurar Idempotency-Key header no Axios interceptor para POST /cashback
- [ ] Configurar expo-haptics para feedback tátil em ações de cashback
- [ ] Configurar guard de navegação para perfil lojista (redirecionar consumidor)

**Critérios de aceite:**
- [ ] Gerar cashback: buscar CPF → selecionar campanha → digitar valor → confirmar → sucesso com haptic
- [ ] Utilizar cashback: buscar CPF → ver saldo disponível → digitar valor → FEFO aplicado → sucesso
- [ ] Cancelar venda: swipe ou botão → confirmação → cancelamento processado
- [ ] Idempotency key previne duplicação de transação (retry seguro)
- [ ] Multiloja: lista empresas → selecionar → header atualiza → dados refetchados
- [ ] Offline: gerar cashback enfileirado (offline queue) → enviado quando online (Pilar 8)
- [ ] Bottom sheet de confirmação com resumo antes de finalizar operação
- [ ] Feedback tátil (expo-haptics) em sucesso e erro
- [ ] MerchantTabs bottom navigation funcional

**Dependências:**
- Sprint: Sprint 1 (auth lojista), Sprint 0 (shared services)
- Backend: Nenhum novo endpoint (todos existentes)

**Riscos:**
- Idempotency key em offline queue → Deve ser gerado antes de enfileirar, não no momento do envio
- Lojista com assinatura inativa (402) → Interceptor redireciona para tela de Config com alerta

---

### SPRINT 5 — QR Code + Push Notifications

**Objetivo:** Implementar o fluxo QR Code end-to-end (consumidor gera, lojista escaneia e valida) e a central de notificações push com preferências.

**Pilares endereçados:** P9 (Funcionalidades Nativas 🟢 — câmera, QR), P10 (Push Notifications 🟢 — registro, handle, preferências), P5 (Segurança 🟡 — QR token efêmero)

**Telas:**
- Consumer > QR Code — `app/(consumer)/(tabs)/qrcode.tsx` (ref: Seção 3)
- Consumer > Notificações — `app/(consumer)/(tabs)/notifications.tsx` (ref: Seção 3)
- Consumer > Preferências de Notificação — `app/(consumer)/notification-preferences.tsx` (ref: Seção 3)
- Merchant > QR Code Scan — `app/(merchant)/qrcode-scan.tsx` (ref: Seção 3)

**Endpoints consumidos:**
- `POST /api/mobile/v1/utilizacao/qrcode` → Consumidor gera QR token (Ref: BACKEND_ANALYSIS.md §1.5)
- `POST /api/v1/qrcode/validate` → Lojista valida QR token (Ref: CONVERGENCE_ANALYSIS.md §2.3 #11 — A CRIAR Sprint 3)
- `GET /api/mobile/v1/notifications` → Listar notificações in-app (Ref: CONVERGENCE_ANALYSIS.md §2.3 #8)
- `PATCH /api/mobile/v1/notifications/{id}/read` → Marcar como lida (Ref: CONVERGENCE_ANALYSIS.md §2.3 #9)
- `POST /api/mobile/v1/notifications/read-all` → Marcar todas como lidas (Ref: CONVERGENCE_ANALYSIS.md §2.3 #10)
- `GET /api/mobile/v1/notifications/preferences` → Preferências de notificação (Ref: CONVERGENCE_ANALYSIS.md §2.3 #14)
- `PATCH /api/mobile/v1/notifications/preferences` → Atualizar preferências (Ref: CONVERGENCE_ANALYSIS.md §2.3 #15)
- `POST /api/mobile/v1/devices` → Registrar device token push (Ref: BACKEND_ANALYSIS.md §1.5)
- `DELETE /api/mobile/v1/devices` → Remover device token (Ref: BACKEND_ANALYSIS.md §1.5)

**Endpoints a CRIAR no backend:**
- [ ] Criar tabela `notifications` (in-app) + model + migration (ref: CONVERGENCE_ANALYSIS.md §2.5)
- [ ] `GET /api/mobile/v1/notifications` — listar notificações paginadas (ref: CONVERGENCE_ANALYSIS.md §2.3 #8) — se não criado no Sprint 2
- [ ] `PATCH /api/mobile/v1/notifications/{id}/read` — marcar como lida (ref: CONVERGENCE_ANALYSIS.md §2.3 #9)
- [ ] `POST /api/mobile/v1/notifications/read-all` — marcar todas como lidas (ref: CONVERGENCE_ANALYSIS.md §2.3 #10)
- [ ] `GET /api/mobile/v1/notifications/preferences` — preferências do consumidor (ref: CONVERGENCE_ANALYSIS.md §2.3 #14)
- [ ] `PATCH /api/mobile/v1/notifications/preferences` — atualizar preferências (ref: CONVERGENCE_ANALYSIS.md §2.3 #15)

**Componentes novos:**
- [ ] `QRCodeDisplay` — exibição de QR code com countdown de expiração e animação (ref: CONVERGENCE_ANALYSIS.md §4.3)
- [ ] `QRCodeScanner` — câmera com overlay para scan QR (ref: CONVERGENCE_ANALYSIS.md §4.3)
- [ ] `PermissionRequest` — tela de solicitação de permissão (câmera, notificações) com UX amigável (ref: CONVERGENCE_ANALYSIS.md §4.3)
- [ ] `NotificationItem` — item de lista com ícone, título, mensagem, tempo, lida/não-lida
- [ ] `CountdownTimer` — contador regressivo para expiração do QR token

**Stores/Hooks novos:**
- [ ] `usePushNotifications` — hook para registrar device token, handle foreground/background, handle tap
- [ ] `useNotifications` — React Query hook para listar notificações (cursor-based)
- [ ] `useNotificationPreferences` — React Query hook GET/PATCH preferências
- [ ] `useQRCode` — hook para gerar QR token + countdown + auto-refresh
- [ ] `useCamera` — hook para solicitar permissão de câmera e gerenciar estado

**@cashback/shared:**
- [ ] Criar `mobile.notification.service` (`getNotifications`, `markAsRead`, `markAllAsRead`, `getPreferences`, `updatePreferences`)
- [ ] Criar `mobile.qrcode.service` (`gerarQRCode`, `validarQRCode`)
- [ ] Reutilizar `mobile.device.service` (`registerDevice`, `unregisterDevice`)
- [ ] Reutilizar tipos: `MobileNotification`, `NotificationPreferences`, `QRCodeToken`
- [ ] Adicionar chaves i18n: `mobile.qrcode.*`, `mobile.notifications.*`, `mobile.permissions.*`

**Testes:**
- Unitários: QR token countdown calculation, notification preferences schema
- Componente: QRCodeDisplay renderiza QR + countdown; QRCodeScanner overlay; NotificationItem read/unread styles; PermissionRequest com botões allow/deny
- Integração: Consumer gera QR → exibe com countdown → expira → regenera; Merchant escaneia QR → valida → exibe dados do cliente + saldo; Push notification tap → navega para tela correta; Mark all read → badge zera

**Configurações/Setup:**
- [ ] Configurar expo-camera para QR scanner (permissão, preview)
- [ ] Configurar expo-notifications: token registration, foreground handler, background handler, tap handler
- [ ] Configurar push notification channels (Android)
- [ ] Configurar notification categories/actions (iOS)
- [ ] Configurar deep linking para notification tap → navigate para tela correta

**Critérios de aceite:**
- [ ] Consumidor gera QR Code com token efêmero (countdown visual de 5min)
- [ ] QR regenera automaticamente ao expirar
- [ ] Lojista escaneia QR via câmera → valida → exibe dados (cliente, saldo, empresa)
- [ ] Permissão de câmera solicitada com UX amigável (explicação antes do prompt nativo)
- [ ] Push notifications: token registrado no backend ao primeiro login
- [ ] Push foreground: toast/banner sem interromper o usuário
- [ ] Push background: badge atualizado + ação ao tap (navega para tela correta)
- [ ] Central de notificações: lista paginada, swipe to mark read, "marcar todas como lidas"
- [ ] Preferências: toggle push, email, marketing — persistem via API
- [ ] Permissão de notificação solicitada com UX amigável
- [ ] QR Code exibe feedback tátil (haptic) ao ser gerado e ao ser validado

**Dependências:**
- Sprint: Sprint 3 (QR token persistence no Redis), Sprint 2 (NotificationBell, unreadCount)
- Backend: 6 endpoints de notificação + tabela notifications + QR validate endpoint

**Riscos:**
- R3: QR Code sem persistência → Bloqueante — deve estar resolvido no Sprint 3 (ref: CONVERGENCE_ANALYSIS.md §10.1)
- R4: Tabela de notificações in-app inexistente → Backend deve criar antes deste sprint (ref: CONVERGENCE_ANALYSIS.md §10.1)
- R7: Push notifications sem integração FCM/APNs verificada → Testar com credenciais reais (ref: CONVERGENCE_ANALYSIS.md §10.2)
- Permissão de câmera negada → Mostrar instrução para habilitar em Settings + fallback manual

---

### SPRINT 6 — Biometria + Configurações

**Objetivo:** Adicionar login biométrico (FaceID/TouchID), modo offline robusto, dark mode, acessibilidade avançada e otimizações de performance — sprint cross-cutting que melhora features existentes.

**Pilares endereçados:** P5 (Segurança 🟡 — biometria, session timeout), P7 (Performance 🟡 — lazy loading, image optimization), P8 (Offline 🟡 — offline queue, stale indicator), P9 (Nativo 🟢 — biometria), P14 (Acessibilidade 🟢🟡 — labels, contraste, screen reader)

**Telas:**
- Nenhuma tela nova — sprint de melhorias cross-cutting em telas existentes
- Afeta: Login (biometria), Dashboard (offline), Perfil (toggle biometria), todas as telas (dark mode, acessibilidade)

**Endpoints consumidos:**
- `POST /api/mobile/v1/auth/biometric/enroll` → Vincular biometria ao device (criado no Sprint 2 no backend)
- `POST /api/mobile/v1/auth/biometric/verify` → Login via biometria (criado no Sprint 2 no backend)
- `GET /api/mobile/v1/auth/sessions` → Listar sessões ativas (criado no Sprint 3 no backend)
- `DELETE /api/mobile/v1/auth/sessions/{id}` → Revogar sessão (criado no Sprint 3 no backend)

**Endpoints a CRIAR no backend:**
- Nenhum novo — endpoints de biometria e sessões já solicitados nos Sprints 2-3

**Componentes novos:**
- [ ] `BiometricPrompt` — UI de prompt biométrico nativo com fallback para senha (ref: CONVERGENCE_ANALYSIS.md §4.3)
- [ ] `SessionCard` — card de sessão ativa (device, plataforma, last active, revogar)
- [ ] `OfflineIndicator` — indicador sutil de "dados possivelmente desatualizados" em telas com cache
- [ ] `ThemeToggle` — switch dark/light mode no perfil

**Stores/Hooks novos:**
- [ ] `deviceStore` — `{ deviceId, pushToken, biometricAvailable, biometricEnrolled }` (ref: CONVERGENCE_ANALYSIS.md §6.2)
- [ ] `useBiometric` — hook para check availability, enroll, verify, com fallback
- [ ] `useSessionTimeout` — hook para auto-logout após inatividade (configurable timer)
- [ ] `useOfflineQueue` — hook para enfileirar mutations offline e executar quando online
- [ ] `themeStore` adaptado — `useColorScheme()` + MMKV persistence (ref: CONVERGENCE_ANALYSIS.md §6.1)

**@cashback/shared:**
- [ ] Reutilizar `themeStore` com adapter mobile (`Appearance.setColorScheme()` + MMKV)
- [ ] Criar `biometricService.ts` mobile-only (check, enroll, verify via expo-local-authentication)
- [ ] Criar `offlineQueueService.ts` mobile-only (MMKV queue + retry on reconnect)
- [ ] Adicionar chaves i18n: `mobile.biometric.*`, `mobile.offline.*`, `mobile.settings.*`

**Testes:**
- Unitários: Offline queue serialization/deserialization, session timeout timer, biometric availability check mock
- Componente: BiometricPrompt exibe prompt nativo; SessionCard exibe dados + botão revogar; ThemeToggle alterna tema
- Integração: Login → biometric prompt → verify → dashboard (sem digitar senha); Offline → enqueue mutation → reconectar → flush queue → data synced; Revogar sessão → confirmação → remove da lista

**Configurações/Setup:**
- [ ] Configurar expo-local-authentication (FaceID usage description em Info.plist)
- [ ] Configurar dark mode tokens (lightTheme/darkTheme do @cashback/shared)
- [ ] Configurar session timeout (default: 15min inatividade)
- [ ] Configurar offline queue com MMKV persistence
- [ ] Adicionar accessibilityLabel a todos os elementos interativos existentes
- [ ] Verificar contraste de cores >= 4.5:1 (WCAG AA) em ambos os temas

**Critérios de aceite:**
- [ ] Login biométrico: após primeiro login com senha, oferecer ativar biometria; logins seguintes usam biometria
- [ ] Biometria fallback: se biometria falhar 3x, solicita senha
- [ ] Biometria check: verifica disponibilidade de hardware antes de oferecer
- [ ] Dark mode: toggle funcional, persiste em MMKV, respeita preferência do sistema como default
- [ ] Offline queue: mutations enfileiradas e executadas automaticamente ao reconectar
- [ ] Session timeout: auto-logout após 15min de inatividade com tela mascarada ao voltar
- [ ] Acessibilidade: todos os elementos interativos com accessibilityLabel; contraste >= 4.5:1
- [ ] App masca dados sensíveis quando vai para background (Pilar 5)
- [ ] Sessions: visualizar e revogar sessões ativas de outros devices

**Dependências:**
- Sprint: Sprint 5 (features completas para polir), Sprint 2 (endpoints biometria no backend)
- Backend: Endpoints biometria e sessões prontos

**Riscos:**
- Biometria não disponível em todos os devices → Fallback obrigatório para senha/PIN
- Dark mode pode ter problemas de contraste em componentes third-party → Testar manualmente
- Offline queue pode crescer indefinidamente → Limitar a 50 items + TTL de 24h

---

### SPRINT 7 — Perfil Lojista (Gestão)

**Objetivo:** Construir todas as telas de gestão do lojista — dashboard com métricas, clientes, campanhas, vendas, contestações, configurações, relatórios e menu expandido.

**Pilares endereçados:** P4 (Rede 🟢 — múltiplos endpoints), P6 (UI/UX 🟢🟡 — tabelas mobile, charts, forms), P7 (Performance 🟡 — virtualização de listas grandes), P11 (Testes 🟡 — cobertura lojista)

**Telas:**
- Merchant > Dashboard — `app/(merchant)/(tabs)/dashboard.tsx` (ref: Seção 3)
- Merchant > Clientes (Lista) — `app/(merchant)/(tabs)/clientes.tsx` (ref: Seção 3)
- Merchant > Cliente Detalhe — `app/(merchant)/cliente-detail.tsx` (ref: Seção 3)
- Merchant > Campanhas — `app/(merchant)/campanhas.tsx` (ref: Seção 3)
- Merchant > Vendas — `app/(merchant)/vendas.tsx` (ref: Seção 3)
- Merchant > Contestações — `app/(merchant)/contestacoes.tsx` (ref: Seção 3)
- Merchant > Configurações — `app/(merchant)/configuracoes.tsx` (ref: Seção 3)
- Merchant > Relatórios — `app/(merchant)/relatorios.tsx` (ref: Seção 3)
- Merchant > Menu "Mais" — `app/(merchant)/(tabs)/more.tsx` (ref: Seção 3)

**Endpoints consumidos:**
- `GET /api/v1/dashboard` → Métricas resumidas (Ref: BACKEND_ANALYSIS.md §1.9)
- `GET /api/v1/dashboard/chart` → Dados para gráfico de evolução (Ref: BACKEND_ANALYSIS.md §1.9)
- `GET /api/v1/dashboard/transacoes` → Últimas transações (Ref: BACKEND_ANALYSIS.md §1.9)
- `GET /api/v1/dashboard/top-clientes` → Top clientes por cashback (Ref: BACKEND_ANALYSIS.md §1.9)
- `GET /api/v1/clientes` → Listar clientes paginado + search (Ref: BACKEND_ANALYSIS.md §1.6)
- `GET /api/v1/clientes/{id}` → Detalhe do cliente (Ref: BACKEND_ANALYSIS.md §1.6)
- `GET /api/v1/clientes/{id}/saldo` → Saldo do cliente (Ref: BACKEND_ANALYSIS.md §1.6)
- `GET /api/v1/clientes/{id}/extrato` → Extrato do cliente (Ref: BACKEND_ANALYSIS.md §1.6)
- `GET /api/v1/campanhas` → Listar campanhas (Ref: BACKEND_ANALYSIS.md §1.7)
- `POST /api/v1/campanhas` → Criar campanha (Ref: BACKEND_ANALYSIS.md §1.7)
- `PATCH /api/v1/campanhas/{id}` → Editar campanha (Ref: BACKEND_ANALYSIS.md §1.7)
- `DELETE /api/v1/campanhas/{id}` → Excluir campanha (Ref: BACKEND_ANALYSIS.md §1.7)
- `GET /api/v1/cashback` → Listar vendas/transações (Ref: BACKEND_ANALYSIS.md §1.4)
- `GET /api/v1/contestacoes` → Listar contestações da empresa (Ref: BACKEND_ANALYSIS.md §1.15)
- `PATCH /api/v1/contestacoes/{id}` → Responder contestação (Ref: BACKEND_ANALYSIS.md §1.15)
- `GET /api/v1/config` → Configurações da empresa (Ref: BACKEND_ANALYSIS.md §1.10)
- `PATCH /api/v1/config` → Atualizar configurações (Ref: BACKEND_ANALYSIS.md §1.10)
- `POST /api/v1/config/logo` → Upload de logo (FormData) (Ref: BACKEND_ANALYSIS.md §1.10)
- `GET /api/v1/relatorios` → Relatórios com métricas calculadas (Ref: BACKEND_ANALYSIS.md §1.17)

**Endpoints a CRIAR no backend:**
- Nenhum novo — todos os 62 endpoints web do lojista já estão prontos (ref: CONVERGENCE_ANALYSIS.md §2.2)

**Componentes novos:**
- [ ] `StatsCard` — card de métrica com ícone, valor, label e variação (↑↓) para dashboard
- [ ] `ChartCard` — card com gráfico de evolução de cashback (library TBD: victory-native ou chart-kit)
- [ ] `DataTable` — tabela mobile-friendly com colunas scrollable horizontalmente
- [ ] `SearchBar` — barra de busca com debounce para clientes
- [ ] `CampanhaForm` — bottom sheet form para criar/editar campanha (nome, datas, percentual, validade)
- [ ] `ContestacaoResponseForm` — bottom sheet para responder contestação (status + resposta texto)
- [ ] `ConfigForm` — formulário de configurações da empresa (percentual, validade, carência, modo saldo)
- [ ] `LogoUpload` — componente de upload de logo com preview e crop
- [ ] `MenuList` — lista de itens do menu "Mais" com ícones e badge de notificação

**Stores/Hooks novos:**
- [ ] `useDashboard` — reutilizar do @cashback/shared (4 queries: stats, chart, transações, top clientes)
- [ ] `useClientes` — React Query hook com busca debounced e paginação
- [ ] `useCampanhasCRUD` — React Query mutations para criar/editar/excluir campanhas com invalidação
- [ ] `useVendas` — React Query hook para listagem com filtros (status, data, cliente)
- [ ] `useContestacoes` — React Query hook para listagem com filtros (status, tipo, data)
- [ ] `useConfig` — React Query hook GET/PATCH config + upload logo

**@cashback/shared:**
- [ ] Reutilizar `dashboard.service.ts` (getStats, getChart, getTransacoes, getTopClientes)
- [ ] Reutilizar `cliente.service.ts` (getClientes, getCliente, getClienteSaldo, getClienteExtrato)
- [ ] Reutilizar `campanha.service.ts` (CRUD completo)
- [ ] Reutilizar `contestacao.service.ts` (list, respond)
- [ ] Reutilizar `config.service.ts` (getConfig, updateConfig, uploadLogo)
- [ ] Reutilizar `relatorio.service.ts` (getRelatorios)
- [ ] Reutilizar `useDashboard` hook do shared
- [ ] Reutilizar schemas: `campanhaSchema`, `companySchema` (config validations)
- [ ] Adicionar chaves i18n: `mobile.merchant.dashboard.*`, `mobile.merchant.clientes.*`, `mobile.merchant.campanhas.*`, `mobile.merchant.vendas.*`, `mobile.merchant.contestacoes.*`, `mobile.merchant.config.*`, `mobile.merchant.relatorios.*`

**Testes:**
- Unitários: campanhaSchema (datas, percentual range), configSchema (percentual max, carência), filtros de vendas
- Componente: StatsCard exibe métricas; DataTable scroll horizontal; SearchBar debounce; CampanhaForm validação; ContestacaoResponseForm submit
- Integração: Dashboard carrega 4 queries em paralelo; Clientes → busca por nome → detalhe → extrato; Criar campanha → sucesso → lista atualizada; Responder contestação → status muda; Config → editar → salvar → feedback sucesso

**Configurações/Setup:**
- [ ] Configurar biblioteca de gráficos (avaliar victory-native vs react-native-chart-kit)
- [ ] Configurar upload de imagem (expo-image-picker para logo)
- [ ] Configurar FlashList para listas de clientes, vendas, campanhas
- [ ] Configurar prefetch de dados ao entrar nas tabs do lojista

**Critérios de aceite:**
- [ ] Dashboard lojista: 4 cards de métricas + gráfico de evolução + últimas transações + top clientes
- [ ] Clientes: busca por nome/email/CPF + paginação + detalhe com saldo + extrato
- [ ] Campanhas: listar + criar + editar + excluir com confirmação
- [ ] Vendas: listar com filtros (status, data, campanha, cliente) + paginação
- [ ] Contestações: listar + responder (aprovar/rejeitar com resposta)
- [ ] Configurações: editar dados da empresa + upload logo + percentual + validade + modo saldo
- [ ] Relatórios: métricas resumidas com filtro de período
- [ ] Menu "Mais": lista de itens com badge de notificação + navegação para cada sub-tela
- [ ] Todas as listas com pull-to-refresh + skeleton loading + empty state
- [ ] Upload de logo funcional com preview antes de enviar

**Dependências:**
- Sprint: Sprint 4 (MerchantTabs, cashback flow), Sprint 0 (shared services)
- Backend: Nenhum novo endpoint

**Riscos:**
- Biblioteca de gráficos pode ter problemas de performance em devices low-end → Testar em device real
- Upload de logo em redes lentas → Mostrar progresso + timeout de 60s
- Volume de dados em clientes/vendas pode ser grande → FlashList + paginação obrigatória

---

### SPRINT 8 — Polish + E2E + Publicação

**Objetivo:** Polimento final do app, testes end-to-end dos fluxos críticos, otimizações de performance, preparação de assets para as lojas e submissão para Apple App Store e Google Play.

**Pilares endereçados:** P7 (Performance 🟡🔴 — bundle analysis, image optimization, startup time), P11 (Testes 🟡 — E2E top 3 fluxos), P12 (CI/CD 🟡 — EAS Submit, OTA updates), P13 (Monitoramento 🟡 — Sentry production, analytics), P16 (App Stores 🟢 — screenshots, metadata, review)

**Telas:**
- Nenhuma tela nova — sprint de polish, testes e publicação
- Splash screen configurada (expo-splash-screen) com assets finais

**Endpoints consumidos:**
- Todos os endpoints dos sprints anteriores (testes E2E end-to-end)

**Endpoints a CRIAR no backend:**
- Nenhum novo — todos os endpoints devem estar prontos e testados

**Componentes novos:**
- Nenhum componente novo — ajustes visuais e de animação em componentes existentes

**Stores/Hooks novos:**
- [ ] `useAppUpdate` — hook para verificar versão disponível (expo-updates OTA)
- [ ] `useStartupPerformance` — hook para medir e reportar tempo de inicialização ao Sentry

**@cashback/shared:**
- Nenhuma extração nova — apenas ajustes finais em traduções e formatadores

**Testes:**
- E2E (Maestro ou Detox — a definir):
  - [ ] **Fluxo 1 — Login + Dashboard:** Abrir app → login (email/senha) → dashboard exibe saldo → pull-to-refresh → logout
  - [ ] **Fluxo 2 — Gerar Cashback (Lojista):** Login lojista → Cashback tab → CPF → valor → campanha → confirmar → sucesso
  - [ ] **Fluxo 3 — QR Code (Consumer + Merchant):** Login consumidor → gerar QR → (trocar para lojista) → scan QR → validar → utilizar cashback
- Cobertura:
  - [ ] Target: 70% unitários, 50% componentes, 30% integração, 3 E2E
  - [ ] Rodar cobertura completa e reportar: `jest --coverage`
- Performance:
  - [ ] Medir startup time (cold start < 3s, warm < 1s)
  - [ ] Medir TTI (Time to Interactive) do Dashboard (< 2s)
  - [ ] Bundle analysis: verificar size do JS bundle (target < 10MB)
  - [ ] Verificar FPS em listas longas com Flipper (target: 60fps)

**Configurações/Setup:**
- [ ] Configurar splash screen com assets finais (logo, cores, animação)
- [ ] Configurar app icon (iOS: 1024x1024, Android: adaptive icon)
- [ ] Configurar expo-updates para OTA updates em produção
- [ ] Configurar EAS Submit (auto-submit para App Store Connect e Google Play Console)
- [ ] Configurar Sentry production (environment: production, source maps upload)
- [ ] Configurar analytics (amplitude, mixpanel ou custom — a definir)
- [ ] Gerar screenshots para App Store (6.7", 6.1", iPad) e Google Play (phone, tablet)
- [ ] Preparar metadata: título, descrição, keywords, categoria, classificação etária
- [ ] Preparar política de privacidade URL (requisito obrigatório)
- [ ] Configurar App Store privacy labels (data collection declarations)
- [ ] Configurar Google Play data safety section
- [ ] Configurar certificado de assinatura (Android keystore, Apple distribution cert)

**Critérios de aceite:**
- [ ] 3 testes E2E passam com sucesso em simulador iOS e emulador Android
- [ ] Cobertura de testes: unitários >= 70%, componentes >= 50%, integração >= 30%
- [ ] Cold start < 3s em device real mid-range (ex: iPhone SE, Pixel 5)
- [ ] JS bundle size < 10MB
- [ ] Nenhum crash report no Sentry durante QA interno (mínimo 2 dias de dog-fooding)
- [ ] App icon e splash screen com assets finais aprovados
- [ ] Screenshots geradas para todas as resoluções obrigatórias
- [ ] Metadata completa em pt-BR e en
- [ ] Política de privacidade acessível via URL e in-app
- [ ] Privacy labels / data safety preenchidos corretamente
- [ ] EAS Build production gera APK/AAB (Android) e IPA (iOS) assinados
- [ ] App submetido para Apple App Review
- [ ] App submetido para Google Play review
- [ ] OTA updates configurado para hotfixes pós-publicação

**Dependências:**
- Sprint: Sprints 0-7 completos (todas as features)
- Backend: Todos os endpoints em produção e estáveis
- Design: Assets finais (ícone, splash, screenshots) aprovados
- Legal: Política de privacidade revisada e publicada

**Riscos:**
- Apple App Review pode rejeitar na primeira submissão → Preparar para 1-2 ciclos de review (5-7 dias cada)
- Google Play review geralmente mais rápido (1-3 dias), mas pode pedir ajustes de data safety
- OTA updates não funcionam para mudanças nativas → Apenas para JS bundle updates
- Screenshots podem precisar de ajuste se design mudar durante QA

---

## 5. Score de Maturidade por Sprint

> Evolução esperada dos 16 Pilares de Qualidade Mobile ao longo dos 9 sprints.
> Score 0-5 (ref: MOBILE_PILLARS_FRAMEWORK.md — Score de Maturidade).
> Target MVP (Sprint 8): score >= 3 em todos os pilares (todos os 🟢 atendidos).

| Pilar | S0 | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 |
|-------|----|----|----|----|----|----|----|----|-----|
| P1 — Arquitetura | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 4 |
| P2 — Navegação | 1 | 2 | 3 | 3 | 3 | 3 | 3 | 4 | 4 |
| P3 — Estado | 2 | 3 | 3 | 3 | 3 | 3 | 4 | 4 | 4 |
| P4 — Rede/API | 2 | 3 | 3 | 3 | 3 | 3 | 3 | 4 | 4 |
| P5 — Auth/Segurança | 0 | 3 | 3 | 3 | 3 | 3 | 4 | 4 | 4 |
| P6 — UI/UX | 0 | 2 | 3 | 3 | 3 | 3 | 4 | 4 | 4 |
| P7 — Performance | 0 | 1 | 2 | 3 | 3 | 3 | 3 | 3 | 4 |
| P8 — Offline/Persist | 1 | 2 | 2 | 3 | 3 | 3 | 4 | 4 | 4 |
| P9 — Nativo | 0 | 0 | 0 | 0 | 1 | 3 | 4 | 4 | 4 |
| P10 — Push | 0 | 0 | 0 | 0 | 0 | 3 | 3 | 3 | 4 |
| P11 — Testes | 1 | 2 | 2 | 3 | 3 | 3 | 3 | 3 | 4 |
| P12 — CI/CD | 2 | 2 | 2 | 2 | 2 | 2 | 3 | 3 | 4 |
| P13 — Monitoramento | 1 | 1 | 1 | 1 | 1 | 2 | 2 | 3 | 4 |
| P14 — Acessibilidade | 0 | 2 | 2 | 2 | 2 | 2 | 3 | 3 | 4 |
| P15 — i18n | 2 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 4 |
| P16 — App Stores | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 3 |

### Resumo de Evolução

| Marco | Score Médio | Pilares >= 3 | Status |
|-------|-------------|-------------|--------|
| **Sprint 0** (Fundação) | 0.75 | 2/16 | Infra pronta |
| **Sprint 1** (Auth) | 1.75 | 5/16 | Auth funcional |
| **Sprint 2** (Dashboard) | 2.00 | 7/16 | Consumer básico |
| **Sprint 3** (Transações) | 2.25 | 9/16 | Consumer completo |
| **Sprint 4** (Cashback) | 2.31 | 9/16 | Merchant core |
| **Sprint 5** (QR + Push) | 2.56 | 11/16 | Nativo integrado |
| **Sprint 6** (Biometria) | 3.00 | 13/16 | Polish |
| **Sprint 7** (Lojista) | 3.19 | 14/16 | Feature complete |
| **Sprint 8** (Publicação) | **3.81** | **16/16** | **MVP pronto** |

> **Nota:** Score 3 = todos os critérios 🟢 Essenciais atendidos. Score 4 = 🟢 + 🟡 Recomendados.
> O app atinge score >= 3 em todos os 16 pilares no Sprint 8, cumprindo o requisito mínimo para MVP.

---

## 6. Padrões e Convenções

> Padrões de código, nomenclatura, commits, branches e code review para manter consistência no projeto mobile.

### 6.1 Nomenclatura de Arquivos

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Tela (Screen) | `kebab-case.tsx` | `saldo-detail.tsx`, `gerar-cashback.tsx` |
| Componente UI | `PascalCase.tsx` | `SaldoCard.tsx`, `QRCodeDisplay.tsx` |
| Hook | `camelCase.ts` | `useSaldo.ts`, `useBiometric.ts` |
| Service | `kebab-case.service.ts` | `mobile.auth.service.ts`, `cashback.service.ts` |
| Store | `camelCase.store.ts` | `authStore.ts`, `notificationStore.ts` |
| Schema | `camelCase.schema.ts` | `cashbackSchema.ts`, `authSchema.ts` |
| Tipo/Interface | `PascalCase` em `camelCase.ts` | `ClienteSaldo` em `customer.ts` |
| Teste | `*.test.ts(x)` | `SaldoCard.test.tsx`, `useSaldo.test.ts` |
| Constantes | `UPPER_SNAKE_CASE` | `API_TIMEOUT`, `MAX_RETRY_COUNT` |

### 6.2 Nomenclatura de Componentes

```
// Componentes reutilizáveis: src/components/
Button.tsx          ← genérico
Input.tsx           ← genérico
SaldoCard.tsx       ← domain-specific

// Componentes de tela: organizados por feature no Expo Router
app/(consumer)/(tabs)/dashboard.tsx   ← tela
app/(consumer)/saldo-detail.tsx       ← tela drill-down
```

### 6.3 Commits — Conventional Commits

```
<tipo>(<escopo>): <mensagem em português>

Tipos:
  feat     — nova feature
  fix      — correção de bug
  refactor — refatoração sem mudança de comportamento
  style    — mudança visual/formatação
  test     — adição/alteração de testes
  chore    — configuração, dependências, CI
  docs     — documentação

Escopos (opcionais):
  auth, dashboard, cashback, qrcode, notifications, profile,
  merchant, shared, infra, ci, deps

Exemplos:
  feat(auth): implementar login biométrico com expo-local-authentication
  fix(cashback): corrigir cálculo FEFO ao utilizar cashback parcial
  chore(deps): atualizar expo SDK 52.1 → 52.2
  test(dashboard): adicionar testes de integração para SaldoCard
```

### 6.4 Branches

```
Padrão: <tipo>/<sprint>-<descrição>

main                          ← produção (protegida)
develop                       ← integração
feature/s1-auth-login         ← feature do Sprint 1
feature/s2-dashboard-saldo    ← feature do Sprint 2
fix/s3-extrato-cursor-bug     ← bugfix do Sprint 3
chore/s0-monorepo-setup       ← infra do Sprint 0
```

### 6.5 Code Review Checklist

Para cada PR, verificar:

- [ ] **Pilar 1:** Separação de responsabilidades (UI vs lógica vs dados)
- [ ] **Pilar 4:** Nenhuma chamada HTTP direta em componentes (usar services)
- [ ] **Pilar 5:** Tokens nunca em MMKV/AsyncStorage (apenas SecureStore)
- [ ] **Pilar 6:** Touch targets >= 48dp em elementos interativos
- [ ] **Pilar 7:** Listas usam FlashList (não FlatList) com keyExtractor
- [ ] **Pilar 11:** Testes adicionados para nova lógica de negócio
- [ ] **Pilar 14:** accessibilityLabel em novos elementos interativos
- [ ] **Pilar 15:** Nenhuma string hardcoded (todas via i18n `t()`)
- [ ] TypeScript sem `any` (usar tipos do @cashback/shared)
- [ ] Imports do @cashback/shared (não importar direto do web)

### 6.6 Estrutura Padrão de Tela

```typescript
// app/(consumer)/saldo-detail.tsx
export default function SaldoDetailScreen() {
  // 1. Hooks de navegação / route params
  const { id } = useLocalSearchParams<{ id: string }>()

  // 2. Hooks de dados (React Query)
  const { data: saldo, isLoading, error, refetch } = useSaldo()

  // 3. Hooks de estado local
  const [filter, setFilter] = useState<EmpresaFilter | null>(null)

  // 4. Handlers
  const handleRefresh = useCallback(() => { refetch() }, [refetch])

  // 5. Loading / Error / Empty states
  if (isLoading) return <SaldoDetailSkeleton />
  if (error) return <ErrorState onRetry={refetch} />
  if (!saldo?.por_empresa.length) return <EmptyState message={t('saldo.empty')} />

  // 6. Render
  return (
    <ScrollView refreshControl={<RefreshControl onRefresh={handleRefresh} />}>
      <SaldoCard total={saldo.total} expirando={saldo.proximo_a_expirar} />
      <EmpresaBreakdownList empresas={saldo.por_empresa} filter={filter} />
    </ScrollView>
  )
}
```

---

## 7. Configurações Expo/EAS

> Configurações essenciais do projeto Expo managed workflow e EAS Build/Submit.

### 7.1 app.config.ts

```typescript
import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'H4 Cashback',
  slug: 'h4-cashback',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'h4cashback',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#22C55E',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.h4alex.cashback',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'Necessário para escanear QR codes de cashback',
      NSFaceIDUsageDescription: 'Utilizado para login rápido por biometria',
    },
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#22C55E',
    },
    package: 'com.h4alex.cashback',
    versionCode: 1,
    permissions: [
      'CAMERA',
      'VIBRATE',
      'RECEIVE_BOOT_COMPLETED',
    ],
  },
  plugins: [
    'expo-router',
    'expo-localization',
    'expo-secure-store',
    ['expo-camera', { cameraPermission: 'Necessário para escanear QR codes' }],
    ['expo-notifications', {
      icon: './assets/notification-icon.png',
      color: '#22C55E',
      sounds: [],
    }],
    ['expo-local-authentication', {
      faceIDPermission: 'Utilizado para login rápido por biometria',
    }],
    '@sentry/react-native/expo',
  ],
  extra: {
    eas: { projectId: '<EAS_PROJECT_ID>' },
    apiUrl: process.env.API_URL ?? 'http://localhost:4000',
    sentryDsn: process.env.SENTRY_DSN ?? '',
    environment: process.env.APP_ENV ?? 'development',
  },
  updates: {
    url: 'https://u.expo.dev/<EAS_PROJECT_ID>',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
})
```

### 7.2 eas.json

```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true },
      "env": {
        "APP_ENV": "development",
        "API_URL": "http://localhost:4000"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": false },
      "env": {
        "APP_ENV": "staging",
        "API_URL": "https://staging-api.h4cashback.com.br"
      }
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "APP_ENV": "production",
        "API_URL": "https://api.h4cashback.com.br"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "<APPLE_ID>",
        "ascAppId": "<ASC_APP_ID>",
        "appleTeamId": "<TEAM_ID>"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-key.json",
        "track": "internal"
      }
    }
  }
}
```

### 7.3 Variáveis de Ambiente

| Variável | Development | Staging | Production | Onde definir |
|----------|------------|---------|------------|-------------|
| `API_URL` | `http://localhost:4000` | `https://staging-api.h4cashback.com.br` | `https://api.h4cashback.com.br` | `eas.json` env |
| `APP_ENV` | `development` | `staging` | `production` | `eas.json` env |
| `SENTRY_DSN` | — | DSN staging | DSN production | EAS Secrets |
| `SENTRY_AUTH_TOKEN` | — | — | Token | EAS Secrets |
| `GOOGLE_CLIENT_ID` | ID dev | ID staging | ID production | EAS Secrets |
| `APPLE_CLIENT_ID` | — | — | Service ID | EAS Secrets |

> **Nota:** Secrets sensíveis (Sentry, OAuth client IDs) ficam em EAS Secrets, nunca no repositório.

### 7.4 metro.config.js (Monorepo)

```javascript
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [monorepoRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]
config.resolver.disableHierarchicalLookup = true

module.exports = config
```

---

## 8. Checklist Pré-Desenvolvimento

> Tudo que deve estar resolvido ANTES de iniciar o Sprint 0.

### 8.1 Contas e Acessos

- [ ] Conta Apple Developer ativa ($99/ano) — necessária para builds iOS e TestFlight
- [ ] Conta Google Play Console ativa ($25 one-time) — necessária para builds Android
- [ ] Conta Expo/EAS criada e vinculada ao projeto
- [ ] Repositório Git criado para monorepo (ou decidir se reutiliza cashback-frontend)
- [ ] CI/CD: GitHub Actions configurado com secrets (EAS token, Sentry DSN)
- [ ] Sentry: projeto criado para mobile (separado do web)
- [ ] FCM (Firebase Cloud Messaging): projeto Firebase criado com credenciais server key
- [ ] APNs (Apple Push): certificado p8 ou p12 gerado e configurado no Firebase/Expo

### 8.2 Decisões Técnicas a Tomar

| Decisão | Opções | Impacto | Quando Decidir |
|---------|--------|---------|----------------|
| Navegação | **Expo Router** (recomendado) vs React Navigation puro | Estrutura de pastas, deep linking | Antes do Sprint 0 |
| Estilização | **NativeWind** vs StyleSheet manual vs Tamagui | Velocidade de desenvolvimento, familiaridade | Antes do Sprint 0 |
| Gráficos | **victory-native** vs react-native-chart-kit vs react-native-gifted-charts | Performance, customização | Antes do Sprint 7 |
| E2E Tests | **Maestro** vs Detox | Setup complexity, CI integration | Antes do Sprint 8 |
| Analytics | **Amplitude** vs Mixpanel vs custom | Custo, features, compliance | Antes do Sprint 8 |
| Monorepo root | Repo novo vs fork do cashback-frontend | Git history, CI setup | Antes do Sprint 0 |

### 8.3 Design e Assets

- [ ] Design system mobile aprovado (tokens de cores, tipografia, espaçamento)
- [ ] App icon (1024x1024 Apple, 512x512 + adaptive Android) — versão final
- [ ] Splash screen asset (vetor ou PNG, com guideline de safe area)
- [ ] Notification icon (Android, monocromático, 96x96)
- [ ] Wireframes ou protótipos de alta fidelidade das telas P0 (Login, Dashboard, QR Code)

### 8.4 Backend Ready

- [ ] Endpoints mobile existentes (14) testados e funcionais
- [ ] CORS configurado para origins do app mobile
- [ ] FCM/APNs integração verificada (enviar push de teste)
- [ ] Ambiente staging disponível com dados de teste
- [ ] Credenciais OAuth (Google + Apple) criadas e configuradas
- [ ] Roadmap de 15 endpoints faltantes alinhado com sprints mobile

### 8.5 Equipe e Processos

- [ ] Devices de teste disponíveis: mínimo 1 iPhone (iOS 15+) e 1 Android (API 24+)
- [ ] Jira/Linear/GitHub Projects configurado com sprints do roadmap
- [ ] Definition of Done alinhada com Pilares (score >= 3 por sprint)
- [ ] Processo de code review definido (checklist da Seção 6.5)
- [ ] Canal de comunicação backend ↔ mobile definido (para coordenar endpoints)

---

## 9. Resumo Executivo

> Visão consolidada do MOBILE_PROJECT_SPEC.md com métricas-chave, stack final, riscos e dependências.

### 9.1 Números do Projeto

| Métrica | Valor |
|---------|-------|
| Telas mapeadas | 32 (4 auth, 13 consumidor, 12 lojista, 3 shared) |
| Sprints planejados | 9 (Sprint 0-8) |
| Duração estimada | ~18 semanas (9 sprints × 2 semanas) |
| Endpoints backend existentes | 97 total (14 mobile + 62 web reutilizáveis + 21 admin/outros) |
| Endpoints mobile prontos | 9 (de 14 mobile existentes) |
| Endpoints a criar | 15 (5 críticos, 5 altos, 5 médios) |
| Ajustes em endpoints existentes | 6 (saldo, extrato, QR, OAuth, CORS, erro format) |
| Arquivos extraíveis para @cashback/shared | 57 (~69% do frontend web) |
| Componentes UI a criar | ~25 (14 mapeados de web + 8 mobile-only + 3 novos) |
| Dependências npm novas (não existem no web) | ~36 |
| Riscos identificados | 15 (4 críticos, 5 altos, 6 médios) |
| Pilares de qualidade | 16 (target MVP: score >= 3 em todos) |

### 9.2 Stack Tecnológica Final

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | React Native + Expo (managed) | SDK ~52, RN 0.76.x |
| Linguagem | TypeScript (strict mode) | ~5.3 |
| Navegação | Expo Router (file-based) | latest |
| Estado global | Zustand | ^4.4 |
| Estado servidor | TanStack React Query | ^5.14 |
| HTTP | Axios (via @cashback/shared) | ^1.6 |
| Validação | Zod + react-hook-form | ^4.3 / ^7.71 |
| Storage seguro | expo-secure-store | latest |
| Cache rápido | react-native-mmkv | latest |
| UI/Animação | react-native-reanimated | latest |
| Listas | @shopify/flash-list | latest |
| Bottom sheets | @gorhom/bottom-sheet | latest |
| Push | expo-notifications | latest |
| Biometria | expo-local-authentication | latest |
| QR Code | expo-camera + react-native-qrcode-svg | latest |
| i18n | i18next + react-i18next | ^23.7 / ^14.0 |
| Monitoramento | @sentry/react-native | latest |
| CI/CD | GitHub Actions + EAS Build/Submit | latest |
| Testes | Jest + @testing-library/react-native | latest |

### 9.3 Riscos Consolidados

| Severidade | Riscos | Sprint Alvo |
|-----------|--------|-------------|
| **Crítico** (4) | OAuth social stub 501, Delete account LGPD inexistente, QR sem persistência, Notificações in-app inexistente | S1, S1, S3, S5 |
| **Alto** (5) | Password reset mobile, Perfil sem edição, Push FCM/APNs não verificado, Extrato N+1, Senha web usa mocks | S1, S1, S2, S2, S1 |
| **Médio** (6) | Tipos legados, secureStorage Web Crypto, SMS provider, NFe stub, Validação assíncrona, CORS mobile | S0, S0, S2, Futuro, S1, S0 |

### 9.4 Dependências Críticas

| Dependência | Responsável | Quando | Bloqueante Para |
|-------------|------------|--------|-----------------|
| 5 endpoints críticos de auth | Backend | Antes do Sprint 1 | Auth completo |
| OAuth Google + Apple Sign-In | Backend | Antes do Sprint 1 | Publicação App Store |
| CORS configurado para mobile | Backend/DevOps | Antes do Sprint 0 | Qualquer request API |
| Tabela notifications + 6 endpoints | Backend | Antes do Sprint 5 | Central de notificações |
| QR token persistência Redis | Backend | Antes do Sprint 5 | Fluxo QR end-to-end |
| Credenciais FCM + APNs | DevOps | Antes do Sprint 5 | Push notifications |
| Conta Apple Developer | PO/Admin | Antes do Sprint 0 | Builds iOS |
| Conta Google Play Console | PO/Admin | Antes do Sprint 0 | Builds Android |
| Assets de design finais | Design | Antes do Sprint 8 | Publicação |
| Política de privacidade URL | Legal | Antes do Sprint 8 | Publicação |

### 9.5 Diagrama de Dependências entre Sprints

```
Sprint 0 (Fundação)
  ├──→ Sprint 1 (Auth)
  │      ├──→ Sprint 2 (Dashboard + Saldo)
  │      │      ├──→ Sprint 3 (Transações + Histórico)
  │      │      │      └──→ Sprint 5 (QR + Push) ← depende de S2 e S3
  │      │      └──→ Sprint 6 (Biometria) ← depende de S5
  │      └──→ Sprint 4 (Cashback + Resgate)
  │             └──→ Sprint 7 (Lojista Gestão) ← depende de S4
  └─────────────────────────────→ Sprint 8 (Polish + Pub) ← depende de todos
```

### 9.6 Roadmap Visual

```
Semana:  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18
         ├──┤  ├──┤  ├──┤  ├──┤  ├──┤  ├──┤  ├──┤  ├──┤  ├──┤
Sprint:  S0     S1     S2     S3     S4     S5     S6     S7     S8
         Funda  Auth   Dash   Trans  Cash   QR+    Bio    Loja   Polish
         ção          +Saldo +Hist  +Resg  Push   +Cfg   Gestão +Pub
```

---

## Checklist de Validação

> Verificação de que este documento atende a todos os requisitos da Fase 4.

- [x] **Seção 1 (Visão Geral):** Nome do app, descrição, público-alvo, plataformas, objetivos MVP (P0), roadmap P1/P2
- [x] **Seção 2 (Arquitetura Técnica):** Estrutura de pastas completa, tech stack (~49 pacotes), diagrama de data flow, diagrama de navegação (Expo Router)
- [x] **Seção 3 (Mapa de Telas):** 32 telas documentadas com formato completo (rota, perfil, auth, pilares, sprint, endpoints, wireframe, dados, ações, estados, componentes, testes)
- [x] **Seção 4 (Sprint Plan):** 9 sprints (0-8) com formato completo (objetivo, pilares, telas, endpoints, componentes, stores/hooks, shared, testes, configs, critérios, dependências, riscos)
- [x] **Seção 5 (Score de Maturidade):** Matriz 16 pilares × 9 sprints com scores 0-5, resumo de evolução, target MVP (3 em todos)
- [x] **Seção 6 (Padrões e Convenções):** Nomenclatura de arquivos, commits (Conventional Commits), branches, code review checklist, estrutura padrão de tela
- [x] **Seção 7 (Configurações Expo/EAS):** `app.config.ts` completo, `eas.json` com 3 profiles, variáveis de ambiente, `metro.config.js` monorepo
- [x] **Seção 8 (Checklist Pré-Dev):** Contas/acessos, decisões técnicas, design/assets, backend ready, equipe/processos
- [x] **Seção 9 (Resumo Executivo):** Números do projeto, stack final, riscos consolidados, dependências críticas, diagrama de dependências, roadmap visual
- [x] Cada tela referencia: rota, perfil, auth, pilares, sprint, endpoints, wireframe ASCII, dados, ações, 4 estados, componentes, testes
- [x] Cada sprint referencia: objetivo, pilares (🟢🟡🔴), telas, endpoints consumidos, endpoints a criar, componentes, stores/hooks, @cashback/shared, testes, configs, critérios de aceite, dependências, riscos
- [x] Referências cruzadas a BACKEND_ANALYSIS.md, FRONTEND_ANALYSIS.md, CONVERGENCE_ANALYSIS.md, MOBILE_PILLARS_FRAMEWORK.md
- [x] Documento escrito em pt-BR com cabeçalho padrão

---

> **Fim do documento MOBILE_PROJECT_SPEC.md**
> Gerado em 2026-02-25 via MOBILE_ANALYSIS_PROMPTS v4 — Fase 4 (Spec Master)
> Inputs: BACKEND_ANALYSIS.md (1396 linhas), FRONTEND_ANALYSIS.md (1200 linhas), CONVERGENCE_ANALYSIS.md (1255 linhas), MOBILE_PILLARS_FRAMEWORK.md (796 linhas)

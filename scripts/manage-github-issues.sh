#!/bin/bash
# =============================================================================
# manage-github-issues.sh
# Fecha sprints concluídos e cria issues para: Qualidade, Polish, Futuro
# Uso: ./scripts/manage-github-issues.sh
# Requer: gh CLI autenticado (gh auth login)
# =============================================================================

set -euo pipefail

REPO="H4Alex/cashback-mobile"

echo "============================================"
echo "  Cashback Mobile — Issue Management"
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
# FASE 1: CRIAR LABELS NOVAS
# =============================================================================
echo ">>> Criando Labels novas..."

declare -A NEW_LABELS=(
  ["quality"]="C2E0C6:Qualidade e Testes"
  ["polish"]="FBCA04:Polish e UX refinement"
  ["future"]="5319E7:Funcionalidade futura"
  ["phase:quality"]="C2E0C6:Fase — Qualidade & Testes"
  ["phase:polish"]="FBCA04:Fase — Polish"
  ["phase:future"]="D4C5F9:Fase — Funcionalidades Futuras"
)

for label in "${!NEW_LABELS[@]}"; do
  IFS=':' read -r color desc <<< "${NEW_LABELS[$label]}"
  gh label create "$label" --repo "$REPO" --color "$color" --description "$desc" --force 2>/dev/null || true
  echo "  ✓ $label"
done

echo ""

# =============================================================================
# FASE 2: FECHAR SPRINT ISSUES CONCLUÍDOS (#14 a #21)
# =============================================================================
echo ">>> Fechando Sprint Issues concluídos..."

SPRINT_ISSUES=(14 15 16 17 18 19 20 21)
SPRINT_NAMES=(
  "Sprint 1 — Autenticação"
  "Sprint 2 — Dashboard + Saldo"
  "Sprint 3 — Transações + Histórico"
  "Sprint 4 — Cashback + Resgate"
  "Sprint 5 — QR Code + Push"
  "Sprint 6 — Biometria + Config"
  "Sprint 7 — Gestão Lojista"
  "Sprint 8 — Polish + E2E + Publicação"
)

for i in "${!SPRINT_ISSUES[@]}"; do
  num="${SPRINT_ISSUES[$i]}"
  name="${SPRINT_NAMES[$i]}"
  state=$(gh issue view "$num" --repo "$REPO" --json state -q '.state' 2>/dev/null || echo "UNKNOWN")

  if [ "$state" = "OPEN" ]; then
    gh issue close "$num" --repo "$REPO" --comment "Concluído via PR. Todos os itens deste sprint foram implementados. Fechando automaticamente." 2>/dev/null
    echo "  ✓ #$num $name — FECHADO"
  elif [ "$state" = "CLOSED" ]; then
    echo "  - #$num $name — já fechado"
  else
    echo "  ✗ #$num $name — não encontrado ($state)"
  fi
done

echo ""

# =============================================================================
# FASE 3: CRIAR ISSUES — QUALIDADE & TESTES
# =============================================================================
echo ">>> Criando Issues — Qualidade & Testes..."

# QT-01: Testes de Componentes UI
gh issue create --repo "$REPO" \
  --title "Testes de Componentes UI (23 componentes sem cobertura)" \
  --label "quality,phase:quality,P11:testes,priority:high" \
  --body "$(cat <<'BODY'
## Contexto
Temos 26 componentes UI mas apenas 3 com testes (StatsCard, MetricCard, SearchBar).
Precisamos cobrir os 23 restantes para garantir estabilidade.

## Componentes a Testar (por prioridade)

### Críticos (usados em toda a app)
- [ ] `SaldoCard` — renderiza saldo corretamente, formata moeda, mostra expiração
- [ ] `TransactionCard` — renderiza tipos (crédito/débito), status, formata data/valor
- [ ] `Button` / base components — estados (loading, disabled, pressed), variantes
- [ ] `Input` — validação visual, erro, máscara, acessibilidade
- [ ] `Card` — layout, shadows, variantes

### Importantes (usados em fluxos principais)
- [ ] `CashbackTimeline` — renderiza timeline corretamente
- [ ] `CashbackConfirmation` — exibe dados de confirmação, callbacks
- [ ] `NotificationBell` — badge count, onPress callback
- [ ] `NotificationItem` — read/unread, tipos de notificação
- [ ] `OfflineBanner` / `OfflineIndicator` — exibe quando offline
- [ ] `FilterChips` — seleção/deseleção, callback, estado ativo
- [ ] `StatusBadge` — cores por status, texto correto
- [ ] `EmptyState` — imagem, título, descrição, ação
- [ ] `FAB` — posição, onPress, ícone

### Feedback & UX
- [ ] `BiometricPrompt` — solicita biometria, fallback
- [ ] `PermissionRequest` — solicita permissão, explica motivo
- [ ] `SkeletonCard` / `SkeletonTransaction` — animação, layout correto
- [ ] `PullToRefresh` — callback onRefresh, estado refreshing
- [ ] `ThemeToggle` — alterna tema, persiste preferência
- [ ] `CountdownTimer` — contagem regressiva, callback expiração
- [ ] `ContestacaoForm` — validação campos, submit
- [ ] `QRCodeDisplay` — renderiza QR, countdown
- [ ] `SessionCard` — exibe sessão, revoga

## Abordagem
- Usar `@testing-library/react-native` (já instalado)
- Criar mocks para hooks (useAuth, useTheme, etc.)
- Testar: renderização, interação, estados, acessibilidade
- Meta: **50% cobertura de componentes**

## Critérios de Aceite
- [ ] 23 novos test suites criados
- [ ] Todos passando no CI
- [ ] Cobertura componentes >= 50%
BODY
)"
echo "  ✓ QT-01: Testes de Componentes UI"

# QT-02: Testes de Hooks
gh issue create --repo "$REPO" \
  --title "Testes de Custom Hooks (17 hooks sem cobertura)" \
  --label "quality,phase:quality,P11:testes,priority:high" \
  --body "$(cat <<'BODY'
## Contexto
Temos 17 custom hooks e nenhum tem testes unitários diretos.
Hooks são o core da lógica de negócio — precisam de cobertura.

## Hooks a Testar

### Auth & Security
- [ ] `useAuth` — login, logout, refresh, estado autenticado
- [ ] `useBiometric` — verifica hardware, autenticação, fallback
- [ ] `useSessionTimeout` — inatividade, auto-logout, reset timer

### Data Fetching (React Query)
- [ ] `useSaldo` / `useCashback` — fetch, cache, staleTime, refetch
- [ ] `useExtrato` / `useExtratoInfinite` — paginação cursor, filtros
- [ ] `useMerchantManagement` — dashboard, clientes, campanhas, vendas
- [ ] `useNotifications` — lista, mark read, preferências

### Device & Platform
- [ ] `usePushSetup` — registro push token, permissão
- [ ] `useAppUpdate` — verifica updates OTA, download, reload
- [ ] `useRefreshOnFocus` — refetch ao voltar pro app
- [ ] `useCountdown` — timer countdown, callback expiração

### Offline & Performance
- [ ] `useOfflineQueue` — enfileira ops, replay ao reconectar
- [ ] `useStartupPerformance` — mede cold start, TTI

## Abordagem
- Usar `@testing-library/react-hooks` ou `renderHook` do `@testing-library/react-native`
- Mock React Query com `QueryClientProvider` de teste
- Mock `expo-secure-store`, `expo-local-authentication`, etc.
- Testar: estados, side effects, error handling, cache behavior
- Meta: **70% cobertura de hooks**

## Critérios de Aceite
- [ ] 17 novos test suites para hooks
- [ ] Todos passando no CI
- [ ] Cobertura hooks >= 70%
BODY
)"
echo "  ✓ QT-02: Testes de Custom Hooks"

# QT-03: Coverage Thresholds
gh issue create --repo "$REPO" \
  --title "Configurar Jest Coverage Thresholds + Badge no README" \
  --label "quality,phase:quality,P11:testes,P12:ci-cd" \
  --body "$(cat <<'BODY'
## Contexto
Temos 120 testes passando, mas sem coverage thresholds configurados.
O CI roda testes mas não verifica cobertura mínima.

## Tasks
- [ ] Configurar `coverageThreshold` no jest.config:
  ```json
  {
    "global": {
      "branches": 50,
      "functions": 60,
      "lines": 70,
      "statements": 70
    }
  }
  ```
- [ ] Adicionar `--coverage` ao script `test:ci` no package.json
- [ ] Configurar `collectCoverageFrom` para incluir apenas `src/` e excluir `node_modules`, `__tests__`
- [ ] Adicionar step no CI (`ci.yml`) que roda `jest --coverage` e falha se abaixo do threshold
- [ ] Gerar badge de coverage (ex: usando `jest-coverage-badges` ou `codecov`)
- [ ] Adicionar badge no README.md

## Critérios de Aceite
- [ ] `npm run test:coverage` falha se cobertura < thresholds
- [ ] CI bloqueia PR se cobertura cai
- [ ] Badge atualizado automaticamente
BODY
)"
echo "  ✓ QT-03: Coverage Thresholds"

# QT-04: Testes de Integração de Navegação
gh issue create --repo "$REPO" \
  --title "Testes de Integração — Navegação e Auth Guards" \
  --label "quality,phase:quality,P11:testes,P2:navegacao" \
  --body "$(cat <<'BODY'
## Contexto
A navegação é complexa (auth/consumer/merchant com guards) mas não tem testes de integração.
Precisamos verificar que as rotas funcionam corretamente com diferentes estados de auth.

## Cenários a Testar
- [ ] Usuário não autenticado → redirecionado para Login
- [ ] Consumidor autenticado → acessa consumer tabs
- [ ] Lojista autenticado → acessa merchant tabs
- [ ] Consumidor não pode acessar rotas de lojista
- [ ] Lojista não pode acessar rotas de consumidor
- [ ] Deep linking funciona para rotas protegidas
- [ ] Logout limpa estado e redireciona para login
- [ ] Token expirado → refresh automático → mantém rota
- [ ] Refresh falha → redireciona para login

## Abordagem
- Usar `expo-router/testing-library` ou mock do router
- Configurar providers (QueryClient, Auth, Theme) para teste
- Simular diferentes estados de autenticação via stores

## Critérios de Aceite
- [ ] 9 cenários de navegação testados
- [ ] Auth guards verificados para consumer + merchant
- [ ] Deep linking testado
BODY
)"
echo "  ✓ QT-04: Testes de Navegação"

# QT-05: E2E no CI
gh issue create --repo "$REPO" \
  --title "Habilitar E2E (Maestro) no CI para PRs críticos" \
  --label "quality,phase:quality,P11:testes,P12:ci-cd,priority:medium" \
  --body "$(cat <<'BODY'
## Contexto
Temos 3 fluxos Maestro configurados mas o workflow `e2e.yml` é manual (workflow_dispatch).
Precisamos rodar E2E automaticamente em PRs que afetam fluxos críticos.

## Tasks
- [ ] Configurar `e2e.yml` para rodar em PRs que modificam `app/`, `src/` ou `package.json`
- [ ] Adicionar cache do emulador Android para reduzir tempo
- [ ] Adicionar fluxo iOS (simulador) se possível no CI
- [ ] Configurar upload de screenshots/vídeos de falhas como artifacts
- [ ] Adicionar retry (1x) para flaky tests
- [ ] Configurar notificação Slack/email em caso de falha E2E

## Fluxos Existentes
1. `01_login_dashboard.yaml` — Login → Dashboard → Saldo → Pull-to-refresh → Logout
2. `02_gerar_cashback.yaml` — Login lojista → CPF → Valor → Confirmar → Sucesso
3. `03_qrcode_flow.yaml` — Consumer gera QR → Lojista escaneia → Valida

## Critérios de Aceite
- [ ] E2E roda automaticamente em PRs que afetam código crítico
- [ ] Screenshots de falha disponíveis como artifacts
- [ ] Tempo total E2E < 15 minutos
BODY
)"
echo "  ✓ QT-05: E2E no CI"

# QT-06: Testes de Acessibilidade
gh issue create --repo "$REPO" \
  --title "Testes automatizados de Acessibilidade (a11y)" \
  --label "quality,phase:quality,P14:acessibilidade,P11:testes" \
  --body "$(cat <<'BODY'
## Contexto
Temos labels de acessibilidade em alguns componentes, mas sem validação automatizada.
Precisamos garantir WCAG AA compliance.

## Tasks
- [ ] Instalar `jest-axe` ou `@testing-library/jest-native` matchers de a11y
- [ ] Criar helper `testAccessibility(component)` reutilizável
- [ ] Verificar `accessibilityLabel` em todos componentes interativos
- [ ] Verificar `accessibilityRole` (button, text, image, etc.)
- [ ] Verificar `accessibilityState` (disabled, selected, checked)
- [ ] Verificar contraste de cores >= 4.5:1
- [ ] Verificar touch targets >= 44pt (iOS) / 48dp (Android)
- [ ] Testar com VoiceOver (iOS) e TalkBack (Android) — manual
- [ ] Documentar checklist a11y para novos componentes

## Telas Prioritárias
1. Login / Register (formulários)
2. Dashboard (saldo, transações)
3. QR Code (câmera, resultado)
4. Gerar/Utilizar Cashback (formulários críticos)
5. Notificações (lista, ações)

## Critérios de Aceite
- [ ] Todos componentes interativos com accessibilityLabel
- [ ] Contraste >= 4.5:1 em todo texto
- [ ] Touch targets >= 44pt
- [ ] VoiceOver/TalkBack navegáveis nas 5 telas prioritárias
BODY
)"
echo "  ✓ QT-06: Testes de Acessibilidade"

echo ""

# =============================================================================
# FASE 4: CRIAR ISSUES — POLISH
# =============================================================================
echo ">>> Criando Issues — Polish..."

# PL-01: Gráficos reais
gh issue create --repo "$REPO" \
  --title "Implementar gráficos reais no Dashboard (substituir placeholder)" \
  --label "polish,phase:polish,P6:ui-ux,priority:high" \
  --body "$(cat <<'BODY'
## Contexto
O merchant dashboard mostra placeholder: "Gráfico disponível com react-native-svg".
`react-native-svg` já está instalado (v15.8.0). Falta a biblioteca de charts.

## Tasks
- [ ] Instalar `victory-native` ou `react-native-chart-kit`
- [ ] Implementar gráfico de evolução 7 dias no merchant dashboard:
  - Eixo X: últimos 7 dias
  - Eixo Y: valor em R$
  - Linhas: cashback gerado (verde) + cashback utilizado (azul)
  - Tooltip ao tocar em ponto
- [ ] Implementar mini-chart no consumer dashboard:
  - Sparkline dos últimos 30 dias de cashback recebido
  - Ou bar chart mensal
- [ ] Usar cores do design system (`tokens.ts`)
- [ ] Animação de entrada no gráfico
- [ ] Estado loading (skeleton do gráfico)
- [ ] Estado empty (sem dados)

## Referência Visual
- Linhas suaves com gradiente abaixo
- Cores: primary green (#22C55E) para gerado, blue (#3B82F6) para utilizado
- Font: DMSans para labels

## Critérios de Aceite
- [ ] Gráfico 7 dias funcional no merchant dashboard
- [ ] Mini-chart funcional no consumer dashboard
- [ ] Animação de entrada
- [ ] Skeleton loading + empty state
- [ ] Performance: sem jank ao scrollar perto do gráfico
BODY
)"
echo "  ✓ PL-01: Gráficos reais"

# PL-02: Animações com Reanimated
gh issue create --repo "$REPO" \
  --title "Animações avançadas com Reanimated (transições, contadores, micro-interactions)" \
  --label "polish,phase:polish,P6:ui-ux,P7:performance" \
  --body "$(cat <<'BODY'
## Contexto
`react-native-reanimated` (v3.16) já está instalado mas pouco utilizado.
Podemos melhorar significativamente a UX com animações sutis.

## Animações a Implementar

### Alta Prioridade
- [ ] **Animated Number Counter** — saldo anima de 0 até valor real ao carregar
- [ ] **Card entry animations** — fade-in + translateY sequencial nos cards do dashboard
- [ ] **Tab transition** — shared element entre telas do mesmo tab stack
- [ ] **Pull-to-refresh** — animação customizada (ícone rotação, bounce)

### Média Prioridade
- [ ] **List item stagger** — items entram sequencialmente (delay 50ms cada)
- [ ] **Swipe to dismiss** — notificações com swipe + spring animation
- [ ] **Bottom sheet** — backdrop blur + spring open/close
- [ ] **Success/Error feedback** — checkmark/X animado após operação

### Baixa Prioridade (nice to have)
- [ ] **Skeleton shimmer** — efeito shimmer real (não apenas opacity pulse)
- [ ] **Page transitions** — slide horizontal entre telas, fade para modais
- [ ] **Floating Action Button** — expand/collapse com spring

## Critérios de Aceite
- [ ] Animated counter no saldo (consumer + merchant dashboard)
- [ ] Card entry animations no dashboard
- [ ] 60fps em todas animações (verificar com Perf Monitor)
- [ ] Animações respeitam `prefers-reduced-motion`
BODY
)"
echo "  ✓ PL-02: Animações Reanimated"

# PL-03: Haptic Feedback
gh issue create --repo "$REPO" \
  --title "Implementar Haptic Feedback em ações críticas" \
  --label "polish,phase:polish,P9:nativo,P6:ui-ux" \
  --body "$(cat <<'BODY'
## Contexto
Haptic feedback melhora significativamente a UX em operações financeiras.
Precisamos instalar `expo-haptics` e adicionar feedback tátil em pontos chave.

## Tasks
- [ ] Instalar `expo-haptics`
- [ ] Criar hook `useHaptics` com helpers:
  - `hapticSuccess()` — notificationAsync(Success)
  - `hapticError()` — notificationAsync(Error)
  - `hapticLight()` — impactAsync(Light) para toggles
  - `hapticMedium()` — impactAsync(Medium) para botões
  - `hapticSelection()` — selectionAsync() para listas
- [ ] Respeitar preferências do usuário (toggle haptics on/off)

## Pontos de Aplicação
- [ ] **Gerar Cashback** — Success ao confirmar
- [ ] **Utilizar Cashback** — Success ao confirmar
- [ ] **QR Code gerado** — Light ao gerar
- [ ] **QR Code validado** — Success quando lojista valida
- [ ] **Pull-to-refresh** — Light ao puxar
- [ ] **Toggle switches** — Selection ao trocar
- [ ] **Erro de validação** — Error ao submeter form inválido
- [ ] **Login biométrico** — Success ao autenticar
- [ ] **Notificação recebida** — Light
- [ ] **Contestação enviada** — Success

## Critérios de Aceite
- [ ] Haptic feedback em 10+ interações
- [ ] Toggle para desabilitar haptics nas config
- [ ] Funciona no iOS e Android
- [ ] Fallback silencioso em dispositivos sem haptic engine
BODY
)"
echo "  ✓ PL-03: Haptic Feedback"

# PL-04: Formatação de Inputs
gh issue create --repo "$REPO" \
  --title "Máscaras de input em tempo real (CPF, moeda, telefone)" \
  --label "polish,phase:polish,P6:ui-ux" \
  --body "$(cat <<'BODY'
## Contexto
Atualmente CPF e valores monetários são validados pelo Zod mas sem formatação visual
em tempo real. O usuário digita "12345678900" ao invés de "123.456.789-00".

## Tasks
- [ ] Criar hook `useMaskedInput` ou usar lib como `react-native-mask-input`
- [ ] **CPF**: `___.___.___-__` (auto-formata conforme digita)
- [ ] **CNPJ**: `__.___.___/____-__`
- [ ] **Moeda BRL**: `R$ 0,00` → `R$ 1.234,56` (cursor correto)
- [ ] **Telefone**: `(__) _____-____`
- [ ] **CEP**: `_____-___`
- [ ] Integrar com React Hook Form (Controller)
- [ ] Manter valor raw (sem máscara) no form state
- [ ] Teclado numérico automático para campos mascarados

## Telas Afetadas
1. Gerar Cashback (CPF + valor)
2. Utilizar Cashback (CPF + valor)
3. Register (CPF/CNPJ + telefone)
4. Edit Profile (telefone, CEP)

## Critérios de Aceite
- [ ] CPF auto-formata ao digitar
- [ ] Moeda formata em tempo real com R$
- [ ] Valor raw correto no submit
- [ ] Teclado numérico aparece automaticamente
- [ ] Cursor posicionado corretamente ao editar
BODY
)"
echo "  ✓ PL-04: Máscaras de Input"

# PL-05: Persistir tema
gh issue create --repo "$REPO" \
  --title "Persistir preferência de tema (Dark Mode) via MMKV" \
  --label "polish,phase:polish,P6:ui-ux,P8:offline" \
  --body "$(cat <<'BODY'
## Contexto
O theme store existe com suporte a light/dark/system, mas a preferência
não persiste entre sessões — volta para "system" ao reabrir o app.
`react-native-mmkv` já está instalado.

## Tasks
- [ ] Criar MMKV storage instance para theme
- [ ] No `useThemeStore`, carregar preferência do MMKV no `initialize()`
- [ ] Salvar no MMKV sempre que o tema mudar (`subscribe`)
- [ ] Garantir que o splash screen use a cor correta do tema salvo
- [ ] Testar: fechar app → reabrir → tema mantido
- [ ] Testar: tema "system" → mudar sistema → app reflete

## Critérios de Aceite
- [ ] Tema persiste entre sessões (close + reopen)
- [ ] Splash screen respeita tema salvo
- [ ] Modo "sistema" funciona quando preferência do OS muda
BODY
)"
echo "  ✓ PL-05: Persistir Tema"

# PL-06: Splash Screen e Ícones reais
gh issue create --repo "$REPO" \
  --title "Assets finais: App Icon, Splash Screen, Adaptive Icon" \
  --label "polish,phase:polish,P16:app-stores,priority:high" \
  --body "$(cat <<'BODY'
## Contexto
Atualmente usando placeholders para ícone e splash.
Precisamos de assets finais para publicação nas lojas.

## Tasks
- [ ] Criar App Icon (1024x1024) com brand cashback
- [ ] Gerar variantes: iOS (vários tamanhos), Android (MDPI→XXXHDPI)
- [ ] Criar Adaptive Icon Android (foreground + background separados)
- [ ] Criar Splash Screen com logo + brand color (#16a34a)
- [ ] Configurar `expo-splash-screen` com imagem real
- [ ] Favicon para web
- [ ] Testar em dispositivos reais: iPhone SE, iPhone 15 Pro, Pixel 6, Galaxy S21

## Especificações
- App Icon: fundo verde (#16a34a), símbolo cashback branco
- Splash: fundo verde, logo centralizado, sem animação (fast load)
- Adaptive Icon foreground: logo branco em fundo transparente
- Adaptive Icon background: verde sólido #16a34a

## Critérios de Aceite
- [ ] Ícone nítido em todas as resoluções
- [ ] Splash screen < 500ms de exibição
- [ ] Adaptive icon correto no Android 8+
- [ ] Favicon funcional no web
BODY
)"
echo "  ✓ PL-06: Assets Finais"

# PL-07: Error Boundaries e Error States
gh issue create --repo "$REPO" \
  --title "Error Boundaries globais + estados de erro consistentes" \
  --label "polish,phase:polish,P6:ui-ux,P13:monitoramento" \
  --body "$(cat <<'BODY'
## Contexto
Sem Error Boundaries, um crash em qualquer componente derruba o app inteiro.
Precisamos de recovery graceful e estados de erro consistentes.

## Tasks
- [ ] Criar `ErrorBoundary` component com:
  - Mensagem amigável
  - Botão "Tentar novamente"
  - Botão "Reportar problema"
  - Log para Sentry
- [ ] Envolver cada tab root com ErrorBoundary
- [ ] Envolver telas críticas (Dashboard, Cashback, QR)
- [ ] Criar `ErrorScreen` component reutilizável para erros de API
- [ ] Padronizar tratamento de erros em hooks:
  - Network error → "Sem conexão. Verifique sua internet."
  - 401 → auto-refresh → se falha → "Sessão expirada"
  - 500 → "Erro no servidor. Tente novamente."
  - Timeout → "Conexão lenta. Tente novamente."
- [ ] Toast de erro com ação de retry

## Critérios de Aceite
- [ ] Crash em componente filho não derruba app
- [ ] Recovery funcional (retry/reload)
- [ ] Erros reportados ao Sentry automaticamente
- [ ] Mensagens de erro em pt-BR e en
BODY
)"
echo "  ✓ PL-07: Error Boundaries"

echo ""

# =============================================================================
# FASE 5: CRIAR ISSUES — FUNCIONALIDADES FUTURAS
# =============================================================================
echo ">>> Criando Issues — Funcionalidades Futuras..."

# FT-01: Analytics
gh issue create --repo "$REPO" \
  --title "[FUTURO] Analytics — rastreamento de telas e eventos" \
  --label "future,phase:future,P13:monitoramento" \
  --body "$(cat <<'BODY'
## Contexto
Sem analytics, não sabemos como os usuários usam o app.
Essencial para decisões de produto e otimização.

## Tasks
- [ ] Escolher provider: Firebase Analytics / Amplitude / Mixpanel / PostHog
- [ ] Criar `AnalyticsService` com interface agnóstica de provider
- [ ] Implementar tracking automático de telas (expo-router listener)
- [ ] Eventos críticos a rastrear:
  - `login` / `register` / `logout`
  - `view_dashboard` / `view_saldo`
  - `generate_cashback` (valor, empresa)
  - `redeem_cashback` (valor, empresa)
  - `scan_qr_code` / `generate_qr_code`
  - `create_dispute` / `resolve_dispute`
  - `toggle_biometric` / `toggle_dark_mode`
  - `app_open` / `app_background` / `app_foreground`
  - `error_occurred` (tipo, tela)
- [ ] Dashboard analytics (web) para métricas de produto
- [ ] Consent LGPD antes de rastrear

## Critérios de Aceite
- [ ] Screen views rastreados automaticamente
- [ ] 15+ eventos customizados implementados
- [ ] Consent LGPD antes de tracking
- [ ] Dashboard de analytics acessível
BODY
)"
echo "  ✓ FT-01: Analytics"

# FT-02: Sentry Production
gh issue create --repo "$REPO" \
  --title "[FUTURO] Sentry Production — error tracking + performance monitoring" \
  --label "future,phase:future,P13:monitoramento,priority:high" \
  --body "$(cat <<'BODY'
## Contexto
Sentry está configurado no eas.json (SENTRY_ENVIRONMENT) e o hook
`useStartupPerformance` existe, mas a integração completa com @sentry/react-native
não está implementada.

## Tasks
- [ ] Instalar `@sentry/react-native`
- [ ] Configurar `Sentry.init()` no app root com:
  - DSN
  - Environment (dev/preview/production)
  - Release tracking (version + buildNumber)
  - Source maps upload via EAS Build
- [ ] Integrar com Error Boundaries para reportar crashes
- [ ] Configurar Performance Monitoring:
  - App start (cold/warm)
  - Screen load times
  - API call durations (Axios interceptor)
  - User interactions (button taps)
- [ ] Configurar breadcrumbs para navegação
- [ ] Configurar user context (userId, role, empresa)
- [ ] Alertas: crash-free rate < 99.5%, error spike

## Critérios de Aceite
- [ ] Crashes reportados automaticamente com stack trace
- [ ] Source maps corretos (símbolos legíveis)
- [ ] Performance monitoring ativo
- [ ] Alertas configurados
- [ ] Crash-free rate visível no dashboard
BODY
)"
echo "  ✓ FT-02: Sentry Production"

# FT-03: Deep Linking
gh issue create --repo "$REPO" \
  --title "[FUTURO] Deep Linking — universal links para notificações e compartilhamento" \
  --label "future,phase:future,P2:navegacao,P10:push" \
  --body "$(cat <<'BODY'
## Contexto
expo-linking está configurado mas os universal links (iOS) e app links (Android)
não estão configurados para produção. Necessário para push notifications
que abrem telas específicas e para compartilhamento.

## Tasks
- [ ] Configurar `apple-app-site-association` no domínio
- [ ] Configurar `assetlinks.json` para Android
- [ ] Definir esquema de URLs:
  - `cashback://dashboard` → Dashboard
  - `cashback://saldo` → Saldo
  - `cashback://qrcode/:token` → QR Code com token
  - `cashback://transaction/:id` → Detalhe transação
  - `cashback://notification/:id` → Notificação específica
  - `cashback://dispute/:id` → Contestação
- [ ] Integrar com push notifications:
  - Notification tap → navegar para tela específica
  - Notificação com deep link no payload
- [ ] Testar: link em browser → abre app na tela correta
- [ ] Fallback: se app não instalado → App Store / Play Store

## Critérios de Aceite
- [ ] Universal links funcionais no iOS
- [ ] App links funcionais no Android
- [ ] Push notification tap navega para tela correta
- [ ] Fallback para loja se app não instalado
BODY
)"
echo "  ✓ FT-03: Deep Linking"

# FT-04: Programa de Indicação
gh issue create --repo "$REPO" \
  --title "[FUTURO] Programa de Indicação (Referral)" \
  --label "future,phase:future,P6:ui-ux,backend-dep" \
  --body "$(cat <<'BODY'
## Contexto
Programa de indicação para crescimento orgânico. Consumidor indica amigos
e ganha cashback quando eles se cadastram e fazem primeira compra.

## Funcionalidades
- [ ] Tela "Indique Amigos" com código único de referral
- [ ] Compartilhamento via: WhatsApp, SMS, Copiar link, Share sheet
- [ ] QR Code de indicação (link direto para cadastro)
- [ ] Tela de status das indicações (pendente, concluída, expirada)
- [ ] Regras configuráveis pelo lojista:
  - Valor do bônus para quem indica
  - Valor do bônus para indicado
  - Condição de ativação (1ª compra, valor mínimo)
  - Prazo de expiração do convite
- [ ] Push notification quando indicação converte

## Backend Dependencies
- Tabela `referrals` (code, referrer_id, referred_id, status, reward)
- Endpoints CRUD de referral
- Trigger automático de bônus

## Critérios de Aceite
- [ ] Código de referral único por usuário
- [ ] Compartilhamento funcional (WhatsApp, SMS, link)
- [ ] Tracking de indicações em tempo real
- [ ] Bônus creditado automaticamente
BODY
)"
echo "  ✓ FT-04: Programa de Indicação"

# FT-05: Carteiras Digitais
gh issue create --repo "$REPO" \
  --title "[FUTURO] Integração com Carteiras Digitais (Apple Wallet, Google Wallet)" \
  --label "future,phase:future,P9:nativo" \
  --body "$(cat <<'BODY'
## Contexto
Permitir que consumidores adicionem seu cartão de cashback à Apple Wallet
e Google Wallet para acesso rápido ao QR Code de resgate.

## Funcionalidades
- [ ] Gerar pass para Apple Wallet (.pkpass):
  - Logo da empresa parceira
  - Saldo atual de cashback
  - QR Code para resgate
  - Atualização automática via push
- [ ] Gerar pass para Google Wallet:
  - Loyalty card com saldo
  - QR Code de resgate
  - Atualização via Google Wallet API
- [ ] Botão "Adicionar à Carteira" no consumer dashboard
- [ ] Atualização do saldo no pass quando cashback muda
- [ ] Multi-loja: um pass por empresa parceira

## Backend Dependencies
- Apple Wallet: certificado de assinatura + server endpoint para passes
- Google Wallet: API credentials + pass class/object creation

## Critérios de Aceite
- [ ] Pass Apple Wallet funcional com QR Code
- [ ] Pass Google Wallet funcional com QR Code
- [ ] Saldo atualiza automaticamente no pass
- [ ] Multi-loja suportado
BODY
)"
echo "  ✓ FT-05: Carteiras Digitais"

# FT-06: Chat/Suporte
gh issue create --repo "$REPO" \
  --title "[FUTURO] Chat de Suporte in-app (consumidor ↔ lojista)" \
  --label "future,phase:future,P6:ui-ux,backend-dep" \
  --body "$(cat <<'BODY'
## Contexto
Canal direto de comunicação entre consumidor e lojista para resolver
dúvidas sobre cashback, contestações e suporte geral.

## Funcionalidades
- [ ] Tela de chat com mensagens em tempo real (WebSocket)
- [ ] Lista de conversas (inbox)
- [ ] Mensagens de texto + imagens
- [ ] Push notification para novas mensagens
- [ ] Indicador de "digitando..." / "lido"
- [ ] Chatbot FAQ automático (respostas rápidas)
- [ ] Integração com contestações (abrir chat a partir de disputa)
- [ ] Histórico de mensagens persistente

## Backend Dependencies
- WebSocket server para real-time
- Tabela `messages` + `conversations`
- Push notifications para novas mensagens
- Media upload (S3/R2)

## Critérios de Aceite
- [ ] Chat em tempo real funcional
- [ ] Push para mensagens offline
- [ ] Histórico persistente
- [ ] FAQ chatbot básico
BODY
)"
echo "  ✓ FT-06: Chat de Suporte"

# FT-07: Gamificação
gh issue create --repo "$REPO" \
  --title "[FUTURO] Gamificação — Níveis, Badges e Desafios" \
  --label "future,phase:future,P6:ui-ux,backend-dep" \
  --body "$(cat <<'BODY'
## Contexto
Gamificação para aumentar engajamento e retenção de consumidores.

## Funcionalidades
- [ ] Sistema de níveis (Bronze → Prata → Ouro → Diamante)
- [ ] XP por ações: compra, indicação, review, check-in diário
- [ ] Badges/conquistas desbloqueáveis:
  - "Primeira Compra" / "Cliente Fiel" (10 compras) / "Explorador" (5 lojas)
  - "Indicador" (3 indicações) / "Reviewer" (5 avaliações)
- [ ] Desafios temporários (ex: "Gaste R$100 esta semana → ganhe 2x cashback")
- [ ] Tela de perfil com nível, XP, badges
- [ ] Animações de desbloqueio de badges
- [ ] Leaderboard (ranking de consumidores)
- [ ] Multiplicador de cashback por nível

## Backend Dependencies
- Tabelas: `user_levels`, `badges`, `user_badges`, `challenges`, `challenge_progress`
- Endpoints de gamificação
- Triggers automáticos de XP/badge

## Critérios de Aceite
- [ ] 4 níveis com progressão visual
- [ ] 10+ badges desbloqueáveis
- [ ] Desafios temporários configuráveis pelo lojista
- [ ] Animações de celebration ao subir de nível/badge
BODY
)"
echo "  ✓ FT-07: Gamificação"

# FT-08: Cashback por Categoria
gh issue create --repo "$REPO" \
  --title "[FUTURO] Cashback por Categoria + Mapa de Lojas" \
  --label "future,phase:future,P6:ui-ux,P9:nativo,backend-dep" \
  --body "$(cat <<'BODY'
## Contexto
Permitir que consumidores descubram lojas parceiras por categoria
e localizem as mais próximas via mapa.

## Funcionalidades
- [ ] Tela "Explorar" com categorias:
  - Alimentação, Saúde, Beleza, Moda, Tecnologia, Serviços, etc.
- [ ] Lista de lojas por categoria com:
  - Logo, nome, endereço, % cashback
  - Distância (se GPS permitido)
  - Rating/avaliações
- [ ] Mapa interativo (react-native-maps) com:
  - Pins das lojas parceiras
  - Cluster para muitas lojas
  - Info window com dados + "Navegar" (Google Maps/Waze)
- [ ] Busca por nome ou endereço
- [ ] Favoritos (lojas salvas)
- [ ] Filtros: distância, % cashback, rating

## Backend Dependencies
- Campos de localização (lat/lng) nas lojas
- Endpoint de busca por proximidade
- Categorias de lojas

## Critérios de Aceite
- [ ] Explorar por categoria funcional
- [ ] Mapa com lojas parceiras
- [ ] Busca e filtros funcionais
- [ ] Navegação até loja via Maps
BODY
)"
echo "  ✓ FT-08: Cashback por Categoria + Mapa"

echo ""
echo "============================================"
echo "  Concluído!"
echo "============================================"
echo ""
echo "Resumo:"
echo "  - Labels novas: 6 criadas"
echo "  - Sprint issues: 8 fechados (#14-#21)"
echo "  - Issues Qualidade & Testes: 6 criados"
echo "  - Issues Polish: 7 criados"
echo "  - Issues Funcionalidades Futuras: 8 criados"
echo "  - Total novos issues: 21"
echo ""
echo "Visualizar: https://github.com/$REPO/issues"
echo ""
echo "Filtragem por fase:"
echo "  - Qualidade:  https://github.com/$REPO/labels/phase%3Aquality"
echo "  - Polish:     https://github.com/$REPO/labels/phase%3Apolish"
echo "  - Futuro:     https://github.com/$REPO/labels/phase%3Afuture"

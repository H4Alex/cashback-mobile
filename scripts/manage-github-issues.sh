#!/bin/bash
# =============================================================================
# manage-github-issues.sh
# Fecha sprints concluídos e cria issues para: Qualidade, Polish, Futuro
#
# Uso:
#   GITHUB_TOKEN=ghp_xxx ./scripts/manage-github-issues.sh
#
# Ou com gh CLI:
#   export GITHUB_TOKEN=$(gh auth token)
#   ./scripts/manage-github-issues.sh
# =============================================================================

set -euo pipefail

REPO="H4Alex/cashback-mobile"
API="https://api.github.com"

# Verificar token
if [ -z "${GITHUB_TOKEN:-}" ]; then
  # Tentar obter do gh CLI
  if command -v gh &>/dev/null && gh auth status &>/dev/null; then
    GITHUB_TOKEN=$(gh auth token 2>/dev/null)
  fi
fi

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "ERRO: GITHUB_TOKEN não definido."
  echo ""
  echo "Opções:"
  echo "  1. export GITHUB_TOKEN=ghp_seu_token_aqui"
  echo "  2. export GITHUB_TOKEN=\$(gh auth token)"
  echo ""
  echo "Criar token: https://github.com/settings/tokens/new?scopes=repo"
  exit 1
fi

# Helper: GitHub API call
gh_api() {
  local method="$1"
  local path="$2"
  local data="${3:-}"

  if [ -n "$data" ]; then
    curl -s -X "$method" \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      -H "Content-Type: application/json" \
      "${API}${path}" \
      -d "$data"
  else
    curl -s -X "$method" \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      "${API}${path}"
  fi
}

# Helper: criar label (idempotente)
create_label() {
  local name="$1" color="$2" desc="$3"
  gh_api POST "/repos/$REPO/labels" \
    "{\"name\":\"$name\",\"color\":\"$color\",\"description\":\"$desc\"}" \
    2>/dev/null | python3 -c "
import json,sys
d=json.load(sys.stdin)
if 'errors' in d:
    # Label already exists, update it
    pass
" 2>/dev/null || true
  echo "  ✓ $name"
}

# Helper: criar issue e retornar número
create_issue() {
  local title="$1"
  local labels_json="$2"
  local body="$3"

  local result
  result=$(gh_api POST "/repos/$REPO/issues" \
    "{\"title\":$(echo "$title" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read().strip()))'),\"labels\":$labels_json,\"body\":$(echo "$body" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read().strip()))')}")

  local num
  num=$(echo "$result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('number','ERRO: '+d.get('message','unknown')))" 2>/dev/null)
  echo "  ✓ #$num — $title"
}

# Helper: fechar issue
close_issue() {
  local num="$1"
  local comment="$2"

  # Add comment
  gh_api POST "/repos/$REPO/issues/$num/comments" \
    "{\"body\":\"$comment\"}" >/dev/null 2>&1 || true

  # Close
  gh_api PATCH "/repos/$REPO/issues/$num" \
    '{"state":"closed"}' >/dev/null 2>&1
}

echo "============================================"
echo "  Cashback Mobile — Issue Management"
echo "============================================"
echo ""
echo "Repo: $REPO"
echo ""

# Verificar auth
user=$(gh_api GET "/user" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('login','ERRO: '+d.get('message','')))" 2>/dev/null)
echo "Autenticado como: $user"
echo ""

# =============================================================================
# FASE 1: CRIAR LABELS NOVAS
# =============================================================================
echo ">>> Criando Labels..."

create_label "quality"       "C2E0C6" "Qualidade e Testes"
create_label "polish"        "FBCA04" "Polish e UX refinement"
create_label "future"        "5319E7" "Funcionalidade futura"
create_label "phase:quality" "C2E0C6" "Fase — Qualidade e Testes"
create_label "phase:polish"  "FBCA04" "Fase — Polish"
create_label "phase:future"  "D4C5F9" "Fase — Funcionalidades Futuras"

echo ""

# =============================================================================
# FASE 2: FECHAR SPRINT ISSUES CONCLUÍDOS (#14 a #21)
# =============================================================================
echo ">>> Fechando Sprint Issues concluídos..."

for num in 14 15 16 17 18 19 20 21; do
  state=$(gh_api GET "/repos/$REPO/issues/$num" | python3 -c "import json,sys; print(json.load(sys.stdin).get('state','unknown'))" 2>/dev/null)
  if [ "$state" = "open" ]; then
    close_issue "$num" "✅ Concluído via PR. Todos os itens deste sprint foram implementados. Fechando automaticamente."
    echo "  ✓ #$num — FECHADO"
  else
    echo "  - #$num — já fechado"
  fi
done

echo ""

# =============================================================================
# FASE 3: ISSUES — QUALIDADE & TESTES
# =============================================================================
echo ">>> Criando Issues — Qualidade & Testes..."

create_issue \
  "Testes de Componentes UI (23 componentes sem cobertura)" \
  '["quality","phase:quality","P11:testes"]' \
  "## Contexto
Temos 26 componentes UI mas apenas 3 com testes (StatsCard, MetricCard, SearchBar).
Precisamos cobrir os 23 restantes para garantir estabilidade.

## Componentes a Testar (por prioridade)

### Críticos (usados em toda a app)
- [ ] SaldoCard — renderiza saldo, formata moeda, mostra expiração
- [ ] TransactionCard — tipos (crédito/débito), status, formata data/valor
- [ ] Button / base components — estados (loading, disabled, pressed)
- [ ] Input — validação visual, erro, máscara, acessibilidade
- [ ] Card — layout, shadows, variantes

### Importantes (usados em fluxos principais)
- [ ] CashbackTimeline — renderiza timeline
- [ ] CashbackConfirmation — dados de confirmação, callbacks
- [ ] NotificationBell — badge count, onPress
- [ ] NotificationItem — read/unread, tipos
- [ ] OfflineBanner / OfflineIndicator — exibe quando offline
- [ ] FilterChips — seleção/deseleção, callback
- [ ] StatusBadge — cores por status
- [ ] EmptyState — imagem, título, ação
- [ ] FAB — posição, onPress, ícone

### Feedback & UX
- [ ] BiometricPrompt, PermissionRequest, SkeletonCard
- [ ] PullToRefresh, ThemeToggle, CountdownTimer
- [ ] ContestacaoForm, QRCodeDisplay, SessionCard

## Meta: **50% cobertura de componentes**"

create_issue \
  "Testes de Custom Hooks (17 hooks sem cobertura)" \
  '["quality","phase:quality","P11:testes"]' \
  "## Contexto
17 custom hooks sem testes. Hooks são o core da lógica de negócio.

## Hooks a Testar

### Auth & Security
- [ ] useAuth — login, logout, refresh, estado
- [ ] useBiometric — verifica hardware, auth, fallback
- [ ] useSessionTimeout — inatividade, auto-logout

### Data Fetching (React Query)
- [ ] useSaldo / useCashback — fetch, cache, staleTime
- [ ] useExtrato / useExtratoInfinite — paginação cursor, filtros
- [ ] useMerchantManagement — dashboard, clientes, campanhas
- [ ] useNotifications — lista, mark read, preferências

### Device & Platform
- [ ] usePushSetup — registro push token, permissão
- [ ] useAppUpdate — verifica OTA, download, reload
- [ ] useRefreshOnFocus — refetch ao voltar
- [ ] useCountdown — timer, callback expiração

### Offline & Performance
- [ ] useOfflineQueue — enfileira ops, replay
- [ ] useStartupPerformance — mede cold start, TTI

## Meta: **70% cobertura de hooks**"

create_issue \
  "Configurar Jest Coverage Thresholds + Badge no README" \
  '["quality","phase:quality","P11:testes","P12:ci-cd"]' \
  "## Tasks
- [ ] Configurar coverageThreshold no jest.config (global: 70% statements)
- [ ] Adicionar --coverage ao script test:ci
- [ ] Configurar collectCoverageFrom para src/
- [ ] Adicionar step no CI que falha se cobertura < threshold
- [ ] Gerar badge de coverage
- [ ] Adicionar badge no README.md"

create_issue \
  "Testes de Integração — Navegação e Auth Guards" \
  '["quality","phase:quality","P11:testes","P2:navegacao"]' \
  "## Cenários a Testar
- [ ] Não autenticado → redireciona Login
- [ ] Consumidor → consumer tabs
- [ ] Lojista → merchant tabs
- [ ] Consumer ≠ merchant routes (guard)
- [ ] Deep linking rotas protegidas
- [ ] Logout → limpa estado → login
- [ ] Token expirado → refresh → mantém rota
- [ ] Refresh falha → login

## Abordagem
- expo-router/testing-library ou mock router
- Simular estados auth via stores"

create_issue \
  "Habilitar E2E (Maestro) no CI para PRs críticos" \
  '["quality","phase:quality","P11:testes","P12:ci-cd"]' \
  "## Tasks
- [ ] Configurar e2e.yml para PRs que modificam app/ ou src/
- [ ] Cache do emulador Android
- [ ] Upload screenshots/vídeos de falha como artifacts
- [ ] Retry (1x) para flaky tests

## Fluxos Existentes
1. 01_login_dashboard.yaml
2. 02_gerar_cashback.yaml
3. 03_qrcode_flow.yaml

Meta: E2E < 15 min no CI"

create_issue \
  "Testes automatizados de Acessibilidade (a11y)" \
  '["quality","phase:quality","P14:acessibilidade","P11:testes"]' \
  "## Tasks
- [ ] Instalar jest-axe ou matchers a11y
- [ ] Verificar accessibilityLabel em componentes interativos
- [ ] Verificar accessibilityRole (button, text, image)
- [ ] Verificar contraste >= 4.5:1
- [ ] Verificar touch targets >= 44pt (iOS) / 48dp (Android)
- [ ] Testar com VoiceOver + TalkBack (manual)

## Telas Prioritárias
1. Login / Register
2. Dashboard
3. QR Code
4. Gerar/Utilizar Cashback
5. Notificações"

echo ""

# =============================================================================
# FASE 4: ISSUES — POLISH
# =============================================================================
echo ">>> Criando Issues — Polish..."

create_issue \
  "Implementar gráficos reais no Dashboard (substituir placeholder)" \
  '["polish","phase:polish","P6:ui-ux"]' \
  "## Contexto
Dashboard mostra placeholder. react-native-svg (v15.8) já instalado.

## Tasks
- [ ] Instalar victory-native ou react-native-chart-kit
- [ ] Gráfico evolução 7 dias (merchant): cashback gerado vs utilizado
- [ ] Mini-chart consumer: sparkline 30 dias
- [ ] Cores do design system (green #22C55E, blue #3B82F6)
- [ ] Animação de entrada
- [ ] Skeleton loading + empty state"

create_issue \
  "Animações avançadas com Reanimated (transições, contadores)" \
  '["polish","phase:polish","P6:ui-ux","P7:performance"]' \
  "## Animações a Implementar

### Alta Prioridade
- [ ] Animated Number Counter — saldo anima de 0 até valor
- [ ] Card entry — fade-in + translateY sequencial no dashboard
- [ ] Pull-to-refresh customizado

### Média Prioridade
- [ ] List item stagger — items entram sequencialmente
- [ ] Swipe to dismiss — notificações
- [ ] Bottom sheet — spring open/close
- [ ] Success/Error feedback — checkmark/X animado

### Nice to have
- [ ] Skeleton shimmer real
- [ ] Page transitions customizadas

## Meta: 60fps em todas animações"

create_issue \
  "Implementar Haptic Feedback em ações críticas" \
  '["polish","phase:polish","P9:nativo","P6:ui-ux"]' \
  "## Tasks
- [ ] Instalar expo-haptics
- [ ] Criar hook useHaptics (success, error, light, selection)
- [ ] Respeitar toggle haptics on/off

## Pontos de Aplicação
- [ ] Gerar/Utilizar Cashback — Success
- [ ] QR Code gerado/validado — Light/Success
- [ ] Pull-to-refresh — Light
- [ ] Toggle switches — Selection
- [ ] Erro validação — Error
- [ ] Login biométrico — Success
- [ ] Contestação enviada — Success"

create_issue \
  "Máscaras de input em tempo real (CPF, moeda, telefone)" \
  '["polish","phase:polish","P6:ui-ux"]' \
  "## Tasks
- [ ] CPF: ___.___.___-__ (auto-formata)
- [ ] CNPJ: __.___.___/____-__
- [ ] Moeda BRL: R\$ 0,00 → R\$ 1.234,56
- [ ] Telefone: (__) _____-____
- [ ] Integrar com React Hook Form
- [ ] Teclado numérico automático

## Telas: Gerar Cashback, Utilizar, Register, Edit Profile"

create_issue \
  "Persistir preferência de tema (Dark Mode) via MMKV" \
  '["polish","phase:polish","P6:ui-ux","P8:offline"]' \
  "## Tasks
- [ ] Criar MMKV storage para theme
- [ ] Carregar preferência no initialize()
- [ ] Salvar via subscribe quando tema muda
- [ ] Splash screen respeita tema salvo
- [ ] Modo sistema funciona ao mudar OS

react-native-mmkv já está instalado."

create_issue \
  "Assets finais: App Icon, Splash Screen, Adaptive Icon" \
  '["polish","phase:polish","P16:app-stores"]' \
  "## Tasks
- [ ] App Icon 1024x1024 com brand cashback
- [ ] Variantes iOS (todos tamanhos) + Android (MDPI→XXXHDPI)
- [ ] Adaptive Icon Android (foreground + background)
- [ ] Splash Screen com logo + brand color (#16a34a)
- [ ] Configurar expo-splash-screen
- [ ] Favicon web
- [ ] Testar: iPhone SE, iPhone 15, Pixel 6, Galaxy S21"

create_issue \
  "Error Boundaries globais + estados de erro consistentes" \
  '["polish","phase:polish","P6:ui-ux","P13:monitoramento"]' \
  "## Tasks
- [ ] Criar ErrorBoundary com mensagem amigável + retry + Sentry
- [ ] Envolver cada tab root com ErrorBoundary
- [ ] Criar ErrorScreen reutilizável
- [ ] Padronizar erros: network, 401, 500, timeout
- [ ] Toast de erro com ação retry
- [ ] Mensagens em pt-BR e en"

echo ""

# =============================================================================
# FASE 5: ISSUES — FUNCIONALIDADES FUTURAS
# =============================================================================
echo ">>> Criando Issues — Funcionalidades Futuras..."

create_issue \
  "[FUTURO] Analytics — rastreamento de telas e eventos" \
  '["future","phase:future","P13:monitoramento"]' \
  "## Tasks
- [ ] Escolher provider (Firebase/Amplitude/Mixpanel/PostHog)
- [ ] AnalyticsService com interface agnóstica
- [ ] Tracking automático de telas (expo-router listener)
- [ ] 15+ eventos: login, register, generate_cashback, redeem, scan_qr, etc.
- [ ] Consent LGPD antes de tracking"

create_issue \
  "[FUTURO] Sentry Production — error tracking + performance" \
  '["future","phase:future","P13:monitoramento"]' \
  "## Tasks
- [ ] Instalar @sentry/react-native
- [ ] Sentry.init com DSN, environment, release tracking
- [ ] Source maps upload via EAS Build
- [ ] Error Boundaries → Sentry
- [ ] Performance: app start, screen load, API durations
- [ ] Breadcrumbs navegação + user context
- [ ] Alertas: crash-free < 99.5%, error spike"

create_issue \
  "[FUTURO] Deep Linking — universal links para notificações" \
  '["future","phase:future","P2:navegacao","P10:push"]' \
  "## Tasks
- [ ] apple-app-site-association no domínio
- [ ] assetlinks.json para Android
- [ ] URLs: cashback://dashboard, /saldo, /qrcode/:token, /transaction/:id
- [ ] Push notification tap → tela específica
- [ ] Fallback: sem app → App Store / Play Store"

create_issue \
  "[FUTURO] Programa de Indicação (Referral)" \
  '["future","phase:future","P6:ui-ux","backend-dep"]' \
  "## Funcionalidades
- [ ] Código único de referral por usuário
- [ ] Compartilhar via WhatsApp, SMS, link, QR Code
- [ ] Status indicações (pendente, concluída, expirada)
- [ ] Regras configuráveis pelo lojista (bônus, condição, prazo)
- [ ] Push notification quando indicação converte

Requer: backend (tabela referrals + endpoints + trigger bônus)"

create_issue \
  "[FUTURO] Integração Carteiras Digitais (Apple/Google Wallet)" \
  '["future","phase:future","P9:nativo"]' \
  "## Funcionalidades
- [ ] Pass Apple Wallet (.pkpass) com QR Code + saldo
- [ ] Pass Google Wallet com loyalty card
- [ ] Botão 'Adicionar à Carteira' no dashboard
- [ ] Atualização automática do saldo no pass
- [ ] Multi-loja: um pass por empresa

Requer: backend (certificados Apple + Google Wallet API)"

create_issue \
  "[FUTURO] Chat de Suporte in-app" \
  '["future","phase:future","P6:ui-ux","backend-dep"]' \
  "## Funcionalidades
- [ ] Chat real-time (WebSocket) consumidor ↔ lojista
- [ ] Inbox com lista de conversas
- [ ] Mensagens texto + imagens
- [ ] Push para mensagens offline
- [ ] Indicador digitando / lido
- [ ] Chatbot FAQ automático
- [ ] Integração com contestações

Requer: backend (WebSocket + tabelas + media upload)"

create_issue \
  "[FUTURO] Gamificação — Níveis, Badges e Desafios" \
  '["future","phase:future","P6:ui-ux","backend-dep"]' \
  "## Funcionalidades
- [ ] Níveis: Bronze → Prata → Ouro → Diamante
- [ ] XP por ações: compra, indicação, review, check-in
- [ ] 10+ badges desbloqueáveis
- [ ] Desafios temporários (ex: gaste R\$100 → 2x cashback)
- [ ] Tela perfil com nível, XP, badges
- [ ] Animações de celebration
- [ ] Multiplicador cashback por nível

Requer: backend (tabelas levels, badges, challenges)"

create_issue \
  "[FUTURO] Cashback por Categoria + Mapa de Lojas" \
  '["future","phase:future","P6:ui-ux","P9:nativo","backend-dep"]' \
  "## Funcionalidades
- [ ] Tela Explorar com categorias (Alimentação, Saúde, Moda...)
- [ ] Lista de lojas: logo, nome, % cashback, distância
- [ ] Mapa interativo (react-native-maps) com pins
- [ ] Cluster para muitas lojas + info window
- [ ] Busca por nome ou endereço
- [ ] Favoritos + filtros (distância, cashback, rating)

Requer: backend (lat/lng nas lojas + busca proximidade + categorias)"

echo ""
echo "============================================"
echo "  Concluído!"
echo "============================================"
echo ""
echo "Resumo:"
echo "  - Labels: 6 criadas"
echo "  - Sprint issues fechados: #14 a #21"
echo "  - Issues Qualidade & Testes: 6"
echo "  - Issues Polish: 7"
echo "  - Issues Futuro: 8"
echo "  - Total: 21 novos issues"
echo ""
echo "Visualizar: https://github.com/$REPO/issues"
echo "Filtrar: phase:quality | phase:polish | phase:future"

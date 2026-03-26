# Mapa de Regras — App Mobile (cash-mobile)

> Gerado em 2026-03-26 a partir do codigo atual + rotas api/mobile/v1
> Fonte: analise completa de `app/`, `src/hooks/`, `src/services/`, `src/schemas/`, `src/stores/`

## Infraestrutura

- **Stack**: React Native + Expo 52 + TypeScript + NativeWind (Tailwind) + expo-router (file-based routing)
- **State**: Zustand (auth, multiloja, notifications, connectivity, device, theme) + TanStack React Query 5
- **Forms**: React Hook Form + Zod (validacao frontend)
- **Auth**: JWT Bearer token (SecureStore) com auto-refresh via interceptor Axios
- **Biometria**: FaceID / Impressao digital (expo-local-authentication)
- **Push**: expo-notifications + registro de device token via `POST /api/mobile/v1/devices`
- **QR Code**: Token Redis com TTL 5 min (backend)
- **Storage local**: MMKV (onboarding, consent) + SecureStore (tokens)
- **Monitoramento**: Sentry React Native
- **SSL Pinning**: Validacao de API host na inicializacao
- **Offline**: Banner offline + connectivity store + offline queue

## API Base

| Perfil    | Base Path           | Middleware                            |
|-----------|---------------------|---------------------------------------|
| Consumer  | `/api/mobile/v1`    | `auth:api_mobile`, `throttle:auth`    |
| Merchant  | `/api/v1`           | `auth:api`, `empresa.scope`           |
| Publico   | `/api/mobile/v1`    | `throttle:public`                     |

## Navegacao Geral

```
RootLayout (_layout.tsx)
  ├── AuthGuard (redireciona baseado em isAuthenticated)
  ├── PushRegistration (usePushSetup)
  ├── ConnectivityBanner (OfflineBanner)
  ├── (auth)/ — Stack
  │   ├── onboarding
  │   ├── login
  │   ├── register
  │   ├── forgot-password
  │   └── consent (LGPD)
  ├── (consumer)/ — Stack
  │   ├── (tabs)/ — TabBar
  │   │   ├── home/index (Inicio)
  │   │   ├── saldo/index (Saldo)
  │   │   ├── qrcode/index (QR Code)
  │   │   ├── notifications/index (Alertas)
  │   │   └── profile/index (Perfil)
  │   │   └── [hidden] home/extrato, home/historico, notifications/preferences,
  │   │                 profile/edit, profile/change-password, profile/delete-account
  │   └── contestacao/index, contestacao/create
  ├── (merchant)/ — Stack
  │   ├── (tabs)/ — TabBar
  │   │   ├── dashboard
  │   │   ├── cashback/index
  │   │   ├── clientes/index
  │   │   └── more/index
  │   │   └── [hidden] cashback/gerar, cashback/utilizar, cashback/qr-scan,
  │   │                 clientes/[id], more/campanhas, more/vendas, more/contestacoes,
  │   │                 more/config, more/relatorios
  │   └── multiloja (modal)
  └── (shared)/privacy-policy
```

## Logica do AuthGuard

| Condicao | Acao |
|----------|------|
| `isLoading === true` | Nao redireciona (aguarda inicializacao) |
| `!isAuthenticated && !inAuthGroup` | Se onboarding nao completado: `/(auth)/onboarding`. Senao: `/(auth)/login` |
| `isAuthenticated && inAuthGroup` | Se consent LGPD nao dado: `/(auth)/consent`. Senao: `/` (raiz) |

---

## Telas — Grupo (auth)

### 1. Onboarding

| Campo | Detalhe |
|-------|---------|
| Tela | `OnboardingScreen` |
| Navegacao | `/(auth)/onboarding` — Stack, headerShown: false |
| Condicoes de Acesso | Nenhuma (tela publica, exibida antes do login) |
| Dados ao Carregar | Nenhum endpoint. Verifica `MMKV.getBoolean('onboarding_completed')` |

**Regras de Exibicao**
- 3 slides horizontais com paging: "Cashback de verdade", "Resgate facil", "Fique por dentro"
- Indicadores de pagina (dots) atualizados via `onViewableItemsChanged`
- Botao "Pular" visivel em todos os slides
- Botao muda de "Proximo" para "Comecar" no ultimo slide

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Pular | — | — | — | — | Salva `onboarding_completed=true` no MMKV, redireciona para login |
| Proximo | — | — | — | — | Scroll para proximo slide |
| Comecar (ultimo slide) | — | — | — | — | Salva `onboarding_completed=true`, redireciona para login |

**Rastreabilidade**
- Componente: `app/(auth)/onboarding.tsx`
- Storage: MMKV key `onboarding_completed`

---

### 2. Login

| Campo | Detalhe |
|-------|---------|
| Tela | `LoginScreen` |
| Navegacao | `/(auth)/login` — Stack |
| Condicoes de Acesso | Nenhuma (tela publica) |
| Dados ao Carregar | Nenhum |

**Regras de Exibicao**
- Formulario com campos Email e Senha
- Toggle "Mostrar/Ocultar" senha
- Link "Esqueceu a senha?" para `/(auth)/forgot-password`
- Link "Cadastre-se" para `/(auth)/register`
- Botao desabilitado durante `isPending`; mostra ActivityIndicator

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes (Zod) | Feedback |
|------|----------|--------|---------|-------------------|----------|
| Entrar | `/api/mobile/v1/auth/login` | POST | `{ email, senha }` | email: `z.string().email()`; senha: `z.string().min(6)` | Sucesso: `setCliente()` + redireciona `/`. Erro: Alert "Credenciais invalidas" |

**Rastreabilidade**
- Componente: `app/(auth)/login.tsx`
- Hook: `src/hooks/useAuth.ts` → `useLogin()`
- Schema: `src/schemas/auth.ts` → `loginSchema`
- Service: `mobileAuthService.login()`

---

### 3. Cadastro

| Campo | Detalhe |
|-------|---------|
| Tela | `RegisterScreen` |
| Navegacao | `/(auth)/register` — Stack |
| Condicoes de Acesso | Nenhuma (tela publica) |
| Dados ao Carregar | Nenhum |

**Regras de Exibicao**
- Formulario: Nome completo, Email, CPF (numerico, max 11), Senha, Confirmar Senha
- Toggle "Mostrar/Ocultar" para ambos campos de senha
- Botao desabilitado durante submissao

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes (Zod) | Feedback |
|------|----------|--------|---------|-------------------|----------|
| Cadastrar | `/api/mobile/v1/auth/register` | POST | `{ nome, email, cpf, senha, senha_confirmation }` | nome: min 3 chars; email: valido; cpf: 11 digitos + validacao digito verificador; senha: min 6 chars; senha_confirmation: deve ser igual a senha | Sucesso: `setCliente()` + redireciona `/`. Erro: Alert com mensagem do backend |

**Rastreabilidade**
- Componente: `app/(auth)/register.tsx`
- Hook: `src/hooks/useAuth.ts` → `useRegister()`
- Schema: `src/schemas/auth.ts` → `registerSchema` (inclui `isValidCPF()`)

---

### 4. Recuperar Senha

| Campo | Detalhe |
|-------|---------|
| Tela | `ForgotPasswordScreen` |
| Navegacao | `/(auth)/forgot-password` — Stack |
| Condicoes de Acesso | Nenhuma (tela publica) |
| Dados ao Carregar | Nenhum |

**Regras de Exibicao**
- Fluxo multi-step: `email` → `verify` → `reset` → `done`
- Step "email": campo email + botao "Enviar Email"
- Step "verify": campo codigo + botao "Verificar Codigo"
- Step "reset": campo nova senha + botao "Redefinir Senha"
- Step "done": Alert de sucesso com redirect para login
- Link "Voltar ao login" em todos os steps exceto "done"

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes (Zod) | Feedback |
|------|----------|--------|---------|-------------------|----------|
| Enviar Email | `/api/mobile/v1/auth/forgot-password` | POST | `{ email }` | email: `z.string().email()` | Sucesso: avanca para step "verify". Erro: Alert |
| Verificar Codigo | `/api/mobile/v1/auth/verify-reset-token` | POST | `{ email, token }` | token: nao vazio | Sucesso: avanca para step "reset". Erro: Alert "Codigo invalido ou expirado" |
| Redefinir Senha | `/api/mobile/v1/auth/reset-password` | POST | `{ email, token, senha }` | senha: min 6 chars | Sucesso: Alert + redirect login. Erro: Alert "Token invalido" |

**Middleware backend**: `throttle:password_reset` (rate limit separado)

**Rastreabilidade**
- Componente: `app/(auth)/forgot-password.tsx`
- Hooks: `useForgotPassword()`, `useResetPassword()` em `src/hooks/useAuth.ts`
- Service direto: `mobileAuthService.verifyResetToken()` (step verify)
- Schema: `src/schemas/auth.ts` → `forgotPasswordSchema`, `resetPasswordSchema`

---

### 5. Consentimento LGPD

| Campo | Detalhe |
|-------|---------|
| Tela | `ConsentScreen` |
| Navegacao | `/(auth)/consent` — Stack |
| Condicoes de Acesso | Usuario autenticado, mas sem consentimento LGPD |
| Dados ao Carregar | Nenhum endpoint. Verifica `MMKV.getBoolean('lgpd_consent_given')` |

**Regras de Exibicao**
- Resumo dos dados coletados (identificacao, transacoes, dispositivo)
- Finalidade do tratamento (3 itens)
- Direitos do titular (3 itens em destaque verde)
- Checkbox obrigatorio: "Li e aceito os Termos de Uso e Politica de Privacidade"
- Switch opcional: "Aceito receber promocoes e ofertas por notificacao"
- Botao "Concordar e Continuar" habilitado apenas quando checkbox marcado

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Concordar e Continuar | — | — | — | Checkbox `accepted` deve ser `true` | Salva `lgpd_consent_given=true` e `lgpd_marketing_consent` no MMKV, redireciona `/` |

**Rastreabilidade**
- Componente: `app/(auth)/consent.tsx`
- Storage: MMKV keys `lgpd_consent_given`, `lgpd_marketing_consent`

---

## Telas — Grupo (consumer)

### 6. Home / Dashboard do Consumidor

| Campo | Detalhe |
|-------|---------|
| Tela | `DashboardScreen` |
| Navegacao | `/(consumer)/(tabs)/home/index` — Tab "Inicio" |
| Condicoes de Acesso | Autenticado (JWT valido) |
| Dados ao Carregar | `GET /api/mobile/v1/saldo` + `GET /api/mobile/v1/extrato` (infinite query, 5 primeiras) |

**Regras de Exibicao**
- Header: "Ola, [primeiro nome]" + NotificationBell (badge com unreadCount)
- SaldoCard: exibe saldo total, clicavel (navega para tela Saldo)
- Quick Actions: 3 botoes (Extrato, Historico, Contestacoes)
- Ultimas transacoes: 5 primeiras entradas do extrato via `CashbackTimeline`
- Link "Ver tudo" navega para extrato completo
- Loading: `SkeletonCard` (saldo) + 3x `SkeletonTransaction` (extrato)
- Empty state: "Sem transacoes" quando lista vazia
- Pull-to-refresh: refetch saldo + extrato
- `useRefreshOnFocus`: refetch automatico ao voltar para tela

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Tap NotificationBell | — | — | — | — | Navega `/(consumer)/(tabs)/notifications` |
| Tap SaldoCard | — | — | — | — | Navega `/(consumer)/(tabs)/saldo` |
| Tap Extrato (quick action) | — | — | — | — | Navega `/(consumer)/(tabs)/home/extrato` |
| Tap Historico (quick action) | — | — | — | — | Navega `/(consumer)/(tabs)/home/historico` |
| Tap Contestacoes (quick action) | — | — | — | — | Navega `/(consumer)/contestacao` |
| Pull-to-refresh | (refetch saldo + extrato) | GET | — | — | Atualiza dados |

**Dependencias**
- `useSaldo()` → `mobileCashbackService.getSaldo()` → `GET /api/mobile/v1/saldo`
- `useExtrato()` → `mobileCashbackService.getExtrato()` → `GET /api/mobile/v1/extrato`
- `useAuthStore` → `cliente.nome`

**Rastreabilidade**
- Componente: `app/(consumer)/(tabs)/home/index.tsx`
- Hooks: `src/hooks/useCashback.ts` → `useSaldo()`, `useExtrato()`
- Componentes: `SaldoCard`, `CashbackTimeline`, `EmptyState`, `PullToRefresh`, `NotificationBell`

---

### 7. Extrato

| Campo | Detalhe |
|-------|---------|
| Tela | `ExtratoScreen` |
| Navegacao | `/(consumer)/(tabs)/home/extrato` — Hidden tab |
| Condicoes de Acesso | Autenticado |
| Dados ao Carregar | `GET /api/mobile/v1/extrato` com filtros (infinite query, cursor-based, 20/pagina) |

**Regras de Exibicao**
- Header: "Extrato" + subtitulo "Todas as suas movimentacoes de cashback"
- FilterChips com 6 status: pendente, confirmado, utilizado, rejeitado, expirado, congelado
- Link "Limpar filtros" quando filtro ativo
- FlatList com `TransactionCard` por entrada
- Paginacao infinita: `onEndReached` carrega proxima pagina
- Loading: 5x `SkeletonTransaction`
- Empty state diferenciado: com filtro ("Nenhum resultado") vs sem filtro ("Sem transacoes")
- Tap em entrada com status contestavel (rejeitado, expirado, congelado) navega para criar contestacao

**Status contestaveis**: `rejeitado`, `expirado`, `congelado`

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Selecionar filtro status | (refetch com params) | GET | `?status=X` | — | Recarrega lista filtrada |
| Limpar filtros | — | — | — | — | Remove filtro, recarrega tudo |
| Tap em entrada contestavel | — | — | — | Status in [rejeitado, expirado, congelado] | Navega `/(consumer)/contestacao/create?cashback_entry_id=X&empresa_nome=Y` |
| Scroll ate o final | `GET /extrato?cursor=X` | GET | cursor da ultima pagina | — | Carrega proxima pagina |

**Rastreabilidade**
- Componente: `app/(consumer)/(tabs)/home/extrato.tsx`
- Hook: `src/hooks/useCashback.ts` → `useExtratoInfinite(filters)`
- Hook: `src/hooks/useExtratoFilters.ts` → `useExtratoFilters()`
- Componentes: `TransactionCard`, `FilterChips`, `EmptyState`

---

### 8. Historico de Uso

| Campo | Detalhe |
|-------|---------|
| Tela | `HistoricoScreen` |
| Navegacao | `/(consumer)/(tabs)/home/historico` — Hidden tab |
| Condicoes de Acesso | Autenticado |
| Dados ao Carregar | `GET /api/mobile/v1/extrato` (mapeado; endpoint `/historico` nao existe no backend) |

**Regras de Exibicao**
- Header: "Historico de Uso" + subtitulo "Suas utilizacoes de cashback em compras"
- FlatList com `HistoricoRow`: avatar inicial da empresa, nome, valor compra, valor cashback, data
- Paginacao infinita com cursor
- Loading: 4x `SkeletonTransaction`
- Empty state: "Sem utilizacoes"

**Nota tecnica**: O service `getHistorico()` mapeia para `/api/mobile/v1/extrato` (mesmo endpoint do extrato geral). O backend nao tem endpoint `/historico` separado.

**Rastreabilidade**
- Componente: `app/(consumer)/(tabs)/home/historico.tsx`
- Hook: `src/hooks/useHistorico.ts` → `useHistorico()`
- Service: `mobileCashbackService.getHistorico()` → `GET /api/mobile/v1/extrato`

---

### 9. Saldo Detalhado

| Campo | Detalhe |
|-------|---------|
| Tela | `SaldoDetailScreen` |
| Navegacao | `/(consumer)/(tabs)/saldo/index` — Tab "Saldo" |
| Condicoes de Acesso | Autenticado |
| Dados ao Carregar | `GET /api/mobile/v1/saldo` + `GET /api/mobile/v1/extrato` (infinite) |

**Regras de Exibicao**
- SaldoCard no topo (saldo total consolidado)
- Secao "Saldo por empresa": lista de `EmpresaSaldo` com avatar, nome e saldo individual
- Secao "Extrato completo": lista infinite com `TransactionRow`
  - Valores negativos (status `expirado` ou `utilizado`): texto cinza com prefixo "-"
  - Valores positivos: texto verde com prefixo "+"
- Loading: SkeletonCard + 4x SkeletonTransaction
- `useRefreshOnFocus` ativo

**Dados staleTime**: saldo com `staleTime: 30_000` (30s) — dados financeiros devem ser frescos

**Rastreabilidade**
- Componente: `app/(consumer)/(tabs)/saldo/index.tsx`
- Hooks: `useSaldo()`, `useExtrato()`
- Service: `mobileCashbackService.getSaldo()` → `GET /api/mobile/v1/saldo`

---

### 10. QR Code (Resgate)

| Campo | Detalhe |
|-------|---------|
| Tela | `QRCodeScreen` |
| Navegacao | `/(consumer)/(tabs)/qrcode/index` — Tab "QR Code" |
| Condicoes de Acesso | Autenticado |
| Dados ao Carregar | `GET /api/mobile/v1/utilizacao/lojas` (lista de empresas com saldo disponivel) |

**Regras de Exibicao**
- Step "select": lista de lojas com saldo, campo valor do resgate, botao GERAR QR CODE
  - Loja selecionada com borda azul + checkmark
  - Campo valor com prefixo "R$" e teclado decimal
  - Texto "Max: R$ X,XX" abaixo do campo
  - Erro "Valor excede o saldo disponivel" quando `valor > saldo`
  - Botao habilitado somente quando: loja selecionada AND valor > 0 AND valor <= saldo
- Step "qr": QRCodeDisplay com token, valor, nome empresa, countdown de expiracao
  - Botao "Gerar Novo" para resetar
  - Ao expirar: volta automaticamente para step "select"
- Loading: ActivityIndicator centralizado
- Empty state: "Nenhuma loja com saldo"

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Selecionar loja | — | — | — | — | Marca loja como selecionada, exibe campo valor |
| Gerar QR Code | `/api/mobile/v1/utilizacao/qrcode` | POST | `{ empresa_id, valor }` | empresa_id: inteiro positivo; valor: positivo e <= saldo | Sucesso: exibe QR com countdown. Erro: Alert |
| Gerar Novo | — | — | — | — | Reseta form e volta para step "select" |

**Middleware backend**: `throttle:financial` (rate limit financeiro)

**Detalhes tecnicas**
- QR token persistido no Redis com TTL 5 minutos (backend)
- Response inclui `qr_token`, `valor`, `expira_em` (ISO 8601)
- Componente `QRCodeDisplay` renderiza QR + `CountdownTimer`

**Rastreabilidade**
- Componente: `app/(consumer)/(tabs)/qrcode/index.tsx`
- Hook: `src/hooks/useQRCode.ts` → `useGerarQRCode()`
- Hook: `src/hooks/useCashback.ts` → `useLojasComSaldo()`
- Service: `mobileQRCodeService.gerarQRCode()` → `POST /api/mobile/v1/utilizacao/qrcode`
- Componentes: `QRCodeDisplay`, `CountdownTimer`, `EmptyState`

---

### 11. Notificacoes

| Campo | Detalhe |
|-------|---------|
| Tela | `NotificationsScreen` |
| Navegacao | `/(consumer)/(tabs)/notifications/index` — Tab "Alertas" |
| Condicoes de Acesso | Autenticado |
| Dados ao Carregar | `GET /api/mobile/v1/notifications` (infinite, cursor-based) |

**Regras de Exibicao**
- Header: "Notificacoes (N)" com contagem de nao-lidas
- Botao "Todas" (marcar todas como lidas) visivel apenas se `unreadCount > 0`
- Link "Preferencias" para tela de preferencias
- SectionList agrupado por dia (usando `formatDateGroup`)
- Cada item renderizado via `NotificationItem`
- Badge na tab: `unreadCount > 0` mostra badge vermelho (trunca em "99+")
- Paginacao infinita com cursor
- Loading: ActivityIndicator centralizado
- Empty state: "Nenhuma notificacao"

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Tap notificacao nao-lida | `PATCH /api/mobile/v1/notifications/{id}/read` | PATCH | — | — | Marca como lida, invalida cache |
| Marcar todas como lidas | `POST /api/mobile/v1/notifications/read-all` | POST | — | — | `setUnreadCount(0)`, invalida cache |
| Tap Preferencias | — | — | — | — | Navega `/(consumer)/(tabs)/notifications/preferences` |

**Rastreabilidade**
- Componente: `app/(consumer)/(tabs)/notifications/index.tsx`
- Hooks: `src/hooks/useNotifications.ts` → `useNotifications()`, `useMarkNotificationRead()`, `useMarkAllNotificationsRead()`
- Store: `src/stores/notification.store.ts` → `unreadCount`, `setUnreadCount`
- Service: `mobileNotificationService`

---

### 12. Preferencias de Notificacao

| Campo | Detalhe |
|-------|---------|
| Tela | `NotificationPreferencesScreen` |
| Navegacao | `/(consumer)/(tabs)/notifications/preferences` — Hidden tab |
| Condicoes de Acesso | Autenticado |
| Dados ao Carregar | `GET /api/mobile/v1/notifications/preferences` |

**Regras de Exibicao**
- Secao "Canais": Push Notifications (switch), Email (switch)
- Secao "Categorias": Marketing e Promocoes (switch)
- Cada switch desabilitado durante `isPending` da mutation
- Loading: ActivityIndicator enquanto preferences nao carregados

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Toggle qualquer preferencia | `PATCH /api/mobile/v1/notifications/preferences` | PATCH | `{ [key]: boolean }` | Zod: `push_enabled`, `email_enabled`, `marketing_enabled` (boolean) | Erro: Alert "Nao foi possivel atualizar preferencia" |

**Rastreabilidade**
- Componente: `app/(consumer)/(tabs)/notifications/preferences.tsx`
- Hooks: `useNotificationPreferences()`, `useUpdateNotificationPreferences()`
- Schema: `src/schemas/notification.ts` → `notificationPreferencesSchema`

---

### 13. Perfil

| Campo | Detalhe |
|-------|---------|
| Tela | `ProfileScreen` |
| Navegacao | `/(consumer)/(tabs)/profile/index` — Tab "Perfil" |
| Condicoes de Acesso | Autenticado |
| Dados ao Carregar | Dados do `useAuthStore.cliente` (ja em memoria) |

**Regras de Exibicao**
- Avatar circular com inicial do nome + nome completo + email
- Menu: Editar Perfil, Alterar Senha, Preferencias de Notificacao
- Biometria: Switch FaceID/Impressao digital (visivel apenas se `biometricAvailable`)
  - Texto "FaceID / Impressao digital" como descricao
- ThemeToggle (tema claro/escuro)
- Link: Politica de Privacidade
- Botao: "Sair" (vermelho)
- Link: "Excluir Conta" (vermelho, menor)

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Editar Perfil | — | — | — | — | Navega `profile/edit` |
| Alterar Senha | — | — | — | — | Navega `profile/change-password` |
| Preferencias Notificacao | — | — | — | — | Navega `notifications/preferences` |
| Toggle Biometria ON | `POST /api/mobile/v1/auth/biometric/enroll` | POST | — | Dispositivo com biometria | Erro: Alert "Nao foi possivel ativar a biometria" |
| Toggle Biometria OFF | `POST /api/mobile/v1/auth/biometric/unenroll` | POST | — | — | Erro: Alert "Biometria desativada localmente, mas houve erro ao sincronizar" |
| Politica de Privacidade | — | — | — | — | Navega `/(shared)/privacy-policy` |
| Sair | `POST /api/mobile/v1/auth/logout` | POST | — | Confirmacao Alert | Limpa auth store, redireciona login |
| Excluir Conta | — | — | — | — | Navega `profile/delete-account` |

**Rastreabilidade**
- Componente: `app/(consumer)/(tabs)/profile/index.tsx`
- Hook: `src/hooks/useBiometric.ts` → `useBiometric()`
- Store: `src/stores/auth.store.ts`
- Componente: `ThemeToggle`

---

### 14. Editar Perfil

| Campo | Detalhe |
|-------|---------|
| Tela | `EditProfileScreen` |
| Navegacao | `/(consumer)/(tabs)/profile/edit` — Hidden tab |
| Condicoes de Acesso | Autenticado |
| Dados ao Carregar | `useAuthStore.cliente` (pre-preenche form) |

**Regras de Exibicao**
- Formulario: Nome, Email, Telefone (pre-preenchidos com dados atuais)
- Botao "Salvar" desabilitado durante `isPending`

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes (Zod) | Feedback |
|------|----------|--------|---------|-------------------|----------|
| Salvar | `PATCH /api/mobile/v1/auth/profile` | PATCH | `{ nome?, email?, telefone? }` | nome: min 3 (opcional); email: valido (opcional); telefone: min 10 (opcional) | Sucesso: Alert + `setCliente()` + `router.back()`. Erro: Alert |

**Rastreabilidade**
- Componente: `app/(consumer)/(tabs)/profile/edit.tsx`
- Hook: `src/hooks/useAuth.ts` → `useUpdateProfile()`
- Schema: `src/schemas/auth.ts` → `updateProfileSchema`

---

### 15. Alterar Senha

| Campo | Detalhe |
|-------|---------|
| Tela | `ChangePasswordScreen` |
| Navegacao | `/(consumer)/(tabs)/profile/change-password` — Hidden tab |
| Condicoes de Acesso | Autenticado |
| Dados ao Carregar | Nenhum |

**Regras de Exibicao**
- Formulario: Senha Atual, Nova Senha, Confirmar Nova Senha
- Toggle "Mostrar/Ocultar" para todos os campos
- Botao "Alterar Senha" desabilitado durante `isPending`

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes (Zod) | Feedback |
|------|----------|--------|---------|-------------------|----------|
| Alterar Senha | `PATCH /api/mobile/v1/auth/password` | PATCH | `{ senha_atual, nova_senha }` | senha_atual: nao vazio; nova_senha: min 6; nova_senha_confirmation: deve ser igual | Sucesso: Alert + `router.back()`. Erro: Alert "Senha atual incorreta" |

**Nota**: O payload enviado ao backend e `{ senha_atual, nova_senha }` (sem o campo confirmation, validado apenas no frontend).

**Rastreabilidade**
- Componente: `app/(consumer)/(tabs)/profile/change-password.tsx`
- Hook: `src/hooks/useAuth.ts` → `useChangePassword()`
- Schema: `src/schemas/auth.ts` → `changePasswordSchema`

---

### 16. Excluir Conta

| Campo | Detalhe |
|-------|---------|
| Tela | `DeleteAccountScreen` |
| Navegacao | `/(consumer)/(tabs)/profile/delete-account` — Hidden tab |
| Condicoes de Acesso | Autenticado |
| Dados ao Carregar | Nenhum |

**Regras de Exibicao**
- Titulo em vermelho: "Excluir Conta"
- Texto explicativo sobre LGPD e irreversibilidade
- Campo: Confirme sua senha (com toggle mostrar/ocultar)
- Campo: Motivo (opcional, multiline)
- Botao vermelho "Excluir Minha Conta"

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes (Zod) | Feedback |
|------|----------|--------|---------|-------------------|----------|
| Excluir | `DELETE /api/mobile/v1/auth/delete-account` | DELETE | `{ senha, motivo? }` | senha: nao vazio; motivo: opcional | Dupla confirmacao via Alert ("Esta acao e irreversivel..."). Sucesso: Alert + limpa cache + logout + redirect login. Erro: Alert "Verifique sua senha" |

**Compliance LGPD**: Dupla confirmacao obrigatoria antes da exclusao.

**Rastreabilidade**
- Componente: `app/(consumer)/(tabs)/profile/delete-account.tsx`
- Hook: `src/hooks/useAuth.ts` → `useDeleteAccount()`
- Schema: `src/schemas/auth.ts` → `deleteAccountSchema`

---

### 17. Lista de Contestacoes

| Campo | Detalhe |
|-------|---------|
| Tela | `ContestacaoListScreen` |
| Navegacao | `/(consumer)/contestacao/index` — Stack |
| Condicoes de Acesso | Autenticado |
| Dados ao Carregar | `GET /api/mobile/v1/contestacoes` (paginado, 20/pagina) |

**Regras de Exibicao**
- Header: "Contestacoes" + botao "Nova" (azul)
- FilterChips: pendente, aprovada, rejeitada (filtro local sobre dados paginados)
- Lista com `ContestacaoRow`: empresa, tipo (label traduzido), status badge, descricao (2 linhas), data, valor
- Tipo labels: `cashback_nao_gerado` → "Cashback nao gerado", `valor_incorreto` → "Valor incorreto", `expiracao_indevida` → "Expiracao indevida", `venda_cancelada` → "Venda cancelada"
- Se tem resposta: bloco cinza "Resposta: [texto]"
- Paginacao infinita
- `useRefreshOnFocus` ativo

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Tap "Nova" | — | — | — | — | Navega `/(consumer)/contestacao/create` |
| Filtrar por status | — | — | — | — | Filtro local (client-side) |

**Rastreabilidade**
- Componente: `app/(consumer)/contestacao/index.tsx`
- Hook: `src/hooks/useContestacao.ts` → `useContestacoes()`
- Service: `mobileContestacaoService.list()` → `GET /api/mobile/v1/contestacoes`
- Componentes: `StatusBadge`, `FilterChips`

---

### 18. Criar Contestacao

| Campo | Detalhe |
|-------|---------|
| Tela | `CreateContestacaoScreen` |
| Navegacao | `/(consumer)/contestacao/create` — Stack |
| Condicoes de Acesso | Autenticado |
| Dados ao Carregar | Params: `cashback_entry_id` (obrigatorio), `empresa_nome` (opcional) |

**Regras de Exibicao**
- Header: "Nova Contestacao" + empresa nome (se fornecido)
- `ContestacaoForm`: selecao de tipo (4 chips), campo descricao (multiline, max 500 chars)
- Botao "Enviar contestacao"

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes (Zod) | Feedback |
|------|----------|--------|---------|-------------------|----------|
| Enviar contestacao | `POST /api/mobile/v1/contestacoes` | POST | `{ transacao_id, tipo, descricao }` | transacao_id: number required; tipo: enum [cashback_nao_gerado, valor_incorreto, expiracao_indevida, venda_cancelada]; descricao: min 10, max 500 | Sucesso: Alert "Contestacao enviada" + `router.back()`. Erro: Alert |

**Rastreabilidade**
- Componente: `app/(consumer)/contestacao/create.tsx`
- Hook: `src/hooks/useContestacao.ts` → `useContestacaoCreate()`
- Componente: `src/components/ContestacaoForm.tsx`
- Schema: `src/schemas/contestacao.ts` → `createContestacaoSchema`
- Service: `mobileContestacaoService.create()` → `POST /api/mobile/v1/contestacoes`

---

## Telas — Grupo (merchant)

### 19. Dashboard Merchant

| Campo | Detalhe |
|-------|---------|
| Tela | `MerchantDashboardScreen` |
| Navegacao | `/(merchant)/(tabs)/dashboard` — Tab "Dashboard" |
| Condicoes de Acesso | Autenticado como merchant (empresa ativa) |
| Dados ao Carregar | 4 queries paralelas: stats, transacoes, top clientes, chart |

**Endpoints ao carregar**:
- `GET /api/v1/dashboard/stats`
- `GET /api/v1/dashboard/transacoes`
- `GET /api/v1/dashboard/top-clientes`
- `GET /api/v1/dashboard/chart?periodo=7d`

**Regras de Exibicao**
- Stats cards horizontais: Total Cashback, Creditado, Resgatado (com variacao %)
- Seletor de periodo para grafico: 7 dias, 30 dias, 90 dias (chips)
- Grafico `DashboardChart` com dados gerado/utilizado por dia
- Ultimas Transacoes: 5 mais recentes (cliente_nome, data, valor com cor por tipo)
  - Cores: gerado → verde, utilizado → roxo, cancelado → amarelo
  - Prefixos: gerado → "+", utilizado → "-", cancelado → "~"
- Top Clientes: 3 primeiros (ranking numerico, nome, saldo total)
- Pull-to-refresh: invalida queries `["merchant", "dashboard"]`

**Rastreabilidade**
- Componente: `app/(merchant)/(tabs)/dashboard.tsx`
- Hooks: `src/hooks/useMerchantManagement.ts` → `useDashboardStats()`, `useDashboardTransacoes()`, `useDashboardTopClientes()`, `useDashboardChart()`
- Service: `merchantManagementService` → `/api/v1/dashboard/*`
- Componentes: `StatsCard`, `DashboardChart`, `AnimatedCardEntry`

---

### 20. Menu Cashback (Merchant)

| Campo | Detalhe |
|-------|---------|
| Tela | `CashbackMenuScreen` |
| Navegacao | `/(merchant)/(tabs)/cashback/index` — Tab "Cashback" |
| Condicoes de Acesso | Autenticado como merchant |
| Dados ao Carregar | Nenhum |

**Regras de Exibicao**
- 3 cards de menu:
  1. Gerar Cashback: "Registrar nova venda e gerar cashback para o cliente"
  2. Utilizar Cashback: "Cliente resgata cashback na compra"
  3. Escanear QR Code: "Validar QR Code do cliente para resgate"

**Rastreabilidade**
- Componente: `app/(merchant)/(tabs)/cashback/index.tsx`

---

### 21. Gerar Cashback (Merchant)

| Campo | Detalhe |
|-------|---------|
| Tela | `GerarCashbackScreen` |
| Navegacao | `/(merchant)/(tabs)/cashback/gerar` — Hidden tab |
| Condicoes de Acesso | Autenticado como merchant |
| Dados ao Carregar | `GET /api/v1/campanhas?status=ativa` (campanhas ativas) |

**Regras de Exibicao**
- Step "form":
  - CPFSearchInput: busca por CPF (11 digitos dispara query automatica)
  - Apos selecionar cliente: campo valor da compra (decimal) + lista campanhas (opcional)
  - Resumo: valor compra, percentual, cashback calculado (`valor * percentual / 100`)
  - Percentual default: 5% (quando nenhuma campanha selecionada)
  - Erro de validacao exibido em caixa vermelha
- Step "confirm": `CashbackConfirmation` com itens resumo + botao "GERAR CASHBACK"
- Step "success": checkmark verde, valor gerado, nome cliente, "Confirma em ~24h"
  - Botoes: "Gerar outro" e "Voltar"

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes (Zod) | Feedback |
|------|----------|--------|---------|-------------------|----------|
| Buscar CPF | `GET /api/v1/clientes?search=CPF` | GET | `?search=CPF` | CPF com 11 digitos | Resultados exibidos inline |
| Validar form | — | — | — | cpf: 11 digitos + digito verificador; valor: positivo; campanha_id: int (opcional) | Erro inline |
| Gerar Cashback | `POST /api/v1/cashback` | POST | `{ cpf, valor_compra, campanha_id? }` | — | Header `Idempotency-Key`. Sucesso: step "success". Erro: Alert |

**Idempotencia**: Cada operacao gera `Idempotency-Key` unico (`timestamp-random`) no header HTTP.

**Rastreabilidade**
- Componente: `app/(merchant)/(tabs)/cashback/gerar.tsx`
- Hooks: `src/hooks/useMerchant.ts` → `useClienteSearch()`, `useCampanhas()`, `useCashbackCreate()`
- Schema: `src/schemas/merchant.ts` → `gerarCashbackMerchantSchema`
- Service: `merchantCashbackService.gerarCashback()` → `POST /api/v1/cashback`
- Componentes: `CPFSearchInput`, `CashbackConfirmation`

---

### 22. Utilizar Cashback (Merchant)

| Campo | Detalhe |
|-------|---------|
| Tela | `UtilizarCashbackScreen` |
| Navegacao | `/(merchant)/(tabs)/cashback/utilizar` — Hidden tab |
| Condicoes de Acesso | Autenticado como merchant |
| Dados ao Carregar | Saldo do cliente selecionado: `GET /api/v1/clientes/{id}/saldo` |

**Regras de Exibicao**
- Step "form":
  - CPFSearchInput (mesmo do Gerar)
  - Apos selecionar cliente: caixa azul com saldo disponivel
  - Campo valor da compra (decimal)
  - Resumo FEFO: valor compra, cashback usado (min entre valor e saldo), pago em dinheiro, novo saldo
  - Botao habilitado quando: cliente selecionado AND valor > 0 AND saldo > 0
- Step "confirm": `CashbackConfirmation` com resumo + botao "CONFIRMAR RESGATE"
- Step "success": checkmark verde, valor usado, nome cliente, novo saldo
  - Botoes: "Nova operacao" e "Voltar"

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Buscar CPF | `GET /api/v1/clientes?search=CPF` | GET | — | CPF 11 digitos | Resultados inline |
| Consultar saldo | `GET /api/v1/clientes/{id}/saldo` | GET | — | Cliente selecionado | Exibe saldo |
| Confirmar Resgate | `POST /api/v1/cashback/utilizar` | POST | `{ cpf, valor_compra }` | — | Header `Idempotency-Key`. Sucesso: step "success". Erro: Alert |

**Logica FEFO**: `cashbackUsado = min(valor, saldoDisponivel)`, `valorDinheiro = max(0, valor - cashbackUsado)`

**Rastreabilidade**
- Componente: `app/(merchant)/(tabs)/cashback/utilizar.tsx`
- Hooks: `useClienteSearch()`, `useClienteSaldo()`, `useCashbackUtilizar()`
- Service: `merchantCashbackService.utilizarCashback()` → `POST /api/v1/cashback/utilizar`

---

### 23. Escanear QR Code (Merchant)

| Campo | Detalhe |
|-------|---------|
| Tela | `QRScanScreen` |
| Navegacao | `/(merchant)/(tabs)/cashback/qr-scan` — Hidden tab |
| Condicoes de Acesso | Autenticado como merchant + permissao de camera |
| Dados ao Carregar | Nenhum (camera scan) |

**Regras de Exibicao**
- Se camera nao permitida: `PermissionRequest` com botao "Permitir Camera"
- Step "scan": preview camera com guia quadrado + texto "Aponte para o QR Code do cliente"
  - Em `__DEV__`: botao "Simular Scan" para teste
- Step "result": card "QR Valido" com: cliente nome, valor, saldo, countdown de expiracao
  - Botao "CONFIRMAR RESGATE" (verde)
  - Botao "Cancelar"
  - Ao expirar countdown: reset automatico para scan
- Step "success": checkmark verde, valor, nome cliente
  - Botoes: "Escanear outro" e "Voltar"

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Scan QR | `POST /api/v1/qrcode/validate` | POST | `{ qr_token }` | Token nao vazio | Sucesso: exibe dados. Erro: Alert "QR Invalido ou expirado" |
| Confirmar Resgate | `POST /api/v1/cashback/utilizar` | POST | `{ cpf, valor_compra }` | — | Header `Idempotency-Key`. Sucesso: step "success". Erro: Alert |
| Cancelar | — | — | — | — | Reset para scan |

**Rastreabilidade**
- Componente: `app/(merchant)/(tabs)/cashback/qr-scan.tsx`
- Hooks: `useValidarQRCode()` (QR), `useCashbackUtilizar()` (resgate), `useCamera()`
- Service: `mobileQRCodeService.validarQRCode()` → `POST /api/v1/qrcode/validate`
- Componentes: `PermissionRequest`, `CountdownTimer`

---

### 24. Clientes (Merchant)

| Campo | Detalhe |
|-------|---------|
| Tela | `ClientesScreen` |
| Navegacao | `/(merchant)/(tabs)/clientes/index` — Tab "Clientes" |
| Condicoes de Acesso | Autenticado como merchant |
| Dados ao Carregar | `GET /api/v1/clientes?page=1&limit=20` |

**Regras de Exibicao**
- SearchBar: busca por nome ou CPF (debounced, reseta pagina para 1)
- Texto "N resultados" quando busca ativa
- FlatList com: avatar inicial, nome, CPF formatado, saldo, cashbacks ativos
- Paginacao manual: botoes "Anterior" / "Proxima" com indicador "pagina / total"
- Loading: Skeleton
- Empty state diferenciado para busca vs sem dados
- Indicador de fetch em andamento (spinner pequeno no canto)

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Buscar | `GET /api/v1/clientes?search=X&page=1&limit=20` | GET | — | — | Atualiza lista |
| Tap cliente | — | — | — | — | Navega `/(merchant)/(tabs)/clientes/{id}` |
| Paginar | `GET /api/v1/clientes?page=N` | GET | — | — | Carrega pagina |

**Rastreabilidade**
- Componente: `app/(merchant)/(tabs)/clientes/index.tsx`
- Hook: `src/hooks/useMerchantManagement.ts` → `useClienteSearchDebounced()`
- Service: `merchantManagementService.getClientes()`
- Componente: `SearchBar`

---

### 25. Detalhe do Cliente (Merchant)

| Campo | Detalhe |
|-------|---------|
| Tela | `ClienteDetailScreen` |
| Navegacao | `/(merchant)/(tabs)/clientes/[id]` — Hidden tab (dynamic route) |
| Condicoes de Acesso | Autenticado como merchant |
| Dados ao Carregar | `GET /api/v1/clientes/{id}` |

**Regras de Exibicao**
- Header: avatar grande, nome, CPF formatado, email, telefone
- MetricCards: Saldo Atual (moeda), Cashbacks Ativos (numerico)
- Informacoes: "Cliente desde" (data), ID
- Loading: ActivityIndicator centralizado
- Erro: "Cliente nao encontrado"

**Rastreabilidade**
- Componente: `app/(merchant)/(tabs)/clientes/[id].tsx`
- Hook: `src/hooks/useMerchantManagement.ts` → `useClienteDetail()`
- Service: `merchantManagementService.getCliente(id)`
- Componente: `MetricCard`

---

### 26. Menu Mais (Merchant)

| Campo | Detalhe |
|-------|---------|
| Tela | `MoreMenuScreen` |
| Navegacao | `/(merchant)/(tabs)/more/index` — Tab "Mais" |
| Condicoes de Acesso | Autenticado como merchant |
| Dados ao Carregar | Nenhum (dados do store multiloja) |

**Regras de Exibicao**
- Menu filtrado por perfil do usuario na empresa ativa:
  - Campanhas: proprietario, gestor, operador
  - Vendas: proprietario, gestor, operador, vendedor
  - Contestacoes: proprietario, gestor, operador
  - Relatorios: proprietario, gestor
  - Configuracoes: proprietario, gestor
- "Trocar empresa" visivel apenas se `isMultiloja()` (mais de 1 empresa)
- Link: Politica de Privacidade
- Botao: "Sair" (vermelho)

**Perfis e permissoes**:

| Menu | proprietario | gestor | operador | vendedor |
|------|:---:|:---:|:---:|:---:|
| Campanhas | Sim | Sim | Sim | Nao |
| Vendas | Sim | Sim | Sim | Sim |
| Contestacoes | Sim | Sim | Sim | Nao |
| Relatorios | Sim | Sim | Nao | Nao |
| Configuracoes | Sim | Sim | Nao | Nao |

**Rastreabilidade**
- Componente: `app/(merchant)/(tabs)/more/index.tsx`
- Stores: `useAuthStore`, `useMultilojaStore`
- Header titulo da tab: `empresaAtiva?.nome_fantasia ?? "Lojista"`

---

### 27. Campanhas (Merchant)

| Campo | Detalhe |
|-------|---------|
| Tela | `CampanhasScreen` |
| Navegacao | `/(merchant)/(tabs)/more/campanhas` — Hidden tab |
| Condicoes de Acesso | Autenticado como merchant (perfil: proprietario, gestor ou operador) |
| Dados ao Carregar | `GET /api/v1/campanhas` (com filtro status opcional) |

**Regras de Exibicao**
- FilterChips: ativa, inativa, finalizada
- Lista com: nome, status badge (cores por status), percentual, validade (dias), periodo, transacoes count
- Botoes inline: Editar, Excluir
- FAB (Floating Action Button) verde "+" para nova campanha
- Modal bottom sheet para criar/editar: nome, percentual, validade dias, data fim
- Empty state com botao "Nova Campanha"

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Criar campanha | `POST /api/v1/campanhas` | POST | `{ nome, percentual, validade_dias, data_inicio, data_fim }` | nome: nao vazio; percentual: 1-100 | Fecha modal, invalida cache |
| Editar campanha | `PATCH /api/v1/campanhas/{id}` | PATCH | campos parciais | Mesmas do criar | Fecha modal, invalida cache |
| Excluir campanha | `DELETE /api/v1/campanhas/{id}` | DELETE | — | Confirmacao Alert | Invalida cache |
| Filtrar por status | (refetch com params) | GET | `?status=X` | — | Recarrega lista |

**Rastreabilidade**
- Componente: `app/(merchant)/(tabs)/more/campanhas.tsx`
- Hooks: `useCampanhasList()`, `useCreateCampanha()`, `useUpdateCampanha()`, `useDeleteCampanha()`
- Service: `merchantManagementService` → CRUD `/api/v1/campanhas`

---

### 28. Vendas (Merchant)

| Campo | Detalhe |
|-------|---------|
| Tela | `VendasScreen` |
| Navegacao | `/(merchant)/(tabs)/more/vendas` — Hidden tab |
| Condicoes de Acesso | Autenticado como merchant (todos os perfis) |
| Dados ao Carregar | `GET /api/v1/cashback` (paginado, com filtros) |

**Regras de Exibicao**
- FilterChips de status: confirmado, pendente, cancelado
- Date range chips: 7 dias, 30 dias, 90 dias (toggle)
- Campo busca por cliente (filtro local/client-side)
- Lista com: cliente nome, status badge, valor compra, valor cashback, data/hora
- Paginacao manual: Anterior / Proxima
- Loading: Skeleton
- Empty state: "Nenhuma venda"

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Filtrar status | `GET /api/v1/cashback?status=X&page=1` | GET | — | — | Recarrega, reseta pagina |
| Filtrar data | `GET /api/v1/cashback?data_inicio=X&data_fim=Y` | GET | — | — | Recarrega, reseta pagina |
| Buscar cliente | — (filtro local) | — | — | — | Filtra resultados em memoria |
| Paginar | `GET /api/v1/cashback?page=N` | GET | — | — | Carrega pagina |

**Rastreabilidade**
- Componente: `app/(merchant)/(tabs)/more/vendas.tsx`
- Hook: `src/hooks/useMerchantManagement.ts` → `useVendas()`
- Service: `merchantManagementService.getVendas()` → `GET /api/v1/cashback`

---

### 29. Contestacoes (Merchant)

| Campo | Detalhe |
|-------|---------|
| Tela | `ContestacoesMerchantScreen` |
| Navegacao | `/(merchant)/(tabs)/more/contestacoes` — Hidden tab |
| Condicoes de Acesso | Autenticado como merchant (proprietario, gestor ou operador) |
| Dados ao Carregar | `GET /api/v1/contestacoes` (filtro default: pendente) |

**Regras de Exibicao**
- FilterChips: pendentes (default), aprovadas, rejeitadas
- Lista com: cliente nome, status badge, tipo, descricao, resposta (se houver), data
- Botao "Responder" visivel apenas em contestacoes pendentes
- Modal bottom sheet: campo resposta (multiline, min 80px) + 3 botoes: Cancelar, Rejeitar, Aprovar

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Filtrar status | (refetch) | GET | `?status=X` | — | Recarrega lista |
| Aprovar | `PATCH /api/v1/contestacoes/{id}` | PATCH | `{ status: "aprovada", resposta }` | resposta: nao vazio (trim) | Fecha modal, invalida cache |
| Rejeitar | `PATCH /api/v1/contestacoes/{id}` | PATCH | `{ status: "rejeitada", resposta }` | resposta: nao vazio (trim) | Fecha modal, invalida cache |

**Rastreabilidade**
- Componente: `app/(merchant)/(tabs)/more/contestacoes.tsx`
- Hooks: `useContestacoesMerchant()`, `useResolveContestacao()`
- Service: `merchantManagementService.resolveContestacao()` → `PATCH /api/v1/contestacoes/{id}`

---

### 30. Configuracoes (Merchant)

| Campo | Detalhe |
|-------|---------|
| Tela | `ConfigScreen` |
| Navegacao | `/(merchant)/(tabs)/more/config` — Hidden tab |
| Condicoes de Acesso | Autenticado como merchant (proprietario ou gestor) |
| Dados ao Carregar | `GET /api/v1/config` |

**Regras de Exibicao**
- Secao "Dados da Empresa" (somente leitura): Nome Fantasia, CNPJ, Plano (status), Proxima cobranca
- Secao "Contato" (editavel): Telefone, E-mail
- Secao "Regras de Cashback" (editavel): Percentual Cashback (%), Validade Cashback (dias), Max. Utilizacao (%)
- Botao "Salvar Configuracoes" (verde)
- Loading: Skeleton
- Erro: "Erro ao carregar configuracoes"

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Salvar | `PATCH /api/v1/config` | PATCH | `{ telefone, email, percentual_cashback, validade_cashback, max_utilizacao }` | — (sem validacao Zod no frontend) | Sucesso: Alert "Configuracoes atualizadas" |

**Rastreabilidade**
- Componente: `app/(merchant)/(tabs)/more/config.tsx`
- Hooks: `useEmpresaConfig()`, `useUpdateConfig()`
- Service: `merchantManagementService.getConfig()` / `updateConfig()` → `/api/v1/config`

---

### 31. Relatorios (Merchant)

| Campo | Detalhe |
|-------|---------|
| Tela | `RelatoriosScreen` |
| Navegacao | `/(merchant)/(tabs)/more/relatorios` — Hidden tab |
| Condicoes de Acesso | Autenticado como merchant (proprietario ou gestor) |
| Dados ao Carregar | `GET /api/v1/relatorios?periodo=30d` |

**Regras de Exibicao**
- FilterChips de periodo: 7 dias, 30 dias (default), 90 dias
- MetricCards: Cashback Gerado, Cashback Utilizado, Cashback Expirado, Clientes Ativos (numerico), Ticket Medio
- Loading: Skeleton
- Erro: texto cinza "Erro ao carregar relatorio"

**Rastreabilidade**
- Componente: `app/(merchant)/(tabs)/more/relatorios.tsx`
- Hook: `src/hooks/useMerchantManagement.ts` → `useRelatorios()`
- Service: `merchantManagementService.getRelatorios()` → `GET /api/v1/relatorios`

---

### 32. Selecionar Empresa (Multiloja)

| Campo | Detalhe |
|-------|---------|
| Tela | `MultilojaScreen` |
| Navegacao | `/(merchant)/multiloja` — Modal |
| Condicoes de Acesso | Autenticado como merchant com 2+ empresas |
| Dados ao Carregar | `GET /api/v1/empresas` (via `useEmpresas()`) |

**Regras de Exibicao**
- Lista de empresas: avatar, nome fantasia, CNPJ, perfil traduzido (Proprietario/Gestor/Operador/Vendedor)
- Empresa ativa com borda verde + checkmark
- Empresa ativa desabilitada para clique
- Loading: 3x SkeletonCard
- Spinner durante troca de empresa

**Regras de Interacao**

| Acao | Endpoint | Metodo | Payload | Validacoes | Feedback |
|------|----------|--------|---------|------------|----------|
| Selecionar empresa | Switch empresa (service) | — | empresa_id | — | `setEmpresaAtiva()`, invalida todas as queries, `router.back()` |

**Rastreabilidade**
- Componente: `app/(merchant)/multiloja.tsx`
- Hooks: `src/hooks/useMerchant.ts` → `useEmpresas()`, `useSwitchEmpresa()`
- Store: `src/stores/multiloja.store.ts`
- Service: `merchantEmpresaService.switchEmpresa()`

---

### 33. Politica de Privacidade

| Campo | Detalhe |
|-------|---------|
| Tela | `PrivacyPolicyScreen` |
| Navegacao | `/(shared)/privacy-policy` — Stack |
| Condicoes de Acesso | Nenhuma (acessivel de consumer e merchant) |
| Dados ao Carregar | Nenhum (conteudo estatico) |

**Regras de Exibicao**
- Texto estatico com 6 secoes: Dados Coletados, Finalidade, Compartilhamento, Seus Direitos, Exclusao de Conta, Seguranca
- Referencia LGPD (Lei 13.709/2018)

**Rastreabilidade**
- Componente: `app/(shared)/privacy-policy.tsx`

---

## Rotas API Mobile (Backend)

### Rotas Publicas (`throttle:public`)

| Metodo | URI | Controller | Descricao |
|--------|-----|-----------|-----------|
| POST | `/api/mobile/v1/auth/login` | MobileAuthController@login | Login por email/senha |
| POST | `/api/mobile/v1/auth/register` | MobileAuthController@register | Cadastro de consumidor |
| POST | `/api/mobile/v1/auth/oauth` | MobileAuthController@oauth | Login social (Google/Apple) |
| POST | `/api/mobile/v1/auth/forgot-password` | MobileAuthController@forgotPassword | Solicitar reset (+throttle:password_reset) |
| POST | `/api/mobile/v1/auth/verify-reset-token` | MobileAuthController@verifyResetToken | Verificar codigo (+throttle:password_reset) |
| POST | `/api/mobile/v1/auth/reset-password` | MobileAuthController@resetPassword | Redefinir senha (+throttle:password_reset) |
| POST | `/api/mobile/v1/auth/biometric/verify` | MobileBiometricController@verify | Login biometrico |

### Rotas Autenticadas (`auth:api_mobile` + `throttle:auth`)

| Metodo | URI | Controller | Descricao |
|--------|-----|-----------|-----------|
| GET | `/api/mobile/v1/auth/me` | MobileAuthController@me | Dados do usuario logado |
| POST | `/api/mobile/v1/auth/refresh` | MobileAuthController@refresh | Renovar token JWT |
| POST | `/api/mobile/v1/auth/logout` | MobileAuthController@logout | Logout |
| PATCH | `/api/mobile/v1/auth/profile` | MobileAuthController@updateProfile | Atualizar perfil |
| PATCH | `/api/mobile/v1/auth/password` | MobileAuthController@changePassword | Alterar senha |
| DELETE | `/api/mobile/v1/auth/delete-account` | MobileAuthController@deleteAccount | Excluir conta (LGPD) |
| POST | `/api/mobile/v1/auth/biometric/enroll` | MobileBiometricController@enroll | Registrar biometria |
| POST | `/api/mobile/v1/auth/biometric/unenroll` | MobileBiometricController@unenroll | Remover biometria |
| GET | `/api/mobile/v1/auth/sessions` | MobileSessionController@index | Listar sessoes ativas |
| DELETE | `/api/mobile/v1/auth/sessions/{id}` | MobileSessionController@destroy | Revogar sessao |
| GET | `/api/mobile/v1/saldo` | MobileSaldoController@index | Saldo consolidado |
| GET | `/api/mobile/v1/extrato` | MobileExtratoController@index | Extrato com cursor pagination |
| GET | `/api/mobile/v1/utilizacao/lojas` | MobileUtilizacaoController@lojas | Empresas com saldo |
| POST | `/api/mobile/v1/utilizacao/qrcode` | MobileUtilizacaoController@qrcode | Gerar QR (+throttle:financial) |
| GET | `/api/mobile/v1/contestacoes` | MobileContestacaoController@index | Listar contestacoes |
| POST | `/api/mobile/v1/contestacoes` | MobileContestacaoController@store | Criar contestacao |
| GET | `/api/mobile/v1/disputes` | MobileContestacaoController@index | Alias ingles |
| POST | `/api/mobile/v1/disputes` | MobileContestacaoController@store | Alias ingles |
| GET | `/api/mobile/v1/notifications` | MobileNotificationController@index | Listar notificacoes |
| PATCH | `/api/mobile/v1/notifications/{id}/read` | MobileNotificationController@markAsRead | Marcar como lida |
| POST | `/api/mobile/v1/notifications/read-all` | MobileNotificationController@markAllAsRead | Marcar todas como lidas |
| GET | `/api/mobile/v1/notifications/preferences` | MobileNotificationController@getPreferences | Preferencias |
| PATCH | `/api/mobile/v1/notifications/preferences` | MobileNotificationController@updatePreferences | Atualizar preferencias |
| POST | `/api/mobile/v1/devices` | MobileDeviceController@register | Registrar push token |
| DELETE | `/api/mobile/v1/devices` | MobileDeviceController@destroy | Remover push token |

---

## Stores (Zustand)

| Store | Arquivo | Dados | Uso |
|-------|---------|-------|-----|
| `useAuthStore` | `src/stores/auth.store.ts` | `cliente`, `isAuthenticated`, `isLoading` | AuthGuard, perfil, logout |
| `useMultilojaStore` | `src/stores/multiloja.store.ts` | `empresas[]`, `empresaAtiva` | Merchant tabs header, menu Mais, multiloja |
| `useNotificationStore` | `src/stores/notification.store.ts` | `unreadCount`, `preferences` | Badge tab Alertas, preferencias |
| `useConnectivityStore` | `src/stores/connectivity.store.ts` | `isOnline` | OfflineBanner |
| `useDeviceStore` | `src/stores/device.store.ts` | Device info | Push registration |
| `useThemeStore` | `src/stores/theme.store.ts` | `theme` | ThemeProvider, ThemeToggle |

---

## Validacoes Zod (Frontend)

| Schema | Arquivo | Campos |
|--------|---------|--------|
| `loginSchema` | `schemas/auth.ts` | email: email valido; senha: min 6 |
| `registerSchema` | `schemas/auth.ts` | nome: min 3; email: valido; cpf: 11 digitos + verificador; senha: min 6; senha_confirmation: igual |
| `forgotPasswordSchema` | `schemas/auth.ts` | email: valido |
| `resetPasswordSchema` | `schemas/auth.ts` | email: valido; token: min 1; senha: min 6 |
| `updateProfileSchema` | `schemas/auth.ts` | nome: min 3 (opt); email: valido (opt); telefone: min 10 (opt) |
| `changePasswordSchema` | `schemas/auth.ts` | senha_atual: nao vazio; nova_senha: min 6; confirmacao: igual |
| `deleteAccountSchema` | `schemas/auth.ts` | senha: nao vazio; motivo: opcional |
| `oauthSchema` | `schemas/auth.ts` | provider: google ou apple; token: nao vazio; nonce: opcional |
| `gerarQRCodeSchema` | `schemas/cashback.ts` | empresa_id: int positivo; valor: positivo |
| `validarQRCodeSchema` | `schemas/cashback.ts` | qr_token: nao vazio |
| `createContestacaoSchema` | `schemas/contestacao.ts` | transacao_id: number; tipo: enum 4 opcoes; descricao: 10-500 chars |
| `gerarCashbackMerchantSchema` | `schemas/merchant.ts` | cpf: 11 digitos + verificador; valor: positivo; campanha_id: int (opt) |
| `utilizarCashbackSchema` | `schemas/merchant.ts` | cpf: 11 digitos + verificador; valor: positivo |
| `notificationPreferencesSchema` | `schemas/notification.ts` | push_enabled: bool; email_enabled: bool; marketing_enabled: bool |

---

## Regras Transversais

### Idempotencia
- Operacoes financeiras (gerar cashback, utilizar cashback) incluem header `Idempotency-Key` unico
- Formato: `{timestamp}-{random}` gerado no momento da chamada

### Rate Limiting (Backend)
- `throttle:public`: rotas sem auth
- `throttle:auth`: rotas autenticadas
- `throttle:password_reset`: reset de senha (rate limit separado)
- `throttle:financial`: operacoes financeiras (QR code)

### Offline
- `ConnectivityBanner` exibido globalmente quando offline
- `useConnectivity` hook monitora estado de rede
- `useOfflineQueue` hook para enfileirar operacoes offline

### Refresh de Dados
- `useRefreshOnFocus`: refetch automatico ao navegar de volta para tela
- Pull-to-refresh em telas principais (Dashboard, Saldo)
- `staleTime: 30_000` para dados financeiros (saldo)
- `staleTime: 5 * 60_000` para dados pouco volateis (campanhas merchant)

### Contract Validation
- Respostas da API validadas via schemas Zod no service layer (`validateResponse()`)
- Violacoes de contrato registradas via `getContractViolations()`

### Seguranca
- SSL Pinning validado na inicializacao (`validateApiHost()`)
- Tokens armazenados em SecureStore (nao AsyncStorage)
- Biometria opcional (FaceID/TouchID) com enroll/unenroll via API
- Session management: listar e revogar sessoes ativas
- LGPD: consentimento obrigatorio, exclusao de conta com dupla confirmacao

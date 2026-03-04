# S5-E2 — Mapa de Regras de Negócio: Consumer MOBILE (Refinado)

> Atualizado a partir de S4-E3 com validação de itens pendentes contra código-fonte (S5-E7c).
> Etapa 7c do pipeline de refinamento. Data: 2026-03-04.
> ⚠️ **ATUALIZADO S11-E2**: 14 paths incorretos corrigidos (vendas→cashback, empresa/config→config, empresas/{id}/switch→auth/switch-empresa, contestacoes/{id}/resolve→contestacoes/{id}). Mudanças S9 refletidas (B1: senha min 6→8).

**Stack:** React Native 0.76.9 + Expo 52 + TypeScript 5.3 + expo-router 4.0 + NativeWind 4.1 + Zustand 4.4 + TanStack React Query 5.14 + React Hook Form 7.50 + Zod 3.22 + Axios 1.7 + expo-secure-store 14 + Sentry React Native 6.10

**Auth:** JWT Bearer token (expo-secure-store) com auto-refresh via interceptor Axios

**Prefixos de API:**
- Consumer: `/api/mobile/v1`
- Merchant: `/api/v1`

**Total de telas:** 33 (31 originais + 2 cross-cutting sections)

**Resumo de Alterações S4:**
- **17 telas alteradas**, **15 telas inalteradas**
- **9 itens cross-cutting** (arquiteturais)
- Tipos de mudança: 10 regras corrigidas, 3 campos novos, 2 regras novas, 2 ⚠️ RESOLVIDO S10 (anteriormente INFERIDO→RESOLVIDO, agora confirmados)

**Resumo de Alterações S5-E7c:**
- **5 itens pendentes → CONFIRMADOS** (M1: `/historico`→`/extrato`; M3-M6: perfil role-gating)
- **3 regras corrigidas** (divergência mapa↔código na tabela de role-gating)
- **1 atualização CC-7**: nome correto da função `unregisterToken()` (pendente integração logout)

---

## Arquitetura de Navegação

```
app/_layout.tsx (RootLayout)
├── AuthGuard → verifica isAuthenticated + onboarding + LGPD consent
├── (auth)/ — Stack (Login, Register, ForgotPassword, Onboarding, Consent)
├── (consumer)/ — Stack
│   ├── (tabs)/ — Bottom Tabs: Início, Saldo, QR Code, Alertas, Perfil
│   │   ├── home/index, home/extrato, home/historico
│   │   ├── saldo/index
│   │   ├── qrcode/index
│   │   ├── notifications/index, notifications/preferences
│   │   └── profile/index, profile/edit, profile/change-password, profile/delete-account
│   └── contestacao/index, contestacao/create
├── (merchant)/ — Stack
│   ├── (tabs)/ — Bottom Tabs: Dashboard, Cashback, Clientes, Mais
│   │   ├── dashboard
│   │   ├── cashback/index, cashback/gerar, cashback/utilizar, cashback/qr-scan
│   │   ├── clientes/index, clientes/[id]
│   │   └── more/index, more/campanhas, more/vendas, more/contestacoes, more/config, more/relatorios
│   └── multiloja (modal)
└── (shared)/privacy-policy
```

---

## 1. OnboardingScreen

### Rota
`(auth)/onboarding` → `app/(auth)/onboarding.tsx`

### Condições de Acesso
- Exibida **apenas na primeira abertura** do app (antes de qualquer login)
- Verificada via `hasCompletedOnboarding()` — chave MMKV `onboarding_completed`
- AuthGuard em `app/_layout.tsx:41` redireciona para onboarding se `!hasCompletedOnboarding()`
- Após completar → redireciona para `/(auth)/login`

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Conteúdo estático (3 slides hardcoded) | Nenhuma |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Carrossel 3 slides | FlatList horizontal paginado | Sempre | — | Slide 1 |
| 2 | Indicadores (dots) | View circular | Sempre | — | Dot 1 ativo (verde) |
| 3 | Botão "Pular" | TouchableOpacity | Sempre | — | Visível |
| 4 | Botão "Próximo" | TouchableOpacity | Slides 1-2 | — | "Próximo" |
| 5 | Botão "Começar" | TouchableOpacity | Slide 3 (último) | — | "Começar" |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Swipe horizontal | — | — | — | — | Muda slide |
| 2 | Tap "Próximo" | — | — | — | — | Scroll para próximo slide |
| 3 | Tap "Começar" (último slide) | — | — | MMKV.set("onboarding_completed", true) | — | router.replace("/(auth)/login") |
| 4 | Tap "Pular" | — | — | MMKV.set("onboarding_completed", true) | — | router.replace("/(auth)/login") |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| currentIndex | 0, 1, 2 | Dots + Botão texto | Dot ativo muda; botão muda "Próximo" → "Começar" no último | — |

### Estados da Interface
- **Loading:** N/A
- **Empty:** N/A
- **Error:** N/A

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1-5 | app/(auth)/onboarding.tsx | OnboardingScreen | slides[], finishOnboarding(), handleNext() |
| Guard | app/_layout.tsx:41 | AuthGuard | `!hasCompletedOnboarding()` → redirect |

---

## 2. LoginScreen

### Rota
`(auth)/login` → `app/(auth)/login.tsx`

### Condições de Acesso
- Usuário **não autenticado** + onboarding já completado
- AuthGuard redireciona para login se `!isAuthenticated && !inAuthGroup`

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Nenhum (formulário vazio) | — |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Campo Email | TextInput | Sempre | — | Vazio |
| 2 | Campo Senha | TextInput secureTextEntry | Sempre | — | Vazio |
| 3 | Link "Esqueceu a senha?" | TouchableOpacity | Sempre | — | — |
| 4 | Botão "Entrar" | TouchableOpacity | Sempre | — | Habilitado |
| 5 | Link "Não tem conta? Cadastre-se" | TouchableOpacity | Sempre | — | — |
| 6 | ActivityIndicator no botão | ActivityIndicator | loginMutation.isPending | !isPending | — |

> **S4 ALTERAÇÃO**: Botões OAuth (Google/Apple) e divider "ou" removidos inteiramente. De 9 elementos para 6. Ref Diff: MUDANÇA #4.

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Submit login | `POST /api/mobile/v1/auth/login` | POST | `{ email, senha }` | Zod: email válido, senha min 6 chars | Sucesso → router.replace("/"); Erro → Alert "Credenciais inválidas" |
| 2 | Tap "Esqueceu a senha?" | — | — | — | — | router.push("/(auth)/forgot-password") |
| 3 | Tap "Cadastre-se" | — | — | — | — | router.push("/(auth)/register") |

> **S4 ALTERAÇÃO**: Interações OAuth (#2-3 originais) removidas — botões não existem mais. Ref Diff: MUDANÇA #4.

### Validações (Zod — `loginSchema`)
| Campo | Regra | Mensagem |
|-------|-------|----------|
| email | `z.string().email()` | "E-mail inválido" |
| senha | `z.string().min(8)` | "Senha deve ter no mínimo 8 caracteres" | ⚠️ ATUALIZADO S11: min(6)→min(8) — Ref S9-E2 B1 |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Login falhou | — | "Credenciais inválidas" | Alert | Até dismiss |

> **S4 ALTERAÇÃO**: Mensagem "OAuth placeholder" removida — OAuth não existe mais. Ref Diff: MUDANÇA #4.

### Estados da Interface
- **Loading:** ActivityIndicator dentro do botão "Entrar" durante isPending
- **Empty:** N/A (formulário sempre exibido)
- **Error:** Mensagens Zod inline + Alert em erro de API

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1 | app/(auth)/login.tsx:34 | onSubmit | loginMutation.mutate(data) |
| Val | src/schemas/auth.ts:3-6 | loginSchema | z.object({ email, senha }) |
| Svc | src/services/mobile.auth.service.ts:31 | login() | POST /auth/login + saveTokens |
| S4 | app/(auth)/login.tsx | OAuth removal | Botões OAuth e divider removidos | Ref Diff: MUDANÇA #4 |

---

## 3. RegisterScreen

### Rota
`(auth)/register` → `app/(auth)/register.tsx`

### Condições de Acesso
- Navegação a partir da LoginScreen ("Cadastre-se")
- Usuário não autenticado

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Nenhum (formulário vazio) | — |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Campo Nome completo | TextInput autoCapitalize="words" | Sempre | — | Vazio |
| 2 | Campo Email | TextInput email-address | Sempre | — | Vazio |
| 3 | Campo CPF | TextInput numeric, maxLength=11 | Sempre | — | Vazio |
| 4 | Campo Senha | TextInput secureTextEntry | Sempre | — | Vazio |
| 5 | Campo Confirmar Senha | TextInput secureTextEntry | Sempre | — | Vazio |
| 6 | Botão "Cadastrar" | TouchableOpacity | Sempre | — | Habilitado |
| 7 | Link "Já tem conta? Entrar" | TouchableOpacity | Sempre | — | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Submit cadastro | `POST /api/mobile/v1/auth/register` | POST | `{ cpf, nome, email, senha }` | Zod: nome min 3, email válido, CPF 11 dígitos, senha min 6, senhas iguais | Sucesso → router.replace("/"); Erro → Alert |

### Validações (Zod — `registerSchema`)
| Campo | Regra | Mensagem |
|-------|-------|----------|
| nome | `z.string().min(3)` | "Nome deve ter no mínimo 3 caracteres" |
| email | `z.string().email()` | "E-mail inválido" |
| cpf | `z.string().length(11).refine(isValidCPF)` | "CPF inválido" |
| senha | `z.string().min(8)` | "Senha deve ter no mínimo 8 caracteres" | ⚠️ ATUALIZADO S11: min(6)→min(8) — Ref S9-E2 B1 |
| senha_confirmation | `.refine(data.senha === data.senha_confirmation)` | "Senhas não conferem" |

> **S4 ALTERAÇÃO**: CPF validation mudou de `z.string().length(11)` (apenas comprimento) para `.refine(isValidCPF)` com algoritmo Mod-11 (dígitos verificadores). Ref Diff: MUDANÇA #56.

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Cadastro falhou | — | "Não foi possível criar a conta." | Alert | Até dismiss |

### Estados da Interface
- **Loading:** ActivityIndicator no botão durante step === "submitting"
- **Empty:** N/A
- **Error:** Mensagens Zod inline + Alert

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1 | app/(auth)/register.tsx:38 | onSubmit | registerMutation.mutate(data) |
| Val | src/schemas/auth.ts:8-19 | registerSchema | z.object + .refine |
| Svc | src/services/mobile.auth.service.ts:24 | register() | POST /auth/register + saveTokens |
| S4-CPF | src/utils/validators.ts | isValidCPF() | Algoritmo Mod-11 para validação de CPF | Ref Diff: MUDANÇA #56 |

---

## 4. ForgotPasswordScreen

### Rota
`(auth)/forgot-password` → `app/(auth)/forgot-password.tsx`

### Condições de Acesso
- Navegação a partir da LoginScreen ("Esqueceu a senha?")
- Usuário não autenticado

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Nenhum | — |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Campo Email | TextInput | step === "email" | step !== "email" | Vazio |
| 2 | Botão "Enviar Email" | TouchableOpacity | step === "email" | step !== "email" | — |
| 3 | Campo Código de Verificação | TextInput | step === "verify" | step !== "verify" | Vazio |
| 4 | Botão "Verificar Código" | TouchableOpacity | step === "verify" | step !== "verify" | — |
| 5 | Campo Nova Senha | TextInput secureTextEntry | step === "reset" | step !== "reset" | Vazio |
| 6 | Botão "Redefinir Senha" | TouchableOpacity | step === "reset" | step !== "reset" | — |
| 7 | Tela de confirmação "Senha redefinida!" | View | step === "done" | step !== "done" | — |
| 8 | Link "Voltar ao login" | TouchableOpacity | step !== "done" | step === "done" | — |

> **S4 ALTERAÇÃO (REGRA NOVA)**: Fluxo reestruturado de 2-step (`email|token`) para 3-step (`email|verify|reset|done`). Novo step intermediário `verify` com `verifyResetToken()` chamando endpoint novo `POST /api/mobile/v1/auth/verify-reset-token`. Ref Diff: MUDANÇA #3, S2-E5 C3.

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Enviar email | `POST /api/mobile/v1/auth/forgot-password` | POST | `{ email }` | Zod: email válido | Sucesso → step "verify"; Erro → Alert "Não foi possível enviar..." |
| 2 | Verificar código | `POST /api/mobile/v1/auth/verify-reset-token` | POST | `{ email, token }` | Zod: email, token min 1 | Sucesso → step "reset"; Erro 400 → Alert "Código inválido"; Erro 410 → Alert "Código expirado" |
| 3 | Redefinir senha | `POST /api/mobile/v1/auth/reset-password` | POST | `{ email, token, senha }` | Zod: email, token min 1, senha min 6 | Sucesso → step "done" (tela confirmação); Erro → Alert "Token inválido ou expirado" |

> **S4 ALTERAÇÃO**: Interação #2 é NOVA — verifica token antes de permitir reset. Endpoint `verify-reset-token` é novo (S2-E5 C3). Ref Diff: MUDANÇA #3.

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| step | "email" → "verify" → "reset" → "done" | Formulário visível | Ao enviar email → verify; ao verificar token → reset; ao redefinir → done | — |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Email enviado com sucesso | — | (navega para step "verify" sem mensagem) | — | — |
| Email falhou | — | "Não foi possível enviar o email de recuperação." | Alert | Até dismiss |
| Código inválido | 400 | "Código inválido. Verifique e tente novamente." | Alert | Até dismiss |
| Código expirado | 410 | "Código expirado. Solicite um novo código." | Alert | Até dismiss |
| Senha redefinida | — | "Senha redefinida com sucesso!" | Tela done | Persistente |
| Token inválido no reset | — | "Token inválido ou expirado. Tente novamente." | Alert | Até dismiss |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1 | app/(auth)/forgot-password.tsx:40 | onSendEmail | forgotMutation.mutate |
| 2 | app/(auth)/forgot-password.tsx:45 | onVerifyToken | verifyMutation.mutate |
| 3 | app/(auth)/forgot-password.tsx:55 | onResetPassword | resetMutation.mutate |
| Val | src/schemas/auth.ts:21-29 | forgotPasswordSchema, resetPasswordSchema | — |
| Svc | src/services/mobile.auth.service.ts:69-82 | forgotPassword(), verifyResetToken(), resetPassword() | — |
| S4-Verify | src/services/mobile.auth.service.ts | verifyResetToken() | POST /auth/verify-reset-token (NOVO) | Ref Diff: MUDANÇA #3, S2-E5 C3 |

---

## 5. ConsentScreen (LGPD)

### Rota
`(auth)/consent` → `app/(auth)/consent.tsx`

### Condições de Acesso
- Exibida após login bem-sucedido SE `!hasGivenConsent()` (chave MMKV `lgpd_consent_given`)
- AuthGuard em `app/_layout.tsx:47` redireciona para consent se autenticado + sem consentimento
- **Obrigatória** — não é possível acessar áreas consumer/merchant sem aceitar

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Conteúdo estático (termos LGPD) | — |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Seção "Dados que coletamos" | View estática | Sempre | — | — |
| 2 | Seção "Finalidade" | View estática | Sempre | — | — |
| 3 | Seção "Seus direitos" | View estática | Sempre | — | — |
| 4 | Checkbox "Termos de Uso e Política de Privacidade" | TouchableOpacity + checkbox visual | Sempre | — | Desmarcado |
| 5 | Switch "Receber promoções" (opcional) | Switch | Sempre | — | Desligado |
| 6 | Botão "Concordar e Continuar" | TouchableOpacity | Sempre | — | **Desabilitado** (bg-gray-300) |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Toggle checkbox obrigatório | — | — | — | — | Habilita/desabilita botão "Concordar" |
| 2 | Toggle marketing (opcional) | — | — | — | — | Salva em MMKV `lgpd_marketing_consent` |
| 3 | Tap "Concordar e Continuar" | — | — | MMKV.set("lgpd_consent_given", true) | accepted === true | router.replace("/") |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| accepted (checkbox) | true | Botão "Concordar" | true → bg-green-500 + habilitado; false → bg-gray-300 + desabilitado | — |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Botão de pular/fechar | Consentimento LGPD é obrigatório | Todos | consent.tsx — sem opção de skip |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1-3 | app/(auth)/consent.tsx:18 | handleAccept | storage.set(CONSENT_KEY, true) |
| Guard | app/_layout.tsx:47 | AuthGuard | `!hasGivenConsent()` → redirect |

---

## 6. HomeScreen (Consumer Dashboard)

### Rota
`(consumer)/home/index` → `app/(consumer)/(tabs)/home/index.tsx`

### Condições de Acesso
- Usuário autenticado como **consumer** (tipo_global: cliente)
- LGPD consent concedido
- Tab "Início" na barra inferior do consumer

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/mobile/v1/saldo` | GET | saldo_total, por_empresa | useSaldo() hook |
| `GET /api/mobile/v1/extrato` | GET | 5 primeiras entradas (id, tipo, valor_compra, valor_cashback, status_cashback, empresa.nome_fantasia, created_at) | useExtrato() hook |
| `GET /api/mobile/v1/auth/me` | GET | cliente.nome (via authStore) | Já carregado no AuthGuard |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Saudação "Olá, {primeiro_nome}" | Text | Sempre | — | "Olá, —" se nome null |
| 2 | NotificationBell | Componente | Sempre | — | Badge com unreadCount |
| 3 | SaldoCard | Componente | saldo carregado | saldoLoading | — |
| 4 | SkeletonCard | Componente | saldoLoading | !saldoLoading | — |
| 5 | Quick actions (Extrato, Histórico, Contestações) | 3 TouchableOpacity | Sempre | — | — |
| 6 | "Últimas transações" + "Ver tudo" | Text + link | recentEntries.length > 0 | sem entries | — |
| 7 | CashbackTimeline | Componente | entries > 0 | entries === 0 | Últimas 5 |
| 8 | EmptyState | Componente | entries === 0, !loading | — | "Sem transações" |
| 9 | SkeletonTransaction (x3) | Componente | extratoLoading | !loading | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Pull to refresh | Refetch saldo + extrato | GET | — | — | PullToRefresh indicator |
| 2 | Tap SaldoCard | — | — | — | — | router.push saldo/index |
| 3 | Tap "Extrato" | — | — | — | — | router.push home/extrato |
| 4 | Tap "Histórico" | — | — | — | — | router.push home/historico |
| 5 | Tap "Contestações" | — | — | — | — | router.push contestacao/ |
| 6 | Tap "Ver tudo" | — | — | — | — | router.push home/extrato |
| 7 | Tap NotificationBell | — | — | — | — | router.push notifications/ |
| 8 | Foco na tela (volta) | Refetch saldo + extrato | GET | — | — | useRefreshOnFocus |

### Estados da Interface
- **Loading:** SkeletonCard para saldo + SkeletonTransaction (x3) para extrato
- **Empty:** EmptyState "Sem transações" / "Suas transações de cashback aparecerão aqui."
- **Error:** Tratado pelo ErrorBoundary do layout consumer

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Saldo | src/services/mobile.cashback.service.ts:18 | getSaldo() | GET /saldo |
| Extrato | src/services/mobile.cashback.service.ts:24 | getExtrato() | GET /extrato |
| Refresh | app/(consumer)/(tabs)/home/index.tsx:25 | handleRefresh | refetchSaldo + refetchExtrato |

---

## 7. ExtratoScreen

### Rota
`(consumer)/home/extrato` → `app/(consumer)/(tabs)/home/extrato.tsx`

### Condições de Acesso
- Navegação a partir de HomeScreen ("Extrato" ou "Ver tudo")
- Tela oculta na tab bar (`href: null`)

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/mobile/v1/extrato` | GET | id, tipo, valor_compra, valor_cashback, status_cashback, data_expiracao, empresa, campanha, created_at | useExtratoInfinite(filters) — paginação cursor |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Título "Extrato" + subtítulo | Text | Sempre | — | — |
| 2 | FilterChips (status) | Componente | Sempre | — | Nenhum selecionado |
| 3 | Link "Limpar filtros" | TouchableOpacity | hasActiveFilters | !hasActiveFilters | — |
| 4 | Lista TransactionCard | FlatList | entries > 0 | entries === 0 | — |
| 5 | SkeletonTransaction (x5) | Componente | isLoading | !isLoading | — |
| 6 | EmptyState | Componente | !isLoading && entries === 0 | — | Mensagem dinâmica |
| 7 | ActivityIndicator footer | ActivityIndicator | isFetchingNextPage | — | — |

### Filtros e Ordenação
| Filtro | Opções | Padrão | Tipo |
|--------|--------|--------|------|
| status | pendente, confirmado, utilizado, rejeitado, expirado, congelado | Nenhum (todos) | FilterChips single-select |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Selecionar filtro status | `GET /api/mobile/v1/extrato?status={status}` | GET | query params | — | Refetch lista |
| 2 | Limpar filtros | `GET /api/mobile/v1/extrato` | GET | — | — | Refetch sem filtros |
| 3 | Scroll infinito | `GET /api/mobile/v1/extrato?cursor={cursor}` | GET | cursor | hasNextPage | Append resultados |
| 4 | Tap em transação | — | — | — | `status ∈ CONTESTABLE_STATUSES` | router.push contestacao/create com cashback_entry_id e empresa_nome |
| 5 | Focus na tela | Refetch | GET | — | — | useRefreshOnFocus |

> **S4 ALTERAÇÃO**: Tap em transação agora restrito a `CONTESTABLE_STATUSES = {rejeitado, expirado, congelado}`. Antes: todas as transações eram clicáveis. Transações com status `pendente`, `confirmado`, `utilizado` não navegam mais para contestação. Ref Diff: MUDANÇA #28.

### CONTESTABLE_STATUSES (S4)
| Status | Pode contestar? |
|--------|----------------|
| pendente | Não |
| confirmado | Não |
| utilizado | Não |
| rejeitado | **Sim** |
| expirado | **Sim** |
| congelado | **Sim** |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Sem transações | — | "Suas transações de cashback aparecerão aqui." | EmptyState | Persistente |
| Filtro sem resultados | — | "Tente alterar os filtros para ver mais resultados." | EmptyState | Persistente |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Dados | src/services/mobile.cashback.service.ts:24 | getExtrato(params) | GET /extrato com cursor |
| Filtros | src/hooks/useExtratoFilters.ts | useExtratoFilters | setStatus, clearFilters |
| S4-Contest | app/(consumer)/(tabs)/home/extrato.tsx | CONTESTABLE_STATUSES | `{rejeitado, expirado, congelado}` | Ref Diff: MUDANÇA #28 |

---

## 8. HistoricoScreen

### Rota
`(consumer)/home/historico` → `app/(consumer)/(tabs)/home/historico.tsx`

### Condições de Acesso
- Navegação a partir de HomeScreen ("Histórico")
- Tela oculta na tab bar

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/mobile/v1/extrato` | GET | empresa.nome_fantasia, valor_compra, valor_cashback, created_at | useHistorico() — **mapeia para /extrato** [CONFIRMADO — endpoint /historico não existe no backend; mapeamento intencional via `mobileCashbackService.getHistorico()` → `GET /extrato`. Evidência: `src/services/mobile.cashback.service.ts:37-49` (TODO comment + apiClient.get), `MobileExtratoController.php`, testes unitários confirmam rota] |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Título "Histórico de Uso" | Text | Sempre | — | — |
| 2 | Lista HistoricoRow | FlatList | items > 0 | items === 0 | — |
| 3 | SkeletonTransaction (x4) | Componente | isLoading | !isLoading | — |
| 4 | EmptyState | Componente | !isLoading && items === 0 | — | "Sem utilizações" |
| 5 | ActivityIndicator footer | ActivityIndicator | isFetchingNextPage | — | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Scroll infinito | `GET /api/mobile/v1/extrato?cursor={cursor}` | GET | cursor | hasNextPage | Append |
| 2 | Focus na tela | Refetch | GET | — | — | useRefreshOnFocus |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Vazio | — | "Quando você usar cashback em compras, o histórico aparecerá aqui." | EmptyState | Persistente |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Dados | src/services/mobile.cashback.service.ts:39 | getHistorico() | Mapeia para GET /extrato (TODO no código) |

---

## 9. SaldoScreen (Detalhe do Saldo)

### Rota
`(consumer)/saldo/index` → `app/(consumer)/(tabs)/saldo/index.tsx`

### Condições de Acesso
- Tab "Saldo" na barra inferior do consumer
- Ou navegação a partir de HomeScreen (tap no SaldoCard)

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/mobile/v1/saldo` | GET | saldo_total, por_empresa (empresa_id, nome_fantasia, saldo, logo_url), proximo_a_expirar: {valor, quantidade} | useSaldo() |
| `GET /api/mobile/v1/extrato` | GET | Extrato completo com cursor pagination | useExtrato() |

> ⚠️ RESOLVIDO S10: confirmado — campo `proximo_a_expirar` corrigido de `number` para `{valor: string, quantidade: number}` (schema Zod resolvido, S3-E5b B1). Campo `logo_url` adicionado ao `por_empresa` (fonte: S8-E1c §4:#21, código: schema Zod S3-E5b B1)

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | SaldoCard (total) | Componente | saldo carregado | saldoLoading | — |
| 2 | SkeletonCard | Componente | saldoLoading | !saldoLoading | — |
| 3 | "Próximo a expirar" info | Text | proximo_a_expirar.quantidade > 0 | quantidade === 0 | "{quantidade} cashback(s) totalizando R$ {valor}" |
| 4 | "Saldo por empresa" (lista EmpresaRow) | View + FlatList | saldo.por_empresa.length > 0 | sem empresas | — |
| 5 | Logo empresa | Image | logo_url !== null | logo_url === null | Inicial do nome |
| 6 | "Extrato completo" (TransactionRow) | FlatList | entries > 0 | entries === 0 | — |
| 7 | SkeletonTransaction (x4) | Componente | extratoLoading | !extratoLoading | — |
| 8 | EmptyState | Componente | !loading && entries === 0 | — | "Sem movimentações" |

### Regras de Exibição — TransactionRow
| # | Elemento | Condição | Comportamento |
|---|----------|----------|---------------|
| 1 | Cor do valor | status_cashback === "expirado" \|\| "utilizado" | text-red-500 com prefixo "-" |
| 2 | Cor do valor | outros status | text-green-600 com prefixo "+" |

> **S4 ALTERAÇÃO**: Cor para valores negativos mudou de `text-gray-400` para `text-red-500`. Ref Diff: Cross-cutting #8.

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Scroll infinito | `GET /api/mobile/v1/extrato?cursor={cursor}` | GET | cursor | hasNextPage | Append |
| 2 | Focus na tela | Refetch saldo + extrato | GET | — | — | useRefreshOnFocus |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Saldo | src/services/mobile.cashback.service.ts:18 | getSaldo() | GET /saldo |
| Extrato | src/services/mobile.cashback.service.ts:24 | getExtrato() | GET /extrato |
| UI | app/(consumer)/(tabs)/saldo/index.tsx:26 | isNegative | expirado/utilizado → negativo |
| S4-Schema | src/contracts/schemas/cashback.schemas.ts | saldoResponseSchema | proximo_a_expirar: {valor, quantidade} | Ref Diff: S3-E5b B1 |
| S4-Logo | src/contracts/schemas/cashback.schemas.ts | saldoResponseSchema | logo_url: z.string().nullable() | Ref Diff: S3-E5b B1 |
| S4-Color | app/(consumer)/(tabs)/saldo/index.tsx | TransactionRow | text-gray-400 → text-red-500 | Ref Diff: Cross-cutting #8 |

---

## 10. QRCodeScreen (Resgate via QR Code)

### Rota
`(consumer)/qrcode/index` → `app/(consumer)/(tabs)/qrcode/index.tsx`

### Condições de Acesso
- Tab "QR Code" na barra inferior do consumer

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/mobile/v1/utilizacao/lojas` | GET | empresa_id, nome_fantasia, saldo | useLojasComSaldo() |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Título "Resgatar" | Text | step === "select" | step === "qr" | — |
| 2 | ActivityIndicator | View | isLoadingLojas | !isLoadingLojas | — |
| 3 | EmptyState | Componente | lojas.length === 0 | lojas.length > 0 | "Nenhuma loja com saldo" |
| 4 | Lista de lojas (seleção) | TouchableOpacity[] | lojas.length > 0 && step === "select" | step === "qr" | Nenhuma selecionada |
| 5 | Campo "Valor do resgate" | TextInput decimal-pad | selectedLoja !== null | selectedLoja === null | Vazio |
| 6 | Texto "Máx: R$ {saldo}" | Text | selectedLoja | !selectedLoja | — |
| 7 | Erro "Valor excede o saldo" | Text vermelho | valorNum > maxValor | valorNum <= maxValor | — |
| 8 | Botão "GERAR QR CODE" | TouchableOpacity | selectedLoja | !selectedLoja | Desabilitado até canGenerate |
| 9 | QRCodeDisplay + CountdownTimer | Componente | step === "qr" | step === "select" | — |
| 10 | Botão "Gerar Novo" | TouchableOpacity | step === "qr" | step === "select" | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Selecionar loja | — | — | — | — | Border azul + check |
| 2 | Gerar QR Code | `POST /api/mobile/v1/utilizacao/qrcode` | POST | `{ empresa_id, valor }` | valor > 0 && valor <= saldo | Sucesso → exibe QR; Erro → Alert "Não foi possível gerar o QR Code." |
| 3 | QR expirado | — | — | — | — | handleExpire → volta para step "select" |
| 4 | "Gerar Novo" | — | — | — | — | handleReset → limpa estado |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| selectedLoja | not null | Campo valor + botão | Exibe input de valor + botão gerar | — |
| valorNum | > 0 && <= maxValor | Botão gerar | canGenerate = true → bg-blue-600 | Backend valida saldo disponível |
| step | "select" / "qr" | Tela inteira | Troca entre formulário e exibição QR | QR token tem TTL de 5 min no Redis |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Sem saldo | — | "Você ainda não possui cashback disponível para resgate." | EmptyState | Persistente |
| Valor excede | — | "Valor excede o saldo disponível" | Text inline | Persistente |
| Erro ao gerar | — | "Não foi possível gerar o QR Code." | Alert | Até dismiss |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Lojas | src/services/mobile.cashback.service.ts:32 | getLojasComSaldo() | GET /utilizacao/lojas |
| QR | src/services/mobile.qrcode.service.ts:20 | gerarQRCode() | POST /utilizacao/qrcode |
| TTL | src/services/mobile.qrcode.service.ts:17 | comment | "Token is persisted in Redis with TTL (5 min)" |

---

## 11. NotificationsScreen

### Rota
`(consumer)/notifications/index` → `app/(consumer)/(tabs)/notifications/index.tsx`

### Condições de Acesso
- Tab "Alertas" na barra inferior do consumer
- Badge com contagem de não lidas no ícone da tab

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/mobile/v1/notifications` | GET | id, titulo, mensagem, lida, created_at | useNotifications() — cursor pagination |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Título "Notificações (N)" | Text | Sempre | — | Conta unreadCount |
| 2 | Botão "✓ Todas" | TouchableOpacity | unreadCount > 0 | unreadCount === 0 | — |
| 3 | Link "Preferências" | TouchableOpacity | Sempre | — | — |
| 4 | SectionList agrupada por dia | SectionList | notifications.length > 0 | length === 0 | — |
| 5 | EmptyState | Componente | !isLoading && length === 0 | — | "Nenhuma notificação" |
| 6 | ActivityIndicator | View | isLoading | !isLoading | Centralizado |
| 7 | ActivityIndicator footer | ActivityIndicator | isFetchingNextPage | — | — |
| 8 | Badge na tab | View (red badge) | unreadCount > 0 | unreadCount === 0 | "99+" se > 99 |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Tap notificação não lida | `PATCH /api/mobile/v1/notifications/{id}/read` | PATCH | — | notification.lida === false | Marca como lida |
| 2 | Tap "✓ Todas" | `POST /api/mobile/v1/notifications/read-all` | POST | — | unreadCount > 0 | Marca todas como lidas |
| 3 | Tap "Preferências" | — | — | — | — | router.push notifications/preferences |
| 4 | Scroll infinito | `GET /api/mobile/v1/notifications?cursor={cursor}` | GET | cursor | hasNextPage | Append |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Vazio | — | "Você será avisado quando receber cashback, promoções e novidades." | EmptyState | Persistente |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| List | src/services/mobile.notification.service.ts:8 | getNotifications() | GET /notifications |
| Read | src/services/mobile.notification.service.ts:20 | markAsRead(id) | PATCH /notifications/{id}/read |
| All | src/services/mobile.notification.service.ts:25 | markAllAsRead() | POST /notifications/read-all |
| Badge | app/(consumer)/(tabs)/_layout.tsx:49 | ConsumerTabsLayout | unreadCount badge |

---

## 12. NotificationPreferencesScreen

### Rota
`(consumer)/notifications/preferences` → `app/(consumer)/(tabs)/notifications/preferences.tsx`

### Condições de Acesso
- Navegação a partir de NotificationsScreen ("Preferências") ou ProfileScreen ("Preferências de Notificação")
- Tela oculta na tab bar

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/mobile/v1/notifications/preferences` | GET | push, email, marketing (flat booleans) | useNotificationPreferences() |

> **S4 ALTERAÇÃO**: Campos renomeados de `push_enabled`/`email_enabled`/`marketing_enabled` para flat booleans `push`/`email`/`marketing` conforme backend real. Frontend transforma entre formato `{canal, ativo}` e formato flat. Ref Diff: Cross-cutting #9, MUDANÇA #8.

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Título "Preferências" | Text | Sempre | — | — |
| 2 | Toggle "Push Notifications" | Switch | Sempre | — | prefs.push |
| 3 | Toggle "Email" | Switch | Sempre | — | prefs.email |
| 4 | Toggle "Marketing e Promoções" | Switch | Sempre | — | prefs.marketing |
| 5 | ActivityIndicator (tela cheia) | View | isLoading | !isLoading | — |

> **S4 ALTERAÇÃO**: UI significativamente reduzida de 8 toggles (com seções "Canais" e "Categorias") para 3 toggles flat: Push, Email, Marketing&Promoções. Seções de agrupamento removidas. Ref Diff: MUDANÇA #8.

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Toggle qualquer preferência | `PATCH /api/mobile/v1/notifications/preferences` | PATCH | `{ push?: boolean, email?: boolean, marketing?: boolean }` | — | Erro → Alert "Não foi possível atualizar preferência." |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Erro ao atualizar | — | "Não foi possível atualizar preferência." | Alert | Até dismiss |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Get | src/services/mobile.notification.service.ts:33 | getPreferences() | GET /notifications/preferences |
| Update | src/services/mobile.notification.service.ts:38 | updatePreferences() | PATCH /notifications/preferences |
| S4-Flat | src/contracts/schemas/notificacao.schemas.ts | notificacaoConfigSchema | flat booleans: push, email, marketing | Ref Diff: MUDANÇA #8 |
| S4-Transform | src/services/mobile.notification.service.ts | transformPreferences() | Backend flat ↔ Frontend {canal,ativo} | Ref Diff: Cross-cutting #9 |

---

## 13. ProfileScreen

### Rota
`(consumer)/profile/index` → `app/(consumer)/(tabs)/profile/index.tsx`

### Condições de Acesso
- Tab "Perfil" na barra inferior do consumer

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/mobile/v1/auth/me` | GET | nome, email (via authStore.cliente) | Já carregado no AuthGuard |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Avatar (inicial do nome) | View circular | Sempre | — | Primeira letra do nome |
| 2 | Nome + email | Text | Sempre | — | "—" se null |
| 3 | Menu "Editar Perfil" | MenuRow | Sempre | — | — |
| 4 | Menu "Alterar Senha" | MenuRow | Sempre | — | — |
| 5 | Menu "Preferências de Notificação" | MenuRow | Sempre | — | — |
| 6 | Toggle Biometria | Switch + label | biometricAvailable === true | biometricAvailable === false | biometricEnrolled |
| 7 | ThemeToggle | Componente | Sempre | — | Tema atual |
| 8 | Menu "Política de Privacidade" | MenuRow | Sempre | — | — |
| 9 | Botão "Sair" | TouchableOpacity | Sempre | — | Texto vermelho |
| 10 | Link "Excluir Conta" | TouchableOpacity | Sempre | — | Texto vermelho menor |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Tap "Editar Perfil" | — | — | — | — | router.push profile/edit |
| 2 | Tap "Alterar Senha" | — | — | — | — | router.push profile/change-password |
| 3 | Tap "Preferências" | — | — | — | — | router.push notifications/preferences |
| 4 | Toggle Biometria ON | `POST /api/mobile/v1/auth/biometric/enroll` | POST | biometric data | biometricAvailable | Sucesso → enrolled; Erro → Alert "Não foi possível ativar a biometria." |
| 5 | Toggle Biometria OFF | `POST /api/mobile/v1/auth/biometric/unenroll` | POST | `{ device_id }` | biometricEnrolled | Sucesso → setBiometricEnrolled(false); Erro → Alert "Não foi possível desativar a biometria." |
| 6 | Tap "Sair" | `POST /api/mobile/v1/auth/logout` | POST | — | — | Alert confirmação → clearTokens → router.replace login |
| 7 | Tap "Excluir Conta" | — | — | — | — | router.push profile/delete-account |
| 8 | Tap "Política de Privacidade" | — | — | — | — | router.push (shared)/privacy-policy |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Toggle Biometria | Hardware não suporta | — | biometricAvailable === false (profile/index.tsx:93) |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Confirmar logout | — | "Deseja realmente sair da conta?" | Alert com "Cancelar" / "Sair" | Até dismiss |
| Erro biometria | — | "Não foi possível ativar a biometria." | Alert | Até dismiss |

> **S4 ALTERAÇÃO**: Toggle Biometria OFF agora chama `unenroll()` API em vez de apenas limpar estado local. Endpoint novo: `POST /api/mobile/v1/auth/biometric/unenroll` com payload `{ device_id }` (max:255). Ref Diff: MUDANÇA #26, S2-E5 C1.

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Me | src/services/mobile.auth.service.ts:54 | me() | GET /auth/me |
| Logout | src/services/mobile.auth.service.ts:38 | logout() | POST /auth/logout + clearTokens |
| Bio-ON | src/services/mobile.auth.service.ts:97 | enrollBiometric() | POST /auth/biometric/enroll |
| Bio-OFF | src/services/mobile.auth.service.ts:103 | unenrollBiometric() | POST /auth/biometric/unenroll (NOVO) |
| Store | src/stores/auth.store.ts:37 | logout() | mobileAuthService.logout + reset state |
| S4-Unenroll | src/services/mobile.auth.service.ts | unenrollBiometric() | POST /auth/biometric/unenroll + device_id | Ref Diff: MUDANÇA #26, S2-E5 C1 |

---

## 14. EditProfileScreen

### Rota
`(consumer)/profile/edit` → `app/(consumer)/(tabs)/profile/edit.tsx`

### Condições de Acesso
- Navegação a partir de ProfileScreen ("Editar Perfil")

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | cliente.nome, cliente.email, cliente.telefone (via authStore) | Já carregado |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Campo Nome | TextInput | Sempre | — | cliente.nome |
| 2 | Campo Email | TextInput email-address | Sempre | — | cliente.email |
| 3 | Campo Telefone | TextInput phone-pad | Sempre | — | cliente.telefone |
| 4 | Botão "Salvar" | TouchableOpacity | Sempre | — | Habilitado |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Submit | `PATCH /api/mobile/v1/auth/profile` | PATCH | `{ nome?, email?, telefone? }` | Zod: nome min 3 (opt), email válido (opt), telefone min 10 (opt) | Sucesso → Alert "Perfil atualizado!" + router.back(); Erro → Alert "Não foi possível atualizar o perfil." |

### Validações (Zod — `updateProfileSchema`)
| Campo | Regra | Mensagem |
|-------|-------|----------|
| nome | `z.string().min(3).optional()` | "Nome deve ter no mínimo 3 caracteres" |
| email | `z.string().email().optional()` | "E-mail inválido" |
| telefone | `z.string().min(10).optional()` | "Telefone inválido" |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1 | src/services/mobile.auth.service.ts:79 | updateProfile() | PATCH /auth/profile |
| Val | src/schemas/auth.ts:31-35 | updateProfileSchema | — |

---

## 15. ChangePasswordScreen

### Rota
`(consumer)/profile/change-password` → `app/(consumer)/(tabs)/profile/change-password.tsx`

### Condições de Acesso
- Navegação a partir de ProfileScreen ("Alterar Senha")

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Nenhum (formulário vazio) | — |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Campo "Senha Atual" | TextInput secureTextEntry | Sempre | — | Vazio |
| 2 | Campo "Nova Senha" | TextInput secureTextEntry | Sempre | — | Vazio |
| 3 | Campo "Confirmar Nova Senha" | TextInput secureTextEntry | Sempre | — | Vazio |
| 4 | Botão "Alterar Senha" | TouchableOpacity | Sempre | — | Habilitado |

> **S4 ALTERAÇÃO (CAMPO NOVO)**: Campo `nova_senha_confirmation` adicionado com validação `.refine()` para garantir que senhas coincidem. Ref Diff: MUDANÇA #57.

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Submit | `PATCH /api/mobile/v1/auth/password` | PATCH | `{ senha_atual, nova_senha, nova_senha_confirmation }` | Zod: senha_atual min 1, nova_senha min 8, confirmation match | Sucesso → Alert "Senha alterada com sucesso!" + router.back(); Erro → Alert "Senha atual incorreta." | ⚠️ ATUALIZADO S11: min 6→min 8 — Ref S9-E2 B1 |

### Validações (Zod — `changePasswordSchema`)
| Campo | Regra | Mensagem |
|-------|-------|----------|
| senha_atual | `z.string().min(1)` | "Senha atual é obrigatória" |
| nova_senha | `z.string().min(8)` | "Nova senha deve ter no mínimo 8 caracteres" | ⚠️ ATUALIZADO S11: min(6)→min(8) — Ref S9-E2 B1 |
| nova_senha_confirmation | `.refine(nova_senha === nova_senha_confirmation)` | "Senhas não conferem" |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1 | src/services/mobile.auth.service.ts:86 | changePassword() | PATCH /auth/password |
| Val | src/schemas/auth.ts:37-42 | changePasswordSchema | z.object + .refine |
| S4-Confirm | src/schemas/auth.ts | changePasswordSchema | nova_senha_confirmation .refine() | Ref Diff: MUDANÇA #57 |

---

## 16. DeleteAccountScreen (LGPD)

### Rota
`(consumer)/profile/delete-account` → `app/(consumer)/(tabs)/profile/delete-account.tsx`

### Condições de Acesso
- Navegação a partir de ProfileScreen ("Excluir Conta")

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Nenhum | — |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Título "Excluir Conta" (vermelho) | Text | Sempre | — | — |
| 2 | Texto explicativo LGPD | Text | Sempre | — | — |
| 3 | Campo "Confirme sua senha" | TextInput secureTextEntry | Sempre | — | Vazio |
| 4 | Campo "Motivo" (opcional) | TextInput multiline | Sempre | — | Vazio |
| 5 | Botão "Excluir Minha Conta" | TouchableOpacity bg-red-600 | Sempre | — | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Submit | — | — | — | Zod: senha min 1, motivo opcional | **Dupla confirmação:** Alert "Esta ação é irreversível..." com "Cancelar" / "Excluir Permanentemente" |
| 2 | Confirmar exclusão | `DELETE /api/mobile/v1/auth/delete-account` | DELETE | `{ senha, motivo? }` | — | Sucesso → Alert "Conta Excluída" → router.replace login; Erro → Alert "Não foi possível excluir a conta. Verifique sua senha." |

### Validações (Zod — `deleteAccountSchema`)
| Campo | Regra | Mensagem |
|-------|-------|----------|
| senha | `z.string().min(1)` | "Senha é obrigatória" |
| motivo | `z.string().optional()` | — |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Confirmação | — | "Esta ação é irreversível. Todos os seus dados serão removidos permanentemente. Deseja continuar?" | Alert destrutivo | Até dismiss |
| Sucesso | — | "Sua conta foi excluída com sucesso." | Alert | Até dismiss → login |
| Erro | — | "Não foi possível excluir a conta. Verifique sua senha." | Alert | Até dismiss |

> **S4 ALTERAÇÃO**: Método HTTP corrigido de `POST` para `DELETE` conforme backend real. Ref Diff: S2-E5 C2, S4-E1 Endpoint #6.

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1-2 | src/services/mobile.auth.service.ts:91 | deleteAccount() | DELETE /auth/delete-account + clearTokens |
| Val | src/schemas/auth.ts:42-45 | deleteAccountSchema | — |
| LGPD | app/(consumer)/(tabs)/profile/delete-account.tsx:31 | comment | "Double confirmation as required by LGPD compliance" |
| S4-Method | src/services/mobile.auth.service.ts | deleteAccount() | POST → DELETE | Ref Diff: S2-E5 C2 |

---

## 17. ContestacaoListScreen

### Rota
`(consumer)/contestacao/index` → `app/(consumer)/contestacao/index.tsx`

### Condições de Acesso
- Navegação a partir de HomeScreen ("Contestações")
- Stack screen com header "Contestações"

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/mobile/v1/contestacoes` | GET | id, empresa_id, empresa_nome, tipo, descricao, status, resposta, valor, created_at | useContestacoes() — cursor pagination |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Título "Contestações" + subtítulo | Text | Sempre | — | — |
| 2 | FilterChips (status) | Componente | Sempre | — | Nenhum selecionado (todas) |
| 3 | Botão "Nova" | TouchableOpacity bg-blue-600 | Sempre | — | — |
| 4 | Lista ContestacaoRow | FlatList | filteredItems > 0 | filteredItems === 0 | — |
| 5 | StatusBadge por contestação | Componente | Sempre por item | — | Cor conforme status |
| 6 | Labels de tipo | Record mapeado | Sempre por item | — | Ex: "Cashback não gerado" |
| 7 | Bloco "Resposta" | View bg-gray-50 | item.resposta existe | !item.resposta | — |
| 8 | SkeletonTransaction (x3) | Componente | isLoading | !isLoading | — |
| 9 | EmptyState | Componente | !isLoading && filteredItems === 0 | — | "Sem contestações" |

> **S4 ALTERAÇÃO (CAMPO NOVO)**: FilterChips adicionados com opções `pendente/aprovada/rejeitada`. Filtro é **client-side** (dados já carregados, filtragem local). Ref Diff: MUDANÇA #29.

### Filtros e Ordenação (S4)
| Filtro | Opções | Padrão | Tipo |
|--------|--------|--------|------|
| status | pendente, aprovada, rejeitada | Nenhum (todas) | FilterChips client-side |

### Labels de Tipo
| Tipo (enum) | Label PT-BR |
|-------------|-------------|
| cashback_nao_gerado | Cashback não gerado |
| valor_incorreto | Valor incorreto |
| expiracao_indevida | Expiração indevida |
| venda_cancelada | Venda cancelada |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Selecionar filtro status | — | — | — | — | Filtra lista client-side |
| 2 | Tap "Nova" | — | — | — | — | router.push contestacao/create |
| 3 | Scroll infinito | `GET /api/mobile/v1/contestacoes?page={n}` | GET | page | hasNextPage | Append |
| 4 | Focus na tela | Refetch | GET | — | — | useRefreshOnFocus |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| List | src/services/mobile.contestacao.service.ts:14 | list(params) | GET /contestacoes |
| S4-Filter | app/(consumer)/contestacao/index.tsx | FilterChips | pendente/aprovada/rejeitada, client-side | Ref Diff: MUDANÇA #29 |

---

## 18. CreateContestacaoScreen

### Rota
`(consumer)/contestacao/create` → `app/(consumer)/contestacao/create.tsx`

### Condições de Acesso
- Navegação a partir de ContestacaoListScreen ("Nova") ou ExtratoScreen (tap em transação)
- Recebe params: `cashback_entry_id` e `empresa_nome` (opcionais)

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Params de navegação: cashback_entry_id, empresa_nome | useLocalSearchParams |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Título "Nova Contestação" | Text | Sempre | — | — |
| 2 | Subtítulo "Transação em: {empresa_nome}" | Text | params.empresa_nome existe | !empresa_nome | — |
| 3 | ContestacaoForm | Componente | Sempre | — | transacaoId preenchido |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Submit contestação | `POST /api/mobile/v1/contestacoes` | POST | `{ transacao_id, tipo, descricao }` | Zod: transacao_id required, tipo enum, descricao min 10 max 500 | Sucesso → Alert "Contestação enviada" + router.back(); Erro → Alert "Não foi possível enviar a contestação." |

### Validações (Zod — `createContestacaoSchema`)
| Campo | Regra | Mensagem |
|-------|-------|----------|
| transacao_id | `z.number({ required_error })` | "Selecione uma transação" |
| tipo | `z.enum(["cashback_nao_gerado", "valor_incorreto", "expiracao_indevida", "venda_cancelada"])` | "Selecione o tipo da contestação" |
| descricao | `z.string().min(10).max(500)` | "Descreva o problema com pelo menos 10 caracteres" / "Máximo de 500 caracteres" |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Sucesso | — | "Acompanhe o status na lista de contestações." | Alert título "Contestação enviada" | Até dismiss |
| Erro | — | "Não foi possível enviar a contestação. Tente novamente." | Alert | Até dismiss |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Create | src/services/mobile.contestacao.service.ts:20 | create(data) | POST /contestacoes |
| Val | src/schemas/contestacao.ts:3-12 | createContestacaoSchema | z.object |

---

## 19. MerchantDashboardScreen

### Rota
`(merchant)/dashboard` → `app/(merchant)/(tabs)/dashboard.tsx`

### Condições de Acesso
- Usuário autenticado como **merchant/lojista** (tipo_global: lojista)
- Tab "Dashboard" na barra inferior do merchant
- Header exibe `empresaAtiva.nome_fantasia` via multilojaStore

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/v1/dashboard/stats` | GET | total_cashback, total_creditado, total_resgatado, variacao_* | useDashboardStats() |
| `GET /api/v1/dashboard/transacoes` | GET | id, cliente_nome, tipo, valor, created_at (últimas 5) | useDashboardTransacoes() |
| `GET /api/v1/dashboard/top-clientes` | GET | id, nome, saldo_total (top 3) | useDashboardTopClientes() |
| `GET /api/v1/dashboard/chart` | GET | data, gerado, utilizado (série temporal) | useDashboardChart("7d") |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | StatsCards horizontal | ScrollView horizontal | stats carregado | loadingStats | 3 cards: Total, Creditado, Resgatado |
| 2 | Skeleton cards (x3) | View | loadingStats | !loadingStats | — |
| 3 | Period selector chips | Componente | Sempre | — | "7d" selecionado |
| 4 | DashboardChart | Componente | chartData carregado | loadingChart | Período dinâmico via `chartPeriod` state |
| 5 | "Últimas Transações" (máx 5) | View lista | transacoes > 0 | transacoes === 0 | — |
| 6 | EmptyState transações | Componente | transacoes.length === 0 | — | "Gere seu primeiro cashback!" |
| 7 | "Top Clientes" (máx 3) | View lista | topClientes > 0 | topClientes === 0 | — |
| 8 | EmptyState clientes | Componente | topClientes.length === 0 | — | "Seus top clientes aparecerão aqui." |

> **S4 ALTERAÇÃO (CAMPO NOVO)**: Period selector chips adicionados: 7d/30d/90d. State `chartPeriod` agora é dinâmico (era fixo "7d"). Chart refetch ao mudar período. Ref Diff: MUDANÇA #58.

### Cores por tipo de transação
| Tipo | Cor | Prefixo |
|------|-----|---------|
| gerado | text-green-600 | + |
| utilizado | text-purple-600 | - |
| cancelado | text-yellow-600 | ~ |

### Filtros e Ordenação (S4)
| Filtro | Opções | Padrão | Tipo |
|--------|--------|--------|------|
| chartPeriod | 7d, 30d, 90d | **7d** | Period selector chips |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Pull to refresh | Invalidate queries ["merchant", "dashboard"] | — | — | — | RefreshControl |
| 2 | Mudar período do chart | `GET /api/v1/dashboard/chart?period={p}` | GET | period | — | Refetch chartData |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Stats | src/services/merchant.management.service.ts:21 | getStats() | GET /dashboard/stats |
| Tx | src/services/merchant.management.service.ts:26 | getTransacoes() | GET /dashboard/transacoes |
| Top | src/services/merchant.management.service.ts:33 | getTopClientes() | GET /dashboard/top-clientes |
| Chart | src/services/merchant.management.service.ts:40 | getChart(period) | GET /dashboard/chart |
| S4-Period | app/(merchant)/(tabs)/dashboard.tsx | chartPeriod state | 7d/30d/90d selector dinâmico | Ref Diff: MUDANÇA #58 |

---

## 20. CashbackMenuScreen (Cashback Index)

### Rota
`(merchant)/cashback/index` → `app/(merchant)/(tabs)/cashback/index.tsx`

### Condições de Acesso
- Tab "Cashback" na barra inferior do merchant

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Conteúdo estático (3 opções de menu) | — |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Card "Gerar Cashback" | TouchableOpacity | Sempre | — | — |
| 2 | Card "Utilizar Cashback" | TouchableOpacity | Sempre | — | — |
| 3 | Card "Escanear QR Code" | TouchableOpacity | Sempre | — | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Tap "Gerar Cashback" | — | — | — | — | router.push cashback/gerar |
| 2 | Tap "Utilizar Cashback" | — | — | — | — | router.push cashback/utilizar |
| 3 | Tap "Escanear QR Code" | — | — | — | — | router.push cashback/qr-scan |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Menu | app/(merchant)/(tabs)/cashback/index.tsx:4 | MENU_ITEMS | Array estático de 3 itens |

---

## 21. GerarCashbackScreen

### Rota
`(merchant)/cashback/gerar` → `app/(merchant)/(tabs)/cashback/gerar.tsx`

### Condições de Acesso
- Navegação a partir de CashbackMenuScreen ("Gerar Cashback")

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/v1/clientes?search={cpf}` | GET | cpf, nome, id (busca por CPF) | useClienteSearch() |
| `GET /api/v1/clientes/{id}/saldo` | GET | saldo | Após selecionar cliente |
| `GET /api/v1/campanhas?status=ativa` | GET | id, nome, percentual | useCampanhas() — **apenas ativas** |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | CPFSearchInput | Componente | step === "form" | step !== "form" | — |
| 2 | Campo "Valor da compra" | TextInput decimal-pad | selectedCliente !== null | !selectedCliente | Vazio |
| 3 | Lista de campanhas (opcional) | Chip selectable | campanhas.length > 0 && selectedCliente | !selectedCliente | Nenhuma selecionada |
| 4 | Resumo (valor, percentual, cashback) | View | valorNum > 0 | valorNum === 0 | — |
| 5 | Botão "GERAR CASHBACK" | Text styled | selectedCliente | !selectedCliente | Desabilitado até canConfirm |
| 6 | CashbackConfirmation | Componente | step === "confirm" | step !== "confirm" | — |
| 7 | Tela de sucesso | View | step === "success" | step !== "success" | Valor gerado + nome do cliente |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Buscar cliente por CPF | `GET /api/v1/clientes?search={cpf}` | GET | query param | — | Lista de resultados |
| 2 | Selecionar cliente | — | — | — | — | Exibe campos de valor |
| 3 | Selecionar campanha | — | — | — | — | Altera percentual no resumo |
| 4 | Tap "GERAR CASHBACK" | — | — | — | selectedCliente && valorNum > 0 | Vai para step "confirm" |
| 5 | Confirmar geração | `POST /api/v1/cashback` | POST | `{ cpf, valor_compra, campanha_id? }` | — | Sucesso → step "success"; Erro → Alert |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| selectedCliente | not null | Seções valor + campanha | Exibe campos | — |
| selectedCampanha | Campanha | Resumo percentual | Usa campanha.percentual; se null, padrão 5% | Backend pode usar % da empresa |
| valorNum | > 0 | Resumo cashback | cashbackValor = valorNum * (percentual / 100) | Backend recalcula |

### Validações (Zod — `gerarCashbackMerchantSchema`) (S4)

> **S4 ALTERAÇÃO (REGRA NOVA)**: Validação Zod `gerarCashbackMerchantSchema` adicionada com `safeParse()`. Errors exibidos inline nos campos. Ref Diff: MUDANÇA #30.

| Campo | Regra | Mensagem |
|-------|-------|----------|
| cpf | `z.string().length(11).refine(isValidCPF)` | "CPF inválido" |
| valor_compra | `z.number().positive()` | "Valor deve ser maior que zero" |
| campanha_id | `z.number().optional()` | — |

### Segurança
- **Idempotency-Key** enviado no header para evitar duplicação: `${Date.now()}-${random}` (merchant.cashback.service.ts:38)

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Sucesso | — | "Cashback gerado!" + valor + "Confirma em ~24h" | Tela success | Persistente |
| Erro | — | "Não foi possível gerar o cashback. Tente novamente." | Alert | Até dismiss |
| Validação Zod | — | Mensagens inline por campo | Text inline vermelho | Persistente |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Search | src/services/merchant.cashback.service.ts:16 | searchCliente(cpf) | GET /clientes?search= |
| Campanhas | src/services/merchant.cashback.service.ts:28 | getCampanhas() | GET /campanhas?status=ativa |
| Gerar | src/services/merchant.cashback.service.ts:35 | gerarCashback() | POST /cashback + Idempotency-Key |
| S4-Zod | src/contracts/schemas/cashback.schemas.ts | gerarCashbackMerchantSchema | safeParse() + inline errors | Ref Diff: MUDANÇA #30 |

---

## 22. UtilizarCashbackScreen

### Rota
`(merchant)/cashback/utilizar` → `app/(merchant)/(tabs)/cashback/utilizar.tsx`

### Condições de Acesso
- Navegação a partir de CashbackMenuScreen ("Utilizar Cashback")

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/v1/clientes?search={cpf}` | GET | cpf, nome, id | useClienteSearch() |
| `GET /api/v1/clientes/{id}/saldo` | GET | saldo | useClienteSaldo(selectedCliente.id) |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | CPFSearchInput | Componente | step === "form" | step !== "form" | — |
| 2 | Card "Saldo disponível" | View bg-blue-50 | selectedCliente && saldoData | — | R$ {saldo} |
| 3 | Campo "Valor da compra" | TextInput decimal-pad | selectedCliente | !selectedCliente | Vazio |
| 4 | Resumo FEFO | View | valorNum > 0 | valorNum === 0 | — |
| 5 | Botão "CONFIRMAR RESGATE" | Text styled | Sempre (quando cliente selecionado) | — | Desabilitado até canConfirm |
| 6 | CashbackConfirmation | Componente | step === "confirm" | step !== "confirm" | — |
| 7 | Tela de sucesso | View | step === "success" | step !== "success" | Valor usado + novo saldo |

### Regras de Negócio — Cálculo FEFO
| # | Regra | Fórmula | Origem |
|---|-------|---------|--------|
| 1 | Cashback usado | `Math.min(valorNum, saldoDisponivel)` | utilizar.tsx:29 |
| 2 | Valor em dinheiro | `Math.max(0, valorNum - cashbackUsado)` | utilizar.tsx:30 |
| 3 | Novo saldo | `Math.max(0, saldoDisponivel - cashbackUsado)` | utilizar.tsx:174 |
| 4 | Pode confirmar | `selectedCliente && valorNum > 0 && saldoDisponivel > 0` | utilizar.tsx:32 |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Buscar cliente por CPF | `GET /api/v1/clientes?search={cpf}` | GET | — | — | Lista resultados |
| 2 | Tap "CONFIRMAR RESGATE" | — | — | — | canConfirm | Vai para step "confirm" |
| 3 | Confirmar utilização | `POST /api/v1/cashback/utilizar` | POST | `{ cpf, valor_compra }` | — | Sucesso → step "success"; Erro → Alert |

### Segurança
- **Idempotency-Key** no header: `${Date.now()}-${random}` (merchant.cashback.service.ts:48)

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Sucesso | — | "Resgate realizado!" + valor + "Novo saldo: R$ X" | Tela success | Persistente |
| Erro | — | "Não foi possível utilizar o cashback. Tente novamente." | Alert | Até dismiss |

> **S4 ALTERAÇÃO**: CPF validation no CPFSearchInput agora utiliza `isValidCPF` com algoritmo Mod-11 (indireto via #56), além da validação de comprimento. Ref Diff: MUDANÇA #56.

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Saldo | src/services/merchant.cashback.service.ts:23 | getClienteSaldo() | GET /clientes/{id}/saldo |
| Utilizar | src/services/merchant.cashback.service.ts:45 | utilizarCashback() | POST /cashback/utilizar + Idempotency-Key |
| S4-CPF | src/utils/validators.ts | isValidCPF() | Mod-11 validation via CPFSearchInput | Ref Diff: MUDANÇA #56 |

---

## 23. QRScanScreen

### Rota
`(merchant)/cashback/qr-scan` → `app/(merchant)/(tabs)/cashback/qr-scan.tsx`

### Condições de Acesso
- Navegação a partir de CashbackMenuScreen ("Escanear QR Code")
- **Requer permissão da câmera**

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Camera permission status | useCamera() |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | PermissionRequest | Componente | status !== "granted" | status === "granted" | — |
| 2 | Camera preview (placeholder) | View bg-black | step === "scan" && granted | step !== "scan" | Quadrado guia 264x264 |
| 3 | Botão "Simular Scan" | TouchableOpacity | step === "scan" **&& __DEV__** | step !== "scan" \|\| !__DEV__ | — |
| 4 | Card "QR Válido" + dados | View | step === "result" | step !== "result" | Cliente, valor, saldo |
| 5 | CountdownTimer | Componente | step === "result" | step !== "result" | Tempo restante do token |
| 6 | Botão "CONFIRMAR RESGATE" | TouchableOpacity bg-green-600 | step === "result" | step !== "result" | — |
| 7 | Tela de sucesso | View | step === "success" | step !== "success" | Valor + nome cliente |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Solicitar permissão câmera | — | — | — | — | PermissionRequest com botão |
| 2 | Scan QR code | `POST /api/v1/qrcode/validate` | POST | `{ qr_token }` | — | Sucesso → step "result"; Erro → Alert "QR Inválido" |
| 3 | Confirmar resgate | `POST /api/v1/cashback/utilizar` | POST | `{ cpf, valor_compra }` | — | Sucesso → step "success"; Erro → Alert |
| 4 | QR expirado (timer) | — | — | — | — | handleReset → volta para scan |
| 5 | "Escanear outro" | — | — | — | — | handleReset |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Permissão câmera | — | "Precisamos acessar sua câmera para escanear o QR Code do cliente." | PermissionRequest | Persistente |
| QR inválido | — | "O código não é válido ou já expirou." | Alert título "QR Inválido" | Até dismiss |
| Erro resgate | — | "Não foi possível confirmar o resgate." | Alert | Até dismiss |
| Sucesso | — | "Resgate realizado!" + valor + cliente | Tela success | Persistente |

> **S4 ALTERAÇÃO**: Botão "Simular Scan" agora visível apenas em modo desenvolvimento (`__DEV__`). Em produção, o botão não é renderizado. Ref Diff: MUDANÇA #5.

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Validate | src/services/mobile.qrcode.service.ts:29 | validarQRCode() | POST /qrcode/validate |
| Utilizar | src/services/merchant.cashback.service.ts:45 | utilizarCashback() | POST /cashback/utilizar |
| Camera | src/hooks/useCamera.ts | useCamera() | expo-camera permission |
| S4-Dev | app/(merchant)/(tabs)/cashback/qr-scan.tsx | Simular Scan | Condicionado a __DEV__ | Ref Diff: MUDANÇA #5 |

---

## 24. ClientesScreen (Merchant)

### Rota
`(merchant)/clientes/index` → `app/(merchant)/(tabs)/clientes/index.tsx`

### Condições de Acesso
- Tab "Clientes" na barra inferior do merchant

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/v1/clientes` | GET | id, nome, cpf, saldo, cashbacks_ativos | useClienteSearchDebounced() — paginação offset |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | SearchBar | Componente | Sempre | — | Vazio, placeholder "Buscar por nome ou CPF..." |
| 2 | Contador resultados | Text | search não vazio | search vazio | "{N} resultado(s)" |
| 3 | Lista clientes | FlatList | clientes.length > 0 | length === 0 | — |
| 4 | Skeleton | Componente | isLoading | !isLoading | — |
| 5 | EmptyState | Componente | !isLoading && length === 0 | — | Mensagem dinâmica |
| 6 | Paginação (Anterior/Próxima) | View | totalPages > 1 | totalPages <= 1 | Página 1 |
| 7 | ActivityIndicator (canto) | View absolute | isFetching && !isLoading | — | — |

### Filtros e Ordenação
| Filtro | Tipo | Padrão |
|--------|------|--------|
| search (nome ou CPF) | SearchBar com debounce | Vazio |
| page | Paginação offset | 1 |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Digitar busca | `GET /api/v1/clientes?search={text}&page=1` | GET | search, page | Debounce | Refetch |
| 2 | Tap em cliente | — | — | — | — | router.push clientes/{id} |
| 3 | Navegar páginas | `GET /api/v1/clientes?page={n}` | GET | page | — | Atualiza lista |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| List | src/services/merchant.management.service.ts:48 | getClientes() | GET /clientes |

---

## 25. ClienteDetailScreen

### Rota
`(merchant)/clientes/[id]` → `app/(merchant)/(tabs)/clientes/[id].tsx`

### Condições de Acesso
- Navegação a partir de ClientesScreen (tap em cliente)

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/v1/clientes/{id}` | GET | id, nome, cpf, email, telefone, saldo, cashbacks_ativos, created_at | useClienteDetail(id) |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Avatar + nome + CPF | Header | cliente carregado | — | — |
| 2 | Email | Text | cliente.email existe | !email | — |
| 3 | Telefone | Text | cliente.telefone existe | !telefone | — |
| 4 | MetricCard "Saldo Atual" | Componente | Sempre | — | R$ formatado |
| 5 | MetricCard "Cashbacks Ativos" | Componente | Sempre | — | Número |
| 6 | Info "Cliente desde" | InfoRow | Sempre | — | Data formatada |
| 7 | Info "ID" | InfoRow | Sempre | — | Número |
| 8 | ActivityIndicator (tela cheia) | View | isLoading | !isLoading | — |
| 9 | Tela de erro | View | error \|\| !cliente | — | "Cliente não encontrado" |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Detail | src/services/merchant.management.service.ts:60 | getCliente(id) | GET /clientes/{id} |

---

## 26. MoreMenuScreen (Merchant Mais)

### Rota
`(merchant)/more/index` → `app/(merchant)/(tabs)/more/index.tsx`

### Condições de Acesso
- Tab "Mais" na barra inferior do merchant

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | isMultiloja() via multilojaStore, perfil via authStore | Já carregado |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Menu "Campanhas" | TouchableOpacity | perfil ∈ {proprietario, gestor, operador} | perfil === vendedor | — |
| 2 | Menu "Vendas" | TouchableOpacity | perfil ∈ {proprietario, gestor, operador, vendedor} | — | — |
| 3 | Menu "Contestações" | TouchableOpacity | perfil ∈ {proprietario, gestor, operador} | perfil === vendedor | — |
| 4 | Menu "Relatórios" | TouchableOpacity | perfil ∈ {proprietario, gestor} | perfil ∈ {operador, vendedor} | — |
| 5 | Menu "Configurações" | TouchableOpacity | perfil ∈ {proprietario, gestor} | perfil ∈ {operador, vendedor} | — |
| 6 | Menu "Trocar empresa" | TouchableOpacity | **isMultiloja() === true** | isMultiloja() === false | — |
| 7 | Menu "Política de Privacidade" | TouchableOpacity | Sempre | — | — |
| 8 | Botão "Sair" | TouchableOpacity bg-red-50 | Sempre | — | — |

> ⚠️ RESOLVIDO S10: confirmado — role-based menu gating implementado. Visibilidade controlada pelo `perfil` do merchant (fonte: S8-E1c §4:#22, código: perfil-based visibility, S2-E5 Impl#2)

### Role-Gating por Perfil (S4, corrigido S5-E7c)
| Menu Item | proprietario | gestor | operador | vendedor |
|-----------|:---:|:---:|:---:|:---:|
| Campanhas | ✅ | ✅ | ✅ | ❌ |
| Vendas | ✅ | ✅ | ✅ | ✅ |
| Contestações | ✅ | ✅ | ✅ | ❌ |
| Relatórios | ✅ | ✅ | ❌ | ❌ |
| Configurações | ✅ | ✅ | ❌ | ❌ |
| Trocar empresa | ✅* | ✅* | ✅* | ✅* |
| Política de Privacidade | ✅ | ✅ | ✅ | ✅ |
| Sair | ✅ | ✅ | ✅ | ✅ |

> **S5-E7c CORREÇÃO**: Tabela corrigida conforme código-fonte (`app/(merchant)/(tabs)/more/index.tsx:10-16`) e backend (`routes/api.php` middleware `check.perfil`). Divergências do S4: Campanhas e Contestações incluem `operador` (backend confirma `check.perfil:proprietario,gestor,operador`); Vendas inclui `vendedor` (backend `check.perfil:proprietario,gestor,operador,vendedor`); Configurações inclui `gestor` (backend `GET/PATCH /config` → `check.perfil:proprietario,gestor`).

\* Condicionado a `isMultiloja() === true`

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Tap cada menu | — | — | — | Role-gating | router.push para tela correspondente |
| 2 | Tap "Trocar empresa" | — | — | — | isMultiloja | router.push multiloja |
| 3 | Tap "Sair" | `POST /api/mobile/v1/auth/logout` | POST | — | — | Alert confirmação → logout → login |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| "Trocar empresa" | Merchant com apenas 1 empresa | Merchant single-loja | isMultiloja() === false (more/index.tsx:52) |
| "Campanhas" | Perfil sem acesso | operador, vendedor | Role-gating (S4) |
| "Contestações" | Perfil sem acesso | operador, vendedor | Role-gating (S4) |
| "Relatórios" | Perfil sem acesso | operador, vendedor | Role-gating (S4) |
| "Configurações" | Perfil sem acesso | gestor, operador, vendedor | Role-gating (S4) |
| "Vendas" | Perfil sem acesso | vendedor | Role-gating (S4) |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Menu | app/(merchant)/(tabs)/more/index.tsx:6 | MENU_ITEMS | Array com role-gating |
| Multi | src/stores/multiloja.store.ts:9 | isMultiloja() | empresas.length > 1 |
| S4-Role | app/(merchant)/(tabs)/more/index.tsx | role-gating | proprietario=all, gestor=parcial, operador=limitado, vendedor=mínimo | Ref Diff: S2-E5 Impl#2 |

---

## 27. CampanhasScreen (Merchant)

### Rota
`(merchant)/more/campanhas` → `app/(merchant)/(tabs)/more/campanhas.tsx`

### Condições de Acesso
- Navegação a partir de MoreMenuScreen ("Campanhas")

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/v1/campanhas?status={status}` | GET | id, nome, percentual, validade_padrao, data_inicio, data_fim, status, transacoes_count | useCampanhasList(statusFilter) |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | FilterChips (status) | Componente | Sempre | — | Nenhum selecionado |
| 2 | Lista campanhas | FlatList | campanhas.length > 0 | length === 0 | — |
| 3 | StatusBadge por campanha | View + Text | Sempre por item | — | Cor conforme status |
| 4 | Botões "Editar" / "Excluir" | TouchableOpacity[] | Sempre por item | — | — |
| 5 | FAB "+" (Nova campanha) | TouchableOpacity absolute | Sempre | — | Canto inferior direito |
| 6 | EmptyState | Componente | length === 0 | length > 0 | "Crie sua primeira campanha" |
| 7 | Modal criar/editar | Modal | modalVisible | !modalVisible | — |

### Filtros e Ordenação
| Filtro | Opções | Padrão | Tipo |
|--------|--------|--------|------|
| status | ativa, inativa, finalizada | Nenhum (todas) | FilterChips |

> **S4 ALTERAÇÃO**: Status `encerrada` → `finalizada` em todo o código (9 arquivos backend migrados). Ref Diff: S2-E5 C4.

### Cores de Status (Campanhas)
| Status | Background | Texto |
|--------|-----------|-------|
| ativa | bg-green-100 | text-green-700 |
| inativa | bg-gray-100 | text-gray-600 |
| finalizada | bg-red-100 | text-red-600 |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Filtrar por status | `GET /api/v1/campanhas?status={s}` | GET | query param (ativa/inativa/finalizada) | — | Refetch |
| 2 | Tap "+" ou EmptyState action | — | — | — | — | Abre modal criar |
| 3 | Tap "Editar" | — | — | — | — | Abre modal com dados preenchidos |
| 4 | Salvar (criar) | `POST /api/v1/campanhas` | POST | `{ nome, percentual, validade_dias, data_inicio, data_fim }` | nome obrigatório, percentual 1-100 | Fecha modal |
| 5 | Salvar (editar) | `PATCH /api/v1/campanhas/{id}` | PATCH | `{ nome, percentual, validade_dias, data_inicio, data_fim }` | nome obrigatório, percentual 1-100 | Fecha modal |
| 6 | Tap "Excluir" | `DELETE /api/v1/campanhas/{id}` | DELETE | — | — | Alert confirmação → deleta |

### Validações (Frontend — inline)
| Campo | Regra | Mensagem |
|-------|-------|----------|
| nome | `form.nome.trim()` não vazio | "Nome é obrigatório." (Alert) |
| percentual | > 0 && <= 100 | "Percentual deve ser entre 1 e 100." (Alert) |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Nome vazio | — | "Nome é obrigatório." | Alert | Até dismiss |
| Percentual inválido | — | "Percentual deve ser entre 1 e 100." | Alert | Até dismiss |
| Confirmar exclusão | — | "Deseja excluir '{nome}'?" | Alert destrutivo | Até dismiss |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| List | src/services/merchant.management.service.ts:66 | getCampanhas() | GET /campanhas |
| Create | src/services/merchant.management.service.ts:73 | createCampanha() | POST /campanhas |
| Update | src/services/merchant.management.service.ts:80 | updateCampanha() | PATCH /campanhas/{id} |
| Delete | src/services/merchant.management.service.ts:88 | deleteCampanha() | DELETE /campanhas/{id} |
| S4-Status | src/contracts/schemas/campanha.schemas.ts | campanhaStatusEnum | encerrada → finalizada | Ref Diff: S2-E5 C4 |

---

## 28. VendasScreen (Merchant)

### Rota
`(merchant)/more/vendas` → `app/(merchant)/(tabs)/more/vendas.tsx`

### Condições de Acesso
- Navegação a partir de MoreMenuScreen ("Vendas")

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/v1/cashback?page={n}&status={s}&data_inicio={d}&data_fim={d}&search={q}` | GET | id, cliente_nome, valor_compra, valor_cashback, status, created_at, total, total_pages | useVendas({ page, status, data_inicio, data_fim, search }) | ⚠️ CORRIGIDO S11: path corrigido /vendas → /cashback — Ref S11-E2 |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Date range selector chips | Componente | Sempre | — | "30d" selecionado |
| 2 | SearchBar | TextInput | Sempre | — | Vazio, placeholder "Buscar..." |
| 3 | FilterChips (status) | Componente | Sempre | — | Nenhum selecionado |
| 4 | Lista vendas | FlatList | vendas.length > 0 | length === 0 | — |
| 5 | StatusBadge por venda | View + Text | Sempre por item | — | Cor conforme status |
| 6 | Paginação (Anterior/Próxima) | View | totalPages > 1 | totalPages <= 1 | Página 1 |
| 7 | Skeleton | Componente | isLoading | !isLoading | — |
| 8 | EmptyState | Componente | length === 0 | length > 0 | "Suas vendas aparecerão aqui." |

> **S4 ALTERAÇÃO (CAMPO NOVO)**: Date range selector (7d/30d/90d) e SearchBar de busca por cliente adicionados. Parâmetros `data_inicio`/`data_fim` enviados na query. Ref Diff: MUDANÇA #59.

### Filtros e Ordenação
| Filtro | Opções | Padrão | Tipo |
|--------|--------|--------|------|
| dateRange | 7d, 30d, 90d | **30d** | Period selector chips |
| search | texto livre (cliente) | Vazio | SearchBar client-side |
| status | confirmado, pendente, cancelado | Nenhum (todas) | FilterChips |
| page | offset-based | 1 | Botões anterior/próxima |

### Cores de Status (Vendas)
| Status | Background | Texto |
|--------|-----------|-------|
| confirmado | bg-green-100 | text-green-700 |
| pendente | bg-yellow-100 | text-yellow-700 |
| cancelado | bg-red-100 | text-red-600 |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Mudar período | `GET /api/v1/cashback?data_inicio={d}&data_fim={d}&page=1` | GET | data_inicio, data_fim, page reset 1 | — | Refetch | ⚠️ CORRIGIDO S11: path corrigido — Ref S11-E2 |
| 2 | Buscar por cliente | `GET /api/v1/cashback?search={q}&page=1` | GET | search, page reset 1 | — | Refetch (client search) | ⚠️ CORRIGIDO S11: path corrigido — Ref S11-E2 |
| 3 | Filtrar por status | `GET /api/v1/cashback?status={s}&page=1` | GET | status, page reset 1 | — | Refetch | ⚠️ CORRIGIDO S11: path corrigido — Ref S11-E2 |
| 4 | Navegar páginas | `GET /api/v1/cashback?page={n}` | GET | page | — | Atualiza lista | ⚠️ CORRIGIDO S11: path corrigido — Ref S11-E2 |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| List | src/services/merchant.management.service.ts:95 | getVendas() | GET /vendas |
| S4-Date | app/(merchant)/(tabs)/more/vendas.tsx | dateRange state | 7d/30d/90d → data_inicio/data_fim params | Ref Diff: MUDANÇA #59 |
| S4-Search | app/(merchant)/(tabs)/more/vendas.tsx | search state | Client-side search input | Ref Diff: MUDANÇA #59 |

---

## 29. ContestacoesMerchantScreen

### Rota
`(merchant)/more/contestacoes` → `app/(merchant)/(tabs)/more/contestacoes.tsx`

### Condições de Acesso
- Navegação a partir de MoreMenuScreen ("Contestações")

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/v1/contestacoes?status={s}` | GET | id, cliente_nome, tipo, descricao, status, resposta, created_at | useContestacoesMerchant(statusFilter) |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | FilterChips (status) | Componente | Sempre | — | "pendente" (default!) |
| 2 | Lista contestações | FlatList | items > 0 | items === 0 | — |
| 3 | StatusBadge | View + Text | Sempre por item | — | Cor conforme status |
| 4 | Bloco "Resposta" | View bg-gray-50 | item.resposta existe | !resposta | — |
| 5 | Botão "Responder" | TouchableOpacity | item.status === "pendente" | status !== "pendente" | — |
| 6 | Modal de resposta | Modal | resolveModal !== null | resolveModal === null | — |
| 7 | EmptyState | Componente | length === 0 | length > 0 | "Contestações dos clientes aparecerão aqui." |

### Filtros e Ordenação
| Filtro | Opções | Padrão | Tipo |
|--------|--------|--------|------|
| status | pendente, aprovada, rejeitada | **pendente** (default) | FilterChips |

### Cores de Status (Contestações Merchant)
| Status | Background | Texto |
|--------|-----------|-------|
| pendente | bg-yellow-100 | text-yellow-700 |
| aprovada | bg-green-100 | text-green-700 |
| rejeitada | bg-red-100 | text-red-600 |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Filtrar por status | `GET /api/v1/contestacoes?status={s}` | GET | — | — | Refetch |
| 2 | Tap "Responder" | — | — | — | — | Abre modal |
| 3 | Aprovar | `PATCH /api/v1/contestacoes/{id}` | PATCH | `{ status: "aprovada", resposta }` | resposta não vazia | Fecha modal | ⚠️ CORRIGIDO S11: path corrigido /resolve removido — Ref S11-E2 |
| 4 | Rejeitar | `PATCH /api/v1/contestacoes/{id}` | PATCH | `{ status: "rejeitada", resposta }` | resposta não vazia | Fecha modal | ⚠️ CORRIGIDO S11: path corrigido /resolve removido — Ref S11-E2 |

### Validações (Frontend — inline)
| Campo | Regra | Mensagem |
|-------|-------|----------|
| resposta | `resposta.trim()` não vazio | "Informe uma resposta." (Alert) |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Resposta vazia | — | "Informe uma resposta." | Alert | Até dismiss |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| List | src/services/merchant.management.service.ts:103 | getContestacoes() | GET /contestacoes |
| Resolve | src/services/merchant.management.service.ts:112 | resolveContestacao() | PATCH /contestacoes/{id} | ⚠️ CORRIGIDO S11: path corrigido — Ref S11-E2 |

---

## 30. ConfigScreen (Merchant Configurações)

### Rota
`(merchant)/more/config` → `app/(merchant)/(tabs)/more/config.tsx`

### Condições de Acesso
- Navegação a partir de MoreMenuScreen ("Configurações")

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/v1/config` | GET | nome_fantasia, cnpj, plano, plano_status, proxima_cobranca, telefone, email, percentual_cashback, validade_cashback, max_utilizacao | useEmpresaConfig() | ⚠️ CORRIGIDO S11: path corrigido /empresa/config → /config — Ref S11-E2 |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Seção "Dados da Empresa" (somente leitura) | View | config carregado | — | — |
| 2 | ReadOnlyRow "Nome Fantasia" | View | Sempre | — | config.nome_fantasia |
| 3 | ReadOnlyRow "CNPJ" | View | Sempre | — | config.cnpj |
| 4 | ReadOnlyRow "Plano" | View | Sempre | — | "{plano} ({plano_status})" |
| 5 | ReadOnlyRow "Próxima cobrança" | View | config.proxima_cobranca existe | !proxima_cobranca | — |
| 6 | Seção "Contato" (editável) | View | Sempre | — | — |
| 7 | Campo Telefone | TextInput phone-pad | Sempre | — | config.telefone |
| 8 | Campo E-mail | TextInput email-address | Sempre | — | config.email |
| 9 | Seção "Regras de Cashback" (editável) | View | Sempre | — | — |
| 10 | Campo "Percentual Cashback (%)" | TextInput numeric | Sempre | — | config.percentual_cashback |
| 11 | Campo "Validade Cashback (dias)" | TextInput numeric | Sempre | — | config.validade_cashback |
| 12 | Campo "Máx. Utilização (%)" | TextInput numeric | Sempre | — | config.max_utilizacao |
| 13 | Botão "Salvar Configurações" | TouchableOpacity bg-green-600 | Sempre | — | — |
| 14 | Skeleton | Componente | isLoading | !isLoading | — |
| 15 | Tela de erro | View | !config | config | "Erro ao carregar configurações" |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Salvar | `PATCH /api/v1/config` | PATCH | `{ telefone, email, percentual_cashback, validade_cashback, max_utilizacao }` | — | Sucesso → Alert "Configurações atualizadas." | ⚠️ CORRIGIDO S11: path corrigido — Ref S11-E2 |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| ReadOnlyRow "Próxima cobrança" | Campo não preenchido | — | config.proxima_cobranca falsy (config.tsx:68) |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Get | src/services/merchant.empresa.service.ts:22 | getConfig() | GET /config | ⚠️ CORRIGIDO S11: path corrigido — Ref S11-E2 |
| Update | src/services/merchant.empresa.service.ts:30 | updateConfig() | PATCH /config | ⚠️ CORRIGIDO S11: path corrigido — Ref S11-E2 |

---

## 31. RelatoriosScreen (Merchant)

### Rota
`(merchant)/more/relatorios` → `app/(merchant)/(tabs)/more/relatorios.tsx`

### Condições de Acesso
- Navegação a partir de MoreMenuScreen ("Relatórios")

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/v1/relatorios?periodo={p}` | GET | cashback_gerado, cashback_utilizado, cashback_expirado, clientes_ativos, ticket_medio | useRelatorios(periodo) |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | FilterChips (período) | Componente | Sempre | — | "30d" selecionado |
| 2 | MetricCard "Cashback Gerado" | Componente | relatorio carregado | — | R$ formatado |
| 3 | MetricCard "Cashback Utilizado" | Componente | relatorio carregado | — | R$ formatado |
| 4 | MetricCard "Cashback Expirado" | Componente | relatorio carregado | — | R$ formatado |
| 5 | MetricCard "Clientes Ativos" | Componente | relatorio carregado | — | Número (isCurrency=false) |
| 6 | MetricCard "Ticket Médio" | Componente | relatorio carregado | — | R$ formatado |
| 7 | Skeleton | Componente | isLoading | !isLoading | — |
| 8 | Erro | Text | !relatorio && !isLoading | — | "Erro ao carregar relatório." |

### Filtros e Ordenação
| Filtro | Opções | Padrão | Tipo |
|--------|--------|--------|------|
| periodo | 7d, 30d, 90d | **30d** | FilterChips |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Mudar período | `GET /api/v1/relatorios?periodo={p}` | GET | periodo | — | Refetch métricas |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Report | src/services/merchant.management.service.ts:120 | getRelatorios() | GET /relatorios |

---

## 32. MultilojaScreen (Merchant — Seletor de Empresa)

### Rota
`(merchant)/multiloja` → `app/(merchant)/multiloja.tsx`

### Condições de Acesso
- Navegação a partir de MoreMenuScreen ("Trocar empresa")
- **Visível apenas se isMultiloja() === true** (merchant com múltiplas empresas)

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/v1/empresas` | GET | id, nome_fantasia, cnpj, perfil | useEmpresas() |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Lista de empresas | EmpresaRow[] | empresas carregadas | isLoading | — |
| 2 | SkeletonCard (x3) | Componente | isLoading | !isLoading | — |
| 3 | Badge "✓" na empresa ativa | Text | empresa === empresaAtiva | empresa !== empresaAtiva | — |
| 4 | Border verde na ativa | border-2 border-green-500 | empresa === empresaAtiva | — | — |
| 5 | ActivityIndicator | ActivityIndicator | isSwitching | !isSwitching | — |

### Labels de Perfil
| Perfil | Label PT-BR |
|--------|-------------|
| proprietario | Proprietário |
| gestor | Gestor |
| operador | Operador |
| vendedor | Vendedor |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Tap em empresa diferente | `POST /api/v1/auth/switch-empresa` | POST | — | empresa !== empresaAtiva | Sucesso → router.back(); ActivityIndicator durante switch | ⚠️ CORRIGIDO S11: path corrigido /empresas/{id}/switch → /auth/switch-empresa — Ref S11-E2 |
| 2 | Tap em empresa ativa | — | — | — | disabled | Nenhum (botão desabilitado) |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Tela inteira | Merchant com 1 empresa | — | MoreMenuScreen controla visibilidade (more/index.tsx:52) |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| List | src/services/merchant.empresa.service.ts:10 | getEmpresas() | GET /empresas |
| Switch | src/services/merchant.empresa.service.ts:16 | switchEmpresa(id) | POST /auth/switch-empresa | ⚠️ CORRIGIDO S11: path corrigido — Ref S11-E2 |
| Store | src/stores/multiloja.store.ts | useMultilojaStore | empresaAtiva, setEmpresaAtiva |

---

## 33. PrivacyPolicyScreen (Shared)

### Rota
`(shared)/privacy-policy` → `app/(shared)/privacy-policy.tsx`

### Condições de Acesso
- Acessível tanto por consumer (ProfileScreen) quanto por merchant (MoreMenuScreen)
- Não requer autenticação específica

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Conteúdo estático | — |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Texto da Política de Privacidade | ScrollView + Text | Sempre | — | Conteúdo estático LGPD |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1 | app/(shared)/privacy-policy.tsx | PrivacyPolicyScreen | Conteúdo estático |

---

## S4 — Cross-Cutting Changes (Arquiteturais)

> Itens que afetam múltiplas telas ou são infraestruturais. Não alteram UI diretamente, mas impactam comportamento runtime.

### CC-1: Dual Schema Consolidation → Re-export Shim
- **Categoria**: REGRA CORRIGIDA
- **Impacto**: Arquitetural — schemas em `src/schemas/` agora re-exportam de `src/contracts/schemas/` (SSOT)
- **Evidência**: Schemas locais transformados em re-exports para manter backward-compat
- **Telas afetadas**: Todas que importam schemas (Login, Register, ForgotPassword, etc.)

### CC-2: Contract Violation System (`apiCall<T>`)
- **Categoria**: REGRA NOVA
- **Impacto**: Arquitetural — wrapper `apiCall<T>` com `schema.safeParse()` + graceful degradation
- **Comportamento**: Se response não valida contra schema Zod, `reportContractViolation()` é chamado mas dados são usados mesmo assim (graceful)
- **Funções**: `reportContractViolation()`, `getContractViolations()`
- **Telas afetadas**: Todas que usam services com `apiCall<T>`

### CC-3: Cursor Pagination Schema Formalizado
- **Categoria**: REGRA NOVA
- **Schema**: `cursorPaginationMetaSchema` — `{next_cursor, prev_cursor, per_page, has_more_pages}`
- **Endpoints afetados**: GET /extrato, GET /historico (via extrato), GET /notifications
- **Referência Swagger**: `CursorPaginationMeta` schema

### CC-4: Campanha Status Enum Migration
- **Categoria**: REGRA CORRIGIDA
- **Mudança**: `encerrada` → `finalizada` em todo o código (9 arquivos backend)
- **Telas afetadas**: CampanhasScreen (filtros + cores + StatusBadge)
- **Ref Diff**: S2-E5 C4

### CC-5: Token Key Alignment
- **Categoria**: ⚠️ RESOLVIDO S10: confirmado — response de login/refresh retorna `token` (não `access_token`) (fonte: S8-E1c §4:#23, código: AuthController.php)
- **Mudança**: Response de login/refresh retorna `token` (não `access_token`)
- **Endpoints**: POST /auth/login, /auth/refresh, /auth/oauth
- **Evidência**: `AuthController.php` retorna `{ token, token_type: "bearer" }` dentro do envelope
- **Ref Diff**: MUDANÇA #3 (Swagger)

### CC-6: Biometric Unenroll Endpoint
- **Categoria**: REGRA NOVA
- **Endpoint**: `POST /api/mobile/v1/auth/biometric/unenroll`
- **Request**: `{ device_id }` (max:255)
- **Response**: `{ unenrolled: true }` dentro do envelope
- **Tela afetada**: ProfileScreen (toggle biometria OFF)
- **Ref Diff**: S2-E5 C1

### CC-7: Push Device Unregister Function
- **Categoria**: REGRA NOVA (parcial)
- **Status**: Função `unregisterToken()` disponível em `usePushSetup.ts:121-128` mas **NÃO wired em logout**
- **Endpoint backend**: `DELETE /api/mobile/v1/devices` (body: `{ token }`) — `MobileDeviceController.destroy()`
- **Impacto**: Potencial push para dispositivos deslogados
- **Nota**: Aguardando integração futura no fluxo de logout. `deleteAccount()` limpa tokens corretamente; `logout()` não.

> **S5-E7c ATUALIZAÇÃO**: Nome correto da função: `unregisterToken()` (não `unregisterPushDevice()`). Localizada em `src/hooks/usePushSetup.ts:121-128`. Backend endpoint confirmado: `DELETE /api/mobile/v1/devices`.

### CC-8: TransactionCard Colors
- **Categoria**: REGRA CORRIGIDA
- **Mudança**: Cor para valores negativos (expirado/utilizado): `text-gray-400` → `text-red-500`
- **Telas afetadas**: SaldoScreen (TransactionRow), ExtratoScreen (TransactionCard)
- **Impacto**: Visual — valores negativos agora em vermelho (mais visível)

### CC-9: Notification Config Format Dual Schema
- **Categoria**: ⚠️ RESOLVIDO S10: confirmado — dual schema format verificado, ambos formatos funcionam corretamente (fonte: S8-E1c §4:#24, E1b §2:172-175 mobile flat format)
- **Backend**: Formato flat `{ push: true, email: false, marketing: true }`
- **Frontend**: Transforma para `{ canal: "push", ativo: true }` e vice-versa
- **Schema Zod**: `notificacaoConfigSchema` (flat), `notificacaoConfigBackendRequestSchema` (flat)
- **Tela afetada**: NotificationPreferencesScreen
- **Ref Diff**: MUDANÇA #8, Cross-cutting #9

### Rastreabilidade Cross-Cutting
| # | Item | Arquivo Principal | Evidência | Ref Diff |
|---|------|-------------------|-----------|----------|
| CC-1 | Dual schema shim | src/schemas/*.ts → src/contracts/schemas/*.ts | Re-export pattern | Cross-cutting #1 |
| CC-2 | apiCall<T> | src/lib/apiCall.ts | schema.safeParse() + reportContractViolation | Cross-cutting #2 |
| CC-3 | Cursor pagination | src/contracts/schemas/common.schemas.ts | cursorPaginationMetaSchema | Cross-cutting #3 |
| CC-4 | Campanha enum | src/contracts/schemas/campanha.schemas.ts | encerrada → finalizada | S2-E5 C4 |
| CC-5 | Token key | src/services/mobile.auth.service.ts | token (not access_token) | MUDANÇA #3 |
| CC-6 | Biometric unenroll | src/services/mobile.auth.service.ts | POST /auth/biometric/unenroll | S2-E5 C1 |
| CC-7 | Push unregister | src/hooks/usePushSetup.ts | unregisterToken() (not wired in logout) | Cross-cutting #7 |
| CC-8 | Transaction colors | app/(consumer)/(tabs)/saldo/index.tsx | text-gray-400 → text-red-500 | Cross-cutting #8 |
| CC-9 | Notification config | src/contracts/schemas/notificacao.schemas.ts | flat booleans ↔ {canal,ativo} | Cross-cutting #9 |

---

## Itens Resolvidos em S5-E7c

| # | Item | Status S5-E7c | Resolução | Evidência |
|---|------|---------------|-----------|-----------|
| M1 | HistoricoScreen endpoint `/historico` vs `/extrato` | CONFIRMADO | Mapeamento intencional: `useHistorico()` → `GET /extrato`. Backend não possui `/historico`. | `src/services/mobile.cashback.service.ts:37-49`, `MobileExtratoController.php`, testes unitários |
| M3 | Perfil `proprietario` — acesso total | CONFIRMADO | Acesso a todos os menus. Validado em código e backend middleware. | `app/(merchant)/(tabs)/more/index.tsx:10-16`, `routes/api.php` |
| M4 | Perfil `gestor` — acesso administrativo | CONFIRMADO | Acesso: Campanhas, Vendas, Contestações, Relatórios, Configurações. Sem acesso: Unidades de Negócio, Usuários Internos. | `routes/api.php:278-288` (config: `proprietario,gestor`) |
| M5 | Perfil `operador` — acesso operacional | CONFIRMADO | Acesso: Campanhas (leitura), Vendas, Contestações (leitura/criação). Sem acesso: Relatórios, Configurações. | `routes/api.php:238,350` (`check.perfil:proprietario,gestor,operador`) |
| M6 | Perfil `vendedor` — acesso restrito | CONFIRMADO | Acesso: apenas Vendas. Sem acesso: Campanhas, Contestações, Relatórios, Configurações. | `routes/api.php:200` (`check.perfil:proprietario,gestor,operador,vendedor`) |

## Pendências Remanescentes

| # | Item | Status | Origem |
|---|------|--------|--------|
| CC-7 | Push `unregisterToken()` em logout | Função disponível (`usePushSetup.ts:121-128`) mas não integrada no fluxo de logout | S4 Cross-cutting |

---

---
## Glossário de Permissões (Mobile)

| Permissão | Descrição | Telas Afetadas |
|-----------|-----------|----------------|
| `isAuthenticated` | Usuário possui JWT token válido (expo-secure-store) | Todas exceto (auth)/* |
| `onboarding_completed` | MMKV flag — onboarding já visualizado | AuthGuard → redireciona para Onboarding se false |
| `lgpd_consent_given` | MMKV flag — consentimento LGPD aceito | AuthGuard → redireciona para Consent se false |
| `lgpd_marketing_consent` | MMKV flag — consentimento marketing (opcional) | ConsentScreen |
| `tipo_global: cliente` | Tipo do usuário retornado pelo backend no login | Consumer: Home, Saldo, QRCode, Notificações, Perfil, Contestações |
| `tipo_global: lojista` | Tipo do usuário retornado pelo backend no login (null = lojista) | Merchant: Dashboard, Cashback, Clientes, Mais |
| `camera` | Permissão do sistema operacional para câmera | QRScanScreen (merchant) |
| `biometricAvailable` | Hardware de biometria disponível no dispositivo | ProfileScreen — toggle biometria |
| `biometricEnrolled` | Biometria cadastrada pelo usuário (enroll/unenroll via API) | ProfileScreen — toggle biometria (enroll ON + unenroll OFF via API) |
| `isMultiloja` | Merchant possui > 1 empresa vinculada | MoreMenuScreen — "Trocar empresa", MultilojaScreen |
| `perfil: proprietario` | Perfil do merchant na empresa | Acesso total: todos os menus do MoreMenuScreen |
| `perfil: gestor` | Perfil do merchant na empresa | Acesso parcial: Campanhas, Vendas, Contestações, Relatórios (sem Configurações) |
| `perfil: operador` | Perfil do merchant na empresa | Acesso limitado: apenas Vendas |
| `perfil: vendedor` | Perfil do merchant na empresa | Acesso mínimo: nenhum menu além de Trocar empresa, Privacidade, Sair |

> **S4 ALTERAÇÃO**: Permissões de perfil resolvidas para implementação real (role-gating). Ref Diff: S2-E5 Impl#2. `biometricEnrolled` agora gerenciado via API (enroll + unenroll). Ref Diff: S2-E5 C1.
> **S5-E7c CONFIRMAÇÃO**: Perfis validados contra código-fonte e backend middleware. Tabela de permissões corrigida (ver Role-Gating por Perfil acima).

## Tabela de Status (Mobile)

### Status de Cashback (Consumer — Extrato)
| Status | Label PT-BR | Cor/Badge | Transições | Contestável? |
|--------|-------------|-----------|------------|:---:|
| pendente | Pendente | FilterChip default | → confirmado, → rejeitado, → congelado | Não |
| confirmado | Confirmado | FilterChip selecionado | → utilizado, → expirado | Não |
| utilizado | Utilizado | text-red-500 (negativo) | Estado final | Não |
| rejeitado | Rejeitado | FilterChip | Estado final | **Sim** |
| expirado | Expirado | text-red-500 (negativo) | Estado final | **Sim** |
| congelado | Congelado | FilterChip | → confirmado, → rejeitado | **Sim** |
| estornado | Estornado | FilterChip (forward-compat) | Estado final | Não |

> **S4 ALTERAÇÃO**: Status `estornado` adicionado (forward-compat, presente no Zod). Cor de valores negativos: `text-gray-400` → `text-red-500`. Coluna "Contestável?" adicionada conforme CONTESTABLE_STATUSES. Ref Diff: Cross-cutting #8, MUDANÇA #28.

### Status de Contestação (Consumer)
| Status | Label PT-BR | Cor/Badge | Transições |
|--------|-------------|-----------|------------|
| pendente | Pendente | StatusBadge (yellow) | → aprovada, → rejeitada |
| aprovada | Aprovada | StatusBadge (green) | Estado final |
| rejeitada | Rejeitada | StatusBadge (red) | Estado final |

### Status de Contestação (Merchant)
| Status | Label PT-BR | Cor/Badge | Transições |
|--------|-------------|-----------|------------|
| pendente | Pendentes | bg-yellow-100 text-yellow-700 | → aprovada, → rejeitada (via modal resposta) |
| aprovada | Aprovadas | bg-green-100 text-green-700 | Estado final |
| rejeitada | Rejeitadas | bg-red-100 text-red-600 | Estado final |

### Status de Campanha (Merchant)
| Status | Label PT-BR | Cor/Badge | Transições |
|--------|-------------|-----------|------------|
| ativa | Ativas | bg-green-100 text-green-700 | → inativa, → finalizada |
| inativa | Inativas | bg-gray-100 text-gray-600 | → ativa |
| finalizada | Finalizadas | bg-red-100 text-red-600 | Estado final |

> **S4 ALTERAÇÃO**: Status `encerrada` renomeado para `finalizada` em todo o sistema. `finalizada` é estado final confirmado. Ref Diff: S2-E5 C4.

### Status de Venda (Merchant)
| Status | Label PT-BR | Cor/Badge | Transições |
|--------|-------------|-----------|------------|
| confirmado | Confirmadas | bg-green-100 text-green-700 | Estado final |
| pendente | Pendentes | bg-yellow-100 text-yellow-700 | → confirmado, → cancelado |
| cancelado | Canceladas | bg-red-100 text-red-600 | Estado final |

### Tipos de Contestação (Enum)
| Tipo | Label PT-BR | Origem |
|------|-------------|--------|
| cashback_nao_gerado | Cashback não gerado | src/schemas/contestacao.ts:5 |
| valor_incorreto | Valor incorreto | src/schemas/contestacao.ts:5 |
| expiracao_indevida | Expiração indevida | src/schemas/contestacao.ts:5 |
| venda_cancelada | Venda cancelada | src/schemas/contestacao.ts:5 |

### Perfis de Merchant (Multiloja)
| Perfil | Label PT-BR | Origem |
|--------|-------------|--------|
| proprietario | Proprietário | app/(merchant)/multiloja.tsx:19 |
| gestor | Gestor | app/(merchant)/multiloja.tsx:20 |
| operador | Operador | app/(merchant)/multiloja.tsx:21 |
| vendedor | Vendedor | app/(merchant)/multiloja.tsx:22 |

### Tipos de Transação (Dashboard Merchant)
| Tipo | Cor | Prefixo | Origem |
|------|-----|---------|--------|
| gerado | text-green-600 | + | app/(merchant)/(tabs)/dashboard.tsx:15 |
| utilizado | text-purple-600 | - | app/(merchant)/(tabs)/dashboard.tsx:16 |
| cancelado | text-yellow-600 | ~ | app/(merchant)/(tabs)/dashboard.tsx:17 |

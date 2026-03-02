# S1-E3 — Mapa de Regras de Negócio: Consumer MOBILE

> Gerado automaticamente a partir do código-fonte do `cashback-mobile`.
> Etapa 3c do pipeline de documentação.

**Stack:** React Native 0.76.9 + Expo 52 + TypeScript 5.3 + expo-router 4.0 + NativeWind 4.1 + Zustand 4.4 + TanStack React Query 5.14 + React Hook Form 7.50 + Zod 3.22 + Axios 1.7 + expo-secure-store 14 + Sentry React Native 6.10

**Auth:** JWT Bearer token (expo-secure-store) com auto-refresh via interceptor Axios

**Prefixos de API:**
- Consumer: `/api/mobile/v1`
- Merchant: `/api/v1`

**Total de telas:** 31

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
| 5 | Divider "ou" | View | Sempre | — | — |
| 6 | Botão "Entrar com Google" | TouchableOpacity | Sempre | — | — |
| 7 | Botão "Entrar com Apple" | TouchableOpacity | **Somente iOS** | Android | — |
| 8 | Link "Não tem conta? Cadastre-se" | TouchableOpacity | Sempre | — | — |
| 9 | ActivityIndicator no botão | ActivityIndicator | loginMutation.isPending | !isPending | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Submit login | `POST /api/mobile/v1/auth/login` | POST | `{ email, senha }` | Zod: email válido, senha min 6 chars | Sucesso → router.replace("/"); Erro → Alert "Credenciais inválidas" |
| 2 | OAuth Google | `POST /api/mobile/v1/auth/oauth` | POST | `{ provider: "google", token }` | — | [NÃO IMPLEMENTADO] — exibe Alert placeholder |
| 3 | OAuth Apple | `POST /api/mobile/v1/auth/oauth` | POST | `{ provider: "apple", token }` | — | [NÃO IMPLEMENTADO] — exibe Alert placeholder |
| 4 | Tap "Esqueceu a senha?" | — | — | — | — | router.push("/(auth)/forgot-password") |
| 5 | Tap "Cadastre-se" | — | — | — | — | router.push("/(auth)/register") |

### Validações (Zod — `loginSchema`)
| Campo | Regra | Mensagem |
|-------|-------|----------|
| email | `z.string().email()` | "E-mail inválido" |
| senha | `z.string().min(6)` | "Senha deve ter no mínimo 6 caracteres" |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Login falhou | — | "Credenciais inválidas" | Alert | Até dismiss |
| OAuth placeholder | — | "Integração Google/Apple Sign-In será ativada..." | Alert | Até dismiss |

### Estados da Interface
- **Loading:** ActivityIndicator dentro do botão "Entrar" durante isPending
- **Empty:** N/A (formulário sempre exibido)
- **Error:** Mensagens Zod inline + Alert em erro de API

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Botão Apple Sign-In | Apenas iOS | — | Platform.OS === "ios" check (login.tsx:149) |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1 | app/(auth)/login.tsx:34 | onSubmit | loginMutation.mutate(data) |
| 2-3 | app/(auth)/login.tsx:41 | handleOAuth | Alert.alert placeholder |
| Val | src/schemas/auth.ts:3-6 | loginSchema | z.object({ email, senha }) |
| Svc | src/services/mobile.auth.service.ts:31 | login() | POST /auth/login + saveTokens |

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
| cpf | `z.string().length(11)` | "CPF deve ter 11 dígitos" |
| senha | `z.string().min(6)` | "Senha deve ter no mínimo 6 caracteres" |
| senha_confirmation | `.refine(data.senha === data.senha_confirmation)` | "Senhas não conferem" |

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
| 3 | Campo Código | TextInput | step === "token" | step !== "token" | Vazio |
| 4 | Campo Nova Senha | TextInput secureTextEntry | step === "token" | step !== "token" | Vazio |
| 5 | Botão "Redefinir Senha" | TouchableOpacity | step === "token" | step !== "token" | — |
| 6 | Link "Voltar ao login" | TouchableOpacity | step !== "done" | step === "done" | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Enviar email | `POST /api/mobile/v1/auth/forgot-password` | POST | `{ email }` | Zod: email válido | Sucesso → step "token"; Erro → Alert "Não foi possível enviar..." |
| 2 | Redefinir senha | `POST /api/mobile/v1/auth/reset-password` | POST | `{ email, token, senha }` | Zod: email, token min 1, senha min 6 | Sucesso → Alert "Senha redefinida!" + router.replace login; Erro → Alert "Token inválido ou expirado" |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| step | "email" → "token" | Formulário visível | Ao enviar email com sucesso, email é copiado para resetForm automaticamente | — |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Email enviado com sucesso | — | (navega para step "token" sem mensagem) | — | — |
| Email falhou | — | "Não foi possível enviar o email de recuperação." | Alert | Até dismiss |
| Senha redefinida | — | "Senha redefinida com sucesso!" | Alert | Até dismiss → login |
| Token inválido | — | "Token inválido ou expirado. Tente novamente." | Alert | Até dismiss |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1 | app/(auth)/forgot-password.tsx:40 | onSendEmail | forgotMutation.mutate |
| 2 | app/(auth)/forgot-password.tsx:50 | onResetPassword | resetMutation.mutate |
| Val | src/schemas/auth.ts:21-29 | forgotPasswordSchema, resetPasswordSchema | — |
| Svc | src/services/mobile.auth.service.ts:69-76 | forgotPassword(), resetPassword() | — |

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
| 4 | Tap em transação | — | — | — | — | router.push contestacao/create com cashback_entry_id e empresa_nome |
| 5 | Focus na tela | Refetch | GET | — | — | useRefreshOnFocus |

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
| `GET /api/mobile/v1/extrato` | GET | empresa.nome_fantasia, valor_compra, valor_cashback, created_at | useHistorico() — **mapeia para /extrato** [INFERIDO — verificar com a equipe: endpoint /historico não existe no backend] |

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
| `GET /api/mobile/v1/saldo` | GET | saldo_total, por_empresa (empresa_id, nome_fantasia, saldo) | useSaldo() |
| `GET /api/mobile/v1/extrato` | GET | Extrato completo com cursor pagination | useExtrato() |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | SaldoCard (total) | Componente | saldo carregado | saldoLoading | — |
| 2 | SkeletonCard | Componente | saldoLoading | !saldoLoading | — |
| 3 | "Saldo por empresa" (lista EmpresaRow) | View + FlatList | saldo.por_empresa.length > 0 | sem empresas | — |
| 4 | "Extrato completo" (TransactionRow) | FlatList | entries > 0 | entries === 0 | — |
| 5 | SkeletonTransaction (x4) | Componente | extratoLoading | !extratoLoading | — |
| 6 | EmptyState | Componente | !loading && entries === 0 | — | "Sem movimentações" |

### Regras de Exibição — TransactionRow
| # | Elemento | Condição | Comportamento |
|---|----------|----------|---------------|
| 1 | Cor do valor | status_cashback === "expirado" \|\| "utilizado" | text-gray-400 com prefixo "-" |
| 2 | Cor do valor | outros status | text-green-600 com prefixo "+" |

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
| `GET /api/mobile/v1/notifications/preferences` | GET | push_enabled, email_enabled, marketing_enabled | useNotificationPreferences() |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Título "Preferências" | Text | Sempre | — | — |
| 2 | Seção "Canais" | Header | Sempre | — | — |
| 3 | Toggle "Push Notifications" | Switch | Sempre | — | prefs.push_enabled |
| 4 | Toggle "Email" | Switch | Sempre | — | prefs.email_enabled |
| 5 | Seção "Categorias" | Header | Sempre | — | — |
| 6 | Toggle "Transações" | Switch | Sempre | — | prefs.push_enabled |
| 7 | Toggle "Promoções" | Switch | Sempre | — | prefs.marketing_enabled |
| 8 | Toggle "Marketing" | Switch | Sempre | — | prefs.marketing_enabled |
| 9 | ActivityIndicator (tela cheia) | View | isLoading | !isLoading | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Toggle qualquer preferência | `PATCH /api/mobile/v1/notifications/preferences` | PATCH | `{ [key]: value }` | — | Erro → Alert "Não foi possível atualizar preferência." |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Erro ao atualizar | — | "Não foi possível atualizar preferência." | Alert | Até dismiss |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Get | src/services/mobile.notification.service.ts:33 | getPreferences() | GET /notifications/preferences |
| Update | src/services/mobile.notification.service.ts:38 | updatePreferences() | PATCH /notifications/preferences |

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
| 5 | Toggle Biometria OFF | — | — | — | — | setBiometricEnrolled(false) local |
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

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Me | src/services/mobile.auth.service.ts:54 | me() | GET /auth/me |
| Logout | src/services/mobile.auth.service.ts:38 | logout() | POST /auth/logout + clearTokens |
| Bio | src/services/mobile.auth.service.ts:97 | enrollBiometric() | POST /auth/biometric/enroll |
| Store | src/stores/auth.store.ts:37 | logout() | mobileAuthService.logout + reset state |

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
| 3 | Botão "Alterar Senha" | TouchableOpacity | Sempre | — | Habilitado |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Submit | `PATCH /api/mobile/v1/auth/password` | PATCH | `{ senha_atual, nova_senha }` | Zod: senha_atual min 1, nova_senha min 6 | Sucesso → Alert "Senha alterada com sucesso!" + router.back(); Erro → Alert "Senha atual incorreta." |

### Validações (Zod — `changePasswordSchema`)
| Campo | Regra | Mensagem |
|-------|-------|----------|
| senha_atual | `z.string().min(1)` | "Senha atual é obrigatória" |
| nova_senha | `z.string().min(6)` | "Nova senha deve ter no mínimo 6 caracteres" |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1 | src/services/mobile.auth.service.ts:86 | changePassword() | PATCH /auth/password |
| Val | src/schemas/auth.ts:37-40 | changePasswordSchema | — |

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
| 2 | Confirmar exclusão | `POST /api/mobile/v1/auth/delete-account` | POST | `{ senha, motivo? }` | — | Sucesso → Alert "Conta Excluída" → router.replace login; Erro → Alert "Não foi possível excluir a conta. Verifique sua senha." |

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

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1-2 | src/services/mobile.auth.service.ts:91 | deleteAccount() | POST /auth/delete-account + clearTokens |
| Val | src/schemas/auth.ts:42-45 | deleteAccountSchema | — |
| LGPD | app/(consumer)/(tabs)/profile/delete-account.tsx:31 | comment | "Double confirmation as required by LGPD compliance" |

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
| 2 | Botão "Nova" | TouchableOpacity bg-blue-600 | Sempre | — | — |
| 3 | Lista ContestacaoRow | FlatList | items > 0 | items === 0 | — |
| 4 | StatusBadge por contestação | Componente | Sempre por item | — | Cor conforme status |
| 5 | Labels de tipo | Record mapeado | Sempre por item | — | Ex: "Cashback não gerado" |
| 6 | Bloco "Resposta" | View bg-gray-50 | item.resposta existe | !item.resposta | — |
| 7 | SkeletonTransaction (x3) | Componente | isLoading | !isLoading | — |
| 8 | EmptyState | Componente | !isLoading && items === 0 | — | "Sem contestações" |

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
| 1 | Tap "Nova" | — | — | — | — | router.push contestacao/create |
| 2 | Scroll infinito | `GET /api/mobile/v1/contestacoes?page={n}` | GET | page | hasNextPage | Append |
| 3 | Focus na tela | Refetch | GET | — | — | useRefreshOnFocus |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| List | src/services/mobile.contestacao.service.ts:14 | list(params) | GET /contestacoes |

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
| 3 | DashboardChart | Componente | chartData carregado | loadingChart | Período fixo "7d" |
| 4 | "Últimas Transações" (máx 5) | View lista | transacoes > 0 | transacoes === 0 | — |
| 5 | EmptyState transações | Componente | transacoes.length === 0 | — | "Gere seu primeiro cashback!" |
| 6 | "Top Clientes" (máx 3) | View lista | topClientes > 0 | topClientes === 0 | — |
| 7 | EmptyState clientes | Componente | topClientes.length === 0 | — | "Seus top clientes aparecerão aqui." |

### Cores por tipo de transação
| Tipo | Cor | Prefixo |
|------|-----|---------|
| gerado | text-green-600 | + |
| utilizado | text-purple-600 | - |
| cancelado | text-yellow-600 | ~ |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Pull to refresh | Invalidate queries ["merchant", "dashboard"] | — | — | — | RefreshControl |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Stats | src/services/merchant.management.service.ts:21 | getStats() | GET /dashboard/stats |
| Tx | src/services/merchant.management.service.ts:26 | getTransacoes() | GET /dashboard/transacoes |
| Top | src/services/merchant.management.service.ts:33 | getTopClientes() | GET /dashboard/top-clientes |
| Chart | src/services/merchant.management.service.ts:40 | getChart("7d") | GET /dashboard/chart |

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

### Segurança
- **Idempotency-Key** enviado no header para evitar duplicação: `${Date.now()}-${random}` (merchant.cashback.service.ts:38)

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Sucesso | — | "Cashback gerado!" + valor + "Confirma em ~24h" | Tela success | Persistente |
| Erro | — | "Não foi possível gerar o cashback. Tente novamente." | Alert | Até dismiss |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Search | src/services/merchant.cashback.service.ts:16 | searchCliente(cpf) | GET /clientes?search= |
| Campanhas | src/services/merchant.cashback.service.ts:28 | getCampanhas() | GET /campanhas?status=ativa |
| Gerar | src/services/merchant.cashback.service.ts:35 | gerarCashback() | POST /cashback + Idempotency-Key |

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

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Saldo | src/services/merchant.cashback.service.ts:23 | getClienteSaldo() | GET /clientes/{id}/saldo |
| Utilizar | src/services/merchant.cashback.service.ts:45 | utilizarCashback() | POST /cashback/utilizar + Idempotency-Key |

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
| 3 | Botão "Simular Scan" | TouchableOpacity | step === "scan" | step !== "scan" | — |
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

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Validate | src/services/mobile.qrcode.service.ts:29 | validarQRCode() | POST /qrcode/validate |
| Utilizar | src/services/merchant.cashback.service.ts:45 | utilizarCashback() | POST /cashback/utilizar |
| Camera | src/hooks/useCamera.ts | useCamera() | expo-camera permission |

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
| — | — | isMultiloja() via multilojaStore | Já carregado |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Menu "Campanhas" | TouchableOpacity | Sempre | — | — |
| 2 | Menu "Vendas" | TouchableOpacity | Sempre | — | — |
| 3 | Menu "Contestações" | TouchableOpacity | Sempre | — | — |
| 4 | Menu "Relatórios" | TouchableOpacity | Sempre | — | — |
| 5 | Menu "Configurações" | TouchableOpacity | Sempre | — | — |
| 6 | Menu "Trocar empresa" | TouchableOpacity | **isMultiloja() === true** | isMultiloja() === false | — |
| 7 | Menu "Política de Privacidade" | TouchableOpacity | Sempre | — | — |
| 8 | Botão "Sair" | TouchableOpacity bg-red-50 | Sempre | — | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Tap cada menu | — | — | — | — | router.push para tela correspondente |
| 2 | Tap "Trocar empresa" | — | — | — | — | router.push multiloja |
| 3 | Tap "Sair" | `POST /api/mobile/v1/auth/logout` | POST | — | — | Alert confirmação → logout → login |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| "Trocar empresa" | Merchant com apenas 1 empresa | Merchant single-loja | isMultiloja() === false (more/index.tsx:52) |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Menu | app/(merchant)/(tabs)/more/index.tsx:6 | MENU_ITEMS | Array estático 5 itens |
| Multi | src/stores/multiloja.store.ts:9 | isMultiloja() | empresas.length > 1 |

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
| status | ativa, inativa, encerrada | Nenhum (todas) | FilterChips |

### Cores de Status (Campanhas)
| Status | Background | Texto |
|--------|-----------|-------|
| ativa | bg-green-100 | text-green-700 |
| inativa | bg-gray-100 | text-gray-600 |
| encerrada | bg-red-100 | text-red-600 |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Filtrar por status | `GET /api/v1/campanhas?status={s}` | GET | query param | — | Refetch |
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

---

## 28. VendasScreen (Merchant)

### Rota
`(merchant)/more/vendas` → `app/(merchant)/(tabs)/more/vendas.tsx`

### Condições de Acesso
- Navegação a partir de MoreMenuScreen ("Vendas")

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/v1/vendas?page={n}&status={s}` | GET | id, cliente_nome, valor_compra, valor_cashback, status, created_at, total, total_pages | useVendas({ page, status }) |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | FilterChips (status) | Componente | Sempre | — | Nenhum selecionado |
| 2 | Lista vendas | FlatList | vendas.length > 0 | length === 0 | — |
| 3 | StatusBadge por venda | View + Text | Sempre por item | — | Cor conforme status |
| 4 | Paginação (Anterior/Próxima) | View | totalPages > 1 | totalPages <= 1 | Página 1 |
| 5 | Skeleton | Componente | isLoading | !isLoading | — |
| 6 | EmptyState | Componente | length === 0 | length > 0 | "Suas vendas aparecerão aqui." |

### Filtros e Ordenação
| Filtro | Opções | Padrão | Tipo |
|--------|--------|--------|------|
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
| 1 | Filtrar por status | `GET /api/v1/vendas?status={s}&page=1` | GET | status, page reset 1 | — | Refetch |
| 2 | Navegar páginas | `GET /api/v1/vendas?page={n}` | GET | page | — | Atualiza lista |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| List | src/services/merchant.management.service.ts:95 | getVendas() | GET /vendas |

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
| 3 | Aprovar | `PATCH /api/v1/contestacoes/{id}/resolve` | PATCH | `{ status: "aprovada", resposta }` | resposta não vazia | Fecha modal |
| 4 | Rejeitar | `PATCH /api/v1/contestacoes/{id}/resolve` | PATCH | `{ status: "rejeitada", resposta }` | resposta não vazia | Fecha modal |

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
| Resolve | src/services/merchant.management.service.ts:112 | resolveContestacao() | PATCH /contestacoes/{id}/resolve |

---

## 30. ConfigScreen (Merchant Configurações)

### Rota
`(merchant)/more/config` → `app/(merchant)/(tabs)/more/config.tsx`

### Condições de Acesso
- Navegação a partir de MoreMenuScreen ("Configurações")

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /api/v1/empresa/config` | GET | nome_fantasia, cnpj, plano, plano_status, proxima_cobranca, telefone, email, percentual_cashback, validade_cashback, max_utilizacao | useEmpresaConfig() |

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
| 1 | Salvar | `PATCH /api/v1/empresa/config` | PATCH | `{ telefone, email, percentual_cashback, validade_cashback, max_utilizacao }` | — | Sucesso → Alert "Configurações atualizadas." |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| ReadOnlyRow "Próxima cobrança" | Campo não preenchido | — | config.proxima_cobranca falsy (config.tsx:68) |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Get | src/services/merchant.empresa.service.ts:22 | getConfig() | GET /empresa/config |
| Update | src/services/merchant.empresa.service.ts:30 | updateConfig() | PATCH /empresa/config |

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
| 1 | Tap em empresa diferente | `POST /api/v1/empresas/{id}/switch` | POST | — | empresa !== empresaAtiva | Sucesso → router.back(); ActivityIndicator durante switch |
| 2 | Tap em empresa ativa | — | — | — | disabled | Nenhum (botão desabilitado) |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Tela inteira | Merchant com 1 empresa | — | MoreMenuScreen controla visibilidade (more/index.tsx:52) |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| List | src/services/merchant.empresa.service.ts:10 | getEmpresas() | GET /empresas |
| Switch | src/services/merchant.empresa.service.ts:16 | switchEmpresa(id) | POST /empresas/{id}/switch |
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

---
## Glossário de Permissões (Mobile)

| Permissão | Descrição | Telas Afetadas |
|-----------|-----------|----------------|
| `isAuthenticated` | Usuário possui JWT token válido (expo-secure-store) | Todas exceto (auth)/* |
| `onboarding_completed` | MMKV flag — onboarding já visualizado | AuthGuard → redireciona para Onboarding se false |
| `lgpd_consent_given` | MMKV flag — consentimento LGPD aceito | AuthGuard → redireciona para Consent se false |
| `lgpd_marketing_consent` | MMKV flag — consentimento marketing (opcional) | ConsentScreen |
| `tipo_global: cliente` | Tipo do usuário retornado pelo backend no login | Consumer: Home, Saldo, QRCode, Notificações, Perfil, Contestações |
| `tipo_global: lojista` | Tipo do usuário retornado pelo backend no login | Merchant: Dashboard, Cashback, Clientes, Mais |
| `camera` | Permissão do sistema operacional para câmera | QRScanScreen (merchant) |
| `biometricAvailable` | Hardware de biometria disponível no dispositivo | ProfileScreen — toggle biometria |
| `biometricEnrolled` | Biometria cadastrada pelo usuário | ProfileScreen, LoginScreen (biometric login) |
| `isMultiloja` | Merchant possui > 1 empresa vinculada | MoreMenuScreen — "Trocar empresa", MultilojaScreen |
| `perfil: proprietario` | Perfil do merchant na empresa | [INFERIDO — verificar com a equipe] Acesso total |
| `perfil: gestor` | Perfil do merchant na empresa | [INFERIDO — verificar com a equipe] Acesso administrativo |
| `perfil: operador` | Perfil do merchant na empresa | [INFERIDO — verificar com a equipe] Acesso operacional |
| `perfil: vendedor` | Perfil do merchant na empresa | [INFERIDO — verificar com a equipe] Acesso restrito a vendas |

## Tabela de Status (Mobile)

### Status de Cashback (Consumer — Extrato)
| Status | Label PT-BR | Cor/Badge | Transições |
|--------|-------------|-----------|------------|
| pendente | Pendente | FilterChip default | → confirmado, → rejeitado, → congelado |
| confirmado | Confirmado | FilterChip selecionado | → utilizado, → expirado |
| utilizado | Utilizado | text-gray-400 (negativo) | Estado final |
| rejeitado | Rejeitado | FilterChip | Estado final |
| expirado | Expirado | text-gray-400 (negativo) | Estado final |
| congelado | Congelado | FilterChip | → confirmado, → rejeitado |

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
| ativa | Ativas | bg-green-100 text-green-700 | → inativa, → encerrada |
| inativa | Inativas | bg-gray-100 text-gray-600 | → ativa |
| encerrada | Encerradas | bg-red-100 text-red-600 | Estado final [INFERIDO — verificar com a equipe] |

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

# S4-E3 — Mapa de Regras de Negócio: Consumer WEB

> Gerado automaticamente a partir do código-fonte do `cashback-frontend`.
> Apenas Consumer Web — Admin e Mobile são documentados nas etapas 3b e 3c.
> Atualizado em: 2026-03-03 | Etapa: S4-E3 | Baseado em: S4-E1-diff-mudancas.md, S4-E2-swagger-changelog.md
> Alterações rastreáveis: [S4-E1 Diff Web #N] por item

**Stack:** React 18.2.0 + TypeScript 5.3.3 + Vite 6.4.1 + Tailwind CSS 3.4.17 + Zustand 4.4.7 + TanStack React Query 5.14.2 + React Hook Form 7.71.1 + Zod 4.3.6 + Chart.js 4.5.1 + Sentry 10.39.0 + Axios 1.6.2

**Base URL:** `import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'`

**Auth:** JWT Bearer token (httpOnly cookies + AES-GCM encrypted localStorage fallback)

**Error Handling Global (api.ts):**
- 401 → auto-refresh token; se falhar → logout + redirect `/login`
- 402 → redirect `/configuracoes?tab=pagamentos`
- 422 → mapeamento de erros de validação nos campos do formulário
- 429/5xx → retry 3× com exponential backoff (1s, 2s, 4s, max 30s)
- Timeout: 15s → mensagem "Tempo limite de 15s excedido. Verifique sua conexão."
- Sem rede → mensagem "Sem conexão com o servidor. Verifique sua internet."
- XSS: `sanitizeApiResponse()` em todas as respostas
- CSRF: injeta `X-CSRF-Token` em POST/PUT/PATCH/DELETE
- Rate limit client-side: login/register 10/min, auth 30/min, geral configurável

**Proteção de Rota Global (ProtectedRoute.tsx):**
- `!isAuthenticated` → redirect `/login`
- `!isSubscriptionActive && pathname !== '/configuracoes'` → redirect `/configuracoes` com state `{ tab: 'pagamentos' }`
- Exceção: `/configuracoes` acessível mesmo sem assinatura ativa (para permitir pagamento)

**HideWhenUN (HideWhenUN.tsx):**
- Se empresa tem unidades de negócio ativas → redirect `/` (bloqueia acesso a `/gerar-cashback` e `/utilizar-cashback`)

**Query Client Global (App.tsx):**
- staleTime: 60s | gcTime: 10min | refetchOnWindowFocus: false
- retry: até 3× (exceto erros 4xx, exceto 408/429)
- retryDelay: exponential backoff (1s, 2s, 4s… max 30s)
- Persistência: localStorage para suporte offline-first

---

## LoginPage

### Rota
`/login` → `LoginPage` (lazy loaded com chunk-load retry)

### Condições de Acesso
- Rota pública (sem autenticação)
- Se já autenticado: redirect para `/` ou `/multiloja` (se múltiplas empresas)

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Nenhum endpoint chamado ao montar | — |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Hero section (features) | Painel visual | Viewport ≥ lg | Viewport < lg | Visível desktop |
| 2 | Toggle mostrar senha | Botão ícone | Sempre | — | Senha oculta |
| 3 | Checkbox "Lembrar-me" | Checkbox | Sempre | — | Desmarcado |
| 4 | Link "Esqueceu a senha?" | Link | Sempre | — | — |
| 5 | Link "Criar conta" | Link | Sempre | — | — |
| 6 | Alerta de erro | Card vermelho | `error !== null` | `error === null` | Oculto |
| 7 | Botão "Entrar" | Button | Sempre | — | Habilitado |
| 8 | Texto "Carregando..." no botão | Texto | `authLoading === true` | `authLoading === false` | "Entrar" |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Submit formulário login | `/auth/login` | POST | `{ email: sanitizeInput(email), senha, plataforma: 'web' }` | Zod `loginSchema`: email required + email válido; senha required + min 8 chars | Sucesso: toast `t('auth.loginSuccess')`, redirect `/` ou `/multiloja` |
| 2 | Toggle mostrar/ocultar senha | — | — | — | — | Alterna ícone olho aberto/fechado |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| — | — | — | Campos independentes | — |

### Filtros e Ordenação
N/A

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Login bem-sucedido | 200 | `t('auth.loginSuccess')` | toast success | 3s |
| Credenciais inválidas | 401/422 | `t('errors.invalidCredentials')` | alert error inline | Persistente |
| Erro validação campo (422) | 422 | Mensagem do backend por campo (`errors.email`, `errors.senha`) | erro inline no campo | Persistente |
| Rate limit excedido | 429 | `t('auth.rateLimitExceeded')` | alert error inline | Persistente |
| Erro de rede | — | "Sem conexão com o servidor. Verifique sua internet." | via interceptor | Persistente |

### Estados da Interface
- **Loading:** Botão disabled + texto "Carregando..."
- **Empty:** Formulário vazio (estado inicial)
- **Error:** Alerta vermelho com mensagem + erros inline por campo

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Hero section em mobile | UX — espaço limitado | Todos | `LoginPage.tsx` (classe CSS `hidden lg:flex`) |
| Validação de força da senha | Não aplicável no login | Todos | `loginSchema` (apenas min 8) |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1 | `src/pages/LoginPage.tsx` | `onSubmit` | `login(sanitizeInput(email), password)` |
| 1 | `src/stores/authStore.ts` | `login()` | `authService.login({ email, senha, plataforma: 'web' })` |
| 1 | `src/services/auth.service.ts` | `login()` | `api.post('/auth/login', data)` |
| 1 | `src/schemas/auth.ts` | `loginSchema` | Zod schema com validações |
| Multi-empresa | `src/stores/authStore.ts` | `login()` | `isMultiEmpresaLogin(loginData)` → `requiresEmpresaSelection: true` |

---

## CadastroPage

### Rota
`/cadastro` → `CadastroPage` (lazy loaded com chunk-load retry)

### Condições de Acesso
- Rota pública (sem autenticação)
- Após cadastro bem-sucedido → redirect `/login`

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Nenhum endpoint chamado ao montar | — |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Hero section (esquerda) | Painel visual | Viewport ≥ lg | Viewport < lg | Visível desktop |
| 2 | Indicador força da senha | 4 barras coloridas | `senha` não vazio | `senha` vazio | Oculto |
| 3 | Label força (weak/fair/good/strong) | Texto | `senha` não vazio | `senha` vazio | Oculto |
| 4 | Toggle mostrar senha (campo senha) | Botão ícone | Sempre | — | Senha oculta |
| 5 | Toggle mostrar senha (confirmação) | Botão ícone | Sempre | — | Senha oculta |
| 6 | Link "Termos de Uso" | Botão | Sempre | — | — |
| 7 | Link "Política de Privacidade" | Botão | Sempre | — | — |
| 8 | Alerta de erro | Card vermelho | `error !== null` | `error === null` | Oculto |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Submit formulário cadastro | `/auth/register` | POST | `{ nome: sanitizeInput(nome), email: sanitizeInput(email), telefone: sanitizeInput(tel), cnpj: sanitizeInput(cnpj), nome_fantasia: sanitizeInput(nomeLoja), senha }` | Zod `registerSchema` (ver abaixo) | Sucesso: toast `t('errors.registerSuccess')`, redirect `/login` |
| 2 | Digitação telefone | — | — | — | Máscara `maskTelefone()` automática | Formato `(00) 00000-0000` |
| 3 | Digitação CNPJ | — | — | — | Máscara `maskCnpj()` automática | Formato `00.000.000/0000-00` |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| `senha` | Qualquer | Indicador de força | Recalcula score 0-4 via `getPasswordStrength()` | — |
| `senha` | Qualquer | `confirmarSenha` | Validação cruzada: devem ser iguais | `StrongPassword` rule no backend |
| `telefone` | Digitação | Campo mascarado | Auto-aplica `maskTelefone()` | `nullable, string, max:20` |
| `cnpj` | Digitação | Campo mascarado | Auto-aplica `maskCnpj()` | `CnpjRule, unique:empresas,cnpj` |

### Filtros e Ordenação
N/A

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Cadastro bem-sucedido | 200/201 | `t('errors.registerSuccess')` | toast success | 3s |
| Erro genérico | 4xx/5xx | `t('errors.accountCreateError')` | alert error inline | Persistente |
| Email já cadastrado | 422 | Mensagem do backend (campo `email`) | erro inline | Persistente |
| CNPJ já cadastrado | 422 | Mensagem do backend (campo `cnpj`) | erro inline | Persistente |
| Senhas não conferem | — | `t('errors.passwordMismatch')` | erro inline `confirmarSenha` | Persistente |
| CNPJ inválido | — | `t('errors.cnpjInvalid')` | erro inline `cnpj` | Persistente |

### Estados da Interface
- **Loading:** Botão disabled + texto "Criando..."
- **Empty:** Formulário vazio (estado inicial)
- **Error:** Alerta vermelho + erros inline por campo

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Hero section em mobile | UX — espaço limitado | Todos | `CadastroPage.tsx` (CSS `hidden lg:flex`) |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| 1 | `src/pages/CadastroPage.tsx` | `onSubmit` | `register(registerPayload)` |
| 1 | `src/stores/authStore.ts` | `register()` | `authService.register(data)` |
| 1 | `src/services/auth.service.ts` | `register()` | `api.post('/auth/register', data)` |
| Validação | `src/schemas/auth.ts` | `registerSchema` | Zod: nome req max 120, email req email, tel 10-11 dígitos, cnpj `isValidCnpj()`, senha min 8 + upper + lower + digit, confirmarSenha match, aceitoTermos true |
| Backend | `app/Http/Requests/Auth/RegisterRequest.php` | `rules()` | `nome: required string max:255`, `email: required email unique:usuarios`, `senha: required string min:8 StrongPassword`, `cnpj: required CnpjRule unique:empresas` |

---

## RecuperacaoPage

### Rota
`/recuperacao` → `RecuperacaoPage` (lazy loaded com chunk-load retry)

### Condições de Acesso
- Rota pública (sem autenticação)
- Wizard de 5 etapas: `email` → `codigo` → `verify` → `nova-senha` → `sucesso` [S4-E1 Diff Web #1]

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Nenhum endpoint ao montar (endpoints chamados por etapa) | — |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Formulário email | Card form | `step === 'email'` | Outros steps | Visível |
| 2 | Formulário código | Card form | `step === 'codigo'` | Outros steps | Oculto |
| 3 | Formulário nova senha | Card form | `step === 'nova-senha'` | Outros steps | Oculto |
| 4 | Tela de sucesso | Card confirmação | `step === 'sucesso'` | Outros steps | Oculto |
| 5 | Indicador força da senha | 4 barras coloridas | `step === 'nova-senha'` e senha não vazia | Senha vazia | Oculto |
| 6 | Email do usuário em negrito | `<strong>` | `step === 'codigo'` | Outros steps | — |
| 7 | Botão "Voltar" | Link/Button | `step !== 'email'` e `step !== 'sucesso'` | Steps email/sucesso | — |
| 8 | Botão "Reenviar código" | Button | `step === 'codigo'` | Outros steps | — [INFERIDO — verificar com a equipe] |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Enviar email (step 1) | `/auth/forgot-password` | POST | `{ email }` | Zod `emailStepSchema`: email required + formato válido | Sucesso: avança para step `codigo` [S4-E1 Diff Web #1] |
| 2 | Validar código (step 2) | `/auth/verify-reset-token` | POST | `{ email, token }` | Zod `codeStepSchema`: 6 dígitos numéricos | Sucesso: avança para step `nova-senha`. Response: `{ valid: true, expires_in }` ou erro 400/410 [S4-E1 Diff Web #1 — NOVO endpoint] |
| 3 | Redefinir senha (step 3) | `/auth/reset-password` | POST | `{ email, token, senha }` | Zod `newPasswordStepSchema`: min 8 + upper + lower + digit + match | Sucesso: avança para step `sucesso` [S4-E1 Diff Web #1] |
| 4 | Ir para login (step 4) | — | — | — | — | Navigate `/login` |
| 5 | Voltar (step codigo) | — | — | — | — | Retorna para step `email` |
| 6 | Input código | — | — | — | Remove não-dígitos: `e.target.value.replace(/\D/g, '')` | Apenas números aceitos |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| `novaSenha` | Qualquer | Indicador de força | Recalcula `getPasswordStrength()` | `StrongPassword` rule |
| `novaSenha` | Qualquer | `confirmarSenha` | Validação cruzada: devem ser iguais | — |
| `email` (step 1) | Validado | Exibição step 2 | Mostra email em negrito no step de código | — |

### Filtros e Ordenação
N/A

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Erro enviar email | 4xx | "Erro ao enviar e-mail. Tente novamente." | alert error inline | Persistente |
| Código inválido | 4xx | "Código inválido. Verifique e tente novamente." | alert error inline | Persistente |
| Erro redefinir senha | 4xx | "Erro ao redefinir senha. Tente novamente." | alert error inline | Persistente |
| Senha redefinida | — | `t('auth.passwordResetSuccess')` | tela sucesso | Persistente |

### Estados da Interface
- **Loading:** Botão disabled + texto "Enviando..." / "Verificando..." / "Redefinindo..."
- **Empty:** Formulário vazio por etapa
- **Error:** Alerta vermelho inline com mensagem
- **Success:** Tela com ícone check verde + botão "Fazer Login"

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Botão "Reenviar código" funcional | Ainda não implementado no backend [INFERIDO — verificar com a equipe] | Todos | `RecuperacaoPage.tsx` |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Step 1 | `src/hooks/useRecuperacaoWizard.ts` | `handleEnviarEmail()` | Chama `authService.forgotPassword()` → POST `/auth/forgot-password` [S4-E1 Diff Web #1 — RESOLVIDO: mock substituído por chamada real] |
| Step 2 | `src/hooks/useRecuperacaoWizard.ts` | `handleValidarCodigo()` | Chama `authService.verifyResetToken()` → POST `/auth/verify-reset-token` (NOVO endpoint) [S4-E1 Diff Web #1] |
| Step 3 | `src/hooks/useRecuperacaoWizard.ts` | `handleRedefinirSenha()` | Chama `authService.resetPassword()` → POST `/auth/reset-password` [S4-E1 Diff Web #1 — RESOLVIDO: mock substituído por chamada real] |
| Validação | `src/schemas/auth.ts` | `emailStepSchema`, `codeStepSchema`, `newPasswordStepSchema` | Zod schemas com validações |
| Backend | `app/Http/Requests/Auth/ForgotPasswordRequest.php` | — | `email: required, email` |
| Backend | `app/Http/Requests/Auth/ResetPasswordRequest.php` | — | `email: required, token: required, senha: required min:8 StrongPassword` |

---

## DashboardPage

### Rota
`/` → `DashboardPage` (lazy loaded com chunk-load retry, ProtectedRoute)

### Condições de Acesso
- Requer autenticação (`isAuthenticated`)
- Requer assinatura ativa (`isSubscriptionActive`)
- Roles backend: `check.perfil:proprietario,gestor` (endpoints de dashboard)
- Redirect se negado: `/login` (sem auth) ou `/configuracoes?tab=pagamentos` (sem assinatura)

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /dashboard/stats` | GET | `total_transacoes`, `cashbacks_validos`, `cashbacks_utilizados`, `cashbacks_expirados`, `total_cashback_concedido` | Auth + empresa.scope |
| `GET /dashboard/transacoes` | GET | Array de `TransacaoResponse` (limit: 10) | Auth + empresa.scope |
| `GET /dashboard/chart` | GET | `ChartDataPoint[]` com `periodo`, `total_cashback`, `total_vendas` | Auth + empresa.scope; param `periodo: '7d'\|'30d'\|'90d'\|'12m'` |

- **Refetch automático:** 30s (REFETCH_INTERVAL)
- **staleTime:** 30s
- **Hook composto:** `useDashboard()` combina 3 queries

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | 3 Summary Cards (topo) | Card com sparkline | Dados carregados | Loading | Skeleton |
| 2 | 4 Metric Cards (grid) | MetricCard | Dados carregados | Loading | Skeleton |
| 3 | Gráfico de linhas (7d) | SVG LineChart | `chartData` não vazio | `chartData` vazio | "Nenhuma movimentação nos últimos 7 dias" |
| 4 | Tabela de transações | Table/Cards toggle | Dados carregados | Loading | Skeleton |
| 5 | StatusSummaryCard (inclui `estornado`) | Card lateral | Dados carregados | Loading | Skeleton [S4-E1 Diff Web #2 — status `estornado` adicionado, cor: orange] |
| 6 | Alerta de erro | Card erro vermelho | `error !== null` | `error === null` | Oculto |
| 7 | SeletorUnidadeNegocio | Dropdown | Empresa com unidades | Sem unidades | — |
| 8 | Filtros avançados | Accordion | Botão filtro clicado | — | Recolhido |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Toggle view table/cards | — | — | — | — | Alterna visualização transações |
| 2 | Paginação transações | — | — | `currentPage`, `itemsPerPage` | — | Mostra "X a Y de Z resultados" |
| 3 | Filtro rápido (tipo/status/loja/período) | — | — | Filtros locais | — | Filtragem client-side |
| 4 | Filtro avançado (valor min/max, cliente, categoria) | — | — | Filtros locais | — | Botão "Aplicar Filtros" |
| 5 | Limpar filtros | — | — | — | — | Reset para defaults |
| 6 | Seleção de linhas (checkbox) | — | — | `selectedRows[]` | — | Mostra contagem selecionados |
| 7 | Ações em lote: Aprovar (→ toast), Exportar (→ `exportToExcel`), Excluir (→ toast) | — | — | `selectedRows[]` | Requer seleção ≥1 | Toast por ação [S4-E1 Diff Web #2 — RESOLVIDO: batch actions agora implementados] |
| 8 | Selecionar unidade de negócio | — | — | — | — | Filtra dados por unidade |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| `periodo` chart | `'7d'\|'30d'\|'90d'\|'12m'` | Dados do gráfico | Refetch `/dashboard/chart?periodo=X` | — |
| `itemsPerPage` | `10\|25\|50\|100` | Paginação | Recalcula totalPages e slice | — |

### Filtros e Ordenação
| Filtro | Tipo | Valores | Server/Client |
|--------|------|---------|---------------|
| Tipo | Select | all, creditado, resgatado | Client [S4-E1 Diff Web #2 — valores em PT-BR] |
| Status | Select | all, pendente, confirmado, utilizado, expirado, cancelado, congelado, estornado | Client [S4-E1 Diff Web #2 — valores em PT-BR, `estornado` adicionado] |
| Loja | Select | all, lojas dinâmicas | Client |
| Período | Select | 7 dias, 30 dias, 90 dias, custom | Client |
| Valor mínimo | Number | Livre | Client |
| Valor máximo | Number | Livre | Client |
| Cliente | Text | Nome/CPF | Client |
| Ordenação colunas | Click header | asc/desc toggle | Client (Table component) |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Erro ao carregar dados | 4xx/5xx | `t('errors.loadError')` + `t('errors.loadErrorMessage')` | alert error | Persistente |
| Tabela vazia | — | "Nenhum registro encontrado" | texto centralizado | Persistente |
| Gráfico vazio | — | "Nenhuma movimentação nos últimos 7 dias" | texto centralizado | Persistente |

### Estados da Interface
- **Loading:** 3× SkeletonMetric + 4× SkeletonMetric + SkeletonTable (5 rows, 5 cols)
- **Empty:** Mensagens "Nenhum registro encontrado" (tabela) / "Nenhuma movimentação" (gráfico)
- **Error:** Alert vermelho com ícone AlertTriangle + mensagem

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Dashboard para operador/vendedor | Backend restringe `check.perfil:proprietario,gestor` | operador, vendedor | `S1-E1-endpoints-resources.json` (middleware) |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Stats | `src/hooks/useDashboard.ts` | `useRelatorios({tipo:"resumo"}) [S4-E1 Diff Web #6]` | `dashboardService.getStats()` → `GET /dashboard/stats` |
| Transações | `src/hooks/useDashboard.ts` | `useDashboardTransacoes()` | `dashboardService.getTransacoes({ limit: 10 })` → `GET /dashboard/transacoes` |
| Chart | `src/hooks/useDashboard.ts` | `useDashboardChart()` | `dashboardService.getChart(periodo)` → `GET /dashboard/chart` |
| Métricas | `src/pages/DashboardPage.tsx` | render | MetricCards: Saldo Total, Gerados Hoje, Utilizados Hoje, Expirando 7 Dias |
| Virtual scroll | `src/components/cards/Table.tsx` | — | Auto-habilitado para 50+ linhas |

---

## GerarCashbackPage

### Rota
`/gerar-cashback` → `GerarCashbackPage` (lazy loaded, ProtectedRoute + HideWhenUN)

### Condições de Acesso
- Requer autenticação + assinatura ativa
- **HideWhenUN:** Se empresa tem unidades de negócio ativas → redirect `/` (rota bloqueada)
- Roles backend: `check.perfil:proprietario,gestor,operador,vendedor` (endpoint `POST /cashback`)
- Middleware backend: `require.idempotency` (header `Idempotency-Key` obrigatório)
- Throttle: `throttle:cashback`

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /campanhas` | GET | `id`, `nome`, `percentual` (filtro `status: 'ativa'`, limit: 100) | Auth + empresa.scope |
| `GET /config` | GET | `percentual_cashback`, `validade_cashback` | Auth + empresa.scope |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Busca de cliente (CustomerSearch) | Componente | Sempre | — | Visível |
| 2 | Seção valor da venda | Formulário | Sempre | — | Visível |
| 3 | Dropdown campanhas | Select | Campanhas ativas carregadas | Loading | — |
| 4 | Resumo cashback (CashbackSummary) | Card | `valorVenda > 0` | `valorVenda` vazio/0 | Oculto |
| 5 | Erro de cliente | Texto erro | `customerError !== null` | Cliente selecionado | Oculto |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Buscar cliente por CPF | `GET /clientes` | GET | `{ search: cpf }` | CPF 11 dígitos + `isValidCpf()` | Auto-popula nome/email/tel |
| 2 | Selecionar cliente | — | — | — | — | Card confirmação com dados |
| 3 | Gerar cashback (submit) | `POST /cashback` | POST | `{ cpf, valor_compra: float, campanha_id?: int }` | Zod `gerarCashbackSchema` + cliente obrigatório | Sucesso: toast, navigate `/` |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| CPF digitado | 11 dígitos válidos | CustomerSearch results | Auto-busca clientes | — |
| `valorVenda` | > 0 | CashbackSummary | Exibe resumo com cálculo de cashback | — |
| `campanhaId` | Selecionado | Percentual aplicado | Usa percentual da campanha em vez do padrão da empresa | Campanha deve pertencer à empresa (`exists:campanhas,id,empresa_id`) |
| `dataVenda` | Data | CashbackSummary | Calcula data de expiração (data + validade_cashback dias) | — |

### Filtros e Ordenação
N/A

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Cashback gerado | 201 | `t('errors.cashbackGenerateSuccess')` | toast success | 3s |
| Erro ao gerar | 4xx/5xx | `t('errors.cashbackGenerateFailed')` | toast error | 5s |
| Cliente não selecionado | — | `t('gerarCashback.selectCustomerError')` | erro inline | Persistente |
| Cliente não encontrado | 404 | `t('errors.customerNotFound')` | erro inline CPF | Persistente |

### Estados da Interface
- **Loading:** Botão "Gerar Cashback" disabled durante `isSubmitting`
- **Empty:** Formulário vazio, CashbackSummary oculto
- **Error:** Toast error + erros inline no formulário

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Página inteira (se tem unidades) | HideWhenUN redirect — lojistas com UN usam fluxo diferente | Todos com UN ativas | `App.tsx` HideWhenUN wrapper |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Submit | `src/pages/GerarCashbackPage.tsx` | `onSubmit` | `cashbackService.gerar({ cpf, valor_compra, campanha_id })` |
| Idempotency | `src/services/cashback.service.ts` | `gerar()` | `headers: { 'Idempotency-Key': gerarIdempotencyKey() }` |
| Campanhas | `src/hooks/useCampanhas.ts` | `useCampanhasAtivas()` | `campanhaService.listar({ status: 'ativa', limit: 100 })` |
| Config | `src/hooks/useConfig.ts` | `useConfig()` | `configService.get()` → `percentual_cashback`, `validade_cashback` |
| Backend | `app/Http/Requests/Cashback/GerarCashbackRequest.php` | — | `cpf: required CpfRule, valor_compra: required numeric min:0.01, campanha_id: nullable exists, unidade_negocio_id: nullable exists` |

---

## UtilizarCashbackPage

### Rota
`/utilizar-cashback` → `UtilizarCashbackPage` (lazy loaded, ProtectedRoute + HideWhenUN)

### Condições de Acesso
- Requer autenticação + assinatura ativa
- **HideWhenUN:** Se empresa tem unidades de negócio ativas → redirect `/`
- Roles backend: `check.perfil:proprietario,gestor,operador,vendedor` (endpoint `POST /cashback/utilizar`)
- Middleware backend: `require.idempotency`, `throttle:cashback`

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| — | — | Nenhum endpoint ao montar (wizard: endpoints por step) | — |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | MetodoSelecao | Card seleção | `step === 'metodo'` | Outros steps | Visível |
| 2 | Modal CPF | Modal | `showCpfModal === true` | `showCpfModal === false` | Oculto |
| 3 | Saldo do cliente | Card com avatar | `step === 'saldo'` | Outros steps | Oculto |
| 4 | Botão "Utilizar Cashback" | Button primary | `step === 'saldo'` e `saldo > 0` | `saldo === 0` | — |
| 5 | Aviso sem saldo | Card warning | `step === 'saldo'` e `saldo === 0` | `saldo > 0` | — |
| 6 | ConfirmacaoCompra | Card detalhes | `step === 'confirmacao'` | Outros steps | Oculto |
| 7 | Sucesso | Card sucesso | `step === 'sucesso'` | Outros steps | Oculto |
| 8 | Botão "Voltar" | Button | `step !== 'metodo'` e `step !== 'sucesso'` | Steps metodo/sucesso | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Selecionar método "Digitar Código" | — | — | — | — | Abre modal CPF |
| 2 | Buscar cliente por CPF | `GET /clientes` + `GET /clientes/{id}/saldo` | GET | `{ search: cpf, limit: 1 }` | Zod `cpfSearchSchema`: 11 dígitos + `isValidCpf()` | Mostra saldo ou erro |
| 3 | Confirmar utilização | `POST /cashback/utilizar` | POST | `{ cpf, valor_compra: saldoDisponivel }` | — | Sucesso: step 'sucesso' |
| 4 | Voltar ao início | — | — | — | — | Navigate `/` |
| 5 | Voltar step | — | — | — | — | Retorna ao step anterior |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| CPF validado | 11 dígitos | Busca cliente | `GET /clientes?search=cpf` → se encontrado → `GET /clientes/{id}/saldo` | — |
| Saldo disponível | > 0 | Botão utilizar | Habilita botão "Utilizar Cashback" | Backend calcula saldo real |
| Saldo disponível | === 0 | Mensagem aviso | Mostra "Cliente não possui saldo disponível" | — |

### Filtros e Ordenação
N/A

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Cashback utilizado | 200/201 | `t('cashback.cashbackUsedTitle')` — "Cashback Utilizado!" | tela sucesso | Persistente |
| Erro ao utilizar | 4xx/5xx | `t('errors.cashbackUseFailed')` | toast error | 5s |
| CPF não encontrado | — | `t('errors.customerNotFound')` | erro inline no modal CPF | Persistente |
| Erro busca cliente | 4xx/5xx | `t('errors.clientSearchError')` | erro inline no modal CPF | Persistente |
| Sem saldo | — | `t('cashback.noBalanceAvailable')` | card warning | Persistente |

### Estados da Interface
- **Loading (busca CPF):** `isBuscando` — botão disabled no modal
- **Loading (confirmação):** `isProcessing` — botões disabled na confirmação
- **Empty:** Tela de seleção de método (step inicial)
- **Error:** Toast error + erros inline no modal CPF
- **Success:** Tela com check verde + valor utilizado + botão "Voltar ao Início"

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Página inteira (se tem unidades) | HideWhenUN redirect | Todos com UN ativas | `App.tsx` HideWhenUN wrapper |
| Troco gerado | Sempre 0 na implementação atual | Todos | `UtilizarCashbackPage.tsx` (trocoGerado: 0) |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Busca CPF | `src/pages/UtilizarCashbackPage.tsx` | `handleCpfSubmit` | `clienteService.listar({ search, limit: 1 })` + `clienteService.getSaldo(id)` |
| Utilizar | `src/pages/UtilizarCashbackPage.tsx` | `handleConfirm` | `cashbackService.utilizar({ cpf, valor_compra })` |
| Idempotency | `src/services/cashback.service.ts` | `utilizar()` | `headers: { 'Idempotency-Key': gerarIdempotencyKey() }` |
| Backend | `app/Http/Requests/Cashback/UtilizarCashbackRequest.php` | — | `cpf: required CpfRule, valor_compra: required numeric min:0.01, unidade_negocio_id: nullable` |

---

## CampanhasPage

### Rota
`/campanhas` → `CampanhasPage` (lazy loaded, ProtectedRoute)

### Condições de Acesso
- Requer autenticação + assinatura ativa
- Roles backend: `check.perfil:proprietario,gestor` (POST/PATCH/DELETE); `check.perfil:proprietario,gestor,operador` (GET)
- Botão "+ Nova Campanha" só exibido quando `!hasUnidadesAtivas` (sem unidades de negócio ativas)

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /campanhas` | GET | `id`, `nome`, `data_inicio`, `data_fim`, `percentual`, `validade_padrao`, `status` | Auth + empresa.scope; params: `{ status?, limit: 100 }` |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | 3 Metric Cards (Ativas/Inativas/Encerradas) | MetricCard | Dados carregados | Loading | Skeleton |
| 2 | Filtro status | Select dropdown | Sempre | — | "Todas" |
| 3 | Botão "+ Nova Campanha" | Button | `!hasUnidadesAtivas` | `hasUnidadesAtivas` | Visível |
| 4 | Badge status na tabela | Badge | Sempre por linha | — | Cor conforme status |
| 5 | Botões Editar/Excluir na tabela | Links | Sempre por linha | — | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Criar campanha | `POST /campanhas` | POST | `{ nome, data_inicio, data_fim, percentual: float, validade_padrao: int }` | Zod `campaignSchema` | Sucesso: toast `t('campaigns.createSuccess')` |
| 2 | Editar campanha | `PATCH /campanhas/{id}` | PATCH | `{ nome, data_inicio, data_fim, percentual, validade_padrao }` | Zod `campaignSchema` | Sucesso: toast `t('campaigns.updateSuccess')` |
| 3 | Excluir campanha | `DELETE /campanhas/{id}` | DELETE | — | Confirmação modal | Sucesso: toast `t('campaigns.deleteSuccess')` |
| 4 | Filtrar por status | `GET /campanhas` | GET | `{ status: 'ativa'\|'inativa'\|'encerrada', limit: 100 }` | — | Refiltra tabela |
| 5 | Limpar filtros | — | — | — | — | Reset para "Todas" |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| `data_inicio` | Data | `data_fim` | Validação: data_fim deve ser após data_inicio | `after:data_inicio` |
| `percentual` | Número | Validação | Deve ser entre 0.01 e 100 | `numeric min:0.01 max:100` |
| `validade_padrao` | Inteiro | Validação | Deve ser ≥ 1 dia | `integer min:1` |

### Filtros e Ordenação
| Filtro | Tipo | Valores | Server/Client |
|--------|------|---------|---------------|
| Status | Select | Todas, Ativas, Inativas, Encerradas | Server (param `status`) |
| Ordenação colunas | Click header | Nome, Data Início, Data Fim, Percentual (sortable) | Client (Table component) |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Campanha criada | 201 | `t('campaigns.createSuccess')` | toast success | 3s |
| Campanha atualizada | 200 | `t('campaigns.updateSuccess')` | toast success | 3s |
| Campanha excluída | 200 | `t('campaigns.deleteSuccess')` | toast success | 3s |
| Erro criar | 4xx | "Erro ao criar campanha." | toast error | 5s |
| Erro atualizar | 4xx | "Erro ao atualizar campanha." | toast error | 5s |
| Erro excluir | 4xx | "Erro ao excluir campanha." | toast error | 5s |
| Confirmar exclusão | — | "Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita." | modal confirmação | Até ação |

### Estados da Interface
- **Loading:** 3× SkeletonMetric + SkeletonTable
- **Empty:** Tabela sem registros (Table component padrão)
- **Error:** Toast error

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Botão "+ Nova Campanha" com unidades ativas | Campanhas gerenciadas por unidade | Todos com UN ativas | `CampanhasPage.tsx` condição `!hasUnidadesAtivas` |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| CRUD | `src/pages/CampanhasPage.tsx` | `handleSubmit`, `handleDelete` | Mutations via hooks |
| Hooks | `src/hooks/useCampanhas.ts` | `useCriarCampanha()`, `useAtualizarCampanha()`, `useExcluirCampanha()` | Invalidação `['campanhas']` |
| Service | `src/services/campanha.service.ts` | `criar()`, `atualizar()`, `excluir()` | Endpoints REST |
| Schema | `src/schemas/campaign.ts` | `campaignSchema` | nome req max 120, dataInicio/Fim req, percentual 0.01-100, validadePadrao ≥ 1, dataFim > dataInicio |
| Backend | `app/Http/Requests/Campanha/CriarCampanhaRequest.php` | — | `nome: required, data_inicio: required date after_or_equal:today, data_fim: required after:data_inicio, percentual: required numeric min:0.01 max:100, validade_padrao: required integer min:1` |

---

## ClientesPage

### Rota
`/clientes` → `ClientesPage` (lazy loaded, ProtectedRoute)

### Condições de Acesso
- Requer autenticação + assinatura ativa
- Roles backend: `check.perfil:proprietario,gestor,operador` (GET /clientes)
- Página somente leitura (sem CRUD no frontend)

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /clientes` | GET | `nome`, `cpf`, `telefone`, `email`, `created_at` | Auth + empresa.scope; params: `{ search?, page, limit: 50 }` |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | 3 Metric Cards | MetricCard | Dados carregados | Loading | Skeleton |
| 2 | Campo de busca | Input text | Sempre | — | Vazio |
| 3 | Texto "Mostrando X de Y" | Texto info | Dados carregados | Loading | — |
| 4 | Tabela de clientes | Table | Dados carregados | Loading | Skeleton |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Buscar clientes | `GET /clientes` | GET | `{ search: debouncedSearch, page, limit: 50 }` | — | Refetch com 300ms debounce |
| 2 | Mudar página | `GET /clientes` | GET | `{ page: newPage, limit: 50 }` | — | Refetch |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| Campo de busca | Texto (300ms debounce) | Tabela + paginação | Reset `page=1` + refetch | Backend filtra por `search` |

### Filtros e Ordenação
| Filtro | Tipo | Valores | Server/Client |
|--------|------|---------|---------------|
| Busca texto | Input text | Nome, CPF, email (debounce 300ms) | Server (param `search`) |
| Ordenação colunas | Click header | Nome, Data Cadastro (sortable) | Client (Table component) |
| Paginação | Botões | page 1..N, limit: 50 | Server |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Info contagem | — | `t('customers.showingOf', { shown, total })` | texto info | Persistente |

### Estados da Interface
- **Loading:** 3× SkeletonMetric + SkeletonTable (5 rows, 5 cols)
- **Empty:** Tabela sem registros
- **Error:** Tratado pelo hook (não exibido explicitamente)

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Ações CRUD (criar/editar/excluir cliente) | Página somente leitura | Todos | `ClientesPage.tsx` — sem botões de ação |
| Clientes para vendedor | Backend restringe `check.perfil:proprietario,gestor,operador` | vendedor | `S1-E1-endpoints-resources.json` |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Listagem | `src/pages/ClientesPage.tsx` | render | `useClientes({ search, page, limit: 50 })` |
| Hook | `src/hooks/useClientes.ts` | `useClientes()` | `clienteService.listar(params)` |
| Service | `src/services/cliente.service.ts` | `listar()` | `GET /clientes` com validação `ClienteListResponseSchema` |
| Debounce | `src/hooks/useDebounce.ts` | `useDebounce(searchTerm, 300)` | 300ms delay |
| Formatação | `src/pages/ClientesPage.tsx` | render | `formatCPF()`, `formatPhone()`, `formatDate()` |

---

## VendasPage

### Rota
`/vendas` → `VendasPage` (lazy loaded, ProtectedRoute)

### Condições de Acesso
- Requer autenticação + assinatura ativa
- Roles backend: `check.perfil:proprietario,gestor,operador,vendedor` (GET /cashback)
- Cancelamento: `check.perfil:proprietario,gestor,operador` (POST /cashback/{id}/cancelar)
- Página somente leitura (lista transações mapeadas como vendas)

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /cashback` | GET | Mapeado via `mapTransacaoParaVenda()`: `id`, `created_at` → `dataHora`, `cliente.nome` → `cliente`, `valor_compra` → `valorVenda`, `valor_cashback` → `cashbackGerado`, `percentual_cashback` → `percentualAplicado`, `status_venda` → `status`, `campanha.nome` → `campanha` | Auth + empresa.scope; params: `{ status_venda?, data_inicio?, data_fim?, limit: 50 }` |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | 4 Metric Cards | MetricCard | Dados carregados | Loading | Skeleton |
| 2 | Filtros (busca, status, datas) | Grid filtros | Sempre | — | Todos vazios |
| 3 | Badge status na tabela | Badge | Sempre por linha | — | Cor conforme status |
| 4 | Cashback + percentual na tabela | Div composto | Sempre por linha | — | Valor verde + % abaixo |
| 5 | Box informativo | Card info | Sempre | — | Visível |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Filtrar por status | `GET /cashback` | GET | `{ status_venda: 'concluida'\|'cancelada' }` | — | Refetch server-side |
| 2 | Filtrar por período | `GET /cashback` | GET | `{ data_inicio, data_fim }` | data_fim ≥ data_inicio | Refetch server-side |
| 3 | Buscar por ID/cliente | — | — | `searchTerm` | — | Filtro client-side |
| 4 | Limpar filtros | — | — | — | — | Reset todos os filtros |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| `filtroStatus` | `'todos'\|'concluida'\|'cancelada'` | Query param | Refetch com status_venda | `in:concluida,cancelada` |
| `dataInicio` | Date string | Query param | Refetch com data_inicio | `date_format:Y-m-d` |
| `dataFim` | Date string | Query param | Refetch com data_fim | `after_or_equal:data_inicio` |
| `searchTerm` | Texto livre | Filtro local | Filtra por ID ou nome (client-side, case-insensitive) | — |

### Filtros e Ordenação
| Filtro | Tipo | Valores | Server/Client |
|--------|------|---------|---------------|
| Status | Select | Todos, Concluídas, Canceladas | Server (`status_venda`) |
| Data início | Date input | Livre | Server (`data_inicio`) |
| Data fim | Date input | Livre | Server (`data_fim`) |
| Busca ID/cliente | Input text | Livre | Client (filtra array local) |
| Ordenação colunas | Click header | ID, Data Hora, Cliente (sortable) | Client |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Contagem | — | `t('sales.showingCount', { count })` | texto info | Persistente |
| Info vendas | — | `t('sales.aboutSales')` + `t('sales.aboutSalesDescription')` | card info | Persistente |

### Estados da Interface
- **Loading:** 4× SkeletonMetric + SkeletonTable (5 rows, 7 cols)
- **Empty:** Tabela sem registros
- **Error:** Tratado pelo hook

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Botão cancelar venda | Não implementado na VendasPage (existe no endpoint) | — | `VendasPage.tsx` — sem ação de cancelamento |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Listagem | `src/pages/VendasPage.tsx` | render | `useVendas(params)` |
| Mapeamento | `src/hooks/useVendas.ts` | `mapTransacaoParaVenda()` | Transforma `Transacao` → `Venda` view model |
| Service | `src/services/cashback.service.ts` | `listar()` | `GET /cashback` com `TransacaoListResponseSchema` |
| Cancelar (hook) | `src/hooks/useVendas.ts` | `useCancelarVenda()` | `cashbackService.cancelar(id)` → invalida `['vendas']` + `['dashboard']` |
| Backend | `app/Http/Requests/Cashback/ListTransacoesRequest.php` | — | `status_venda: in:concluida,cancelada, status_cashback: in:pendente,confirmado,..., data_inicio/data_fim: date_format:Y-m-d` |

---

## RelatoriosPage

### Rota
`/relatorios` → `RelatoriosPage` (lazy loaded, ProtectedRoute)

### Condições de Acesso
- Requer autenticação + assinatura ativa
- Roles backend: `check.perfil:proprietario,gestor` (GET /relatorios)
- Página somente leitura com ações de exportação

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /dashboard/stats` | GET | `total_transacoes`, `total_cashback_concedido`, `cashbacks_validos`, `cashbacks_utilizados`, `cashbacks_expirados` | Auth + empresa.scope; reutiliza `useRelatorios({tipo:"resumo"}) [S4-E1 Diff Web #6]` |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | 6 MetricCards (cashback concedido, utilizado, válidos, total transações, expirados, pendentes) | MetricCard grid 3 cols | Dados carregados | Loading | Skeleton (6×) |
| 2 | Seletor de período (hoje, 7dias, 30dias, mes_atual) | Botões toggle | Sempre | — | `30dias` selecionado |
| 3 | 6 Cards de relatórios disponíveis | Card grid 3 cols | Dados carregados | Loading | Skeleton (6×) |
| 4 | Botões Exportar PDF / Excel | Button outline | Sempre | — | Visível no header |
| 5 | SeletorUnidadeNegocio | Componente | Sempre | — | No canto superior direito |
| 6 | Box informativo | Info card | Sempre | — | Visível |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Selecionar período | — | — | `setPeriodo(valor)` | valor ∈ `['hoje','7dias','30dias','mes_atual']` | Highlight no botão selecionado [INFERIDO — verificar com a equipe: seleção de período não dispara refetch, é apenas state local] |
| 2 | Exportar PDF | — | — | Gera PDF client-side via `exportToPDF()` | — | `showToast.success(t('reports.pdfExportSuccess'))` |
| 3 | Exportar Excel | — | — | Gera XLSX client-side via `exportToExcel()` | — | `showToast.success(t('reports.excelExportSuccess'))` |
| 4 | Gerar relatório (por tipo) | `GET /relatorios` | GET | `{ tipo: string, formato: 'json' }` | — | Info: `t('reports.generating', { id: tipo })` → Sucesso: `t('reports.pdfExportSuccess')` / Erro: `t('notifications.error')` |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| `periodo` | `'hoje'\|'7dias'\|'30dias'\|'mes_atual'` | Título do PDF/Excel exportado | Inclui período no nome do arquivo; não afeta query ao backend [INFERIDO — verificar com a equipe] | — |

### Filtros e Ordenação
| Filtro | Tipo | Valores | Server/Client |
|--------|------|---------|---------------|
| Período | Toggle buttons | hoje, 7dias, 30dias, mes_atual | Client (estado local, não refaz query) |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| PDF exportado | — | `t('reports.pdfExportSuccess')` | toast success | Auto |
| Excel exportado | — | `t('reports.excelExportSuccess')` | toast success | Auto |
| Gerando relatório | — | `t('reports.generating', { id })` | toast info | Auto |
| Erro geração | — | `t('notifications.error')` | toast error | Auto |

### Estados da Interface
- **Loading:** 6× SkeletonMetric + 6× SkeletonCard
- **Loaded:** MetricCards + Cards de relatórios disponíveis
- **Error:** Tratado pelo hook `useRelatorios({tipo:"resumo"}) [S4-E1 Diff Web #6]`

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Gráficos de tendência | Não implementados nesta página (dados servidos como métricas planas) | — | `RelatoriosPage.tsx` — sem Chart.js nesta tela |
| Filtro por data customizado (data_inicio/data_fim) | O endpoint `GET /relatorios` aceita, mas a UI usa apenas toggle de período pré-definido | — | `RelatoriosPage.tsx` L66-71 |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Métricas | `src/pages/RelatoriosPage.tsx` | render | `useRelatorios({tipo:"resumo"}) [S4-E1 Diff Web #6]` reutiliza dados do DashboardPage |
| Exportar PDF | `src/pages/RelatoriosPage.tsx` | `handleExportarPDF()` | Dynamic import `@/utils/exportPDF` |
| Exportar Excel | `src/pages/RelatoriosPage.tsx` | `handleExportarExcel()` | Dynamic import `@/utils/exportExcel` |
| Gerar relatório | `src/pages/RelatoriosPage.tsx` | `handleGerarRelatorio()` | `relatorioService.gerar({ tipo, formato })` |
| Service | `src/services/relatorio.service.ts` | `gerar()` | `GET /relatorios` |
| Backend | `app/Http/Requests/Relatorio/GerarRelatorioRequest.php` | — | `tipo: required\|string, data_inicio: date_format:Y-m-d, data_fim: date_format:Y-m-d, formato: in:json,csv,pdf` |

---

## ContestacoesPage

### Rota
`/contestacoes` → `ContestacoesPage` (lazy loaded, ProtectedRoute)

### Condições de Acesso
- Requer autenticação + assinatura ativa
- Roles backend: `check.perfil:proprietario,gestor,operador` (GET /contestacoes)
- Resolver contestação: `check.perfil:proprietario,gestor` (PATCH /contestacoes/{id})

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /contestacoes` | GET | `id`, `created_at`, `cliente_id`, `tipo`, `transacao_id`, `status`, `descricao`, `resposta` | Auth + empresa.scope; params: `{ status?, limit: 100 }` |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | 4 Stat Cards (total, pendentes, aprovadas, resolvidas) | Card grid 4 cols | Dados carregados | Loading | Skeleton (4×) |
| 2 | Filtro por status | Select | Sempre | — | `'todas'` |
| 3 | Tabela de contestações | Table | Dados carregados | Loading | SkeletonTable (5 rows, 7 cols) |
| 4 | Contagem de registros | Texto | Dados carregados | Loading | — |
| 5 | SeletorUnidadeNegocio | Componente | Sempre | — | No header |
| 6 | Modal de detalhes | Modal | Ao clicar "Ver detalhes" | Ao fechar | Fechado |
| 7 | Botões Aprovar/Rejeitar no modal | Button | `selectedContestacao.status === 'pendente'` | Status ≠ pendente | — |
| 8 | Resposta da loja no modal | Div info | `selectedContestacao.resposta` truthy | Sem resposta | Oculto |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Filtrar por status | `GET /contestacoes` | GET | `{ status: 'pendente'\|'aprovada'\|'rejeitada' }` | — | Refetch via React Query |
| 2 | Ver detalhes | — | — | Abre modal com `selectedContestacao` | — | Modal aberto |
| 3 | Aprovar contestação | `PATCH /contestacoes/{id}` | PATCH | `{ status: 'aprovada', resposta: t('disputes.approvedMessage') }` | `selectedContestacao` não nulo | `showToast.success(t('disputes.approvedToast'))` / Erro: `showToast.error(t('disputes.resolveError'))` |
| 4 | Rejeitar contestação | `PATCH /contestacoes/{id}` | PATCH | `{ status: 'rejeitada', resposta: t('disputes.rejectedMessage') }` | `selectedContestacao` não nulo | `showToast.success(t('disputes.rejectedToast'))` / Erro: `showToast.error(t('disputes.resolveError'))` |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| `filtroStatus` | `'todas'\|'pendente'\|'aprovada'\|'rejeitada'` | Query param `status` | Refetch com status filtrado; `'todas'` omite param | `in:pendente,aprovada,rejeitada` |
| `selectedContestacao.status` | `'pendente'` | Botões Aprovar/Rejeitar | Exibidos apenas quando `status === 'pendente'` | — |

### Filtros e Ordenação
| Filtro | Tipo | Valores | Server/Client |
|--------|------|---------|---------------|
| Status | Select | Todas, Pendentes, Aprovadas, Rejeitadas | Server (`status`) |
| Ordenação colunas | Click header | ID, Data Hora (sortable) | Client |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Contestação aprovada | — | `t('disputes.approvedToast')` | toast success | Auto |
| Contestação rejeitada | — | `t('disputes.rejectedToast')` | toast success | Auto |
| Erro ao resolver | — | `t('disputes.resolveError')` | toast error | Auto |
| Contagem | — | `t('disputes.showingCount', { count })` | texto info | Persistente |

### Estados da Interface
- **Loading:** 4× SkeletonMetric + SkeletonTable (5 rows, 7 cols)
- **Empty:** Tabela sem registros
- **Modal aberto:** Detalhes da contestação + ações condicionais
- **Resolving:** Botões Aprovar/Rejeitar desabilitados (`resolverMutation.isPending`)

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Botão criar contestação | Contestações são criadas pelo consumidor final (mobile), não pelo lojista | — | `ContestacoesPage.tsx` — sem botão de criação |
| Edição de descrição | Descrição é imutável após criação | — | `ContestacoesPage.tsx` — campo somente leitura |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Listagem | `src/pages/ContestacoesPage.tsx` | render | `useContestacoes(params)` |
| Resolver | `src/pages/ContestacoesPage.tsx` | `handleResolver()` | `resolverMutation.mutateAsync({ id, data })` |
| Hook lista | `src/hooks/useContestacoes.ts` | `useContestacoes()` | `contestacaoService.listar(params)` |
| Hook resolver | `src/hooks/useContestacoes.ts` | `useResolverContestacao()` | `contestacaoService.resolver(id, data)` → invalida `['contestacoes']` |
| Tipos | `src/types/contestacao.ts` | — | `ContestacaoTipo: 'cashback_nao_gerado'\|'valor_incorreto'\|'expiracao_indevida'\|'venda_cancelada'`, `ContestacaoStatus: 'pendente'\|'aprovada'\|'rejeitada'` |
| Backend List | `app/Http/Requests/Contestacao/ListContestacaoRequest.php` | — | `status: in:pendente,aprovada,rejeitada, limit: integer\|min:1\|max:100` |
| Backend Resolve | `app/Http/Requests/Contestacao/ResolverContestacaoRequest.php` | — | `status: required\|in:aprovada,rejeitada, resposta: required\|string\|max:500` |

---

## AuditoriaPage

### Rota
`/auditoria` → `AuditoriaPage` (lazy loaded, ProtectedRoute)

### Condições de Acesso
- Requer autenticação + assinatura ativa
- Roles backend: `check.perfil:proprietario,gestor` (GET /auditoria)
- Página somente leitura

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /auditoria` | GET | `created_at`, `usuario_id`, `usuario.nome`, `acao`, `entidade`, `dados_novos`, `dados_anteriores`, pagination `.total` | Auth + empresa.scope; params: `{ acao?, entidade?, data_inicio?, data_fim?, limit: 50 }` |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | 3 Stat Cards (total logs, ações hoje, usuários ativos) | Card grid 3 cols | Dados carregados | Loading | Skeleton (3×) |
| 2 | Filtros (busca, ação, entidade, datas) | Grid filtros | Sempre | — | Todos vazios/`'todas'` |
| 3 | Tabela de logs | Table | Dados carregados | Loading | SkeletonTable (5 rows, 5 cols) |
| 4 | Contagem de registros | Texto | Dados carregados | Loading | — |
| 5 | SeletorUnidadeNegocio | Componente | Sempre | — | No header |
| 6 | Box informativo | Info card | Sempre | — | Visível |
| 7 | Botão limpar filtros | Link text | Sempre | — | Visível |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Filtrar por ação | `GET /auditoria` | GET | `{ acao: 'login'\|'logout'\|'create'\|'update'\|'delete' }` | — | Refetch server-side |
| 2 | Filtrar por entidade | `GET /auditoria` | GET | `{ entidade: 'cliente'\|'campanha'\|'cashback'\|'contestacao'\|'usuario'\|'config' }` | — | Refetch server-side |
| 3 | Filtrar por período | `GET /auditoria` | GET | `{ data_inicio, data_fim }` | — | Refetch server-side |
| 4 | Buscar por texto | — | — | `searchTerm` | — | Filtro client-side (nome do usuário ou JSON detalhes) |
| 5 | Limpar filtros | — | — | Reset todos os estados | — | Limpa busca, ação, entidade, datas |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| `filtroAcao` | `'todas'\|'login'\|'logout'\|'create'\|'update'\|'delete'` | Query param `acao` | Refetch; `'todas'` omite param | `in:login,logout,create,update,delete` |
| `filtroEntidade` | `'todas'\|'cliente'\|'campanha'\|...` | Query param `entidade` | Refetch; `'todas'` omite param | `in:cliente,campanha,cashback,...` |
| `dataInicio` | Date string | Query param `data_inicio` | Refetch | `date_format:Y-m-d` |
| `dataFim` | Date string | Query param `data_fim` | Refetch | `date_format:Y-m-d` |
| `searchTerm` | Texto livre | Filtro local `logsFiltrados` | Filtra por `usuario.nome` ou JSON `dados_novos`/`dados_anteriores` (client-side, case-insensitive) | — |

### Filtros e Ordenação
| Filtro | Tipo | Valores | Server/Client |
|--------|------|---------|---------------|
| Ação | Select | Todas, Login, Logout, Criar, Editar, Excluir | Server (`acao`) |
| Entidade | Select | Todas, Cliente, Campanha, Cashback, Contestação, Usuário, Configuração | Server (`entidade`) |
| Data início | Date input | Livre | Server (`data_inicio`) |
| Data fim | Date input | Livre | Server (`data_fim`) |
| Busca texto | Input text | Livre | Client (filtra array local) |
| Ordenação colunas | Click header | Data Hora (sortable) | Client |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Contagem | — | `t('audit.showingLogs', { count })` | texto info | Persistente |
| Info auditoria | — | `t('audit.aboutAudit')` + `t('audit.aboutAuditDescription')` | card info | Persistente |

### Estados da Interface
- **Loading:** 3× SkeletonMetric + SkeletonTable (5 rows, 5 cols)
- **Empty:** Tabela sem registros filtrados
- **Error:** Tratado pelo hook

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Ação de exclusão de logs | Logs de auditoria são imutáveis e não podem ser excluídos | — | `AuditoriaPage.tsx` — sem botão de exclusão |
| Exportação de logs | Funcionalidade não implementada nesta tela | — | `AuditoriaPage.tsx` — sem botão de exportar |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Listagem | `src/pages/AuditoriaPage.tsx` | render | `useAuditoria(params)` com `page` + `pageSize: 20` [S4-E1 Diff Web #7 — paginação server-side adicionada] [S4-E1 Diff Web #8] |
| Hook | `src/hooks/useAuditoria.ts` | `useAuditoria()` | `auditoriaService.listar(params)` |
| Filtro client | `src/pages/AuditoriaPage.tsx` | `logsFiltrados` useMemo | Filtra por `searchTerm` em `usuario.nome` e JSON detalhes |
| Stats | `src/pages/AuditoriaPage.tsx` | `stats` useMemo | Computa `total` (pagination), `hoje` (filter by date), `usuarios` (Set unique) |
| Tipos | `src/types/auditLog.ts` | — | `AuditAction = string`, `AuditEntity = string`, `LogAuditoria = z.infer<logAuditoriaSchema>` |
| Backend | `app/Http/Requests/Auditoria/ListAuditoriaRequest.php` | — | `acao: in:login,logout,create,update,delete, entidade: in:cliente,campanha,..., data_inicio/data_fim: date_format:Y-m-d, limit: integer\|min:1\|max:100` |

---

## MultilojaPage

### Rota
`/multiloja` → `MultilojaPage` (lazy loaded, ProtectedRoute)

### Condições de Acesso
- Requer autenticação (ProtectedRoute)
- Assinatura ativa **não** é verificada nesta tela (está antes da seleção de empresa)
- Acessível quando o login retorna `token_temporario` + lista de `empresas` (multi-empresa flow no `authStore`)
- Dados vêm do `multilojaStore.empresas` (populado durante login via `GET /empresas`)

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| Nenhum direto | — | `multilojaStore.empresas`: `id`, `nome_fantasia`, `perfil` | Dados já no store (populados durante login); `usuario.nome` do `authStore` |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Título + saudação | h1 + p | Sempre | — | `t('multistore.title')` + nome do usuário |
| 2 | Grid de cards de empresas | Grid 3 cols (motion) | `empresasAtivas.length > 0` | Sem empresas | — |
| 3 | Card empresa com iniciais | motion.button | Para cada empresa | — | Iniciais coloridas (rotação LOGO_COLORS), nome, perfil |
| 4 | Alerta "sem lojas ativas" | Warning card | `empresasAtivas.length === 0` | Há empresas | Oculto |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Selecionar empresa | — | — | `selecionarEmpresa(empresa)` → `navigate('/')` | — | Salva empresa no multilojaStore + secureStorage; redireciona para Dashboard |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| `multilojaStore.empresas` | `EmpresaRef[]` | Grid de cards | Renderiza um card por empresa | Populado via `GET /empresas` durante login |
| Clique no card | `EmpresaRef` selecionada | `multilojaStore.empresaSelecionada` | Persiste no secureStorage (AES-GCM) + navega para `/` | — |

### Filtros e Ordenação
Nenhum filtro ou ordenação. A lista é exibida na ordem retornada pelo backend.

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Sem lojas ativas | — | `t('multistore.noActiveStores')` | warning card | Persistente |

### Estados da Interface
- **Normal:** Grid de cards com animação Framer Motion (fade-in + scale, delay escalonado por index)
- **Sem empresas:** Alerta warning centralizado
- **Layout:** Não usa `Layout` com sidebar — tela centralizada fullscreen

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Sidebar/Layout padrão | Tela de seleção pré-dashboard, sem navigation | — | `MultilojaPage.tsx` — não envolve com `<Layout>` |
| Botão de criar empresa | Empresas são gerenciadas no backend/admin | — | `MultilojaPage.tsx` — sem ação de criação |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Empresas | `src/stores/multilojaStore.ts` | `empresas` | Populado via `hydrate()` → `GET /empresas` |
| Seleção | `src/stores/multilojaStore.ts` | `selecionarEmpresa()` | Salva no state + `secureSetItem(STORAGE_KEY, empresa)` |
| Navegação | `src/pages/MultilojaPage.tsx` | `handleSelectEmpresa()` | `selecionarEmpresa(empresa)` + `navigate('/')` |
| Cores | `src/styles/themes.ts` | `COLORS.logoAccent` | Array de cores para iniciais dos cards |

---

## ConfiguracoesPage

### Rota
`/configuracoes` → `ConfiguracoesPage` (lazy loaded, ProtectedRoute)

### Condições de Acesso
- Requer autenticação
- Assinatura ativa **não** é obrigatória para acessar a página (é a exceção no `ProtectedRoute`: `isConfiguracoesPage → true`)
- Quando assinatura inativa: somente a tab `pagamentos` é acessível; todas as outras tabs ficam `disabled` e `opacity-50`
- Roles backend variam por tab (ver sub-seções)
- Tab `api` e `seguranca` estão **comentadas** no código e não aparecem na UI

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /assinaturas/minha` | GET | `plano.tem_unidades_negocio` → `isEmpresarial`, `plano_id`, `status` | Auth; determina tabs visíveis |
| (dados específicos por tab — ver sub-seções) | — | — | — |

### Regras de Exibição — Nível Página
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Banner assinatura inativa | Error card | `!isSubscriptionActive` | Assinatura ativa | Oculto |
| 2 | Tab "Dados da Empresa" | Tab button | Sempre | — | Selecionada (quando assinatura ativa) |
| 3 | Tab "Política Cashback" | Tab button | `!hasUnidadesAtivas` | `hasUnidadesAtivas` (gerenciada na UN) | Visível |
| 4 | Tab "Notificações" | Tab button | Sempre | — | Visível |
| 5 | Tab "Usuários" | Tab button | `!hasUnidadesAtivas` | `hasUnidadesAtivas` (gerenciada na UN) | Visível |
| 6 | Tab "Pagamentos" | Tab button | Sempre | — | Selecionada (quando assinatura inativa) |
| 7 | Tab "Unidade de Negócio" | Tab button | `isEmpresarial` (plano com `tem_unidades_negocio`) | Plano sem UN | Oculta |
| 8 | Tab "API" | Tab button | **Nunca** (comentada) | Sempre | — |
| 9 | Tab "Segurança" | Tab button | **Nunca** (comentada) | Sempre | — |

### Dependências entre Campos — Nível Página
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| `isSubscriptionActive` | `false` | Todas as tabs exceto pagamentos | Desabilitadas + `opacity-50` + `cursor-not-allowed` | — |
| `isSubscriptionActive` | `false` | `activeTab` | Forçado para `'pagamentos'` via `useEffect` | — |
| `location.state.tab` | `'pagamentos'` | `activeTab` | Auto-seleciona tab pagamentos (redirect do ProtectedRoute quando assinatura inativa) | — |
| `hasUnidadesAtivas` | `true` | Tabs "Política Cashback" e "Usuários" | Ocultadas (gestão migra para UnidadeNegocioTab) | — |
| `isEmpresarial` | `true` | Tab "Unidade de Negócio" | Exibida | `plano.tem_unidades_negocio` |

### Rastreabilidade — Nível Página
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Tab routing | `src/pages/ConfiguracoesPage.tsx` | `getInitialTab()` + `useEffect` | Determina tab inicial baseado em `isSubscriptionActive` e `location.state` |
| Tab visibility | `src/pages/ConfiguracoesPage.tsx` | `tabs` array | Spread condicional: `...(!hasUnidadesAtivas ? [...] : [])`, `...(isEmpresarial ? [...] : [])` |
| Tab disable | `src/pages/ConfiguracoesPage.tsx` | render | `isDisabled = !isSubscriptionActive && tab.id !== 'pagamentos'` |
| Lazy loading | `src/pages/ConfiguracoesPage.tsx` | imports | `lazy(() => import('./configuracoes/XxxTab'))` com `<Suspense fallback={<Loading>}>` |
| Tipos | `src/pages/configuracoes/types.ts` | `Tab` | Union: `'dados_empresa'\|'politica_cashback'\|'api'\|'notificacoes'\|'seguranca'\|'usuarios'\|'pagamentos'\|'unidade_negocio'` |

---

### ConfiguracoesPage — Tab: DadosEmpresaTab

#### Condições de Acesso
- Roles backend: `check.perfil:proprietario,gestor` (GET/PUT /config)
- Upload logo: `check.perfil:proprietario,gestor` (POST /config/logo)

#### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /config` | GET | `nome_fantasia`, `telefone`, `email`, `cnpj`, `razao_social`, `cep`, `rua`, `numero`, `complemento`, `bairro`, `cidade`, `estado`, `logo_url` | Auth + empresa.scope |

#### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Logo upload | Image + button | Sempre | — | Placeholder `ImagePlus` se sem logo |
| 2 | Dados Principais (nomeLoja, telefone, emailLoja, cnpj) | Grid 2 cols | Sempre | — | Populados do backend |
| 3 | Dados Complementares (razaoSocial, cep, rua, numero, complemento, bairro, cidade, estado) | Grid 2 cols | Sempre | — | Populados do backend |
| 4 | Spinner "Consultando..." (CNPJ) | Loader2 + text | `isLoadingCnpj` | CNPJ lookup completo | Oculto |
| 5 | Spinner "Buscando..." (CEP) | Loader2 + text | `isLoadingCep` | CEP lookup completo | Oculto |
| 6 | Botão "Salvar Dados da Empresa" | Button | `isDirty` | `!isDirty \|\| isSaving` | Desabilitado |

#### Validações (Zod — `companyDataSchema`)
| Campo | Schema | Obrigatório | Regra |
|-------|--------|-------------|-------|
| `nomeLoja` | `string().min(1).max(120)` | Sim | `t('errors.storeNameRequired')`, `t('errors.nameTooLong')` |
| `telefone` | `string().min(1).superRefine(10-11 dígitos)` | Sim | `t('errors.phoneRequired')`, `t('errors.phoneInvalid')` |
| `emailLoja` | `string().min(1).email()` | Sim | `t('errors.emailRequired')`, `t('errors.emailInvalid')` |
| `cnpj` | `string().min(1).superRefine(isValidCnpj)` | Sim | `t('errors.cnpjRequired')`, `t('errors.cnpjInvalid')` |
| `razaoSocial` | `string().max(200).optional()` | Não | `t('errors.nameTooLong')` |
| `cep` | `string().optional().refine(8 dígitos)` | Não | `'CEP inválido'` |
| `rua` | `string().max(200).optional()` | Não | — |
| `numero` | `string().max(20).optional()` | Não | — |
| `complemento` | `string().max(100).optional()` | Não | — |
| `bairro` | `string().max(100).optional()` | Não | — |
| `cidade` | `string().max(100).optional()` | Não | — |
| `estado` | `string().max(2).optional()` | Não | — |

#### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Salvar dados empresa | `PUT /config` | PUT | `{ nome_fantasia, telefone (digits only), email, razao_social, cep (digits only), rua, numero, complemento, bairro, cidade, estado }` | `companyDataSchema` (Zod, mode: onBlur) | Sucesso: `'Configurações salvas com sucesso!'` / Erro: `'Erro ao salvar configurações.'` |
| 2 | Upload logo | `POST /config/logo` | POST | `FormData(file)` | `file.type.startsWith('image/')`, `file.size ≤ 2MB`, magic bytes (JPEG/PNG/GIF/WEBP/SVG) | Sucesso: `'Logo atualizada com sucesso!'` / Erro: `'Erro ao enviar logo.'` |
| 3 | Auto-lookup CNPJ | API externa | GET | Debounced (500ms), 14 dígitos | `onlyDigits(cnpj).length === 14` | Spinner "Consultando..."; auto-preenche razaoSocial e endereço |
| 4 | Auto-lookup CEP | API externa | GET | Debounced (500ms), 8 dígitos | `onlyDigits(cep).length === 8` | Spinner "Buscando..."; auto-preenche rua, bairro, cidade, estado |

#### Máscaras de Input
| Campo | Função | Formato |
|-------|--------|---------|
| `telefone` | `maskTelefone()` | `(00) 00000-0000` ou `(00) 0000-0000` |
| `cnpj` | `maskCnpj()` | `00.000.000/0000-00` |
| `cep` | `maskCep()` | `00000-000` |

#### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Formulário | `src/pages/configuracoes/DadosEmpresaTab.tsx` | `useForm<CompanyFormData>` | zodResolver(companyDataSchema), mode: 'onBlur' |
| Salvar | `src/pages/configuracoes/DadosEmpresaTab.tsx` | `onSubmit()` | `atualizarMutation.mutate(payload)` |
| Logo | `src/pages/configuracoes/DadosEmpresaTab.tsx` | `handleLogoUpload()` | Validação MIME + magic bytes + `uploadLogoMutation.mutate(file)` |
| Lookups | `src/hooks/useCompanyLookups.ts` | `fetchCnpjData()`, `fetchCepData()` | APIs externas com debounce |
| Unsaved | `src/hooks/useUnsavedChanges.ts` | `useUnsavedChanges(isDirty)` | Previne navegação com `beforeunload` |
| Máscaras | `src/pages/configuracoes/masks.ts` | `maskTelefone`, `maskCnpj`, `maskCep`, `onlyDigits` | Formatação em tempo real |
| Schema | `src/schemas/company.ts` | `companyDataSchema` | Zod schema com validações customizadas |
| Hook | `src/hooks/useConfig.ts` | `useConfig()`, `useAtualizarConfig()`, `useUploadLogo()` | `GET/PUT /config`, `POST /config/logo` |
| Backend | `app/Http/Requests/Config/AtualizarConfigRequest.php` | — | `nome_fantasia: required\|string\|max:120, telefone: nullable\|string, email: nullable\|email, cnpj: nullable\|string\|size:14, ...` |

---

### ConfiguracoesPage — Tab: PoliticaCashbackTab

#### Condições de Acesso
- Roles backend: `check.perfil:proprietario,gestor` (PUT /config)
- Tab ocultada quando `hasUnidadesAtivas` (política gerenciada por UN)

#### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /config` | GET | `percentual_cashback`, `percentual_max_utilizacao`, `validade_cashback` | Auth + empresa.scope |

#### Validações (Zod — `cashbackPolicySchema`)
| Campo | Schema | Obrigatório | Regra |
|-------|--------|-------------|-------|
| `cbPercentualPadrao` | `number().min(0).max(100)` | Sim | `t('errors.policyPercentMin')`, `t('errors.policyPercentMax')` |
| `cbPercentualMaxUtilizacao` | `number().min(1).max(100)` | Sim | `t('errors.policyMaxUtilMin')`, `t('errors.policyPercentMax')` |
| `cbValidadePadrao` | `number().min(1)` | Sim | `t('errors.policyValidityMin')` |

#### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Salvar política | `PUT /config` | PUT | `{ percentual_cashback, percentual_max_utilizacao, validade_cashback }` | `cashbackPolicySchema` (Zod) | Sucesso: `'Política de cashback salva com sucesso!'` / Erro: `'Erro ao salvar política de cashback.'` |

#### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Formulário | `src/pages/configuracoes/PoliticaCashbackTab.tsx` | `useForm<CashbackPolicyFormData>` | zodResolver, defaults: 5%, 100%, 30 dias |
| Schema | `src/schemas/company.ts` | `cashbackPolicySchema` | Zod schema |
| Hook | `src/hooks/useConfig.ts` | `useAtualizarConfig()` | `PUT /config` |

---

### ConfiguracoesPage — Tab: NotificacoesTab

#### Condições de Acesso
- Roles backend: `check.perfil:proprietario,gestor` (GET/PUT /notificacoes/config)

#### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /notificacoes/config` | GET | Array de `{ canal: 'email'\|'sms'\|'push', ativo: boolean }` | Auth + empresa.scope |

#### Validações (Zod — `notificacoesSchema`)
| Campo | Schema | Obrigatório | Regra |
|-------|--------|-------------|-------|
| `emailNotif` | `boolean()` | Sim | — |
| `smsNotif` | `boolean()` | Sim | — |
| `pushNotif` | `boolean()` | Sim | — |

#### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Salvar preferências | `PUT /notificacoes/config` (×3) | PUT | `{ canal: 'email'\|'sms'\|'push', ativo: boolean }` por canal | `notificacoesSchema` (Zod) | Sucesso: `t('settings.notifSaveSuccess')` / Erro: `t('settings.notifSaveError')` |

#### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Formulário | `src/pages/configuracoes/NotificacoesTab.tsx` | `useForm<NotificacoesFormData>` | zodResolver, 3 checkboxes |
| Submit | `src/pages/configuracoes/NotificacoesTab.tsx` | `onSubmit()` | `Promise.all(updates.map(u => atualizarMutation.mutateAsync(u)))` — atualiza os 3 canais em paralelo |
| Schema | `src/schemas/company.ts` | `notificacoesSchema` | 3 booleans |
| Hook | `src/hooks/useNotificacoes.ts` | `useNotificacoesConfig()`, `useAtualizarNotificacao()` | `GET/PUT /notificacoes/config` |

---

### ConfiguracoesPage — Tab: UsuariosTab

#### Condições de Acesso
- Roles backend: `check.perfil:proprietario,gestor` (CRUD /usuarios)
- Tab ocultada quando `hasUnidadesAtivas` (gestão de usuários migra para UnidadeNegocioTab)

#### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /usuarios` | GET | Array de `UsuarioInterno`: `id`, `nome`, `email`, `perfil` | Auth + empresa.scope |

#### Validações (Zod — `userSchema`)
| Campo | Schema | Obrigatório | Regra |
|-------|--------|-------------|-------|
| `nome` | `string().min(1).max(120)` | Sim | — |
| `email` | `string().min(1).email()` | Sim | — |
| `perfil` | `string().min(1)` | Sim | Options: `['Gestão', 'Operação', 'Cadastro', 'Financeiro']` → mapeado para `'gestor'\|'operador'\|'vendedor'` |

#### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Criar usuário | `POST /usuarios` | POST | `{ nome, email, senha: 'crypto.randomUUID().slice(0, 12) [S4-E1 Diff Web #9 — senha aleatória]', perfil: 'gestor'\|'operador'\|'vendedor' }` | `userSchema` (Zod) | Sucesso: `'Usuário cadastrado com sucesso!'` / Erro: `'Erro ao cadastrar usuário.'` |
| 2 | Editar usuário | `PUT /usuarios/{id}` | PUT | `{ nome, email, perfil }` | `userSchema` (Zod) | Sucesso: `'Usuário atualizado com sucesso!'` / Erro: `'Erro ao atualizar usuário.'` |
| 3 | Excluir usuário | `DELETE /usuarios/{id}` | DELETE | — | Confirmação modal | Sucesso: `'Usuário excluído com sucesso!'` / Erro: `'Erro ao excluir usuário.'` |

#### Estados da Interface
- **Empty:** Mensagem `'Nenhum usuário cadastrado.'` centralizada
- **Modal Novo/Editar:** Form com nome, email, select perfil
- **Modal Excluir:** Confirmação com nome do usuário + aviso irreversível

#### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| CRUD | `src/pages/configuracoes/UsuariosTab.tsx` | handlers | `criarMutation`, `atualizarMutation`, `excluirMutation` |
| Mapeamento perfil | `src/pages/configuracoes/UsuariosTab.tsx` | `PERFIL_MAP` | `{ 'Gestão': 'gestor', 'Operação': 'operador', 'Cadastro': 'vendedor' }` |
| Senha temporária | `src/pages/configuracoes/UsuariosTab.tsx` | `onSubmitUser()` | Novo usuário recebe `senha: 'crypto.randomUUID().slice(0, 12) [S4-E1 Diff Web #9 — senha aleatória]'` [INFERIDO — verificar com a equipe: senha hardcoded] |
| Schema | `src/schemas/user.ts` | `userSchema` | Zod schema |
| Hooks | `src/hooks/useUsuarios.ts` | `useUsuarios()`, `useCriarUsuario()`, `useAtualizarUsuario()`, `useExcluirUsuario()` | CRUD `/usuarios` |
| Opções perfil | `src/pages/configuracoes/types.ts` | `perfilOptions` | `['Gestão', 'Operação', 'Cadastro', 'Financeiro']` |
| Backend Create | `app/Http/Requests/Usuario/CriarUsuarioRequest.php` | — | `nome: required\|string\|max:120, email: required\|email\|unique:usuarios, senha: required\|string\|min:8, perfil: required\|in:gestor,operador,vendedor` |
| Backend Update | `app/Http/Requests/Usuario/AtualizarUsuarioRequest.php` | — | `nome: string\|max:120, email: email\|unique:usuarios, perfil: in:gestor,operador,vendedor` |

---

### ConfiguracoesPage — Tab: PagamentosTab

#### Condições de Acesso
- Única tab acessível quando assinatura inativa
- Roles backend: `check.perfil:proprietario` (GET /planos, GET /assinaturas/minha, GET /faturas, POST /assinaturas/upgrade)

#### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /planos` | GET | `id`, `nome`, `preco_mensal`, `max_clientes`, `max_usuarios`, `nivel_relatorio`, `nivel_suporte`, `tem_unidades_negocio` | Auth; staleTime: 5min |
| `GET /assinaturas/minha` | GET | `plano_id` | Auth |
| `GET /faturas` | GET | `id`, `valor`, `data_vencimento`, `data_pagamento`, `status`, `link_pagamento`, `nfe_url` | Auth; params: `{ limit: 10 }` |

#### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Grid de planos (3 cols) | Cards | Dados carregados | Loading | Skeleton |
| 2 | Badge "Plano Atual" | Badge | `plano.id === planoAtualId` | Outro plano | — |
| 3 | Botão "Alterar Plano" | Button primary | `plano.id !== planoAtualId` | Plano atual | — |
| 4 | Botão "Plano Atual" (disabled) | Button outline | `plano.id === planoAtualId` | Outro plano | Desabilitado |
| 5 | Fatura em aberto | Card amber | `faturaAberta` existe (status `'gerada'` ou `'enviada'`) | Sem fatura aberta | Oculto |
| 6 | Link "Pagar Fatura" | Link externo | `faturaAberta.link_pagamento` truthy | Sem link | Oculto |
| 7 | Histórico de pagamentos (tabela) | Table HTML | `faturasPagas.length > 0` | Sem faturas pagas | Oculto |
| 8 | Link "Baixar NF" | Link externo | `fatura.nfe_url` truthy | Sem NF | `'-'` |

#### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Alterar plano | `POST /assinaturas/upgrade` | POST | `{ plano_id: number }` | — | Sucesso: `'Plano alterado com sucesso!'` / Erro: `'Erro ao alterar plano.'` |
| 2 | Pagar fatura | Link externo | — | `faturaAberta.link_pagamento` | — | Abre em nova aba |
| 3 | Baixar NF | Link externo | — | `fatura.nfe_url` | — | Abre em nova aba |

#### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Planos | `src/pages/configuracoes/PagamentosTab.tsx` | render | `usePlanos()` → `GET /planos` |
| Assinatura | `src/pages/configuracoes/PagamentosTab.tsx` | render | `useMinhaAssinatura()` → `GET /assinaturas/minha` |
| Faturas | `src/pages/configuracoes/PagamentosTab.tsx` | render | `useFaturas({ limit: 10 })` → `GET /faturas` |
| Upgrade | `src/pages/configuracoes/PagamentosTab.tsx` | `handleUpgrade()` | `upgradeMutation.mutate({ plano_id })` → invalida `['assinaturas']` + `['config']` |
| Hooks | `src/hooks/useAssinaturas.ts` | `usePlanos()`, `useMinhaAssinatura()`, `useUpgradeAssinatura()` | Queries + mutation |
| Hooks faturas | `src/hooks/useFaturas.ts` | `useFaturas()` | `GET /faturas` |
| Backend | `app/Http/Requests/Assinatura/UpgradeAssinaturaRequest.php` | — | `plano_id: required\|exists:planos,id` |

---

### ConfiguracoesPage — Tab: UnidadeNegocioTab

#### Condições de Acesso
- Visível apenas quando `isEmpresarial` (`plano.tem_unidades_negocio === true`)
- Roles backend: `check.perfil:proprietario,gestor` (CRUD /unidades)

#### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `GET /unidades` | GET | `id`, `nome`, `status` | Auth + empresa.scope; via `unidadeNegocioStore.unidades` |

#### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Card "Criar Unidade" | Card + Input + Button | `!configurandoUnidadeId` (tela principal) | Configurando unidade | Visível |
| 2 | Tabela "Unidades Cadastradas" | Table HTML | `unidades.length > 0` e `!configurandoUnidadeId` | Sem unidades ou configurando | Oculto |
| 3 | Badge status (Ativo/Inativo) | Badge | Por unidade | — | Cor conforme status |
| 4 | Toggle ativar/desativar | Checkbox switch | Por unidade | — | Checked se `status === 'ativa'` |
| 5 | Tela de configuração individual | Sub-view | `configurandoUnidadeId` truthy | Tela principal | Oculto |
| 6 | Sub-tabs (Política, Usuários, Campanha) | Tab buttons | Dentro da configuração individual | — | `'politica'` |

#### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Criar unidade | `POST /unidades` | POST | `{ nome: string }` | `nome.trim()` não vazio | Sucesso: `'Unidade de Negócio criada com sucesso!'` / Erro: `'Erro ao criar unidade de negócio'` |
| 2 | Toggle status | `PUT /unidades/{id}` | PUT | `{ status: 'ativa'\|'inativa' }` | — | Erro: `'Erro ao alterar status da unidade'` |
| 3 | Excluir unidade | `DELETE /unidades/{id}` | DELETE | — | Confirmação modal | Sucesso: `'Unidade de Negócio excluída!'` / Erro: `'Erro ao excluir unidade de negócio'` |
| 4 | Configurar unidade | — | — | `setConfigurandoUnidadeId(un.id)` | — | Abre sub-view de configuração |
| 5 | Salvar política UN | — | — | `cashbackPolicySchema` form | `cashbackPolicySchema` (Zod) | `'Política de cashback salva com sucesso!'` [INFERIDO — verificar com a equipe: submit não chama API, apenas toast local] |
| 6 | CRUD usuários UN | — | — | Local state `unUsers` | Nome, email, perfil obrigatórios | Toast success/error (state local, sem API) [INFERIDO — verificar com a equipe] |
| 7 | CRUD campanhas UN | — | — | Local state `unCampanhas` | `isValidDateRange`, `isValidPercentual(1-100)`, validade ≥ 1 | Toast success/error (state local, sem API) [INFERIDO — verificar com a equipe] |

#### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| CRUD unidades | `src/pages/configuracoes/UnidadeNegocioTab.tsx` | handlers | `unidadeService.criar/atualizar/excluir` → `hydrate()` |
| Store | `src/stores/unidadeNegocioStore.ts` | `unidades`, `hydrate()` | `GET /unidades` |
| Service | `src/services/unidade.service.ts` | `criar()`, `atualizar()`, `excluir()` | `POST/PUT/DELETE /unidades` |
| Política UN | `src/pages/configuracoes/UnidadeNegocioTab.tsx` | `onSubmitPolicy()` | Toast local sem chamada API [INFERIDO — verificar com a equipe] |
| Usuários UN | `src/pages/configuracoes/UnidadeNegocioTab.tsx` | local state | `unUsers: UnUsuarioLocal[]` — gerenciado em memória |
| Campanhas UN | `src/pages/configuracoes/UnidadeNegocioTab.tsx` | local state | `unCampanhas: UnCampanhaLocal[]` — gerenciado em memória, validação manual |
| Tipos | `src/pages/configuracoes/types.ts` | `UnUsuarioLocal`, `UnCampanhaLocal`, `UsuarioPerfil` | View models locais (não do backend) |

---

## DashboardClientePage

### Rota
`/cliente` → `DashboardClientePage` (lazy loaded, ProtectedRoute)

### Condições de Acesso
- Requer autenticação + assinatura ativa
- Dados: **mock** (`mockClienteDashboard`) — TODO: substituir por `GET /mobile/v1/dashboard` [INFERIDO — verificar com a equipe: endpoint mobile, não web]

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| Nenhum (mock) | — | `mockClienteDashboard`: `cliente.nome`, `cliente.saldoTotal`, `cashbacksExpirando[]` (id, valor, dataExpiracao, loja), `ultimasMovimentacoes[]` (id, tipo, data, valor, compraId) | `useSimulatedLoading()` simula delay |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Card saldo total | Card gradient (primary) | Dados carregados | Loading | Skeleton |
| 2 | Botão "Utilizar Cashback" | Link → `/utilizar-cashback` | Sempre (no card saldo) | — | — |
| 3 | Cashbacks expirando (até 3) | Cards amber | `cashbacksExpirando.length > 0` | Sem cashbacks expirando | Oculto |
| 4 | Botão "Usar agora" por cashback | Link → `/utilizar-cashback` | Por cashback expirando | — | — |
| 5 | Link "Ver todos" | Link → `/saldo` | `cashbacksExpirando.length > 0` | — | — |
| 6 | Últimas movimentações | Lista em Card | Sempre | Loading | Skeleton |
| 7 | Ícone por tipo (utilizado: Check, recebido: Plus, expirado: Timer) | Ícone | Por movimentação | — | — |
| 8 | Cor valor (utilizado: info-600, recebido: success-600, expirado: text-disabled) | Estilo | Por movimentação | — | — |
| 9 | Link "Ver histórico completo" | Link → `/historico` | Sempre | — | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Utilizar cashback | — | — | Navega para `/utilizar-cashback` | — | Link |
| 2 | Usar agora (expirando) | — | — | Navega para `/utilizar-cashback` | — | Link |
| 3 | Ver todos | — | — | Navega para `/saldo` | — | Link |
| 4 | Ver histórico completo | — | — | Navega para `/historico` | — | Link |

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Expirando | — | `t('cashback.expiringIn7Days', { count })` | h2 com ícone AlertTriangle amber | Persistente |

### Estados da Interface
- **Loading:** SkeletonMetric + SkeletonCard (4 linhas) + 3× SkeletonCard (2 linhas) — via `useSimulatedLoading()`
- **Loaded:** Saldo + expirando (condicional) + movimentações

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Sidebar de navegação admin | Tela de visão do cliente, mas usa `<Layout>` do lojista | — | `DashboardClientePage.tsx` — TODO |
| Dados reais | Mock hardcoded; endpoint real é mobile (`/mobile/v1/dashboard`) | — | `import { mockClienteDashboard } from '@/mocks/clienteData'` |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Mock data | `src/mocks/clienteData.ts` | `mockClienteDashboard` | Dados estáticos (TODO: substituir por API) |
| Loading | `src/hooks/useSimulatedLoading.ts` | `useSimulatedLoading()` | Simula loading state |
| Componente | `src/pages/DashboardClientePage.tsx` | render | Layout + mock data |

---

## SaldoClientePage

### Rota
`/cliente/saldo` → `SaldoClientePage` (lazy loaded, ProtectedRoute)

### Condições de Acesso
- Requer autenticação + assinatura ativa
- Dados: **mock** (`mockSaldoDetalhado`) — TODO: substituir por `GET /mobile/v1/saldo` [INFERIDO — verificar com a equipe: endpoint mobile, não web]

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| Nenhum (mock) | — | `mockSaldoDetalhado`: `saldoTotal`, `porLoja[]` (lojaId, lojaNome, saldo, cashbacks, ultimaAtualizacao), `estatisticas` (totalRecebido, totalUtilizado, totalExpirado, economia) | `useSimulatedLoading()` |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Card saldo disponível | Card gradient (primary) | Dados carregados | Loading | Skeleton |
| 2 | 4 MetricCards (total recebido, utilizado, expirado, economia) | MetricCard grid 4 cols | Dados carregados | Loading | Skeleton (4×) |
| 3 | Saldo por loja | Cards (1 por loja) | Sempre | Loading | Skeleton |
| 4 | Link "Ver detalhes" por loja | Link → `/extrato` | Por loja | — | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Ver detalhes por loja | — | — | Navega para `/extrato` | — | Link |

### Estados da Interface
- **Loading:** SkeletonCard (3 linhas) + 4× SkeletonMetric + 2× SkeletonCard (3 linhas)
- **Loaded:** Saldo + métricas + lista por loja

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Dados reais | Mock hardcoded; endpoint real é mobile | — | `import { mockSaldoDetalhado } from '@/mocks/clienteData'` |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Mock data | `src/mocks/clienteData.ts` | `mockSaldoDetalhado` | Dados estáticos |
| Componente | `src/pages/SaldoClientePage.tsx` | render | Layout + mock data |

---

## ExtratoCashbackPage

### Rota
`/cliente/extrato` → `ExtratoCashbackPage` (lazy loaded, ProtectedRoute)

### Condições de Acesso
- Requer autenticação + assinatura ativa
- Dados: **mock** (`mockExtrato`) — TODO: substituir por `GET /mobile/v1/extrato` [INFERIDO — verificar com a equipe: endpoint mobile, não web]

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| Nenhum (mock) | — | `mockExtrato[]`: `data`, `tipo` (gerado/utilizado/expirado), `valor`, `loja`, `status` | `useSimulatedLoading()` |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Filtros por tipo (todos, gerado, utilizado, expirado) | Botões toggle | Sempre | — | `'todos'` selecionado |
| 2 | Tabela de extrato | Table | Dados carregados | Loading | SkeletonTable (5 rows, 5 cols) |
| 3 | Cor do valor (gerado: success-600 +, utilizado: info-600 -, expirado: text-disabled) | Estilo | Por linha | — | — |
| 4 | Badge status | Badge | Por linha | — | Cor conforme status |
| 5 | Box informativo | Info card | Sempre | — | Visível |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Filtrar por tipo | — | — | `setFiltro(tipo)` | tipo ∈ `['todos','gerado','utilizado','expirado']` | Filtro client-side sobre `mockExtrato` |

### Filtros e Ordenação
| Filtro | Tipo | Valores | Server/Client |
|--------|------|---------|---------------|
| Tipo | Toggle buttons | todos, gerado, utilizado, expirado | Client |
| Ordenação colunas | Click header | Data Hora (sortable) | Client |

### Estados da Interface
- **Loading:** SkeletonTable (5 rows, 5 cols)
- **Loaded:** Filtros + tabela filtrada

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Dados reais | Mock hardcoded; endpoint real é mobile | — | `import { mockExtrato } from '@/mocks/clienteData'` |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Mock data | `src/mocks/clienteData.ts` | `mockExtrato` | Dados estáticos |
| Filtro | `src/pages/ExtratoCashbackPage.tsx` | `extratoFiltrado` useMemo | Filtra `mockExtrato` por `tipo` |
| Componente | `src/pages/ExtratoCashbackPage.tsx` | render | Layout + filtros + tabela |
| Tipos | `src/types/extrato.ts` | `ExtratoEntry` | Tipo de entrada do extrato |

---

## HistoricoUsoPage

### Rota
`/cliente/historico` → `HistoricoUsoPage` (lazy loaded, ProtectedRoute)

> **Nota:** Esta tela aparece em `App.tsx` mas **não** consta no `S1-E1-consumers-cruzamento.json`. [INFERIDO — verificar com a equipe]

### Condições de Acesso
- Requer autenticação + assinatura ativa
- Dados: **mock** (`mockHistorico`) — TODO: substituir por `GET /mobile/v1/historico` [INFERIDO — verificar com a equipe: endpoint mobile, não web]

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| Nenhum (mock) | — | `mockHistorico[]`: `id`, `compraId`, `data`, `economizado`, `loja`, `valorCompra`, `valorCashbackUsado` | `useSimulatedLoading()` |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Card "Total Economizado" | Card gradient (green) | Dados carregados | Loading | Skeleton |
| 2 | Contagem de utilizações | Texto | Dados carregados | — | `t('cashback.inUses', { count })` |
| 3 | Lista de cards de uso | Cards por uso | Dados carregados | Loading | Skeleton (3×) |
| 4 | Por card: compraId, data, economizado, loja, valorCompra, valorCashbackUsado, diferença | Grid 2×2 | Por item | — | — |

### Regras de Interação
Nenhuma interação além de navegação via breadcrumb (`/` → Histórico).

### Estados da Interface
- **Loading:** SkeletonCard (3 linhas) + 3× SkeletonCard (4 linhas)
- **Loaded:** Card total + lista de usos

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Dados reais | Mock hardcoded; endpoint real é mobile | — | `import { mockHistorico } from '@/mocks/clienteData'` |
| Filtros / paginação | Não implementados (lista fixa do mock) | — | `HistoricoUsoPage.tsx` — sem estado de filtro |

### Rastreabilidade
| Regra # | Arquivo | Método | Evidência |
|---------|---------|--------|-----------|
| Mock data | `src/mocks/clienteData.ts` | `mockHistorico` | Dados estáticos |
| Total | `src/pages/HistoricoUsoPage.tsx` | `totalEconomizado` | `reduce((sum, uso) => sum + uso.economizado, 0)` |
| Componente | `src/pages/HistoricoUsoPage.tsx` | render | Layout + card total + lista |

---

# Glossário de Permissões (Web)

| Permissão (middleware) | Descrição | Telas Afetadas |
|------------------------|-----------|----------------|
| `auth:api` | JWT Bearer obrigatório | Todas as telas (exceto Login, Cadastro, Recuperação) |
| `empresa.scope` | Multi-tenancy — filtra dados pela empresa do token | Todas as telas autenticadas |
| `check.assinatura` | Assinatura ativa ou trial | Todas exceto Login, Cadastro, Recuperação, Configurações (parcial), Multiloja |
| `check.perfil:proprietario` | Perfil proprietário | Pagamentos (upgrade), Configurações gerais |
| `check.perfil:proprietario,gestor` | Proprietário ou gestor | Relatórios, Auditoria, Config (DadosEmpresa, Política, Notificações, Usuários, UN) |
| `check.perfil:proprietario,gestor,operador` | Proprietário, gestor ou operador | Contestações (listar), Campanhas (CRUD), GerarCashback, UtilizarCashback |
| `check.perfil:proprietario,gestor,operador,vendedor` | Todos os perfis | Dashboard, Clientes (listar), Vendas (listar), Cashback (listar) |
| `require.idempotency` | Header `Idempotency-Key` obrigatório | GerarCashback (gerar), UtilizarCashback (utilizar) |
| `throttle:cashback_gerar` | Rate limit operações de cashback | GerarCashback |
| `throttle:cashback_utilizar` | Rate limit operações de utilização | UtilizarCashback |
| `throttle:login` | Rate limit login (10/min frontend, backend varia) | LoginPage |
| `etag` | Cache com ETag para GETs | Dashboard stats, Clientes, Campanhas |

---

# Tabela de Status (Web)


---

## Infraestrutura S3 — Contract Layer [S4-E1 Diff Web — Seção Nova]

### Zod Contract Layer
- **12 domain schemas** em `src/contracts/schemas/` (64 `z.object`, 75 `z.infer`)
- **`apiCall<T>` wrapper**: `schema.safeParse()` + graceful degradation em `src/contracts/apiCall.ts`
- **Validação Runtime**: Todos os responses passam por validação Zod; falhas são reportadas via `reportContractViolation()` sem quebrar a UI
- **`getContractViolations()`**: Acesso programático às violações de contrato (debug/monitoring)

### Enum Forward-Compatibility
| Enum | Valores aceitos no Zod (extras vs backend) |
|------|---------------------------------------------|
| `status_cashback` | `estornado` (Zod aceita, backend ainda não retorna) |
| `perfil_usuario` | `financeiro` (Zod aceita, backend ainda não retorna) |
| `perfil_usuario` | `proprietario` (Zod aceita, backend retorna) |

### Legacy Mock WARNING
- `CustomerSearch.tsx` importa `src/mocks/gerarCashbackData.ts` em **produção** — bypass da cadeia Zod
- Marcar para cleanup em sprint futura

## status_cashback
| Valor | Label PT-BR | Cor Badge | Transições Permitidas | Telas que Exibem |
|-------|-------------|-----------|----------------------|------------------|
| `pendente` | Pendente | amber | → `confirmado`, → `cancelado` | Dashboard, GerarCashback, Vendas |
| `confirmado` | Confirmado | green | → `utilizado`, → `expirado`, → `cancelado` | Dashboard, UtilizarCashback, Vendas |
| `utilizado` | Utilizado | blue | (final) | Dashboard, UtilizarCashback, Vendas, ExtratoCashback |
| `expirado` | Expirado | gray | (final) | Dashboard, Vendas, ExtratoCashback |
| `cancelado` | Cancelado | red | (final) | Dashboard, Vendas |
| `estornado` | Estornado | orange | (final) | Vendas |

| estornado | Estornado | `orange` | Estado final | [S4-E1 Diff Web #2 — novo status] |

## status_venda
| Valor | Label PT-BR | Cor Badge | Telas que Exibem |
|-------|-------------|-----------|------------------|
| `concluida` | Concluída | green | Vendas |
| `cancelada` | Cancelada | red | Vendas |

## status_campanha
| Valor | Label PT-BR | Cor Badge | Transições Permitidas | Telas que Exibem |
|-------|-------------|-----------|----------------------|------------------|
| `ativa` | Ativa | green | → `finalizada` | Campanhas, GerarCashback (seletor) |
| `agendada` | Agendada | blue | → `ativa` (automática por data) | Campanhas |
| `finalizada` | Finalizada | gray | (final) | Campanhas |

## status_contestacao
| Valor | Label PT-BR | Cor Badge | Transições Permitidas | Telas que Exibem |
|-------|-------------|-----------|----------------------|------------------|
| `pendente` | Pendente | amber | → `aprovada`, → `rejeitada` | Contestações |
| `aprovada` | Aprovada | green | (final) | Contestações |
| `rejeitada` | Rejeitada | red | (final) | Contestações |

## status_assinatura
| Valor | Label PT-BR | Cor Badge | Telas que Exibem |
|-------|-------------|-----------|------------------|
| `ativa` | Ativa | green | Configurações (Pagamentos) |
| `trial` | Trial | blue | Configurações (Pagamentos) |
| `inativa` | Inativa | red | Configurações (banner + forçar tab Pagamentos) |
| `cancelada` | Cancelada | gray | Configurações (Pagamentos) |

## status_fatura
| Valor | Label PT-BR | Cor Badge | Telas que Exibem |
|-------|-------------|-----------|------------------|
| `gerada` | Gerada | amber | Configurações (Pagamentos — fatura aberta) |
| `enviada` | Enviada | blue | Configurações (Pagamentos — fatura aberta) |
| `paga` | Paga | green | Configurações (Pagamentos — histórico) |
| `vencida` | Vencida | red | Configurações (Pagamentos) |
| `cancelada` | Cancelada | gray | Configurações (Pagamentos) |

## perfil_usuario

> **[S4-E1 Diff Web #9]**: Perfil `financeiro` adicionado ao enum.
| Valor | Label PT-BR | Nível Acesso | Telas com Restrição |
|-------|-------------|-------------|---------------------|
| `proprietario` | Proprietário | Total | Nenhuma restrição |
| `gestor` | Gestor | Alto | Sem acesso a upgrade de plano |
| `operador` | Operador | Médio | Sem acesso a: Relatórios, Auditoria, Configurações (DadosEmpresa, Política, Notificações, Usuários, UN) |
| `vendedor` | Vendedor | Básico | Apenas: Dashboard, Clientes (listar), Vendas (listar), Cashback (listar) |

---

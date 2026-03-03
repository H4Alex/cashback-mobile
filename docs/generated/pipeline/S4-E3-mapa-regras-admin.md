# S4-E3 — Mapa de Regras de Negócio: Consumer ADMIN

> Documento atualizado a partir do mapa S1-E3 com as mudanças identificadas em S4-E1 (diff) e S4-E2 (Swagger changelog).
> Referência: `S1-E3-mapa-regras-admin.md`, `S4-E1-diff-mudancas.md`, `S4-E2-swagger-changelog.md`, `S4-E2-swagger-openapi.yaml`

**Stack**: React 18.2.0 + TypeScript 5.3.3 + Vite 6.4.1 + Material-UI (MUI) + Zustand 4.4.7 + TanStack React Query 5.14.2 + Axios + Zod
**Base URL**: `import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'`
**Auth**: JWT Bearer token (localStorage), chave `h4cb_admin_token`
**Error Handling**: Interceptor — 401 auto-refresh → logout; Zod runtime validation via `apiCall<T>` wrapper em todas as responses (S3)
**Contract Layer (S3)**: Dual schema — `src/contracts/schemas/` (canonical) + `src/schemas/admin.schema.ts` (legacy). `apiCall<T>` com `schema.safeParse()` + graceful degradation
**Response Envelope**: Todas as responses seguem `{ status: boolean, data: T, error: null|ApiErrorDetail, message: string }` (S4-E1 MUDANÇA #1)

---

## 1. LoginPage

### Rota
- **Path**: `/login`
- **Componente**: `LoginPage` (`src/pages/LoginPage.tsx`)
- **Lazy Loading**: Sim (`React.lazy`)

### Condições de Acesso
| Condição | Comportamento | Origem |
|----------|--------------|--------|
| Rota pública | Sem proteção `AdminRoute` — qualquer visitante pode acessar | `src/App.tsx:47` |
| Usuário já autenticado e `tipo_global === 'admin'` | **Auto-redirect** para `/` (Dashboard) — não exibe formulário de login | `src/pages/LoginPage.tsx:27` ⚠️ ATUALIZADO S4: Ref Diff #49 |
| Usuário autenticado mas `tipo_global !== 'admin'` | Erro exibido: "Acesso restrito a administradores do sistema." | `src/stores/authStore.ts:37-42` |

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| Nenhum | — | — | O formulário é puramente local; nenhum endpoint é chamado ao montar a tela |

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Logo H4Cashback Admin | Ícone `Shield` + texto | Sempre | — | Visível |
| 2 | Subtítulo "Painel Administrativo SaaS" | Texto | Sempre | — | Visível |
| 3 | Card de Login | Form | Sempre | — | Visível |
| 4 | Alerta de erro | Div vermelho (`error-50`) | `error !== null` no authStore | Quando `clearError()` é chamado | Oculto |
| 5 | Botão "Mostrar senha" (Eye/EyeOff) | Ícone toggle | Sempre | — | Senha oculta (`type="password"`) |
| 6 | Spinner no botão "Entrar" | Loading | `isLoading === true` | `isLoading === false` | Oculto |
| 7 | Rodapé "Acesso restrito a administradores" | Texto | Sempre | — | Visível |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Submeter login | `/auth/login` | POST | `{ email, senha, plataforma: 'web' }` | **Frontend**: email obrigatório + regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`; senha obrigatória + **min 8 chars** (⚠️ ATUALIZADO S4: era 6, agora 8 — Ref Diff #55). **Zod**: `loginRequestSchema` em `auth.schemas.ts` formaliza validação. **Backend (LoginRequest)**: email required + email; senha required + string; plataforma nullable in:web,mobile | Sucesso: navega para `/`. Erro: exibe mensagem via `obterMensagemErro()` no store |
| 2 | Toggle mostrar/ocultar senha | — | — | — | — | Alterna ícone Eye ↔ EyeOff e `type` do input |
| 3 | Fechar alerta de erro | — | — | — | — | Chama `clearError()` no authStore |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| — | — | — | Não há dependências entre campos | — |

### Filtros e Ordenação (listagens)
Não aplicável — tela de formulário.

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Credenciais inválidas | 401 | "Credenciais inválidas." | Error alert | Até fechar |
| Acesso não-admin | — | "Acesso restrito a administradores do sistema." | Error alert | Até fechar |
| Acesso não autorizado | 403 | "Acesso não autorizado." | Error alert | Até fechar |
| Dados inválidos | 422 | "Dados inválidos." | Error alert | Até fechar |
| Rate limit | 429 | "Muitas tentativas. Tente novamente em instantes." | Error alert | Até fechar |
| Sem conexão | — | "Sem conexão com o servidor." | Error alert | Até fechar |
| Erro genérico | Nxx | "Erro {status}" | Error alert | Até fechar |
| Email vazio | — | "Email obrigatório" | Inline (react-hook-form) | Até corrigir |
| Email inválido | — | "Email inválido" | Inline | Até corrigir |
| Senha vazia | — | "Senha obrigatória" | Inline | Até corrigir |
| Senha curta | — | "Mínimo 8 caracteres" | Inline | Até corrigir | ⚠️ ATUALIZADO S4: era "6", agora "8" — Ref Diff #55 |

### Estados da Interface
| Estado | Condição | UI |
|--------|----------|-----|
| **Idle** | `isLoading === false && error === null` | Formulário habilitado |
| **Loading** | `isLoading === true` | Botão com spinner, formulário desabilitado implicitamente |
| **Error** | `error !== null` | Banner de erro acima do formulário |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Link "Criar conta" | Admin é criado internamente, não via registro público | Todos | Design da tela |
| Link "Esqueci minha senha" | Não implementado para admin | Todos | Design da tela |
| Campos de 2FA | Admin não possui 2FA no fluxo de login | Todos | `src/pages/LoginPage.tsx` |

### Rastreabilidade
| Regra # | Arquivo | Método/Linha | Evidência |
|---------|---------|-------------|-----------|
| Validação tipo_global | `src/stores/authStore.ts` | `login()` L37-42 | `if (loginData.usuario.tipo_global !== 'admin')` |
| Plataforma 'web' hardcoded | `src/stores/authStore.ts` | `login()` L33 | `plataforma: 'web'` |
| Token localStorage | `src/utils/token.utils.ts` | `salvarToken()` L3 | `localStorage.setItem('h4cb_admin_token', token)` |
| Validação Zod response | `src/services/auth.service.ts` | `login()` L20 | `validateResponse(AdminLoginResponseSchema, ...)` |
| Zod loginRequestSchema (S3) | `src/contracts/schemas/auth.schemas.ts` | `loginRequestSchema` | Schema formalizado: email z.string().email(), senha z.string().min(8) |
| Auto-redirect se autenticado (S4) | `src/pages/LoginPage.tsx` | L27 | Verifica `isAuthenticated && tipo_global === 'admin'` → `navigate('/')` |
| Backend LoginRequest | `app/Http/Requests/Auth/LoginRequest.php` | `rules()` | email: required,email; senha: required,string |
| Backend admin middleware | `routes/api.php` | L151 | `check.perfil:admin` (não se aplica ao login, mas ao restante) |

#### Rastreabilidade S4 — LoginPage
| Regra # | Arquivo | Método | Evidência | Ref Diff |
|---------|---------|--------|-----------|----------|
| Auto-redirect autenticado | `src/pages/LoginPage.tsx` | L27 | `navigate('/')` se já logado como admin | Ref Diff: MUDANÇA #49 |
| Senha min 6→8 | `src/pages/LoginPage.tsx` | validação form | `minLength: 8` (era 6) | Ref Diff: MUDANÇA #55 |
| Zod schema formalizado | `src/contracts/schemas/auth.schemas.ts` | `loginRequestSchema` | Schema Zod canonical para login request | Ref Diff: S3 Zod Contract Layer |

---

## 2. DashboardPage

### Rota
- **Path**: `/`
- **Componente**: `DashboardPage` (`src/pages/DashboardPage.tsx`)
- **Lazy Loading**: Sim (`React.lazy`)
- **Layout**: `AdminLayout` (sidebar + header)

### Condições de Acesso
| Condição | Comportamento | Origem |
|----------|--------------|--------|
| Protegida por `AdminRoute` | Requer `isAuthenticated === true` e `usuario.tipo_global === 'admin'` | `src/components/routing/AdminRoute.tsx:19-25` |
| Não autenticado | Redirect para `/login` | `src/components/routing/AdminRoute.tsx:20` |
| `tipo_global !== 'admin'` | Redirect para `/login` | `src/components/routing/AdminRoute.tsx:23-25` |
| Inicializando (verificando sessão) | Exibe `Loading fullscreen "Verificando sessão..."` | `src/components/routing/AdminRoute.tsx:15-17` |

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `/admin/dashboard` | GET | `gmv_total`, `total_estabelecimentos`, `usuarios_ativos`, `cashback_circulacao`, `cashback_resgatado`, `novos_cadastros_30d`, `top_estabelecimentos[]` (com `empresa_id`, `gmv`, `transacoes`, `empresa.nome_fantasia`) | Auth JWT token; middleware `check.perfil:admin` |

**React Query Config**:
- `queryKey`: `['admin-dashboard']`
- `staleTime`: 2 minutos (120.000ms)
- `retry`: 2 (herança global do QueryClient)
- `retryDelay`: exponential backoff (1s, 2s, ... max 30s)

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Header "Dashboard" + subtítulo | Texto | Sempre | — | Visível |
| 2 | Grid de 6 SkeletonCards | Loading placeholder | `isLoading === true` | `isLoading === false` | Oculto |
| 3 | Card de erro | Card com ícone `AlertTriangle` | `error !== null` | — | Oculto |
| 4 | Card "GMV Total" | MetricCard (cor `success`) | `data` disponível | — | Oculto até carregar |
| 5 | Card "Estabelecimentos" | MetricCard (cor `primary`) | `data` disponível | — | Oculto até carregar |
| 6 | Card "Usuários Ativos" | MetricCard (cor `info`) | `data` disponível | — | Oculto até carregar |
| 7 | Card "Cashback em Circulação" | MetricCard (cor `warning`) | `data` disponível | — | Oculto até carregar |
| 8 | Card "Cashback Resgatado" | MetricCard (cor `error`) | `data` disponível | — | Oculto até carregar |
| 9 | Card "Novos Cadastros (30d)" | MetricCard (cor `primary`) | `data` disponível | — | Oculto até carregar |
| 10 | Seção "Top Estabelecimentos por GMV" | Card com lista | `data.top_estabelecimentos.length > 0` | Lista vazia ou sem data | Oculto |
| 11 | Rodapé com timestamp relativo em cada card | Texto com ícone `ArrowUpRight` — **`formatRelativeTime()`** dinâmico: exibe "Xs", "Xmin", "HH:MM" conforme tempo decorrido | Sempre (dinâmico) | — | Visível | ⚠️ ATUALIZADO S4: era "Atualizado agora" estático, agora `formatRelativeTime()` dinâmico |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| — | Sem ações interativas | — | — | — | — | Tela apenas de visualização; dados carregados automaticamente |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| — | — | — | Sem dependências — todos os dados vêm de uma única chamada | — |

### Filtros e Ordenação (listagens)
Não aplicável — métricas consolidadas sem filtro.

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Erro ao carregar | qualquer | "Erro ao carregar métricas. Tente recarregar a página." | Card de erro inline | Persistente |

### Estados da Interface
| Estado | Condição | UI |
|--------|----------|-----|
| **Loading** | `isLoading === true` | Grid com 6 SkeletonCards |
| **Error** | `error !== null` | Card com ícone `AlertTriangle` e mensagem |
| **Success** | `data !== null` | Grid de MetricCards + seção Top Estabelecimentos |
| **Empty (parcial)** | `data.top_estabelecimentos.length === 0` | Cards de métricas visíveis, seção Top oculta |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Gráficos / charts | Dashboard Admin é simplificado; charts são do consumer Web | admin | `src/pages/DashboardPage.tsx` |
| Filtro de período | Métricas são consolidadas globais sem filtro temporal no frontend | admin | `src/pages/DashboardPage.tsx` |
| Botões de ação | Tela read-only, ações estão em telas específicas | admin | Design da tela |

### Rastreabilidade
| Regra # | Arquivo | Método/Linha | Evidência |
|---------|---------|-------------|-----------|
| Chamada GET /admin/dashboard | `src/services/admin.service.ts` | `dashboard()` L33-37 | `api.get('/admin/dashboard')` |
| Zod validation (legacy) | `src/schemas/admin.schema.ts` | `DashboardSchema` L134-142 | Schema com gmv_total, top_estabelecimentos etc. |
| Zod validation (canonical S3) | `src/contracts/schemas/` | dashboardSchema | Schema Zod canonical via apiCall<T> |
| staleTime 2min | `src/pages/DashboardPage.tsx` | L26 | `staleTime: 2 * 60 * 1000` |
| formatRelativeTime (S4) | `src/utils/format.utils.ts` | `formatRelativeTime()` | Converte timestamp para "Xs", "Xmin", "HH:MM" dinâmico |
| Backend controller | `app/Http/Controllers/Api/V1/AdminDashboardController.php` | `index()` | Retorna métricas agregadas de todas as empresas |
| Backend middleware | `routes/api.php` | L153 | `Route::get('/dashboard', [AdminDashboardController::class, 'index'])` |
| Formatação moeda | `src/utils/format.utils.ts` | `formatCurrency()` L1-6 | `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` |

#### Rastreabilidade S4 — DashboardPage
| Regra # | Arquivo | Método | Evidência | Ref Diff |
|---------|---------|--------|-----------|----------|
| Timestamp dinâmico | `src/utils/format.utils.ts` | `formatRelativeTime()` | "Atualizado agora" estático → timestamp relativo dinâmico (Xs, Xmin, HH:MM) | Ref Diff: MUDANÇA Admin #2 (INFERIDO→RESOLVIDO) |
| Zod schema formalizado | `src/contracts/schemas/` | dashboardSchema | Schema Zod canonical adicionado em S3 | Ref Diff: S3 Zod Contract Layer |

---

## 3. EmpresasPage

### Rota
- **Path**: `/empresas`
- **Componente**: `EmpresasPage` (`src/pages/EmpresasPage.tsx`)
- **Lazy Loading**: Sim (`React.lazy`)
- **Layout**: `AdminLayout`

### Condições de Acesso
| Condição | Comportamento | Origem |
|----------|--------------|--------|
| Protegida por `AdminRoute` | Requer `isAuthenticated === true` e `tipo_global === 'admin'` | `src/App.tsx:59-64` |
| Não autenticado | Redirect `/login` | `src/components/routing/AdminRoute.tsx:20` |

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `/admin/empresas` | GET | `data[]` (id, nome_fantasia, cnpj, email, created_at, assinatura_ativa.status), `pagination` (current_page, last_page, total) | Auth JWT; `check.perfil:admin` |

**React Query Config**:
- `queryKey`: `['admin-empresas', search, statusFilter, page]`
- `staleTime`: 30 segundos
- `retry`: 2 (global)

**Parâmetros enviados**: `{ search?, status?, page, limit: 15 }`

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Header "Empresas" + subtítulo | Texto | Sempre | — | Visível |
| 2 | Contador total de empresas | Badge numérico com ícone `Building2` | `data.pagination.total` disponível | — | "0 empresas" |
| 3 | Campo de busca | Input texto com ícone `Search` | Sempre | — | Vazio |
| 4 | Filtro de status | Select dropdown | Sempre | — | "Todos os status" |
| 5 | Tabela (DataTable) | Colunas: Empresa, Email, Status, Criação, Ações | `data.data[]` disponível | — | Loading skeleton |
| 6 | Coluna "Email" | Texto | `md` breakpoint+ | Telas pequenas | `hidden md:table-cell` |
| 7 | Coluna "Criação" | Data formatada | `lg` breakpoint+ | Telas médias/pequenas | `hidden lg:table-cell` |
| 8 | Badge de status por empresa | Badge colorido | Sempre na coluna Status | — | Baseado em `assinatura_ativa.status` |
| 9 | Botão "Ver" (navega detalhe) | Button ghost | Sempre | — | Visível |
| 10 | Botão bloquear (ícone Lock) | Button ghost | Status = `ativa`, `trial` ou `inadimplente` | Outros status | Condicional | ⚠️ ATUALIZADO S4: `inadimplente` adicionado — Ref Diff #20 |
| 11 | Botão desbloquear (ícone Unlock) | Button ghost | Status = `cancelada` | Outros status | Condicional |
| 12 | Modal de confirmação | Modal | Ao clicar bloquear/desbloquear | Ao cancelar ou confirmar | Oculto |
| 13 | Paginação | Componente DataTable | `pagination` presente na response | — | Condicional |
| 14 | Empty state | Texto "Nenhuma empresa encontrada" | Lista vazia | — | Oculto |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Buscar por nome/CNPJ | `/admin/empresas` | GET | `{ search: string, page: 1 }` | Nenhuma validação frontend; reseta page para 1 | Recarrega tabela |
| 2 | Filtrar por status | `/admin/empresas` | GET | `{ status: string, page: 1 }` | Valores: `''` (todos), `ativa`, `trial`, `cancelada`, `inadimplente`, `sem_assinatura`; reseta page para 1 | Recarrega tabela | ⚠️ ATUALIZADO S4: `inadimplente` e `sem_assinatura` adicionados — Ref Diff #23 |
| 3 | Navegar para detalhe | — (navegação) | — | — | — | `navigate('/empresas/{id}')` |
| 4 | Bloquear empresa | `/admin/empresas/{id}/block` | POST | — | Modal de confirmação obrigatória | Sucesso: toast "Empresa bloqueada com sucesso." + invalidateQueries. Erro: toast "Erro ao bloquear empresa." |
| 5 | Desbloquear empresa | `/admin/empresas/{id}/unblock` | POST | — | Modal de confirmação obrigatória | Sucesso: toast "Empresa desbloqueada com sucesso." + invalidateQueries. Erro: toast "Erro ao desbloquear empresa." |
| 6 | Mudar página | `/admin/empresas` | GET | `{ page: N }` | — | Recarrega tabela |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| Campo de busca (search) | qualquer texto | `page` | Reseta para 1 ao digitar | Backend filtra por nome_fantasia ou CNPJ |
| Select status (statusFilter) | mudança de valor | `page` | Reseta para 1 ao mudar | Backend filtra por status da assinatura |

### Filtros e Ordenação (listagens)
| Filtro | Campo | Tipo | Valores | Padrão |
|--------|-------|------|---------|--------|
| Busca textual | `search` | Input texto | Livre (nome ou CNPJ) | Vazio |
| Status da assinatura | `status` | Select | `''` (Todos), `ativa`, `trial`, `cancelada`, `inadimplente`, `sem_assinatura` | `''` | ⚠️ ATUALIZADO S4: Ref Diff #23 |
| Paginação | `page` | Numérico | 1..N | 1 |
| Limite por página | `limit` | Fixo | 15 | 15 |

**Nota**: Ordenação não é configurável pelo usuário nesta tela. [INFERIDO — A1: verificar com a equipe]

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Bloqueio sucesso | — | "Empresa bloqueada com sucesso." | Toast success | Auto-dismiss |
| Bloqueio erro | — | "Erro ao bloquear empresa." | Toast error | Auto-dismiss |
| Desbloqueio sucesso | — | "Empresa desbloqueada com sucesso." | Toast success | Auto-dismiss |
| Desbloqueio erro | — | "Erro ao desbloquear empresa." | Toast error | Auto-dismiss |
| Confirmação de bloqueio | — | `Tem certeza que deseja bloquear a empresa "${nome}"? A assinatura será cancelada.` | Modal texto | Até interação |
| Confirmação de desbloqueio | — | `Tem certeza que deseja desbloquear a empresa "${nome}"? A assinatura será reativada.` | Modal texto | Até interação |
| Lista vazia | — | "Nenhuma empresa encontrada" / "Tente ajustar os filtros de busca" | Empty state | Persistente |

### Estados da Interface
| Estado | Condição | UI |
|--------|----------|-----|
| **Loading** | `isLoading === true` | DataTable em skeleton |
| **Success** | `data.data.length > 0` | Tabela preenchida + paginação |
| **Empty** | `data.data.length === 0` | Empty state com mensagem |
| **Block pending** | `blockMutation.isPending` | Botão do modal com spinner |
| **Unblock pending** | `unblockMutation.isPending` | Botão do modal com spinner |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Botão "Criar Empresa" | Empresas se cadastram via consumer Web; admin não cria empresas | admin | Design da tela |
| Botão "Excluir Empresa" | Não há endpoint de exclusão; admin pode apenas bloquear/desbloquear | admin | `src/pages/EmpresasPage.tsx` |
| Filtro por data | Não implementado na tela de listagem de empresas | admin | `src/pages/EmpresasPage.tsx` |

### Rastreabilidade
| Regra # | Arquivo | Método/Linha | Evidência |
|---------|---------|-------------|-----------|
| Listar empresas | `src/services/admin.service.ts` | `listarEmpresas()` L40-46 | `api.get('/admin/empresas', { params })` |
| Bloquear empresa | `src/services/admin.service.ts` | `bloquearEmpresa()` L60-64 | `api.post('/admin/empresas/${id}/block')` |
| Desbloquear empresa | `src/services/admin.service.ts` | `desbloquearEmpresa()` L66-70 | `api.post('/admin/empresas/${id}/unblock')` |
| Status derivado (confirmado S4) | `src/pages/EmpresasPage.tsx` | `getEmpresaStatus()` L13-15 | `emp.assinatura_ativa?.status ?? 'sem_assinatura'` — ⚠️ `sem_assinatura` confirmado como status válido (Ref Diff #21) |
| Limite 15/página | `src/pages/EmpresasPage.tsx` | L55 | `limit: 15` |
| Zod validation | `src/schemas/admin.schema.ts` | `EmpresaSchema` L60-85 | Schema com assinatura_ativa nullable |
| Backend index | `app/Http/Controllers/Api/V1/AdminEmpresaController.php` | `index()` | Listagem paginada com filtros |
| Backend block | `app/Http/Controllers/Api/V1/AdminEmpresaController.php` | `block()` | Cancela assinatura ativa |
| Backend unblock | `app/Http/Controllers/Api/V1/AdminEmpresaController.php` | `unblock()` | Reativa assinatura cancelada |

#### Rastreabilidade S4 — EmpresasPage
| Regra # | Arquivo | Método | Evidência | Ref Diff |
|---------|---------|--------|-----------|----------|
| Botão Lock para inadimplente | `src/pages/EmpresasPage.tsx` | condição de exibição | Lock aparece para `ativa`, `trial` e agora `inadimplente` | Ref Diff: MUDANÇA #20 |
| sem_assinatura confirmado | `src/pages/EmpresasPage.tsx` | `getEmpresaStatus()` | Derivado de `assinatura_ativa === null` — comportamento confirmado | Ref Diff: MUDANÇA #21 (INFERIDO→RESOLVIDO) |
| Filtro status expandido | `src/pages/EmpresasPage.tsx` | select dropdown | `inadimplente` e `sem_assinatura` adicionados como opções de filtro | Ref Diff: MUDANÇA #23 |

---

## 4. EmpresaDetalhePage

### Rota
- **Path**: `/empresas/:id`
- **Componente**: `EmpresaDetalhePage` (`src/pages/EmpresaDetalhePage.tsx`)
- **Lazy Loading**: Sim (`React.lazy`)
- **Layout**: `AdminLayout`

### Condições de Acesso
| Condição | Comportamento | Origem |
|----------|--------------|--------|
| Protegida por `AdminRoute` | Requer `isAuthenticated === true` e `tipo_global === 'admin'` | `src/App.tsx:67-72` |
| Parâmetro `:id` inválido ou empresa não encontrada | Exibe "Empresa não encontrada." com botão "Voltar" | `src/pages/EmpresaDetalhePage.tsx:83-93` |
| Query desabilitada sem `id` | `enabled: !!id` impede chamada com id nulo | `src/pages/EmpresaDetalhePage.tsx:42` |

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `/admin/empresas/{id}` | GET | `nome_fantasia`, `razao_social`, `cnpj`, `email`, `telefone`, `created_at`, `assinatura_ativa` (id, plano_id, ciclo, status, data_inicio, data_fim_trial, plano.nome, plano.preco_mensal) | Auth JWT; `check.perfil:admin`; param `id` da URL |

**React Query Config**:
- `queryKey`: `['admin-empresa', id]`
- `staleTime`: 60s (global)

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Botão "Voltar" | Button ghost com ícone `ArrowLeft` | Sempre | — | Visível |
| 2 | Header: nome fantasia + CNPJ formatado | Texto | `empresa` carregada | — | — |
| 3 | Badge de status da assinatura | Badge colorido | `empresa` carregada | — | — |
| 4 | Card "Informações Gerais" | Card com InfoRows | Sempre (se empresa) | — | Visível |
| 5 | Botão "Editar" | Button ghost com ícone `Pencil` | Sempre | — | Visível |
| 6 | Card "Assinatura" | Card com detalhes do plano | `assinatura_ativa` presente | — | Condicional |
| 7 | Texto "Sem assinatura ativa." | Texto muted | `assinatura_ativa` nula | `assinatura_ativa` presente | Condicional |
| 8 | Campo "Fim do Trial" | InfoRow | `assinatura.data_fim_trial` presente | Campo null | Condicional |
| 9 | Card "Ações" | Card com botões | Sempre | — | Visível |
| 10 | Botão "Bloquear Empresa" (variant danger) | Button | Status = `ativa`, `trial` ou `inadimplente` | Outros status | Condicional | ⚠️ ATUALIZADO S4: `inadimplente` adicionado — Ref Diff #20 |
| 11 | Botão "Desbloquear Empresa" (variant primary) | Button | Status = `cancelada` | Outros status | Condicional |
| 12 | Modal de edição | EditEmpresaModal | Ao clicar "Editar" | Ao fechar/salvar | Oculto |
| 13 | Modal de confirmação block/unblock | Modal | Ao clicar bloquear/desbloquear | Ao cancelar/confirmar | Oculto |
| 14 | Loading fullscreen | Loading | `isLoading === true` | Dados carregados | — |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Voltar para lista | — (navegação) | — | — | — | `navigate('/empresas')` |
| 2 | Editar empresa (modal) | `/admin/empresas/{id}` | PATCH | `{ nome_fantasia?, razao_social?, email?, telefone? }` | **Frontend (react-hook-form)**: nome_fantasia required + min 2 chars; email regex validation; telefone regex validation (⚠️ ATUALIZADO S4: validação frontend adicionada — Ref Diff #22). **Backend (AtualizarEmpresaAdminRequest)**: nome_fantasia sometimes string max:255; razao_social sometimes nullable string max:255; email sometimes nullable email; telefone sometimes nullable string max:20 | Sucesso: toast "Empresa atualizada com sucesso." + invalidateQueries + fecha modal. Erro: toast "Erro ao atualizar empresa." |
| 3 | Bloquear empresa | `/admin/empresas/{id}/block` | POST | — | Modal de confirmação obrigatória | Sucesso: toast "Empresa bloqueada." + invalidateQueries. Erro: toast "Erro ao bloquear empresa." |
| 4 | Desbloquear empresa | `/admin/empresas/{id}/unblock` | POST | — | Modal de confirmação obrigatória | Sucesso: toast "Empresa desbloqueada." + invalidateQueries. Erro: toast "Erro ao desbloquear empresa." |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| `assinatura_ativa.status` | `ativa` / `trial` / `inadimplente` | Botão "Bloquear" | Exibe botão variant danger | Backend valida se há assinatura ativa | ⚠️ ATUALIZADO S4: `inadimplente` adicionado — Ref Diff #20 |
| `assinatura_ativa.status` | `cancelada` | Botão "Desbloquear" | Exibe botão variant primary | Backend valida se assinatura está cancelada |
| `assinatura_ativa` | `null` | Seção Assinatura | Exibe "Sem assinatura ativa." | — |
| `assinatura_ativa.data_fim_trial` | presente / null | Campo "Fim do Trial" | Exibido condicionalmente | — |

### Filtros e Ordenação (listagens)
Não aplicável — tela de detalhe.

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Atualização sucesso | — | "Empresa atualizada com sucesso." | Toast success | Auto-dismiss |
| Atualização erro | — | "Erro ao atualizar empresa." | Toast error | Auto-dismiss |
| Bloqueio sucesso | — | "Empresa bloqueada." | Toast success | Auto-dismiss |
| Bloqueio erro | — | "Erro ao bloquear empresa." | Toast error | Auto-dismiss |
| Desbloqueio sucesso | — | "Empresa desbloqueada." | Toast success | Auto-dismiss |
| Desbloqueio erro | — | "Erro ao desbloquear empresa." | Toast error | Auto-dismiss |
| Confirmação bloqueio | — | `Deseja bloquear "${nome_fantasia}"? A assinatura será cancelada.` | Modal | Até interação |
| Confirmação desbloqueio | — | `Deseja desbloquear "${nome_fantasia}"? A assinatura será reativada.` | Modal | Até interação |
| Empresa não encontrada | — | "Empresa não encontrada." | Texto central | Persistente |
| Nome fantasia vazio (S4) | — | "Nome fantasia obrigatório" | Inline (react-hook-form) | Até corrigir | ⚠️ NOVO S4: Ref Diff #22 |
| Nome fantasia curto (S4) | — | "Mínimo 2 caracteres" | Inline (react-hook-form) | Até corrigir | ⚠️ NOVO S4: Ref Diff #22 |
| Email inválido (S4) | — | "Email inválido" | Inline (react-hook-form) | Até corrigir | ⚠️ NOVO S4: Ref Diff #22 |
| Telefone inválido (S4) | — | "Telefone inválido" | Inline (react-hook-form) | Até corrigir | ⚠️ NOVO S4: Ref Diff #22 |

### Estados da Interface
| Estado | Condição | UI |
|--------|----------|-----|
| **Loading** | `isLoading === true` | `Loading text="Carregando empresa..."` |
| **Not Found** | `!empresa && !isLoading` | Texto "Empresa não encontrada." + botão Voltar |
| **Success** | `empresa` disponível | Cards com informações, ações disponíveis |
| **Edit pending** | `updateMutation.isPending` | Botão "Salvar" do modal com spinner |
| **Block pending** | `blockMutation.isPending` | Botão do modal com spinner |
| **Unblock pending** | `unblockMutation.isPending` | Botão do modal com spinner |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Campos de endereço no modal de edição | Modal simplificado — só campos básicos (nome_fantasia, razao_social, email, telefone) | admin | `src/pages/EmpresaDetalhePage.tsx:275-301` |
| Campos percentual_cashback, validade_cashback, modo_saldo no modal | Tipo `AtualizarEmpresaRequest` os define, mas modal não os expõe | admin | `src/pages/EmpresaDetalhePage.tsx:287-290` [INFERIDO — verificar com a equipe] |
| Unidades de negócio | Não exibidas na tela de detalhe admin | admin | `src/pages/EmpresaDetalhePage.tsx` |
| Histórico de faturas | Dados de faturas são do consumer Web, não do Admin | admin | Design da tela |

### Rastreabilidade
| Regra # | Arquivo | Método/Linha | Evidência |
|---------|---------|-------------|-----------|
| Buscar empresa | `src/services/admin.service.ts` | `buscarEmpresa()` L48-52 | `api.get('/admin/empresas/${id}')` |
| Atualizar empresa | `src/services/admin.service.ts` | `atualizarEmpresa()` L54-58 | `api.patch('/admin/empresas/${id}', data)` |
| Default values modal | `src/pages/EmpresaDetalhePage.tsx` | `EditEmpresaModal` L275-282 | `defaultValues: { nome_fantasia, razao_social, email, telefone }` |
| Backend update request | `app/Http/Requests/Admin/AtualizarEmpresaAdminRequest.php` | `rules()` | nome_fantasia, razao_social, telefone, email, percentual_cashback, validade_cashback, percentual_max_utilizacao, carencia_horas, modo_saldo |
| Backend show | `app/Http/Controllers/Api/V1/AdminEmpresaController.php` | `show()` | Retorna empresa com assinatura e unidades |
| Formatação CNPJ | `src/utils/format.utils.ts` | `formatCNPJ()` L34-37 | Regex para máscara XX.XXX.XXX/XXXX-XX |

#### Rastreabilidade S4 — EmpresaDetalhePage
| Regra # | Arquivo | Método | Evidência | Ref Diff |
|---------|---------|--------|-----------|----------|
| Botão bloquear para inadimplente | `src/pages/EmpresaDetalhePage.tsx` | condição exibição | `inadimplente` agora exibe botão "Bloquear Empresa" | Ref Diff: MUDANÇA #20 |
| Validação react-hook-form no EditModal | `src/pages/EmpresaDetalhePage.tsx` | EditEmpresaModal | nome_fantasia required+min2, email regex, telefone regex | Ref Diff: MUDANÇA #22 |

---

## 5. PlanosPage

### Rota
- **Path**: `/planos`
- **Componente**: `PlanosPage` (`src/pages/PlanosPage.tsx`)
- **Lazy Loading**: Sim (`React.lazy`)
- **Layout**: `AdminLayout`

### Condições de Acesso
| Condição | Comportamento | Origem |
|----------|--------------|--------|
| Protegida por `AdminRoute` | Requer `isAuthenticated === true` e `tipo_global === 'admin'` | `src/App.tsx:74-80` |
| Não autenticado | Redirect `/login` | `src/components/routing/AdminRoute.tsx:20` |

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `/admin/planos` | GET | `data[]` (id, nome, slug, preco_mensal, preco_anual, max_clientes, max_campanhas, max_usuarios, tem_unidades_negocio, nivel_relatorio, nivel_suporte) | Auth JWT; `check.perfil:admin` |

**React Query Config**:
- `queryKey`: `['admin-planos']`
- `staleTime`: 60s (global)

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Header "Planos" + subtítulo | Texto | Sempre | — | Visível |
| 2 | Botão "Novo Plano" | Button com ícone `Plus` | Sempre | — | Visível |
| 3 | Card "Total de Planos" | Card resumo | `planos` carregados | — | Oculto até carregar |
| 4 | Card "Com Unidades" | Card resumo (contagem com `tem_unidades_negocio`) | `planos` carregados | — | Oculto até carregar |
| 5 | Card "Faixa de Preço" | Card resumo (min-max `preco_mensal`) | `planos.length > 0` | Lista vazia | Oculto até carregar |
| 6 | Tabela (DataTable) | Colunas: Plano (nome+slug), Preço/Mês, Limites, Recursos, Ações | `planos` disponível | — | Loading |
| 7 | Coluna "Limites" | Clientes/Campanhas/Usuários | `md` breakpoint+ | Telas pequenas | `hidden md:table-cell` |
| 8 | Coluna "Recursos" | Unidades/Suporte | `lg` breakpoint+ | Telas médias/pequenas | `hidden lg:table-cell` |
| 9 | Botão "Editar" por plano | Button ghost com ícone `Pencil` | Sempre | — | Visível |
| 10 | Modal criar/editar plano | PlanoFormModal | Ao clicar "Novo Plano" ou "Editar" | Ao fechar/salvar | Oculto |
| 11 | Limites null → "Ilimitado" | Texto | `max_clientes/campanhas/usuarios === null` | Valor presente | Condicional |
| 12 | Empty state | Texto | Lista vazia | — | "Nenhum plano cadastrado" / "Crie o primeiro plano de assinatura" |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Criar plano | `/admin/planos` | POST | `{ nome, preco_mensal, preco_anual, max_clientes?, max_campanhas?, max_usuarios?, tem_unidades_negocio?, nivel_relatorio, nivel_suporte }` | **Frontend**: nome required "Nome obrigatório"; preco_mensal required + valueAsNumber + min:0 "Preço deve ser positivo"; preco_anual required + valueAsNumber + min:0; nivel_relatorio required; nivel_suporte required. **Backend (CriarPlanoRequest)**: nome required string max:100; preco_mensal required numeric min:0; preco_anual required numeric min:0; max_clientes nullable int min:1; max_campanhas nullable int min:1; max_usuarios nullable int min:1; tem_unidades_negocio boolean; nivel_relatorio required in:simples,completos,avancados; nivel_suporte required in:email,prioritario,24_7_gerente | Sucesso: toast "Plano criado com sucesso." + invalidateQueries + fecha modal. Erro: toast "Erro ao criar plano." |
| 2 | Editar plano | `/admin/planos/{id}` | PATCH | Mesmo payload (campos opcionais) | **Frontend**: mesmas validações. **Backend (AtualizarPlanoRequest)**: todos os campos `sometimes` | Sucesso: toast "Plano atualizado com sucesso." + invalidateQueries + fecha modal. Erro: toast "Erro ao atualizar plano." |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| `mode` (create/edit) | `create` | Campo "Senha" | Não aplicável a planos | — |
| `formModal.mode` | `edit` | Default values do form | Pré-preenchidos com dados do plano selecionado | — |
| `tem_unidades_negocio` | true/false | Checkbox | Padrão `false` no modo create | Backend: boolean |

### Filtros e Ordenação (listagens)
Sem filtros nem paginação — lista todos os planos de uma vez. [INFERIDO — verificar se lista crescerá]

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Criar sucesso | — | "Plano criado com sucesso." | Toast success | Auto-dismiss |
| Criar erro | — | "Erro ao criar plano." | Toast error | Auto-dismiss |
| Atualizar sucesso | — | "Plano atualizado com sucesso." | Toast success | Auto-dismiss |
| Atualizar erro | — | "Erro ao atualizar plano." | Toast error | Auto-dismiss |
| Nome vazio | — | "Nome obrigatório" | Inline (react-hook-form) | Até corrigir |
| Preço mensal vazio | — | "Preço obrigatório" | Inline | Até corrigir |
| Preço negativo | — | "Preço deve ser positivo" | Inline | Até corrigir |
| Lista vazia | — | "Nenhum plano cadastrado" / "Crie o primeiro plano de assinatura" | Empty state | Persistente |

### Estados da Interface
| Estado | Condição | UI |
|--------|----------|-----|
| **Loading** | `isLoading === true` | DataTable em skeleton |
| **Success** | `planos.length > 0` | Cards resumo + tabela |
| **Empty** | `planos.length === 0` | Empty state |
| **Create pending** | `createMutation.isPending` | Botão modal com spinner |
| **Update pending** | `updateMutation.isPending` | Botão modal com spinner |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Botão "Excluir Plano" | Não há endpoint DELETE de planos; apenas criação e edição | admin | `src/pages/PlanosPage.tsx` |
| Campo "slug" no formulário | Slug é gerado automaticamente pelo backend a partir do nome | admin | `app/Http/Controllers/Api/V1/AdminPlanoController.php` |
| Contagem de empresas por plano | Não retornado pelo endpoint `/admin/planos` | admin | [INFERIDO — verificar com a equipe] |

### Rastreabilidade
| Regra # | Arquivo | Método/Linha | Evidência |
|---------|---------|-------------|-----------|
| Listar planos | `src/services/admin.service.ts` | `listarPlanos()` L73-77 | `api.get('/admin/planos')` |
| Criar plano | `src/services/admin.service.ts` | `criarPlano()` L79-83 | `api.post('/admin/planos', data)` |
| Atualizar plano | `src/services/admin.service.ts` | `atualizarPlano()` L85-89 | `api.patch('/admin/planos/${id}', data)` |
| Defaults create mode | `src/pages/PlanosPage.tsx` | `PlanoFormModal` L233-237 | `tem_unidades_negocio: false, nivel_relatorio: 'simples', nivel_suporte: 'email'` |
| Opções nível relatório | `src/pages/PlanosPage.tsx` | L186-190 | `simples`, `completos`, `avancados` |
| Opções nível suporte | `src/pages/PlanosPage.tsx` | L192-196 | `email`, `prioritario`, `24_7_gerente` |
| Backend CriarPlanoRequest | `app/Http/Requests/Admin/CriarPlanoRequest.php` | `rules()` | nome required max:100, precos required numeric min:0, nivel_relatorio in:..., nivel_suporte in:... |
| Backend slug generation | `app/Http/Controllers/Api/V1/AdminPlanoController.php` | `store()` | Gera slug a partir do nome |
| Zod validation | `src/schemas/admin.schema.ts` | `PlanoSchema` L21-35 | Schema com nivel_relatorio enum, nivel_suporte enum |

---

## 6. AdminUsuariosPage

### Rota
- **Path**: `/administradores`
- **Componente**: `AdminUsuariosPage` (`src/pages/AdminUsuariosPage.tsx`)
- **Lazy Loading**: Sim (`React.lazy`)
- **Layout**: `AdminLayout`

### Condições de Acesso
| Condição | Comportamento | Origem |
|----------|--------------|--------|
| Protegida por `AdminRoute` | Requer `isAuthenticated === true` e `tipo_global === 'admin'` | `src/App.tsx:82-88` |
| Não autenticado | Redirect `/login` | `src/components/routing/AdminRoute.tsx:20` |

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `/admin/usuarios` | GET | `data[]` (id, nome, email, tipo_global, created_at), `pagination` | Auth JWT; `check.perfil:admin` |

**React Query Config**:
- `queryKey`: `['admin-usuarios']`
- `staleTime`: 60s (global)

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Header "Administradores" + subtítulo | Texto | Sempre | — | Visível |
| 2 | Botão "Novo Admin" | Button com ícone `Plus` | Sempre | — | Visível |
| 3 | Card "Total de Administradores" | Card resumo | `usuarios` disponível | — | "0" até carregar |
| 4 | Tabela (DataTable) | Colunas: Nome, Email, Tipo, Criação, Ações | `usuarios` disponível | — | Loading |
| 5 | Ícone `Shield` + avatar | Avatar por usuário | Sempre | — | Visível |
| 6 | Label "(Você)" | Badge texto | `u.id === currentUser?.id` | Outros usuários | Condicional |
| 7 | Badge "Admin" | Badge info | Sempre (coluna Tipo) | — | Fixo para todos |
| 8 | Coluna "Criação" | Data formatada | `md` breakpoint+ | Telas pequenas | `hidden md:table-cell` |
| 9 | Botão "Editar" (ícone Pencil) | Button ghost | Sempre | — | Visível |
| 10 | Botão "Excluir" (ícone Trash2) | Button ghost vermelho | `u.id !== currentUser?.id` | Usuário logado | Condicional |
| 11 | Modal criar/editar admin | AdminFormModal | Ao clicar criar/editar | Ao fechar/salvar | Oculto |
| 12 | Modal de exclusão | Modal | Ao clicar excluir | Ao cancelar/confirmar | Oculto |
| 13 | Empty state | Texto | Lista vazia | — | "Nenhum administrador encontrado" |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Criar administrador | `/admin/usuarios` | POST | `{ nome, email, senha, telefone? }` | **Frontend**: nome required "Nome obrigatório"; email required + pattern "Email inválido"; senha required + minLength:8 "Mínimo 8 caracteres" + **regex complexidade** `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$` (⚠️ ATUALIZADO S4: regex de complexidade adicionado no frontend — Ref Diff #25). **Backend (CriarAdminUsuarioRequest)**: nome required string max:255; email required email unique:usuarios; senha required string min:8 + regex(maiúscula, minúscula, número, especial); telefone nullable string max:20 | Sucesso: toast "Administrador criado com sucesso." + invalidateQueries + fecha modal. Erro: toast "Erro ao criar administrador." |
| 2 | Editar administrador | `/admin/usuarios/{id}` | PATCH | `{ nome?, email?, senha? }` | **Frontend**: nome required; email required + pattern; senha opcional (se preenchida, min 8 + **regex complexidade** `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$` — ⚠️ ATUALIZADO S4: Ref Diff #25). **Backend (AtualizarAdminUsuarioRequest)**: nome sometimes string max:255; email sometimes email unique:usuarios,{id}; senha sometimes string min:8 + regex; telefone nullable | Sucesso: toast "Administrador atualizado." + invalidateQueries + fecha modal. Erro: toast "Erro ao atualizar administrador." |
| 3 | Excluir administrador | `/admin/usuarios/{id}` | DELETE | — | Modal de confirmação; **frontend impede exclusão de si mesmo** (`u.id !== currentUser?.id`). **Backend**: impede exclusão do último admin | Sucesso: toast "Administrador removido." + invalidateQueries + fecha modal. Erro: toast "Erro ao remover administrador." |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| `formModal.mode` | `create` | Campo "Senha" | Label "Senha", required | Senha obrigatória para criar |
| `formModal.mode` | `edit` | Campo "Senha" | Label "Nova Senha (opcional)", not required | Senha é `sometimes` no update |
| `formModal.mode` | `edit` | Default values | Pré-preenchidos com `nome` e `email` do usuário; senha vazia | — |
| `u.id === currentUser?.id` | true | Botão excluir | **Ocultado** — não é possível excluir a si mesmo | Backend valida último admin |

### Filtros e Ordenação (listagens)
Sem filtros — lista todos os administradores. [INFERIDO — verificar se lista crescerá]

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Criar sucesso | — | "Administrador criado com sucesso." | Toast success | Auto-dismiss |
| Criar erro | — | "Erro ao criar administrador." | Toast error | Auto-dismiss |
| Atualizar sucesso | — | "Administrador atualizado." | Toast success | Auto-dismiss |
| Atualizar erro | — | "Erro ao atualizar administrador." | Toast error | Auto-dismiss |
| Excluir sucesso | — | "Administrador removido." | Toast success | Auto-dismiss |
| Excluir erro | — | "Erro ao remover administrador." | Toast error | Auto-dismiss |
| Confirmação exclusão | — | `Tem certeza que deseja remover <strong>{nome}</strong>? Esta ação não pode ser desfeita.` | Modal | Até interação |
| Nome vazio | — | "Nome obrigatório" | Inline | Até corrigir |
| Email vazio | — | "Email obrigatório" | Inline | Até corrigir |
| Email inválido | — | "Email inválido" | Inline | Até corrigir |
| Senha vazia (create) | — | "Senha obrigatória" | Inline | Até corrigir |
| Senha curta | — | "Mínimo 8 caracteres" | Inline | Até corrigir |
| Senha sem complexidade (S4) | — | "Deve conter maiúscula, minúscula, número e caractere especial" | Inline | Até corrigir | ⚠️ NOVO S4: Ref Diff #25 |
| Lista vazia | — | "Nenhum administrador encontrado" | Empty state | Persistente |

### Estados da Interface
| Estado | Condição | UI |
|--------|----------|-----|
| **Loading** | `isLoading === true` | DataTable em skeleton |
| **Success** | `usuarios.length > 0` | Card resumo + tabela |
| **Empty** | `usuarios.length === 0` | Empty state |
| **Create pending** | `createMutation.isPending` | Botão modal com spinner |
| **Update pending** | `updateMutation.isPending` | Botão modal com spinner |
| **Delete pending** | `deleteMutation.isPending` | Botão "Remover" com spinner |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Campo "Telefone" no modal | Tipo `CriarAdminUsuarioRequest` aceita telefone, mas modal não o expõe | admin | `src/pages/AdminUsuariosPage.tsx:254-290` |
| Seletor de perfil/role | Todos os admin users têm `tipo_global: 'admin'` fixo; não há seleção | admin | `src/schemas/admin.schema.ts:94` — `z.literal('admin')` |
| Botão excluir para si mesmo | Regra de proteção — admin não pode se auto-excluir | admin | `src/pages/AdminUsuariosPage.tsx:114` |

### Rastreabilidade
| Regra # | Arquivo | Método/Linha | Evidência |
|---------|---------|-------------|-----------|
| Listar usuarios | `src/services/admin.service.ts` | `listarUsuarios()` L92-96 | `api.get('/admin/usuarios', { params })` |
| Criar usuario | `src/services/admin.service.ts` | `criarUsuario()` L98-102 | `api.post('/admin/usuarios', data)` |
| Atualizar usuario | `src/services/admin.service.ts` | `atualizarUsuario()` L104-108 | `api.patch('/admin/usuarios/${id}', data)` |
| Excluir usuario | `src/services/admin.service.ts` | `excluirUsuario()` L110 | `api.delete('/admin/usuarios/${id}')` |
| Senha omitida se vazia | `src/pages/AdminUsuariosPage.tsx` | `AdminFormModal.onSubmit()` L236-241 | `if (data.senha) updateData.senha = data.senha` |
| Proteção auto-exclusão | `src/pages/AdminUsuariosPage.tsx` | L114 | `u.id !== currentUser?.id` |
| Backend CriarAdminUsuarioRequest | `app/Http/Requests/Admin/CriarAdminUsuarioRequest.php` | `rules()` | senha regex: maiúscula, minúscula, número, especial |

#### Rastreabilidade S4 — AdminUsuariosPage
| Regra # | Arquivo | Método | Evidência | Ref Diff |
|---------|---------|--------|-----------|----------|
| Regex complexidade senha frontend | `src/pages/AdminUsuariosPage.tsx` | validação form | `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$` adicionado no frontend (antes só no backend) | Ref Diff: MUDANÇA #25 |
| Backend destroy protection | `app/Http/Controllers/Api/V1/AdminUsuarioController.php` | `destroy()` | Impede exclusão do último admin |
| Zod tipo_global literal | `src/schemas/admin.schema.ts` | `AdminUsuarioSchema` L94 | `tipo_global: z.literal('admin')` |

---

## 7. AuditoriaPage

### Rota
- **Path**: `/auditoria`
- **Componente**: `AuditoriaPage` (`src/pages/AuditoriaPage.tsx`)
- **Lazy Loading**: Sim (`React.lazy`)
- **Layout**: `AdminLayout`

### Condições de Acesso
| Condição | Comportamento | Origem |
|----------|--------------|--------|
| Protegida por `AdminRoute` | Requer `isAuthenticated === true` e `tipo_global === 'admin'` | `src/App.tsx:90-96` |
| Não autenticado | Redirect `/login` | `src/components/routing/AdminRoute.tsx:20` |

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| `/admin/auditoria` | GET | `data[]` (id, empresa_id, usuario_id, acao, entidade, entidade_id, dados_anteriores, dados_novos, ip_address, created_at, usuario.nome, usuario.email), `pagination` (current_page, last_page, total) | Auth JWT; `check.perfil:admin` |

**React Query Config**:
- `queryKey`: `['admin-auditoria', page, search]`
- `staleTime`: 30 segundos
- Parâmetros: `{ page, limit: 50, entidade?: string }` ⚠️ ATUALIZADO S4: limit 20→50 — Ref Diff #24

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Header "Auditoria" + subtítulo | Texto | Sempre | — | Visível |
| 2 | Contador total de registros | Badge com ícone `ScrollText` | `data.pagination.total` disponível | — | "0 registros" |
| 3 | Campo de busca por entidade | Input texto com ícone `Search` | Sempre | — | Vazio |
| 4 | Tabela (DataTable) | Colunas: Data, Usuário, Ação, Entidade, IP, (expandir) | `data.data[]` disponível | — | Loading |
| 5 | Coluna "IP" | Texto monospace | `lg` breakpoint+ | Telas menores | `hidden lg:table-cell` |
| 6 | Badge de ação | Badge colorido | Sempre (coluna Ação) | — | Baseado no mapa de cores |
| 7 | Label de ação traduzido | Texto dentro do Badge | Sempre | — | Mapa: created→Criação, updated→Atualização, deleted→Exclusão, login→Login, logout→Logout, blocked→Bloqueio, unblocked→Desbloqueio etc. |
| 8 | Usuário "Sistema" | Texto | `log.usuario === null` | Quando há usuário | Fallback para "Sistema" |
| 9 | Botão expandir (ChevronDown/Up) | Button ghost | `log.dados_anteriores \|\| log.dados_novos` presente | Sem dados de diff | Condicional |
| 10 | Card expandido | ExpandedDetails | `expandedId === log.id` | Ao fechar ou selecionar outro | Oculto |
| 11 | JSON "Valores Anteriores" | `<pre>` formatado | `log.dados_anteriores` presente | null | Condicional |
| 12 | JSON "Novos Valores" | `<pre>` formatado | `log.dados_novos` presente | null | Condicional |
| 13 | Paginação | DataTable pagination | `pagination` presente | — | Condicional |
| 14 | Empty state | Texto | Lista vazia | — | "Nenhum registro de auditoria encontrado" |
| 15 | Botão "Exportar CSV" | Button com ícone `Download` | `data.data.length > 0` | Lista vazia | Condicional | ⚠️ NOVO S4: Ref Diff #52 |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Filtrar por entidade | `/admin/auditoria` | GET | `{ entidade: string, page: 1, limit: 50 }` | Nenhuma; reseta page para 1 | Recarrega tabela | ⚠️ ATUALIZADO S4: state renomeado `search`→`entidade` (Ref Diff #54), limit 20→50 (Ref Diff #24) |
| 2 | Expandir detalhes | — (local) | — | — | Só disponível se `dados_anteriores` ou `dados_novos` existem | Toggle card expandido; apenas 1 expandido por vez |
| 3 | Fechar detalhes | — (local) | — | — | — | Fecha card expandido |
| 4 | Mudar página | `/admin/auditoria` | GET | `{ page: N, limit: 50 }` | — | Recarrega tabela |
| 5 | Exportar CSV | — (client-side) | — | — | Disponível quando lista não vazia | Gera e baixa arquivo CSV com dados visíveis | ⚠️ NOVO S4: Ref Diff #52 |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| Campo de busca (`entidade`) | qualquer texto | `page` | Reseta para 1 ao digitar | Backend filtra por entidade | ⚠️ ATUALIZADO S4: state renomeado `search`→`entidade` — Ref Diff #54 |
| `expandedId` | id do log | Card expandido | Apenas 1 expandido por vez (toggle) | — |

### Filtros e Ordenação (listagens)
| Filtro | Campo | Tipo | Valores | Padrão |
|--------|-------|------|---------|--------|
| Entidade | `entidade` | Input texto | Livre (ex: "empresas", "usuarios") | Vazio |
| Paginação | `page` | Numérico | 1..N | 1 |
| Limite por página | `limit` | Fixo | 50 | 50 | ⚠️ ATUALIZADO S4: era 20, agora 50 — Ref Diff #24 |

**Nota**: Backend `AdminAuditoriaListParams` suporta filtros adicionais: `acao`, `empresa_id`, `usuario_id`, `data_inicio`, `data_fim` — mas **NÃO são expostos na UI**. [INFERIDO — A6: verificar se serão adicionados]

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Lista vazia | — | "Nenhum registro de auditoria encontrado" | Empty state | Persistente |

### Estados da Interface
| Estado | Condição | UI |
|--------|----------|-----|
| **Loading** | `isLoading === true` | DataTable em skeleton |
| **Success** | `data.data.length > 0` | Tabela + paginação |
| **Empty** | `data.data.length === 0` | Empty state |
| **Expanded** | `expandedId !== null` | Card de detalhes abaixo da tabela |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Filtros avançados (ação, empresa, usuário, período) | Params existem no tipo `AdminAuditoriaListParams` mas UI não os expõe | admin | `src/types/admin.ts:97-106` vs `src/pages/AuditoriaPage.tsx` |
| ~~Botão de exportação~~ | ~~Não implementado~~ → **AGORA IMPLEMENTADO** (CSV Export) | admin | ⚠️ ATUALIZADO S4: Botão CSV Export adicionado — Ref Diff #52 |
| Ações de exclusão de logs | Logs são imutáveis por design | admin | Design da tela |

### Rastreabilidade
| Regra # | Arquivo | Método/Linha | Evidência |
|---------|---------|-------------|-----------|
| Listar auditoria | `src/services/admin.service.ts` | `listarAuditoria()` L113-117 | `api.get('/admin/auditoria', { params })` |
| Mapa de labels ação | `src/pages/AuditoriaPage.tsx` | `acaoLabels` L11-21 | Record com tradução de ações |
| Mapa de cores ação | `src/pages/AuditoriaPage.tsx` | `acaoBadgeVariant` L23-33 | Record com variante de badge por ação |
| Limite 50/página (S4) | `src/pages/AuditoriaPage.tsx` | L45 | `limit: 50` (era 20) |
| Filtro por entidade (S4) | `src/pages/AuditoriaPage.tsx` | L46 | `...(entidade ? { entidade } : {})` — state renomeado de `search` para `entidade` |
| Toggle expandir | `src/pages/AuditoriaPage.tsx` | `toggleExpand` L53-56 | `setExpandedId(prev => prev === id ? null : id)` |
| Backend controller | `app/Http/Controllers/Api/V1/AdminAuditoriaController.php` | `index()` | Filtros: empresa_id, usuario_id, acao, entidade, data_inicio, data_fim |
| Zod validation | `src/schemas/admin.schema.ts` | `AuditLogSchema` L102-120 | Schema com dados_anteriores/novos nullable record |

#### Rastreabilidade S4 — AuditoriaPage
| Regra # | Arquivo | Método | Evidência | Ref Diff |
|---------|---------|--------|-----------|----------|
| Limit 20→50 | `src/pages/AuditoriaPage.tsx` | L45 | `limit: 50` (era `limit: 20`) | Ref Diff: MUDANÇA #24 |
| CSV Export adicionado | `src/pages/AuditoriaPage.tsx` | exportar CSV | Botão "Exportar CSV" com geração client-side | Ref Diff: MUDANÇA #52 |
| State search→entidade | `src/pages/AuditoriaPage.tsx` | state | State renomeado de `search` para `entidade` | Ref Diff: MUDANÇA #54 |

---

## 8. ConfiguracoesPage

> **⚠️ STUB**: Esta tela usa dados locais (mock). O endpoint `/admin/configuracoes` **NÃO EXISTE** no backend. Marcado como TODO no código.
> ⚠️ **ATUALIZADO S4**: `STUB_MODE=true` agora explícito + warning banner visível na UI + toast "salvo localmente" ao salvar (Ref Diff #6).

### Rota
- **Path**: `/configuracoes`
- **Componente**: `ConfiguracoesPage` (`src/pages/ConfiguracoesPage.tsx`)
- **Lazy Loading**: Sim (`React.lazy`)
- **Layout**: `AdminLayout`

### Condições de Acesso
| Condição | Comportamento | Origem |
|----------|--------------|--------|
| Protegida por `AdminRoute` | Requer `isAuthenticated === true` e `tipo_global === 'admin'` | `src/App.tsx:98-104` |
| Não autenticado | Redirect `/login` | `src/components/routing/AdminRoute.tsx:20` |

### Dados ao Carregar
| Endpoint | Método | Campos Utilizados | Dependências |
|----------|--------|-------------------|--------------|
| **[STUB]** `/admin/configuracoes` | GET | `plano_padrao_id`, `dias_trial_padrao` | **NÃO faz chamada real**; retorna `Promise.resolve(configuracoesPadrao)` |
| `/admin/planos` | GET | `data[]` (id, nome) — usado para popular select de plano padrão | Auth JWT; `check.perfil:admin` |

**React Query Config**:
- `queryKey` config: `['admin-configuracoes']`
- `queryKey` planos: `['admin-planos']` (compartilhado com PlanosPage)

### Regras de Exibição
| # | Elemento | Tipo | Exibir quando | Ocultar quando | Padrão |
|---|----------|------|---------------|----------------|--------|
| 1 | Header "Configurações" + subtítulo | Texto + ícone `Settings` | Sempre | — | Visível |
| 1b | **Warning banner STUB** | Banner amarelo/warning | Sempre (`STUB_MODE === true`) | — | Visível | ⚠️ NOVO S4: Indica que dados são locais e endpoint backend não existe — Ref Diff #6 |
| 2 | Seção "Plano e Trial para Novos Clientes" | Card com formulário | Sempre | — | Visível |
| 3 | Select "Plano Padrão" | Select dropdown | Sempre | — | Plano atual ou "Nenhum plano padrão" |
| 4 | Input "Dias de Trial Padrão" | Input number | Sempre | — | Valor atual ou vazio |
| 5 | Resumo do plano padrão atual | Card informativo | `planoSelecionado` encontrado | Nenhum plano selecionado | Condicional |
| 6 | Botão "Salvar Configurações" | Button com ícone `Save` | Sempre | — | Visível |

### Regras de Interação
| # | Ação | Endpoint | Método | Payload | Validações | Feedback |
|---|------|----------|--------|---------|------------|----------|
| 1 | Salvar configurações | **[STUB]** `/admin/configuracoes` | PATCH | `{ plano_padrao_id: number \| null, dias_trial_padrao: number \| null }` | Nenhuma validação frontend; conversão string→number no submit. **Backend: [NÃO EXISTE]** | Sucesso: toast "Configurações salvas com sucesso." + invalidateQueries. Erro: toast "Erro ao salvar configurações." |
| 2 | Selecionar plano padrão | — (local) | — | — | — | Atualiza select; exibe resumo do plano se selecionado |

### Dependências entre Campos
| Campo Controlador | Valor | Campo Afetado | Comportamento | Regra Backend |
|-------------------|-------|---------------|---------------|---------------|
| Select "Plano Padrão" | id do plano | Card "Resumo do plano" | Exibe nome, preço mensal, max clientes do plano selecionado | [NÃO EXISTE] |
| `configData` (ao carregar) | valores stub | Form fields | `useEffect` + `reset()` preenche campos com valores carregados | [STUB] |

### Filtros e Ordenação (listagens)
Não aplicável — tela de formulário.

### Mensagens de Feedback
| Situação | Código | Mensagem PT-BR | Tipo | Duração |
|----------|--------|----------------|------|---------|
| Salvar sucesso | — | "Configurações salvas localmente." | Toast success (⚠️ ATUALIZADO S4: mensagem agora indica "localmente" — Ref Diff #6) | Auto-dismiss |
| Salvar erro | — | "Erro ao salvar configurações." | Toast error | Auto-dismiss |

### Estados da Interface
| Estado | Condição | UI |
|--------|----------|-----|
| **Loading** | `isLoadingConfig === true` | Campos desabilitados (`disabled`) |
| **Ready** | `configData` carregado | Formulário preenchido e habilitado |
| **Saving** | `mutation.isPending` | Botão "Salvar" com spinner |

### O que NÃO Exibir
| Elemento | Motivo | Roles | Origem |
|----------|--------|-------|--------|
| Configurações de notificação | Escopo da tela admin é apenas plano/trial padrão | admin | `src/pages/ConfiguracoesPage.tsx` |
| Logo upload | Configuração de empresa é do consumer Web | admin | Design da tela |
| Configurações de cashback | Gerenciamento individual por empresa, não plataforma | admin | Design da tela |

### Rastreabilidade
| Regra # | Arquivo | Método/Linha | Evidência |
|---------|---------|-------------|-----------|
| STUB buscar config | `src/services/admin.service.ts` | `buscarConfiguracoes()` L123-131 | `Promise.resolve({ data: { ... configuracoesPadrao ... } })` |
| STUB salvar config | `src/services/admin.service.ts` | `atualizarConfiguracoes()` L133-141 | `Promise.resolve({ data: { ... } })` |
| Fixture padrão | `src/mocks/fixtures.ts` | `configuracoesPadrao` L138-141 | `{ plano_padrao_id: 3, dias_trial_padrao: 30 }` |
| TODO no código | `src/services/admin.service.ts` | L120-122 | `// TODO: Backend endpoint /admin/configuracoes does not exist yet.` |
| Planos reutilizados | `src/pages/ConfiguracoesPage.tsx` | L28-34 | `queryKey: ['admin-planos']` — mesma query da PlanosPage |
| Conversão types | `src/pages/ConfiguracoesPage.tsx` | `onSubmit()` L57-61 | `Number(formData.plano_padrao_id)` ou null |
| Divergência cruzamento | `S1-E1-consumers-cruzamento.json` | `divergencias_contrato[2]` | `severidade: "BAIXA — já usa stub local, marcado como TODO"` |

#### Rastreabilidade S4 — ConfiguracoesPage
| Regra # | Arquivo | Método | Evidência | Ref Diff |
|---------|---------|--------|-----------|----------|
| STUB_MODE explícito | `src/services/admin.service.ts` | `STUB_MODE=true` | Flag booleana explícita controlando comportamento stub | Ref Diff: MUDANÇA #6 |
| Warning banner | `src/pages/ConfiguracoesPage.tsx` | render | Banner amarelo indicando que dados são locais | Ref Diff: MUDANÇA #6 |
| Toast "salvo localmente" | `src/pages/ConfiguracoesPage.tsx` | `onSubmit()` | Mensagem mudou de "salvas com sucesso" para "salvas localmente" | Ref Diff: MUDANÇA #6 |

---

## 9. Zod Contract Layer (S3/S4 — Novo)

> **⚠️ NOVO S4**: Seção inteiramente nova documentando a camada de contratos Zod introduzida em S3.

### Arquitetura

A camada de contratos Zod no Admin segue um padrão **dual schema**:

| Camada | Localização | Propósito | Status |
|--------|-------------|-----------|--------|
| **Canonical (S3)** | `src/contracts/schemas/` | Schemas Zod alinhados com backend real — SSOT | Novo |
| **Legacy** | `src/schemas/admin.schema.ts` | Schemas originais do admin — mantidos por compatibilidade | Existente |

### Schemas Canonical (`src/contracts/schemas/`)

| Schema File | Schemas Exportados | Domínio |
|-------------|-------------------|---------|
| `common.schemas.ts` | `paginationMetaSchema`, `cursorPaginationMetaSchema`, `apiErrorDetailSchema`, `laravelValidationErrorSchema`, `monetarioSchema`, `isoTimestampSchema` | Infraestrutura |
| `auth.schemas.ts` | `loginRequestSchema`, `registerRequestSchema`, `forgotPasswordRequestSchema`, `resetPasswordRequestSchema`, `switchEmpresaRequestSchema` | Autenticação |
| `empresa.schemas.ts` | `empresaSchema`, `atualizarConfigRequestSchema` | Empresas |
| `campanha.schemas.ts` | `campanhaSchema`, `criarCampanhaRequestSchema`, `atualizarCampanhaRequestSchema` | Campanhas |
| `cashback.schemas.ts` | `transacaoSchema`, `gerarCashbackRequestSchema`, `utilizarCashbackRequestSchema` | Cashback/Transações |
| `cliente.schemas.ts` | `clienteSchema`, `criarClienteRequestSchema`, `atualizarClienteRequestSchema` | Clientes |
| `contestacao.schemas.ts` | `contestacaoSchema`, `criarContestacaoRequestSchema`, `resolverContestacaoRequestSchema` | Contestações |
| `usuario.schemas.ts` | `usuarioSchema`, `criarUsuarioInternoRequestSchema`, `atualizarUsuarioInternoRequestSchema`, `unidadeNegocioSchema` | Usuários |
| `assinatura.schemas.ts` | `planoSchema`, `faturaSchema`, `assinaturaSchema`, `upgradeAssinaturaRequestSchema` | Assinaturas/Planos |
| `auditoria.schemas.ts` | `logAuditoriaSchema` | Auditoria |
| `notificacao.schemas.ts` | `notificacaoConfigSchema`, `notificacaoConfigBackendRequestSchema` | Notificações |

### `apiCall<T>` Wrapper

| Aspecto | Detalhe |
|---------|---------|
| **Localização** | `src/contracts/apiCall.ts` |
| **Função** | Wrapper genérico que faz chamada API + `schema.safeParse()` na response |
| **Sucesso parse** | Retorna dados tipados `T` |
| **Falha parse** | Graceful degradation — retorna dados originais + reporta violação via `reportContractViolation()` |
| **Violações** | Armazenadas via `getContractViolations()` para monitoramento/debugging |

### Enums Zod como SSOT

| Enum | Valores | Nota Forward-Compat |
|------|---------|---------------------|
| `statusCashbackEnum` | `pendente, confirmado, utilizado, rejeitado, expirado, congelado, estornado` | `estornado` é forward-compat (não no backend ainda) |
| `perfilUsuarioEnum` | `gestor, operador, vendedor, financeiro` | `financeiro` é forward-compat |
| `statusCampanhaEnum` | `ativa, inativa, finalizada` | `encerrada` removido — agora `finalizada` (S2/S4) |
| `tipoGlobalEnum` | `admin` (nullable — null = lojista) | Semântica confirmada em S4 |

### Rastreabilidade S4 — Zod Contract Layer
| Regra # | Arquivo | Método | Evidência | Ref Diff |
|---------|---------|--------|-----------|----------|
| Dual schema layer | `src/contracts/schemas/` + `src/schemas/admin.schema.ts` | — | Canonical (S3) + Legacy coexistem | Ref Diff: Admin #8, S3-E2 |
| apiCall wrapper | `src/contracts/apiCall.ts` | `apiCall<T>()` | Runtime contract validation + graceful degradation | Ref Diff: Admin #8, S3 |
| 16 Zod enums | `src/contracts/schemas/*.ts` | z.enum() | Substituem inline unions como SSOT | Ref Diff: S3, Novidade #3 |
| reportContractViolation | `src/contracts/apiCall.ts` | `reportContractViolation()` | Sistema de report de violações de contrato | Ref Diff: S3, Novidade #11 |

---

## Glossário de Permissões (Admin)

| Permissão / Mecanismo | Descrição | Telas Afetadas |
|------------------------|-----------|----------------|
| `tipo_global === 'admin'` | Verificação pós-login no authStore — rejeita qualquer usuário que não seja admin global | LoginPage (validação), todas as telas protegidas |
| `AdminRoute` (componente) | Guard de rota — verifica `isAuthenticated` + `tipo_global === 'admin'`; redirect para `/login` se falhar | DashboardPage, EmpresasPage, EmpresaDetalhePage, PlanosPage, AdminUsuariosPage, AuditoriaPage, ConfiguracoesPage |
| `check.perfil:admin` (middleware backend) | Middleware Laravel que valida JWT payload `perfil === 'admin'`; retorna 403 se negado | Todos os endpoints `/admin/*` |
| `auth:api` (middleware backend) | Middleware JWT padrão — valida token Bearer; retorna 401 se inválido/expirado | Todos os endpoints protegidos |
| `throttle:auth` (middleware backend) | Rate limiting no grupo admin | Todos os endpoints `/admin/*` |
| Auto-refresh token | Interceptor Axios — tenta refresh em 401 (exceto rotas auth); logout se refresh falhar | Todas as telas protegidas |
| Auto-exclusão impedida | Frontend oculta botão excluir para o usuário logado; backend impede exclusão do último admin | AdminUsuariosPage |

## Tabela de Status (Admin)

### Status da Assinatura (Empresa)
| Status | Label PT-BR | Cor/Badge | Transições | Telas |
|--------|-------------|-----------|------------|-------|
| `trial` | Trial | `info` (azul) | → ativa, → cancelada | EmpresasPage, EmpresaDetalhePage |
| `ativa` | Ativa | `success` (verde) | → inadimplente, → cancelada | EmpresasPage, EmpresaDetalhePage |
| `inadimplente` | Inadimplente | `warning` (amarelo) | → ativa, → cancelada (via botão Lock) | EmpresasPage, EmpresaDetalhePage | ⚠️ ATUALIZADO S4: confirmado — botão Lock aparece, filtro disponível (Ref Diff #20, #23) |
| `cancelada` | Cancelada | `error` (vermelho) | → ativa (via unblock) | EmpresasPage, EmpresaDetalhePage |
| `sem_assinatura` | Sem assinatura | `neutral` (cinza) | — | EmpresasPage (derivado quando `assinatura_ativa === null`) |

### Ações de Auditoria
| Ação | Label PT-BR | Cor/Badge | Tela |
|------|-------------|-----------|------|
| `created` | Criação | `success` (verde) | AuditoriaPage |
| `updated` | Atualização | `info` (azul) | AuditoriaPage |
| `deleted` | Exclusão | `error` (vermelho) | AuditoriaPage |
| `login` | Login | `info` (azul) | AuditoriaPage |
| `logout` | Logout | `neutral` (cinza) | AuditoriaPage |
| `blocked` | Bloqueio | `error` (vermelho) | AuditoriaPage |
| `unblocked` | Desbloqueio | `success` (verde) | AuditoriaPage |
| `empresa_atualizada` | Empresa Atualizada | `info` (azul) | AuditoriaPage |
| `usuario_criado` | Usuário Criado | `success` (verde) | AuditoriaPage |

### Nível de Relatório (Planos)
| Valor | Label PT-BR | Tela |
|-------|-------------|------|
| `simples` | Simples | PlanosPage (select no modal) |
| `completos` | Completos | PlanosPage |
| `avancados` | Avançados | PlanosPage |

### Nível de Suporte (Planos)
| Valor | Label PT-BR | Tela |
|-------|-------------|------|
| `email` | Email | PlanosPage (select no modal) |
| `prioritario` | Prioritário | PlanosPage |
| `24_7_gerente` | 24/7 com Gerente | PlanosPage |

### Ciclo de Assinatura
| Valor | Label PT-BR | Tela |
|-------|-------------|------|
| `mensal` | Mensal | EmpresaDetalhePage (exibição) |
| `anual` | Anual | EmpresaDetalhePage (exibição) |

### Modo de Saldo (Empresa)
| Valor | Label PT-BR | Tela |
|-------|-------------|------|
| `individual` | Individual | EmpresaDetalhePage (tipo AtualizarEmpresaRequest, não exposto na UI) |
| `global` | Global | EmpresaDetalhePage (tipo AtualizarEmpresaRequest, não exposto na UI) |

---

## Configurações Globais do Consumer Admin

| Configuração | Valor | Arquivo |
|-------------|-------|---------|
| Base URL API | `import.meta.env.VITE_API_URL \|\| 'http://localhost:8000/api/v1'` | `src/services/api.ts:9` |
| Timeout API | 15.000ms (15s) | `src/services/api.ts:7` |
| Token storage key | `h4cb_admin_token` | `src/utils/token.utils.ts:1` |
| React Query staleTime (global) | 60.000ms (1min) | `src/App.tsx:22` |
| React Query gcTime (global) | 600.000ms (10min) | `src/App.tsx:23` |
| React Query retry (global) | 2 | `src/App.tsx:25` |
| React Query retryDelay (global) | exponential backoff: min(1000 * 2^attempt, 30000) | `src/App.tsx:26` |
| React Query refetchOnWindowFocus | `false` | `src/App.tsx:24` |
| Lazy loading (todas as pages) | `React.lazy(() => import(...))` | `src/App.tsx:10-18` |
| Suspense fallback | `Loading fullscreen text="Carregando..."` | `src/App.tsx:44` |
| Rota 404 | `NotFoundPage` | `src/App.tsx:108` |

---

## Atualizações S4 — Glossário

### Enums Atualizados (S4)

| Enum | Valores Anteriores (S1) | Valores Atuais (S4) | Mudança | Ref Diff |
|------|-------------------------|---------------------|---------|----------|
| `status_campanha` | `ativa, inativa, encerrada` | `ativa, inativa, finalizada` | `encerrada` → `finalizada` | Enum #1, S4-E2 Schema #2 |
| `perfil_usuario` (UserResponse) | `gestor, operador, vendedor` | `proprietario, gestor, operador, vendedor` | `proprietario` adicionado (backend real) | Enum #2, S4-E2 Schema #4 |
| `status_cashback` (Zod forward-compat) | `pendente, confirmado, utilizado, rejeitado, expirado, congelado` | + `estornado` | Forward-compat no Zod | S4-E2 Schema #1 |
| `tipo_global` | `admin, lojista` | `admin` + `null` (null = lojista) | Semântica corrigida | S4-E2 Schema #3, Enum #4 |
| `perfil_usuario` (Zod forward-compat) | — | + `financeiro` | Forward-compat no Zod (não no backend) | S4-E1 Enum #2 |

### Status Novos/Confirmados (S4)

| Status | Onde | Nota | Ref Diff |
|--------|------|------|----------|
| `inadimplente` (assinatura) | EmpresasPage, EmpresaDetalhePage | Confirmado com botão Lock e filtro | #20, #23 |
| `sem_assinatura` (derivado) | EmpresasPage | Confirmado como filtro e derivação | #21 |

### Schemas Novos no Swagger (S4-E2)

| Schema | Tipo | Ref Zod | Ref Diff |
|--------|------|---------|----------|
| `ApiErrorDetail` | Response | `apiErrorDetailSchema` | S4-E2 Schema Novo #1 |
| `LaravelValidationError` | Response | `laravelValidationErrorSchema` | S4-E2 Schema Novo #2 |
| `Pagination` | Meta | `paginationMetaSchema` | S4-E2 Schema Novo #3 |
| `CursorPaginationMeta` | Meta | `cursorPaginationMetaSchema` | S4-E2 Schema Novo #4 |

### Schemas Deprecated no Swagger (S4-E2)

| Schema | Motivo | Substituído por |
|--------|--------|-----------------|
| `PaginationMeta` | Estrutura `meta+links` obsoleta | `Pagination` |
| `PaginationLinks` | Estrutura `meta+links` obsoleta | `Pagination` |

### Response Envelope (S4 — cross-cutting)

Todas as responses da API agora seguem o envelope padrão:
```json
{
  "status": true,
  "data": { ... },
  "error": null,
  "message": "string"
}
```
- **Erro**: `{ "status": false, "data": null, "error": { "code": "...", "message": "...", "correlation_id": "...", "details": {} }, "message": "..." }`
- **Ref**: S4-E1 MUDANÇA #1, S4-E2 Mudança Estrutural #1

### Pagination (S4 — cross-cutting)

Endpoints paginados agora usam `pagination` key (não `meta+links`):
```json
{
  "status": true,
  "data": [...],
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 73,
    "next_page_url": "...",
    "prev_page_url": null
  },
  "error": null,
  "message": ""
}
```
- **Endpoints Admin afetados**: `/admin/empresas`, `/admin/usuarios`, `/admin/auditoria`
- **Ref**: S4-E1 MUDANÇA #2, S4-E2 Mudança Estrutural #2

### Token Key (S4 — cross-cutting)

Response de login/refresh agora usa `token` (não `access_token`):
- **Antes**: `{ "access_token": "...", "token_type": "bearer" }`
- **Agora**: `{ "token": "...", "token_type": "bearer" }` (dentro do envelope)
- **Endpoint afetado (Admin)**: `POST /auth/login`
- **Ref**: S4-E1 MUDANÇA #3, S4-E2 Mudança Estrutural #3

---

## [INFERIDO] Pendentes (Admin) — Atualizado S4

| ID | Item | Status S1 | Status S4 | Nota |
|----|------|-----------|-----------|------|
| A1 | EmpresasPage ordenação não configurável | [INFERIDO] | [INFERIDO] | Não tocado em S2/S3 |
| A2 | EmpresaDetalhePage campos cashback no tipo mas não no modal | [INFERIDO] | [INFERIDO] | Não tocado em S2/S3 |
| A3 | PlanosPage sem paginação/filtros | [INFERIDO] | [INFERIDO] | Não tocado em S2/S3 |
| A4 | PlanosPage contagem empresas por plano | [INFERIDO] | [INFERIDO] | Não tocado em S2/S3 |
| A5 | AdminUsuariosPage telefone no tipo mas não no modal | [INFERIDO] | [INFERIDO] | Não tocado em S2/S3 |
| A6 | AuditoriaPage filtros avançados não expostos na UI | [INFERIDO] | [INFERIDO] | Não tocado em S2/S3 |
| A7 | EmpresaDetalhePage `unidades` retornado mas não exibido | [INFERIDO] | [INFERIDO] | Não tocado em S2/S3 |


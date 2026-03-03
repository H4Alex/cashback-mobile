# Diff de Mudanças — Documentação vs Código Atual

> Gerado em: 2026-03-03 | Etapa: S4-E1 | Modo: Somente leitura (nenhum código/doc alterado)

---

## Resumo Executivo

| Documento | Total Itens | Inalterados | Alterados | Novos | Removidos |
|-----------|-------------|-------------|-----------|-------|-----------|
| **Swagger/OpenAPI** | 159 endpoints | 88 | 8 | 3 (+~42 aliases) | 0 |
| **Mapa Web (frontend)** | 19 telas + subtabs | 11 | 10 | 1 | 0 |
| **Mapa Admin** | 9 pages + infra | 4 | 8 | 2 | 0 |
| **Mapa Mobile** | 33 telas + infra | 15 | 13 | 5 | 0 |
| **Postman Collection** | 37 body endpoints | 34 | 3 divergentes | 3 ausentes | 0 |

## Esforço Estimado

| Área | Esforço | Quantidade | Justificativa |
|------|---------|------------|---------------|
| **Swagger** | **ALTO** | 8 endpoints alterados + 3 novos + envelope/pagination sistêmico | Envelope `{status,data,error,message}` afeta TODOS os endpoints; `pagination` substitui `meta+links` em 11+ endpoints; `token` vs `access_token` em 5 endpoints |
| **Postman** | **BAIXO** | 3 divergências + 3 endpoints ausentes | Maioria alinhada; corrigir método DELETE, adicionar verify-reset-token e biometric/unenroll |
| **Mapa Web** | **ALTO** | 10 telas alteradas + 1 nova regra | Mudanças significativas em VendasPage, UtilizarCashbackPage, RelatoriosPage, PagamentosTab |
| **Mapa Admin** | **MÉDIO** | 8 alterações + 2 novos | Maioria são correções pontuais; ConfiguracoesPage STUB é novo |
| **Mapa Mobile** | **ALTO** | 13 telas + 9 cross-cutting | ForgotPassword reestruturado, biometric unenroll, role-gating, schema consolidation |

---

## Diff Detalhado — Swagger/OpenAPI

### Mudanças Estruturais (afetam TODOS os endpoints)

#### MUDANÇA #1: Response Envelope não documentado no Swagger

- **Swagger original**: Responses documentadas como objetos simples `{ data: ... }`
- **Código atual** (`ApiResponse.php`): TODOS os responses envolvidos em `{ status: true/false, data: T, error: null|{code,message,correlation_id}, message: string }`
- **Zod**: `apiResponseSchema<T>` reflete o envelope corretamente
- **Alinhado?** Swagger ↔ Código: ❌ | Código ↔ Zod: ✅
- **Atualizar**: Todos os response schemas do Swagger devem incluir o envelope

#### MUDANÇA #2: Pagination — `meta+links` → `pagination`

- **Swagger original**: `{ data: [...], meta: {current_page,last_page,per_page,total,from,to}, links: {first,last,prev,next} }`
- **Código atual**: `{ status: true, data: [...], pagination: {current_page,last_page,per_page,total,next_page_url,prev_page_url}, error: null, message: string }`
- **Endpoints afetados**: GET /cashback, /clientes, /campanhas, /faturas, /contestacoes, /auditoria, /usuarios, /admin/empresas, /admin/usuarios, /admin/auditoria, /mobile/v1/extrato
- **Alinhado?** Swagger ↔ Código: ❌ | Código ↔ Zod: ✅
- **Atualizar**: Remover `meta+links`, adicionar `pagination` key com campos corretos

#### MUDANÇA #3: Token key — `access_token` → `token`

- **Swagger original**: Response de login/refresh retorna `{ access_token, token_type }`
- **Código atual** (`AuthController.php`): Retorna `{ token, token_type: "bearer" }` dentro do envelope
- **Endpoints afetados**: POST /auth/login, /auth/refresh, /mobile/v1/auth/login, /mobile/v1/auth/oauth, /mobile/v1/auth/refresh
- **Alinhado?** Swagger ↔ Código: ❌ | Código ↔ Zod: ✅
- **Atualizar**: Trocar `access_token` por `token` nos 5 endpoints

### Endpoints Alterados

| # | Endpoint | Tipo | O que mudou | Swagger → Atualizar |
|---|----------|------|-------------|---------------------|
| 1 | POST /auth/login | ALTERADO | Token key `access_token`→`token` | Corrigir campo response |
| 2 | POST /auth/refresh | ALTERADO | Token key `access_token`→`token` | Corrigir campo response |
| 3 | POST /mobile/v1/auth/login | ALTERADO | Token key `access_token`→`token` | Corrigir campo response |
| 4 | POST /mobile/v1/auth/oauth | ALTERADO | Token key `access_token`→`token` | Corrigir campo response |
| 5 | POST /mobile/v1/auth/refresh | ALTERADO | Token key `access_token`→`token` | Corrigir campo response |
| 6 | DELETE /mobile/v1/auth/delete-account | ALTERADO | Método HTTP: Swagger=POST, Código=DELETE | Corrigir método HTTP |
| 7 | GET /mobile/v1/extrato | ALTERADO | Pagination usa `pagination` key (não `meta+links`) | Corrigir schema de paginação |
| 8 | PATCH /notificacoes/config | ALTERADO | Documentação divergente (flat booleans vs canal+ativo). Código está correto (flat). | Verificar documentação, adicionar nota sobre transform no frontend |

### Endpoints Novos (ausentes no Swagger)

| # | Endpoint | Tipo | Request | Response | Origem |
|---|----------|------|---------|----------|--------|
| 1 | POST /api/v1/auth/verify-reset-token | NOVO | `{email, token}` | `{valid: true, expires_in}` ou erro 400/410 | S2-E5 (C3) |
| 2 | POST /api/mobile/v1/auth/verify-reset-token | NOVO | `{email, token}` | Mesmo acima | S2-E5 (C3) |
| 3 | POST /api/mobile/v1/auth/biometric/unenroll | NOVO | `{device_id}` (max:255) | `{unenrolled: true}` | S2-E5 (C1) |

### Enums Divergentes

| Enum | Swagger | Backend | Zod | Diverge? | Atualizar |
|------|---------|---------|-----|----------|-----------|
| status_campanha | `ativa,inativa,encerrada` | `ativa,inativa,finalizada` | `ativa,inativa,finalizada,encerrada` | ❌ Swagger≠Code | Swagger: trocar `encerrada`→`finalizada` |
| perfil_usuario | `gestor,operador,vendedor` | `proprietario,gestor,operador,vendedor` | `gestor,operador,vendedor,financeiro` | ❌ Swagger missing | Swagger: adicionar `proprietario`; considerar `financeiro` |
| status_cashback | `pendente,confirmado,utilizado,rejeitado,expirado,congelado` | Idem | Zod adiciona `estornado` | ⚠️ Forward-compat | Swagger: considerar adicionar `estornado` |
| tipo_global | `admin,lojista` | `admin` + null (lojista implícito) | `admin \| null` | ⚠️ Semântica | Documentar null = lojista |

### Aliases Deprecated (~42 rotas)

O backend adiciona aliases em inglês com middleware `deprecated` para todas as rotas principais em português. Exemplos: `/customers`→`/clientes`, `/campaigns`→`/campanhas`, `/users`→`/usuarios`, etc. **Decisão**: Documentar no Swagger como `deprecated: true` ou omitir.

---

## Diff Detalhado — Mapa Web (Frontend)

### Telas Alteradas

| # | Tela | Categoria | Resumo da Mudança | Impacto no Mapa |
|---|------|-----------|--------------------|-----------------|
| 1 | **RecuperacaoPage** | INFERIDO→RESOLVIDO + REGRA CORRIGIDA | 3 steps de wizard trocaram `setTimeout` mocks por chamadas reais: `authService.forgotPassword()`, `authService.verifyResetToken()` (endpoint NOVO), `authService.resetPassword()`. [INFERIDO] "Reenviar codigo" permanece. | ALTO: Atualizar 3 regras de interação, adicionar endpoint verify-reset-token |
| 2 | **DashboardPage** | REGRA CORRIGIDA + CAMPO NOVO + INFERIDO→RESOLVIDO | (a) STATUS_MAP: `congelado`→`pending` (não `processing`). (b) Status `estornado` adicionado ao StatusSummaryCard. (c) FilterPanel: valores mudaram de inglês para português (`pendente`, `confirmado`...). (d) Batch actions wired (Aprovar→toast, Exportar→exportToExcel, Excluir→toast). | ALTO: Adicionar `estornado`, corrigir STATUS_MAP, atualizar filtros para PT, resolver [INFERIDO] batch actions |
| 3 | **UtilizarCashbackPage** | REGRA CORRIGIDA + CAMPO NOVO | (a) Novo campo `valorCompra` input. (b) Troco dinâmico: `troco = Math.max(0, saldo - valorCompra)`. (c) `cashbackUsado = Math.min(saldo, valorCompra)`. Mapa dizia "Troco: Sempre 0". | ALTO: Atualizar payload, remover "troco=0", adicionar campo valorCompra e cálculo dinâmico |
| 4 | **CampanhasPage** | REGRA CORRIGIDA | (a) Status `encerrada`→`finalizada`. (b) Paginação server-side adicionada: `page` + `pageSize=20`. | MÉDIO: Trocar enum, adicionar paginação |
| 5 | **VendasPage** | REGRA NOVA + REGRA CORRIGIDA | (a) Botão "Cancelar" adicionado para `status==='concluida'` → `POST /cashback/{id}/cancelar`. (b) Dead code `case 'processando'` removido. Mapa dizia "Botao cancelar: Nao implementado". | ALTO: Remover "não implementado", adicionar regra de interação Cancelar |
| 6 | **RelatoriosPage** | REGRA CORRIGIDA + INFERIDO→RESOLVIDO + CAMPO NOVO | (a) Métricas de `useDashboardStats()` → `useRelatorios({tipo:'resumo'})`. (b) Export client-side → server-side `relatorioService.gerar()`. (c) Filtros `data_inicio`/`data_fim`. (d) 2x [INFERIDO] resolvidos. | ALTO: Reescrever seção quase inteira |
| 7 | **ContestacoesPage** | REGRA CORRIGIDA | Paginação server-side: `page` + `pageSize=20` (era `limit:100` sem paginação). | MÉDIO: Adicionar paginação |
| 8 | **AuditoriaPage** | REGRA CORRIGIDA | (a) Busca mudou de client → server-side com `useDebounce`. (b) `limit: 50`→`100`. (c) State renomeado `search`→`entidade`. | MÉDIO: Atualizar busca para server-side, corrigir limit |
| 9 | **UsuariosTab** (Configurações) | REGRA CORRIGIDA + CAMPO NOVO + INFERIDO→RESOLVIDO | (a) Senha hardcoded `temp123456` → `crypto.randomUUID()...`. (b) Perfil `financeiro` adicionado. (c) [INFERIDO] senha resolvido. | MÉDIO: Atualizar geração de senha, adicionar perfil |
| 10 | **PagamentosTab** (Configurações) | REGRA CORRIGIDA | (a) `POST /faturas/{id}/link` → `GET /faturas/{id}/link-pagamento` (ghost endpoint fix). (b) `GET /faturas/{id}/nfe` → `GET /faturas/{id}/nota-fiscal` (ghost endpoint fix). Severidade crítica. | ALTO: Corrigir URLs dos endpoints |

### Telas Inalteradas (11)

LoginPage, CadastroPage, MultilojaPage, GerarCashbackPage, ClientesPage, ConfiguracoesPage (shell), DadosEmpresaTab, PoliticaCashbackTab, NotificacoesTab (serviço adaptado mas UI inalterada), ApiTab (comentada), SegurancaTab (comentada)

### Telas com [INFERIDO] Ainda Pendente (7+)

- UnidadeNegocioTab: 3x CRUD local sem API
- DashboardClientePage/SaldoClientePage/ExtratoCashbackPage/HistoricoUsoPage: dados mock, endpoints mobile
- RecuperacaoPage: botão "Reenviar código"

### Infraestrutura S3 (cross-cutting — não altera UI)

| Item | Impacto |
|------|---------|
| 12 domain schemas em `src/contracts/schemas/` (64 z.object, 75 z.infer) | Seção global do mapa deve referenciar contract layer como SSOT |
| `apiCall<T>` wrapper com `schema.safeParse()` + graceful degradation | Seção global de error handling deve mencionar validação runtime |
| Legacy mock WARNING: `CustomerSearch.tsx` importa `src/mocks/gerarCashbackData.ts` em produção | GerarCashbackPage: nota sobre bypass da cadeia Zod |
| Enum superset: Zod aceita `proprietario`, `financeiro`, `estornado` que backend pode não retornar | Tabelas de status devem notar forward-compatibility |

---

## Diff Detalhado — Mapa Admin

### Telas Alteradas

| # | Tela | Categoria | Resumo da Mudança | Impacto |
|---|------|-----------|--------------------|---------|
| 1 | **LoginPage** | REGRA CORRIGIDA + CAMPO NOVO | (a) Auto-redirect para `/` se já autenticado (#49). (b) Senha min length: 6→8 (#55). (c) Zod schemas formalizados em `auth.schemas.ts`. | MÉDIO |
| 2 | **DashboardPage** | REGRA CORRIGIDA + INFERIDO→RESOLVIDO | "Atualizado agora" (estático) → `formatRelativeTime()` dinâmico (Xs, Xmin, HH:MM). Zod schema formalizado. | MÉDIO |
| 3 | **EmpresasPage** | REGRA CORRIGIDA + INFERIDO→RESOLVIDO | (a) `inadimplente`: botão Lock agora aparece (#20). (b) `sem_assinatura` confirmado (#21). (c) Filtro de status expandido com `inadimplente` e `sem_assinatura` (#23). | MÉDIO |
| 4 | **EmpresaDetalhePage** | REGRA CORRIGIDA + CAMPO NOVO | (a) `inadimplente` botão (#20). (b) Validação `react-hook-form` adicionada no EditModal: nome_fantasia required+min2, email regex, telefone regex (#22). | MÉDIO |
| 5 | **AdminUsuariosPage** | REGRA CORRIGIDA | Regex de complexidade de senha adicionado: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$` (#25). | BAIXO |
| 6 | **AuditoriaPage** | REGRA CORRIGIDA + REGRA NOVA | (a) `limit: 20`→`50` (#24). (b) CSV Export adicionado (#52). (c) State `search`→`entidade` (#54). | MÉDIO |
| 7 | **ConfiguracoesPage** | REGRA CORRIGIDA + CAMPO NOVO | `STUB_MODE=true` + warning banner + toast "salvo localmente" (#6). Endpoint backend não existe. | MÉDIO |
| 8 | **Zod Contract Layer** | REGRA NOVA | Inteiramente novo em S3: `apiCall.ts`, `schemas/common.schemas.ts`, `schemas/auth.schemas.ts`. Dual schema layer. | Seção nova |

### Telas Inalteradas (4)

PlanosPage (S2 não tocou, S3 adicionou Zod), NotFoundPage, AdminRoute, API Interceptor

### [INFERIDO] Ainda Pendente (7 itens)

A1: EmpresasPage ordenação não configurável | A2: EmpresaDetalhePage campos cashback no tipo mas não no modal | A3: PlanosPage sem paginação/filtros | A4: PlanosPage contagem empresas por plano | A5: AdminUsuariosPage telefone no tipo mas não no modal | A6: AuditoriaPage filtros avançados não expostos na UI | A7: EmpresaDetalhePage `unidades` retornado mas não exibido

---

## Diff Detalhado — Mapa Mobile

### Telas Alteradas

| # | Tela | Categoria | Resumo da Mudança | Impacto |
|---|------|-----------|--------------------|---------|
| 1 | **LoginScreen** | REGRA CORRIGIDA | OAuth buttons (Google/Apple) removidos inteiramente (#4). De 9 elementos UI para 5. | ALTO |
| 2 | **RegisterScreen** | REGRA CORRIGIDA | CPF validation: `z.string().length(11)` → `.refine(isValidCPF)` com Mod-11 (#56). | BAIXO |
| 3 | **ForgotPasswordScreen** | REGRA NOVA | Fluxo 2-step → 3-step. Novo intermediate step `verify` com `verifyResetToken()`. States: `email|verify|reset|done` (era `email|token`). | ALTO |
| 4 | **ExtratoScreen** | REGRA CORRIGIDA | Tap em transação restrito a `CONTESTABLE_STATUSES = {rejeitado, expirado, congelado}` (#28). Antes: todas clicáveis. | MÉDIO |
| 5 | **SaldoScreen** | INFERIDO→RESOLVIDO | Schema `proximo_a_expirar` corrigido de number → `{valor, quantidade}`. `logo_url` adicionado (S3-E5b B1). | BAIXO |
| 6 | **NotificationPreferencesScreen** | REGRA CORRIGIDA | De 8 toggles para 3: Push, Email, Marketing&Promoções (#8). UI significativamente reduzida. | ALTO |
| 7 | **ProfileScreen** | REGRA CORRIGIDA | Biometric OFF agora chama `unenroll()` API (era local-only) (#26, S2-E5 C1). | MÉDIO |
| 8 | **ChangePasswordScreen** | CAMPO NOVO | Campo `nova_senha_confirmation` adicionado com `.refine()` para match (#57). | BAIXO |
| 9 | **DeleteAccountScreen** | REGRA CORRIGIDA | HTTP method: POST → DELETE (S2-E5 C2). | BAIXO |
| 10 | **ContestacaoListScreen** | CAMPO NOVO | FilterChips adicionados: `pendente/aprovada/rejeitada` com filtro client-side (#29). | MÉDIO |
| 11 | **MerchantDashboardScreen** | CAMPO NOVO | Period selector chips: 7d/30d/90d. `chartPeriod` state dinâmico (#58). | MÉDIO |
| 12 | **GerarCashbackScreen** | REGRA NOVA | Zod validation `gerarCashbackMerchantSchema` com `safeParse()` adicionado (#30). Errors inline. | MÉDIO |
| 13 | **UtilizarCashbackScreen** | REGRA CORRIGIDA | CPF validation com `isValidCPF` Mod-11 (indireto via #56). | BAIXO |
| 14 | **QRScanScreen** | REGRA CORRIGIDA | Botão "Simular Scan" agora só visível em `__DEV__` (#5). | BAIXO |
| 15 | **CampanhasScreen** | REGRA CORRIGIDA | Status `encerrada`→`finalizada` (S2-E5 C4). | BAIXO |
| 16 | **VendasScreen** | CAMPO NOVO | Date range selector (7d/30d/90d) + client search + `data_inicio`/`data_fim` params (#59). | MÉDIO |
| 17 | **MoreMenuScreen** | INFERIDO→RESOLVIDO | Role-based menu gating implementado: proprietario=all, gestor=parcial, operador=limitado, vendedor=mínimo (S2-E5 Impl#2). | ALTO |

### Telas Inalteradas (15)

OnboardingScreen, ConsentScreen, HomeScreen, HistoricoScreen*, QRCodeScreen, NotificationsScreen, EditProfileScreen, CreateContestacaoScreen, CashbackMenuScreen, ClientesScreen, ClienteDetailScreen, ContestacoesMerchantScreen, ConfigScreen, RelatoriosScreen, MultilojaScreen, PrivacyPolicyScreen

### Cross-Cutting (9 itens)

| # | Item | Categoria | Impacto |
|---|------|-----------|---------|
| 1 | Dual schema consolidação → re-export shim | REGRA CORRIGIDA | Arquitetural |
| 2 | Contract violation system (`apiCall<T>`) | REGRA NOVA | Arquitetural |
| 3 | Cursor pagination schema formalizado | REGRA NOVA | Schema para extrato/historico/notifications |
| 4 | Campanha status enum migration | REGRA CORRIGIDA | Todos os consumers |
| 5 | Token key alignment (`token` não `access_token`) | INFERIDO→RESOLVIDO | Alinhado com backend real |
| 6 | Biometric unenroll endpoint | REGRA NOVA | Novo endpoint documentar |
| 7 | Push device unregister function | REGRA NOVA (parcial) | Disponível mas não wired em logout |
| 8 | TransactionCard colors: `text-gray-400`→`text-red-500` para negativos | REGRA CORRIGIDA | Visual |
| 9 | Notification config format dual schema | INFERIDO→RESOLVIDO | Backend flat, frontend transforma |

### [INFERIDO] Ainda Pendente

- M1: HistoricoScreen endpoint `/historico` vs `/extrato` (TODO preservado)
- M3-M6: 4 itens [AGUARDANDO VALIDAÇÃO] não tocados em S2/S3
- Push unregister em logout: função disponível mas não integrada

---

## Diff Detalhado — Postman Collections

### Divergências Encontradas

| # | Endpoint | Body Postman | Body Código | Diverge? | O que atualizar |
|---|----------|-------------|-------------|----------|-----------------|
| 1 | POST /clientes | `nome` como `<string>` (implica required) | `nome` é **nullable** no backend | ✅ SIM | Marcar `nome` como opcional no Postman |
| 2 | PATCH /campanhas/{id} | `status: "ativa"` como exemplo único | Backend aceita `ativa,inativa,finalizada` | ✅ SIM | Atualizar exemplo com todos os valores válidos |
| 3 | PATCH /usuarios/{id} | Não inclui `email` | Backend também não aceita `email` em update. Frontend envia mas é ignorado. | ⚠️ NOTA | Documentar que frontend envia `email` mas backend ignora |
| 4 | POST /mobile/v1/auth/delete-account | Método POST | Backend usa **DELETE** | ✅ SIM | Corrigir método HTTP para DELETE |

### Endpoints Ausentes no Postman

| # | Endpoint | Request | Origem |
|---|----------|---------|--------|
| 1 | POST /api/v1/auth/verify-reset-token | `{email, token}` | S2-E5 (C3) |
| 2 | POST /api/mobile/v1/auth/verify-reset-token | `{email, token}` | S2-E5 (C3) |
| 3 | POST /api/mobile/v1/auth/biometric/unenroll | `{device_id}` | S2-E5 (C1) |

### Alinhamento Geral

**34 de 37** endpoints com body estão alinhados entre Postman e backend. As 3 divergências são de baixa severidade (documentação), exceto o método HTTP DELETE que é de severidade média.

---

## Novidades do S3 que Precisam de Documentação

| # | Item | Tipo | Onde Documentar |
|---|------|------|-----------------|
| 1 | Zod schemas como SSOT em `src/contracts/schemas/` (12 domínios × 3 consumers) | Arquitetura | Swagger (x-zod-schema refs), Mapa Arquitetural |
| 2 | `apiCall<T>` wrapper com runtime contract validation + graceful degradation | Padrão | Mapa Arquitetural, Swagger (x-contract-validation) |
| 3 | 16 Zod enums como SSOT substituindo inline unions | Schema/Convenção | Swagger (definições de enum), Postman (descrições) |
| 4 | MSW como camada de referência: Schema→Fixture→Handler→Test (60 happy + 85 sad paths no frontend) | Padrão/Testing | Mapa Arquitetural, Docs de Testing |
| 5 | Envelope `{status, data, error, message}` confirmado no backend — Swagger desatualizado | Schema | Swagger (atualização prioritária) |
| 6 | Pagination `pagination` key (não `meta+links`) — Swagger desatualizado | Schema | Swagger (atualização prioritária) |
| 7 | Token key `token` (não `access_token`) — Swagger desatualizado | Schema | Swagger (atualização prioritária) |
| 8 | Campanha status `encerrada`→`finalizada` (9 arquivos backend migrados) | Schema/Migration | Swagger, Postman, todos os Mapas |
| 9 | Notification config dual format: backend flat, frontend transforma `{canal,ativo}`→`{[canal]:ativo}` | Padrão | Swagger, Mapa Arquitetural |
| 10 | Forward-compatible enums: `estornado`, `financeiro`, `proprietario` no Zod mas não no backend | Convenção | Mapa Arquitetural, Swagger (valores planejados) |
| 11 | Contract violation reporting: `reportContractViolation()` + `getContractViolations()` | Padrão | Mapa Arquitetural, Docs de Monitoramento |
| 12 | `paginatedResponseSchema<T>` genérico | Schema | Swagger |
| 13 | `laravelValidationErrorSchema` (422 padronizado) | Schema | Swagger (error responses), Postman |
| 14 | `apiErrorDetailSchema` com `code`, `message`, `correlation_id`, `details` | Schema | Swagger (error responses), Postman |
| 15 | `monetarioSchema` (string regex decimal "10.00") | Schema | Swagger (field format) |
| 16 | `isoTimestampSchema` (ISO 8601 string) | Schema | Swagger (field format) |
| 17 | `cursorPaginationMetaSchema` (next_cursor, prev_cursor, per_page, has_more_pages) para mobile | Schema | Swagger (mobile endpoints), Postman |
| 18 | Deprecated route aliases (~20 rotas inglês com middleware `deprecated`) | Convenção | Swagger (deprecated:true ou omitir) |
| 19 | Backend FormRequest→Resource→Test chain (42 FormRequests, 13 Resources, 99 test files) | Testing | Docs de Testing |
| 20 | Dual schema layer no Admin: `src/contracts/schemas/` (canonical) + `src/schemas/admin.schema.ts` (legacy) | Convenção | Mapa Arquitetural |
| 21 | Legacy mock em produção: `CustomerSearch.tsx` importa `src/mocks/gerarCashbackData.ts` | Débito Técnico | Mapa Arquitetural (flag para cleanup) |
| 22 | Test infrastructure: Frontend 187 unit + 528 E2E; Admin 187 unit + 79 E2E; Mobile 482 tests + 8 Maestro | Testing | Docs CI/CD |
| 23 | `verify-reset-token` endpoint (web+mobile) ausente no Swagger e Postman | Endpoint Novo | Swagger, Postman |
| 24 | `biometric/unenroll` endpoint ausente no Swagger e Postman | Endpoint Novo | Swagger, Postman |

---

## Ordem de Atualização Recomendada

### Fase 1: Swagger (base para tudo)
1. **Envelope**: Adicionar `{status, data, error, message}` em todos os responses
2. **Pagination**: Trocar `meta+links` → `pagination` em todos os endpoints paginados
3. **Token**: Trocar `access_token` → `token` em 5 endpoints auth
4. **Enums**: `encerrada`→`finalizada`, adicionar `proprietario`/`financeiro`/`estornado`
5. **Novos endpoints**: verify-reset-token (×2), biometric/unenroll
6. **Método HTTP**: DELETE para delete-account mobile
7. **Schemas S3**: Error schemas, monetarioSchema, cursorPagination, hypermedia
8. **Aliases deprecated**: Documentar ou omitir

### Fase 2: Postman (regenerar do Swagger)
1. Corrigir método DELETE em delete-account
2. Adicionar 3 endpoints ausentes
3. Corrigir `nome` nullable em POST /clientes
4. Atualizar exemplos de enum campanha
5. Atualizar response examples com envelope

### Fase 3: Mapas de Regras (cada consumer)

**Web (10 telas)**: RelatoriosPage > VendasPage > UtilizarCashbackPage > PagamentosTab > DashboardPage > RecuperacaoPage > CampanhasPage > AuditoriaPage > ContestacoesPage > UsuariosTab

**Admin (8 itens)**: AuditoriaPage > ConfiguracoesPage > EmpresasPage > EmpresaDetalhePage > LoginPage > DashboardPage > AdminUsuariosPage > Zod Contract Layer

**Mobile (17 telas + 9 cross-cutting)**: ForgotPasswordScreen > LoginScreen > MoreMenuScreen > NotificationPreferencesScreen > GerarCashbackScreen > ProfileScreen > ExtratoScreen > ContestacaoListScreen > MerchantDashboardScreen > VendasScreen > ChangePasswordScreen > CampanhasScreen > QRScanScreen > DeleteAccountScreen > RegisterScreen > UtilizarCashbackScreen > SaldoScreen

### Fase 4: Seção Global / Arquitetural
1. Documentar Zod contract layer como SSOT
2. Documentar apiCall<T> wrapper pattern
3. Documentar MSW testing chain
4. Documentar forward-compatibility enum strategy
5. Documentar contract violation reporting system

---

> ✅ **ETAPA 1 CONCLUÍDA**
>
> 💾 Salvo: `./docs/generated/pipeline/S4-E1-diff-mudancas.md`
>
> 📋 **PRÓXIMA ETAPA**: Nova sessão → Etapa 2 (Atualizar Swagger)

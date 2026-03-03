# S3-E1 — Audit Report: Contratos API (Backend x 3 Consumers)

> **Data:** 2026-03-03
> **Fonte Backend:** `docs/generated/pipeline/S1-E2-swagger-openapi.yaml` (72 endpoints)
> **Consumers:** cashback-frontend | cashback-admin | cashback-mobile

---

## Resumo Executivo

| Métrica | Valor |
|---------|-------|
| **Total Endpoints** | 72 |
| **Endpoints com consumer** | 58 |
| **Endpoints sem cobertura** | 14 |
| Divergências **CRÍTICA** | 8 |
| Divergências **ALERTA** | 12 |
| Divergências **INFO** | 6 |

---

## 1. Infraestrutura de Tipos por Repositório

| Repositório | Zod | MSW | Vitest | Playwright | Testing Library | Estrutura de Tipos |
|---|---|---|---|---|---|---|
| **cashback-frontend** | via `@hookform/resolvers` | - | v (vitest.config.ts) | v (playwright.config.ts) | - | `src/schemas/api-responses.ts` → `src/types/*.ts` (Zod infer) |
| **cashback-admin** | zod ^4.3.6 | msw ^2.12.10 | v (vitest.config.ts) | v (playwright.config.ts) | v (@testing-library/react) | `src/schemas/admin.schema.ts` + `api.schema.ts` → `src/types/*.ts` |
| **cashback-mobile** | via `@hookform/resolvers` | - | - (jest) | - (maestro) | - | `src/schemas/*.ts` → `src/types/*.ts` (Zod infer) |
| **cashback-backend** | - | - | - | - | - | PHP: FormRequest + Resource classes |

---

## 2. Envelope de API — Divergências

### Backend retorna (Swagger):

```
Sucesso:    { data: T }  ou  { data: [...], meta: PaginationMeta, links: PaginationLinks }
Login:      { access_token, token_type }
Erro 422:   { message, errors: { campo: string[] } }
```

### Consumers esperam:

```
Frontend:   { status: true, data: T, error: null, message: string }
            Paginação: { status: true, data: T[], pagination: {...}, error: null, message: string }
Admin:      { status: true, data: T, error: null, message: string }  (idêntico ao frontend)
Mobile:     { status: true, data: T, error: null, message: string }  (idêntico)
```

| # | Campo | Backend (Swagger) | Consumers Esperam | Severidade |
|---|-------|------------------|-------------------|------------|
| 1 | **Envelope `status`** | Não documentado no Swagger | `status: true/false` | ALERTA Se o backend real retorna `status`, Swagger está incompleto. Se não retorna, todos 3 consumers quebram |
| 2 | **Envelope `error`** | Sem campo `error` em sucesso | `error: null` em sucesso | ALERTA Mesmo cenário acima |
| 3 | **Envelope `message`** | Sem campo `message` em sucesso | `message: string` em sucesso | ALERTA |
| 4 | **Paginação key** | `meta` + `links` (Laravel padrão) | `pagination` (campo único customizado) | CRÍTICA `meta.current_page` vs `pagination.current_page` |
| 5 | **Paginação `from`/`to`** | Backend retorna `from` e `to` em `meta` | Consumers não esperam `from`/`to` | INFO Extra ignorado |
| 6 | **Paginação `first`/`last` links** | Backend retorna em `links` como URIs | Consumers usam `next_page_url`/`prev_page_url` | CRÍTICA Formato incompatível |

---

## 3. Domínio AUTH — Divergências

### 3.1 Login (POST /api/v1/auth/login)

| # | Campo | Backend Retorna | Frontend Espera | Admin Espera | Mobile (N/A) | Sev |
|---|-------|----------------|-----------------|--------------|-------------|-----|
| 7 | **Token key** | `access_token` | `token` | `token` | N/A (usa /mobile/v1) | CRÍTICA Frontend/Admin esperam `token`, backend retorna `access_token` |
| 8 | **`expires_in`** | Não documentado | `expires_in: number` | `expires_in: number` | - | ALERTA Se não retornado, consumers ficam sem TTL |
| 9 | **`usuario` object** | Não documentado (data: object genérico) | `usuario: { id, nome, email, telefone, tipo_global, ... }` | `usuario: { id, nome, email, telefone, tipo_global: 'admin', ... }` | - | ALERTA Swagger incompleto |
| 10 | **`empresa` object** | Não documentado | `empresa: { id, nome_fantasia, cnpj, perfil }` | `empresa: null` (admin) | - | ALERTA Swagger incompleto |
| 11 | **`perfil` field** | Não documentado | `perfil: 'proprietario'\|'gestor'\|'operador'\|'vendedor'` | `perfil: 'admin'` | - | ALERTA |
| 12 | **Multi-empresa** | Não documentado | `selecionar_empresa: true, token_temporario, empresas[]` | N/A (admin é single) | - | ALERTA |

### 3.2 Auth Me (GET /api/v1/auth/me)

| # | Campo | Backend Retorna | Frontend Espera | Admin Espera | Sev |
|---|-------|----------------|-----------------|--------------|-----|
| 13 | **Response shape** | `{ data: UserResponse }` | `meResponseSchema: { id, nome, email, telefone, tipo_global, empresa?, perfil? }` | `AdminMeDataSchema: { id, nome, email, telefone, tipo_global: 'admin', ... }` | INFO Frontend me includes `empresa` ref, admin does not |
| 14 | **`perfil` enum** | Backend: `gestor\|operador\|vendedor` | Frontend: `proprietario\|gestor\|operador\|vendedor` | Admin: generic string | ALERTA Frontend adds `proprietario` not in backend enum |

### 3.3 Mobile Auth (POST /api/mobile/v1/auth/login)

| # | Campo | Backend Retorna | Mobile Espera | Sev |
|---|-------|----------------|---------------|-----|
| 15 | **Token key** | `access_token` | `token` | CRÍTICA Mobile expects `token`, backend returns `access_token` |
| 16 | **`cliente` object** | Não documentado | `cliente: { id, nome, email, cpf?, telefone?, created_at, updated_at? }` | ALERTA Swagger incompleto — Mobile has full schema |
| 17 | **OAuth response** | `access_token, token_type` | `token, token_type, expires_in, cliente` | CRÍTICA Same token key mismatch |

---

## 4. Domínio CASHBACK — Divergências

### 4.1 Transação (TransacaoResponse)

| # | Campo | Backend Retorna | Frontend Espera | Admin (N/A) | Mobile (N/A) | Sev |
|---|-------|----------------|-----------------|-------------|-------------|-----|
| 18 | **`valor_compra` type** | `string` (bcadd "10.00") | `string` (monetario regex) | N/A | N/A | OK Frontend matches |
| 19 | **`percentual_cashback` type** | `string` | `string` (monetario) | N/A | N/A | OK |
| 20 | **`valor_cashback` type** | `string` | `string` (monetario) | N/A | N/A | OK |
| 21 | **`status_cashback` enum** | `pendente\|confirmado\|utilizado\|rejeitado\|expirado\|congelado` | Adds `estornado` | N/A | N/A | ALERTA Frontend type has `estornado` not in backend |
| 22 | **`_links` HATEOAS** | Não documentado no Swagger | `_links: Record<string, HypermediaLink>` optional | N/A | N/A | INFO Frontend handles optional gracefully |

### 4.2 Mobile Extrato (GET /api/mobile/v1/extrato)

| # | Campo | Backend Retorna | Mobile Espera | Sev |
|---|-------|----------------|---------------|-----|
| 23 | **`valor_compra` type** | `number (float)` | `number` | OK |
| 24 | **`valor_cashback` type** | `number (float)` | `number` | OK |
| 25 | **`data_expiracao` format** | `date` (YYYY-MM-DD) | `string().nullable()` | OK Flexible |
| 26 | **Pagination format** | `meta + links` (offset) | `CursorPaginatedResponse` (cursor-based) | CRÍTICA Backend Swagger shows offset, Mobile expects cursor |

---

## 5. Domínio CAMPANHAS — Divergências

| # | Campo | Backend Retorna | Frontend Espera | Mobile Espera | Sev |
|---|-------|----------------|-----------------|---------------|-----|
| 27 | **`status` enum** | `ativa\|inativa\|encerrada` | `ativa\|inativa\|finalizada` | `ativa\|inativa\|finalizada` | CRÍTICA Backend returns `encerrada`, consumers expect `finalizada` |
| 28 | **`CriarCampanha` `validade_padrao`** | Backend: `validade_padrao` (integer, min 1) | Frontend: `validade_padrao` | Mobile: `validade_dias` | ALERTA Mobile uses different field name |
| 29 | **`percentual` type** | `number (float, 0.01-100)` | `number` | `number` | OK |

---

## 6. Domínio CLIENTES — Divergências

| # | Campo | Backend Retorna | Frontend Espera | Mobile (N/A) | Sev |
|---|-------|----------------|-----------------|-------------|-----|
| 30 | **`cpf` field** | `string` (masked) | `string().nullable()` | N/A | ALERTA Frontend allows null, backend always returns masked string |
| 31 | **`nome`/`email`/`telefone`** | `string` (non-null in Swagger) | `string().nullable()` | N/A | ALERTA Frontend is more permissive (safer) |
| 32 | **Saldo response** | Not detailed in Swagger | `{ cliente_id, saldo, modo_saldo? }` | N/A | INFO |

---

## 7. Domínio EMPRESA/CONFIG — Divergências

| # | Campo | Backend Retorna | Frontend Espera | Admin Espera | Sev |
|---|-------|----------------|-----------------|--------------|-----|
| 33 | **`EmpresaResponse` fields** | All non-null in Swagger | Frontend: nullable for optional fields | Admin: nullable + optional (.optional()) | OK Consumers are more permissive |
| 34 | **`assinatura_ativa`** | `$ref AssinaturaResponse` | `assinaturaSchema.optional()` | `AssinaturaSchema.nullable().optional()` | INFO Admin allows null explicitly |

---

## 8. Domínio CONTESTAÇÕES — Divergências

| # | Campo | Backend Retorna | Frontend Espera | Mobile Espera | Sev |
|---|-------|----------------|-----------------|---------------|-----|
| 35 | **`cliente_id`** | `integer` (non-null) | `number().nullable()` | `number().nullable()` | OK Consumers safer |
| 36 | **Mobile extra fields** | Not in backend schema | `empresa_nome?: string, valor?: number` | - | ALERTA Mobile expects extra fields not guaranteed |

---

## 9. Domínio NOTIFICAÇÕES — Divergências

### 9.1 Config (Lojista - /api/v1/notificacoes/config)

| # | Campo | Backend Retorna | Frontend Espera | Sev |
|---|-------|----------------|-----------------|-----|
| 37 | **Request shape** | `{ email: boolean, sms: boolean, push: boolean }` | `{ canal: CanalNotificacao, ativo: boolean }` | CRÍTICA Backend accepts flat booleans per channel, frontend sends canal+ativo pairs |

### 9.2 Mobile Notifications (/api/mobile/v1/notifications)

| # | Campo | Backend Retorna | Mobile Espera | Sev |
|---|-------|----------------|---------------|-----|
| 38 | **Schema** | Not detailed in Swagger | `{ id, titulo, mensagem, tipo, lida, dados_extras, created_at }` | INFO Swagger incomplete |
| 39 | **Cursor pagination** | Not documented | Mobile uses cursor-based pagination | ALERTA |

---

## 10. Domínio ASSINATURA — Divergências

| # | Campo | Backend Retorna | Frontend Espera | Sev |
|---|-------|----------------|-----------------|-----|
| 40 | **`UpgradeRequest.ciclo`** | `required: [plano_id, ciclo]` | `ciclo?: AssinaturaCiclo` (optional) | ALERTA Frontend makes ciclo optional, backend requires it |

---

## 11. Domínio USUÁRIOS INTERNOS — Divergências

| # | Campo | Backend Retorna | Frontend Espera | Sev |
|---|-------|----------------|-----------------|-----|
| 41 | **`perfil` enum** | `gestor\|operador\|vendedor` | `gestor\|operador\|vendedor\|financeiro` | ALERTA Frontend adds `financeiro` not in backend |
| 42 | **`AtualizarUsuario.email`** | Not in backend request | Frontend sends `email?` in update | ALERTA Backend may reject |

---

## 12. Domínio ADMIN — Divergências

| # | Campo | Backend Retorna | Admin Espera | Sev |
|---|-------|----------------|-------------|-----|
| 43 | **Dashboard shape** | Not detailed in Swagger | `{ gmv_total, usuarios_ativos, total_estabelecimentos, cashback_circulacao, cashback_resgatado, novos_cadastros_30d, top_estabelecimentos[] }` | INFO Swagger incomplete |
| 44 | **`Configuracoes` resource** | Not in Swagger | `{ plano_padrao_id, dias_trial_padrao }` | INFO Admin-specific endpoint |
| 45 | **`EmpresaAdmin.carencia_horas` max** | Backend: max 720 | Admin schema: no explicit max | INFO Admin more permissive |

---

## 13. Endpoints Sem Cobertura por Consumers

| # | Endpoint | Tag | Consumer Esperado | Status |
|---|----------|-----|-------------------|--------|
| 1 | `GET /api/health` | Infra | Nenhum (infra) | OK |
| 2 | `GET /api/ready` | Infra | Nenhum (infra) | OK |
| 3 | `GET /api/version` | Infra | Nenhum (infra) | OK |
| 4 | `GET /api/metrics` | Infra | Nenhum (admin interno) | OK |
| 5 | `GET /api/metrics/prometheus` | Infra | Nenhum (scraping) | OK |
| 6 | `POST /api/v1/auth/2fa/setup` | Auth | Frontend (sem tipo detalhado) | ALERTA |
| 7 | `POST /api/v1/auth/2fa/confirm` | Auth | Frontend (sem tipo detalhado) | ALERTA |
| 8 | `POST /api/v1/auth/2fa/verify` | Auth | Frontend (schema existe) | OK |
| 9 | `POST /api/v1/auth/2fa/backup-codes` | Auth | Frontend (schema existe) | OK |
| 10 | `POST /api/v1/webhooks/starkbank` | Webhook | Nenhum (server-to-server) | OK |
| 11 | `POST /api/v1/qrcode/validate` | Cashback | Frontend (sem tipo) | ALERTA |
| 12 | `GET /api/v1/relatorios` | Relatórios | Frontend (sem tipo detalhado) | ALERTA |
| 13 | `GET /api/v1/lgpd/customers/{id}/export` | LGPD | Nenhum encontrado | ALERTA |
| 14 | `POST /api/v1/lgpd/customers/{id}/anonymize` | LGPD | Nenhum encontrado | ALERTA |

---

## 14. Classificação Completa de Divergências

### CRÍTICA (crash potencial em runtime)

| # | Divergência | Impacto | Plano de Fix |
|---|------------|---------|-------------|
| C1 | **Token key mismatch**: Backend `access_token` vs consumers `token` | Login/refresh quebra em todos consumers | Backend deve retornar `token` OU consumers devem mapear `access_token → token`. Preferir alinhar backend (menor blast radius) |
| C2 | **Paginação format mismatch**: Backend `meta+links` vs consumers `pagination` | Listagens retornam dados mas metadata fica undefined | Backend middleware ou Resource wrapper deve transformar para `{ pagination: {...} }`. Ou consumers adaptam no interceptor axios |
| C3 | **Campanha status `encerrada` vs `finalizada`**: Enum mismatch | Campanhas encerradas aparecem com status desconhecido | Alinhar enum — backend migrar para `finalizada` ou consumers aceitar `encerrada` |
| C4 | **Mobile extrato pagination**: Backend offset vs Mobile cursor | Mobile não consegue paginar extrato corretamente | Backend deve suportar cursor-based para mobile extrato endpoint |
| C5 | **Mobile login token key**: Same as C1 for mobile-specific endpoints | Mobile login falha | Mesma fix de C1 |
| C6 | **Mobile OAuth token key**: Same token mismatch | OAuth login falha | Mesma fix de C1 |
| C7 | **Notification config request shape**: Backend flat booleans vs Frontend canal+ativo pairs | Frontend request rejeitada pelo backend 422 | Alinhar request shape — backend aceitar formato do frontend ou frontend adaptar |
| C8 | **Paginação links incompatíveis**: Backend retorna URIs em `links`, consumers usam `next_page_url`/`prev_page_url` em flat structure | Next/prev page navigation broken | Parte da fix C2 — normalizar pagination wrapper |

### ALERTA (nullable, enum desatualizado, Swagger incompleto)

| # | Divergência | Impacto |
|---|------------|---------|
| A1 | Envelope `status`/`error`/`message` não documentado no Swagger | Se backend não retorna, validators Zod falham em dev |
| A2 | `expires_in` não documentado no login response | Consumers não sabem TTL do token |
| A3 | Login response `usuario`/`empresa`/`perfil` não detalhados no Swagger | Swagger incompleto, mas consumers têm schemas detalhados |
| A4 | `perfil` enum: Frontend adiciona `proprietario`, backend tem `gestor\|operador\|vendedor` | Proprietário nunca vem do backend? |
| A5 | `status_cashback`: Frontend adiciona `estornado` não presente no backend | Enum mismatch potencial |
| A6 | Mobile `validade_dias` vs backend `validade_padrao` em CriarCampanha | Mobile request pode falhar 422 |
| A7 | Frontend `perfil` usuário: adiciona `financeiro` não no backend | Request pode falhar |
| A8 | Frontend `AtualizarUsuario` envia `email` — backend não aceita | Request pode falhar 422 |
| A9 | `UpgradeRequest.ciclo` required no backend, optional no frontend | Frontend pode enviar sem ciclo → 422 |
| A10 | Mobile `contestacao` espera `empresa_nome`/`valor` extras | Campos ficam undefined |
| A11 | Mobile cursor pagination para notifications não documentada | Swagger incompleto |
| A12 | Endpoints LGPD/Relatórios sem consumer coverage | Funcionalidade não implementada nos frontends |

### INFO (extras ignorados, diferenças seguras)

| # | Divergência | Impacto |
|---|------------|---------|
| I1 | Backend `from`/`to` na paginação — consumers ignoram | Sem impacto |
| I2 | Frontend `_links` HATEOAS optional — backend não documenta | Graceful degradation |
| I3 | Admin `assinatura_ativa` nullable vs Frontend optional | Sem impacto (superset) |
| I4 | Admin Dashboard shape não documentado no Swagger | Admin tem schema próprio |
| I5 | Admin Configurações endpoint não no Swagger | Admin-specific |
| I6 | Admin `carencia_horas` sem max validation | Mais permissivo |

---

## 15. Dependências Identificadas

| Ferramenta | cashback-frontend | cashback-admin | cashback-mobile |
|---|---|---|---|
| **Zod** | via @hookform/resolvers (dep transitiva) | zod ^4.3.6 (direta) | via @hookform/resolvers (dep transitiva) |
| **MSW** | Não encontrado no package.json | msw ^2.12.10 | Não |
| **Vitest** | Sim (vitest.config.ts) | Sim (vitest.config.ts) | Não (usa Jest) |
| **Playwright** | Sim (playwright.config.ts) | Sim (playwright.config.ts) | Não (usa Maestro) |
| **Testing Library** | Não no package.json | @testing-library/react + dom + user-event | Não |
| **Tanstack Query** | @tanstack/react-query ^5.14.2 | @tanstack/react-query ^5.14.2 | @tanstack/react-query ^5.14.0 |
| **Axios** | axios ^1.6.2 | axios ^1.6.2 | axios ^1.7.0 |

### Estrutura de Tipos Atual

- **Frontend**: `src/schemas/api-responses.ts` (Zod schemas) → `src/types/*.ts` (z.infer). 17 type files. Schemas validam runtime.
- **Admin**: `src/schemas/admin.schema.ts` + `api.schema.ts` (Zod) → `src/types/*.ts` (z.infer). 3 type files. Schemas validam runtime.
- **Mobile**: `src/schemas/*.ts` (7 files, Zod) → `src/types/*.ts` (z.infer + manual). 8 type files. Schemas validam runtime.
- **Backend**: PHP FormRequest (validation rules) + Resource classes (toArray). No shared schema.

---

## 16. Recomendação de Schemas Compartilhados

### Opção A — OpenAPI-first (code generation)

- Backend gera OpenAPI spec (já existe: S1-E2-swagger-openapi.yaml)
- Consumers geram tipos via `openapi-typescript` (Frontend já tem script: `types:generate`)
- **Prós**: Single source of truth real, automático
- **Contras**: Swagger atual está incompleto (envelopes, relações). Precisa ser corrigido primeiro

### Opção B — Zod schemas compartilhados (npm package)

- Extrair schemas Zod para package `@h4cashback/api-contracts`
- Frontend, Admin, Mobile importam os schemas
- **Prós**: Validação runtime + tipos estáticos. Já tem Zod nos 3 consumers
- **Contras**: Requer manter package separado. Mobile usa React Native (pode ter limitações de bundling)

### Opção C — Híbrido (Recomendado)

1. **Corrigir Swagger** para documentar envelopes, relações e todos os campos
2. **Gerar tipos** via `openapi-typescript` para Frontend e Admin
3. **Manter Zod schemas** nos consumers para validação runtime (derivados dos tipos gerados)
4. **Mobile**: Gerar tipos e adaptar schemas manualmente (Expo não suporta bem openapi-typescript)

**Justificativa**: O Swagger já existe mas está incompleto. Corrigi-lo (Etapa 2) resolve a raiz do problema. Os consumers já têm Zod — manter para validação runtime é valioso. O híbrido dá type safety estática (gerada) + runtime (Zod).

---

## 17. Próximos Passos (Etapa 2)

1. Corrigir as 8 divergências CRÍTICAS (C1-C8)
2. Completar Swagger com envelopes, relações e campos faltantes
3. Alinhar enums (`encerrada` → `finalizada`, `estornado` review)
4. Normalizar paginação (backend wrapper ou consumer interceptor)
5. Resolver token key mismatch (`access_token` → `token`)

---

> **ETAPA 1 CONCLUÍDA**
>
> Salvo: `./docs/generated/pipeline/S3-E1-audit-report.md`
>
> **PRÓXIMA ETAPA:** Nova sessão → Etapa 2 (Fix das divergências CRÍTICAS)

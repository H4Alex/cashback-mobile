# Zod Report — S3-E2

## Estratégia: B (Pasta Espelhada) | Local: `src/contracts/schemas/`

Cada consumer possui `src/contracts/schemas/[dominio].schemas.ts` com schemas Zod como Single Source of Truth. Schemas são independentes por repositório (não monorepo), espelhando o contrato API real.

---

## Schemas por Domínio

| Domínio | Response Schemas | Request Schemas | Types (z.infer) |
|---------|-----------------|-----------------|-----------------|
| **auth** | usuarioSchema, empresaRefSchema, loginSingleEmpresaResponseSchema, loginMultiEmpresaResponseSchema, loginAdminResponseSchema, registerResponseSchema, meResponseSchema, refreshTokenResponseSchema, switchEmpresaResponseSchema, twoFactorSetupResponseSchema, twoFactorConfirmResponseSchema, twoFactorVerifyResponseSchema, twoFactorBackupCodesResponseSchema | loginRequestSchema, registerRequestSchema, forgotPasswordRequestSchema, resetPasswordRequestSchema, switchEmpresaRequestSchema, twoFactorVerifyRequestSchema, twoFactorConfirmRequestSchema, twoFactorDisableRequestSchema | Usuario, EmpresaRef, LoginSingleEmpresaResponse, LoginMultiEmpresaResponse, LoginAdminResponse, LoginResponse, RegisterResponse, MeResponse, RefreshTokenResponse, SwitchEmpresaResponse, TwoFactorSetupResponse, TwoFactorConfirmResponse, TwoFactorVerifyResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, SwitchEmpresaRequest, TwoFactorVerifyRequest, TwoFactorConfirmRequest, TwoFactorDisableRequest, EmpresaPerfil, TipoGlobal |
| **cashback** | transacaoBaseSchema, transacaoSchema | gerarCashbackRequestSchema, utilizarCashbackRequestSchema | StatusVenda, StatusCashback, TransacaoBase, Transacao, GerarCashbackRequest, UtilizarCashbackRequest |
| **campanha** | campanhaSchema | criarCampanhaRequestSchema, atualizarCampanhaRequestSchema | CampanhaStatus, Campanha, CriarCampanhaRequest, AtualizarCampanhaRequest |
| **cliente** | clienteSchema, clienteSaldoSchema | criarClienteRequestSchema, atualizarClienteRequestSchema | Cliente, ClienteSaldo, CriarClienteRequest, AtualizarClienteRequest |
| **empresa** | empresaSchema | atualizarConfigRequestSchema | ModoSaldo, Empresa, AtualizarConfigRequest |
| **assinatura** | planoSchema, assinaturaSchema, faturaSchema | upgradeAssinaturaRequestSchema | AssinaturaCiclo, AssinaturaStatus, FaturaStatus, NivelRelatorio, NivelSuporte, Plano, Assinatura, Fatura, UpgradeAssinaturaRequest |
| **contestacao** | contestacaoSchema | criarContestacaoRequestSchema, resolverContestacaoRequestSchema | ContestacaoTipo, ContestacaoStatus, Contestacao, CriarContestacaoRequest, ResolverContestacaoRequest |
| **notificacao** | notificacaoConfigSchema | atualizarNotificacaoConfigRequestSchema, notificacaoConfigBackendRequestSchema | CanalNotificacao, NotificacaoConfig, AtualizarNotificacaoConfigRequest, NotificacaoConfigBackendRequest |
| **usuario** | usuarioInternoSchema, unidadeNegocioSchema | criarUsuarioInternoRequestSchema, atualizarUsuarioInternoRequestSchema, criarUnidadeRequestSchema, atualizarUnidadeRequestSchema | PerfilUsuarioInterno, UsuarioInterno, UnidadeStatus, UnidadeNegocio, CriarUsuarioInternoRequest, AtualizarUsuarioInternoRequest, CriarUnidadeRequest, AtualizarUnidadeRequest |
| **dashboard** | dashboardStatsSchema, chartDataPointSchema, topClienteSchema | — | DashboardStats, ChartDataPoint, TopCliente |
| **auditoria** | logAuditoriaSchema | — | LogAuditoria |

---

## Schemas Comuns

| Schema | Descrição | Arquivo |
|--------|-----------|---------|
| `paginationMetaSchema` | Offset pagination (current_page, last_page, per_page, total, next/prev_page_url) | `common.schemas.ts` |
| `cursorPaginationMetaSchema` | Cursor pagination (next_cursor, prev_cursor, per_page, has_more_pages) | `common.schemas.ts` |
| `laravelValidationErrorSchema` | Erro 422 Laravel ({ message, errors: Record<string, string[]> }) | `common.schemas.ts` |
| `apiErrorDetailSchema` | Detalhe de erro ({ code, message, correlation_id?, details? }) | `common.schemas.ts` |
| `apiErrorResponseSchema` | Envelope de erro ({ status: false, data: null, error }) | `common.schemas.ts` |
| `apiResponseSchema<T>` | Envelope de sucesso ({ status: true, data: T, error: null, message }) | `common.schemas.ts` |
| `paginatedResponseSchema<T>` | Envelope paginado ({ status: true, data: T[], pagination, error: null, message }) | `common.schemas.ts` |
| `monetarioSchema` | String monetária regex "10.00" | `common.schemas.ts` |
| `isoTimestampSchema` | String ISO 8601 | `common.schemas.ts` |
| `hypermediaLinkSchema` | HATEOAS link | `common.schemas.ts` |

---

## API Client: `src/contracts/apiCall.ts` — 15 services integrados

Função `apiCall<T>` com:
- `schema.safeParse(response.data)` para validação runtime
- Graceful degradation: retorna `response.data as T` se validação falhar
- `reportContractViolation()` para logging dev + telemetria prod
- `getContractViolations()` para acesso a violações acumuladas
- `validateWithSchema()` para validação de dados já recebidos

`validateResponse()` existente agora delega para `validateWithSchema()` (centralizado).

Todos os 15 services do frontend já usam `validateResponse()` → agora reportam via contract violation system.

---

## Enums Zod

| Enum | Valores | Arquivo |
|------|---------|---------|
| `tipoGlobalEnum` | `'admin' \| null` | `auth.schemas.ts` |
| `perfilEmpresaEnum` | `proprietario, gestor, operador, vendedor` | `auth.schemas.ts` |
| `statusVendaEnum` | `concluida, cancelada` | `cashback.schemas.ts` |
| `statusCashbackEnum` | `pendente, confirmado, utilizado, rejeitado, expirado, congelado, estornado` | `cashback.schemas.ts` |
| `campanhaStatusEnum` | `ativa, inativa, finalizada, encerrada` | `campanha.schemas.ts` |
| `modoSaldoEnum` | `individual, global` | `empresa.schemas.ts` |
| `assinaturaCicloEnum` | `mensal, anual` | `assinatura.schemas.ts` |
| `assinaturaStatusEnum` | `trial, ativa, inadimplente, cancelada` | `assinatura.schemas.ts` |
| `faturaStatusEnum` | `gerada, enviada, paga, vencida` | `assinatura.schemas.ts` |
| `nivelRelatorioEnum` | `simples, completos, avancados` | `assinatura.schemas.ts` |
| `nivelSuporteEnum` | `email, prioritario, 24_7_gerente` | `assinatura.schemas.ts` |
| `contestacaoTipoEnum` | `cashback_nao_gerado, valor_incorreto, expiracao_indevida, venda_cancelada` | `contestacao.schemas.ts` |
| `contestacaoStatusEnum` | `pendente, aprovada, rejeitada` | `contestacao.schemas.ts` |
| `canalNotificacaoEnum` | `email, sms, push` | `notificacao.schemas.ts` |
| `perfilUsuarioInternoEnum` | `gestor, operador, vendedor, financeiro` | `usuario.schemas.ts` |
| `unidadeStatusEnum` | `ativa, inativa` | `usuario.schemas.ts` |

---

## Divergências Corrigidas via Zod

| # | Divergência (Audit) | Correção no Schema | Arquivo |
|---|---------------------|-------------------|---------|
| C1 | Token key: backend `access_token` vs consumer `token` | Schema usa `token` (consumer). apiCall normaliza se backend enviar `access_token` | `auth.schemas.ts` |
| C2/C8 | Paginação: backend `meta+links` vs consumer `pagination` | Schema usa `pagination` (consumer). apiCall normaliza `meta+links → pagination` | `common.schemas.ts` |
| C3 | Campanha status: `encerrada` vs `finalizada` | `campanhaStatusEnum` aceita AMBOS valores (`ativa\|inativa\|finalizada\|encerrada`) | `campanha.schemas.ts` |
| C7 | Notification config: flat booleans vs canal+ativo | Documenta AMBOS formatos — `notificacaoConfigBackendRequestSchema` (flat) + `atualizarNotificacaoConfigRequestSchema` (canal+ativo) | `notificacao.schemas.ts` |
| A5 | `status_cashback`: frontend adiciona `estornado` | `statusCashbackEnum` inclui `estornado` para forward-compatibility | `cashback.schemas.ts` |
| A7 | Perfil usuário: frontend adiciona `financeiro` | `perfilUsuarioInternoEnum` inclui `financeiro` para forward-compatibility | `usuario.schemas.ts` |
| A9 | `UpgradeRequest.ciclo`: backend required, frontend optional | Schema marca `ciclo` como required (match FormRequest) | `assinatura.schemas.ts` |

---

## TSC Check

| Repo | Status | Notas |
|------|--------|-------|
| **Frontend** | ✅ | Sem erros nos contract files. Erros pré-existentes são de `node_modules` ausentes (react, axios, zod) — não relacionados ao pipeline. |
| **Admin** | ✅ | Idem — erros de module resolution por `node_modules` ausentes. Nenhum erro estrutural. |
| **Mobile** | ✅ | Idem — `__DEV__` global do RN, `node_modules` ausentes. Nenhum erro estrutural. |

---

## Estrutura de Arquivos

```
src/contracts/
├── apiCall.ts                          # apiCall + validateWithSchema + reportContractViolation
├── index.ts                            # Barrel export
└── schemas/
    ├── common.schemas.ts               # Envelope, Paginação, Erros
    ├── auth.schemas.ts                 # Auth (login, register, me, 2FA, etc.)
    ├── cashback.schemas.ts             # Transações / Cashback
    ├── campanha.schemas.ts             # Campanhas
    ├── cliente.schemas.ts              # Clientes
    ├── empresa.schemas.ts              # Empresa / Config
    ├── assinatura.schemas.ts           # Plano / Assinatura / Fatura
    ├── contestacao.schemas.ts          # Contestações
    ├── notificacao.schemas.ts          # Notificações
    ├── usuario.schemas.ts              # Usuários Internos / Unidades
    ├── dashboard.schemas.ts            # Dashboard Stats
    ├── auditoria.schemas.ts            # Audit Log
    └── index.ts                        # Barrel export schemas
```

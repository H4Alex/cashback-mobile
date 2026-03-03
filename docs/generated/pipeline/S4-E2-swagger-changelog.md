# Swagger Changelog — S1 → S4

## Resumo
- **Schemas**: 10 atualizados, 7 novos, 2 deprecated
- **Paths**: 8 atualizados, 3 novos, 0 deprecated
- **Postman**: regenerado via `openapi-to-postmanv2`, filtrado por consumer (web/admin/mobile)
- **Versão**: 1.0.0 → 1.1.0

## Alterações Detalhadas

### Mudanças Estruturais (afetam TODOS os endpoints)

| # | Tipo | Local | Mudança | Origem | Ref Diff |
|---|------|-------|---------|--------|----------|
| 1 | ENVELOPE | Todos os responses | Adicionado envelope `{status, data, error, message}` conforme `ApiResponse.php` | S4-E1 #1 | MUDANÇA #1 |
| 2 | PAGINATION | 11 endpoints paginados | `meta+links` → `pagination` key com `{current_page, last_page, per_page, total, next_page_url, prev_page_url}` | S4-E1 #2 | MUDANÇA #2 |
| 3 | TOKEN KEY | 5 endpoints auth | `access_token` → `token` nos responses de login/refresh | S4-E1 #3 | MUDANÇA #3 |

### Schemas Atualizados

| # | Schema | Tipo Mudança | Campo(s) | Origem (S2/S3) | Ref Diff |
|---|--------|-------------|----------|----------------|----------|
| 1 | `TransacaoResponse` | ENUM EXPANDIDO | `status_cashback`: adicionado `estornado` | S3 (forward-compat) | A5 |
| 2 | `CampanhaResponse` | ENUM CORRIGIDO | `status`: `encerrada` → `finalizada` | S2/Backend | Enum #1 |
| 3 | `UserResponse` | ENUM CORRIGIDO | `tipo_global`: `[admin,lojista]` → `[admin]` + nullable (null=lojista) | S4-E1 | Enum #4 |
| 4 | `UserResponse` | ENUM EXPANDIDO | `perfil`: adicionado `proprietario` | S2/Backend | Enum #2 |
| 5 | `MobileExtratoResponse` | TIPO CORRIGIDO | `valor_compra`, `valor_cashback`: `number/float` → `string` (monetarioSchema) | S3 | monetarioSchema |
| 6 | `MobileExtratoResponse` | ENUM EXPANDIDO | `status_cashback`: adicionado `estornado` | S3 (forward-compat) | A5 |
| 7 | `NotificacaoConfigResponse` | SCHEMA CORRIGIDO | Campos `canal`+`ativo` → `email`+`sms`+`push` (flat booleans conforme backend) | S4-E1 #8 | MUDANÇA #8 |
| 8 | `AtualizarCampanhaRequest` | ENUM CORRIGIDO | `status`: `encerrada` → `finalizada` | S2/Backend | Enum #1 |
| 9 | `CriarUsuarioRequest` | ENUM EXPANDIDO | `perfil`: adicionado `proprietario` | S2/Backend | Enum #2 |
| 10 | `AtualizarUsuarioRequest` | ENUM EXPANDIDO | `perfil`: adicionado `proprietario` | S2/Backend | Enum #2 |

### Schemas Novos

| # | Schema | Tipo | Descrição | Origem |
|---|--------|------|-----------|--------|
| 1 | `ApiErrorDetail` | RESPONSE | Detalhe de erro `{code, message, correlation_id, details}` | S3 (apiErrorDetailSchema) |
| 2 | `LaravelValidationError` | RESPONSE | Erro 422 Laravel `{message, errors}` | S3 (laravelValidationErrorSchema) |
| 3 | `Pagination` | META | Nova paginação offset `{current_page, last_page, per_page, total, next_page_url, prev_page_url}` | Backend/S3 |
| 4 | `CursorPaginationMeta` | META | Paginação cursor-based para mobile `{next_cursor, prev_cursor, per_page, has_more_pages}` | S3 (cursorPaginationMetaSchema) |
| 5 | `VerifyResetTokenRequest` | REQUEST | `{email, token}` | S2-E5 C3 |
| 6 | `VerifyResetTokenResponse` | RESPONSE | `{valid, expires_in}` | S2-E5 C3 |
| 7 | `BiometricUnenrollRequest` | REQUEST | `{device_id}` | S2-E5 C1 |

### Schemas Deprecated

| # | Schema | Motivo |
|---|--------|--------|
| 1 | `PaginationMeta` | Substituído por `Pagination` |
| 2 | `PaginationLinks` | Substituído por `Pagination` |

### Paths Atualizados

| # | Endpoint | Mudança | Origem |
|---|----------|---------|--------|
| 1 | `POST /api/v1/auth/login` | Token key `access_token` → `token` + envelope | S4-E1 Endpoint #1 |
| 2 | `POST /api/v1/auth/refresh` | Token key `access_token` → `token` + envelope | S4-E1 Endpoint #2 |
| 3 | `POST /api/mobile/v1/auth/login` | Token key `access_token` → `token` + envelope | S4-E1 Endpoint #3 |
| 4 | `POST /api/mobile/v1/auth/oauth` | Token key `access_token` → `token` + envelope | S4-E1 Endpoint #4 |
| 5 | `POST /api/mobile/v1/auth/refresh` | Token key `access_token` → `token` + envelope | S4-E1 Endpoint #5 |
| 6 | `/api/mobile/v1/auth/delete-account` | Método HTTP `POST` → `DELETE` | S4-E1 Endpoint #6 |
| 7 | `GET /api/mobile/v1/extrato` | Paginação `meta+links` → `pagination` + envelope | S4-E1 Endpoint #7 |
| 8 | `PATCH /api/v1/notificacoes/config` | Descrição atualizada re: flat booleans vs canal+ativo | S4-E1 Endpoint #8 |

### Paths Novos

| # | Endpoint | Método | Tags | Origem |
|---|----------|--------|------|--------|
| 1 | `/api/v1/auth/verify-reset-token` | POST | Auth | S2-E5 C3 |
| 2 | `/api/mobile/v1/auth/verify-reset-token` | POST | Auth Mobile | S2-E5 C3 |
| 3 | `/api/mobile/v1/auth/biometric/unenroll` | POST | Auth Mobile | S2-E5 C1 |

### Error Responses Atualizados

Todos os 4 responses padrão (`Unauthenticated`, `Forbidden`, `NotFound`, `ValidationError`) atualizados para incluir o envelope `{status: false, data: null, error: ApiErrorDetail, message: string}`.

## Referências Zod Adicionadas

| Schema Swagger | Schema Zod | Local |
|----------------|-----------|-------|
| EmpresaResponse | empresaSchema | empresa.schemas.ts |
| TransacaoResponse | transacaoSchema | cashback.schemas.ts |
| PlanoResponse | planoSchema | assinatura.schemas.ts |
| FaturaResponse | faturaSchema | assinatura.schemas.ts |
| AssinaturaResponse | assinaturaSchema | assinatura.schemas.ts |
| CampanhaResponse | campanhaSchema | campanha.schemas.ts |
| ClienteResponse | clienteSchema | cliente.schemas.ts |
| ContestacaoResponse | contestacaoSchema | contestacao.schemas.ts |
| UnidadeNegocioResponse | unidadeNegocioSchema | usuario.schemas.ts |
| UserResponse | usuarioSchema | auth.schemas.ts |
| AuditoriaResponse | logAuditoriaSchema | auditoria.schemas.ts |
| NotificacaoConfigResponse | notificacaoConfigSchema | notificacao.schemas.ts |
| Pagination | paginationMetaSchema | common.schemas.ts |
| CursorPaginationMeta | cursorPaginationMetaSchema | common.schemas.ts |
| ApiErrorDetail | apiErrorDetailSchema | common.schemas.ts |
| LaravelValidationError | laravelValidationErrorSchema | common.schemas.ts |
| RegisterRequest | registerRequestSchema | auth.schemas.ts |
| LoginRequest | loginRequestSchema | auth.schemas.ts |
| ForgotPasswordRequest | forgotPasswordRequestSchema | auth.schemas.ts |
| ResetPasswordRequest | resetPasswordRequestSchema | auth.schemas.ts |
| SwitchEmpresaRequest | switchEmpresaRequestSchema | auth.schemas.ts |
| GerarCashbackRequest | gerarCashbackRequestSchema | cashback.schemas.ts |
| UtilizarCashbackRequest | utilizarCashbackRequestSchema | cashback.schemas.ts |
| CriarClienteRequest | criarClienteRequestSchema | cliente.schemas.ts |
| AtualizarClienteRequest | atualizarClienteRequestSchema | cliente.schemas.ts |
| CriarCampanhaRequest | criarCampanhaRequestSchema | campanha.schemas.ts |
| AtualizarCampanhaRequest | atualizarCampanhaRequestSchema | campanha.schemas.ts |
| AtualizarConfigRequest | atualizarConfigRequestSchema | empresa.schemas.ts |
| AtualizarNotificacaoConfigRequest | notificacaoConfigBackendRequestSchema | notificacao.schemas.ts |
| CriarContestacaoRequest | criarContestacaoRequestSchema | contestacao.schemas.ts |
| ResolverContestacaoRequest | resolverContestacaoRequestSchema | contestacao.schemas.ts |
| UpgradeRequest | upgradeAssinaturaRequestSchema | assinatura.schemas.ts |
| CriarUsuarioRequest | criarUsuarioInternoRequestSchema | usuario.schemas.ts |
| AtualizarUsuarioRequest | atualizarUsuarioInternoRequestSchema | usuario.schemas.ts |
| TransacaoResponse.valor_compra | monetarioSchema | common.schemas.ts |
| TransacaoResponse.valor_cashback | monetarioSchema | common.schemas.ts |
| MobileExtratoResponse.valor_compra | monetarioSchema | common.schemas.ts |
| MobileExtratoResponse.valor_cashback | monetarioSchema | common.schemas.ts |

## Validação

| Critério | Status |
|----------|--------|
| YAML válido | ✅ |
| $ref resolvidos (57 schemas, 4 responses) | ✅ |
| Swagger ↔ Zod alinhados | ✅ |
| Postman master JSON válido | ✅ |
| Postman web JSON válido | ✅ |
| Postman admin JSON válido | ✅ |
| Postman mobile JSON válido | ✅ |
| Postman environment JSON válido | ✅ |

## Decisões Tomadas

1. **Aliases deprecated (~42 rotas)**: Não documentadas no Swagger para manter clareza. Devem ser adicionadas como `deprecated: true` em uma etapa futura se necessário.
2. **`estornado` em status_cashback**: Adicionado como forward-compatibility (presente no Zod, planejado para backend).
3. **`proprietario` em perfil**: Adicionado conforme backend. `financeiro` mantido apenas no Zod (forward-compat).
4. **`PaginationMeta` e `PaginationLinks`**: Mantidos como `deprecated: true` para backward-compat. Todos os paths agora usam `Pagination`.
5. **NotificacaoConfigResponse**: Corrigido para formato flat (email/sms/push booleans) conforme backend real.
6. **MobileChangePasswordRequest**: Adicionado campo `nova_senha_confirmation` conforme S3.

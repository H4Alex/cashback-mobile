# Mapa de Regras de Negocio — Aplicativo Mobile

> Gerado automaticamente a partir da analise do codigo-fonte.
> Rastreabilidade: cada regra referencia o arquivo de origem no backend.

---

## Sumario

1. [Autenticacao do Consumidor](#1-autenticacao-do-consumidor)
2. [Sessoes](#2-sessoes)
3. [Saldo e Extrato](#3-saldo-e-extrato)
4. [Utilizacao de Cashback](#4-utilizacao-de-cashback)
5. [Contestacoes do Consumidor](#5-contestacoes-do-consumidor)
6. [Notificacoes](#6-notificacoes)
7. [Dispositivos (Push Notifications)](#7-dispositivos-push-notifications)
8. [Modo Lojista (Merchant)](#8-modo-lojista-merchant)
9. [Seguranca e Infraestrutura](#9-seguranca-e-infraestrutura)

---

## 1. Autenticacao do Consumidor

Todos os endpoints de autenticacao do consumidor utilizam o guard **`api_mobile`** (JWT, model: `Cliente`).
O prefixo de rota e `/api/mobile/v1/auth`. Endpoints publicos aplicam `throttle:public` (10 req/min por IP).
Endpoints autenticados aplicam `throttle:auth` (60 req/min por usuario).

### 1.1. Registro

**Endpoint:** `POST /api/mobile/v1/auth/register` (publico)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-001 | CPF obrigatorio e validado | 11 digitos numericos, validacao de digitos verificadores (algoritmo padrao da Receita Federal). CPFs com todos digitos iguais sao rejeitados. | `app/Rules/CpfRule.php` |
| RN-MOB-002 | Nome obrigatorio | String, maximo 255 caracteres. | `app/Http/Requests/Mobile/MobileRegisterRequest.php` |
| RN-MOB-003 | Email obrigatorio e valido | Formato email valido, maximo 255 caracteres. | `app/Http/Requests/Mobile/MobileRegisterRequest.php` |
| RN-MOB-004 | Senha com requisitos de complexidade | Minimo 8 caracteres, deve conter pelo menos 1 letra maiuscula e 1 digito numerico. | `app/Http/Requests/Mobile/MobileRegisterRequest.php` |
| RN-MOB-005 | Telefone opcional | Nullable, string, maximo 20 caracteres. | `app/Http/Requests/Mobile/MobileRegisterRequest.php` |
| RN-MOB-006 | CPF ja cadastrado com senha retorna 409 | Se existe cliente com mesmo `cpf_hash` e senha definida, retorna `CLIENT_ALREADY_EXISTS` (409). | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-007 | CPF existente sem senha atualiza cadastro | Se o cliente foi previamente criado pelo lojista (sem senha), o registro atualiza nome, email, telefone e define a senha. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-008 | CPF armazenado com criptografia | O campo `cpf` utiliza `EncryptedCast` (criptografia AES-256-CBC). Para buscas, utiliza `cpf_hash` (HMAC-SHA256 com `APP_KEY`). | `app/Models/Cliente.php` |
| RN-MOB-009 | Hash de CPF gerado automaticamente | O `cpf_hash` e calculado automaticamente no evento `creating` do model, usando `hash_hmac('sha256', cpf_normalizado, APP_KEY)`. | `app/Models/Cliente.php` |
| RN-MOB-010 | Token JWT emitido no registro | Retorna token JWT, tipo bearer, com `expires_in` em segundos. A sessao e rastreada pelo `SessionTrackingService`. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-011 | Claim customizada no JWT | O JWT do cliente mobile inclui claim `tipo: 'mobile'` para diferenciar de tokens de usuarios web. | `app/Models/Cliente.php` |

### 1.2. Login

**Endpoint:** `POST /api/mobile/v1/auth/login` (publico)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-012 | Campos obrigatorios: email e senha | Email no formato valido, senha obrigatoria (string). | `app/Http/Requests/Mobile/MobileLoginRequest.php` |
| RN-MOB-013 | Verificacao em tempo constante | Utiliza `Hash::check()` com hash dummy quando o cliente nao existe, prevenindo ataques de timing e enumeracao de emails. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-014 | Cliente sem senha nao autentica | Clientes criados pelo lojista (sem senha) ou via OAuth (sem senha) nao podem fazer login por email/senha — retorna 401. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-015 | Sessao rastreada no login | A cada login bem-sucedido, um registro `ClientSession` e criado com `device_name`, `platform`, `ip_address` e `token_id` (JTI do JWT). | `app/Services/Auth/SessionTrackingService.php` |
| RN-MOB-016 | Plataforma detectada automaticamente | Detectada via header `X-Platform` (ios/android/web) ou `User-Agent`. Fallback: 'web'. | `app/Services/Auth/SessionTrackingService.php` |

### 1.3. Login OAuth (Google/Apple)

**Endpoint:** `POST /api/mobile/v1/auth/oauth` (publico)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-017 | Providers aceitos: google e apple | Campo `provider` obrigatorio, validado com `in:google,apple`. | `app/Http/Requests/Mobile/MobileOAuthRequest.php` |
| RN-MOB-018 | Token do provider obrigatorio | Campo `token` (ID token) e obrigatorio, string. | `app/Http/Requests/Mobile/MobileOAuthRequest.php` |
| RN-MOB-019 | Nome opcional | Campo `nome` e nullable, maximo 255 caracteres. Usado na criacao de novo cliente quando o provider nao retorna nome. | `app/Http/Requests/Mobile/MobileOAuthRequest.php` |
| RN-MOB-020 | Google: validacao via API tokeninfo | Token e validado chamando `https://oauth2.googleapis.com/tokeninfo`. Valida `aud` contra client IDs configurados (web, iOS, Android). Requer `email_verified=true`. Timeout: 5s. | `app/Services/Auth/OAuthService.php` |
| RN-MOB-021 | Apple: validacao completa do JWT | Decodifica o JWT, valida `iss=https://appleid.apple.com`, verifica `aud` contra client_id configurado, verifica `exp`, busca chave publica Apple e valida assinatura RSA (RS256/384/512). | `app/Services/Auth/OAuthService.php` |
| RN-MOB-022 | Email obrigatorio no payload OAuth | Se o provider nao retorna email, retorna erro `OAUTH_EMAIL_REQUIRED`. | `app/Services/Auth/OAuthService.php` |
| RN-MOB-023 | Conta deletada retorna 410 | Se o cliente com o email existe mas foi soft-deleted, retorna `ACCOUNT_DELETED` (410). | `app/Services/Auth/OAuthService.php` |
| RN-MOB-024 | Criacao automatica de cliente | Se nao existe cliente com o email, cria um novo com `nome`, `email`, `oauth_provider` e `oauth_provider_id`. Nao e necessario CPF ou senha. | `app/Services/Auth/OAuthService.php` |
| RN-MOB-025 | Vinculacao OAuth a conta existente | Se o cliente ja existe mas sem `oauth_provider`, atualiza com o provider e provider_id. Permite unificar contas. | `app/Services/Auth/OAuthService.php` |

### 1.4. Autenticacao Biometrica

**Endpoints:** `POST /api/mobile/v1/auth/biometric/enroll` (autenticado) | `POST /api/mobile/v1/auth/biometric/verify` (publico)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-026 | Enroll requer autenticacao | Endpoint de cadastro biometrico requer JWT valido (`auth:api_mobile`). | `routes/api.php` |
| RN-MOB-027 | Biometric token minimo 16 caracteres | Campo `biometric_token` obrigatorio, string, minimo 16 caracteres. | `app/Http/Controllers/Api/Mobile/V1/MobileBiometricController.php` |
| RN-MOB-028 | Device ID obrigatorio (max 255) | Campo `device_id` obrigatorio, string, maximo 255 caracteres. | `app/Http/Controllers/Api/Mobile/V1/MobileBiometricController.php` |
| RN-MOB-029 | Upsert por cliente + dispositivo | Se ja existe credencial para o par `(cliente_id, device_id)`, atualiza o hash do token. Senao, cria nova. | `app/Http/Controllers/Api/Mobile/V1/MobileBiometricController.php` |
| RN-MOB-030 | Token armazenado com Hash::make | O `biometric_token` e armazenado como hash bcrypt, nunca em texto plano. | `app/Http/Controllers/Api/Mobile/V1/MobileBiometricController.php` |
| RN-MOB-031 | Verify e publico (sem JWT) | Endpoint de verificacao biometrica nao requer autenticacao previa — e uma alternativa ao login com senha. | `routes/api.php` |
| RN-MOB-032 | Rate limit: 5 tentativas/min por device_id | Utiliza `RateLimiter` com chave `biometric_verify:{device_id}`, maximo 5 tentativas por minuto. Retorna 429 se excedido. | `app/Http/Controllers/Api/Mobile/V1/MobileBiometricController.php` |
| RN-MOB-033 | Rate limit resetado no sucesso | Apos verificacao biometrica bem-sucedida, o contador de rate limit e limpo com `RateLimiter::clear()`. | `app/Http/Controllers/Api/Mobile/V1/MobileBiometricController.php` |
| RN-MOB-034 | Cliente deletado nao autentica via biometria | Apos encontrar a credencial, verifica se o cliente existe e nao esta soft-deleted. Se deletado, retorna 401. | `app/Http/Controllers/Api/Mobile/V1/MobileBiometricController.php` |

### 1.5. Recuperacao de Senha

**Endpoints:** `POST /api/mobile/v1/auth/forgot-password` | `POST /api/mobile/v1/auth/reset-password` (publicos)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-035 | Forgot-password sempre retorna sucesso | Para prevenir enumeracao de emails, a resposta e sempre 200 independente de o email existir ou nao. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-036 | Rate limit de password reset: 5/min por IP | Middleware `throttle:password_reset` limita a 5 requisicoes por minuto por endereco IP. | `app/Providers/RateLimitingServiceProvider.php` |
| RN-MOB-037 | Maximo 5 tokens de reset por hora/email | Se existem 5 ou mais registros de reset para o email na ultima hora, nenhum novo token e gerado (protecao contra spam). | `app/Services/Auth/MobilePasswordResetService.php` |
| RN-MOB-038 | Token de reset: string aleatoria de 64 caracteres | Gerado via `Str::random(64)`, armazenado como hash bcrypt na tabela `password_resets`. | `app/Services/Auth/MobilePasswordResetService.php` |
| RN-MOB-039 | Validade do token: 15 minutos | Se `created_at + 15min` ja passou, retorna `TOKEN_EXPIRED` (410) e deleta o registro. | `app/Services/Auth/MobilePasswordResetService.php` |
| RN-MOB-040 | Nova senha segue mesmos requisitos | Minimo 8 caracteres, pelo menos 1 maiuscula e 1 digito. | `app/Http/Requests/Mobile/MobileResetPasswordRequest.php` |
| RN-MOB-041 | Reset revoga todas as sessoes | Apos a troca de senha, todas as `ClientSession` do cliente sao deletadas, forcando re-login em todos os dispositivos. | `app/Services/Auth/MobilePasswordResetService.php` |

### 1.6. Refresh Token

**Endpoint:** `POST /api/mobile/v1/auth/refresh` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-042 | Renovacao de JWT | Invalida o token atual e gera novo com mesmo TTL. Retorna `token`, `token_type: bearer` e `expires_in` em segundos. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-043 | Requer token JWT valido | O endpoint exige autenticacao — o token atual deve estar valido (nao expirado e nao blacklisted). | `routes/api.php` |

### 1.7. Logout

**Endpoint:** `POST /api/mobile/v1/auth/logout` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-044 | Invalida JWT e remove sessao | O token JWT e adicionado a blacklist. O registro `ClientSession` com o `token_id` (JTI) correspondente e deletado. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-045 | Erro na remocao de sessao nao bloqueia logout | Se a remocao da sessao falhar (non-critical), o logout prossegue normalmente. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |

### 1.8. Perfil do Consumidor

**Endpoints:** `GET /api/mobile/v1/auth/me` | `PATCH /api/mobile/v1/auth/profile` (autenticados)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-046 | Me retorna dados do cliente | Retorna `ClienteResource` com id, cpf (mascarado), nome, telefone, email, timestamps. | `app/Http/Resources/ClienteResource.php` |
| RN-MOB-047 | CPF mascarado na resposta | O CPF e exibido como `***.XXX.XXX-**` (3 primeiros e 2 ultimos digitos ocultos). | `app/Http/Resources/ClienteResource.php` |
| RN-MOB-048 | Atualizacao parcial do perfil | Aceita `nome`, `telefone` e `email` como campos opcionais (`sometimes`). | `app/Http/Requests/Mobile/MobileUpdateProfileRequest.php` |
| RN-MOB-049 | Email unico no update | Ao alterar email, verifica unicidade entre outros clientes. Retorna `EMAIL_ALREADY_EXISTS` (409) se duplicado. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |

### 1.9. Alteracao de Senha

**Endpoint:** `PATCH /api/mobile/v1/auth/password` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-050 | Senha atual obrigatoria | Campo `senha_atual` obrigatorio para confirmar identidade. | `app/Http/Requests/Mobile/MobileChangePasswordRequest.php` |
| RN-MOB-051 | Nova senha com requisitos de complexidade | Campo `nova_senha` obrigatorio, minimo 8 caracteres, pelo menos 1 maiuscula e 1 digito. | `app/Http/Requests/Mobile/MobileChangePasswordRequest.php` |
| RN-MOB-052 | Validacao da senha atual | Se a senha atual nao confere (ou cliente nao tem senha), retorna `INVALID_PASSWORD` (401). | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |

### 1.10. Exclusao de Conta (LGPD)

**Endpoint:** `POST /api/mobile/v1/auth/delete-account` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-053 | Senha obrigatoria para exclusao | Campo `senha` obrigatorio. Para clientes OAuth sem senha, a autenticacao JWT garante identidade. | `app/Http/Requests/Mobile/MobileDeleteAccountRequest.php` |
| RN-MOB-054 | Motivo da exclusao opcional | Campo `motivo` nullable, string, maximo 500 caracteres. Armazenado em `motivo_exclusao`. | `app/Http/Requests/Mobile/MobileDeleteAccountRequest.php` |
| RN-MOB-055 | Anonimizacao LGPD completa | `nome` → 'Cliente Removido'; `email` → `deleted_{id}@removed.local`; `cpf` → ID com zero-pad (11 digitos); `cpf_hash` → `deleted_` + SHA256 do id; `telefone` → null; `oauth_provider/id` → null. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-056 | Data de anonimizacao registrada | Campo `anonimizado_em` recebe `now()` para rastreabilidade. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-057 | Remocao de dados vinculados | Deleta todos os `DeviceToken`, `BiometricCredential` e `ClientSession` do cliente. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-058 | Email de confirmacao enviado | Envia `ClienteAnonimizadoNotification` para o email original antes da anonimizacao, com nome original e data/hora. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-059 | JWT invalidado e soft-delete | Apos anonimizacao, o JWT e invalidado via `logout()` e o registro do cliente recebe soft-delete (`deleted_at`). | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-060 | Cliente OAuth sem senha pode deletar | Clientes criados via OAuth (sem senha) podem excluir a conta sem informar senha, desde que tenham `oauth_provider` definido. | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |

---

## 2. Sessoes

**Prefixo:** `/api/mobile/v1/auth/sessions` (autenticado, guard `api_mobile`)

### 2.1. Listar Sessoes Ativas

**Endpoint:** `GET /api/mobile/v1/auth/sessions`

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-061 | Lista todas as sessoes do cliente | Retorna array de sessoes com `id`, `device_name`, `platform`, `ip_address`, `last_active_at` (ISO 8601) e `is_current`. | `app/Http/Controllers/Api/Mobile/V1/MobileSessionController.php` |
| RN-MOB-062 | Ordenacao por ultima atividade | Sessoes ordenadas por `last_active_at` descendente (mais recente primeiro). | `app/Http/Controllers/Api/Mobile/V1/MobileSessionController.php` |
| RN-MOB-063 | Sessao atual identificada | O campo `is_current` e `true` quando o `token_id` da sessao coincide com o JTI do JWT atual. | `app/Http/Controllers/Api/Mobile/V1/MobileSessionController.php` |

### 2.2. Revogar Sessao

**Endpoint:** `DELETE /api/mobile/v1/auth/sessions/{id}`

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-064 | Nao pode revogar sessao atual | Se o `token_id` da sessao alvo coincide com o JTI do token em uso, retorna `CANNOT_REVOKE_CURRENT` (400). | `app/Http/Controllers/Api/Mobile/V1/MobileSessionController.php` |
| RN-MOB-065 | Sessao deve pertencer ao cliente | Busca a sessao filtrando por `id` e `cliente_id` do autenticado. Retorna `SESSION_NOT_FOUND` (404) se nao encontrada. | `app/Http/Controllers/Api/Mobile/V1/MobileSessionController.php` |
| RN-MOB-066 | Sessao deletada fisicamente | O registro `ClientSession` e removido do banco (hard delete). | `app/Http/Controllers/Api/Mobile/V1/MobileSessionController.php` |

---

## 3. Saldo e Extrato

### 3.1. Consulta de Saldo

**Endpoint:** `GET /api/mobile/v1/saldo` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-067 | Saldo consolidado por empresa | Agrega transacoes com `status_cashback = 'confirmado'` e `data_expiracao > now()`, agrupadas por `empresa_id`. | `app/Http/Controllers/Api/Mobile/V1/MobileSaldoController.php` |
| RN-MOB-068 | Resposta: saldo_total + por_empresa | Retorna `saldo_total` (float), `por_empresa` (array com `empresa_id`, `nome_fantasia`, `logo_url`, `saldo`) e `proximo_a_expirar`. | `app/Http/Controllers/Api/Mobile/V1/MobileSaldoController.php` |
| RN-MOB-069 | Precisao monetaria com bcadd | Todos os valores de saldo utilizam `bcadd()` com 2 casas decimais para evitar erros de ponto flutuante. | `app/Http/Controllers/Api/Mobile/V1/MobileSaldoController.php` |
| RN-MOB-070 | Cashback proximo a expirar: 7 dias | O campo `proximo_a_expirar` mostra `valor` (soma) e `quantidade` de cashbacks confirmados que expiram nos proximos 7 dias. | `app/Http/Controllers/Api/Mobile/V1/MobileSaldoController.php` |
| RN-MOB-071 | Apenas cashbacks confirmados e nao expirados | Excluem-se transacoes com status pendente, utilizado, rejeitado, expirado ou congelado. Tambem exclui transacoes com `data_expiracao` ja passada. | `app/Http/Controllers/Api/Mobile/V1/MobileSaldoController.php` |
| RN-MOB-072 | Dados da empresa via eager loading | Carrega `empresa:id,nome_fantasia,logo_url` para evitar N+1 queries. | `app/Http/Controllers/Api/Mobile/V1/MobileSaldoController.php` |

### 3.2. Extrato de Transacoes (Cursor)

**Endpoint:** `GET /api/mobile/v1/extrato` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-073 | Paginacao baseada em cursor | Utiliza `cursorPaginate()` (nao offset) para performance e consistencia em listagens grandes. | `app/Http/Controllers/Api/Mobile/V1/MobileExtratoController.php` |
| RN-MOB-074 | Limite: default 10, min 1, max 100 | O parametro `limit` e validado: `min(100, max(1, limit))`. | `app/Http/Controllers/Api/Mobile/V1/MobileExtratoController.php` |
| RN-MOB-075 | Filtro por empresa_id | Opcional — filtra transacoes de uma empresa especifica. | `app/Http/Controllers/Api/Mobile/V1/MobileExtratoController.php` |
| RN-MOB-076 | Filtro por status_cashback | Opcional — filtra por status (pendente, confirmado, utilizado, rejeitado, expirado, congelado). | `app/Http/Controllers/Api/Mobile/V1/MobileExtratoController.php` |
| RN-MOB-077 | Filtro por periodo (data_inicio / data_fim) | `data_inicio` filtra `created_at >=`. `data_fim` filtra `created_at <= data_fim 23:59:59` (inclui o dia todo). | `app/Http/Controllers/Api/Mobile/V1/MobileExtratoController.php` |
| RN-MOB-078 | Ordenacao: created_at DESC, id DESC | Dupla ordenacao para garantir determinismo na paginacao por cursor. | `app/Http/Controllers/Api/Mobile/V1/MobileExtratoController.php` |
| RN-MOB-079 | Campo 'tipo' computado no Resource | `MobileExtratoResource` calcula o campo `tipo`: statuses pendente/confirmado/congelado → 'Recebido'; utilizado → 'Usado'; demais → valor literal do status. | `app/Http/Resources/MobileExtratoResource.php` |
| RN-MOB-080 | Dados da empresa via eager load | Carrega `empresa:id,nome_fantasia,logo_url` para eficiencia. | `app/Http/Controllers/Api/Mobile/V1/MobileExtratoController.php` |
| RN-MOB-081 | Campos retornados no Resource | `id`, `tipo`, `valor_compra` (float), `valor_cashback` (float), `status_cashback`, `data_expiracao` (Y-m-d), `created_at` (Y-m-d H:i:s), `empresa` (condicional), `campanha` (condicional). | `app/Http/Resources/MobileExtratoResource.php` |

---

## 4. Utilizacao de Cashback

### 4.1. Lojas Disponiveis

**Endpoint:** `GET /api/mobile/v1/utilizacao/lojas` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-082 | Lista empresas com cashback disponivel | Utiliza `SaldoService::getEmpresasComCashback()` para retornar apenas empresas onde o cliente possui cashback confirmado e nao expirado. | `app/Http/Controllers/Api/Mobile/V1/MobileUtilizacaoController.php` |
| RN-MOB-083 | Filtro somente pelo cliente autenticado | O `cliente_id` e extraido do JWT — nao aceita parametro externo. | `app/Http/Controllers/Api/Mobile/V1/MobileUtilizacaoController.php` |

### 4.2. Geracao de QR Code

**Endpoint:** `POST /api/mobile/v1/utilizacao/qrcode` (autenticado, `throttle:financial`)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-084 | empresa_id obrigatorio e existente | Validado com `exists:empresas,id`. | `app/Http/Requests/Mobile/MobileQrCodeRequest.php` |
| RN-MOB-085 | Valor obrigatorio e positivo | Campo `valor` obrigatorio, numerico, minimo R$ 0,01. | `app/Http/Requests/Mobile/MobileQrCodeRequest.php` |
| RN-MOB-086 | Token QR: 32 caracteres hexadecimais | Gerado com `bin2hex(random_bytes(16))`, resultando em 32 caracteres. | `app/Http/Controllers/Api/Mobile/V1/MobileUtilizacaoController.php` |
| RN-MOB-087 | QR Code armazenado no Redis com TTL 5 min | O token e persistido em `qr_token:{token}` com `setex` de 300 segundos. Dados: `qr_token`, `cliente_id`, `empresa_id`, `valor`, `expira_em`. | `app/Http/Controllers/Api/Mobile/V1/MobileUtilizacaoController.php` |
| RN-MOB-088 | Rate limit financeiro | Endpoint protegido com `throttle:financial` (15 req/min por usuario). | `routes/api.php`, `app/Providers/RateLimitingServiceProvider.php` |
| RN-MOB-089 | Resposta inclui dados completos do QR | Retorna `qr_token`, `cliente_id`, `empresa_id`, `valor` e `expira_em` (ISO 8601) para o app montar o QR code. | `app/Http/Controllers/Api/Mobile/V1/MobileUtilizacaoController.php` |

### 4.3. Validacao de QR Code (Lado Lojista)

**Endpoint:** `POST /api/v1/qrcode/validate` (autenticado, guard `api` — lojista)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-090 | Campo qr_token obrigatorio | String obrigatoria no body da requisicao. | `app/Http/Controllers/Api/Mobile/V1/MobileUtilizacaoController.php` |
| RN-MOB-091 | Token buscado no Redis | Se nao encontrado ou vazio, retorna `QR_TOKEN_INVALID` (404) — token expirado ou invalido. | `app/Http/Controllers/Api/Mobile/V1/MobileUtilizacaoController.php` |
| RN-MOB-092 | Valida existencia do cliente | Se o `cliente_id` do QR nao corresponde a um cliente existente, deleta o token do Redis e retorna `CLIENT_NOT_FOUND` (404). | `app/Http/Controllers/Api/Mobile/V1/MobileUtilizacaoController.php` |
| RN-MOB-093 | Calcula saldo do cliente na empresa | Busca saldo filtrando transacoes do cliente na empresa especifica, com status confirmado e nao expirado. | `app/Http/Controllers/Api/Mobile/V1/MobileUtilizacaoController.php` |
| RN-MOB-094 | Resposta para o lojista | Retorna `qr_token`, dados do cliente (`id`, `nome`, `cpf`), `valor` solicitado, `saldo_cliente` atualizado e `expira_em`. | `app/Http/Controllers/Api/Mobile/V1/MobileUtilizacaoController.php` |

---

## 5. Contestacoes do Consumidor

### 5.1. Listar Contestacoes

**Endpoint:** `GET /api/mobile/v1/contestacoes` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-095 | Listagem paginada | Parametro `limit` com default 10 e maximo 100. Utiliza paginacao via repositorio. | `app/Http/Controllers/Api/Mobile/V1/MobileContestacaoController.php` |
| RN-MOB-096 | Filtro por cliente autenticado | Utiliza `listarPorCliente(cliente_id)` — cliente so ve suas proprias contestacoes. | `app/Http/Controllers/Api/Mobile/V1/MobileContestacaoController.php` |
| RN-MOB-097 | Retorna ContestacaoResource | Inclui `id`, `empresa_id`, `transacao_id`, `cliente_id`, `tipo`, `descricao`, `status`, `resposta`, `respondido_por`, timestamps, e relacionamentos condicionais. | `app/Http/Resources/ContestacaoResource.php` |
| RN-MOB-098 | Alias de rota | Ambas `/disputes` e `/contestacoes` apontam para o mesmo controller. | `routes/api.php` |

### 5.2. Criar Contestacao

**Endpoint:** `POST /api/mobile/v1/contestacoes` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-099 | transacao_id obrigatorio e inteiro | Referencia a transacao sendo contestada. | `app/Http/Requests/Mobile/MobileContestacaoRequest.php` |
| RN-MOB-100 | Tipos de contestacao validos | Aceita: `cashback_nao_gerado`, `valor_incorreto`, `expiracao_indevida`, `venda_cancelada`. | `app/Http/Requests/Mobile/MobileContestacaoRequest.php` |
| RN-MOB-101 | Descricao: min 10, max 1000 caracteres | Obrigatoria, string, com limites de tamanho para garantir descricao significativa. | `app/Http/Requests/Mobile/MobileContestacaoRequest.php` |
| RN-MOB-102 | Transacao deve pertencer ao cliente | Verifica `transacao.cliente_id === auth_cliente_id`. Se nao pertence ou nao existe, retorna `TRANSACTION_NOT_FOUND` (404). | `app/Http/Controllers/Api/Mobile/V1/MobileContestacaoController.php` |
| RN-MOB-103 | Status inicial: pendente | A contestacao e criada com `status = ContestacaoStatus::PENDENTE`. | `app/Http/Controllers/Api/Mobile/V1/MobileContestacaoController.php` |
| RN-MOB-104 | Empresa vinculada automaticamente | O `empresa_id` e extraido da transacao referenciada, nao informado pelo cliente. | `app/Http/Controllers/Api/Mobile/V1/MobileContestacaoController.php` |
| RN-MOB-105 | Retorna 201 com transacao carregada | A resposta inclui a contestacao com o relacionamento `transacao` eager-loaded. | `app/Http/Controllers/Api/Mobile/V1/MobileContestacaoController.php` |

---

## 6. Notificacoes

### 6.1. Listar Notificacoes (Cursor)

**Endpoint:** `GET /api/mobile/v1/notifications` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-106 | Paginacao baseada em cursor | Utiliza `cursorPaginate()` para performance consistente. | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |
| RN-MOB-107 | Limite: default 20, min 1, max 50 | O parametro `limit` e validado: `min(50, max(1, limit))`. | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |
| RN-MOB-108 | Filtro: unread_only (boolean) | Se `unread_only=true`, filtra apenas notificacoes com `lida = false`. | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |
| RN-MOB-109 | Retorna total de nao lidas | O campo `meta.total_unread` sempre inclui a contagem total de notificacoes nao lidas do cliente. | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |
| RN-MOB-110 | Meta de paginacao | Retorna `next_cursor` (encoded), `has_more_pages` (boolean) no objeto `meta`. | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |
| RN-MOB-111 | Ordenacao: created_at DESC, id DESC | Dupla ordenacao para determinismo no cursor. | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |

### 6.2. Marcar como Lida

**Endpoint:** `PATCH /api/mobile/v1/notifications/{id}/read` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-112 | Notificacao deve pertencer ao cliente | Busca por `id` e `cliente_id`. Retorna `NOTIFICATION_NOT_FOUND` (404) se nao encontrada. | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |
| RN-MOB-113 | Atualiza lida e lida_em | Define `lida = true` e `lida_em = now()` com timestamp preciso. | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |

### 6.3. Marcar Todas como Lidas

**Endpoint:** `POST /api/mobile/v1/notifications/read-all` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-114 | Atualiza em massa | Atualiza todas as notificacoes do cliente onde `lida = false` com `lida = true` e `lida_em = now()`. | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |
| RN-MOB-115 | Retorna quantidade atualizada | O campo `updated` indica quantas notificacoes foram marcadas como lidas. | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |

### 6.4. Preferencias de Notificacao

**Endpoints:** `GET /api/mobile/v1/notifications/preferences` | `PATCH /api/mobile/v1/notifications/preferences` (autenticados)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-116 | Criacao automatica com defaults | Na primeira consulta, cria `ClienteNotificationPreference` com `push_enabled=true`, `email_enabled=true`, `marketing_enabled=false`. | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |
| RN-MOB-117 | Campos atualizaveis: 3 booleanos | `push_enabled`, `email_enabled`, `marketing_enabled` — todos opcionais (`sometimes`, `boolean`). | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |
| RN-MOB-118 | Marketing desabilitado por padrao | O opt-in para marketing e `false` por padrao (conformidade LGPD — consentimento explicito necessario). | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |

---

## 7. Dispositivos (Push Notifications)

### 7.1. Registrar Dispositivo

**Endpoint:** `POST /api/mobile/v1/devices` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-119 | Token obrigatorio, max 500 caracteres | Campo `token` (push notification token) obrigatorio, string, maximo 500 caracteres. | `app/Http/Requests/Mobile/MobileRegisterDeviceRequest.php` |
| RN-MOB-120 | Plataforma: ios ou android | Campo `plataforma` obrigatorio, validado com `in:ios,android`. | `app/Http/Requests/Mobile/MobileRegisterDeviceRequest.php` |
| RN-MOB-121 | Upsert por cliente + token | Se o par `(cliente_id, token)` ja existe, atualiza a plataforma. Senao, cria novo registro. | `app/Http/Controllers/Api/Mobile/V1/MobileDeviceController.php` |
| RN-MOB-122 | Resposta: 201 com DeviceToken | Retorna o objeto `DeviceToken` criado ou atualizado. | `app/Http/Controllers/Api/Mobile/V1/MobileDeviceController.php` |

### 7.2. Remover Dispositivo

**Endpoint:** `DELETE /api/mobile/v1/devices` (autenticado)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-123 | Token obrigatorio no body | Campo `token` obrigatorio para identificar o dispositivo. | `app/Http/Requests/Mobile/MobileDestroyDeviceRequest.php` |
| RN-MOB-124 | Remove por cliente + token | Deleta o `DeviceToken` filtrando por `cliente_id` e `token`. Nao retorna erro se nao encontrar. | `app/Http/Controllers/Api/Mobile/V1/MobileDeviceController.php` |

---

## 8. Modo Lojista (Merchant)

O modo lojista no app mobile utiliza o prefixo **`/api/v1`** com guard **`api`** (JWT, model: `Usuario`).
Requer middlewares: `auth:api`, `empresa.scope`, `check.assinatura`, `throttle:auth`, `throttle:tenant`, `etag`.

### 8.1. Switch Empresa

**Endpoint:** `POST /api/v1/auth/switch-empresa` (autenticado, guard `api`)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-125 | Selecao de empresa ativa | Permite ao usuario multi-empresa trocar a empresa ativa. Gera novo JWT com `empresa_id` selecionada. | `app/Http/Controllers/Api/V1/AuthController.php` |
| RN-MOB-126 | Lista de empresas disponiveis | `GET /api/v1/empresas` retorna todas as empresas vinculadas ao usuario com `id`, `nome_fantasia`, `cnpj`, `logo_url` e `perfil`. | `app/Http/Controllers/Api/V1/EmpresaController.php` |
| RN-MOB-127 | Acesso negado: 403 | Se o usuario nao tem vinculo com a empresa solicitada, retorna 403. | `app/Http/Controllers/Api/V1/AuthController.php` |
| RN-MOB-128 | Retorna novo token com dados | Resposta inclui `token`, `token_type`, `expires_in`, `empresa` (id, nome_fantasia) e `perfil`. | `app/Http/Controllers/Api/V1/AuthController.php` |

### 8.2. Dashboard do Lojista

**Endpoints sob** `GET /api/v1/dashboard/...` (permissoes: proprietario, gestor)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-129 | Stats gerais da empresa | `GET /dashboard/stats` retorna metricas consolidadas da empresa (via `DashboardService::getStats`). | `app/Http/Controllers/Api/V1/DashboardController.php` |
| RN-MOB-130 | Transacoes recentes | `GET /dashboard/transacoes` retorna as ultimas transacoes formatadas como `TransacaoResource`. | `app/Http/Controllers/Api/V1/DashboardController.php` |
| RN-MOB-131 | Top clientes | `GET /dashboard/top-clientes` retorna clientes com maior volume de cashback na empresa. | `app/Http/Controllers/Api/V1/DashboardController.php` |
| RN-MOB-132 | Grafico por periodo | `GET /dashboard/chart` aceita parametro `periodo` (default '30d') para dados de evolucao. | `app/Http/Controllers/Api/V1/DashboardController.php` |
| RN-MOB-133 | Restricao de perfil | Apenas usuarios com perfil `proprietario` ou `gestor` acessam o dashboard. | `routes/api.php` |

### 8.3. Gerar Cashback

**Endpoint:** `POST /api/v1/cashback` (permissoes: proprietario, gestor, operador, vendedor)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-134 | Idempotency-Key obrigatorio | Header `Idempotency-Key` ou campo `idempotency_key` obrigatorio (middleware `require.idempotency`). Maximo 64 caracteres. | `app/Http/Middleware/RequireIdempotencyKey.php` |
| RN-MOB-135 | Retorno idempotente | Se a `Idempotency-Key` ja existe, retorna a transacao original sem duplicar. Tambem trata `UniqueConstraintViolationException`. | `app/Services/Cashback/CashbackGenerationService.php` |
| RN-MOB-136 | CPF obrigatorio e validado | Validacao de 11 digitos e digitos verificadores (mesma regra do registro mobile). | `app/Http/Requests/Cashback/GerarCashbackRequest.php` |
| RN-MOB-137 | valor_compra obrigatorio, min R$ 0,01 | Numerico, valor minimo de 1 centavo. | `app/Http/Requests/Cashback/GerarCashbackRequest.php` |
| RN-MOB-138 | Campanha opcional e validada | `campanha_id` e nullable, deve existir na tabela `campanhas` para a mesma `empresa_id`. | `app/Http/Requests/Cashback/GerarCashbackRequest.php` |
| RN-MOB-139 | Verifica assinatura ativa | Se a empresa nao possui assinatura ativa (status ativa ou trial), retorna `SUBSCRIPTION_INACTIVE` (402). | `app/Services/Cashback/CashbackGenerationService.php` |
| RN-MOB-140 | Verifica limite de clientes do plano | Se o plano tem `max_clientes`, verifica com lock (`Cache::lock`) se o novo cliente nao excede o limite. Retorna `PLAN_LIMIT_CLIENTS` (403). | `app/Services/Cashback/CashbackGenerationService.php` |
| RN-MOB-141 | Cliente criado automaticamente pelo CPF | Se nao existe cliente com o CPF, cria um novo registro (sem nome/email/senha). | `app/Services/Cashback/CashbackGenerationService.php` |
| RN-MOB-142 | Percentual de campanha sobrescreve configuracao | Se `campanha_id` informado, usa `campanha.percentual` e `campanha.validade_padrao` ao inves de `empresa.percentual_cashback` e `empresa.validade_cashback`. | `app/Services/Cashback/CashbackGenerationService.php` |
| RN-MOB-143 | Status inicial: pendente / concluida | Transacao criada com `status_cashback = 'pendente'` e `status_venda = 'concluida'`. | `app/Services/Cashback/CashbackGenerationService.php` |
| RN-MOB-144 | Calculo monetario de alta precisao | Percentual intermediario com 4 casas decimais, valor final com 2 casas (usando `Money` e `Percentage` Value Objects). | `app/Services/Cashback/CashbackGenerationService.php` |
| RN-MOB-145 | Data de expiracao calculada | `data_expiracao = now() + validade_cashback` (em dias, da empresa ou campanha). | `app/Services/Cashback/CashbackGenerationService.php` |
| RN-MOB-146 | Evento CashbackGerado disparado | Apos commit, dispara `CashbackGerado` para notificacao push ao cliente. | `app/Services/Cashback/CashbackGenerationService.php` |
| RN-MOB-147 | Rate limit: 30 req/min por usuario | Middleware `throttle:cashback` limita a 30 requisicoes por minuto. | `app/Providers/RateLimitingServiceProvider.php` |

### 8.4. Utilizar Cashback

**Endpoint:** `POST /api/v1/cashback/utilizar` (permissoes: proprietario, gestor, operador, vendedor)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-148 | Idempotency-Key obrigatorio | Mesma regra de geracao: header ou campo, maximo 64 caracteres. | `app/Http/Middleware/RequireIdempotencyKey.php` |
| RN-MOB-149 | Algoritmo FEFO (First-Expire, First-Out) | Consome cashbacks na ordem de `data_expiracao` crescente — os mais proximos de expirar sao utilizados primeiro. | `app/Services/Cashback/CashbackUtilizationService.php` |
| RN-MOB-150 | Lock pessimista (lockForUpdate) | Utiliza `lockForUpdate()` durante a transacao para prevenir double-spend em requisicoes concorrentes. | `app/Services/Cashback/CashbackUtilizationService.php` |
| RN-MOB-151 | Limite de utilizacao: percentual_max_utilizacao | O valor maximo de cashback utilizavel e `saldo_total * (percentual_max_utilizacao / 100)` da empresa. | `app/Services/Cashback/CashbackUtilizationService.php` |
| RN-MOB-152 | Debito parcial com troco | Se o ultimo cashback consumido tem valor maior que o restante necessario, e criada uma transacao de "troco" (via `TransacaoFactory::createChange`) com o saldo remanescente. | `app/Services/Cashback/CashbackUtilizationService.php` |
| RN-MOB-153 | Novo cashback sobre valor em dinheiro | Se apos o debito ha `valor_dinheiro > 0`, gera novo cashback sobre esse valor usando `percentual_cashback` da empresa. | `app/Services/Cashback/CashbackUtilizationService.php` |
| RN-MOB-154 | Modo saldo global | Se `empresa.modo_saldo = 'global'`, busca cashbacks de todas as empresas vinculadas ao mesmo proprietario. | `app/Services/Cashback/CashbackUtilizationService.php` |
| RN-MOB-155 | Modo saldo individual | Se `empresa.modo_saldo = 'individual'`, busca apenas cashbacks da empresa especifica. | `app/Services/Cashback/CashbackUtilizationService.php` |
| RN-MOB-156 | Sem saldo: gera cashback sobre compra | Se o cliente nao tem saldo, a transacao e registrada como compra em dinheiro e cashback e gerado normalmente. | `app/Services/Cashback/CashbackUtilizationService.php` |
| RN-MOB-157 | Evento CashbackUtilizado disparado | Apos commit, dispara `CashbackUtilizado` para notificacao ao cliente. | `app/Services/Cashback/CashbackUtilizationService.php` |
| RN-MOB-158 | Invalidacao de cache | Apos utilizacao, `CashbackCacheService::invalidar(empresaId)` limpa caches do dashboard. | `app/Services/Cashback/CashbackUtilizationService.php` |

### 8.5. Gestao de Clientes

**Endpoints sob** `/api/v1/clientes` (permissoes variam por operacao)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-159 | Listar clientes: proprietario, gestor, operador | `GET /clientes` com filtro `search`, paginacao offset com `page`, `limit`, `sort_by`, `order`. | `app/Http/Controllers/Api/V1/ClienteController.php` |
| RN-MOB-160 | Detalhes do cliente | `GET /clientes/{id}` retorna `ClienteResource`, `saldo` e `ultimos_cashbacks`. | `app/Http/Controllers/Api/V1/ClienteController.php` |
| RN-MOB-161 | Criar cliente: proprietario, gestor | `POST /clientes` com validacao de CPF, verifica limite do plano. Retorna 403 (`PLAN_LIMIT_CLIENTS`) ou 422 (`CPF_ALREADY_EXISTS`). | `app/Http/Controllers/Api/V1/ClienteController.php` |
| RN-MOB-162 | Atualizar cliente: proprietario, gestor | `PATCH /clientes/{id}` com dados validados. | `app/Http/Controllers/Api/V1/ClienteController.php` |
| RN-MOB-163 | Consulta saldo do cliente | `GET /clientes/{id}/saldo` disponivel para proprietario, gestor, operador, vendedor. | `routes/api.php` |
| RN-MOB-164 | Consulta extrato do cliente | `GET /clientes/{id}/extrato` com filtros `status_cashback`, `data_inicio`, `data_fim` e paginacao offset. | `app/Http/Controllers/Api/V1/CashbackController.php` |

### 8.6. Gestao de Campanhas

**Endpoints sob** `/api/v1/campanhas`

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-165 | Listar campanhas: proprietario, gestor, operador | `GET /campanhas` com filtros `status`, `data_inicio`, `data_fim` e paginacao offset. | `app/Http/Controllers/Api/V1/CampanhaController.php` |
| RN-MOB-166 | Criar campanha: proprietario, gestor | `POST /campanhas` com dados validados. Retorna 403 se nao autorizado. | `app/Http/Controllers/Api/V1/CampanhaController.php` |
| RN-MOB-167 | Atualizar campanha: proprietario, gestor | `PATCH /campanhas/{id}` com dados validados. Retorna 404 se nao encontrada. | `app/Http/Controllers/Api/V1/CampanhaController.php` |
| RN-MOB-168 | Deletar campanha: proprietario, gestor | `DELETE /campanhas/{id}`. Retorna 404 se nao encontrada. | `app/Http/Controllers/Api/V1/CampanhaController.php` |

### 8.7. Contestacoes

**Endpoints sob** `/api/v1/contestacoes` (lojista)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-169 | Listar contestacoes: proprietario, gestor, operador | `GET /contestacoes` com filtros `status`, `tipo`, `data_inicio`, `data_fim` e paginacao offset. | `app/Http/Controllers/Api/V1/ContestacaoController.php` |
| RN-MOB-170 | Criar contestacao: proprietario, gestor, operador | `POST /contestacoes` — lojista tambem pode abrir contestacoes em nome do cliente. | `app/Http/Controllers/Api/V1/ContestacaoController.php` |
| RN-MOB-171 | Resolver contestacao: proprietario, gestor | `PATCH /contestacoes/{id}` — aceita aprovacao ou rejeicao. Se aprovada, acao automatica baseada no tipo. | `app/Http/Controllers/Api/V1/ContestacaoController.php` |
| RN-MOB-172 | Contestacao ja resolvida: 422 | Tentativa de resolver uma contestacao com status diferente de 'pendente' retorna `DISPUTE_ALREADY_RESOLVED`. | `app/Http/Controllers/Api/V1/ContestacaoController.php` |

### 8.8. Configuracoes da Empresa

**Endpoints sob** `/api/v1/config` (permissoes: proprietario, gestor)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-173 | Visualizar configuracoes | `GET /config` retorna parametros de cashback e dados da empresa. | `app/Http/Controllers/Api/V1/ConfigController.php` |
| RN-MOB-174 | Atualizar configuracoes | `PATCH /config` aceita dados validados para atualizar parametros (percentual, validade, etc.). | `app/Http/Controllers/Api/V1/ConfigController.php` |
| RN-MOB-175 | Upload de logotipo | `POST /config/logo` aceita upload de imagem para logo da empresa. | `app/Http/Controllers/Api/V1/ConfigController.php` |

### 8.9. Relatorios

**Endpoint:** `GET /api/v1/relatorios` (permissoes: proprietario, gestor)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-176 | Metricas por periodo e unidade | Aceita parametros `metrica`, `periodo`, `data_inicio`, `data_fim`, `unidade_negocio_id`. | `app/Http/Controllers/Api/V1/RelatorioController.php` |
| RN-MOB-177 | Rate limit: 10 req/min | Middleware `throttle:relatorio` limita a 10 requisicoes por minuto por usuario. | `app/Providers/RateLimitingServiceProvider.php` |

---

## 9. Seguranca e Infraestrutura

### 9.1. SSL Pinning

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-178 | Validacao de host em producao | Interceptor Axios valida que todas as requisicoes vao apenas para hosts permitidos: `api.h4cashback.com` e `u.expo.dev`. Ativo apenas em producao. | `src/lib/ssl-pinning.ts` |
| RN-MOB-179 | HTTPS obrigatorio em producao | Requisicoes HTTP (exceto localhost) sao bloqueadas em producao. | `src/lib/ssl-pinning.ts` |
| RN-MOB-180 | Validacao de startup | `validateApiHost()` executa ao iniciar o app, verificando se `API_BASE_URL` aponta para host permitido. Falha impede inicializacao. | `src/lib/ssl-pinning.ts` |
| RN-MOB-181 | Pinning nativo planejado | SSL pinning nativo (TrustKit no iOS, `network_security_config.xml` no Android) deve ser adicionado ao migrar para EAS custom builds. | `src/lib/ssl-pinning.ts` (comentario) |

### 9.2. Fila Offline (MMKV)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-182 | Maximo 50 itens na fila | Ao exceder o limite, o item mais antigo e descartado (`prev.slice(1)`). | `src/hooks/useOfflineQueue.ts` |
| RN-MOB-183 | TTL: 24 horas por item | Itens com mais de 24 horas sao descartados durante o flush, com evento `offline_queue_expired` registrado em analytics. | `src/hooks/useOfflineQueue.ts` |
| RN-MOB-184 | Maximo 3 tentativas por item | Apos 3 falhas consecutivas, o item e descartado com evento `offline_queue_item_dropped`. | `src/hooks/useOfflineQueue.ts` |
| RN-MOB-185 | Persistencia em MMKV | A fila e serializada em JSON e armazenada em MMKV (storage sincroneo nativo de alto desempenho). | `src/hooks/useOfflineQueue.ts`, `src/lib/mmkv.ts` |
| RN-MOB-186 | Flush automatico ao reconectar | Quando `isOnline` muda para `true` e a fila nao esta vazia, o flush e disparado automaticamente. | `src/hooks/useOfflineQueue.ts` |
| RN-MOB-187 | Metodos HTTP suportados | Suporta `post`, `put`, `patch` e `delete` via `apiClient`. | `src/hooks/useOfflineQueue.ts` |
| RN-MOB-188 | Cada item possui ID unico | Gerado com `Date.now() + random string` para rastreabilidade. | `src/hooks/useOfflineQueue.ts` |

### 9.3. Rate Limiting

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-189 | Endpoints publicos: 10 req/min por IP | Grupo `throttle:public` aplicado a register, login, OAuth, forgot-password. | `app/Providers/RateLimitingServiceProvider.php` |
| RN-MOB-190 | Endpoints autenticados: 60 req/min por usuario | Grupo `throttle:auth` aplicado a maioria dos endpoints protegidos. | `app/Providers/RateLimitingServiceProvider.php` |
| RN-MOB-191 | Operacoes financeiras: 15 req/min por usuario | Grupo `throttle:financial` para QR code do consumidor, cancelamentos e upgrades. | `app/Providers/RateLimitingServiceProvider.php` |
| RN-MOB-192 | Cashback (gerar/utilizar): 30 req/min | Grupo `throttle:cashback` para endpoints de gerar e utilizar cashback. | `app/Providers/RateLimitingServiceProvider.php` |
| RN-MOB-193 | Relatorios: 10 req/min | Grupo `throttle:relatorio` para endpoint de relatorios. | `app/Providers/RateLimitingServiceProvider.php` |
| RN-MOB-194 | Password reset: 5 req/min por IP | Grupo `throttle:password_reset` para forgot-password e reset-password. | `app/Providers/RateLimitingServiceProvider.php` |
| RN-MOB-195 | Biometria: 5 tentativas/min por device_id | Rate limit customizado no controller, nao via middleware. Reset no sucesso. | `app/Http/Controllers/Api/Mobile/V1/MobileBiometricController.php` |
| RN-MOB-196 | Rate limit por tenant (plano) | Grupo `throttle:tenant` ajusta o limite por minuto conforme `plano.rate_limit_rpm` da empresa. Cache de 5 min. Default: 500 rpm. | `app/Providers/RateLimitingServiceProvider.php` |
| RN-MOB-197 | Resposta padrao 429 para financeiro | Operacoes financeiras retornam JSON estruturado com `RATE_LIMIT_EXCEEDED` ao exceder o limite. | `app/Providers/RateLimitingServiceProvider.php` |

### 9.4. Paginacao Cursor vs Offset

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-198 | Cursor: extrato do consumidor | `GET /mobile/v1/extrato` usa `cursorPaginate()` para performance com volumes grandes e consistencia durante insercoes. | `app/Http/Controllers/Api/Mobile/V1/MobileExtratoController.php` |
| RN-MOB-199 | Cursor: notificacoes do consumidor | `GET /mobile/v1/notifications` usa `cursorPaginate()` pelo mesmo motivo. | `app/Http/Controllers/Api/Mobile/V1/MobileNotificationController.php` |
| RN-MOB-200 | Offset: endpoints do lojista | Endpoints de listagem do modo lojista (cashback, clientes, campanhas, contestacoes) usam paginacao offset com `page` e `limit`. | `app/Http/Controllers/Api/V1/CashbackController.php` |

### 9.5. Refresh Token Automatico (Client-side)

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-201 | Interceptor de 401 com refresh | O `apiClient` intercepta respostas 401, tenta refresh automatico do token e reenvia a requisicao original. | `src/services/apiClient.ts` |
| RN-MOB-202 | Fila de requisicoes durante refresh | Requisicoes que falham com 401 durante um refresh em andamento sao enfileiradas e reenviadas apos sucesso. | `src/services/apiClient.ts` |
| RN-MOB-203 | Logout automatico se refresh falhar | Se o refresh falhar, todos os tokens sao limpos do storage seguro e as requisicoes enfileiradas sao rejeitadas. | `src/services/apiClient.ts` |
| RN-MOB-204 | Timeout de 15 segundos | Todas as requisicoes via `apiClient` tem timeout de 15 segundos. | `src/services/apiClient.ts` |

### 9.6. Enums e Maquinas de Estado

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-205 | CashbackStatus: 6 estados | `pendente`, `confirmado`, `utilizado`, `rejeitado`, `expirado`, `congelado`. | `app/Enums/CashbackStatus.php` |
| RN-MOB-206 | Transicoes de CashbackStatus | `pendente` → confirmado, rejeitado. `confirmado` → utilizado, expirado, congelado, rejeitado. `congelado` → confirmado. `expirado` → confirmado. `utilizado` e `rejeitado` sao estados finais. | `app/Enums/CashbackStatus.php` |
| RN-MOB-207 | ContestacaoStatus: 3 estados | `pendente`, `aprovada`, `rejeitada`. Apenas `pendente` pode transicionar (para aprovada ou rejeitada). | `app/Enums/ContestacaoStatus.php` |
| RN-MOB-208 | VendaStatus: 2 estados | `concluida`, `cancelada`. | `app/Enums/VendaStatus.php` |

### 9.7. Seguranca de Dados

| # | Regra | Detalhe | Origem |
|---|-------|---------|--------|
| RN-MOB-209 | CPF criptografado em repouso | Campo `cpf` usa `EncryptedCast` (AES-256-CBC com `APP_KEY`). | `app/Models/Cliente.php` |
| RN-MOB-210 | Busca por CPF via HMAC-SHA256 | Campo `cpf_hash` (nao reversivel) usado para buscas sem descriptografar. | `app/Models/Cliente.php` |
| RN-MOB-211 | Senhas com bcrypt | Todas as senhas (cliente e biometria) armazenadas com `Hash::make()` (bcrypt, cost 12). | `app/Http/Controllers/Api/Mobile/V1/MobileAuthController.php` |
| RN-MOB-212 | Campos sensiveis ocultos | `senha`, `cpf_hash` e `oauth_provider_id` estao no array `$hidden` do model. | `app/Models/Cliente.php` |
| RN-MOB-213 | Token seguro no dispositivo | O app mobile armazena o JWT via `secureStorageService` (nao em MMKV ou AsyncStorage). | `src/services/apiClient.ts` |
| RN-MOB-214 | Soft-delete preserva historico | O model `Cliente` utiliza `SoftDeletes` — dados anonimizados permanecem para integridade referencial. | `app/Models/Cliente.php` |
| RN-MOB-215 | Auditoria via trait | O model `Cliente` utiliza a trait `Auditable` para rastreamento de alteracoes. | `app/Models/Cliente.php` |

---

> **Legenda de Status de Cashback:**
>
> | Status | Descricao |
> |--------|-----------|
> | `pendente` | Cashback gerado, aguardando confirmacao |
> | `confirmado` | Cashback disponivel para uso |
> | `utilizado` | Cashback consumido em uma transacao |
> | `rejeitado` | Cashback rejeitado (venda cancelada ou outro motivo) |
> | `expirado` | Cashback expirou (data_expiracao ultrapassada) |
> | `congelado` | Cashback temporariamente indisponivel (ex: contestacao em andamento) |

> **Legenda de Contestacao:**
>
> | Tipo | Descricao |
> |------|-----------|
> | `cashback_nao_gerado` | O cashback nao foi gerado para uma compra realizada |
> | `valor_incorreto` | O valor do cashback esta diferente do esperado |
> | `expiracao_indevida` | O cashback expirou antes do prazo informado |
> | `venda_cancelada` | A venda foi cancelada mas o cashback nao foi estornado |

---

> **Total de regras mapeadas: 215**
>
> Todas as regras foram extraidas diretamente do codigo-fonte do backend (`cashback-backend/`) e do aplicativo mobile (`cashback-mobile/src/`). Cada regra inclui referencia ao arquivo de origem para rastreabilidade e auditoria.

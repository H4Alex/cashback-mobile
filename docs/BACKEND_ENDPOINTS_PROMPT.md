# Implementar Endpoints Mobile Pendentes — cashback-backend (Laravel 11)

## Contexto do Projeto

Temos um app mobile (React Native + Expo) para o sistema Cashback que já está implementado
e consome endpoints da API Laravel. O backend usa:

- **Framework:** Laravel 11.31
- **Auth:** JWT com dois guards — `api` (lojista) e `api_mobile` (consumidor/Cliente)
- **API Base:** `https://api.h4cashback.com`
- **Prefixos:** Consumer → `/api/mobile/v1/...` | Merchant → `/api/v1/...`
- **97 endpoints existentes**, 15 models, 21 domain areas

O mobile já implementou TODOS os 8 sprints e está chamando endpoints que ainda não existem
no backend. Precisamos implementar **15 endpoints faltantes**, **3 ajustes em endpoints
existentes**, e configurar **CORS para o app mobile**.

---

## PARTE 1: ENDPOINTS CRÍTICOS (App Store blockers)

### 1.1 OAuth Real — Google + Apple Sign-In
**`POST /api/mobile/v1/auth/oauth`** (hoje retorna 501 stub)

Guard: `api_mobile`

```
Request:  { provider: "google" | "apple", id_token: string }
Response: { token: { access_token, refresh_token }, cliente: ClienteResource }
```

Implementação necessária:
- Validar `id_token` com Google (googleapis.com/tokeninfo) e Apple (appleid.apple.com/auth/keys)
- Se e-mail já existe na tabela `clientes` → fazer login
- Se e-mail novo → criar conta automaticamente (nome vem do token)
- Retornar JWT pair igual ao login normal
- **CRÍTICO:** Apple rejeita apps sem Apple Sign-In. Google Play também exige se Google Sign-In oferecido.

### 1.2 Excluir Conta (LGPD)
**`POST /api/mobile/v1/auth/delete-account`**

Guard: `api_mobile`

```
Request:  { senha: string, motivo?: string }
Response: { success: true }
```

Implementação:
- Verificar senha atual do cliente
- Soft delete ou anonimizar dados pessoais (LGPD compliance)
- Revogar todos tokens/sessions
- Enviar e-mail de confirmação
- **CRÍTICO:** Apple e Google Play exigem self-service de exclusão de conta.

---

## PARTE 2: ENDPOINTS AUTH (Sprint 1)

### 2.1 Forgot Password
**`POST /api/mobile/v1/auth/forgot-password`**

```
Request:  { email: string }
Response: { success: true }
```

- Gerar token de reset (via `Password::createToken()` ou similar)
- Enviar e-mail com link/código de reset
- Rate limit: max 3 requests/hora por e-mail

### 2.2 Reset Password
**`POST /api/mobile/v1/auth/reset-password`**

```
Request:  { email: string, token: string, nova_senha: string }
Response: { success: true }
```

- Validar token de reset
- Atualizar senha (hash bcrypt)
- Invalidar token após uso
- Revogar sessions existentes

### 2.3 Atualizar Perfil
**`PATCH /api/mobile/v1/auth/profile`**

Guard: `api_mobile`

```
Request:  { nome?: string, email?: string, telefone?: string }
Response: { cliente: ClienteResource }
```

- Validação: e-mail unique, telefone formato válido
- Se e-mail alterado → enviar verificação

### 2.4 Alterar Senha
**`PATCH /api/mobile/v1/auth/password`**

Guard: `api_mobile`

```
Request:  { senha_atual: string, nova_senha: string }
Response: { success: true }
```

- Verificar senha_atual
- Validar nova_senha (min 8 chars, etc.)
- Hash e salvar

---

## PARTE 3: BIOMETRIA (Sprint 2/6)

### 3.1 Enroll Biometric
**`POST /api/mobile/v1/auth/biometric/enroll`**

Guard: `api_mobile`

```
Request:  { biometric_token: string, device_id: string }
Response: { enrolled: true }
```

- Salvar biometric_token + device_id na tabela `biometric_credentials`
  (ou campo JSON na tabela `clientes`)
- Um cliente pode ter múltiplos devices enrolled
- Token deve ser hash (não armazenar em texto plano)

### 3.2 Verify Biometric
**`POST /api/mobile/v1/auth/biometric/verify`**

```
Request:  { biometric_token: string, device_id: string }
Response: { token: { access_token, refresh_token } }
```

- Sem guard (é um login alternativo)
- Verificar biometric_token + device_id
- Se válido → gerar JWT pair
- Se inválido → 401 (fallback para senha)
- Rate limit: max 5 tentativas/minuto por device_id

---

## PARTE 4: SESSIONS (Sprint 3)

### 4.1 Listar Sessions
**`GET /api/mobile/v1/auth/sessions`**

Guard: `api_mobile`

```
Response: {
  data: [{
    id: number,
    device_name: string,
    platform: "ios" | "android" | "web",
    ip_address: string,
    last_active_at: ISO8601,
    is_current: boolean
  }]
}
```

- Listar todas sessions ativas do cliente
- Marcar a session atual com `is_current: true`
- Requer: tabela `sessions` ou `personal_access_tokens` com metadata

### 4.2 Revogar Session
**`DELETE /api/mobile/v1/auth/sessions/{id}`**

Guard: `api_mobile`

```
Response: { revoked: true }
```

- Verificar que a session pertence ao cliente autenticado
- Não permitir revogar a session atual (usar logout)
- Invalidar token da session

---

## PARTE 5: QR CODE VALIDATION (Sprint 3/5)

### 5.1 Validar QR Code (merchant side)
**`POST /api/v1/qrcode/validate`**

Guard: `api` (lojista)

```
Request:  { qr_token: string }
Response: {
  cliente: { nome: string, cpf: string },
  valor: number | null,
  saldo_cliente: number,
  expira_em: ISO8601
}
```

- Buscar token no Redis (key: `qr:{token}`)
- Se expirado ou inexistente → 404
- Se válido → retornar dados do cliente + saldo na empresa do lojista
- Não consumir o token aqui (consumir apenas no cashback/utilizar)

---

## PARTE 6: NOTIFICAÇÕES IN-APP (Sprint 5)

**Requer:** Criar tabela `notifications` com migration:

```php
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('cliente_id')->constrained()->onDelete('cascade');
    $table->string('titulo');
    $table->text('mensagem');
    $table->string('tipo')->default('info'); // info, cashback, disputa, sistema
    $table->json('data')->nullable(); // metadata (deep link, etc.)
    $table->boolean('lida')->default(false);
    $table->timestamps();
    $table->index(['cliente_id', 'lida', 'created_at']);
});
```

### 6.1 Listar Notificações
**`GET /api/mobile/v1/notifications`**

Guard: `api_mobile`

```
Query:    ?cursor=xxx&limit=20&unread_only=true
Response: {
  data: [{ id, titulo, mensagem, tipo, data, lida, criado_em }],
  cursor: string | null,
  has_more: boolean,
  total_unread: number
}
```

### 6.2 Marcar como Lida
**`PATCH /api/mobile/v1/notifications/{id}/read`**

Guard: `api_mobile`

```
Response: { lida: true }
```

### 6.3 Marcar Todas como Lidas
**`POST /api/mobile/v1/notifications/read-all`**

Guard: `api_mobile`

```
Response: { updated: number }
```

### 6.4 Obter Preferências
**`GET /api/mobile/v1/notifications/preferences`**

Guard: `api_mobile`

```
Response: { push_enabled: true, email_enabled: true, marketing_enabled: false }
```

### 6.5 Atualizar Preferências
**`PATCH /api/mobile/v1/notifications/preferences`**

Guard: `api_mobile`

```
Request:  { push_enabled?: boolean, email_enabled?: boolean, marketing_enabled?: boolean }
Response: { atualizado: true }
```

- Salvar em campo JSON na tabela `clientes` ou tabela `notification_preferences`

---

## PARTE 7: AJUSTES EM ENDPOINTS EXISTENTES

### 7.1 GET /api/mobile/v1/saldo — Adicionar campo
Adicionar `proximo_a_expirar` ao response:

```json
{
  "saldo_total": 150.00,
  "por_empresa": [],
  "proximo_a_expirar": {
    "valor": 25.50,
    "quantidade": 3
  }
}
```

- Calcular cashbacks que expiram nos próximos 7 dias
- Se não houver → `{ valor: 0, quantidade: 0 }`

### 7.2 GET /api/mobile/v1/extrato — Fix N+1
- Adicionar eager loading: `->with('empresa')` na query
- Evita N+1 queries ao carregar transações com nome da empresa

### 7.3 POST /api/mobile/v1/utilizacao/qrcode — Redis TTL
- Persistir token no Redis com TTL 5 minutos: `Redis::setex("qr:{$token}", 300, json_encode($data))`
- Retornar `expira_em` em ISO 8601 no response
- Necessário para o endpoint `POST /api/v1/qrcode/validate` funcionar

---

## PARTE 8: CORS PARA APP MOBILE

Configurar CORS no Laravel (`config/cors.php` ou middleware):

```php
'allowed_origins' => [
    'https://api.h4cashback.com',
    'http://localhost:3000',       // dev
    'http://localhost:8081',       // Expo dev server
    'exp://localhost:8081',        // Expo Go
    // Para apps nativos (React Native), CORS geralmente não é necessário
    // pois requests vêm de código nativo, não de browser.
    // MAS se houver WebView ou fetch em dev, adicionar:
    '*' // apenas em desenvolvimento
],
'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
'allowed_headers' => ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'X-Idempotency-Key'],
'exposed_headers' => ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
'max_age' => 86400,
'supports_credentials' => true,
```

**Nota:** Apps React Native nativos geralmente NÃO precisam de CORS (requests são feitas
pelo runtime nativo, não pelo browser). CORS é necessário apenas se:
- O app usa WebView para algum fluxo
- Em desenvolvimento com Expo Web (`expo start --web`)
- O backend bloqueia requests sem Origin header

Verificar se o middleware CORS já existe e se está aplicado às rotas `/api/mobile/v1/*`.

---

## PARTE 9: INFRAESTRUTURA PUSH

Verificar/configurar:
- [ ] **FCM (Firebase Cloud Messaging):** Credenciais configuradas no Laravel (FIREBASE_CREDENTIALS ou FCM_SERVER_KEY)
- [ ] **APNs (Apple Push Notification service):** Certificado .p8 ou .p12 configurado
- [ ] **Service para enviar push:** Criar `PushNotificationService` que envia via FCM/APNs quando:
  - Cashback gerado para o cliente
  - Contestação respondida
  - Cashback prestes a expirar (cron job)
  - Indicação convertida (futuro)

---

## RESUMO DE PRIORIDADE

| Prioridade | Endpoints | Razão |
|------------|-----------|-------|
| CRÍTICO | OAuth real (1.1), Delete Account (1.2) | App Store rejeita sem eles |
| CRÍTICO | QR Validate (5.1) + Redis QR (7.3) | Fluxo QR inteiro não funciona |
| ALTO | Forgot/Reset Password (2.1, 2.2) | Auth flow incompleto |
| ALTO | Profile + Password (2.3, 2.4) | UX básica de conta |
| ALTO | Notificações (6.1-6.5) + tabela | Feature UX principal |
| MÉDIO | Biometria (3.1, 3.2) | Login rápido |
| MÉDIO | Sessions (4.1, 4.2) | Gestão de dispositivos |
| MÉDIO | Saldo ajuste (7.1), Extrato N+1 (7.2) | Performance/UX |
| INFRA | CORS (8), Push (9) | Infraestrutura |

**Total: 15 endpoints novos + 3 ajustes + CORS + Push infra**

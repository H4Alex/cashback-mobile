# MSW Report — S3-E3 (Mobile)

> **Projeto:** cashback-mobile (React Native / Expo)
> **Estrutura:** `src/testing/msw/{fixtures/, handlers/, server.ts}`
> **Test Runner:** Jest (jest-expo) com MSW v2 Node server

---

## Handlers por Domínio

| Domínio | Endpoints | Happy | Sad (422, 401, 404, 500) |
|---------|-----------|-------|--------------------------|
| **auth** | POST register, POST login, POST logout, POST refresh, GET me, POST oauth, POST forgot-password, POST reset-password, PATCH profile, PATCH password, POST verify-reset-token, DELETE delete-account, POST biometric/enroll, POST biometric/verify, POST biometric/unenroll, GET sessions, DELETE sessions/:id | 17 | ✅ (401, 422, 500) |
| **cashback** | GET /saldo, GET /extrato, GET /utilizacao/lojas, POST /utilizacao/qrcode | 4 | ✅ (401, 500) |
| **contestacao** | GET /contestacoes, POST /contestacoes | 2 | ✅ (401, 422, 500) |
| **notificacao** | GET /notifications, PATCH /notifications/:id/read, POST /notifications/read-all, GET /notifications/preferences, PATCH /notifications/preferences | 5 | ✅ (401, 404, 500) |
| **merchant** | GET /clientes, GET /clientes/:id/saldo, GET /campanhas, POST /cashback, POST /cashback/utilizar, GET /empresas, POST /auth/switch-empresa, GET /dashboard/stats, GET /dashboard/transacoes, GET /dashboard/top-clientes, GET /dashboard/chart, GET /clientes (paginated), GET /clientes/:id, POST /campanhas, PATCH /campanhas/:id, DELETE /campanhas/:id, GET /cashback, GET /contestacoes, PATCH /contestacoes/:id, GET /config, PATCH /config, POST /config/logo, GET /relatorios | 23 | ✅ (401, 404, 422, 500) |
| **TOTAL** | | **51** | **5 domínios** |

---

## Fixtures: 22 factories com schema.parse()

| Domínio | Factories | schema.parse() |
|---------|-----------|----------------|
| auth | createMockClienteResource, createMockLoginResponseData, createMockOauthResponseData | ✅ |
| cashback | createMockSaldoData, createMockExtratoEntry, createMockExtratoList, createMockQrCodeToken, createMockValidarQRCodeResponse | ✅ |
| contestacao | createMockContestacao, createMockContestacaoList | ✅ |
| notificacao | createMockNotification, createMockNotificationPreferences, createMockNotificationList | ✅ |
| merchant | createMockEmpresaMerchant, createMockCampanhaMerchant, createMockClienteSearchResult, createMockClienteSaldo, createMockGerarCashbackResponse, createMockUtilizarCashbackResponse, createMockSwitchEmpresaResponse, createMockMerchantDashboardStats, createMockEmpresaMerchantList | ✅ |

---

## Setup

| Componente | Status | Nota |
|------------|--------|------|
| server.ts | ✅ | `setupServer(...handlers)` via `msw/node` |
| browser.ts | N/A | React Native não usa Service Worker |
| onUnhandledRequest | ✅ `'error'` | Garante zero endpoints sem handler |
| jest.msw-setup.ts | ✅ | `beforeAll/afterEach/afterAll` lifecycle |
| jest.config.js | ✅ | `setupFilesAfterEnv`, MSW module mappers |
| Faker locale | ✅ `pt_BR` | Dados realistas em português |

---

## Mobile: MSW v2 (msw/node para Jest)

O MSW v2 funciona perfeitamente com Jest via `msw/node`. O servidor Node intercepta requisições HTTP no ambiente de teste sem necessidade de Service Worker. Configuração via `jest.msw-setup.ts` em `setupFilesAfterEnv`.

Module mappers adicionados ao `jest.config.js`:
- `^msw/node$` → `node_modules/msw/lib/node/index.js`
- `^msw$` → `node_modules/msw/lib/core/index.js`
- `^@faker-js/faker/locale/(.*)$` → `node_modules/@faker-js/faker/dist/locale/$1.js`

---

## Endpoints sem handler: ZERO

---

## Estrutura de Arquivos

```
src/testing/msw/
├── fixtures/
│   ├── auth.fixtures.ts          # 3 factories
│   ├── cashback.fixtures.ts      # 5 factories
│   ├── contestacao.fixtures.ts   # 2 factories
│   ├── notificacao.fixtures.ts   # 3 factories
│   ├── merchant.fixtures.ts      # 9 factories
│   └── index.ts                  # Barrel export
├── handlers/
│   ├── auth.handlers.ts          # 17 happy + sad paths
│   ├── cashback.handlers.ts      # 4 happy + sad paths
│   ├── contestacao.handlers.ts   # 2 happy + sad paths
│   ├── notificacao.handlers.ts   # 5 happy + sad paths
│   ├── merchant.handlers.ts      # 23 happy + sad paths
│   └── index.ts                  # Barrel export
├── server.ts                     # Node server (Jest)
└── index.ts                      # Barrel export
```

---

💾 Salvo: ./docs/generated/pipeline/S3-E3-msw-report.md

📋 PRÓXIMA ETAPA: Nova sessão → Etapa 4

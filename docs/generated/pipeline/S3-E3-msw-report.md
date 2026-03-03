# S3-E3 — MSW Handlers Report

**Repo:** `cashback-mobile`
**Data:** 2026-03-03
**Camada:** MSW Handlers (derivados dos contratos Zod)

---

## Handlers por Domínio

| Domínio | Endpoints | Happy | Sad |
|---|---|---|---|
| Mobile Auth | `/api/mobile/v1/auth/*` (register, login, logout, refresh, me, oauth, forgot-password, reset-password, profile, password, delete-account, biometric/enroll, biometric/verify) | 13 | 5 |
| Mobile Cashback | `/api/mobile/v1/*` (saldo, extrato, utilizacao/lojas) | 3 | 5 |
| Mobile Contestação | `/api/mobile/v1/contestacoes` (list, create) | 2 | 5 |
| Mobile QR Code | `/api/mobile/v1/utilizacao/qrcode` + `/api/v1/qrcode/validate` | 2 | 5 |
| Mobile Notificação | `/api/mobile/v1/notifications/*` (list, mark-read, read-all, preferences get, preferences patch) | 5 | 5 |
| Merchant (Lojista) | `/api/v1/*` (clientes, campanhas, cashback, empresas, switch-empresa, dashboard, contestacoes, config, relatorios) | 22 | 5 |
| **TOTAL** | | **47** | **30** |

## Fixtures

**23 factories** com `schema.parse()` em 5 arquivos de domínio:

| Arquivo | Factories |
|---|---|
| `auth.fixtures.ts` | `createMockClienteResource`, `createMockLoginResponseData`, `createMockOAuthResponseData`, `createMockTokenPair`, `createMockBiometricEnrollResponse` |
| `cashback.fixtures.ts` | `createMockSaldoData`, `createMockExtratoEntry`, `createMockExtratoList`, `createMockQRCodeToken`, `createMockValidarQRCodeResponse` |
| `contestacao.fixtures.ts` | `createMockContestacao`, `createMockContestacaoList` |
| `notificacao.fixtures.ts` | `createMockNotification`, `createMockNotificationList`, `createMockNotificationPreferences` |
| `merchant.fixtures.ts` | `createMockEmpresaMerchant`, `createMockCampanhaMerchant`, `createMockClienteSearchResult`, `createMockClienteSaldo`, `createMockGerarCashbackResponse`, `createMockUtilizarCashbackResponse`, `createMockSwitchEmpresaResponse`, `createMockMerchantDashboardStats` |

## Setup

| Item | Status |
|---|---|
| `server.ts` (setupServer, msw/node) | ✅ |
| `browser.ts` (N/A — React Native) | N/A |
| `onUnhandledRequest: 'error'` | ✅ |
| `jest.setup.msw.js` | ✅ Lifecycle hooks (beforeAll/afterEach/afterAll) |
| `jest.config.js` | ✅ `setupFilesAfterFramework` adicionado |

## Mobile

MSW v2 `setupServer` (Node) rodando via Jest — **sem fallback para `jest.mock`**.

## Dependências Adicionadas

| Pacote | Versão | Tipo |
|---|---|---|
| `@faker-js/faker` | `^10.3.0` | devDependency |
| `msw` | `^2.12.10` | devDependency |

## Estrutura de Arquivos

```
src/testing/msw/
├── server.ts
├── fixtures/
│   ├── index.ts
│   ├── auth.fixtures.ts
│   ├── cashback.fixtures.ts
│   ├── contestacao.fixtures.ts
│   ├── merchant.fixtures.ts
│   └── notificacao.fixtures.ts
└── handlers/
    ├── index.ts
    ├── merchant.handlers.ts
    ├── mobile-auth.handlers.ts
    ├── mobile-cashback.handlers.ts
    ├── mobile-contestacao.handlers.ts
    ├── mobile-notification.handlers.ts
    └── mobile-qrcode.handlers.ts
```

## Endpoints sem handler

**ZERO** — todos os endpoints da API (consumer + merchant) cobertos.

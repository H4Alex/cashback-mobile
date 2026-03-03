# S3-E4 — Test Runner Validation Report

**Repo:** `cashback-mobile`
**Data:** 2026-03-03
**Camada:** Setup e validacao do Jest (unit/integration) para React Native + Expo

---

## Unit / Integration Tests (Jest)

| Metrica | Valor |
|---|---|
| **Test Runner** | Jest 29.7.0 |
| **Preset** | jest-expo |
| **Suites** | 79 passando (79 total) |
| **Testes** | 482 passando (482 total) |
| **Duracao** | ~5.6s |
| **Setup** | `jest.setup.js` (MMKV, expo-notifications, expo-device mocks) |

### Correcoes Realizadas

| Problema | Correcao |
|---|---|
| `Toast.test.tsx` falhava com `_bezier is not a function` | Adicionado `jest.useFakeTimers()` e cleanup de timers pendentes no `afterEach` |
| `jest.config.js` warning: `Unknown option "setupFilesAfterFramework"` | Removido campo invalido; MSW lifecycle disponivel via import direto |

### Suites por Dominio

| Dominio | Qtd Suites | Testes |
|---|---|---|
| Components | 19 | ~80+ |
| Hooks | 14 | ~60+ |
| Services | 10 | ~80+ |
| Stores | 8 | ~50+ |
| Schemas | 11 | ~100+ |
| Navigation | 3 | ~20+ |
| A11y | 7 | ~40+ |
| i18n | 1 | ~10+ |
| Formatters | 1 | ~20+ |

### Jest Config (`jest.config.js`)

| Item | Status |
|---|---|
| `preset: 'jest-expo'` | OK |
| `maxWorkers: '50%'` | OK |
| `bail: 1` | OK |
| `transformIgnorePatterns` (RN modules) | OK |
| `moduleNameMapper: @/ alias` | OK |
| `setupFiles: ['jest.setup.js']` | OK |
| **Coverage thresholds** | lines: 50%, functions: 40%, branches: 10%, statements: 50% |

---

## E2E Tests

**N/A** — React Native mobile nao usa Playwright. E2E seria via Maestro/Detox (futuro — ver QT-05 no ROADMAP).

---

## Test Pipeline (`scripts/run-test-pipeline.sh`)

| Step | Status |
|---|---|
| Type checking | OK |
| Linting | OK |
| Unit tests | OK (79/79) |
| E2E discovery | N/A (mobile) |

---

## Dependencias de Teste

| Pacote | Tipo |
|---|---|
| `jest` | devDependency |
| `jest-expo` | devDependency |
| `@testing-library/react-native` | devDependency |
| `@faker-js/faker` | devDependency |
| `msw` | devDependency |

## Resultado

**TODOS OS TESTES PASSANDO** — 482 testes em 79 suites. Toast.test.tsx e jest.config.js corrigidos.

# Roadmap de Expansão de Cobertura — cash-mobile

## Baseline (data: 2026-03-13)
- Statements: 67.10% | Branches: 57.03% | Functions: 65.47% | Lines: 67.93%
- Testes existentes: 545 (92 suites)
- Módulos com 0% branches: 2 (i18n, theme) — `src/testing/**` excluído do collectCoverageFrom
- Thresholds calibrados: stmts 62, branches 52, functions 60, lines 62

## Prioridade ALTA (P1) — Impacto crítico

| # | Módulo | Cobertura | O que testar | Esforço |
|---|--------|-----------|--------------|---------|
| 1 | `src/lib` (api-client, ssl-pinning, sentry, analytics, mmkv) | 16.3% stmts / 3.7% br | Interceptors do api-client (retry, auth refresh, error handling), ssl-pinning config, analytics events, sentry breadcrumbs | G |
| 2 | `src/hooks` (useAuth, useCashback, useQRCode, useMerchant) | 57.4% stmts / 33.3% br | Branches de error handling, loading states, edge cases nos hooks de negócio (useAuth login/logout/refresh, useCashback geração/resgate, useQRCode validação) | G |
| 3 | `src/config` (env, queryClient) | 28.6% stmts / 57.9% br | Configuração do queryClient (retry, staleTime), validação de env vars | P |

## Prioridade MÉDIA (P2) — Lógica de negócio

| # | Módulo | Cobertura | O que testar | Esforço |
|---|--------|-----------|--------------|---------|
| 1 | `src/contracts` (apiCall, schemas) | 52.6% stmts / 50% br | Branches de validação de contratos, tratamento de respostas inválidas, fallback behavior | M |
| 2 | `src/schemas` | 92.5% stmts / 68.8% br | Branches de validação — schemas com optional fields, nested objects, edge cases de parsing | M |
| 3 | `src/services` (biometric, secureStorage) | 92.8% stmts / 75% br | secureStorageService (25% stmts, 0% funcs), biometric.service edge cases | P |
| 4 | `src/components` | 80.5% stmts / 77.8% br | Componentes com branches não cobertos — conditional renders, error states, empty states | M |

## Prioridade BAIXA (P3) — Infraestrutura e visuais

| # | Módulo | Cobertura | O que testar | Esforço |
|---|--------|-----------|--------------|---------|
| 1 | `src/theme` (ThemeProvider, tokens) | 0% stmts / 0% br | ThemeProvider toggle dark/light, tokens exportados corretamente | P |
| 2 | `src/i18n` | 0% stmts / 0% br | Validar que todas as chaves existem em todos os locales, fallback para pt-BR | P |
| 3 | `src/testing/msw` | 0% stmts / 0% br | Considerar excluir do collectCoverageFrom (infraestrutura de teste, não código de produção) | P |

## Critérios de Priorização
1. **Frequência de uso** — `lib/api-client` é usado por todos os serviços; hooks de negócio são usados por todas as telas
2. **Complexidade lógica** — `lib` e `hooks` têm lógica complexa com muitos branches (error handling, retry, estados)
3. **Histórico de bugs** — API client e auth são pontos críticos de falha em produção
4. **Cobertura atual** — `lib` com 3.7% branches é o maior gap; `hooks` com 33.3% branches é o segundo

## Ações imediatas recomendadas
1. **Excluir `src/testing/**` do collectCoverageFrom** — são fixtures/handlers de teste, inflam negativamente os números globais (13 arquivos com 0%)
2. **Testar `src/lib/api-client.ts`** — módulo mais crítico com menor cobertura, usado por toda a aplicação
3. **Expandir testes de hooks** — focar em branches de error handling (33.3% branch coverage)

## Meta (próximo trimestre)
- Statements: 67.10% → 80%
- Branches: 57.03% → 70%
- Functions: 65.47% → 78%
- Lines: 67.93% → 80%

## Legenda
- **P:** <1 dia, 1-5 testes | **M:** 1-3 dias, 5-15 testes | **G:** 3-5 dias, 15+ testes

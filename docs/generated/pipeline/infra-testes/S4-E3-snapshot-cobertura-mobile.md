# S4-E3 — Snapshot de Cobertura: cash-mobile (pós-review config)

## Data
2026-03-13

## Números Globais

| Métrica    | Valor  |
|------------|--------|
| Statements | 67.10% |
| Branches   | 57.03% |
| Functions  | 65.47% |
| Lines      | 67.93% |

## Jest Exit Code
0 (success)

## Testes
- Total: 545
- Passed: 545
- Failed: 0
- Skipped: 0
- Suites: 92

## Cobertura por Diretório

| Diretório            | Stmts   | Branch  | Funcs   | Lines   |
|----------------------|---------|---------|---------|---------|
| components           | 76.92%  | 75.96%  | 79.74%  | 79.41%  |
| components/ui        | 94.82%  | 84.37%  | 100%    | 96.36%  |
| config               | 28.57%  | 57.89%  | 0%      | 36.36%  |
| contracts            | 52.63%  | 50%     | 40%     | 52.63%  |
| contracts/schemas    | 100%    | 100%    | 100%    | 100%    |
| hooks                | 57.43%  | 33.33%  | 56.88%  | 57.02%  |
| i18n/locales         | 0%      | 0%      | 0%      | 0%      |
| lib                  | 16.34%  | 3.70%   | 8.33%   | 17%     |
| schemas              | 92.45%  | 68.75%  | 100%    | 100%    |
| services             | 92.76%  | 75%     | 86.36%  | 92.76%  |
| stores               | 100%    | 100%    | 100%    | 100%    |
| theme                | 0%      | 0%      | 0%      | 0%      |
| utils                | 100%    | 100%    | 100%    | 100%    |

## Módulos com 0% branches
- `i18n/locales` — arquivos de tradução (JSON-like), não testáveis diretamente
- `theme` — ThemeProvider + tokens, sem testes dedicados

## Módulos de excelência (100% cobertura)
- `stores` — todos os 6 stores com cobertura completa
- `utils` — formatadores com cobertura completa
- `contracts/schemas` — schemas de validação

## Notas
- Config revisado na E2 antes deste snapshot — números confiáveis
- Suite 92/92 suites, 545/545 testes passando, 0 skipped
- `src/testing/**` excluído do collectCoverageFrom (infraestrutura de teste, não código de produção)
- Toast.test.tsx corrigido: `clearAllTimers` + `useRealTimers` no teardown
- Worker leak warning do Jest persiste em runs paralelos (issue conhecido do Jest com animações RN) — não afeta resultados
- `lib` com 16.34% stmts e 3.70% branches é o módulo com maior gap de cobertura funcional
- Thresholds calibrados: branches 52, functions 60, lines 62, statements 62

# cashback-mobile

Aplicativo mobile do H4Cashback (React Native + Expo).

## Testes (Jest)

```bash
npm run test:run            # Executa uma vez
npm run test:coverage       # Com relatório de cobertura
npm run test:changed        # Apenas testes afetados por mudanças
npm run test:ci             # CI mode (coverage + passWithNoTests)
npm run test                # Modo watch
```

**Thresholds de cobertura** configurados em [`jest.config.js`](jest.config.js) — branches 48%, functions 47%, lines 55%, statements 54%.

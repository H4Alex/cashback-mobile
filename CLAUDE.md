# CLAUDE.md — cash-mobile (H4Cashback Mobile)

> Lido automaticamente pelo Claude Code em toda sessão neste repo.

## Projeto
- **Nome**: H4Cashback Mobile — app do cliente (SaaS cashback)
- **Stack**: React Native + Expo + TypeScript
- **Testes**: Jest (unitários/integração/schema/contract)

## Comandos Essenciais

```bash
# Dev
npx expo start                 # Metro bundler

# Validação local (rodar antes de push)
npm run test:pipeline          # tsc + eslint + jest + schema + contract

# Testes individuais
npm run test                   # Jest (watch mode)
npm run test:ci                # Jest + coverage (CI mode)
npm run test:coverage          # Jest + coverage report
npm run test:changed           # Jest (only changed files)

# Qualidade
npm run lint                   # ESLint
npx tsc --noEmit               # Type check

# Build
eas build                      # Build via EAS
```

## Convenções
- Testes em `src/**/__tests__/` ao lado do código
- Coverage provider: Jest default
- Watchman ativo para hot reload

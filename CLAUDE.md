# CLAUDE.md — cash-mobile

> Este arquivo é lido automaticamente pelo Claude Code em toda sessão.

## Stack
- React Native + Expo (Managed Workflow)
- Testes: `npx jest` (Jest, 81 suites, 501+ testes)
- Linting: `npx eslint .`
- Bundler: Metro (watchman disponível para file watching)
- Builds: `eas build` (EAS CLI disponível)
- Estilo: Tailwind (NativeWind)

## Ambiente Local
- Node 24 LTS + npm disponíveis
- Watchman instalado (melhora hot reload do Metro)
- EAS CLI disponível para builds/deploys
- Processar JSON: usar `jq` (disponível)

## Regras de Projeto
- Edição cirúrgica em arquivos existentes — NUNCA reescrever inteiro
- Arquivos protegidos: `.github/workflows/`
- Regras detalhadas: `./docs/generated/pipeline/REGRAS-UNIVERSAIS.md`

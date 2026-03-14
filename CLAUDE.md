# CLAUDE.md — Regras de Pipeline Infra Testes

> Este arquivo é lido automaticamente pelo Claude Code em toda sessão.

## Variáveis de Projeto
- SAAS_NAME: cash
- REPOS_PIPELINE: cash-back cash-front cash-admin cash-mobile
- BRANCH: pipeline/S1-S5-infra-testes

## Regras Estruturais
- ⚡ Execução autônoma: rodar todas as etapas sem pausas. Só parar se gate falhou 3x, pré-requisito ausente, ou fim do sistema
- ⚠️ CWD: sessão inicia no diretório PAI dos repos. Guard: `[ -d "./cash-back" ] || cd ..`
- Cada sistema em sessão separada — etapas sequenciais na mesma sessão
- Artefatos intermediários: `./docs/generated/pipeline/infra-testes/`
- Artefatos finais: `./docs/generated/latest/infra-testes/`
- 🛡️ Anti-truncamento: máx ~400 linhas por bloco
- Edição cirúrgica — NUNCA reescrever arquivos inteiros
- Multi-repo: branch em todos os repos, nunca `git push origin HEAD`
- `find` restrito ao workspace — nunca `/`
- Timeout em comandos longos
- Stderr separado: JSON/YAML/CSV → nunca `2>&1`
- Etapas 💻 alimentam `registro-impacto.json`

## Regras de Projeto
- 🚫 Arquivos protegidos: `.github/workflows/` (exceto T3.4/T3.5), `infra/`, `.env`
- Padrão de commit: `[tipo](escopo): descrição — ref: SN-EN`
- Branch: `pipeline/S1-S5-infra-testes`

## Referência Completa
- `./docs/generated/pipeline/REGRAS-UNIVERSAIS.md` (no cash-back)

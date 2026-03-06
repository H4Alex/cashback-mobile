# S17-E2 — Documentos Atualizados
Gerado em: 2026-03-06

## Resumo

Removidas todas as flags `[AGUARDANDO PRODUTO]` dos 6 APs, substituídas por `[IMPLEMENTADO]`.
Todos os 6 APs foram validados como completos em S17-E1.

## Documentos Alterados

### cash-back

| Documento | APs | Alteração |
|-----------|-----|-----------|
| `docs/generated/latest/validacao-final.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] com commits e constantes |
| `docs/generated/latest/changelog-consolidado.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S10-E1-relatorio-inferidos.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S10-E3-relatorio-final.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S11-E6-validacao-final-v4.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S11-E7-changelog-consolidado.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S12-E1-plano-implementacao.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S8-E1c-plano-execucao.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |

### cash-front

| Documento | APs | Alteração |
|-----------|-----|-----------|
| `docs/generated/latest/mapa-regras-web.md` | AP-1 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S10-E1-relatorio-inferidos.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S10-E3-relatorio-final.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S11-E2-mapa-regras-web.md` | AP-1 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S10-E1-mapa-regras-web.md` | AP-1 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |

### cash-admin

| Documento | APs | Alteração |
|-----------|-----|-----------|
| `docs/generated/latest/mapa-regras-admin.md` | AP-2 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S10-E1-relatorio-inferidos.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S10-E3-relatorio-final.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S11-E2-mapa-regras-admin.md` | AP-2 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S10-E1-mapa-regras-admin.md` | AP-2 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |

### cash-mobile

| Documento | APs | Alteração |
|-----------|-----|-----------|
| `docs/generated/pipeline/S10-E1-relatorio-inferidos.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |
| `docs/generated/pipeline/S10-E3-relatorio-final.md` | AP-1 a AP-6 | Removido [AGUARDANDO PRODUTO] → [IMPLEMENTADO] |

## Referência de Commits por AP

| AP | Descrição | Commit(s) | Constante |
|----|-----------|-----------|-----------|
| AP-1 | Botão reenviar código (Web) | `93a382b` (cash-front) | `COOLDOWN_REENVIO_SEGUNDOS` |
| AP-2 | Sort EmpresasPage (Admin) | `eb898cd` (cash-admin) + `720d0c5` (cash-back) | — |
| AP-3 | Campos cashback modal (Admin) | `27db538` (cash-admin) | — |
| AP-4 | Coluna empresas por plano (Admin) | `b2a8d7e` (cash-admin) + `59da973` (cash-back) | `total_assinaturas` |
| AP-5 | Campo telefone modal (Admin) | `81c6b0a` (cash-admin) | `MASCARA_TELEFONE_PLACEHOLDER` |
| AP-6 | Filtros avançados auditoria (Admin) | `cba86b9` (cash-admin) | `DEBOUNCE_MS` |

## Validação

- Flags `[AGUARDANDO PRODUTO]` restantes (excluindo referências contextuais): **0**
- Arquivos de código (.php, .tsx, .ts) alterados: **0**

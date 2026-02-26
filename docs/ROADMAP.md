# Roadmap — Cashback Mobile

> Sequência de etapas pós-sprints para avançar em Qualidade, Polish e Funcionalidades Futuras.
> Atualizado: 2026-02-26

---

## Estado Atual

Todos os 9 sprints (0–8) foram concluídos. O app tem:

- **120 testes** passando (19 suites)
- **26 componentes UI** reutilizáveis
- **17 custom hooks**
- **13 services** de API
- **6 stores** Zustand
- CI/CD completo (lint, type-check, tests, format, E2E)
- Fluxos consumer + merchant totalmente implementados

### Issues Fechados (sprints finalizados)

| Issue | Sprint | Status |
|-------|--------|--------|
| #13 | Sprint 0 — Fundação | Fechado |
| #14 | Sprint 1 — Autenticação | Fechado |
| #15 | Sprint 2 — Dashboard + Saldo | Fechado |
| #16 | Sprint 3 — Transações + Histórico | Fechado |
| #17 | Sprint 4 — Cashback + Resgate | Fechado |
| #18 | Sprint 5 — QR Code + Push | Fechado |
| #19 | Sprint 6 — Biometria + Config | Fechado |
| #20 | Sprint 7 — Gestão Lojista | Fechado |
| #21 | Sprint 8 — Polish + E2E + Publicação | Fechado |

---

## Fase 1: Qualidade & Testes

**Objetivo:** Elevar cobertura de testes e garantir estabilidade antes do lançamento.

**Ordem recomendada:**

```
QT-01 → QT-02 → QT-03 → QT-04 → QT-05 → QT-06
  │        │        │        │        │        │
  │        │        │        │        │        └─ Acessibilidade automatizada
  │        │        │        │        └─ E2E no CI (Maestro)
  │        │        │        └─ Testes de navegação + auth guards
  │        │        └─ Coverage thresholds + badge
  │        └─ Testes de 17 hooks
  └─ Testes de 23 componentes UI
```

| ID | Issue | Prioridade | Esforço |
|----|-------|------------|---------|
| QT-01 | Testes de Componentes UI (23 sem cobertura) | Alta | 3-4 dias |
| QT-02 | Testes de Custom Hooks (17 sem cobertura) | Alta | 3-4 dias |
| QT-03 | Coverage Thresholds + Badge no README | Média | 0.5 dia |
| QT-04 | Testes de Navegação e Auth Guards | Média | 2 dias |
| QT-05 | E2E no CI para PRs críticos | Média | 1-2 dias |
| QT-06 | Testes de Acessibilidade automatizados | Média | 2 dias |

**Metas:**
- Cobertura componentes: ≥ 50%
- Cobertura hooks: ≥ 70%
- Cobertura global: ≥ 70% statements
- E2E: 3 fluxos passando no CI
- a11y: WCAG AA em telas críticas

---

## Fase 2: Polish

**Objetivo:** Refinar a UX para nível de produção.

**Ordem recomendada:**

```
PL-05 → PL-04 → PL-01 → PL-02 → PL-03 → PL-06 → PL-07
  │        │        │        │        │        │        │
  │        │        │        │        │        │        └─ Error boundaries
  │        │        │        │        │        └─ Assets finais (ícone, splash)
  │        │        │        │        └─ Haptic feedback
  │        │        │        └─ Animações (Reanimated)
  │        │        └─ Gráficos reais (Victory Native)
  │        └─ Máscaras de input (CPF, moeda)
  └─ Persistir tema (MMKV)
```

| ID | Issue | Prioridade | Esforço |
|----|-------|------------|---------|
| PL-01 | Gráficos reais no Dashboard | Alta | 2-3 dias |
| PL-02 | Animações com Reanimated | Média | 2-3 dias |
| PL-03 | Haptic Feedback | Média | 1 dia |
| PL-04 | Máscaras de Input (CPF, moeda) | Alta | 1-2 dias |
| PL-05 | Persistir Tema (Dark Mode via MMKV) | Alta | 0.5 dia |
| PL-06 | Assets Finais (App Icon, Splash) | Alta | 1-2 dias |
| PL-07 | Error Boundaries + Error States | Alta | 1-2 dias |

**Quick Wins (< 1 dia):**
- PL-05: Persistir tema — apenas 10 linhas de código
- PL-03: Haptic — instalar + hook + 10 pontos de aplicação

---

## Fase 3: Funcionalidades Futuras

**Objetivo:** Expandir o produto com features de crescimento e engajamento.

**Ordem recomendada (por valor de negócio):**

```
FT-02 → FT-01 → FT-03 → FT-04 → FT-08 → FT-06 → FT-07 → FT-05
  │        │        │        │        │        │        │        │
  │        │        │        │        │        │        │        └─ Carteiras digitais
  │        │        │        │        │        │        └─ Gamificação
  │        │        │        │        │        └─ Chat suporte
  │        │        │        │        └─ Cashback por categoria + mapa
  │        │        │        └─ Programa de indicação
  │        │        └─ Deep linking
  │        └─ Analytics
  └─ Sentry production
```

| ID | Issue | Prioridade | Esforço | Backend? |
|----|-------|------------|---------|----------|
| FT-01 | Analytics (screen views + eventos) | Alta | 2-3 dias | Não |
| FT-02 | Sentry Production (error + perf) | Alta | 1-2 dias | Não |
| FT-03 | Deep Linking (universal/app links) | Alta | 2-3 dias | Sim |
| FT-04 | Programa de Indicação (Referral) | Média | 5-7 dias | Sim |
| FT-05 | Carteiras Digitais (Wallet) | Baixa | 5-7 dias | Sim |
| FT-06 | Chat de Suporte in-app | Média | 7-10 dias | Sim |
| FT-07 | Gamificação (níveis, badges) | Baixa | 7-10 dias | Sim |
| FT-08 | Cashback por Categoria + Mapa | Média | 5-7 dias | Sim |

**Sem dependência de backend (pode começar já):**
- FT-02: Sentry Production
- FT-01: Analytics

---

## Visão de Timeline

```
Semana 1-2  │ QUALIDADE: QT-01 (componentes) + QT-02 (hooks)
Semana 2    │ QUALIDADE: QT-03 (coverage) + QT-04 (navegação)
Semana 3    │ QUALIDADE: QT-05 (E2E CI) + QT-06 (a11y)
            │ POLISH: PL-05 (tema) + PL-04 (inputs)
Semana 3-4  │ POLISH: PL-01 (gráficos) + PL-07 (error boundaries)
Semana 4    │ POLISH: PL-02 (animações) + PL-03 (haptic)
Semana 4-5  │ POLISH: PL-06 (assets) + FUTURO: FT-02 (Sentry)
Semana 5+   │ FUTURO: FT-01 (analytics) → FT-03 (deep links) → ...
```

---

## Como Usar

### Criar issues no GitHub
```bash
# Requer: gh CLI autenticado
./scripts/manage-github-issues.sh
```

### Filtrar por fase
- **Qualidade:** label `phase:quality`
- **Polish:** label `phase:polish`
- **Futuro:** label `phase:future`

### Board de projeto (sugestão)
Criar um GitHub Project Board com colunas:
- Backlog → In Progress → Review → Done

---

## Labels Criados

| Label | Cor | Descrição |
|-------|-----|-----------|
| `quality` | Verde | Qualidade e Testes |
| `polish` | Amarelo | Polish e UX refinement |
| `future` | Roxo | Funcionalidade futura |
| `phase:quality` | Verde | Fase — Qualidade & Testes |
| `phase:polish` | Amarelo | Fase — Polish |
| `phase:future` | Roxo | Fase — Funcionalidades Futuras |

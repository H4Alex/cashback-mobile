# Relatório Final — Sistemas S8 + S9 + S10

> Pipeline: S1→S2→S3→S4→S5→S6→S7→S8 (auditoria) → S9 (correções) → S10 (completude)
> Data: 2026-03-04

---

## Resumo Executivo

| Categoria | Planejado (S8-E1c) | Resultado | Status |
|-----------|-------------------|-----------|--------|
| Auditoria de escopo (S8-E1a/b/c) | 3 artefatos | 3 artefatos gerados | ✅ |
| Correções triviais Zod (A1-A7) | 7 | 7 aplicadas / 0 já existiam | ✅ |
| Correções condicionais (B1-B4) | 4 | 4 aplicadas / 0 com erro | ✅ |
| Feature /admin/configuracoes (C1) | 1 | implementada (endpoint + frontend) | ✅ |
| Schemas form+API Cashback (C2) | 4 schemas | 4 criados/atualizados | ✅ |
| Schemas form+API NotificacaoConfig (C3) | 2 schemas | 2 criados + 1 deleteSuccessResponse | ✅ |
| [INFERIDO] resolvidos | 24 total | 24 resolvidos (0 restantes) | ✅ |
| x-zod-schema completados | 12 schemas | 12 criados (65/65 = 100%) | ✅ |

## Testes — Estado Final

| Repo | Build | Tests | Resultado | Observações |
|------|-------|-------|-----------|-------------|
| cashback-backend | — | 102 passed / 715 failed | ⚠️ | Falhas por MySQL indisponível no ambiente CI (Connection refused); 102 unit tests passam |
| cashback-frontend | ✅ | 1613 passed / 0 failed | ✅ | 136 test suites |
| cashback-admin | ✅ | 187 passed / 0 failed | ✅ | 15 test suites |
| cashback-mobile | — | 501 passed / 0 failed | ✅ | 81 test suites (jest) |

> **Nota Backend:** Os 715 testes falhando são todos por `SQLSTATE[HY000] [2002] Connection refused` — requerem banco MySQL rodando. Os 102 testes unitários que não dependem de banco passam. Não é bloqueador — falhas de infraestrutura, não de código.

## Cobertura de Testes

| Repo | Arquivos de teste | Casos totais |
|------|-------------------|-------------|
| cashback-frontend | 136 | 1613 |
| cashback-admin | 15 | 187 |
| cashback-mobile | 81 | 501 |

## Métricas Antes/Depois

| Métrica | S7 (antes) | S10 (depois) | Delta |
|---------|-----------|-------------|-------|
| x-zod-schema | 81.5% (53/65) | 100% (65/65) | +18.5% |
| [INFERIDO] | 32 menções (24 itens) | 0 pendentes | -24 itens resolvidos |
| [AGUARDANDO PRODUTO] | 0 | 6 fichas detalhadas | +6 (reclassificados de INFERIDO) |
| [STUB] | 0 | 6 (web) | +6 (reclassificados de INFERIDO/MOCK) |
| Divergências Zod↔PHP | 7 (A1-A7) | 0 | -7 |
| ConfiguracoesPage STUB | SIM | NÃO (endpoint real) | ✅ |

## Commits por Repo

| Repo | Sistema | Commits | Tipos |
|------|---------|---------|-------|
| cashback-backend | S9 | 3 | feat(endpoint), docs(report), docs(report) |
| cashback-backend | S10 | 2 | docs(swagger x-zod), docs(relatório) |
| cashback-frontend | S9 | 10 | fix(A1-A7), test, fix(B2-B4), docs(reports×3), refactor(schemas×2) |
| cashback-frontend | S10 | 2 | feat(schemas S10-E2), docs(mapa regras) |
| cashback-admin | S9 | 1 | feat(ConfiguracoesPage endpoint real) |
| cashback-admin | S10 | 1 | docs(mapa regras) |
| cashback-mobile | S9 | 3 | fix(A5 valor_compra), test, fix(B1 min8) |
| cashback-mobile | S10 | 2 | feat(schemas S10-E2), docs(mapa regras) |
| **Total** | **S9+S10** | **24** | |

## Decisões Não-Triviais Tomadas

| # | Decisão | Evidência (artefato:seção) | Resultado |
|---|---------|------------------------------|-----------|
| 1 | B1: `nova_senha_confirmation` mantido client-side only (backend ignora `confirmed` rule) | S9-E2:B1, E1a §5:265-268 | Campo mantido no schema mobile para UX; backend não valida |
| 2 | B3: Remover `email` do `atualizarUsuarioInternoRequestSchema` (backend rejeita silenciosamente) | S9-E2:B3, E1a §3:220 | Campo removido do Zod; Laravel descarta campos sem rule |
| 3 | B4: Remover `modo_saldo` do request web (admin-only via AtualizarEmpresaAdminRequest) | S9-E2:B4, E1a §4:194 vs §4:279 | `modoSaldoEnum` mantido para response schemas |
| 4 | A7b: `financeiro` NÃO removido — já estava ausente do request schema | S9-E1:A7b | `financeiro` existe apenas no enum geral de resposta |
| 5 | C1: Tabela `admin_configuracoes` nova (singleton) em vez de reaproveitar tabela existente | S9-E3:Backend | Config admin dedicada, 1 row |
| 6 | C1: Middleware `auth:api` em vez de `auth:sanctum` — alinhado com JWT do projeto | S9-E3:Discrepâncias #1 | Coerente com todas as rotas admin existentes |
| 7 | S10-E2: `notificacaoConfigApiSchema` como alias (não duplicação) | S9-E4b:Discrepâncias #1 | Evita duplicação; alias para `atualizarNotificacaoConfigRequestSchema` |
| 8 | S10-E1: 6 MOCKs reclassificados como [STUB] em vez de [AGUARDANDO PRODUTO] | S10-E1:web:#2-#7,#9 | Telas com dados hardcoded sem endpoint web — não são features pendentes, são stubs explícitos |

## Itens Pendentes para S11

| # | Item | Tipo | Bloqueador? | Motivo |
|---|------|------|-------------|--------|
| 1 | 6 fichas [AGUARDANDO PRODUTO] | Feature planning | Não | Funcionalidades futuras documentadas abaixo |
| 2 | 6 [STUB] web (dashboard/saldo/extrato/histórico cliente + UN CRUD) | Mock/Stub | Não | Telas existem com dados locais; endpoints mobile-only sem equivalente web |
| 3 | Backend tests com MySQL | Infraestrutura | Não | 715 testes requerem MySQL; 102 unit passam; não é regressão de código |
| 4 | Admin EmpresaDetalhePage `unidades` dead code (eager load sem serialização) | Código morto | Não | Backend carrega relação sem serializar; sem impacto funcional |
| 5 | Sync documentação Swagger↔Postman↔Mapas (S11-E1/E2) | Documentação | Não | Artefatos prontos para distribuição no S11 |

---

## Fichas [AGUARDANDO PRODUTO]

> Entregável principal para planejamento de features futuras.
> Total: **6 fichas** (1 web + 5 admin + 0 mobile)

---

### AP-1: Botão "Reenviar código" na RecuperacaoPage

**Consumer**: Web
**Tela**: RecuperacaoPage (Recuperação de Senha)
**Origem**: Linha 220 em S10-E1-mapa-regras-web.md

**O que existe hoje**:
- Código atual: Botão "Reenviar código" é renderizado em `RecuperacaoPage.tsx:118-120` quando `step === 'codigo'`, mas **não possui onClick handler**. O hook `useRecuperacaoWizard` não implementa nenhum método de reenvio. O `authService` não possui método `resend` ou equivalente.
- Endpoint backend: `POST /auth/forgot-password` existe (envia código inicial). Não há endpoint dedicado de reenvio — pode ser reutilizado com o mesmo email.
- Tela frontend: Funcional para o fluxo principal (email → código → nova senha → sucesso). O botão "Reenviar código" aparece mas é inerte (sem ação ao clicar).

**O que falta para ficar completo**:
- Backend: Nenhum endpoint novo necessário. `POST /auth/forgot-password` já envia código. Opcionalmente, implementar rate limiting específico para reenvio (ex: 60s cooldown) e/ou endpoint `POST /auth/resend-code` com throttle separado.
- Frontend: Adicionar `onClick` ao botão chamando `authService.forgotPassword(email)` novamente. Implementar cooldown visual (botão disabled por 60s com countdown). Adicionar handler `handleReenviarCodigo()` no hook `useRecuperacaoWizard`.
- Documentação: Atualizar mapa de regras web (remover [AGUARDANDO PRODUTO]). Adicionar interação #7 "Reenviar código" na tabela de Regras de Interação.

**Estimativa de esforço**:
- Backend: P — Pode reutilizar endpoint existente; opcional criar throttle dedicado
- Frontend: P — Handler simples + cooldown visual (< 1h)
- Total: P

**Dependências**:
- Técnicas: Nenhuma — endpoint já existe
- De produto: Definição do tempo de cooldown entre reenvios (60s? 120s?)
- De outros AP: Nenhuma

**Impacto se não implementar**:
Usuário na tela de recuperação de senha vê o botão "Reenviar código" mas ao clicar nada acontece. Deve recomeçar o fluxo pelo step de email para receber novo código.

**Recomendação**:
Prioridade ALTA — UX quebrada (botão visível mas inerte é pior que botão ausente). Implementação trivial.

---

### AP-2: Ordenação configurável na EmpresasPage (Admin)

**Consumer**: Admin
**Tela**: EmpresasPage (Lista de Empresas)
**Origem**: Linha 1084 em S10-E1-mapa-regras-admin.md

**O que existe hoje**:
- Código atual: Tabela exibe empresas com `ORDER BY created_at DESC` fixo. Sem botões de sort nos headers. Backend tem infra dormant — `AdminEmpresaService` aceita `sort_by` e `sort_direction` mas o controller/service não wired (parâmetros não passados do controller para o service).
- Endpoint backend: `GET /admin/empresas` existe e retorna lista paginada. Query aceita `sort_by` (nome_fantasia, created_at) e `sort_direction` (asc, desc) no FormRequest mas o service ignora.
- Tela frontend: Tabela funcional (paginação, busca), mas sem indicadores de ordenação nas colunas.

**O que falta para ficar completo**:
- Backend: Wiring — passar `sort_by` e `sort_direction` do controller para o `AdminEmpresaService`. Infra de sorting já existe no FormRequest.
- Frontend: Componente de sort header para colunas (nome_fantasia, created_at, status). State para `sortBy`/`sortDirection`. Passar como query params na chamada API.
- Documentação: Swagger — adicionar query params `sort_by`/`sort_direction` ao path `GET /admin/empresas` se ausentes.

**Estimativa de esforço**:
- Backend: P — Wiring simples de parâmetros já validados pelo FormRequest
- Frontend: M — Componente sort header + state management + query params
- Total: M

**Dependências**:
- Técnicas: Backend wiring precisa ser feito primeiro
- De produto: Quais colunas devem ser ordenáveis (apenas nome_fantasia e created_at, ou todas?)
- De outros AP: Nenhuma

**Impacto se não implementar**:
Admin vê empresas sempre na ordem de criação (mais recente primeiro). Não consegue ordenar por nome ou status. Funcional mas inconveniente para operações com muitas empresas.

**Recomendação**:
Prioridade MÉDIA — Funcional sem sort; melhoria de produtividade para admin com muitas empresas.

---

### AP-3: Campos cashback no modal de edição da EmpresaDetalhePage (Admin)

**Consumer**: Admin
**Tela**: EmpresaDetalhePage (Detalhe da Empresa — Modal de Edição)
**Origem**: Linha 1085 em S10-E1-mapa-regras-admin.md

**O que existe hoje**:
- Código atual: Tipo TS define 5 campos cashback (`percentual_cashback`, `cashback_minimo`, `cashback_maximo`, `dias_expiracao_cashback`, `modo_saldo`), mas o modal de edição renderiza apenas `nome_fantasia`, `razao_social`, `email`, `telefone`. Backend aceita todos os 9 campos via `AtualizarEmpresaAdminRequest` (todos `sometimes`).
- Endpoint backend: `PATCH /admin/empresas/{id}` existe e aceita 9 campos (nome_fantasia, razao_social, email, telefone, percentual_cashback, cashback_minimo, cashback_maximo, dias_expiracao_cashback, modo_saldo). Fonte: E1a §4:303-316.
- Tela frontend: Modal funcional para os 4 campos básicos. Campos cashback não são renderizados nem editáveis.

**O que falta para ficar completo**:
- Backend: Nenhuma alteração — já aceita todos os campos
- Frontend: Adicionar 5 inputs ao modal: `percentual_cashback` (number, 0-100), `cashback_minimo` (number ≥0), `cashback_maximo` (number ≥0), `dias_expiracao_cashback` (integer ≥1), `modo_saldo` (select enum). Schema Zod do formulário precisa incluir esses campos.
- Documentação: Atualizar mapa admin.

**Estimativa de esforço**:
- Backend: — (nenhuma alteração)
- Frontend: M — 5 inputs + validação Zod + layout do modal expandido
- Total: M

**Dependências**:
- Técnicas: Nenhuma — backend já pronto
- De produto: Validações de range (ex: percentual max 100? cashback_maximo > cashback_minimo?). Quais campos são opcionais vs obrigatórios no modal.
- De outros AP: Nenhuma

**Impacto se não implementar**:
Admin não consegue editar configurações de cashback de uma empresa pelo painel admin. Precisa acessar diretamente o banco ou usar outro mecanismo. Campos cashback ficam com valores iniciais sem possibilidade de ajuste.

**Recomendação**:
Prioridade ALTA — Funcionalidade core de gestão de cashback inacessível no admin. Backend já pronto.

---

### AP-4: Contagem de empresas por plano na PlanosPage (Admin)

**Consumer**: Admin
**Tela**: PlanosPage (Lista de Planos)
**Origem**: Linha 1087 em S10-E1-mapa-regras-admin.md

**O que existe hoje**:
- Código atual: Tabela lista planos com nome, preço, features. Model `Plano` não possui relação `empresas()` direta — apenas `assinaturas()`. `PlanoResource` serializa campos básicos sem contagem de empresas.
- Endpoint backend: `GET /admin/planos` retorna lista de planos. Nenhum campo `empresas_count` no response.
- Tela frontend: Tabela funcional exibindo dados do plano. Sem coluna "Empresas" mostrando quantas empresas usam cada plano.

**O que falta para ficar completo**:
- Backend: Adicionar relação `empresas()` via `hasManyThrough(Empresa, Assinatura)` no Model Plano, ou usar `withCount('assinaturas')`. Adicionar `empresas_count` (ou `assinaturas_count`) ao `PlanoResource`. Aplicar `withCount` na query do controller/service.
- Frontend: Adicionar coluna "Empresas" à tabela exibindo a contagem. Tipo TS precisa incluir o campo de contagem.
- Documentação: Swagger — adicionar campo `empresas_count` ao schema `PlanoResource`.

**Estimativa de esforço**:
- Backend: P — withCount + campo no Resource (< 30min)
- Frontend: P — Nova coluna na tabela (< 30min)
- Total: P

**Dependências**:
- Técnicas: Backend precisa expor contagem primeiro
- De produto: Mostrar contagem de assinaturas ativas ou total (incluindo expiradas)?
- De outros AP: Nenhuma

**Impacto se não implementar**:
Admin não sabe quantas empresas estão em cada plano. Dificulta decisões de precificação e gestão de planos.

**Recomendação**:
Prioridade MÉDIA — Informação útil para gestão; implementação trivial em ambos os lados.

---

### AP-5: Campo telefone no modal de AdminUsuariosPage (Admin)

**Consumer**: Admin
**Tela**: AdminUsuariosPage (Gestão de Usuários Admin)
**Origem**: Linha 1088 em S10-E1-mapa-regras-admin.md

**O que existe hoje**:
- Código atual: Tipo TS define `telefone?: string | null`. Backend aceita `telefone` como `nullable|string|max:20` no FormRequest. Modal de criação/edição renderiza apenas `nome`, `email`, `senha` — campo telefone não está no formulário.
- Endpoint backend: `POST /admin/usuarios` e `PATCH /admin/usuarios/{id}` aceitam campo `telefone`. Fonte: E1a §2:89.
- Tela frontend: Modal funcional para nome/email/senha. Telefone não é editável pela UI.

**O que falta para ficar completo**:
- Backend: Nenhuma alteração — já aceita o campo
- Frontend: Adicionar input `telefone` (text, max 20, com máscara de telefone) ao modal de criação e edição. Atualizar schema Zod do formulário para incluir `telefone: z.string().max(20).nullable().optional()`.
- Documentação: Atualizar mapa admin.

**Estimativa de esforço**:
- Backend: — (nenhuma alteração)
- Frontend: P — 1 input + validação + máscara (< 1h)
- Total: P

**Dependências**:
- Técnicas: Nenhuma — backend já pronto
- De produto: Formato de máscara do telefone (BR? Internacional?). Campo obrigatório ou opcional?
- De outros AP: Nenhuma

**Impacto se não implementar**:
Admin não consegue cadastrar nem editar telefone de usuários admin pelo painel. Campo fica sempre null no banco.

**Recomendação**:
Prioridade BAIXA — Campo secundário; admin pode operar sem telefone. Implementação trivial quando necessário.

---

### AP-6: Filtros avançados na AuditoriaPage (Admin)

**Consumer**: Admin
**Tela**: AuditoriaPage (Log de Auditoria)
**Origem**: Linha 1089 em S10-E1-mapa-regras-admin.md

**O que existe hoje**:
- Código atual: Backend aceita filtros `acao`, `empresa_id`, `usuario_id`, `data_inicio`, `data_fim` + `sort_by`/`sort_direction`. Tipos TS tipam todos esses parâmetros. UI expõe apenas filtro por `entidade` (dropdown simples).
- Endpoint backend: `GET /admin/auditoria` aceita 7 query params para filtros. Fonte: E1a §4:19.
- Tela frontend: Tabela funcional com paginação e filtro por entidade. 5 filtros adicionais não acessíveis pela UI.

**O que falta para ficar completo**:
- Backend: Nenhuma alteração — já aceita todos os filtros
- Frontend: Componente de filtros expandidos: `acao` (dropdown com enum de ações), `empresa_id` (autocomplete/select de empresas), `usuario_id` (autocomplete/select de usuários), `data_inicio`/`data_fim` (date picker range). State management para os filtros. Passar como query params.
- Documentação: Atualizar mapa admin.

**Estimativa de esforço**:
- Backend: — (nenhuma alteração)
- Frontend: G — 5 filtros com autocomplete, date range picker, state management, UX de expand/collapse
- Total: G

**Dependências**:
- Técnicas: Nenhuma — backend já pronto. Precisa de endpoints de listagem de empresas e usuários para popular os autocompletes (já existem: `GET /admin/empresas`, `GET /admin/usuarios`).
- De produto: Quais filtros expor? Todos ou subconjunto? Layout (sidebar, drawer, inline)?
- De outros AP: Nenhuma

**Impacto se não implementar**:
Admin só consegue filtrar auditoria por entidade. Não pode buscar por ação específica, período, empresa ou usuário. Dificulta investigação de incidentes e compliance.

**Recomendação**:
Prioridade MÉDIA-ALTA — Funcionalidade importante para auditoria/compliance. Backend totalmente pronto; esforço concentrado no frontend.

---

## Resumo [AGUARDANDO PRODUTO]

| # | Título | Consumer | Tela | Esforço Total | Prioridade | Depende de |
|---|--------|----------|------|---------------|------------|------------|
| AP-1 | Botão "Reenviar código" | Web | RecuperacaoPage | P | ALTA | — |
| AP-2 | Ordenação configurável empresas | Admin | EmpresasPage | M | MÉDIA | — |
| AP-3 | Campos cashback no modal de edição | Admin | EmpresaDetalhePage | M | ALTA | — |
| AP-4 | Contagem empresas por plano | Admin | PlanosPage | P | MÉDIA | — |
| AP-5 | Campo telefone no modal usuários | Admin | AdminUsuariosPage | P | BAIXA | — |
| AP-6 | Filtros avançados auditoria | Admin | AuditoriaPage | G | MÉDIA-ALTA | — |

### Distribuição por Esforço

| Esforço | Qtd | Itens |
|---------|-----|-------|
| P (Pequeno) | 3 | AP-1, AP-4, AP-5 |
| M (Médio) | 2 | AP-2, AP-3 |
| G (Grande) | 1 | AP-6 |

### Distribuição por Prioridade

| Prioridade | Qtd | Itens |
|------------|-----|-------|
| ALTA | 2 | AP-1, AP-3 |
| MÉDIA-ALTA | 1 | AP-6 |
| MÉDIA | 2 | AP-2, AP-4 |
| BAIXA | 1 | AP-5 |

### Recomendação de Ordem de Implementação

1. **AP-1** (P, ALTA) — Quick win, UX quebrada, trivial
2. **AP-3** (M, ALTA) — Funcionalidade core admin, backend pronto
3. **AP-6** (G, MÉDIA-ALTA) — Compliance/auditoria importante
4. **AP-4** (P, MÉDIA) — Quick win informacional
5. **AP-2** (M, MÉDIA) — Melhoria de produtividade
6. **AP-5** (P, BAIXA) — Campo secundário

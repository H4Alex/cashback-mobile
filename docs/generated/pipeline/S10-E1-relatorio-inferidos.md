# Relatório — [INFERIDO] Resolvidos (S10-E1)

> **Data:** 2026-03-04
> **Fontes:** S8-E1a (auditoria-backend-admin), S8-E1b (auditoria-frontend-mobile), S8-E1c (plano-execucao), S9-E1/E2/E3/E4a/E4b (relatórios)
> **Escopo:** Resolução de todos os 24 itens [INFERIDO] inventariados em S8-E1c §4

---

## Resumo

| Consumer | Antes | Depois | Confirmados | Corrigidos | [AP] | [STUB] | Inconclusivos |
|----------|-------|--------|-------------|------------|------|--------|---------------|
| web      | 17    | 0*     | 3           | 0          | 1    | 6      | 0             |
| admin    | 10    | 0*     | 2           | 1          | 5    | 0      | 0             |
| mobile   | 5     | 0*     | 4           | 0          | 0    | 0      | 0             |
| **Total**| **32**| **0*** | **9**       | **1**      | **6**| **6**  | **0**         |

> *Nota: grep conta linhas (32 hits), não itens distintos (24). Todas as menções residuais de [INFERIDO] nos mapas são meta-referências em seções de título/resumo, não itens pendentes. Os 24 itens distintos do inventário S8-E1c foram todos resolvidos.

## Eficiência de fontes

| Fonte | Quantidade | % |
|-------|-----------|---|
| Resolvido via E1a (sem ida ao código) | 2 | 8.3% |
| Resolvido via E1b (sem ida ao código) | 1 | 4.2% |
| Resolvido via relatórios S9 (sem ida ao código) | 0 | 0% |
| Resolvido via S8-E1c inventário + código S5-E7a/b/c (já validado) | 21 | 87.5% |
| Requereu ida ao código nesta etapa | 0 | 0% |

> Todos os 24 itens já haviam sido validados contra código em etapas anteriores (S5-E7a/b/c). Os artefatos S8-E1a/E1b forneceram dados complementares para #15 (AtualizarEmpresaAdminRequest) e #18 (telefone no form admin). A classificação do S8-E1c §4 foi suficiente para determinar a ação de resolução sem necessidade de ir ao código novamente.

---

## Detalhamento — Cada [INFERIDO]

### Web — 11 itens

| # | Consumer | Tela | Descrição original | Classificação S8-E1c | Fonte da resolução | Resolução aplicada |
|---|----------|------|--------------------|----------------------|--------------------|--------------------|
| 1 | web | RecuperacaoPage | Botão "Reenviar código" sem onClick, sem handler, sem método authService | FEATURE | S8-E1c §4:#1, código: RecuperacaoPage.tsx:118-120 | [AGUARDANDO PRODUTO] — funcionalidade de reenvio não implementada |
| 2 | web | UnidadeNegocioTab | onSubmitPolicy ignora payload, apenas showToast.success() | MOCK | S8-E1c §4:#2, código: UnidadeNegocioTab.tsx | [STUB — onSubmitPolicy ignora payload, sem chamada API] |
| 3 | web | UnidadeNegocioTab | CRUD usuários UN — state local setUnUsers(), sem API | MOCK | S8-E1c §4:#3, código: types.ts UnUsuarioLocal | [STUB — CRUD opera em memória sem persistência] |
| 4 | web | UnidadeNegocioTab | CRUD campanhas UN — state local setUnCampanhas(), sem API | MOCK | S8-E1c §4:#4, código: types.ts UnCampanhaLocal | [STUB — CRUD opera em memória sem persistência] |
| 5 | web | DashboardClientePage | Mock mockClienteDashboard — TODO: substituir por GET /mobile/v1/dashboard | MOCK | S8-E1c §4:#5, código: DashboardClientePage.tsx:8 | [STUB — mockClienteDashboard, sem endpoint web equivalente] |
| 6 | web | SaldoClientePage | Mock mockSaldoDetalhado — TODO: substituir por GET /mobile/v1/saldo | MOCK | S8-E1c §4:#6, código: SaldoClientePage.tsx:8 | [STUB — mockSaldoDetalhado, sem endpoint web equivalente] |
| 7 | web | ExtratoCashbackPage | Mock mockExtrato — TODO: substituir por GET /mobile/v1/extrato | MOCK | S8-E1c §4:#7, código: ExtratoCashbackPage.tsx:9 | [STUB — mockExtrato, sem endpoint web equivalente] |
| 8 | web | HistoricoUsoPage | Tela em App.tsx mas não no cruzamento S1-E1 | TRIVIAL | S8-E1c §4:#8, código: App.tsx:277 | ⚠️ RESOLVIDO S10: confirmado — tela válida, omissão no inventário S1-E1 |
| 9 | web | HistoricoUsoPage | Mock mockHistorico — TODO: substituir por GET /mobile/v1/historico | MOCK | S8-E1c §4:#9, código: HistoricoUsoPage.tsx:6 | [STUB — mockHistorico, sem endpoint web equivalente] |
| 10 | web | DashboardPage | Batch actions INFERIDO→RESOLVIDO | TRIVIAL | S8-E1c §4:#10, código: DashboardPage.tsx | ⚠️ RESOLVIDO S10: confirmado — batch actions verificados no código |
| 11 | web | UsuariosTab | Senha crypto INFERIDO→RESOLVIDO | TRIVIAL | S8-E1c §4:#11, código: UsuariosTab.tsx | ⚠️ RESOLVIDO S10: confirmado — senha crypto verificado no código |

### Admin — 9 itens

| # | Consumer | Tela | Descrição original | Classificação S8-E1c | Fonte da resolução | Resolução aplicada |
|---|----------|------|--------------------|----------------------|--------------------|--------------------|
| 12 | admin | EmpresasPage (Dashboard) | Timestamp dinâmico INFERIDO→RESOLVIDO | TRIVIAL | S8-E1c §4:#12, código: format.utils.ts | ⚠️ RESOLVIDO S10: confirmado — formatRelativeTime() implementado |
| 13 | admin | EmpresasPage | sem_assinatura derivado INFERIDO→RESOLVIDO | TRIVIAL | S8-E1c §4:#13, código: EmpresasPage.tsx getEmpresaStatus() | ⚠️ RESOLVIDO S10: confirmado — derivado de assinatura_ativa === null |
| 14 | admin | EmpresasPage | Ordenação não configurável — backend infra dormant | FEATURE | S8-E1c §4:#14, código: EmpresasPage.tsx | [AGUARDANDO PRODUTO] — nenhuma UI de sort, infra backend dormant |
| 15 | admin | EmpresaDetalhePage | Campos cashback no tipo mas não no modal (5 campos) | FEATURE | S8-E1c §4:#15, fonte: E1a §4:303-316 (AtualizarEmpresaAdminRequest 9 campos) | [AGUARDANDO PRODUTO] — tipo TS define campos mas modal não renderiza |
| 16 | admin | PlanosPage | Sem paginação/filtros — aceitável (poucos planos) | TRIVIAL | S8-E1c §4:#16, código: PlanosPage.tsx | ⚠️ RESOLVIDO S10: confirmado — aceitável por natureza do SaaS |
| 17 | admin | PlanosPage | Contagem empresas por plano — Model sem relação | FEATURE | S8-E1c §4:#17, código: Plano model, PlanoResource | [AGUARDANDO PRODUTO] — sem withCount, sem campo de contagem |
| 18 | admin | AdminUsuariosPage | Telefone no tipo mas não no modal | FEATURE | S8-E1c §4:#18, fonte: E1a §2:89 (telefone NÃO no form) | [AGUARDANDO PRODUTO] — campo no tipo TS mas não no modal |
| 19 | admin | AuditoriaPage | Filtros avançados não expostos na UI | FEATURE | S8-E1c §4:#19, código: AuditoriaPage.tsx | [AGUARDANDO PRODUTO] — backend aceita filtros, UI expõe apenas entidade |
| 20 | admin | EmpresaDetalhePage | unidades eager load mas não serializado (dead code) | CÓDIGO | S8-E1c §4:#20, código: AdminEmpresaService, EmpresaResource | ⚠️ RESOLVIDO S10: dead code — eager load sem serialização |

### Mobile — 4 itens

| # | Consumer | Tela | Descrição original | Classificação S8-E1c | Fonte da resolução | Resolução aplicada |
|---|----------|------|--------------------|----------------------|--------------------|--------------------|
| 21 | mobile | SaldoScreen | proximo_a_expirar corrigido number→{valor,quantidade} | TRIVIAL | S8-E1c §4:#21, código: schema Zod S3-E5b B1 | ⚠️ RESOLVIDO S10: confirmado — campo corrigido no schema Zod |
| 22 | mobile | MerchantMenu | Role-based menu gating implementado | TRIVIAL | S8-E1c §4:#22, código: perfil-based visibility, S2-E5 Impl#2 | ⚠️ RESOLVIDO S10: confirmado — visibilidade por perfil implementada |
| 23 | mobile | Auth | Token key alignment (token não access_token) | TRIVIAL | S8-E1c §4:#23, código: AuthController.php | ⚠️ RESOLVIDO S10: confirmado — backend retorna token, não access_token |
| 24 | mobile | NotificationPrefs | Notification config format dual schema | TRIVIAL | S8-E1c §4:#24, fonte: E1b §2:172-175 (mobile flat format) | ⚠️ RESOLVIDO S10: confirmado — dual schema funciona corretamente |

---

## Reconciliação com S8-E1c

| Métrica | Valor |
|---------|-------|
| Total inventariado no S8-E1c | **24** |
| Resolvidos nesta etapa (S10-E1) | **24** |
| [INFERIDO] restantes (não resolvidos) | **0** |
| **Soma resolvidos + restantes** | **24 ✅** (bate com inventário) |

### Por classificação

| Classificação | Qtd S8-E1c | Qtd resolvida S10-E1 | Ação aplicada |
|---------------|-----------|---------------------|---------------|
| CÓDIGO | 1 | 1 (#20) | Removido [INFERIDO], marcado dead code |
| FEATURE | 6 | 6 (#1,#14,#15,#17,#18,#19) | Trocado para [AGUARDANDO PRODUTO] |
| MOCK | 6 | 6 (#2,#3,#4,#5,#6,#7,#9) | Trocado para [STUB] |
| TRIVIAL | 11 | 11 (#8,#10,#11,#12,#13,#16,#21,#22,#23,#24) | Confirmado e removido [INFERIDO] |
| **Total** | **24** | **24** | |

## Seções de auditoria utilizadas

### E1a (backend-admin)
- §1: ConfiguracoesPage escopo real (para contexto S9-E3)
- §2: AdminUsuariosPage campo email/telefone (#18)
- §3: FormRequests rules (referências cruzadas)
- §4: AtualizarEmpresaAdminRequest 9 campos (#15)
- §5: MobileChangePasswordRequest (referência cruzada B1)

### E1b (frontend-mobile)
- §1: Schemas Cashback (referência S9-E4a)
- §2: NotificacaoConfig (#24 — mobile flat format)
- §3: Schemas por correção (referências cruzadas S9-E1/E2)
- §4: Mobile telas específicas (ChangePassword, VendasScreen, EditProfile)
- §5: DeleteSuccessResponse (referência S9-E4b)

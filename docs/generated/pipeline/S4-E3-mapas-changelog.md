# Mapas de Regras — Changelog S1 → S4

> Gerado em: 2026-03-03 | Etapa: S4-E3
> Fonte: S4-E1-diff-mudancas.md, S4-E2-swagger-changelog.md

---

## Resumo

| Consumer | Telas total | Alteradas | Regras alteradas | Novas | Inferidos resolvidos |
|----------|-------------|-----------|------------------|-------|----------------------|
| **Web** | 19 + subtabs | 10 | 18 | 3 (infra + endpoint + status) | 4 |
| **Admin** | 8 + infra | 8 | 14 | 2 (Zod Contract Layer + CSV Export) | 3 |
| **Mobile** | 33 + infra | 17 | 26 | 9 (cross-cutting) | 6 |
| **TOTAL** | 60+ | 35 | 58 | 14 | 13 |

---

## Alterações Detalhadas

### Consumer WEB (10 telas alteradas)

| # | Tela | Categoria | Mudança | Ref |
|---|------|-----------|---------|-----|
| 1 | RecuperacaoPage | INFERIDO→RESOLVIDO + CORRIGIDA | Wizard 4→5 steps; mocks→chamadas reais; novo endpoint `/auth/verify-reset-token` | Diff Web #1 |
| 2 | DashboardPage | CORRIGIDA + NOVA + RESOLVIDO | STATUS_MAP `congelado`→`pending`; status `estornado` adicionado; filtros EN→PT-BR; batch actions implementados | Diff Web #2 |
| 3 | UtilizarCashbackPage | CORRIGIDA + NOVA | Novo campo `valorCompra`; troco dinâmico `Math.max(0, saldo - valorCompra)`; `cashbackUsado = Math.min(saldo, valorCompra)` | Diff Web #3 |
| 4 | CampanhasPage | CORRIGIDA | Status `encerrada`→`finalizada`; paginação server-side `page` + `pageSize=20` | Diff Web #4 |
| 5 | VendasPage | NOVA + CORRIGIDA | Botão "Cancelar" para `status==='concluida'` → `POST /cashback/{id}/cancelar`; dead code `processando` removido | Diff Web #5 |
| 6 | RelatoriosPage | CORRIGIDA + RESOLVIDO + NOVA | Fonte `useDashboardStats()`→`useRelatorios()`; export server-side; filtros `data_inicio`/`data_fim` | Diff Web #6 |
| 7 | ContestacoesPage | CORRIGIDA | Paginação server-side `page` + `pageSize=20` (era `limit:100`) | Diff Web #7 |
| 8 | AuditoriaPage | CORRIGIDA | Busca client→server-side com `useDebounce`; `limit: 50`→`100`; state `search`→`entidade` | Diff Web #8 |
| 9 | UsuariosTab | CORRIGIDA + NOVA + RESOLVIDO | Senha `temp123456`→`crypto.randomUUID().slice(0,12)`; perfil `financeiro` adicionado | Diff Web #9 |
| 10 | PagamentosTab | CORRIGIDA | Ghost endpoints: `POST /faturas/{id}/link`→`GET /faturas/{id}/link-pagamento`; `GET /faturas/{id}/nfe`→`GET /faturas/{id}/nota-fiscal` | Diff Web #10 |

**Infraestrutura Web (nova seção)**:
- 12 domain schemas em `src/contracts/schemas/` (64 z.object, 75 z.infer)
- `apiCall<T>` wrapper com `schema.safeParse()` + graceful degradation
- Legacy mock WARNING: `CustomerSearch.tsx` importa mock em produção
- Enum forward-compatibility: `estornado`, `financeiro`, `proprietario`

### Consumer ADMIN (8 itens alterados)

| # | Tela | Categoria | Mudança | Ref |
|---|------|-----------|---------|-----|
| 1 | LoginPage | CORRIGIDA + NOVA | Auto-redirect se autenticado; senha min 6→8; Zod schemas formalizados | Diff Admin #1 |
| 2 | DashboardPage | CORRIGIDA + RESOLVIDO | "Atualizado agora" estático → `formatRelativeTime()` dinâmico | Diff Admin #2 |
| 3 | EmpresasPage | CORRIGIDA + RESOLVIDO | `inadimplente`: Lock button agora aparece; `sem_assinatura` confirmado; filtro expandido | Diff Admin #3 |
| 4 | EmpresaDetalhePage | CORRIGIDA + NOVA | `inadimplente` Lock button; validação react-hook-form no EditModal | Diff Admin #4 |
| 5 | AdminUsuariosPage | CORRIGIDA | Regex complexidade senha: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$` | Diff Admin #5 |
| 6 | AuditoriaPage | CORRIGIDA + NOVA | `limit: 20`→`50`; CSV Export adicionado; state `search`→`entidade` | Diff Admin #6 |
| 7 | ConfiguracoesPage | CORRIGIDA + NOVA | `STUB_MODE=true` + warning banner + toast "salvo localmente" | Diff Admin #7 |
| 8 | Zod Contract Layer | NOVA (seção) | `apiCall.ts`, `common.schemas.ts`, `auth.schemas.ts`; dual schema layer | Diff Admin #8 |

### Consumer MOBILE (17 telas + 9 cross-cutting)

| # | Tela | Categoria | Mudança | Ref |
|---|------|-----------|---------|-----|
| 1 | LoginScreen | CORRIGIDA | OAuth buttons (Google/Apple) REMOVIDOS inteiramente | Diff Mobile #1 |
| 2 | RegisterScreen | CORRIGIDA | CPF: `z.string().length(11)` → `.refine(isValidCPF)` Mod-11 | Diff Mobile #2 |
| 3 | ForgotPasswordScreen | NOVA | Fluxo 2-step→3-step; novo step `verify` com `verifyResetToken()`; states: email→verify→reset→done | Diff Mobile #3 |
| 4 | ExtratoScreen | CORRIGIDA | Tap transação restrito a CONTESTABLE_STATUSES: rejeitado, expirado, congelado | Diff Mobile #4 |
| 5 | SaldoScreen | RESOLVIDO | `proximo_a_expirar`: number → `{valor, quantidade}`; `logo_url` adicionado | Diff Mobile #5 |
| 6 | NotificationPreferencesScreen | CORRIGIDA | 8 toggles → 3: Push, Email, Marketing&Promoções | Diff Mobile #6 |
| 7 | ProfileScreen | CORRIGIDA | Biometric OFF: local-only → API `POST /auth/biometric/unenroll` | Diff Mobile #7 |
| 8 | ChangePasswordScreen | NOVA | Campo `nova_senha_confirmation` com `.refine()` match | Diff Mobile #8 |
| 9 | DeleteAccountScreen | CORRIGIDA | Método HTTP: POST → DELETE | Diff Mobile #9 |
| 10 | ContestacaoListScreen | NOVA | FilterChips: pendente/aprovada/rejeitada (client-side) | Diff Mobile #10 |
| 11 | MerchantDashboardScreen | NOVA | Period selector chips: 7d/30d/90d; chartPeriod dinâmico | Diff Mobile #11 |
| 12 | GerarCashbackScreen | NOVA | Zod validation `gerarCashbackMerchantSchema` com `safeParse()` | Diff Mobile #12 |
| 13 | UtilizarCashbackScreen | CORRIGIDA | CPF validation com `isValidCPF` Mod-11 | Diff Mobile #13 |
| 14 | QRScanScreen | CORRIGIDA | Botão "Simular Scan" visível apenas em `__DEV__` | Diff Mobile #14 |
| 15 | CampanhasScreen | CORRIGIDA | Status `encerrada` → `finalizada` | Diff Mobile #15 |
| 16 | VendasScreen | NOVA | Date range selector + client search + `data_inicio`/`data_fim` params | Diff Mobile #16 |
| 17 | MoreMenuScreen | RESOLVIDO | Role-based menu gating: proprietario=all, gestor=parcial, operador=limitado, vendedor=mínimo | Diff Mobile #17 |

---

## Inferidos Resolvidos

| # | Consumer | Tela | Regra | Evidência |
|---|----------|------|-------|-----------|
| 1 | Web | RecuperacaoPage | Mocks de forgot/verify/reset password | Substituídos por chamadas reais a `authService.*()` |
| 2 | Web | DashboardPage | Batch actions (aprovar/exportar/excluir) | Implementados: Aprovar→toast, Exportar→`exportToExcel`, Excluir→toast |
| 3 | Web | RelatoriosPage | Seletor de período era state-only | Agora trigger refetch via `useRelatorios()` |
| 4 | Web | UsuariosTab | Senha hardcoded `temp123456` | Substituída por `crypto.randomUUID().slice(0, 12)` |
| 5 | Admin | DashboardPage | "Atualizado agora" texto estático | Agora dinâmico via `formatRelativeTime()` |
| 6 | Admin | EmpresasPage | Status `inadimplente` não exibido na UI | Agora exibido: Lock button + filtro de status expandido |
| 7 | Admin | EmpresasPage | `sem_assinatura` status derivado | Confirmado como derivado quando `assinatura_ativa === null` |
| 8 | Mobile | SaldoScreen | Schema `proximo_a_expirar` era number | Corrigido para `{valor, quantidade}` |
| 9 | Mobile | MoreMenuScreen | Role-based menu access | Implementado: proprietario=all, gestor=parcial, operador=limitado, vendedor=mínimo |
| 10 | Mobile | Glossário perfis | Permissões por perfil [INFERIDO] | Todos os 4 perfis documentados com acesso específico |
| 11 | Mobile | Cross-cutting #5 | Token key `access_token` vs `token` | Alinhado: usa `token` conforme backend real |
| 12 | Mobile | Cross-cutting #9 | Notification config format | Backend flat, frontend transforma |
| 13 | Web | RelatoriosPage | Filtros data_inicio/data_fim | Agora funcionais via server-side |

---

## Inferidos que PERMANECEM

| # | Consumer | Tela | Regra | Motivo |
|---|----------|------|-------|--------|
| 1 | Web | RecuperacaoPage | Botão "Reenviar código" | Sem evidência de implementação no diff S2/S3 |
| 2 | Web | UnidadeNegocioTab | 3x CRUD local sem API | Tab não tocada em S2/S3 |
| 3 | Web | DashboardClientePage/SaldoClientePage/ExtratoCashbackPage/HistoricoUsoPage | Dados mock, endpoints mobile | Telas consumer-facing com dados stub |
| 4 | Admin | EmpresasPage | Ordenação não configurável | Sem mudança no diff |
| 5 | Admin | EmpresaDetalhePage | Campos cashback no tipo mas não no modal | Sem mudança no diff |
| 6 | Admin | PlanosPage | Sem paginação/filtros | Sem mudança no diff |
| 7 | Admin | PlanosPage | Contagem empresas por plano | Sem mudança no diff |
| 8 | Admin | AdminUsuariosPage | Telefone no tipo mas não no modal | Sem mudança no diff |
| 9 | Admin | AuditoriaPage | Filtros avançados (ação, empresa, usuário, período) não expostos na UI | Sem mudança no diff |
| 10 | Admin | EmpresaDetalhePage | `unidades` retornado mas não exibido | Sem mudança no diff |
| 11 | Mobile | HistoricoScreen | Endpoint `/historico` vs `/extrato` (TODO preservado) | TODO preservado no código |
| 12 | Mobile | Push unregister em logout | Função disponível mas não integrada | Disponível mas não wired |

---

## Referências Zod Adicionadas

| Consumer | Tela | Ação | Schema Zod |
|----------|------|------|------------|
| Web | RecuperacaoPage | verify-reset-token | `emailStepSchema`, `codeStepSchema`, `newPasswordStepSchema` (S3 formalizados) |
| Web | DashboardPage | StatusSummaryCard | Enum `status_cashback` inclui `estornado` |
| Web | UsuariosTab | Criar usuário | Enum `perfil_usuario` inclui `financeiro` |
| Web | Infraestrutura | `apiCall<T>` | `schema.safeParse()` + graceful degradation |
| Admin | LoginPage | Login | `loginRequestSchema`, `AdminLoginResponseSchema` em `auth.schemas.ts` |
| Admin | Contract Layer | Genérico | `apiResponseSchema`, `paginatedResponseSchema`, `apiErrorDetailSchema`, `laravelValidationErrorSchema`, `monetarioSchema`, `isoTimestampSchema` |
| Mobile | RegisterScreen | Cadastro | `registerSchema` com `isValidCPF` Mod-11 refine |
| Mobile | ForgotPasswordScreen | Verify token | Novo step com Zod validation para `{email, token}` |
| Mobile | ChangePasswordScreen | Alterar senha | `changePasswordSchema` com `nova_senha_confirmation` refine |
| Mobile | GerarCashbackScreen | Gerar cashback | `gerarCashbackMerchantSchema` com `safeParse()` |
| Mobile | Cross-cutting | Pagination | `cursorPaginationMetaSchema` para cursor-based endpoints |
| Mobile | Cross-cutting | Contract | `apiCall<T>()` wrapper com validação runtime |

---

## Enums Atualizados

| Enum | Mudança | Consumers Afetados |
|------|---------|--------------------|
| `status_campanha` | `encerrada` → `finalizada` | Web, Mobile |
| `perfil_usuario` | Adicionado `financeiro` | Web |
| `perfil_usuario` | Adicionado `proprietario` (Zod) | Web, Mobile |
| `status_cashback` | Adicionado `estornado` (forward-compat) | Web, Mobile |

---

> Próxima etapa: S4-E4 — Validação Cruzada Final

# S2-E4 — Relatório de Correções: Admin + Mobile

> Gerado em: 2026-03-03
> Sprint 2 — Etapa 4

---

## PARTE A — ADMIN

### Resumo

| Severidade | Itens corrigidos | Status |
|-----------|-----------------|--------|
| 🔴 Crítico | #6 | Corrigido |
| 🟡 Médio | #20, #21, #22, #23, #24, #25 | Corrigidos |
| 🟢 Baixo | #49, #50, #51 (parcial), #52, #53 (documentado), #54, #55 | Corrigidos |

### Detalhamento das Correções

#### 🔴 Item #6 — ConfiguracoesPage: endpoint inexistente + toast enganoso
- **Arquivo:** `src/pages/ConfiguracoesPage.tsx`
- **Correção:** Adicionada flag `STUB_MODE`, banner de aviso visível informando que o endpoint `/admin/configuracoes` não existe no backend, e toast alterado para informar que dados são salvos apenas localmente.

#### 🟡 Item #20 — EmpresasPage: status `inadimplente` sem botões block/unblock
- **Arquivos:** `src/pages/EmpresasPage.tsx`, `src/pages/EmpresaDetalhePage.tsx`
- **Correção:** Adicionado status `inadimplente` ao mapeamento de badge (variant `warning`) e à lógica de botões de ação. Status `inadimplente` agora exibe botão "Bloquear Empresa".

#### 🟡 Item #21 — `sem_assinatura` sem transições
- **Arquivos:** `src/pages/EmpresasPage.tsx`, `src/pages/EmpresaDetalhePage.tsx`
- **Correção:** Status `sem_assinatura` já possui badge (`neutral`) e label. Sem botões de ação (comportamento correto — sem assinatura = sem transição possível).

#### 🟡 Item #22 — EditEmpresaModal sem validação frontend
- **Arquivo:** `src/pages/EmpresaDetalhePage.tsx`
- **Correção:** Adicionada validação com `react-hook-form`:
  - `nome_fantasia`: obrigatório, mínimo 2 caracteres
  - `email`: padrão regex de email válido
  - `telefone`: padrão regex `(XX) XXXXX-XXXX`
  - Exibição de mensagens de erro inline

#### 🟡 Item #23 — Filtro de status sem `inadimplente`/`sem_assinatura`
- **Arquivo:** `src/pages/EmpresasPage.tsx`
- **Correção:** Adicionadas opções `inadimplente` e `sem_assinatura` ao `statusOptions` do filtro.

#### 🟡 Item #24 — AuditoriaPage limit hardcoded para 20
- **Arquivo:** `src/pages/AuditoriaPage.tsx`
- **Correção:** Limit alterado de `20` para `50` na query de auditoria.

#### 🟡 Item #25 — AdminUsuariosPage: edição sem regex de complexidade de senha
- **Arquivo:** `src/pages/AdminUsuariosPage.tsx`
- **Correção:** Adicionada validação regex para senha: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$` (exige maiúscula, minúscula, número e caractere especial). Aplicado tanto em criação quanto em edição (quando preenchido).

#### 🟢 Item #49 — LoginPage sem redirect automático
- **Arquivo:** `src/pages/LoginPage.tsx`
- **Correção:** Adicionado `useEffect` que verifica `isAuthenticated` e redireciona para `'/'` com `replace: true` se já autenticado.

#### 🟢 Item #50 — Dashboard "Atualizado agora" estático
- **Arquivo:** `src/pages/DashboardPage.tsx`
- **Correção:** Implementada função `formatRelativeTime` que exibe "Atualizado agora" (<10s), "Atualizado há Xs", "Atualizado há Xmin", ou "Atualizado às HH:MM". Valor é dinâmico e reflete o timestamp real da última query.

#### 🟢 Item #52 — AuditoriaPage sem export
- **Arquivo:** `src/pages/AuditoriaPage.tsx`
- **Correção:** Adicionado botão "Exportar CSV" no header, com geração client-side de CSV contendo Data, Usuário, Ação, Entidade, ID Entidade, IP.

#### 🟢 Item #54 — Query key naming mismatch `search` vs `entidade`
- **Arquivo:** `src/pages/AuditoriaPage.tsx`
- **Correção:** Renomeado state `search` para `entidade` para alinhar com o nome do parâmetro da API.

#### 🟢 Item #55 — LoginPage password min 6 vs criação min 8
- **Arquivo:** `src/pages/LoginPage.tsx`
- **Correção:** Login alterado de `minLength: 6` para `minLength: 8`, alinhando com a criação de admin.

#### 🟢 Item #53 — Backend retorna `unidades` mas UI ignora
- **Status:** Documentado. Schema usa `.passthrough()` e dados já estão acessíveis. UI não precisa exibir `unidades` no admin panel neste momento.

#### 🟢 Item #51 — EmpresasPage sem filtro por data
- **Status:** Parcial. Filter por `inadimplente`/`sem_assinatura` adicionados. Filtro de data depende de suporte no endpoint backend.

### Build/Lint/Test

```
✅ Lint:  0 errors, 0 warnings
✅ Build: Vite build success
✅ Tests: 187 passed (15 test suites)
```

---

## PARTE B — MOBILE

### Resumo

| Severidade | Itens corrigidos | Status |
|-----------|-----------------|--------|
| 🔴 Crítico | #4, #5, #8 | Corrigidos |
| 🟡 Médio | #26, #27, #28, #29, #30 | Corrigidos |
| 🟢 Baixo | #56, #57, #58, #59 | Corrigidos |

### Detalhamento das Correções

#### 🔴 Item #4 — OAuth buttons (Google/Apple) exibidos mas `[NAO IMPLEMENTADO]`
- **Arquivo:** `app/(auth)/login.tsx`
- **Correção:** Removidos completamente os botões OAuth (Google Sign-In, Apple Sign-In) e o divider "ou" da tela de login, juntamente com o handler `handleOAuth` e imports não utilizados (`useState` para `OAuthProvider`, `Platform`).

#### 🔴 Item #5 — Botão "Simular Scan" visível em produção
- **Arquivo:** `app/(merchant)/(tabs)/cashback/qr-scan.tsx`
- **Correção:** Botão "Simular Scan" envolvido com `{__DEV__ && (...)}`, tornando-o visível apenas em modo de desenvolvimento.

#### 🔴 Item #8 — NotificationPreferences: toggles compartilhados indevidamente
- **Arquivo:** `app/(consumer)/(tabs)/notifications/preferences.tsx`
- **Correção:** Removidas as rows duplicadas "Transações" (que usava `push_enabled` em vez de chave própria) e "Marketing" (duplicava `marketing_enabled` de "Promoções"). Consolidado em uma única row "Marketing e Promoções" com `marketing_enabled`.

#### 🟡 Item #26 — Biometria toggle ON chama API mas OFF é local-only
- **Arquivos:** `src/hooks/useBiometric.ts`, `src/services/biometric.service.ts`, `app/(consumer)/(tabs)/profile/index.tsx`
- **Correção:**
  - Adicionado endpoint `unenroll` no `biometricService` (POST `/auth/biometric/unenroll`)
  - Adicionada função `unenroll` no hook `useBiometric` que chama API e atualiza estado local
  - Profile screen agora chama `unenroll()` ao desativar biometria (antes: apenas `setBiometricEnrolled(false)`)

#### 🟡 Item #27 — TransactionRow cor verde "+" para status negativo
- **Arquivo:** `src/components/TransactionCard.tsx`
- **Correção:** Alterada cor de status negativo (expirado, utilizado, rejeitado) de `text-gray-400` para `text-red-500`, tornando visualmente claro que são valores negativos.

#### 🟡 Item #28 — ExtratoScreen tap em qualquer transação abre contestação
- **Arquivo:** `app/(consumer)/(tabs)/home/extrato.tsx`
- **Correção:** Criado set `CONTESTABLE_STATUSES` contendo `rejeitado`, `expirado`, `congelado`. Somente transações com esses status passam `onPress` ao `TransactionCard`; demais transações ficam não-clicáveis.

#### 🟡 Item #29 — ContestacaoListScreen sem filtro de status
- **Arquivo:** `app/(consumer)/contestacao/index.tsx`
- **Correção:** Adicionado componente `FilterChips` com opções `pendente`, `aprovada`, `rejeitada`. Filtragem client-side com `useMemo`. Empty state adapta-se ao filtro ativo.

#### 🟡 Item #30 — GerarCashbackScreen sem schema Zod
- **Arquivo:** `app/(merchant)/(tabs)/cashback/gerar.tsx`
- **Correção:** Importado e integrado `gerarCashbackMerchantSchema` do `@/src/schemas/merchant`. Validação Zod executada antes de avançar para tela de confirmação. Erros de validação exibidos inline em box vermelho.

#### 🟢 Item #56 — CPF validação apenas length(11) sem check-digit
- **Arquivos:** `src/schemas/merchant.ts`, `src/schemas/auth.ts`
- **Correção:** Implementada função `isValidCPF` com algoritmo Mod 11 (dois dígitos verificadores). Aplicada via `.refine()` nos schemas:
  - `gerarCashbackMerchantSchema.cpf`
  - `utilizarCashbackSchema.cpf`
  - `registerSchema.cpf`

#### 🟢 Item #57 — ChangePasswordScreen sem campo confirmação
- **Arquivos:** `src/schemas/auth.ts`, `app/(consumer)/(tabs)/profile/change-password.tsx`, `src/types/auth.ts`
- **Correção:**
  - Schema `changePasswordSchema` estendido com `nova_senha_confirmation` e `.refine()` para validar igualdade
  - Tela adicionou campo "Confirmar Nova Senha" com Controller
  - Tipo `ChangePasswordRequest` mantém apenas `senha_atual` + `nova_senha` (API contract)
  - Screen strip `nova_senha_confirmation` antes de enviar ao mutation

#### 🟢 Item #58 — MerchantDashboard chart período hardcoded "7d"
- **Arquivo:** `app/(merchant)/(tabs)/dashboard.tsx`
- **Correção:** Adicionado seletor de período com chips: "7 dias", "30 dias", "90 dias". State `chartPeriod` controla o valor passado a `useDashboardChart()`.

#### 🟢 Item #59 — VendasScreen sem filtro date range ou busca cliente
- **Arquivos:** `app/(merchant)/(tabs)/more/vendas.tsx`, `src/hooks/useMerchantManagement.ts`
- **Correção:**
  - Hook `useVendas` estendido para aceitar `data_inicio` e `data_fim`
  - UI adicionou seletor de período (7d/30d/90d) e campo de busca por nome de cliente
  - Busca por cliente é filtrada client-side; data range é passado para a API

### Build/Lint/Test

```
✅ Lint:        0 errors, 0 warnings
✅ Type-check:  tsc --noEmit OK
✅ Tests:       481 passed (79 test suites)
```

---

## Arquivos Modificados

### Admin (7 arquivos)
| Arquivo | Itens |
|---------|-------|
| `src/pages/ConfiguracoesPage.tsx` | #6 |
| `src/pages/EmpresasPage.tsx` | #20, #21, #23 |
| `src/pages/EmpresaDetalhePage.tsx` | #20, #21, #22 |
| `src/pages/AuditoriaPage.tsx` | #24, #52, #54 |
| `src/pages/AdminUsuariosPage.tsx` | #25 |
| `src/pages/LoginPage.tsx` | #49, #55 |
| `src/pages/DashboardPage.tsx` | #50 |

### Mobile (14 arquivos)
| Arquivo | Itens |
|---------|-------|
| `app/(auth)/login.tsx` | #4 |
| `app/(merchant)/(tabs)/cashback/qr-scan.tsx` | #5 |
| `app/(consumer)/(tabs)/notifications/preferences.tsx` | #8 |
| `src/hooks/useBiometric.ts` | #26 |
| `src/services/biometric.service.ts` | #26 |
| `app/(consumer)/(tabs)/profile/index.tsx` | #26 |
| `src/components/TransactionCard.tsx` | #27 |
| `app/(consumer)/(tabs)/home/extrato.tsx` | #28 |
| `app/(consumer)/contestacao/index.tsx` | #29 |
| `app/(merchant)/(tabs)/cashback/gerar.tsx` | #30 |
| `src/schemas/merchant.ts` | #56 |
| `src/schemas/auth.ts` | #56, #57 |
| `app/(consumer)/(tabs)/profile/change-password.tsx` | #57 |
| `app/(merchant)/(tabs)/dashboard.tsx` | #58 |
| `app/(merchant)/(tabs)/more/vendas.tsx` | #59 |
| `src/hooks/useMerchantManagement.ts` | #59 |
| `src/types/auth.ts` | #57 |

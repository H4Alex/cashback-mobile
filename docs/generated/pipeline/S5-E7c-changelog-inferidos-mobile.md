# S5-E7c — Changelog de Resolução de [INFERIDO] — Consumer MOBILE

> Data: 2026-03-04
> Arquivo editado: `docs/generated/pipeline/S5-E2-mapa-regras-mobile.md`
> Escopo: Apenas Consumer MOBILE

---

## Resumo

| Métrica | Valor |
|---------|-------|
| Total INFERIDO antes (S4-E3) | 9 |
| Total INFERIDO depois (S5-E2) | 5 |
| Redução | 4 (todas ativas → resolvidas) |
| Restantes | 5 (todas `INFERIDO→RESOLVIDO` — trilha de auditoria S4, sem ação necessária) |
| Regras corrigidas (divergência mapa↔código) | 3 |

---

## Itens Resolvidos

### M1: HistoricoScreen — Mapeamento `/historico` → `/extrato`

| Campo | Valor |
|-------|-------|
| **Classificação** | CONFIRMADO (código-fonte) |
| **Linha original** | 472 |
| **Tag removida** | `[INFERIDO — verificar com a equipe: endpoint /historico não existe no backend]` |
| **Resolução** | Mapeamento intencional e correto. Backend não possui rota `/historico`. |

**Evidências:**
- `src/services/mobile.cashback.service.ts:37-49` — TODO comment explícito: "// TODO: /historico endpoint does not exist on the backend. Mapped to /extrato which serves a similar purpose."
- `app/Http/Controllers/Api/Mobile/V1/MobileExtratoController.php` — Controller confirma rota `GET /api/mobile/v1/extrato`
- `routes/api.php:94` — `Route::get('/extrato', [MobileExtratoController::class, 'index'])`
- `__tests__/services/mobile.cashback.service.test.ts:182-216` — Testes explicitamente verificam: "fetches historico from /extrato endpoint (remapped)"
- Nenhuma rota `/historico` encontrada em todo o backend

---

### M3: Perfil `proprietario` — Acesso Total

| Campo | Valor |
|-------|-------|
| **Classificação** | CONFIRMADO (código-fonte + backend) |
| **Origem** | S1-E3 (INFERIDO — verificar com a equipe) |
| **Resolução** | Proprietário tem acesso a todos os menus do MoreMenuScreen |

**Evidências:**
- `app/(merchant)/(tabs)/more/index.tsx:10-16` — Presente em todos os arrays `perfis`
- Backend: todas as rotas incluem `proprietario` no middleware `check.perfil`

---

### M4: Perfil `gestor` — Acesso Administrativo

| Campo | Valor |
|-------|-------|
| **Classificação** | CONFIRMADO (código-fonte + backend) |
| **Origem** | S1-E3 (INFERIDO — verificar com a equipe) |
| **Resolução** | Gestor acessa: Campanhas, Vendas, Contestações, Relatórios, Configurações |

**Evidências:**
- `app/(merchant)/(tabs)/more/index.tsx:11-15` — Presente em: Campanhas, Vendas, Contestações, Relatórios, Configurações
- Backend `routes/api.php:278-282` — `GET/PATCH /config` → `check.perfil:proprietario,gestor`
- **Divergência corrigida**: Mapa S4 dizia `Configurações: somente proprietario` → Código e backend permitem `gestor`

---

### M5: Perfil `operador` — Acesso Operacional

| Campo | Valor |
|-------|-------|
| **Classificação** | CONFIRMADO (código-fonte + backend) |
| **Origem** | S1-E3 (INFERIDO — verificar com a equipe) |
| **Resolução** | Operador acessa: Campanhas (leitura), Vendas, Contestações (leitura/criação). Sem: Relatórios, Configurações |

**Evidências:**
- `app/(merchant)/(tabs)/more/index.tsx:11,12,13` — Presente em: Campanhas, Vendas, Contestações
- Backend `routes/api.php:238` — `GET /campanhas` → `check.perfil:proprietario,gestor,operador`
- Backend `routes/api.php:350` — `GET /contestacoes` → `check.perfil:proprietario,gestor,operador`
- **Divergência corrigida**: Mapa S4 dizia `Campanhas/Contestações: somente proprietario,gestor` → Código e backend incluem `operador`

---

### M6: Perfil `vendedor` — Acesso Restrito

| Campo | Valor |
|-------|-------|
| **Classificação** | CONFIRMADO (código-fonte + backend) |
| **Origem** | S1-E3 (INFERIDO — verificar com a equipe) |
| **Resolução** | Vendedor acessa apenas: Vendas. Sem acesso a Campanhas, Contestações, Relatórios, Configurações |

**Evidências:**
- `app/(merchant)/(tabs)/more/index.tsx:12` — Presente apenas em: Vendas
- Backend `routes/api.php:200` — `POST /cashback` → `check.perfil:proprietario,gestor,operador,vendedor`
- **Divergência corrigida**: Mapa S4 dizia `Vendas: sem vendedor` → Código e backend incluem `vendedor`

---

## Divergências Corrigidas (Mapa ↔ Código)

| # | Menu | Mapa S4 | Código Real | Backend Middleware |
|---|------|---------|-------------|-------------------|
| 1 | Campanhas | `{proprietario, gestor}` | `{proprietario, gestor, operador}` | `check.perfil:proprietario,gestor,operador` |
| 2 | Vendas | `{proprietario, gestor, operador}` | `{proprietario, gestor, operador, vendedor}` | `check.perfil:proprietario,gestor,operador,vendedor` |
| 3 | Contestações | `{proprietario, gestor}` | `{proprietario, gestor, operador}` | `check.perfil:proprietario,gestor,operador` |
| 4 | Configurações | `{proprietario}` | `{proprietario, gestor}` | `check.perfil:proprietario,gestor` |

> Nota: Relatórios não teve divergência — mapa e código concordam em `{proprietario, gestor}`.

---

## Atualizações Adicionais

### CC-7: Push Device Unregister — Atualização de Nome

| Campo | Antes (S4) | Depois (S5-E7c) |
|-------|------------|------------------|
| Nome da função | `unregisterPushDevice()` | `unregisterToken()` |
| Localização | `src/services/mobile.notification.service.ts` | `src/hooks/usePushSetup.ts:121-128` |
| Endpoint backend | (não documentado) | `DELETE /api/mobile/v1/devices` (body: `{ token }`) |
| Status | Parcial — não wired em logout | Parcial — não wired em logout (sem alteração) |

---

## Itens INFERIDO Restantes no Mapa (Trilha de Auditoria)

Todos os 5 `INFERIDO` restantes são marcadores históricos `INFERIDO→RESOLVIDO` de sprints anteriores (S4). Nenhum requer ação:

| Linha | Contexto | Tipo |
|-------|----------|------|
| 19 | Resumo S4: "2 INFERIDO→RESOLVIDO" | Contagem histórica |
| 521 | `proximo_a_expirar` tipo corrigido | Auditoria S4 |
| 1405 | Role-based menu gating implementado | Auditoria S4 |
| 1841 | CC-5: Token key alignment | Auditoria S4 |
| 1871 | CC-9: Notification config format | Auditoria S4 |

---

## Arquivos Modificados

| Arquivo | Ação |
|---------|------|
| `docs/generated/pipeline/S5-E2-mapa-regras-mobile.md` | Editado in-place (resolução de INFERIDOs + correção de role-gating) |
| `docs/generated/pipeline/S5-E7c-changelog-inferidos-mobile.md` | Criado (este arquivo) |

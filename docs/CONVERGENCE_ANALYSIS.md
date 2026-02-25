# CONVERGENCE_ANALYSIS.md — Cashback SaaS Mobile

> **Gerado em:** 2026-02-24
> **Prompt:** MOBILE_ANALYSIS_PROMPTS v4 — Fase 3 (Convergencia)
> **Inputs:**
>
> - `BACKEND_ANALYSIS.md` (cashback-backend) — 97 endpoints, 15 models, 21 dominios
> - `FRONTEND_ANALYSIS.md` (cashback-frontend) — 326 arquivos TS/TSX, 55 componentes, 29 paginas
> - `MOBILE_PILLARS_FRAMEWORK.md` (cashback-mobile) — 16 Pilares de Qualidade Mobile
>   **Objetivo:** Documento-ponte entre analise (Fases 1-2) e construcao (Fase 4)

---

## 1. Feature Matrix

> **Objetivo:** Cruzar todas as funcionalidades do sistema entre Backend, Frontend Web e Mobile alvo, identificando o que esta pronto, parcial ou faltante para cada plataforma.
>
> **Pilares referenciados:** Pilar 1 (Arquitetura), Pilar 2 (Navegacao), Pilar 4 (Rede/API), Pilar 9 (Nativo)

### Legenda de Status

| Simbolo  | Significado                                        |
| -------- | -------------------------------------------------- |
| OK       | Implementado e funcional                           |
| PARCIAL  | Implementado com lacunas ou adaptacoes necessarias |
| FALTANTE | Nao implementado, precisa ser construido           |
| N/A      | Nao aplicavel a esta plataforma                    |
| STUB     | Endpoint existe mas retorna 501 / nao funcional    |

### 1.1 Autenticacao e Seguranca

| #   | Feature                        | Backend                   | Frontend Web              | Mobile Consumidor                                 | Mobile Lojista                     | Pilares |
| --- | ------------------------------ | ------------------------- | ------------------------- | ------------------------------------------------- | ---------------------------------- | ------- |
| 1   | Login email + senha            | OK                        | OK (`LoginPage`)          | OK (endpoint `POST /api/mobile/v1/auth/login`)    | OK (reutiliza web)                 | P4, P5  |
| 2   | Registro — Lojista (CNPJ)      | OK                        | OK (`CadastroPage`)       | N/A                                               | OK (reutiliza web)                 | P4, P5  |
| 3   | Registro — Consumidor (CPF)    | OK                        | N/A                       | OK (endpoint `POST /api/mobile/v1/auth/register`) | N/A                                | P4, P5  |
| 4   | Logout                         | OK                        | OK (`authStore.logout`)   | OK (endpoint mobile)                              | OK (reutiliza web)                 | P5      |
| 5   | Refresh token JWT              | OK                        | OK (interceptor `api.ts`) | OK (endpoint mobile)                              | OK (reutiliza web)                 | P4, P5  |
| 6   | 2FA (TOTP)                     | OK (5 endpoints)          | OK (`SegurancaTab`)       | N/A                                               | PARCIAL (reutilizar endpoints web) | P5      |
| 7   | Multi-empresa (switch)         | OK (`switchEmpresa`)      | OK (`MultilojaPage`)      | N/A                                               | PARCIAL (reutilizar endpoints web) | P2, P5  |
| 8   | Forgot/Reset password — Web    | OK (2 endpoints)          | OK (`RecuperacaoPage`)    | N/A                                               | OK (reutiliza web)                 | P5      |
| 9   | Forgot/Reset password — Mobile | **FALTANTE**              | N/A                       | **FALTANTE** (gap #7.1.6)                         | N/A                                | P5      |
| 10  | OAuth (Google, Apple Sign-In)  | **STUB** (retorna 501)    | N/A                       | **FALTANTE** (bloqueante App Store)               | N/A                                | P5, P16 |
| 11  | Biometria (FaceID/TouchID)     | **FALTANTE** (gap #7.1.1) | N/A                       | **FALTANTE**                                      | N/A                                | P5, P9  |
| 12  | Gerenciamento de sessoes       | **FALTANTE** (gap #7.1.2) | N/A                       | **FALTANTE**                                      | N/A                                | P5      |
| 13  | Exclusao de conta (LGPD)       | **FALTANTE** (gap #7.1.8) | N/A                       | **FALTANTE** (requisito App Store)                | N/A                                | P5, P16 |
| 14  | Editar perfil do cliente       | **FALTANTE** (gap #7.1.5) | N/A                       | **FALTANTE**                                      | N/A                                | P5      |
| 15  | Alterar senha — Mobile         | **FALTANTE** (gap #7.1.5) | N/A                       | **FALTANTE**                                      | N/A                                | P5      |

### 1.2 Cashback — Operacoes Core

| #   | Feature                       | Backend                                   | Frontend Web                | Mobile Consumidor                                     | Mobile Lojista            | Pilares |
| --- | ----------------------------- | ----------------------------------------- | --------------------------- | ----------------------------------------------------- | ------------------------- | ------- |
| 16  | Gerar cashback (CPF + valor)  | OK (FEFO)                                 | OK (`GerarCashbackPage`)    | N/A                                                   | A CONSTRUIR (tela mobile) | P4, P6  |
| 17  | Utilizar cashback (FEFO)      | OK                                        | OK (`UtilizarCashbackPage`) | PARCIAL (gera QR, sem validacao)                      | A CONSTRUIR (tela mobile) | P4, P6  |
| 18  | Cancelar venda                | OK                                        | OK (via lista cashback)     | N/A                                                   | A CONSTRUIR               | P4      |
| 19  | Consultar saldo — Consumidor  | OK (endpoint mobile)                      | OK (`SaldoClientePage`)     | OK (endpoint `GET /api/mobile/v1/saldo`)              | N/A                       | P4      |
| 20  | Extrato — Consumidor (cursor) | OK (cursor-based)                         | OK (`ExtratoCashbackPage`)  | OK (endpoint mobile)                                  | N/A                       | P4, P7  |
| 21  | Historico de uso              | OK (via extrato)                          | OK (`HistoricoUsoPage`)     | A CONSTRUIR (tela mobile)                             | N/A                       | P6      |
| 22  | QR Code — Consumidor gera     | OK (endpoint mobile)                      | N/A                         | PARCIAL (token efemero, sem persistencia)             | N/A                       | P9      |
| 23  | QR Code — Lojista valida      | **FALTANTE** (gap #7.1.4)                 | N/A                         | N/A                                                   | **FALTANTE**              | P4, P9  |
| 24  | Saldo por empresa (breakdown) | OK (`por_empresa[]`)                      | OK (`SaldoClientePage`)     | A CONSTRUIR (tela mobile)                             | N/A                       | P6      |
| 25  | Alerta cashback expirando     | PARCIAL (command notifica, sem campo API) | PARCIAL (UI existe)         | **FALTANTE** (campo `proximo_a_expirar` — gap #7.2.2) | N/A                       | P10     |

### 1.3 Gestao — Lojista

| #   | Feature                  | Backend                  | Frontend Web                     | Mobile Consumidor    | Mobile Lojista                    | Pilares |
| --- | ------------------------ | ------------------------ | -------------------------------- | -------------------- | --------------------------------- | ------- |
| 26  | Dashboard stats          | OK (4 endpoints)         | OK (`DashboardPage`)             | N/A                  | A CONSTRUIR                       | P4, P6  |
| 27  | Listagem de clientes     | OK (paginado + search)   | OK (`ClientesPage`)              | N/A                  | A CONSTRUIR                       | P4      |
| 28  | CRUD clientes            | OK                       | OK (`ClientesPage`)              | N/A                  | PARCIAL (apenas leitura mobile)   | P4      |
| 29  | CRUD campanhas           | OK (5 endpoints)         | OK (`CampanhasPage`)             | N/A                  | A CONSTRUIR                       | P4      |
| 30  | Vendas (listagem)        | OK (via cashback index)  | OK (`VendasPage`)                | N/A                  | A CONSTRUIR                       | P4      |
| 31  | Relatorios               | OK (metricas calculadas) | OK (`RelatoriosPage`)            | N/A                  | PARCIAL (resumo simplificado)     | P4      |
| 32  | Configuracoes da empresa | OK (CRUD + logo upload)  | OK (`ConfiguracoesPage`, 8 tabs) | N/A                  | PARCIAL (apenas config essencial) | P4      |
| 33  | Usuarios internos CRUD   | OK (4 endpoints)         | OK (`UsuariosTab`)               | N/A                  | PARCIAL (apenas leitura)          | P4      |
| 34  | Unidades de negocio CRUD | OK (4 endpoints)         | OK (`UnidadeNegocioTab`)         | N/A                  | PARCIAL (apenas leitura)          | P4      |
| 35  | Contestacoes — Web       | OK (3 endpoints)         | OK (`ContestacoesPage`)          | N/A                  | A CONSTRUIR                       | P4      |
| 36  | Contestacoes — Mobile    | OK (2 endpoints mobile)  | N/A                              | OK (endpoint mobile) | N/A                               | P4      |
| 37  | Auditoria                | OK (paginado + export)   | OK (`AuditoriaPage`)             | N/A                  | N/A (apenas web)                  | P4      |

### 1.4 Financeiro e Assinaturas

| #   | Feature                   | Backend          | Frontend Web         | Mobile Consumidor | Mobile Lojista            | Pilares |
| --- | ------------------------- | ---------------- | -------------------- | ----------------- | ------------------------- | ------- |
| 38  | Planos disponiveis        | OK               | OK (`PagamentosTab`) | N/A               | PARCIAL (apenas consulta) | P4      |
| 39  | Minha assinatura          | OK               | OK (`PagamentosTab`) | N/A               | PARCIAL (status + alerta) | P4      |
| 40  | Upgrade de plano          | OK               | OK (`PagamentosTab`) | N/A               | N/A (apenas web)          | P4      |
| 41  | Faturas (listagem + link) | OK (3 endpoints) | OK (`PagamentosTab`) | N/A               | PARCIAL (apenas status)   | P4      |
| 42  | Webhooks StarkBank        | OK               | N/A                  | N/A               | N/A                       | P4      |

### 1.5 Notificacoes e Comunicacao

| #   | Feature                               | Backend                               | Frontend Web                                | Mobile Consumidor                  | Mobile Lojista     | Pilares |
| --- | ------------------------------------- | ------------------------------------- | ------------------------------------------- | ---------------------------------- | ------------------ | ------- |
| 43  | Push notification — Envio             | OK (PushChannel + DeviceToken)        | OK (`pushNotifications.ts` web)             | A CONSTRUIR (`expo-notifications`) | A CONSTRUIR        | P10     |
| 44  | Push notification — Device register   | OK (endpoint mobile)                  | N/A                                         | OK (endpoint `POST /devices`)      | N/A                | P10     |
| 45  | Notificacoes in-app (historico)       | **FALTANTE** (sem tabela, gap #7.1.3) | PARCIAL (`HeaderNotifications` placeholder) | **FALTANTE**                       | **FALTANTE**       | P10     |
| 46  | Marcar notificacao como lida          | **FALTANTE** (gap #7.1.3)             | N/A                                         | **FALTANTE**                       | N/A                | P10     |
| 47  | Preferencias de notificacao — Lojista | OK (2 endpoints)                      | OK (`NotificacoesTab`)                      | N/A                                | OK (reutiliza web) | P10     |
| 48  | Preferencias de notificacao — Cliente | **FALTANTE** (gap #7.1.7)             | N/A                                         | **FALTANTE**                       | N/A                | P10     |
| 49  | Config canais (email/sms/push)        | OK                                    | OK (`NotificacoesTab`)                      | N/A                                | OK (reutiliza web) | P10     |

### 1.6 LGPD e Compliance

| #   | Feature                              | Backend            | Frontend Web                       | Mobile Consumidor                   | Mobile Lojista            | Pilares |
| --- | ------------------------------------ | ------------------ | ---------------------------------- | ----------------------------------- | ------------------------- | ------- |
| 50  | Exportar dados pessoais              | OK (LGPD endpoint) | N/A (acao do proprietario via API) | **FALTANTE** (self-service mobile)  | OK (proprietario via web) | P5, P16 |
| 51  | Anonimizar cliente                   | OK (LGPD endpoint) | N/A                                | N/A                                 | OK (proprietario via web) | P5, P16 |
| 52  | Consentimentos (registrar/consultar) | OK (2 endpoints)   | N/A                                | A CONSTRUIR (tela de consentimento) | OK (via web)              | P5, P16 |
| 53  | Politica de privacidade in-app       | N/A                | N/A                                | **FALTANTE** (requisito App Store)  | N/A                       | P16     |

### 1.7 Funcionalidades Exclusivamente Mobile

| #   | Feature                       | Backend              | Frontend Web                  | Mobile Consumidor               | Mobile Lojista           | Pilares |
| --- | ----------------------------- | -------------------- | ----------------------------- | ------------------------------- | ------------------------ | ------- |
| 54  | Biometria (login rapido)      | **FALTANTE**         | N/A                           | **FALTANTE**                    | N/A                      | P5, P9  |
| 55  | QR Code (camera scan + gerar) | PARCIAL (gera token) | N/A                           | PARCIAL (gera QR)               | **FALTANTE** (valida QR) | P9      |
| 56  | Offline mode (dados em cache) | N/A                  | PARCIAL (React Query persist) | A CONSTRUIR (MMKV + RQ persist) | A CONSTRUIR              | P8      |
| 57  | Deep linking                  | N/A                  | N/A                           | **FALTANTE**                    | **FALTANTE**             | P2      |
| 58  | Haptic feedback               | N/A                  | N/A                           | **FALTANTE**                    | **FALTANTE**             | P6, P9  |
| 59  | Pull-to-refresh               | N/A                  | N/A                           | A CONSTRUIR                     | A CONSTRUIR              | P6      |
| 60  | Splash screen                 | N/A                  | N/A                           | A CONSTRUIR                     | A CONSTRUIR              | P16     |

### 1.8 Contagem Resumida

| Status                   | Consumidor | Lojista Mobile | Total |
| ------------------------ | ---------- | -------------- | ----- |
| **OK / Pronto**          | 8          | 12             | 20    |
| **PARCIAL**              | 3          | 10             | 13    |
| **FALTANTE (backend)**   | 10         | 3              | 13    |
| **A CONSTRUIR (mobile)** | 6          | 12             | 18    |
| **N/A**                  | 14         | 12             | 26    |
| **STUB**                 | 1          | 0              | 1     |

> **Ref Backend:** BACKEND_ANALYSIS.md — Secao 7 (Gap Analysis), Secao 1 (Inventario de Endpoints)
> **Ref Frontend:** FRONTEND_ANALYSIS.md — Secao 6 (Roteamento), Secao 5 (Fluxos de Tela)
> **Ref Pilares:** Pilar 4 (Rede/API), Pilar 5 (Auth/Seguranca), Pilar 9 (Nativo), Pilar 16 (App Stores)

---

## 2. API Readiness Report

> **Objetivo:** Avaliar a prontidao de cada endpoint do backend para consumo pelo app mobile, categorizando por status de prontidao e identificando ajustes necessarios.
>
> **Pilares referenciados:** Pilar 4 (Camada de Rede e API), Pilar 5 (Auth/Seguranca), Pilar 7 (Performance)

### 2.1 Endpoints Mobile Existentes — Prontos para Consumo

O backend ja possui 14 endpoints dedicados ao mobile sob o prefixo `/api/mobile/v1/`, usando o guard `api_mobile` (JWT para model `Cliente`).

| #   | Metodo | Rota                               | Funcao                         | Prontidao      | Ajuste Necessario                                   |
| --- | ------ | ---------------------------------- | ------------------------------ | -------------- | --------------------------------------------------- |
| 1   | POST   | `/api/mobile/v1/auth/register`     | Registro consumidor (CPF)      | OK             | —                                                   |
| 2   | POST   | `/api/mobile/v1/auth/login`        | Login consumidor               | OK             | —                                                   |
| 3   | POST   | `/api/mobile/v1/auth/refresh`      | Renovar JWT                    | OK             | —                                                   |
| 4   | POST   | `/api/mobile/v1/auth/logout`       | Logout consumidor              | OK             | —                                                   |
| 5   | GET    | `/api/mobile/v1/auth/me`           | Dados do cliente logado        | OK             | —                                                   |
| 6   | GET    | `/api/mobile/v1/saldo`             | Saldo total + por empresa      | PARCIAL        | Adicionar campo `proximo_a_expirar` (gap #7.2.2)    |
| 7   | GET    | `/api/mobile/v1/extrato`           | Extrato cursor-based           | PARCIAL        | Corrigir eager load de `empresa` (N+1 — gap #7.2.3) |
| 8   | GET    | `/api/mobile/v1/utilizacao/lojas`  | Lojas com cashback disponivel  | OK             | —                                                   |
| 9   | POST   | `/api/mobile/v1/utilizacao/qrcode` | Gerar QR code de utilizacao    | PARCIAL        | Token efemero sem persistencia (gap #7.2.4)         |
| 10  | POST   | `/api/mobile/v1/devices`           | Registrar device token (push)  | OK             | —                                                   |
| 11  | DELETE | `/api/mobile/v1/devices`           | Remover device token           | OK             | —                                                   |
| 12  | GET    | `/api/mobile/v1/contestacoes`      | Listar contestacoes do cliente | OK             | —                                                   |
| 13  | POST   | `/api/mobile/v1/contestacoes`      | Criar contestacao              | OK             | —                                                   |
| 14  | POST   | `/api/mobile/v1/auth/oauth`        | OAuth social login             | **STUB** (501) | Implementar Google + Apple Sign-In                  |

**Resumo:** 9 prontos, 3 parciais (ajustes de performance/dados), 1 stub, 1 N/A.

### 2.2 Endpoints Web Reutilizaveis pelo Mobile Lojista

O perfil Lojista no mobile reutilizara endpoints do guard `api` (JWT para model `Usuario`). Esses endpoints ja existem e sao consumidos pelo frontend web.

| #   | Dominio                                            | Endpoints | Rota Base                                        | Prontidao | Notas                                    |
| --- | -------------------------------------------------- | --------- | ------------------------------------------------ | --------- | ---------------------------------------- |
| 1   | Auth (login, register, refresh, logout, me)        | 5         | `/api/v1/auth/`                                  | OK        | Login unificado web/mobile lojista       |
| 2   | Auth 2FA (setup, confirm, verify, disable, backup) | 5         | `/api/v1/auth/2fa/`                              | OK        | Verificar UX 2FA em mobile               |
| 3   | Auth multi-empresa                                 | 1         | `/api/v1/auth/switch-empresa`                    | OK        | —                                        |
| 4   | Password reset                                     | 2         | `/api/v1/auth/forgot-password`, `reset-password` | OK        | —                                        |
| 5   | Cashback CRUD + cancelar                           | 5         | `/api/v1/cashback/`                              | OK        | Idempotency-Key necessario               |
| 6   | Saldo + extrato do cliente                         | 2         | `/api/v1/clientes/{id}/saldo`, `extrato`         | OK        | Offset-based (web)                       |
| 7   | Clientes CRUD                                      | 4         | `/api/v1/clientes/`                              | OK        | —                                        |
| 8   | Campanhas CRUD                                     | 5         | `/api/v1/campanhas/`                             | OK        | —                                        |
| 9   | Dashboard (stats, chart, transacoes, top)          | 4         | `/api/v1/dashboard/`                             | OK        | —                                        |
| 10  | Config (get, update, logo)                         | 3         | `/api/v1/config/`                                | OK        | Upload logo usa FormData                 |
| 11  | Usuarios internos                                  | 4         | `/api/v1/usuarios/`                              | OK        | Apenas para proprietario                 |
| 12  | Unidades de negocio                                | 4         | `/api/v1/unidades/`                              | OK        | Apenas para proprietario                 |
| 13  | Notificacoes config                                | 2         | `/api/v1/notificacoes/config`                    | OK        | —                                        |
| 14  | Faturas                                            | 3         | `/api/v1/faturas/`                               | OK        | Link pagamento usa URL externa           |
| 15  | Assinaturas                                        | 3         | `/api/v1/assinaturas/`                           | OK        | —                                        |
| 16  | Contestacoes web                                   | 3         | `/api/v1/contestacoes/`                          | OK        | —                                        |
| 17  | Auditoria                                          | 1         | `/api/v1/auditoria`                              | OK        | Export CSV/PDF (web-only)                |
| 18  | Relatorios                                         | 1         | `/api/v1/relatorios`                             | OK        | —                                        |
| 19  | Empresas do usuario                                | 1         | `/api/v1/empresas`                               | OK        | Para tela multiloja                      |
| 20  | LGPD                                               | 4         | `/api/v1/lgpd/customers/{id}/`                   | OK        | Requer `confirm.password` + `verify.2fa` |

**Total reutilizavel:** 62 endpoints web prontos para consumo pelo mobile lojista.

### 2.3 Endpoints FALTANTES — A Criar no Backend

Baseado no Gap Analysis do BACKEND_ANALYSIS.md (Secao 7.1), os seguintes endpoints precisam ser implementados antes do consumo mobile:

| #   | Prioridade  | Metodo + Rota                                    | Request Body                                            | Response                                                  | Sprint Alvo | Bloqueante?                  |
| --- | ----------- | ------------------------------------------------ | ------------------------------------------------------- | --------------------------------------------------------- | ----------- | ---------------------------- |
| 1   | **CRITICA** | `POST /api/mobile/v1/auth/forgot-password`       | `{ email }`                                             | 200: `{ success: true }`                                  | Sprint 1    | Sim — fluxo auth basico      |
| 2   | **CRITICA** | `POST /api/mobile/v1/auth/reset-password`        | `{ email, token, senha }`                               | 200: `{ success: true }`                                  | Sprint 1    | Sim — fluxo auth basico      |
| 3   | **CRITICA** | `PATCH /api/mobile/v1/auth/profile`              | `{ nome?, telefone?, email? }`                          | 200: `{ cliente: ClienteResource }`                       | Sprint 1    | Sim — perfil basico          |
| 4   | **CRITICA** | `PATCH /api/mobile/v1/auth/password`             | `{ senha_atual, nova_senha }`                           | 200: `{ success: true }`                                  | Sprint 1    | Sim — seguranca basica       |
| 5   | **CRITICA** | `POST /api/mobile/v1/auth/delete-account`        | `{ senha, motivo? }`                                    | 200: `{ success: true }`                                  | Sprint 1    | Sim — requisito Apple/Google |
| 6   | **ALTA**    | `POST /api/mobile/v1/auth/biometric/enroll`      | `{ biometric_token, device_id }`                        | 200: `{ enrolled: true }`                                 | Sprint 2    | Nao — login alternativo      |
| 7   | **ALTA**    | `POST /api/mobile/v1/auth/biometric/verify`      | `{ biometric_token, device_id }`                        | 200: `{ token, token_type, expires_in }`                  | Sprint 2    | Nao                          |
| 8   | **ALTA**    | `GET /api/mobile/v1/notifications`               | Query: `page?, limit?, unread_only?`                    | 200: `{ notifications[], meta: { total_unread } }`        | Sprint 2    | Nao — mas essencial UX       |
| 9   | **ALTA**    | `PATCH /api/mobile/v1/notifications/{id}/read`   | —                                                       | 200: `{ lida: true }`                                     | Sprint 2    | Nao                          |
| 10  | **ALTA**    | `POST /api/mobile/v1/notifications/read-all`     | —                                                       | 200: `{ updated: number }`                                | Sprint 2    | Nao                          |
| 11  | **ALTA**    | `POST /api/v1/qrcode/validate`                   | `{ qr_token }`                                          | 200: `{ cliente, valor, saldo, expira_em }`               | Sprint 3    | Sim — fluxo QR completo      |
| 12  | **MEDIA**   | `GET /api/mobile/v1/auth/sessions`               | —                                                       | 200: `{ sessions[] }`                                     | Sprint 3    | Nao                          |
| 13  | **MEDIA**   | `DELETE /api/mobile/v1/auth/sessions/{id}`       | —                                                       | 200: `{ revoked: true }`                                  | Sprint 3    | Nao                          |
| 14  | **MEDIA**   | `GET /api/mobile/v1/notifications/preferences`   | —                                                       | 200: `{ push_enabled, email_enabled, marketing_enabled }` | Sprint 2    | Nao                          |
| 15  | **MEDIA**   | `PATCH /api/mobile/v1/notifications/preferences` | `{ push_enabled?, email_enabled?, marketing_enabled? }` | 200: `{ atualizado: true }`                               | Sprint 2    | Nao                          |

**Total faltante:** 15 endpoints (5 criticos, 5 altos, 5 medios).

### 2.4 Ajustes em Endpoints Existentes

| #   | Endpoint                                | Ajuste                                                                                                       | Prioridade | Impacto                               |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------- |
| 1   | `GET /api/mobile/v1/saldo`              | Adicionar campo `proximo_a_expirar: { valor: number, quantidade: number }` com cashbacks expirando em 7 dias | Alta       | UX do dashboard mobile                |
| 2   | `GET /api/mobile/v1/extrato`            | Eager load `with('empresa')` no controller para evitar N+1 queries                                           | Alta       | Performance (Pilar 7)                 |
| 3   | `POST /api/mobile/v1/utilizacao/qrcode` | Persistir token em Redis com TTL (ex: 5 min); retornar `expira_em` ISO 8601                                  | Alta       | Seguranca do fluxo QR                 |
| 4   | `POST /api/mobile/v1/auth/oauth`        | Implementar Google Sign-In + Apple Sign-In (requisito Apple App Store)                                       | Critica    | Bloqueante para publicacao (Pilar 16) |
| 5   | Todos endpoints mobile                  | Verificar CORS para permitir origin do app mobile (se aplicavel)                                             | Media      | Configuracao                          |
| 6   | Respostas 4xx/5xx                       | Padronizar formato de erro: `{ status: false, error: { code, message, details? } }`                          | Media      | Consistencia (Pilar 4)                |

### 2.5 Infraestrutura de Backend para Mobile

| Componente                         | Status       | Acao Necessaria                              | Pilar  |
| ---------------------------------- | ------------ | -------------------------------------------- | ------ |
| Guard JWT `api_mobile`             | OK           | —                                            | P5     |
| Rate limiting por IP e por user    | OK           | Ajustar limites para mobile (burst maior)    | P4     |
| Cursor pagination (mobile extrato) | OK           | Expandir para outros endpoints mobile        | P7     |
| Push channel (PushChannel)         | OK           | Verificar integracao real FCM/APNs           | P10    |
| Tabela `device_tokens`             | OK           | —                                            | P10    |
| Tabela `notifications` (in-app)    | **FALTANTE** | Criar migration + model                      | P10    |
| Redis para QR tokens               | **FALTANTE** | Implementar storage com TTL                  | P4, P9 |
| CORS para mobile                   | PARCIAL      | Adicionar origins do app mobile              | P4     |
| Idempotency middleware             | OK           | Reutilizavel no mobile                       | P4     |
| ETag middleware                    | OK           | Importante para cache mobile (Pilar 8)       | P7, P8 |
| Security headers                   | OK           | Verificar compatibilidade com clients mobile | P5     |

### 2.6 Paginacao — Estrategia por Plataforma

| Contexto                              | Web (atual)              | Mobile (recomendado)   | Motivo                            |
| ------------------------------------- | ------------------------ | ---------------------- | --------------------------------- |
| Listagem geral (clientes, transacoes) | Offset (`page`, `limit`) | Cursor-based           | Performance + dados em tempo real |
| Extrato consumidor                    | Cursor-based             | Cursor-based (ja OK)   | —                                 |
| Dashboard top clientes                | Sem paginacao            | Sem paginacao (max 10) | Dataset pequeno                   |
| Auditoria                             | Offset + export          | N/A (web-only)         | —                                 |
| Notificacoes in-app                   | —                        | Cursor-based           | Feed cronologico                  |

> **Ref Backend:** BACKEND_ANALYSIS.md — Secao 1 (Inventario Completo), Secao 7 (Gap Analysis)
> **Ref Frontend:** FRONTEND_ANALYSIS.md — Secao 8 (Service Layer), Secao 7.3 (React Query Config)
> **Ref Pilares:** Pilar 4 (Rede/API — interceptors, retry, refresh), Pilar 7 (Performance — pagination, N+1)

---

## 3. Plano de Extracao — @cashback/shared

> **Objetivo:** Definir a estrutura, conteudo e estrategia de extracao do pacote compartilhado `@cashback/shared` no monorepo npm workspaces, reutilizavel entre web (React) e mobile (React Native + Expo).
>
> **Pilares referenciados:** Pilar 1 (Arquitetura — monorepo, separacao de responsabilidades), Pilar 3 (Estado — stores compartilhados), Pilar 15 (i18n — locales compartilhados)

### 3.1 Estrutura Proposta do Monorepo

```
cashback/                              ← raiz do monorepo
├── packages/
│   ├── shared/                        ← @cashback/shared
│   │   ├── src/
│   │   │   ├── types/                 # 15 arquivos (contratos de API)
│   │   │   ├── schemas/               # 6 arquivos (Zod puro)
│   │   │   ├── services/              # 15 services + apiClient factory
│   │   │   ├── stores/                # 5 stores Zustand (logica pura)
│   │   │   ├── utils/                 # 9 utils (validation, formatters, masks...)
│   │   │   ├── hooks/                 # 5 hooks (useDebounce, useDashboard...)
│   │   │   ├── i18n/
│   │   │   │   └── locales/           # pt-BR.json, en.json
│   │   │   └── index.ts              # Barrel export principal
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── web/                           ← cashback-frontend (existente)
│   └── mobile/                        ← cashback-mobile (novo)
├── package.json                       ← workspaces config
└── tsconfig.base.json                 ← config TypeScript compartilhada
```

### 3.2 Inventario de Extracao por Categoria

#### 3.2.1 Types — 15 arquivos (de 17 originais)

| Arquivo Origem (web)      | Destino (shared)          | Acao           | Notas                                                                                       |
| ------------------------- | ------------------------- | -------------- | ------------------------------------------------------------------------------------------- |
| `types/api.ts`            | `types/api.ts`            | Mover          | Contratos genericos: `ApiResponse<T>`, `PaginatedResponse<T>`, `CursorPaginatedResponse<T>` |
| `types/auth.ts`           | `types/auth.ts`           | Mover          | `Usuario`, `LoginRequest`, `LoginResponse`, type guards                                     |
| `types/cashback.ts`       | `types/cashback.ts`       | Mover + limpar | Remover tipos `@deprecated` (`Cashback`, `CashbackCreatePayload`)                           |
| `types/customer.ts`       | `types/customer.ts`       | Mover          | `Cliente`, `ClienteSaldo`, requests                                                         |
| `types/campaign.ts`       | `types/campaign.ts`       | Mover          | `Campanha`, `CampanhaStatus`, requests                                                      |
| `types/empresa.ts`        | `types/empresa.ts`        | Mover          | `Empresa`, `ModoSaldo`                                                                      |
| `types/dashboard.ts`      | `types/dashboard.ts`      | Mover + limpar | Remover view models web-specific                                                            |
| `types/assinatura.ts`     | `types/assinatura.ts`     | Mover          | `Plano`, `Assinatura`, `Fatura`                                                             |
| `types/contestacao.ts`    | `types/contestacao.ts`    | Mover          | `Contestacao`, status e tipos                                                               |
| `types/unidadeNegocio.ts` | `types/unidadeNegocio.ts` | Mover          | `UnidadeNegocio`, requests                                                                  |
| `types/usuarioInterno.ts` | `types/usuarioInterno.ts` | Mover          | `UsuarioInterno`, perfis                                                                    |
| `types/notificacao.ts`    | `types/notificacao.ts`    | Mover          | `NotificacaoConfig`, canais                                                                 |
| `types/auditLog.ts`       | `types/auditLog.ts`       | Mover          | `LogAuditoria`, acoes                                                                       |
| `types/extrato.ts`        | `types/extrato.ts`        | Mover          | `ExtratoEntry`, tipos                                                                       |
| `types/venda.ts`          | `types/venda.ts`          | Mover          | `Venda`, `VendaStatus`                                                                      |
| ~~`types/store.ts`~~      | —                         | **Remover**    | Legado: re-export `Empresa as Store`                                                        |
| ~~`types/index.ts`~~      | `types/index.ts`          | Recriar        | Barrel export limpo                                                                         |

**Tipos novos a criar para mobile:**

| Tipo                      | Arquivo                 | Descricao                                                        |
| ------------------------- | ----------------------- | ---------------------------------------------------------------- |
| `MobileNotification`      | `types/notification.ts` | `{ id, titulo, mensagem, tipo, lida, dados_extras, created_at }` |
| `BiometricEnrollRequest`  | `types/auth.ts`         | `{ biometric_token, device_id }`                                 |
| `DeviceSession`           | `types/auth.ts`         | `{ id, device_name, plataforma, last_active, current }`          |
| `QRCodeToken`             | `types/cashback.ts`     | `{ qr_token, cliente_id, empresa_id, valor, expira_em }`         |
| `NotificationPreferences` | `types/notification.ts` | `{ push_enabled, email_enabled, marketing_enabled }`             |

#### 3.2.2 Schemas Zod — 6 arquivos (100%)

| Arquivo Origem        | Destino               | Acao  | Dependencias             |
| --------------------- | --------------------- | ----- | ------------------------ |
| `schemas/auth.ts`     | `schemas/auth.ts`     | Mover | Zod puro                 |
| `schemas/campaign.ts` | `schemas/campaign.ts` | Mover | Zod puro                 |
| `schemas/cashback.ts` | `schemas/cashback.ts` | Mover | Zod + `utils/validation` |
| `schemas/company.ts`  | `schemas/company.ts`  | Mover | Zod + `utils/validation` |
| `schemas/profile.ts`  | `schemas/profile.ts`  | Mover | Zod puro                 |
| `schemas/user.ts`     | `schemas/user.ts`     | Mover | Zod puro                 |

**Schemas novos a criar para mobile:**

| Schema                  | Arquivo           | Campos                                |
| ----------------------- | ----------------- | ------------------------------------- |
| `mobileRegisterSchema`  | `schemas/auth.ts` | CPF + nome + email + telefone + senha |
| `biometricEnrollSchema` | `schemas/auth.ts` | biometric_token, device_id            |
| `deleteAccountSchema`   | `schemas/auth.ts` | senha, motivo?                        |

#### 3.2.3 Services — 15 arquivos de dominio

| Arquivo Origem                    | Destino                           | Acao  | Dependencia Web a Abstrair             |
| --------------------------------- | --------------------------------- | ----- | -------------------------------------- |
| `services/auth.service.ts`        | `services/auth.service.ts`        | Mover | Nenhuma                                |
| `services/cashback.service.ts`    | `services/cashback.service.ts`    | Mover | `crypto.randomUUID()` (funciona em RN) |
| `services/cliente.service.ts`     | `services/cliente.service.ts`     | Mover | Nenhuma                                |
| `services/campanha.service.ts`    | `services/campanha.service.ts`    | Mover | Nenhuma                                |
| `services/dashboard.service.ts`   | `services/dashboard.service.ts`   | Mover | Nenhuma                                |
| `services/empresa.service.ts`     | `services/empresa.service.ts`     | Mover | Nenhuma                                |
| `services/config.service.ts`      | `services/config.service.ts`      | Mover | FormData (funciona em RN)              |
| `services/contestacao.service.ts` | `services/contestacao.service.ts` | Mover | Nenhuma                                |
| `services/auditoria.service.ts`   | `services/auditoria.service.ts`   | Mover | Nenhuma                                |
| `services/assinatura.service.ts`  | `services/assinatura.service.ts`  | Mover | Nenhuma                                |
| `services/fatura.service.ts`      | `services/fatura.service.ts`      | Mover | Nenhuma                                |
| `services/notificacao.service.ts` | `services/notificacao.service.ts` | Mover | Nenhuma                                |
| `services/relatorio.service.ts`   | `services/relatorio.service.ts`   | Mover | Nenhuma                                |
| `services/unidade.service.ts`     | `services/unidade.service.ts`     | Mover | Nenhuma                                |
| `services/usuario.service.ts`     | `services/usuario.service.ts`     | Mover | Nenhuma                                |

**Services novos a criar para mobile:**

| Service                       | Arquivo                                   | Metodos                                                                                                                                                                     |
| ----------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mobile.auth.service`         | `services/mobile.auth.service.ts`         | `register`, `login`, `logout`, `refresh`, `me`, `forgotPassword`, `resetPassword`, `updateProfile`, `changePassword`, `deleteAccount`, `enrollBiometric`, `verifyBiometric` |
| `mobile.saldo.service`        | `services/mobile.saldo.service.ts`        | `getSaldo`, `getLojas`                                                                                                                                                      |
| `mobile.extrato.service`      | `services/mobile.extrato.service.ts`      | `getExtrato` (cursor-based)                                                                                                                                                 |
| `mobile.qrcode.service`       | `services/mobile.qrcode.service.ts`       | `gerarQRCode`, `validarQRCode` (lojista)                                                                                                                                    |
| `mobile.device.service`       | `services/mobile.device.service.ts`       | `registerDevice`, `unregisterDevice`                                                                                                                                        |
| `mobile.notification.service` | `services/mobile.notification.service.ts` | `getNotifications`, `markAsRead`, `markAllAsRead`, `getPreferences`, `updatePreferences`                                                                                    |

#### 3.2.4 API Client Factory — Abstraction Layer

A instancia Axios atual (`api.ts`) depende de DOM (`document.querySelector` para CSRF, `window.location` para redirect 402). Para compartilhar entre web e mobile, criar uma factory abstrata:

```typescript
// packages/shared/src/services/createApiClient.ts
interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  getToken: () => Promise<string | null>; // web: localStorage, mobile: SecureStore
  saveToken: (token: string) => Promise<void>;
  removeToken: () => Promise<void>;
  onUnauthorized: () => void; // web: redirect /login, mobile: navigate('Login')
  onSubscriptionInactive?: () => void; // web: redirect /configuracoes, mobile: alert
  onRateLimited?: (retryAfterMs: number) => void;
}
```

#### 3.2.5 Stores Zustand — 5 arquivos

| Store                 | Acao                | Adaptacao de Persistencia                        |
| --------------------- | ------------------- | ------------------------------------------------ |
| `authStore`           | Mover logica pura   | `localStorage` → interface `StorageAdapter`      |
| `multilojaStore`      | Mover logica pura   | `secureStorage` → interface `StorageAdapter`     |
| `subscriptionStore`   | Mover integralmente | Nenhuma dependencia de storage                   |
| `themeStore`          | Mover logica pura   | DOM `classList` → `useColorScheme()` via adapter |
| `unidadeNegocioStore` | Mover integralmente | Nenhuma dependencia de storage                   |

**Interface de persistencia:**

```typescript
// packages/shared/src/stores/storageAdapter.ts
export interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}
```

#### 3.2.6 Utils — 9 arquivos

| Arquivo                     | Destino                     | Dependencias                                         |
| --------------------------- | --------------------------- | ---------------------------------------------------- |
| `utils/validation.ts`       | `utils/validation.ts`       | Nenhuma                                              |
| `utils/formatters.ts`       | `utils/formatters.ts`       | Nenhuma (`Intl.NumberFormat`, `Intl.DateTimeFormat`) |
| `utils/masks.ts`            | `utils/masks.ts`            | Nenhuma                                              |
| `utils/errorMessages.ts`    | `utils/errorMessages.ts`    | Nenhuma                                              |
| `utils/error.utils.ts`      | `utils/error.utils.ts`      | Axios types                                          |
| `utils/optimisticUpdate.ts` | `utils/optimisticUpdate.ts` | React Query types                                    |
| `utils/asyncValidation.ts`  | `utils/asyncValidation.ts`  | Nenhuma                                              |
| `utils/rateLimiter.ts`      | `utils/rateLimiter.ts`      | Nenhuma (timestamps puros)                           |
| `utils/token.utils.ts`      | `utils/token.utils.ts`      | Refatorar para usar `StorageAdapter`                 |

#### 3.2.7 Hooks — 5 arquivos

| Hook                      | Destino                         | Notas                     |
| ------------------------- | ------------------------------- | ------------------------- |
| `useDebounce.ts`          | `hooks/useDebounce.ts`          | 100% compativel           |
| `useDashboard.ts`         | `hooks/useDashboard.ts`         | React Query hooks         |
| `useSimulatedLoading.ts`  | `hooks/useSimulatedLoading.ts`  | 100% compativel           |
| `useRecuperacaoWizard.ts` | `hooks/useRecuperacaoWizard.ts` | State machine pura        |
| `useCompanyLookups.ts`    | `hooks/useCompanyLookups.ts`    | APIs externas (CEP, CNPJ) |

#### 3.2.8 i18n Locales — 2 arquivos

| Arquivo                   | Destino                   | Notas                               |
| ------------------------- | ------------------------- | ----------------------------------- |
| `i18n/locales/pt-BR.json` | `i18n/locales/pt-BR.json` | ~253 chaves organizadas por dominio |
| `i18n/locales/en.json`    | `i18n/locales/en.json`    | ~252 chaves                         |

**Novas chaves a adicionar para mobile:**

- `mobile.biometric.*` — mensagens de biometria
- `mobile.qrcode.*` — mensagens de QR code
- `mobile.notifications.*` — central de notificacoes
- `mobile.permissions.*` — solicitacao de permissoes
- `mobile.offline.*` — mensagens de modo offline

### 3.3 Resumo Quantitativo

| Categoria    | Web (atual)               | Shared (extrair) | % Reuso  | Novos (mobile)     |
| ------------ | ------------------------- | ---------------- | -------- | ------------------ |
| Types        | 17                        | 15               | 88%      | +5 tipos           |
| Schemas      | 6                         | 6                | 100%     | +3 schemas         |
| Services     | 23 (15 dominio + 8 infra) | 15               | 65%      | +6 services mobile |
| Stores       | 5                         | 5                | 100%     | +1 adapter         |
| Utils        | 20                        | 9                | 45%      | —                  |
| Hooks        | 10                        | 5                | 50%      | —                  |
| i18n Locales | 2                         | 2                | 100%     | +5 namespaces      |
| **Total**    | **83**                    | **57**           | **~69%** | **+20 novos**      |

### 3.4 Dependencias do @cashback/shared

```json
{
  "name": "@cashback/shared",
  "dependencies": {
    "axios": "^1.6.0",
    "zod": "^4.3.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.14.0",
    "i18next": "^23.7.0"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  }
}
```

### 3.5 Ordem de Extracao (Sprint 0)

| Passo | Tarefa                                                                          | Dependencias          |
| ----- | ------------------------------------------------------------------------------- | --------------------- |
| 1     | Criar estrutura do monorepo (`package.json` workspaces, `tsconfig.base.json`)   | —                     |
| 2     | Extrair `types/` (15 arquivos)                                                  | —                     |
| 3     | Extrair `utils/` (9 arquivos) — validation, formatters, masks                   | types                 |
| 4     | Extrair `schemas/` (6 arquivos) — Zod schemas                                   | types, utils          |
| 5     | Criar `StorageAdapter` interface + `createApiClient` factory                    | types                 |
| 6     | Extrair `services/` (15 arquivos) + ajustar imports para usar `createApiClient` | types, apiClient      |
| 7     | Extrair `stores/` (5 arquivos) + middleware de persistencia                     | types, storageAdapter |
| 8     | Extrair `hooks/` (5 arquivos)                                                   | types, services       |
| 9     | Extrair `i18n/locales/` (2 arquivos)                                            | —                     |
| 10    | Atualizar imports no `cashback-frontend` para usar `@cashback/shared`           | Todos os passos acima |
| 11    | Verificar que build e testes do web continuam passando                          | Passo 10              |

> **Ref Frontend:** FRONTEND_ANALYSIS.md — Secao 2 (Inventario para @cashback/shared)
> **Ref Pilares:** Pilar 1 (Arquitetura — monorepo, barrel exports), Pilar 3 (Estado — stores compartilhados), Pilar 15 (i18n — locales compartilhados)

---

## 4. Design System Mobile

> **Objetivo:** Definir o design system nativo para React Native baseado nos tokens visuais existentes no frontend web, garantindo consistencia visual cross-platform.
>
> **Pilares referenciados:** Pilar 6 (UI/UX e Design System), Pilar 14 (Acessibilidade)

### 4.1 Mapeamento de Tokens Visuais

#### 4.1.1 Cores — Objeto de Tema TypeScript

Os tokens de cor do web (CSS Variables em `themes.ts`) serao convertidos para um objeto TS puro em `@cashback/shared/src/theme/tokens.ts`:

| Token Web (CSS Variable) | Token Mobile (TS)           | Light     | Dark      |
| ------------------------ | --------------------------- | --------- | --------- |
| `--bg-default`           | `colors.background.default` | `#FFFFFF` | `#0A0A0A` |
| `--bg-surface`           | `colors.background.surface` | `#F8F9FA` | `#1A1A1A` |
| `--bg-hover`             | `colors.background.hover`   | `#F1F3F5` | `#2A2A2A` |
| `--text-primary`         | `colors.text.primary`       | `#1A1A1A` | `#FFFFFF` |
| `--text-secondary`       | `colors.text.secondary`     | `#6B7280` | `#A1A1A1` |
| `--text-disabled`        | `colors.text.disabled`      | `#9CA3AF` | `#717171` |
| `--border-default`       | `colors.border.default`     | `#E5E7EB` | `#272727` |
| `--border-hover`         | `colors.border.hover`       | `#D1D5DB` | `#3F3F46` |
| `--primary-500`          | `colors.primary.main`       | `#22C55E` | `#22C55E` |
| `--primary-600`          | `colors.primary.dark`       | `#16A34A` | `#4ADE80` |
| `--primary-50`           | `colors.primary.surface`    | `#F0FDF4` | `#14532D` |
| `--success-500`          | `colors.semantic.success`   | `#22C55E` | `#22C55E` |
| `--error-500`            | `colors.semantic.error`     | `#EF4444` | `#EF4444` |
| `--warning-500`          | `colors.semantic.warning`   | `#F59E0B` | `#F59E0B` |
| `--info-500`             | `colors.semantic.info`      | `#3B82F6` | `#3B82F6` |

**Cores de status de cashback:**

| Status               | Token                        | Cor       |
| -------------------- | ---------------------------- | --------- |
| Creditado/Confirmado | `colors.cashback.credited`   | `#10B981` |
| Pendente             | `colors.cashback.pending`    | `#F59E0B` |
| Resgatado/Utilizado  | `colors.cashback.redeemed`   | `#6366F1` |
| Expirado             | `colors.cashback.expired`    | `#EF4444` |
| Processando          | `colors.cashback.processing` | `#3B82F6` |

#### 4.1.2 Tipografia

| Token Web     | Token Mobile            | Tamanho (dp) | Line Height | Peso           | Uso                  |
| ------------- | ----------------------- | ------------ | ----------- | -------------- | -------------------- |
| `page-title`  | `typography.pageTitle`  | 24           | 32          | 700 (Bold)     | Titulos de tela      |
| `value-card`  | `typography.valueCard`  | 30           | 36          | 700 (Bold)     | Valores em cards     |
| `value-table` | `typography.valueTable` | 16           | 24          | 700 (Bold)     | Valores em listas    |
| `label`       | `typography.label`      | 12           | 16          | 600 (SemiBold) | Labels de formulario |
| `body`        | `typography.body`       | 14           | 20          | 500 (Medium)   | Texto corpo          |
| `caption`     | `typography.caption`    | 12           | 16          | 400 (Regular)  | Texto auxiliar       |
| `badge`       | `typography.badge`      | 10           | 14          | 700 (Bold)     | Badges               |

**Fontes:**

- **Sans:** DM Sans → carregar via `expo-font` com `useFonts()`
- **Mono:** Space Mono → carregar via `expo-font` (valores monetarios)

#### 4.1.3 Espacamento

Escala baseada em multiplos de 4dp (alinhado com Material Design e Apple HIG):

| Token          | Valor (dp) | Uso                                |
| -------------- | ---------- | ---------------------------------- |
| `spacing.xs`   | 4          | Gaps minimos                       |
| `spacing.sm`   | 8          | Padding interno de badges          |
| `spacing.md`   | 12         | Espacamento entre elementos        |
| `spacing.base` | 16         | Padding padrao                     |
| `spacing.lg`   | 24         | Padding de cards (= `card` no web) |
| `spacing.xl`   | 32         | Separacao de secoes                |
| `spacing.xxl`  | 48         | Margens de tela                    |

#### 4.1.4 Border Radius

| Token Web          | Token Mobile             | Valor           |
| ------------------ | ------------------------ | --------------- |
| `container` (16px) | `borderRadius.container` | 16              |
| `button` (12px)    | `borderRadius.button`    | 12              |
| `badge` (8px)      | `borderRadius.badge`     | 8               |
| `checkbox` (4px)   | `borderRadius.checkbox`  | 4               |
| —                  | `borderRadius.full`      | 9999 (circular) |

#### 4.1.5 Sombras (Platform-Specific)

| Token Web    | iOS (shadow\*)                                                | Android (elevation) |
| ------------ | ------------------------------------------------------------- | ------------------- |
| `card`       | `shadowOffset: {0, 4}, shadowOpacity: 0.1, shadowRadius: 8`   | `elevation: 4`      |
| `card-hover` | `shadowOffset: {0, 8}, shadowOpacity: 0.12, shadowRadius: 16` | `elevation: 8`      |
| `fab`        | `shadowOffset: {0, 4}, shadowOpacity: 0.15, shadowRadius: 10` | `elevation: 6`      |
| `toast`      | `shadowOffset: {0, 8}, shadowOpacity: 0.25, shadowRadius: 24` | `elevation: 12`     |

### 4.2 Componentes Base — Mapeamento Web → Mobile

| Componente Web | Componente Mobile   | Biblioteca RN                       | Touch Target | Notas                                                 |
| -------------- | ------------------- | ----------------------------------- | ------------ | ----------------------------------------------------- |
| `Button`       | `Button`            | `Pressable` + `Reanimated`          | 48x48dp min  | Variantes: primary, secondary, outline, ghost, danger |
| `Input`        | `TextInput`         | `TextInput` nativo                  | 48dp height  | Suporte a mascaras (`react-native-mask-input`)        |
| `Select`       | `BottomSheetSelect` | `@gorhom/bottom-sheet`              | 48dp         | Bottom sheet ao inves de dropdown                     |
| `Card`         | `Card`              | `View` + sombra                     | —            | Composicao: `Card.Header`, `Card.Content`             |
| `Modal`        | `BottomSheet`       | `@gorhom/bottom-sheet`              | —            | Preferir bottom sheet sobre modal                     |
| `Badge`        | `Badge`             | `View` + `Text`                     | —            | Cores semanticas                                      |
| `Loading`      | `Loading`           | `ActivityIndicator`                 | —            | Variantes: inline, fullscreen                         |
| `FAB`          | `FAB`               | `Pressable` + absolute              | 56x56dp      | Posicao fixa bottom-right                             |
| `Toast`        | `Toast`             | `react-native-toast-message`        | —            | Configuracao global                                   |
| `Skeleton`     | `Skeleton`          | `react-native-skeleton-placeholder` | —            | Usado em loading states                               |
| `EmptyState`   | `EmptyState`        | `View` + `Text` + `Image`           | —            | Ilustracao + mensagem + acao                          |
| —              | `BottomTabBar`      | `@react-navigation/bottom-tabs`     | 48dp por tab | Novo — navegacao principal                            |
| —              | `PullToRefresh`     | `RefreshControl`                    | —            | Novo — refresh em listas                              |
| —              | `SwipeAction`       | `react-native-gesture-handler`      | —            | Novo — swipe em listas                                |

### 4.3 Componentes Mobile-Only (Novos)

| Componente          | Descricao                                              | Biblioteca                        | Pilar |
| ------------------- | ------------------------------------------------------ | --------------------------------- | ----- |
| `BiometricPrompt`   | UI de prompt biometrico nativo                         | `expo-local-authentication`       | P9    |
| `QRCodeScanner`     | Camera com overlay para scan QR                        | `expo-camera`                     | P9    |
| `QRCodeDisplay`     | Exibicao de QR code gerado                             | `react-native-qrcode-svg`         | P9    |
| `OfflineBadge`      | Indicador de modo offline                              | `@react-native-community/netinfo` | P8    |
| `CashbackTimeline`  | Timeline visual de extrato                             | Custom (FlatList + icones)        | P6    |
| `SaldoCard`         | Card de saldo com breakdown por empresa                | Custom                            | P6    |
| `NotificationBell`  | Sino com badge de unread count                         | Custom                            | P10   |
| `PermissionRequest` | Tela de solicitacao de permissao (camera, notificacao) | Custom + `expo-*`                 | P9    |

### 4.4 Dark Mode — Estrategia Mobile

| Aspecto      | Web (atual)                                         | Mobile (proposto)                                  |
| ------------ | --------------------------------------------------- | -------------------------------------------------- |
| Deteccao     | `window.matchMedia('(prefers-color-scheme: dark)')` | `Appearance.getColorScheme()` + `useColorScheme()` |
| Toggle       | CSS class `dark` no `<html>`                        | `ThemeContext` com `useContext()`                  |
| Persistencia | `localStorage`                                      | MMKV (`react-native-mmkv`)                         |
| Tokens       | CSS Variables                                       | Objeto TS `lightTheme` / `darkTheme`               |
| Transicao    | Instantanea (CSS)                                   | `Animated` fade (opcional)                         |

> **Ref Frontend:** FRONTEND_ANALYSIS.md — Secao 3 (Design System), Secao 4 (Tema e Tokens)
> **Ref Pilares:** Pilar 6 (UI/UX — touch targets 44pt+, skeletons, empty states, pull-to-refresh), Pilar 14 (Acessibilidade — labels, contraste 4.5:1)

---

## 5. Mapeamento de Navegacao

> **Objetivo:** Traduzir a estrutura de rotas do frontend web (React Router) para a navegacao mobile (React Navigation), definindo stacks, tabs e fluxos por perfil.
>
> **Pilares referenciados:** Pilar 2 (Navegacao e Roteamento), Pilar 5 (Auth — guards)

### 5.1 Arquitetura de Navegacao

```
NavigationContainer
├── AuthStack (nao autenticado)
│   ├── LoginScreen
│   ├── RegisterScreen (Consumidor: CPF | Lojista: CNPJ)
│   ├── ForgotPasswordScreen (wizard 4 steps)
│   └── OnboardingScreen (primeiro acesso)
│
├── ConsumerTabs (consumidor autenticado — guard api_mobile)
│   ├── HomeTab (DashboardClienteScreen)
│   │   └── Stack: SaldoDetailScreen, ExtratoScreen, HistoricoScreen
│   ├── QRCodeTab (gerar QR para resgate)
│   ├── NotificationsTab (central de notificacoes)
│   └── ProfileTab (perfil, seguranca, preferencias)
│       └── Stack: EditProfileScreen, ChangePasswordScreen, SessionsScreen
│
└── MerchantTabs (lojista autenticado — guard api)
    ├── DashboardTab (DashboardScreen)
    │   └── Stack: ChartDetailScreen
    ├── CashbackTab (gerar + utilizar)
    │   └── Stack: GerarCashbackScreen, UtilizarCashbackScreen, QRScanScreen
    ├── ClientesTab (listagem + detalhe)
    │   └── Stack: ClienteDetailScreen, ClienteExtratoScreen
    └── MoreTab (menu expandido)
        └── Stack: CampanhasScreen, VendasScreen, ContestacaoScreen, ConfigScreen
```

### 5.2 Mapeamento de Rotas Web → Mobile

| Rota Web             | Tela Mobile               | Navigator         | Perfil     | Guard Web                   | Guard Mobile |
| -------------------- | ------------------------- | ----------------- | ---------- | --------------------------- | ------------ |
| `/login`             | `LoginScreen`             | AuthStack         | Ambos      | Publico                     | Publico      |
| `/cadastro`          | `RegisterScreen`          | AuthStack         | Ambos      | Publico                     | Publico      |
| `/recuperacao`       | `ForgotPasswordScreen`    | AuthStack         | Ambos      | Publico                     | Publico      |
| `/multiloja`         | `MultilojaScreen` (modal) | Overlay           | Lojista    | ProtectedRoute              | Auth guard   |
| `/`                  | `DashboardScreen`         | MerchantTabs      | Lojista    | ProtectedRoute              | Auth guard   |
| `/gerar-cashback`    | `GerarCashbackScreen`     | CashbackTab Stack | Lojista    | ProtectedRoute + HideWhenUN | Auth guard   |
| `/utilizar-cashback` | `UtilizarCashbackScreen`  | CashbackTab Stack | Lojista    | ProtectedRoute + HideWhenUN | Auth guard   |
| `/campanhas`         | `CampanhasScreen`         | MoreTab Stack     | Lojista    | ProtectedRoute              | Auth guard   |
| `/clientes`          | `ClientesScreen`          | ClientesTab       | Lojista    | ProtectedRoute              | Auth guard   |
| `/vendas`            | `VendasScreen`            | MoreTab Stack     | Lojista    | ProtectedRoute              | Auth guard   |
| `/relatorios`        | `RelatoriosScreen`        | MoreTab Stack     | Lojista    | ProtectedRoute              | Auth guard   |
| `/configuracoes`     | `ConfigScreen`            | MoreTab Stack     | Lojista    | ProtectedRoute              | Auth guard   |
| `/contestacoes`      | `ContestacaoScreen`       | MoreTab Stack     | Lojista    | ProtectedRoute              | Auth guard   |
| `/auditoria`         | N/A (web-only)            | —                 | —          | —                           | —            |
| `/cliente`           | `HomeScreen`              | ConsumerTabs      | Consumidor | ProtectedRoute              | Auth guard   |
| `/cliente/saldo`     | `SaldoDetailScreen`       | HomeTab Stack     | Consumidor | ProtectedRoute              | Auth guard   |
| `/cliente/extrato`   | `ExtratoScreen`           | HomeTab Stack     | Consumidor | ProtectedRoute              | Auth guard   |
| `/cliente/historico` | `HistoricoScreen`         | HomeTab Stack     | Consumidor | ProtectedRoute              | Auth guard   |

### 5.3 Bottom Tab Configuration

#### Consumidor (4 tabs)

| Tab          | Icone     | Label    | Tela Raiz                | Badge        |
| ------------ | --------- | -------- | ------------------------ | ------------ |
| Home         | `home`    | Inicio   | `DashboardClienteScreen` | —            |
| QR Code      | `qr-code` | Resgatar | `QRCodeScreen`           | —            |
| Notificacoes | `bell`    | Avisos   | `NotificationsScreen`    | Unread count |
| Perfil       | `user`    | Perfil   | `ProfileScreen`          | —            |

#### Lojista (4 tabs)

| Tab       | Icone              | Label     | Tela Raiz            | Badge               |
| --------- | ------------------ | --------- | -------------------- | ------------------- |
| Dashboard | `layout-dashboard` | Dashboard | `DashboardScreen`    | —                   |
| Cashback  | `coins`            | Cashback  | `CashbackMenuScreen` | —                   |
| Clientes  | `users`            | Clientes  | `ClientesScreen`     | —                   |
| Mais      | `menu`             | Mais      | `MoreMenuScreen`     | Notificacoes unread |

### 5.4 Deep Linking

| Path                | Tela                       | Parametros      | Exemplo                                     |
| ------------------- | -------------------------- | --------------- | ------------------------------------------- |
| `/cliente/saldo`    | `SaldoDetailScreen`        | —               | `h4cashback://cliente/saldo`                |
| `/cliente/extrato`  | `ExtratoScreen`            | `?empresa_id=X` | `h4cashback://cliente/extrato?empresa_id=1` |
| `/cashback/:id`     | `CashbackDetailScreen`     | `id`            | `h4cashback://cashback/123`                 |
| `/notification/:id` | `NotificationDetailScreen` | `id`            | Via push notification tap                   |

### 5.5 Transicoes e Animacoes de Navegacao

| Tipo           | Animacao                                | Biblioteca                         |
| -------------- | --------------------------------------- | ---------------------------------- |
| Stack push     | Slide from right (iOS) / Fade (Android) | React Navigation default           |
| Tab switch     | None (instant)                          | React Navigation default           |
| Modal          | Slide from bottom                       | `presentation: 'modal'`            |
| Bottom sheet   | Spring animation                        | `@gorhom/bottom-sheet`             |
| Shared element | Fade + scale                            | `react-native-reanimated` (futuro) |

> **Ref Frontend:** FRONTEND_ANALYSIS.md — Secao 5 (Fluxos de Tela), Secao 6 (Roteamento e Navegacao)
> **Ref Pilares:** Pilar 2 (Navegacao — stacks, tabs, deep links, guards, back button)

---

## 6. Plano de Migracao de Estado

> **Objetivo:** Definir como os 5 stores Zustand e a configuracao React Query do frontend web serao adaptados para o mobile.
>
> **Pilares referenciados:** Pilar 3 (Gerenciamento de Estado), Pilar 8 (Persistencia e Offline)

### 6.1 Zustand Stores — Adaptacoes

| Store                 | Compartilhavel               | Adaptacao Web → Mobile                                             | Prioridade |
| --------------------- | ---------------------------- | ------------------------------------------------------------------ | ---------- |
| `authStore`           | Sim (via `@cashback/shared`) | `localStorage` → `expo-secure-store` (tokens); `MMKV` (flags)      | Sprint 0   |
| `multilojaStore`      | Sim                          | `secureStorage` (AES-GCM web) → `expo-secure-store`                | Sprint 0   |
| `subscriptionStore`   | Sim (sem adaptacao)          | Nenhuma dependencia de platform                                    | Sprint 0   |
| `themeStore`          | Parcial                      | DOM `classList.add('dark')` → `Appearance.setColorScheme()` + MMKV | Sprint 0   |
| `unidadeNegocioStore` | Sim (sem adaptacao)          | Nenhuma dependencia de platform                                    | Sprint 0   |

### 6.2 Stores Novos — Mobile-Only

| Store               | Estado                                                    | Metodos                                                      | Persistencia |
| ------------------- | --------------------------------------------------------- | ------------------------------------------------------------ | ------------ |
| `deviceStore`       | `{ deviceId, pushToken, plataforma, biometricAvailable }` | `registerDevice()`, `unregisterDevice()`, `checkBiometric()` | MMKV         |
| `notificationStore` | `{ unreadCount, preferences }`                            | `setUnreadCount()`, `updatePreferences()`                    | MMKV         |
| `connectivityStore` | `{ isOnline, connectionType }`                            | `setOnline()`, `setConnectionType()`                         | Em memoria   |

### 6.3 React Query — Configuracao Mobile

| Parametro              | Web (atual)                                         | Mobile (proposto)                                  | Motivo                            |
| ---------------------- | --------------------------------------------------- | -------------------------------------------------- | --------------------------------- |
| `staleTime`            | 60s                                                 | 60s (manter)                                       | Consistente entre plataformas     |
| `gcTime`               | 10 min                                              | 15 min                                             | Mobile tem mais restricao de rede |
| `refetchOnWindowFocus` | false                                               | N/A                                                | Usar `AppState` change listener   |
| `retry`                | 3x (exceto 4xx)                                     | 3x (exceto 4xx)                                    | Manter                            |
| `retryDelay`           | exponential(1s, max 30s)                            | exponential(1s, max 30s)                           | Manter                            |
| Persistencia           | `localStorage` (24h, exclui PII)                    | MMKV via `@tanstack/query-async-storage-persister` | Mais rapido que AsyncStorage      |
| Refetch trigger        | `window.focus`                                      | `AppState.change` (background → active)            | Equivalente mobile                |
| Cache exclusions       | dashboard, cashback, customers, transactions, stats | Manter mesmas exclusoes (PCI-DSS)                  | Consistencia                      |

### 6.4 Fluxo de Hidratacao Mobile

```
App Start
├─ 1. MMKV: restaurar themeStore (dark/light)
├─ 2. SecureStore: obter JWT token
├─ 3. Se token existe:
│   ├─ 3a. authStore.initAuth() → GET /auth/me
│   ├─ 3b. multilojaStore.hydrate() → restaurar empresa selecionada
│   ├─ 3c. subscriptionStore.hydrate() → verificar assinatura
│   ├─ 3d. React Query: restaurar cache do MMKV
│   └─ 3e. Navegar para ConsumerTabs ou MerchantTabs
└─ 4. Se token nao existe:
    └─ 4a. Navegar para AuthStack (LoginScreen)
```

### 6.5 Orquestracao de Side-Effects

O `authOrchestrator.ts` do web sera adaptado para mobile com ajustes:

| Evento            | Web (atual)                   | Mobile (proposto)                                                                |
| ----------------- | ----------------------------- | -------------------------------------------------------------------------------- |
| `onLoginSuccess`  | Sync multiloja + subscription | + registrar device push token + check biometric                                  |
| `onLogout`        | Limpar stores + token         | + unregister device token + limpar MMKV + limpar SecureStore + reset React Query |
| `onTokenRefresh`  | Salvar novo token             | Salvar em SecureStore (nao MMKV)                                                 |
| `onAppBackground` | N/A                           | Mascarar dados sensiveis na tela                                                 |
| `onAppForeground` | N/A                           | Refetch queries stale + verificar auth                                           |

> **Ref Frontend:** FRONTEND_ANALYSIS.md — Secao 7 (Gerenciamento de Estado)
> **Ref Pilares:** Pilar 3 (Estado — Zustand + React Query, selectors, optimistic), Pilar 8 (Persistencia — MMKV, stale-while-revalidate)

---

## 7. Plano de Migracao da Service Layer

> **Objetivo:** Definir como a camada de servicos HTTP (Axios + interceptors) sera adaptada do web para o mobile.
>
> **Pilares referenciados:** Pilar 4 (Camada de Rede e API), Pilar 8 (Offline)

### 7.1 Axios Instance — Web vs Mobile

| Aspecto           | Web (`api.ts` atual)                                 | Mobile (proposto)                                |
| ----------------- | ---------------------------------------------------- | ------------------------------------------------ |
| `baseURL`         | `VITE_API_URL` ou `localhost:4000`                   | `expo-constants` por ambiente (dev/staging/prod) |
| `timeout`         | 15s                                                  | 15s (normal), 60s (uploads)                      |
| `withCredentials` | true (httpOnly cookies)                              | false (JWT em header apenas)                     |
| Token injection   | `obterToken()` → `localStorage`                      | `obterToken()` → `expo-secure-store`             |
| CSRF token        | `document.querySelector('meta[name="csrf-token"]')`  | N/A (mobile nao usa CSRF)                        |
| XSS sanitization  | `DOMPurify` em response interceptor                  | N/A (RN nao tem DOM)                             |
| 401 refresh       | `POST /auth/refresh` → retry original                | Manter logica, adaptar storage                   |
| 402 redirect      | `window.location.href = '/configuracoes'`            | `navigation.navigate('Config')`                  |
| Rate limiting     | `apiRateLimiter` (60/min), `authRateLimiter` (5/min) | Reutilizar de `@cashback/shared`                 |
| Abort controller  | `createAbortSignal()`                                | Reutilizar (funciona em RN)                      |

### 7.2 Interceptors Mobile

#### Request Interceptor

```
1. Rate limiting (reutilizar rateLimiter de @cashback/shared)
2. JWT injection (expo-secure-store ao inves de localStorage)
3. Correlation ID (gerar UUID para tracing)
4. Accept-Language (expo-localization)
```

#### Response Interceptor

```
1. 401 → Refresh token (expo-secure-store)
   └─ Se refresh falhar → authStore.logout() → navigate('Login')
2. 402 → Alert + navigate('Config')
3. 429 → Retry com backoff (respeitar Retry-After header)
4. Network error → Enfileirar acao (offline queue) ou mostrar OfflineBadge
5. userMessage → Anexar mensagem amigavel em pt-BR
```

### 7.3 Services de Dominio — Reutilizacao

Os 15 services de dominio do web serao reutilizados integralmente via `@cashback/shared`. Nenhum depende de APIs web-only:

| Service                  | Reutilizacao | Teste                                |
| ------------------------ | ------------ | ------------------------------------ |
| `auth.service.ts`        | 100%         | Endpoints `/api/v1/auth/*`           |
| `cashback.service.ts`    | 100%         | `crypto.randomUUID()` funciona em RN |
| `cliente.service.ts`     | 100%         | —                                    |
| `campanha.service.ts`    | 100%         | —                                    |
| `dashboard.service.ts`   | 100%         | —                                    |
| `empresa.service.ts`     | 100%         | —                                    |
| `config.service.ts`      | 100%         | FormData funciona em RN              |
| `contestacao.service.ts` | 100%         | —                                    |
| `auditoria.service.ts`   | 100%         | —                                    |
| `assinatura.service.ts`  | 100%         | —                                    |
| `fatura.service.ts`      | 100%         | —                                    |
| `notificacao.service.ts` | 100%         | —                                    |
| `relatorio.service.ts`   | 100%         | —                                    |
| `unidade.service.ts`     | 100%         | —                                    |
| `usuario.service.ts`     | 100%         | —                                    |

### 7.4 Services Mobile-Only (Infra)

| Service                      | Funcao                                                  | Biblioteca                                   |
| ---------------------------- | ------------------------------------------------------- | -------------------------------------------- |
| `mobileApiClient.ts`         | Instancia Axios mobile com interceptors adaptados       | Axios + expo-secure-store                    |
| `pushNotificationService.ts` | Registro token, handle foreground/background, tap       | `expo-notifications`                         |
| `biometricService.ts`        | Verificar suporte, autenticar, vincular device          | `expo-local-authentication`                  |
| `connectivityService.ts`     | Monitorar status de rede + tipo de conexao              | `@react-native-community/netinfo`            |
| `secureStorageService.ts`    | Wrapper para expo-secure-store (tokens, biometric keys) | `expo-secure-store`                          |
| `cacheService.ts`            | Wrapper para MMKV (preferencias, cache nao-sensivel)    | `react-native-mmkv`                          |
| `errorReportingService.ts`   | Sentry para React Native                                | `@sentry/react-native`                       |
| `analyticsService.ts`        | Tracking de eventos de negocio                          | [A DEFINIR — amplitude, mixpanel, ou custom] |

### 7.5 Offline Queue

Para operacoes que podem ser enfileiradas quando offline (Pilar 8):

| Operacao          | Enfileiravel? | Motivo                                  |
| ----------------- | ------------- | --------------------------------------- |
| Gerar cashback    | **Sim**       | Lojista pode registrar venda offline    |
| Utilizar cashback | **Nao**       | Requer validacao de saldo em tempo real |
| Criar contestacao | **Sim**       | Nao e time-sensitive                    |
| Editar perfil     | **Sim**       | Dados nao-criticos                      |
| Login/Logout      | **Nao**       | Requer rede                             |
| QR Code           | **Nao**       | Requer token do servidor                |

> **Ref Frontend:** FRONTEND_ANALYSIS.md — Secao 8 (Service Layer), `api.ts` interceptors
> **Ref Backend:** BACKEND_ANALYSIS.md — Secao 3.6 (CORS), Secao 6.5 (Rate Limiting), Secao 6.9 (ETag)
> **Ref Pilares:** Pilar 4 (Rede — interceptors, retry, cancel, rate limit), Pilar 8 (Offline — queue, cache)

---

## 8. Plano de Migracao de Testes

> **Objetivo:** Definir a estrategia de testes para o app mobile, reutilizando o maximo possivel da infraestrutura de testes do frontend web.
>
> **Pilares referenciados:** Pilar 11 (Testes e Qualidade)

### 8.1 Infraestrutura de Testes — Web vs Mobile

| Aspecto        | Web (atual)                        | Mobile (proposto)                            |
| -------------- | ---------------------------------- | -------------------------------------------- |
| Test runner    | Vitest 4.0.18                      | Jest (padrao Expo/RN)                        |
| Renderizacao   | @testing-library/react 16.3.2      | @testing-library/react-native                |
| Interacao      | @testing-library/user-event 14.6.1 | `fireEvent` de @testing-library/react-native |
| DOM virtual    | jsdom 28.1.0                       | N/A (RN nao usa DOM)                         |
| Mock HTTP      | MSW 2.12.10                        | MSW (compativel com RN) ou mock manual       |
| Acessibilidade | axe-core                           | Testes manuais + `accessibilityLabel` checks |
| Cobertura      | vitest --coverage                  | jest --coverage                              |
| Storybook      | @storybook/react 8.6.17            | @storybook/react-native (opcional)           |

### 8.2 Testes Reutilizaveis do @cashback/shared

Testes do pacote compartilhado rodam em qualquer plataforma (Node.js):

| Categoria                             | Arquivos Web | Reutilizaveis? | Destino                                                         |
| ------------------------------------- | ------------ | -------------- | --------------------------------------------------------------- |
| Schemas Zod                           | 6 arquivos   | **100%**       | `packages/shared/src/schemas/__tests__/`                        |
| Utils (validation, formatters, masks) | 9 arquivos   | **100%**       | `packages/shared/src/utils/__tests__/`                          |
| Stores Zustand                        | 5 arquivos   | **~90%**       | `packages/shared/src/stores/__tests__/` (adaptar storage mocks) |
| Services (HTTP calls)                 | 4 arquivos   | **~80%**       | `packages/shared/src/services/__tests__/` (adaptar MSW)         |
| Hooks (useDebounce, etc.)             | 3 arquivos   | **~70%**       | `packages/shared/src/hooks/__tests__/` (adaptar renderHook)     |

### 8.3 Testes Novos — Mobile-Specific

| Categoria                                 | Testes a Criar | Prioridade | Pilar    |
| ----------------------------------------- | -------------- | ---------- | -------- |
| Navegacao (auth guard, tab switch)        | 3-5 testes     | Alta       | P2, P11  |
| Biometria (enroll, verify, fallback)      | 2-3 testes     | Alta       | P9, P11  |
| QR Code (gerar, scan, validar)            | 2-3 testes     | Alta       | P9, P11  |
| Push notifications (register, handle tap) | 2-3 testes     | Media      | P10, P11 |
| Offline mode (cache, queue, reconnect)    | 3-4 testes     | Media      | P8, P11  |
| Deep linking (parse URL, navigate)        | 2-3 testes     | Media      | P2, P11  |
| App lifecycle (background, foreground)    | 2-3 testes     | Media      | P9, P11  |

### 8.4 Dados de Mock Reutilizaveis

Os 12 arquivos de dados mock em `src/mocks/` sao **100% reutilizaveis**:

| Arquivo Mock          | Dominio       | Mobile usa?    |
| --------------------- | ------------- | -------------- |
| `auditoria.ts`        | Auditoria     | Apenas lojista |
| `campanhas.ts`        | Campanhas     | Sim            |
| `cliente.ts`          | Cliente       | Sim            |
| `clientes.ts`         | Clientes      | Sim            |
| `contestacoes.ts`     | Contestacoes  | Sim            |
| `dashboard.ts`        | Dashboard     | Sim            |
| `gerarCashback.ts`    | Cashback      | Sim            |
| `relatorios.ts`       | Relatorios    | Apenas lojista |
| `store.ts`            | Empresa/Store | Sim            |
| `utilizarCashback.ts` | Cashback      | Sim            |
| `vendas.ts`           | Vendas        | Apenas lojista |

**Acao:** Mover para `packages/shared/src/mocks/` e adicionar mocks mobile-specific (saldo, extrato cursor, QR token, device token).

### 8.5 Cobertura Target

| Camada               | Target MVP | Target Producao | Ref Pilar 11 |
| -------------------- | ---------- | --------------- | ------------ |
| Services (API layer) | 80%        | 90%             | Essencial    |
| Stores (Zustand)     | 70%        | 85%             | Essencial    |
| Utils/Schemas        | 90%        | 95%             | Essencial    |
| Componentes UI       | 40%        | 60%             | Recomendado  |
| Telas (integracao)   | 30%        | 50%             | Recomendado  |
| E2E (Maestro/Detox)  | 0%         | Top 3 fluxos    | Avancado     |

> **Ref Frontend:** FRONTEND_ANALYSIS.md — Secao 10 (Testes Existentes)
> **Ref Pilares:** Pilar 11 (Testes — Jest + RNTL, cobertura por camada, snapshot tests)

---

## 9. Dependencias — Stack Mobile Completa

> **Objetivo:** Listar todas as dependencias necessarias para o app mobile, categorizadas por funcao.
>
> **Pilares referenciados:** Pilar 1 (Arquitetura), Pilar 7 (Performance), Pilar 12 (CI/CD)

### 9.1 Core

| Pacote                                      | Versao | Funcao                     | Pilar   |
| ------------------------------------------- | ------ | -------------------------- | ------- |
| `expo`                                      | ~52    | Framework managed workflow | P1, P12 |
| `react`                                     | 18.3.x | UI runtime                 | P1      |
| `react-native`                              | 0.76.x | Plataforma nativa          | P1      |
| `typescript`                                | ~5.3   | Linguagem (strict mode)    | P1      |
| `expo-router` ou `@react-navigation/native` | latest | Navegacao                  | P2      |
| `@react-navigation/bottom-tabs`             | latest | Tab navigator              | P2      |
| `@react-navigation/native-stack`            | latest | Stack navigator            | P2      |

### 9.2 Estado e Dados

| Pacote                                    | Versao | Funcao                               | Pilar  |
| ----------------------------------------- | ------ | ------------------------------------ | ------ |
| `zustand`                                 | ^4.4   | Estado global (via @cashback/shared) | P3     |
| `@tanstack/react-query`                   | ^5.14  | Cache do servidor                    | P3     |
| `@tanstack/query-async-storage-persister` | ^5     | Persistir cache em MMKV              | P3, P8 |
| `axios`                                   | ^1.6   | HTTP client (via @cashback/shared)   | P4     |
| `zod`                                     | ^4.3   | Validacao (via @cashback/shared)     | P1     |
| `react-hook-form`                         | ^7.71  | Formularios                          | P6     |
| `@hookform/resolvers`                     | latest | Integrar Zod com RHF                 | P6     |

### 9.3 Storage e Seguranca

| Pacote                      | Versao | Funcao                               | Pilar  |
| --------------------------- | ------ | ------------------------------------ | ------ |
| `expo-secure-store`         | latest | Armazenamento seguro (tokens)        | P5     |
| `react-native-mmkv`         | latest | Storage rapido (cache, preferencias) | P8     |
| `expo-local-authentication` | latest | Biometria (FaceID/TouchID)           | P5, P9 |
| `expo-crypto`               | latest | Funcoes criptograficas               | P5     |

### 9.4 UI e Animacao

| Pacote                              | Versao | Funcao                             | Pilar  |
| ----------------------------------- | ------ | ---------------------------------- | ------ |
| `react-native-reanimated`           | latest | Animacoes nativas                  | P6, P7 |
| `react-native-gesture-handler`      | latest | Gestos (swipe, pan)                | P6     |
| `@gorhom/bottom-sheet`              | latest | Bottom sheets                      | P6     |
| `react-native-safe-area-context`    | latest | Safe areas (notch, home indicator) | P6     |
| `expo-font`                         | latest | Carregar DM Sans e Space Mono      | P6     |
| `expo-image`                        | latest | Imagens otimizadas com cache       | P7     |
| `lucide-react-native`               | latest | Icones SVG                         | P6     |
| `react-native-svg`                  | latest | SVG rendering (icones, QR)         | P6     |
| `react-native-toast-message`        | latest | Toasts                             | P6     |
| `react-native-skeleton-placeholder` | latest | Skeletons de loading               | P6     |
| `@shopify/flash-list`               | latest | Listas virtualizadas performaticas | P7     |
| `react-native-qrcode-svg`           | latest | Gerar QR code                      | P9     |

### 9.5 Funcionalidades Nativas

| Pacote                            | Versao | Funcao                    | Pilar  |
| --------------------------------- | ------ | ------------------------- | ------ |
| `expo-camera`                     | latest | QR Code scanner           | P9     |
| `expo-notifications`              | latest | Push notifications        | P10    |
| `expo-haptics`                    | latest | Feedback tatil            | P6, P9 |
| `expo-splash-screen`              | latest | Splash screen             | P16    |
| `expo-device`                     | latest | Info do device            | P13    |
| `expo-constants`                  | latest | Variaveis de ambiente     | P1     |
| `expo-localization`               | latest | Locale do device          | P15    |
| `@react-native-community/netinfo` | latest | Status de conectividade   | P8     |
| `expo-sharing`                    | latest | Compartilhar comprovantes | P9     |
| `expo-file-system`                | latest | Sistema de arquivos       | P8, P9 |

### 9.6 i18n

| Pacote          | Versao | Funcao                                | Pilar |
| --------------- | ------ | ------------------------------------- | ----- |
| `i18next`       | ^23.7  | Framework i18n (via @cashback/shared) | P15   |
| `react-i18next` | ^14.0  | Integracao React                      | P15   |

### 9.7 Monitoramento

| Pacote                 | Versao | Funcao                        | Pilar |
| ---------------------- | ------ | ----------------------------- | ----- |
| `@sentry/react-native` | latest | Crash reporting + performance | P13   |

### 9.8 Testes

| Pacote                          | Versao | Funcao                 | Pilar |
| ------------------------------- | ------ | ---------------------- | ----- |
| `jest`                          | latest | Test runner            | P11   |
| `@testing-library/react-native` | latest | Renderizacao + queries | P11   |
| `msw`                           | ^2.12  | Mock HTTP              | P11   |

### 9.9 CI/CD

| Pacote/Servico | Funcao                               | Pilar |
| -------------- | ------------------------------------ | ----- |
| `eas-cli`      | EAS Build + EAS Submit               | P12   |
| `expo-updates` | OTA updates                          | P12   |
| GitHub Actions | CI pipeline (lint, type-check, test) | P12   |

### 9.10 Resumo de Dependencias

| Categoria               | Quantidade | Novas (nao existem no web)                        |
| ----------------------- | ---------- | ------------------------------------------------- |
| Core                    | 7          | 4 (expo, RN, react-navigation)                    |
| Estado e Dados          | 7          | 2 (async-storage-persister, RHF ja existe)        |
| Storage e Seguranca     | 4          | 4 (todas novas)                                   |
| UI e Animacao           | 12         | 10 (reanimated, gesture-handler, bottom-sheet...) |
| Funcionalidades Nativas | 10         | 10 (todas novas)                                  |
| i18n                    | 2          | 0 (reutiliza do web)                              |
| Monitoramento           | 1          | 1 (@sentry/react-native)                          |
| Testes                  | 3          | 2 (jest, RNTL)                                    |
| CI/CD                   | 3          | 3 (EAS, expo-updates, GH Actions)                 |
| **Total**               | **~49**    | **~36 novas**                                     |

> **Ref Frontend:** FRONTEND_ANALYSIS.md — Secao 1.1 (Stack), `package.json`
> **Ref Pilares:** Todos os 16 pilares referenciados nas dependencias

---

## 10. Riscos e Mitigacoes

> **Objetivo:** Consolidar todos os riscos identificados nas analises de backend e frontend, priorizados por severidade e com plano de mitigacao.
>
> **Pilares referenciados:** Todos

### 10.1 Riscos Criticos (Bloqueantes)

| #   | Risco                                         | Origem             | Impacto                                                  | Mitigacao                                                                         | Sprint   |
| --- | --------------------------------------------- | ------------------ | -------------------------------------------------------- | --------------------------------------------------------------------------------- | -------- |
| R1  | **OAuth social nao implementado (stub 501)**  | Backend gap #7.2.1 | Apple rejeita apps sem Apple Sign-In                     | Implementar Google + Apple Sign-In no backend; usar `expo-auth-session` no mobile | Sprint 1 |
| R2  | **Exclusao de conta (LGPD) inexistente**      | Backend gap #7.1.8 | Apple e Google exigem opcao de deletar conta             | Criar endpoint `POST /auth/delete-account`; tela de confirmacao no mobile         | Sprint 1 |
| R3  | **QR Code sem persistencia**                  | Backend gap #7.2.4 | Fluxo core de resgate mobile nao funciona end-to-end     | Persistir tokens em Redis com TTL; criar endpoint de validacao para lojista       | Sprint 3 |
| R4  | **Tabela de notificacoes in-app inexistente** | Backend gap #7.3.4 | Sem historico de notificacoes no app (UX critica mobile) | Criar migration + model + 3 endpoints                                             | Sprint 2 |

### 10.2 Riscos Altos

| #   | Risco                                                     | Origem               | Impacto                                          | Mitigacao                                                | Sprint   |
| --- | --------------------------------------------------------- | -------------------- | ------------------------------------------------ | -------------------------------------------------------- | -------- |
| R5  | **Password reset mobile nao existe**                      | Backend gap #7.1.6   | Consumidor nao consegue recuperar senha          | Criar endpoints mobile de forgot/reset password          | Sprint 1 |
| R6  | **Perfil do cliente sem edicao**                          | Backend gap #7.1.5   | Consumidor nao consegue atualizar dados pessoais | Criar endpoint PATCH profile + change password           | Sprint 1 |
| R7  | **Push notifications sem integracao FCM/APNs verificada** | Backend gap #7.3.1   | Notificacoes push podem nao chegar aos devices   | Verificar e configurar credenciais FCM/APNs              | Sprint 2 |
| R8  | **Extrato mobile com N+1 query**                          | Backend gap #7.2.3   | Performance degradada em listagem de extrato     | Adicionar `with('empresa')` no controller                | Sprint 1 |
| R9  | **Recuperacao de senha web usa mocks (TODO API)**         | Frontend gap #12.4.1 | Funcionalidade incompleta no web tambem          | Integrar com endpoints reais antes de migrar para mobile | Sprint 1 |

### 10.3 Riscos Medios

| #   | Risco                                            | Origem               | Impacto                                    | Mitigacao                                       | Sprint   |
| --- | ------------------------------------------------ | -------------------- | ------------------------------------------ | ----------------------------------------------- | -------- |
| R10 | **Tipos legados (@deprecated) no barrel export** | Frontend gap #12.4.3 | Poluicao do @cashback/shared               | Remover na extracao para monorepo (Sprint 0)    | Sprint 0 |
| R11 | **secureStorage web usa Web Crypto (AES-GCM)**   | Frontend gap #12.4.7 | Incompativel com mobile                    | Substituir por expo-secure-store no mobile      | Sprint 0 |
| R12 | **SMS provider nao identificado**                | Backend gap #5.3     | Canal SMS pode nao funcionar               | Verificar e documentar provider de SMS          | Sprint 2 |
| R13 | **NFe como stub**                                | Backend gap #5.7     | Nota fiscal nao emitida                    | Nao bloqueante para mobile; resolver no backend | Futuro   |
| R14 | **Validacao assincrona com placeholders**        | Frontend gap #12.4.4 | Validacao de email/CNPJ unico nao funciona | Criar endpoints de checagem unica no backend    | Sprint 1 |
| R15 | **CORS nao configurado para origins mobile**     | Backend              | Requests do app podem ser rejeitados       | Adicionar origins do mobile na config CORS      | Sprint 0 |

### 10.4 Matriz de Risco por Sprint

| Sprint   | Riscos a Resolver           | Criticidade        |
| -------- | --------------------------- | ------------------ |
| Sprint 0 | R10, R11, R15               | Media              |
| Sprint 1 | R1, R2, R5, R6, R8, R9, R14 | **Critica + Alta** |
| Sprint 2 | R4, R7, R12                 | Alta               |
| Sprint 3 | R3                          | **Critica**        |
| Futuro   | R13                         | Media              |

> **Ref Backend:** BACKEND_ANALYSIS.md — Secao 7 (Gap Analysis), Secao 8 (Top 3 Riscos)
> **Ref Frontend:** FRONTEND_ANALYSIS.md — Secao 12.4 (Riscos e Gaps)
> **Ref Pilares:** Pilar 5 (Auth — OAuth, LGPD), Pilar 9 (Nativo — QR, biometria), Pilar 10 (Push — FCM/APNs), Pilar 16 (App Stores — requisitos)

---

## 11. Resumo Executivo

> **Objetivo:** Visao consolidada do estado de prontidao para construcao do app mobile, com metricas-chave e proximos passos.

### 11.1 Estado Geral de Prontidao

| Dimensao             | Score              | Detalhe                                                           |
| -------------------- | ------------------ | ----------------------------------------------------------------- |
| **Backend**          | 78% pronto         | 97 endpoints existentes, 14 mobile-ready, 15 faltantes, 6 ajustes |
| **Frontend (reuso)** | 69% extraivel      | 57 de 83 arquivos candidatos a @cashback/shared                   |
| **Pilares Mobile**   | 0/16 implementados | Nenhum pilar atendido ainda (app nao existe)                      |
| **Bloqueantes**      | 4 riscos criticos  | OAuth, delete account, QR persistence, notificacoes in-app        |

### 11.2 Metricas de Convergencia

| Metrica                                         | Valor                                                          |
| ----------------------------------------------- | -------------------------------------------------------------- |
| Total de endpoints backend                      | 97                                                             |
| Endpoints mobile existentes                     | 14 (9 prontos, 3 parciais, 1 stub, 1 N/A)                      |
| Endpoints web reutilizaveis pelo lojista mobile | 62                                                             |
| Endpoints a criar                               | 15                                                             |
| Ajustes em endpoints existentes                 | 6                                                              |
| Arquivos extraiveis para @cashback/shared       | 57 (~69%)                                                      |
| Componentes web                                 | 55 (0 reutilizaveis diretamente — todos precisam de UI nativa) |
| Componentes mobile a criar                      | ~25 (14 mapeados de web + 8 mobile-only + 3 novos)             |
| Telas mobile a criar                            | ~20 (consumidor: ~8, lojista: ~12)                             |
| Dependencias novas (nao existem no web)         | ~36                                                            |
| Riscos criticos                                 | 4                                                              |
| Riscos totais                                   | 15                                                             |

### 11.3 Roadmap de Sprints Sugerido

| Sprint         | Foco                     | Pilares      | Entregas Chave                                                      |
| -------------- | ------------------------ | ------------ | ------------------------------------------------------------------- |
| **Sprint 0**   | Infra + Monorepo         | P1, P12, P15 | Monorepo npm workspaces, @cashback/shared, CI basico, configs       |
| **Sprint 1**   | Auth + Perfil            | P4, P5, P6   | Login, registro, forgot password, perfil, delete account, OAuth     |
| **Sprint 2**   | Dashboard + Notificacoes | P3, P6, P10  | Dashboard consumidor, saldo, extrato, push notifications, biometria |
| **Sprint 3**   | QR Code + Cashback       | P4, P9       | Fluxo QR completo, gerar/utilizar cashback (lojista), contestacoes  |
| **Sprint 4**   | Gestao Lojista           | P4, P6       | Dashboard lojista, clientes, campanhas, vendas                      |
| **Sprint 5-6** | Polish + Performance     | P7, P8, P14  | Offline mode, animacoes, acessibilidade, dark mode                  |
| **Sprint 7**   | Testes + Monitoramento   | P11, P13     | Cobertura 70%+, Sentry, analytics                                   |
| **Sprint 8**   | App Store                | P16          | Screenshots, privacidade, review, submission                        |

### 11.4 Decisoes Arquiteturais Consolidadas

| Decisao              | Opcao Escolhida                           | Motivo                                               |
| -------------------- | ----------------------------------------- | ---------------------------------------------------- |
| Monorepo             | npm workspaces                            | Consistente com stack existente (npm)                |
| Navegacao            | React Navigation (bottom tabs + stack)    | Mais maduro que Expo Router para apps complexos      |
| Estilizacao          | NativeWind ou StyleSheet manual           | NativeWind permite reusar familiaridade com Tailwind |
| Listas               | @shopify/flash-list                       | Superior a FlatList em performance                   |
| Armazenamento seguro | expo-secure-store (tokens) + MMKV (cache) | Seguranca + performance                              |
| Animacoes            | react-native-reanimated                   | Roda na UI thread (60fps)                            |
| Push                 | expo-notifications (Expo Push Token)      | Managed workflow, sem config nativa manual           |
| Bottom sheets        | @gorhom/bottom-sheet                      | Padrao de mercado, spring animations                 |
| Graficos             | [A DEFINIR]                               | Avaliar victory-native vs react-native-chart-kit     |
| E2E tests            | [A DEFINIR]                               | Avaliar Maestro vs Detox                             |

### 11.5 Proximos Passos Imediatos

1. **Criar repositorio monorepo** com npm workspaces (Sprint 0, dia 1)
2. **Extrair @cashback/shared** do cashback-frontend (Sprint 0, dias 2-5)
3. **Configurar Expo managed workflow** no diretorio `packages/mobile/` (Sprint 0, dia 1)
4. **Implementar endpoints criticos no backend** — OAuth, delete account, forgot password mobile (Sprint 1)
5. **Construir AuthStack** — login, registro, forgot password (Sprint 1)
6. **Configurar CI** — GitHub Actions com lint, type-check, testes (Sprint 0)

---

## Checklist de Validacao

- [x] Feature Matrix cobre todas as funcionalidades de backend (97 endpoints) e frontend (29 paginas)
- [x] API Readiness Report classifica todos os endpoints mobile por prontidao
- [x] 15 endpoints faltantes listados com request/response e sprint alvo
- [x] Plano de extracao @cashback/shared detalha 57 arquivos com acao por arquivo
- [x] Design System mapeia todos os tokens visuais (cores, tipografia, espacamento, sombras, border-radius)
- [x] Navegacao define stacks, tabs e deep links para ambos os perfis (consumidor e lojista)
- [x] Migracao de estado cobre 5 stores Zustand + React Query config + 3 novos stores mobile
- [x] Service layer mapeia interceptors web vs mobile e define offline queue
- [x] Plano de testes identifica testes reutilizaveis e novos testes mobile-specific
- [x] Stack de dependencias lista ~49 pacotes categorizados por funcao
- [x] 15 riscos identificados e priorizados com mitigacao e sprint alvo
- [x] Resumo executivo com roadmap de 8 sprints
- [x] Cada secao referencia Pilares Mobile especificos
- [x] Cada secao referencia secoes dos documentos de input (BACKEND_ANALYSIS, FRONTEND_ANALYSIS)

---

> **Fim do documento CONVERGENCE_ANALYSIS.md**
> Gerado em 2026-02-25 via MOBILE_ANALYSIS_PROMPTS v4 — Fase 3 (Convergencia)

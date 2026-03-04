# Divergências Aceitas — Baseline de Exceções

> Divergências INTENCIONAIS entre Swagger, Zod e Código.
> Ao rodar pipelines futuros (S4 re-run), estas devem ser ignoradas.
> Data: 2026-03-04

---

## Divergências Swagger ↔ Zod (Documentadas via x-frontend-note)

| # | Swagger | Zod/Frontend | Motivo | Decisão | Data |
|---|---------|-------------|--------|---------|------|
| 1 | GerarCashbackRequest.cpf (string) | gerarCashbackSchema.valorVenda (string), cliente selecionado via cpfSearchSchema | Service layer converte campos de formulário → payload API (cpf string, valor_compra number) | Mantida — x-frontend-note | 2026-03-04 |
| 2 | UtilizarCashbackRequest.cpf (string) + valor_compra (number) | Sem schema dedicado; fluxo via cpfSearchSchema | Service layer monta payload com cpf (string) e valor_compra (number) | Mantida — x-frontend-note | 2026-03-04 |
| 3 | NotificacaoConfigResponse: email(bool), sms(bool), push(bool) | notificacoesSchema: emailNotif, smsNotif, pushNotif / mobile: push_enabled, email_enabled, marketing_enabled | Swagger reflete backend flat booleans; consumers transformam no service layer. Mobile campo marketing diverge de sms | Mantida — x-frontend-note | 2026-03-04 |
| 4 | CriarUsuarioRequest: unidade_negocio_ids (array), perfil inclui proprietario | userSchema: apenas nome, email, perfil (sem unidade_negocio_ids, sem proprietario) | unidade_negocio_ids é feature planejada no frontend; perfil não restringe valores | Mantida — x-frontend-note | 2026-03-04 |
| 5 | AtualizarUsuarioRequest: sem email, com unidade_negocio_ids | userSchema: inclui email, sem unidade_negocio_ids | Frontend reutiliza mesmo userSchema para criação e edição; unidade_negocio_ids planejado | Mantida — x-frontend-note | 2026-03-04 |
| 6 | AtualizarCampanhaRequest.status enum: ativa, inativa, finalizada | campaignSchema: sem campo status | Status gerenciado exclusivamente pelo backend; Zod percentual é string (input form) | Mantida — x-frontend-note | 2026-03-04 |
| 7 | AtualizarConfigRequest: 15 campos + razao_social | companyDataSchema + cashbackPolicySchema: sem razao_social, com cnpj; maxLength diverge | Frontend separa em schemas por seção de UI; divergências de maxLength documentadas | Mantida — x-frontend-note | 2026-03-04 |
| 8 | RegisterRequest: senha min:8, nome max:255 | registerSchema: senha min:8 + uppercase + lowercase + digit; inclui confirmarSenha, aceitoTermos, nomeLoja; nome max:120 | Campos de UX adicionais no Zod; maxLength mais restritivo no frontend | Mantida — x-frontend-note | 2026-03-04 |
| 9 | LoginRequest: sem minLength senha | loginSchema web: min:8; mobile: min:6 | Backend autentica por credenciais sem minLength; frontend valida UX | Mantida — x-frontend-note | 2026-03-04 |
| 10 | MobileRegisterRequest: senha min:8 (backend StrongPassword) | registerSchema mobile: senha min:6 | Zod mobile mais permissivo; backend rejeita com 422 se não atender StrongPassword | Mantida — x-frontend-note | 2026-03-04 |

---

## Divergências de Paths no Mapa Mobile

| # | Path no Mapa | Path Correto (Swagger) | Tela | Motivo | Decisão | Data |
|---|-------------|----------------------|------|--------|---------|------|
| 11 | `/api/v1/vendas` | `/api/v1/cashback` | VendasScreen | Path inferido incorretamente no S1, não corrigido no S5 | Known-issue — corrigir em pipeline futuro | 2026-03-04 |
| 12 | `/empresa/config` | `/api/v1/config` | ConfigScreen (Merchant) | Path inferido incorretamente no S1 | Known-issue — corrigir em pipeline futuro | 2026-03-04 |
| 13 | `/empresas/{id}/switch` | `/api/v1/auth/switch-empresa` | MultilojaScreen | Path inferido incorretamente no S1 | Known-issue — corrigir em pipeline futuro | 2026-03-04 |
| 14 | `/contestacoes/{id}/resolve` | `/api/v1/contestacoes/{id}` (PATCH) | ContestacoesMerchant | Path com sufixo /resolve não existe | Known-issue — corrigir em pipeline futuro | 2026-03-04 |

---

## Divergências Estruturais Aceitas

| # | Tipo | Descrição | Motivo | Decisão | Data |
|---|------|-----------|--------|---------|------|
| 15 | x-zod-schema null (11) | BiometricUnenrollRequest/Response, ListContestacoesRequest, ListRequest, ListTransacoesRequest, MobileDestroyDeviceRequest, MobileRegisterDeviceRequest, PaginationLinks, UploadLogoRequest, VerifyResetTokenRequest/Response | Schemas sem Zod correspondente nos consumers (mobile-specific, filter queries, utilitários) | Aceita — null indica ausência intencional | 2026-03-04 |
| 16 | x-zod-schema ausente | DeleteSuccessResponse | Resposta genérica {status, message} sem schema Zod dedicado | Aceita — não necessita Zod | 2026-03-04 |
| 17 | [INFERIDO] restantes (32) | 17 web + 10 admin + 5 mobile | Campos/comportamentos não verificáveis sem execução: mocks, features planejadas, ordenação server-side | Aceita — todos justificados nos mapas | 2026-03-04 |
| 18 | Admin ConfiguracoesPage STUB | Endpoint `/admin/configuracoes` não existe no backend | Tela planejada, endpoint não implementado | Aceita — STUB documentado no mapa admin | 2026-03-04 |
| 19 | Mobile ChangePasswordScreen | nova_senha_confirmation no Swagger/mapa, ausente no backend FormRequest | Campo de UX, backend não requer confirmação server-side | Aceita — divergência de validação UX vs API | 2026-03-04 |
| 20 | Validações maxLength/minLength | contestação descricao max:500 (Zod) vs max:1000 (backend); registros senha min:6 (Zod) vs min:8 (backend) | Frontend mais restritivo (UX) ou mais permissivo (fallback no backend 422) | Aceita — backend é autoridade final de validação | 2026-03-04 |

---

## Divergências Operacionais (a corrigir na E2)

| # | Tipo | Descrição | Ação | Data |
|---|------|-----------|------|------|
| 21 | S6-E4 version mismatch | Frontend/admin/mobile possuem S6-E4-postman-master.json sem pm.test (1.351.436 bytes = S6-E3). Backend possui versão correta com 240 pm.test (1.448.923 bytes) | Redistribuir na E2 | 2026-03-04 |
| 22 | S6-E5 splits sem testes | S6-E5-postman-web/admin/mobile.json foram gerados do S6-E3 (pré-testes) | Regenerar na E2 a partir do S6-E4 com testes | 2026-03-04 |

---

## Regras de Uso

1. **Pipelines futuros (S4 re-run)**: Ignorar divergências #1-#20 (intencionais/documentadas)
2. **Divergências #21-#22**: Serão corrigidas na E2 (distribuição) — não são permanentes
3. **Divergências #11-#14 (mobile paths)**: Candidatas a correção no próximo refinamento de mapas
4. **Novos schemas adicionados ao Swagger**: Devem incluir x-zod-schema (truthy ou null com justificativa)
5. **Novas x-frontend-note**: Devem ser adicionadas a este baseline quando divergências são aceitas

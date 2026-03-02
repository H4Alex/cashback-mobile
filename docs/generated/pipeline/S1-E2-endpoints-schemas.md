# Endpoints e Schemas

> Índice de referência gerado automaticamente a partir do Swagger OpenAPI.

## Endpoints

| # | Método | URI | Consumers | Schema Request | Schema Response |
|---|--------|-----|-----------|----------------|-----------------|
| 1 | GET | `/api/health` | — | — | — |
| 2 | GET | `/api/ready` | — | — | — |
| 3 | GET | `/api/version` | — | — | — |
| 4 | GET | `/api/metrics` | — | — | — |
| 5 | GET | `/api/metrics/prometheus` | — | — | — |
| 6 | POST | `/api/v1/auth/register` | web | RegisterRequest | — |
| 7 | POST | `/api/v1/auth/login` | web, admin | LoginRequest | — |
| 8 | POST | `/api/v1/auth/forgot-password` | web | ForgotPasswordRequest | — |
| 9 | POST | `/api/v1/auth/reset-password` | web | ResetPasswordRequest | — |
| 10 | POST | `/api/v1/auth/switch-empresa` | web, mobile | SwitchEmpresaRequest | — |
| 11 | POST | `/api/v1/auth/refresh` | web, admin | — | — |
| 12 | POST | `/api/v1/auth/logout` | web, admin | — | — |
| 13 | GET | `/api/v1/auth/me` | web, admin | — | UserResponse |
| 14 | POST | `/api/v1/auth/2fa/setup` | web | — | — |
| 15 | POST | `/api/v1/auth/2fa/confirm` | web | — | — |
| 16 | POST | `/api/v1/auth/2fa/verify` | web | — | — |
| 17 | POST | `/api/v1/auth/2fa/disable` | web | — | — |
| 18 | POST | `/api/v1/auth/2fa/backup-codes` | web | — | — |
| 19 | POST | `/api/mobile/v1/auth/register` | mobile | MobileRegisterRequest | — |
| 20 | POST | `/api/mobile/v1/auth/login` | mobile | MobileLoginRequest | — |
| 21 | POST | `/api/mobile/v1/auth/oauth` | mobile | MobileOAuthRequest | — |
| 22 | POST | `/api/mobile/v1/auth/forgot-password` | mobile | MobileForgotPasswordRequest | — |
| 23 | POST | `/api/mobile/v1/auth/reset-password` | mobile | MobileResetPasswordRequest | — |
| 24 | POST | `/api/mobile/v1/auth/biometric/verify` | mobile | — | — |
| 25 | POST | `/api/mobile/v1/auth/refresh` | mobile | — | — |
| 26 | POST | `/api/mobile/v1/auth/logout` | mobile | — | — |
| 27 | GET | `/api/mobile/v1/auth/me` | mobile | — | — |
| 28 | PATCH | `/api/mobile/v1/auth/profile` | mobile | MobileUpdateProfileRequest | — |
| 29 | PATCH | `/api/mobile/v1/auth/password` | mobile | MobileChangePasswordRequest | — |
| 30 | POST | `/api/mobile/v1/auth/delete-account` | mobile | MobileDeleteAccountRequest | — |
| 31 | POST | `/api/mobile/v1/auth/biometric/enroll` | mobile | — | — |
| 32 | GET | `/api/mobile/v1/auth/sessions` | mobile | — | — |
| 33 | DELETE | `/api/mobile/v1/auth/sessions/{id}` | mobile | — | — |
| 34 | GET | `/api/mobile/v1/saldo` | mobile | — | — |
| 35 | GET | `/api/mobile/v1/extrato` | mobile | — | MobileExtratoResponse[] |
| 36 | GET | `/api/mobile/v1/utilizacao/lojas` | mobile | — | — |
| 37 | POST | `/api/mobile/v1/utilizacao/qrcode` | mobile | MobileQrCodeRequest | — |
| 38 | POST | `/api/mobile/v1/devices` | mobile | MobileRegisterDeviceRequest | — |
| 39 | DELETE | `/api/mobile/v1/devices` | mobile | MobileDestroyDeviceRequest | — |
| 40 | GET | `/api/mobile/v1/contestacoes` | mobile | — | ContestacaoResponse[] |
| 41 | POST | `/api/mobile/v1/contestacoes` | mobile | MobileContestacaoRequest | ContestacaoResponse |
| 42 | GET | `/api/mobile/v1/notifications` | mobile | — | — |
| 43 | PATCH | `/api/mobile/v1/notifications/{id}/read` | mobile | — | — |
| 44 | POST | `/api/mobile/v1/notifications/read-all` | mobile | — | — |
| 45 | GET | `/api/mobile/v1/notifications/preferences` | mobile | — | — |
| 46 | PATCH | `/api/mobile/v1/notifications/preferences` | mobile | — | — |
| 47 | GET | `/api/v1/empresas` | web, mobile | — | EmpresaResponse[] |
| 48 | POST | `/api/v1/webhooks/starkbank` | — | — | — |
| 49 | GET | `/api/v1/admin/dashboard` | admin | — | — |
| 50 | GET | `/api/v1/admin/empresas` | admin | — | EmpresaResponse[] |
| 51 | GET | `/api/v1/admin/empresas/{id}` | admin | — | EmpresaResponse |
| 52 | PATCH | `/api/v1/admin/empresas/{id}` | admin | AtualizarEmpresaAdminRequest | EmpresaResponse |
| 53 | POST | `/api/v1/admin/empresas/{id}/block` | admin | — | EmpresaResponse |
| 54 | POST | `/api/v1/admin/empresas/{id}/unblock` | admin | — | EmpresaResponse |
| 55 | GET | `/api/v1/admin/planos` | admin | — | PlanoResponse[] |
| 56 | POST | `/api/v1/admin/planos` | admin | CriarPlanoRequest | PlanoResponse |
| 57 | PATCH | `/api/v1/admin/planos/{id}` | admin | AtualizarPlanoRequest | PlanoResponse |
| 58 | GET | `/api/v1/admin/usuarios` | admin | — | UserResponse[] |
| 59 | POST | `/api/v1/admin/usuarios` | admin | CriarAdminUsuarioRequest | UserResponse |
| 60 | PATCH | `/api/v1/admin/usuarios/{id}` | admin | AtualizarAdminUsuarioRequest | UserResponse |
| 61 | DELETE | `/api/v1/admin/usuarios/{id}` | admin | — | — |
| 62 | GET | `/api/v1/admin/auditoria` | admin | — | AuditoriaResponse[] |
| 63 | POST | `/api/v1/qrcode/validate` | mobile | — | — |
| 64 | GET | `/api/v1/cashback` | web, mobile | ListTransacoesRequest | TransacaoResponse[] |
| 65 | POST | `/api/v1/cashback` | web, mobile | GerarCashbackRequest | TransacaoResponse |
| 66 | POST | `/api/v1/cashback/utilizar` | web, mobile | UtilizarCashbackRequest | TransacaoResponse |
| 67 | GET | `/api/v1/cashback/{id}` | web | — | TransacaoResponse |
| 68 | POST | `/api/v1/cashback/{id}/cancelar` | web | — | TransacaoResponse |
| 69 | GET | `/api/v1/clientes` | web, mobile | — | ClienteResponse[] |
| 70 | POST | `/api/v1/clientes` | web | CriarClienteRequest | ClienteResponse |
| 71 | GET | `/api/v1/clientes/{id}` | web, mobile | — | ClienteResponse |
| 72 | PATCH | `/api/v1/clientes/{id}` | web | AtualizarClienteRequest | ClienteResponse |
| 73 | GET | `/api/v1/clientes/{id}/saldo` | web, mobile | — | — |
| 74 | GET | `/api/v1/clientes/{id}/extrato` | web | — | TransacaoResponse[] |
| 75 | GET | `/api/v1/campanhas` | web, mobile | — | CampanhaResponse[] |
| 76 | POST | `/api/v1/campanhas` | web, mobile | CriarCampanhaRequest | CampanhaResponse |
| 77 | GET | `/api/v1/campanhas/{id}` | web | — | CampanhaResponse |
| 78 | PATCH | `/api/v1/campanhas/{id}` | web, mobile | AtualizarCampanhaRequest | CampanhaResponse |
| 79 | DELETE | `/api/v1/campanhas/{id}` | web, mobile | — | — |
| 80 | GET | `/api/v1/config` | web, mobile | — | EmpresaResponse |
| 81 | PATCH | `/api/v1/config` | web, mobile | AtualizarConfigRequest | EmpresaResponse |
| 82 | POST | `/api/v1/config/logo` | web, mobile | UploadLogoRequest | — |
| 83 | GET | `/api/v1/unidades` | web | — | UnidadeNegocioResponse[] |
| 84 | POST | `/api/v1/unidades` | web | CriarUnidadeRequest | UnidadeNegocioResponse |
| 85 | PATCH | `/api/v1/unidades/{id}` | web | AtualizarUnidadeRequest | UnidadeNegocioResponse |
| 86 | DELETE | `/api/v1/unidades/{id}` | web | — | — |
| 87 | GET | `/api/v1/usuarios` | web | — | UserResponse[] |
| 88 | POST | `/api/v1/usuarios` | web | CriarUsuarioRequest | UserResponse |
| 89 | PATCH | `/api/v1/usuarios/{id}` | web | AtualizarUsuarioRequest | UserResponse |
| 90 | DELETE | `/api/v1/usuarios/{id}` | web | — | — |
| 91 | GET | `/api/v1/notificacoes/config` | web | — | NotificacaoConfigResponse[] |
| 92 | PATCH | `/api/v1/notificacoes/config` | web | AtualizarNotificacaoConfigRequest | NotificacaoConfigResponse[] |
| 93 | GET | `/api/v1/faturas` | web | — | FaturaResponse[] |
| 94 | GET | `/api/v1/faturas/{id}/link-pagamento` | web | — | — |
| 95 | GET | `/api/v1/faturas/{id}/nota-fiscal` | web | — | — |
| 96 | GET | `/api/v1/assinaturas/planos` | web | — | PlanoResponse[] |
| 97 | GET | `/api/v1/assinaturas/minha` | web | — | AssinaturaResponse |
| 98 | POST | `/api/v1/assinaturas/upgrade` | web | UpgradeRequest | AssinaturaResponse |
| 99 | GET | `/api/v1/contestacoes` | web, mobile | ListContestacoesRequest | ContestacaoResponse[] |
| 100 | POST | `/api/v1/contestacoes` | web | CriarContestacaoRequest | ContestacaoResponse |
| 101 | PATCH | `/api/v1/contestacoes/{id}` | web, mobile | ResolverContestacaoRequest | ContestacaoResponse |
| 102 | GET | `/api/v1/auditoria` | web | — | AuditoriaResponse[] |
| 103 | GET | `/api/v1/relatorios` | web, mobile | — | — |
| 104 | GET | `/api/v1/dashboard/stats` | web, mobile | — | — |
| 105 | GET | `/api/v1/dashboard/transacoes` | web, mobile | — | TransacaoResponse[] |
| 106 | GET | `/api/v1/dashboard/top-clientes` | web, mobile | — | — |
| 107 | GET | `/api/v1/dashboard/chart` | web, mobile | — | — |
| 108 | GET | `/api/v1/lgpd/customers/{clienteId}/export` | — | — | — |
| 109 | POST | `/api/v1/lgpd/customers/{clienteId}/anonymize` | — | — | — |
| 110 | GET | `/api/v1/lgpd/customers/{clienteId}/consents` | — | — | — |
| 111 | POST | `/api/v1/lgpd/customers/{clienteId}/consents` | — | — | — |

**Total: 111 endpoints**

## Schemas Response (campos)

- **AssinaturaResponse**: id, empresa_id, plano_id, ciclo, status, em_trial, dias_restantes_trial, data_inicio, data_fim_trial, data_proxima_cobranca, created_at, updated_at, plano, plano_efetivo
- **AuditoriaResponse**: id, empresa_id, usuario_id, acao, entidade, entidade_id, dados_anteriores, dados_novos, ip_address, created_at, usuario
- **CampanhaResponse**: id, empresa_id, nome, data_inicio, data_fim, percentual, validade_padrao, status, created_at, updated_at
- **ClienteResponse**: id, cpf, nome, telefone, email, created_at, updated_at
- **ContestacaoResponse**: id, empresa_id, transacao_id, cliente_id, tipo, descricao, status, resposta, respondido_por, created_at, updated_at, transacao, cliente, respondente
- **EmpresaResponse**: id, nome_fantasia, razao_social, cnpj, telefone, email, cep, rua, numero, complemento, bairro, cidade, estado, logo_url, carencia_horas, modo_saldo, percentual_cashback, validade_cashback, percentual_max_utilizacao, created_at, updated_at, assinatura_ativa
- **FaturaResponse**: id, empresa_id, assinatura_id, valor, status, starkbank_invoice_id, link_pagamento, nfe_url, data_vencimento, data_pagamento, created_at, updated_at, assinatura
- **MobileExtratoResponse**: id, tipo, valor_compra, valor_cashback, status_cashback, data_expiracao, created_at, empresa, campanha
- **NotificacaoConfigResponse**: id, empresa_id, canal, ativo, created_at, updated_at
- **PlanoResponse**: id, nome, slug, preco_mensal, preco_anual, max_clientes, max_campanhas, max_usuarios, tem_unidades_negocio, nivel_relatorio, nivel_suporte, created_at, updated_at
- **TransacaoResponse**: id, empresa_id, unidade_negocio_id, cliente_id, campanha_id, operador_id, valor_compra, percentual_cashback, valor_cashback, status_venda, status_cashback, data_expiracao, data_confirmacao, transacao_origem_id, dias_restantes_congelamento, created_at, updated_at, cliente, campanha, operador, unidade_negocio, contestacoes
- **UnidadeNegocioResponse**: id, empresa_id, nome, status, created_at, updated_at
- **UserResponse**: id, nome, email, telefone, tipo_global, created_at, updated_at, perfil

## Schemas Request (**required** em negrito)

- **AtualizarAdminUsuarioRequest**: nome, email, senha, telefone
- **AtualizarCampanhaRequest**: nome, data_inicio, data_fim, percentual, validade_padrao, status
- **AtualizarClienteRequest**: nome, telefone, email
- **AtualizarConfigRequest**: nome_fantasia, razao_social, telefone, email, cep, rua, numero, complemento, bairro, cidade, estado, percentual_cashback, validade_cashback, percentual_max_utilizacao, carencia_horas
- **AtualizarEmpresaAdminRequest**: nome_fantasia, razao_social, telefone, email, percentual_cashback, validade_cashback, percentual_max_utilizacao, carencia_horas, modo_saldo
- **AtualizarNotificacaoConfigRequest**: email, sms, push
- **AtualizarPlanoRequest**: nome, preco_mensal, preco_anual, max_clientes, max_campanhas, max_usuarios, tem_unidades_negocio, nivel_relatorio, nivel_suporte
- **AtualizarUnidadeRequest**: nome, status
- **AtualizarUsuarioRequest**: nome, telefone, perfil, unidade_negocio_ids
- **CriarAdminUsuarioRequest**: **nome**, **email**, **senha**, telefone
- **CriarCampanhaRequest**: **nome**, **data_inicio**, **data_fim**, **percentual**, **validade_padrao**
- **CriarClienteRequest**: **cpf**, nome, telefone, email
- **CriarContestacaoRequest**: **transacao_id**, **tipo**, **descricao**
- **CriarPlanoRequest**: **nome**, **preco_mensal**, **preco_anual**, max_clientes, max_campanhas, max_usuarios, tem_unidades_negocio, **nivel_relatorio**, **nivel_suporte**
- **CriarUnidadeRequest**: **nome**
- **CriarUsuarioRequest**: **nome**, **email**, **senha**, telefone, **perfil**, unidade_negocio_ids
- **ForgotPasswordRequest**: **email**
- **GerarCashbackRequest**: **cpf**, **valor_compra**, campanha_id, unidade_negocio_id
- **ListContestacoesRequest**: page, limit, sort_by, order, data_inicio, data_fim, status, tipo
- **ListRequest**: page, limit, sort_by, order, data_inicio, data_fim
- **ListTransacoesRequest**: page, limit, sort_by, order, data_inicio, data_fim, status_venda, status_cashback, cliente_id, campanha_id
- **LoginRequest**: **email**, **senha**, plataforma
- **MobileChangePasswordRequest**: **senha_atual**, **nova_senha**
- **MobileContestacaoRequest**: **transacao_id**, **tipo**, **descricao**
- **MobileDeleteAccountRequest**: **senha**, motivo
- **MobileDestroyDeviceRequest**: **token**
- **MobileForgotPasswordRequest**: **email**
- **MobileLoginRequest**: **email**, **senha**
- **MobileOAuthRequest**: **provider**, **token**, nome
- **MobileQrCodeRequest**: **empresa_id**, **valor**
- **MobileRegisterDeviceRequest**: **token**, **plataforma**
- **MobileRegisterRequest**: **cpf**, **nome**, **email**, **senha**, telefone
- **MobileResetPasswordRequest**: **email**, **token**, **senha**
- **MobileUpdateProfileRequest**: nome, telefone, email
- **RegisterRequest**: **nome**, **email**, **senha**, telefone, **cnpj**, nome_fantasia, telefone_empresa
- **ResetPasswordRequest**: **email**, **token**, **senha**
- **ResolverContestacaoRequest**: **status**, resposta
- **SwitchEmpresaRequest**: **empresa_id**, plataforma
- **UpgradeRequest**: **plano_id**, **ciclo**
- **UploadLogoRequest**: **logo**
- **UtilizarCashbackRequest**: **cpf**, **valor_compra**, unidade_negocio_id

## Enums

- **status_cashback**: [pendente, confirmado, utilizado, rejeitado, expirado, congelado]
- **status_venda**: [concluida, cancelada]
- **status_assinatura**: [trial, ativa, inadimplente, cancelada]
- **status_fatura**: [gerada, enviada, paga, vencida]
- **status_campanha**: [ativa, inativa, encerrada]
- **status_contestacao**: [pendente, aprovada, rejeitada]
- **tipo_contestacao**: [cashback_nao_gerado, valor_incorreto, expiracao_indevida, venda_cancelada]
- **perfil_usuario**: [gestor, operador, vendedor]
- **tipo_global**: [admin, lojista]
- **modo_saldo**: [individual, global]
- **ciclo_assinatura**: [mensal, anual]
- **nivel_relatorio**: [simples, completos, avancados]
- **nivel_suporte**: [email, prioritario, 24_7_gerente]
- **plataforma_login**: [web, mobile]
- **plataforma_device**: [ios, android]
- **oauth_provider**: [google, apple]
- **status_unidade**: [ativa, inativa]
- **order_direction**: [asc, desc]

## Telas por Consumer

### Web

- **/login** (LoginPage): `POST /api/v1/auth/login`
- **/cadastro** (CadastroPage): `POST /api/v1/auth/register`
- **/recuperacao** (RecuperacaoPage): `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`
- **/** (DashboardPage): `GET /api/v1/dashboard/stats`, `GET /api/v1/dashboard/transacoes`, `GET /api/v1/dashboard/top-clientes`, `GET /api/v1/dashboard/chart`
- **/gerar-cashback** (GerarCashbackPage): `POST /api/v1/cashback`, `GET /api/v1/campanhas`
- **/utilizar-cashback** (UtilizarCashbackPage): `POST /api/v1/cashback/utilizar`
- **/campanhas** (CampanhasPage): `GET /api/v1/campanhas`, `GET /api/v1/campanhas/{id}`, `POST /api/v1/campanhas`, `PATCH /api/v1/campanhas/{id}`, `DELETE /api/v1/campanhas/{id}`
- **/clientes** (ClientesPage): `GET /api/v1/clientes`, `GET /api/v1/clientes/{id}`, `POST /api/v1/clientes`, `PATCH /api/v1/clientes/{id}`, `GET /api/v1/clientes/{id}/saldo`, `GET /api/v1/clientes/{id}/extrato`
- **/vendas** (VendasPage): `GET /api/v1/cashback`, `GET /api/v1/cashback/{id}`, `POST /api/v1/cashback/{id}/cancelar`
- **/relatorios** (RelatoriosPage): `GET /api/v1/relatorios`
- **/configuracoes** (ConfiguracoesPage): `GET /api/v1/config`, `PATCH /api/v1/config`, `POST /api/v1/config/logo`, `GET /api/v1/unidades`, `POST /api/v1/unidades`, `PATCH /api/v1/unidades/{id}`, `DELETE /api/v1/unidades/{id}`, `GET /api/v1/usuarios`, `POST /api/v1/usuarios`, `PATCH /api/v1/usuarios/{id}`, `DELETE /api/v1/usuarios/{id}`, `GET /api/v1/notificacoes/config`, `PATCH /api/v1/notificacoes/config`, `GET /api/v1/faturas`, `POST /api/v1/faturas/{id}/link`, `GET /api/v1/faturas/{id}/nfe`, `GET /api/v1/assinaturas/planos`, `GET /api/v1/assinaturas/minha`, `POST /api/v1/assinaturas/upgrade`, `POST /api/v1/auth/2fa/setup`, `POST /api/v1/auth/2fa/confirm`, `POST /api/v1/auth/2fa/verify`, `POST /api/v1/auth/2fa/disable`, `POST /api/v1/auth/2fa/backup-codes`
- **/contestacoes** (ContestacoesPage): `GET /api/v1/contestacoes`, `POST /api/v1/contestacoes`, `PATCH /api/v1/contestacoes/{id}`
- **/auditoria** (AuditoriaPage): `GET /api/v1/auditoria`
- **/multiloja** (MultilojaPage): `GET /api/v1/empresas`, `POST /api/v1/auth/switch-empresa`
- **/cliente** (DashboardClientePage): `GET /api/v1/clientes/{id}/saldo`, `GET /api/v1/cashback`
- **/cliente/saldo** (SaldoClientePage): `GET /api/v1/clientes/{id}/saldo`
- **/cliente/extrato** (ExtratoCashbackPage): `GET /api/v1/clientes/{id}/extrato`

### Admin

- **/login** (LoginPage): `POST /api/v1/auth/login`
- **/** (DashboardPage): `GET /api/v1/admin/dashboard`
- **/empresas** (EmpresasPage): `GET /api/v1/admin/empresas`
- **/empresas/:id** (EmpresaDetalhePage): `GET /api/v1/admin/empresas/{id}`, `PATCH /api/v1/admin/empresas/{id}`, `POST /api/v1/admin/empresas/{id}/block`, `POST /api/v1/admin/empresas/{id}/unblock`
- **/planos** (PlanosPage): `GET /api/v1/admin/planos`, `POST /api/v1/admin/planos`, `PATCH /api/v1/admin/planos/{id}`
- **/administradores** (AdminUsuariosPage): `GET /api/v1/admin/usuarios`, `POST /api/v1/admin/usuarios`, `PATCH /api/v1/admin/usuarios/{id}`, `DELETE /api/v1/admin/usuarios/{id}`
- **/auditoria** (AuditoriaPage): `GET /api/v1/admin/auditoria`
- **/configuracoes** (ConfiguracoesPage): `[NÃO IDENTIFICADO] — stub local, endpoint /admin/configuracoes não existe no backend`

### Mobile

- **(auth)/login** (LoginScreen): `POST /api/mobile/v1/auth/login`
- **(auth)/register** (RegisterScreen): `POST /api/mobile/v1/auth/register`
- **(auth)/forgot-password** (ForgotPasswordScreen): `POST /api/mobile/v1/auth/forgot-password`
- **(auth)/onboarding** (OnboardingScreen): —
- **(auth)/consent** (ConsentScreen): —
- **(consumer)/home/index** (HomeScreen): `GET /api/mobile/v1/saldo`, `GET /api/mobile/v1/extrato`
- **(consumer)/home/extrato** (ExtratoScreen): `GET /api/mobile/v1/extrato`
- **(consumer)/home/historico** (HistoricoScreen): `GET /api/mobile/v1/extrato`
- **(consumer)/saldo/index** (SaldoScreen): `GET /api/mobile/v1/saldo`, `GET /api/mobile/v1/utilizacao/lojas`
- **(consumer)/qrcode/index** (QRCodeScreen): `POST /api/mobile/v1/utilizacao/qrcode`
- **(consumer)/notifications/index** (NotificationsScreen): `GET /api/mobile/v1/notifications`, `PATCH /api/mobile/v1/notifications/{id}/read`, `POST /api/mobile/v1/notifications/read-all`
- **(consumer)/notifications/preferences** (NotificationPreferencesScreen): `GET /api/mobile/v1/notifications/preferences`, `PATCH /api/mobile/v1/notifications/preferences`
- **(consumer)/profile/index** (ProfileScreen): `GET /api/mobile/v1/auth/me`
- **(consumer)/profile/edit** (EditProfileScreen): `PATCH /api/mobile/v1/auth/profile`
- **(consumer)/profile/change-password** (ChangePasswordScreen): `PATCH /api/mobile/v1/auth/password`
- **(consumer)/profile/delete-account** (DeleteAccountScreen): `POST /api/mobile/v1/auth/delete-account`
- **(consumer)/contestacao/index** (ContestacaoListScreen): `GET /api/mobile/v1/contestacoes`
- **(consumer)/contestacao/create** (CreateContestacaoScreen): `POST /api/mobile/v1/contestacoes`
- **(merchant)/dashboard** (MerchantDashboardScreen): `GET /api/v1/dashboard/stats`, `GET /api/v1/dashboard/transacoes`, `GET /api/v1/dashboard/top-clientes`, `GET /api/v1/dashboard/chart`
- **(merchant)/cashback/gerar** (GerarCashbackScreen): `POST /api/v1/cashback`, `GET /api/v1/clientes`, `GET /api/v1/clientes/{id}/saldo`, `GET /api/v1/campanhas`
- **(merchant)/cashback/utilizar** (UtilizarCashbackScreen): `POST /api/v1/cashback/utilizar`, `GET /api/v1/clientes`, `GET /api/v1/clientes/{id}/saldo`
- **(merchant)/cashback/qr-scan** (QRScanScreen): `POST /api/v1/qrcode/validate`
- **(merchant)/cashback/index** (CashbackListScreen): `GET /api/v1/cashback`
- **(merchant)/clientes/index** (ClientesScreen): `GET /api/v1/clientes`
- **(merchant)/clientes/[id]** (ClienteDetailScreen): `GET /api/v1/clientes/{id}`
- **(merchant)/more/campanhas** (CampanhasScreen): `GET /api/v1/campanhas`, `POST /api/v1/campanhas`, `PATCH /api/v1/campanhas/{id}`, `DELETE /api/v1/campanhas/{id}`
- **(merchant)/more/config** (ConfigScreen): `GET /api/v1/config`, `PATCH /api/v1/config`, `POST /api/v1/config/logo`
- **(merchant)/more/contestacoes** (ContestacoesMerchantScreen): `GET /api/v1/contestacoes`, `PATCH /api/v1/contestacoes/{id}`
- **(merchant)/more/vendas** (VendasScreen): `GET /api/v1/cashback`
- **(merchant)/more/relatorios** (RelatoriosScreen): `GET /api/v1/relatorios`
- **(merchant)/multiloja** (MultilojaScreen): `GET /api/v1/empresas`, `POST /api/v1/auth/switch-empresa`

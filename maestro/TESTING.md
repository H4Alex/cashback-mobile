# Mobile E2E Tests — Maestro

## Visão geral

Testes E2E de UI para o app H4Cashback Mobile usando [Maestro](https://maestro.mobile.dev/).

### Estrutura

```
maestro/
├── config.yaml                  # Configuração global do Maestro
├── .env.example                 # Template de variáveis de ambiente
├── TESTING.md                   # Este arquivo
├── subflows/                    # Helpers reutilizáveis
│   ├── login_consumer.yaml      # Login como consumidor
│   ├── login_merchant.yaml      # Login como lojista
│   ├── logout.yaml              # Logout do app
│   ├── navigate_to_extrato.yaml # Navegar para tela de Extrato
│   └── navigate_to_qrcode.yaml  # Navegar para tela de QR Code
└── flows/
    ├── 01-08_*.yaml             # Flows originais (monolíticos, regressão)
    ├── p0/                      # Testes P0 atômicos (20 testes)
    │   ├── onboarding/          # B1.1–B1.5 (5 testes)
    │   ├── login/               # B2.1–B2.4 (4 testes)
    │   ├── saldo/               # B3.1–B3.5 (5 testes)
    │   └── qr-cashback/         # B4.1–B4.6 (6 testes)
    └── p1/                      # Testes P1 atômicos (11 testes)
        ├── contestacao/         # C1.1–C1.4 (4 testes)
        ├── perfil/              # C2.1–C2.4 (4 testes)
        └── push/                # C3.1–C3.3 (3 testes)
```

## Pré-requisitos

1. **Maestro CLI** instalado:
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   maestro --version
   ```

2. **Emulador Android** ou **Simulador iOS** rodando:
   ```bash
   # Android
   adb devices  # deve listar um device

   # iOS (macOS only)
   xcrun simctl list devices available
   ```

3. **Build do app** instalado no emulador:
   ```bash
   # Development build
   eas build --profile development --platform android
   # Ou para iOS
   eas build --profile development --platform ios
   ```

4. **Variáveis de ambiente** configuradas:
   ```bash
   cp maestro/.env.example maestro/.env
   # Editar com credenciais reais
   ```

## Executar testes

### Todos os testes P0
```bash
npm run test:e2e:mobile
# ou diretamente:
maestro test maestro/flows/p0/
```

### Por grupo
```bash
maestro test maestro/flows/p0/login/        # B2: Login
maestro test maestro/flows/p0/onboarding/   # B1: Onboarding
maestro test maestro/flows/p0/saldo/        # B3: Saldo + Extrato
maestro test maestro/flows/p0/qr-cashback/  # B4: QR Cashback
```

### Teste individual
```bash
maestro test maestro/flows/p0/login/B2_1_login_credentials.yaml
```

### Com variáveis de ambiente
```bash
maestro test --env maestro/.env maestro/flows/p0/
```

### Gerar relatório JUnit (CI)
```bash
maestro test --format junit --output test-results/maestro.xml maestro/flows/p0/
```

## Validação sem emulador (dry-run)

Se Maestro CLI está instalado mas sem emulador:
```bash
npm run test:e2e:mobile:validate
```

## Convenções

### Nomenclatura de flows
- `B{grupo}_{número}_{descricao_snake_case}.yaml`
- Exemplo: `B2_1_login_credentials.yaml`

### Seletores
- **Preferir testID** quando disponível: `id: "input-email"`
- **Fallback para texto**: `tapOn: "Entrar"`
- **Nunca usar índices** — frágeis a mudanças de layout

### Subflows
- Reutilizar `subflows/login_consumer.yaml` em vez de repetir login
- Chamada: `- runFlow: ../../subflows/login_consumer.yaml`

### Variáveis de ambiente
- Credenciais via env vars: `${CONSUMER_EMAIL}`, `${CONSUMER_PASSWORD}`
- Nunca hardcodar credenciais nos flows

## Testes P0 — Catálogo

| ID | Grupo | Cenário | Status |
|----|-------|---------|--------|
| B1.1 | Onboarding | Welcome screens renderizam | ✅ Criado |
| B1.2 | Onboarding | Permissões handling | ✅ Criado |
| B1.3 | Onboarding | Cadastro básico | ✅ Criado |
| B1.4 | Onboarding | Skip onboarding | ✅ Criado |
| B1.5 | Onboarding | Conclusão → home com saldo | ✅ Criado |
| B2.1 | Login | Login com credenciais | ✅ Criado |
| B2.2 | Login | Biometria mock / fallback | ✅ Criado |
| B2.3 | Login | Token refresh silencioso | ✅ Criado |
| B2.4 | Login | Logout | ✅ Criado |
| B3.1 | Saldo | Saldo card visível | ✅ Criado |
| B3.2 | Saldo | Extrato lista | ✅ Criado |
| B3.3 | Saldo | Filtros de extrato | ✅ Criado |
| B3.4 | Saldo | Paginação scroll | ✅ Criado |
| B3.5 | Saldo | Pull-to-refresh | ✅ Criado |
| B4.1 | QR | Abrir tela QR | ✅ Criado |
| B4.2 | QR | Selecionar loja + valor | ✅ Criado |
| B4.3 | QR | Confirmação / QR gerado | ✅ Criado |
| B4.4 | QR | Sucesso + gerar novo | ✅ Criado |
| B4.5 | QR | Erro saldo insuficiente | ✅ Criado |
| B4.6 | QR | Empty state sem saldo | ✅ Criado |

## Testes P1 — Catálogo

| ID | Grupo | Cenário | Status |
|----|-------|---------|--------|
| C1.1 | Contestação | Listar contestações | ✅ Criado |
| C1.2 | Contestação | Criar nova contestação | ✅ Criado |
| C1.3 | Contestação | Filtrar por status | ✅ Criado |
| C1.4 | Contestação | Acompanhar contestação | ✅ Criado |
| C2.1 | Perfil | Editar dados | ✅ Criado |
| C2.2 | Perfil | Alterar senha | ✅ Criado |
| C2.3 | Perfil | Preferências notificação | ✅ Criado |
| C2.4 | Perfil | Menu completo + sessões | ✅ Criado |
| C3.1 | Push | Lista notificações | ✅ Criado |
| C3.2 | Push | Marcar todas lidas | ✅ Criado |
| C3.3 | Push | Badge count + navegação | ✅ Criado |

### Scripts P1
```bash
npm run test:e2e:mobile:p1              # Apenas P1
npm run test:e2e:mobile:all             # P0 + P1
maestro test maestro/flows/p1/contestacao/  # Grupo específico
```

## Maestro Cloud (execução remota)

Alternativa ao emulador local — executa flows em dispositivos reais na nuvem.

### Setup
1. Criar conta em [cloud.mobile.dev](https://cloud.mobile.dev) (free tier: 100 flows/mês)
2. Gerar API key
3. Configurar: `export MAESTRO_CLOUD_API_KEY=<key>`
4. Ter APK do app buildado

### Executar
```bash
bash scripts/maestro-cloud.sh          # P0 tests
bash scripts/maestro-cloud.sh p1       # P1 tests
bash scripts/maestro-cloud.sh all      # Todos
```

### CI via Maestro Cloud
O workflow `e2e.yml` usa emulador local no GitHub Actions. Para usar Maestro Cloud:
- Adicionar secret `MAESTRO_CLOUD_API_KEY` no repo
- Substituir `maestro test` por `maestro cloud` no workflow

## Próximas etapas

### P2 (~11 testes)
- Offline state (4): banner, cache saldo, retry, sync
- Deep links (3): abrir transação, contestação, perfil
- Navegação (4): tab bar, stack, back gesture, estado preservado

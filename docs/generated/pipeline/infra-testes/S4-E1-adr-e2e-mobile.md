# ADR: E2E Testing para cash-mobile

## Status
**GO CONDICIONAL** — Maestro (somente)

## Contexto
O cash-mobile é um projeto React Native com Expo managed workflow (sem diretórios `ios/` e `android/` nativos). Builds são gerados via EAS CLI. O ambiente de desenvolvimento local é Windows 11, sem acesso a simuladores iOS (xcrun indisponível) e sem emuladores Android configurados localmente.

Foram investigados três frameworks E2E: Detox, Maestro e Appium. Apenas Maestro já possui artefatos no repositório.

## Frameworks Avaliados

| Framework | Presente | Config | Flows | Complexidade Setup | CI Cost |
|-----------|----------|--------|-------|-------------------|---------|
| Detox     | N        | N      | 0     | G — requer eject do Expo, builds nativos, configs por plataforma | Alto (~30min/run, máquina macOS) |
| Maestro   | **S**    | **S**  | **8** | P — já configurado, flows YAML declarativos | Médio (~10min/run, requer device/emulador) |
| Appium    | N        | N      | 0     | G — setup Selenium-style, drivers por plataforma, flaky | Alto (~40min/run, infraestrutura pesada) |

## Evidências

### Maestro — já implementado
- **8 flows** em `maestro/flows/`:
  1. `01_login_dashboard.yaml` — login, saldo, pull-to-refresh, logout
  2. `02_gerar_cashback.yaml` — geração de cashback
  3. `03_qrcode_flow.yaml` — fluxo QR code
  4. `04_registro_consumidor.yaml` — registro de consumidor
  5. `05_extrato_filtros.yaml` — extrato com filtros
  6. `06_notificacoes.yaml` — notificações
  7. `07_perfil_consumidor.yaml` — perfil do consumidor
  8. `08_merchant_dashboard.yaml` — dashboard do lojista
- `appId: com.h4alex.cashback` — identificador configurado
- Flows usam testIds (`id: "input-email"`) e textos visíveis — boa prática

### Detox — inviável no curto prazo
- Expo managed não possui `ios/` nem `android/` — Detox requer acesso nativo
- Seria necessário `expo prebuild` (eject parcial) para gerar diretórios nativos
- Complexidade de manutenção alta com Expo updates

### Appium — descartado
- Nenhum artefato presente
- Overhead de setup desproporcional para o tamanho do projeto
- Historicamente flaky em CI

## Decisão
**GO CONDICIONAL para Maestro** — o framework já está parcialmente implementado com 8 flows cobrindo os fluxos críticos do app. A decisão é condicional porque:

1. **Execução local** requer emulador Android ou dispositivo físico (indisponível no ambiente Windows atual)
2. **CI** requer máquina com emulador (GitHub Actions com `reactivecircus/android-emulator-runner` ou Maestro Cloud)
3. Os flows existentes precisam ser validados contra a versão atual do app

**NO-GO para Detox e Appium** — custo-benefício desfavorável.

## Consequências

### Maestro (GO condicional):
- Próximos passos:
  1. Configurar emulador Android local ou usar Maestro Cloud para validação
  2. Validar os 8 flows existentes contra build atual (`eas build --profile development`)
  3. Adicionar step de Maestro no CI (GitHub Actions) com Android emulator
  4. Documentar processo de criação de novos flows
- Timeline: 2-3 sprints para CI estável
- Custo estimado CI: ~$50-100/mês (Maestro Cloud) ou ~10min/run em self-hosted

### Detox e Appium (NO-GO):
- Alternativa: expandir cobertura unitária e de integração (Jest) — coberto pelo roadmap E5
- Revisitar Detox em: 6 meses (se houver necessidade de eject do Expo)

## Critérios de Decisão
1. ✅ Framework já configurado? — Maestro sim (8 flows)
2. ⚠️ Emuladores no CI? — Requer configuração
3. ⚠️ Custo mensal CI — Médio (~$50-100/mês ou self-hosted)
4. ✅ ROI — Alto (flows já cobrem fluxos críticos, investimento incremental baixo)

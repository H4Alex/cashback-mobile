# Framework de Pilares Mobile — React Native + Expo

## Sobre este Framework

Este documento define os **16 Pilares de Qualidade Mobile** para avaliação, construção e code review de aplicações React Native com Expo. Cada pilar é um eixo independente de análise com critérios objetivos, organizados em três níveis de maturidade:

| Nível              | Descrição                 | Quando atingir     |
| ------------------ | ------------------------- | ------------------ |
| 🟢 **Essencial**   | Mínimo para ir a produção | MVP / Sprint final |
| 🟡 **Recomendado** | Qualidade profissional    | Pós-MVP imediato   |
| 🔴 **Avançado**    | Excelência / escala       | Versões futuras    |

### Como usar este framework

- **Na análise (Fases 1-3)**: Use os pilares como checklist para identificar gaps no backend/frontend existente em relação às necessidades mobile.
- **Na spec (Fase 4)**: Use os pilares para garantir que cada sprint endereça os critérios essenciais.
- **No desenvolvimento**: Use como referência para code review e definição de "done".
- **Na auditoria**: Use para avaliar a maturidade do app em cada eixo.

---

## Pilar 1 — Arquitetura e Estrutura de Projeto

> Como o projeto é organizado, quais padrões arquiteturais são adotados e como a base de código escala com o crescimento de features.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] Estrutura de pastas clara e consistente (feature-based ou domain-based)
- [ ] Separação de responsabilidades: UI / lógica de negócio / data / serviços
- [ ] Expo managed workflow configurado corretamente (app.json/app.config.ts)
- [ ] TypeScript strict mode habilitado em todo o projeto
- [ ] Path aliases configurados (evitar imports relativos profundos `../../../`)
- [ ] Variáveis de ambiente por ambiente (dev, staging, production) via `expo-constants` ou `react-native-config`
- [ ] `.gitignore` adequado (sem node_modules, builds locais, .env com secrets)

**🟡 Recomendado**

- [ ] Padrão de barrels (index.ts) para exportação limpa de módulos
- [ ] Inversão de dependência: services abstraídos por interfaces (facilita testes e mock)
- [ ] Configuração centralizada (API URLs, feature toggles, timeouts) em um único módulo
- [ ] Monorepo ou pacote compartilhado para tipos comuns com web (se aplicável)
- [ ] Documentação inline (JSDoc) em funções públicas de services e hooks
- [ ] Scripts npm/yarn padronizados (lint, test, build, type-check)

**🔴 Avançado**

- [ ] Módulos carregados sob demanda (lazy loading de telas/features)
- [ ] Plugin architecture para features opcionais
- [ ] Geração automática de tipos a partir da API (OpenAPI → TypeScript)
- [ ] Análise estática de dependências circulares automatizada no CI

### Antipadrões a Evitar

- Lógica de negócio diretamente nos componentes de tela
- Arquivos com mais de 300 linhas sem justificativa
- Imports cruzados entre features (feature A importando internals de feature B)
- Mistura de configuração de ambiente hardcoded no código

---

## Pilar 2 — Navegação e Roteamento

> Como o usuário se move entre telas, como o estado de navegação é gerenciado e como deep links são tratados.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] Biblioteca de navegação definida e configurada (Expo Router ou React Navigation)
- [ ] Separação clara entre stacks: Auth (não autenticado) vs. Main (autenticado)
- [ ] Bottom Tab Navigation funcional para os fluxos principais de cada perfil
- [ ] Stack navigation para fluxos de drill-down (lista → detalhe)
- [ ] Navigation guards: redirecionamento automático baseado em estado de auth
- [ ] Animações de transição padrão da plataforma (iOS slide, Android fade)
- [ ] Tela de fallback/404 para rotas inválidas
- [ ] Back button hardware (Android) tratado corretamente em cada contexto

**🟡 Recomendado**

- [ ] Deep linking configurado (app abre na tela correta via URL externa)
- [ ] Universal links (iOS) e App Links (Android) para domínios próprios
- [ ] Navegação por modal/bottom sheet para ações rápidas (QR Code, confirmações)
- [ ] Persistência de estado de navegação (restaurar tela após crash/kill)
- [ ] Tipagem forte de parâmetros de rota (type-safe navigation)
- [ ] Nested navigators organizados por domínio funcional
- [ ] Transições customizadas para fluxos especiais (onboarding, resgate)

**🔴 Avançado**

- [ ] Navigation analytics: tracking automático de screen views
- [ ] Conditional navigation baseada em feature flags
- [ ] Animated shared element transitions entre telas
- [ ] Prefetch de dados da próxima tela provável (predictive loading)

### Antipadrões a Evitar

- Navegação imperativa espalhada pelos componentes (`navigation.navigate` em 50 lugares)
- Passar dados complexos via params de rota (usar ID + fetch na tela destino)
- Stacks profundos demais (mais de 5 níveis sem necessidade)
- Misturar lógica de auth dentro dos componentes de navegação

---

## Pilar 3 — Gerenciamento de Estado

> Como dados são armazenados, compartilhados e sincronizados entre componentes, telas e camadas da aplicação.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] Distinção clara entre os três tipos de estado:
  - **Estado local**: `useState` / `useReducer` (dados de um único componente)
  - **Estado global**: Zustand / Context (auth, preferências, device info)
  - **Estado do servidor**: TanStack React Query (dados vindos da API)
- [ ] Server state gerenciado exclusivamente via React Query (nunca duplicar dados da API em stores globais)
- [ ] Auth state em store dedicado com persistência segura (expo-secure-store)
- [ ] Loading, error e empty states tratados de forma consistente para cada query
- [ ] Optimistic updates para ações frequentes (favoritar, marcar como lido)

**🟡 Recomendado**

- [ ] Store slices separados por domínio (useAuthStore, usePreferencesStore, useDeviceStore)
- [ ] Selectors derivados para evitar re-renders desnecessários
- [ ] React Query: staleTime e gcTime configurados por tipo de dado (dados financeiros: staleTime curto; dados estáticos: staleTime longo)
- [ ] Mutation hooks centralizados com invalidação automática de queries relacionadas
- [ ] Persistência de cache React Query em MMKV para restauração rápida de tela ao reabrir app
- [ ] Hydration strategy: exibir dados do cache primeiro, atualizar em background

**🔴 Avançado**

- [ ] State machines (XState) para fluxos complexos multi-step (resgate, onboarding)
- [ ] Middleware de logging/debugging para stores em ambiente dev
- [ ] Sync automático de estado entre abas/instâncias (se aplicável via background fetch)
- [ ] Rollback automático em caso de falha em optimistic updates

### Antipadrões a Evitar

- "State blob": um único store global com todos os dados do app
- Duplicar dados da API em Zustand (React Query já é o cache)
- Persistir dados sensíveis (tokens, senhas) em AsyncStorage/MMKV sem criptografia
- Não tratar stale data (exibir dados de cache velho como se fossem atuais sem indicação)

---

## Pilar 4 — Camada de Rede e API

> Como o app se comunica com o backend, trata erros de rede, gerencia autenticação de requests e lida com conectividade instável.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] Instância HTTP centralizada (Axios ou fetch wrapper) com configuração base:
  - baseURL por ambiente (dev, staging, prod)
  - Timeout configurado (ex: 15s para requests normais, 60s para uploads)
  - Headers padrão (Content-Type, Accept, Accept-Language)
- [ ] Interceptor de request: injeção automática do JWT no header Authorization
- [ ] Interceptor de response: tratamento centralizado de erros HTTP (401, 403, 500, network error)
- [ ] Refresh token flow: renovação automática e transparente ao receber 401
  - Queue de requests pendentes durante refresh (evitar múltiplos refreshes simultâneos)
  - Logout automático se refresh também falhar
- [ ] Service layer tipado: funções por domínio retornando tipos TypeScript (`authService.login(credentials): Promise<AuthResponse>`)
- [ ] Tratamento de erro de rede: detecção de offline e feedback ao usuário

**🟡 Recomendado**

- [ ] Request/response logging em ambiente dev (removido em produção)
- [ ] Retry automático com exponential backoff para erros 5xx e network errors
- [ ] Rate limiting client-side para evitar spam de requests
- [ ] Cancel de requests ao desmontar componente (AbortController)
- [ ] Detecção de tipo de conexão (WiFi vs. cellular) para adaptar comportamento (ex: adiar uploads grandes em cellular)
- [ ] Cache-Control e ETag/If-None-Match para endpoints que suportam
- [ ] Request deduplication (React Query já faz isso, mas garantir que services não duplicam)

**🔴 Avançado**

- [ ] Certificate pinning (SSL pinning) para endpoints sensíveis
- [ ] Request signing (HMAC) para endpoints financeiros críticos
- [ ] GraphQL/partial response para otimizar payload em telas com necessidades específicas
- [ ] WebSocket ou SSE para dados real-time (saldo atualizado, notificações)
- [ ] Background sync queue: requests feitos offline são enfileirados e enviados quando online

### Antipadrões a Evitar

- Chamadas diretas ao Axios/fetch dentro de componentes (sem service layer)
- Token hardcoded ou armazenado em plain text
- Ignorar erros de rede silenciosamente (catch vazio)
- Múltiplas instâncias Axios com configurações diferentes e inconsistentes
- Não cancelar requests ao sair da tela (memory leaks e race conditions)

---

## Pilar 5 — Autenticação e Segurança

> Como o app protege dados do usuário, gerencia sessões, implementa autenticação biométrica e defende contra ameaças comuns a apps mobile.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] Tokens JWT armazenados exclusivamente em `expo-secure-store` (nunca AsyncStorage/MMKV)
- [ ] Fluxo completo de auth: login → token storage → auto-refresh → logout (limpar todos os dados)
- [ ] Logout limpa: tokens, cache React Query, stores Zustand, dados sensíveis do secure-store
- [ ] Proteção de telas: guard de navegação que redireciona para login se token ausente/expirado
- [ ] Validação de inputs em formulários de auth (email format, senha forte, sanitização)
- [ ] Timeout de sessão: auto-logout após inatividade prolongada (configurável)
- [ ] HTTPS obrigatório em toda comunicação com a API (sem exceções)

**🟡 Recomendado**

- [ ] Autenticação biométrica (expo-local-authentication):
  - Verificar disponibilidade/hardware no device
  - Enroll: vincular biometria ao device após login com senha
  - Login rápido via biometria (fluxo separado do login por senha)
  - Fallback para senha/PIN se biometria falhar
  - Confirmação biométrica para operações sensíveis (resgate de cashback)
- [ ] Gerenciamento de múltiplos dispositivos (API de device registration)
- [ ] Detecção de jailbreak/root (expo-device ou lib dedicada) com aviso ao usuário
- [ ] Ofuscação do bundle JS em builds de produção (via Hermes bytecode)
- [ ] Mascaramento de dados sensíveis na tela (saldo, CPF) com opção de exibir
- [ ] Prevenção de screenshot em telas sensíveis (FLAG_SECURE no Android, UITextField no iOS)
- [ ] Certificate pinning para endpoints financeiros

**🔴 Avançado**

- [ ] MFA (Multi-Factor Authentication): SMS/email como segundo fator
- [ ] Device fingerprinting para detecção de fraude
- [ ] App attestation (Play Integrity API / App Attest)
- [ ] Anti-tampering: detecção de modificação do app bundle
- [ ] Runtime protection: detecção de debugger e Frida/hooking

### Antipadrões a Evitar

- Armazenar tokens em AsyncStorage (não criptografado por padrão)
- Logout que deixa dados em cache (React Query, stores, storage)
- Confiar apenas no biométrico sem fallback de senha
- Exibir dados sensíveis completos sem mascaramento (CPF, saldo) por padrão
- Desabilitar SSL em ambiente de dev e esquecer de reativar (forçar HTTPS em todos os envs)

---

## Pilar 6 — UI/UX e Design System

> Como a interface é construída, como a consistência visual é mantida e como a experiência é adaptada para contexto mobile.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] Design system definido com componentes base:
  - Typography (hierarchy: h1-h6, body, caption, label)
  - Colors (primary, secondary, semantic: success/error/warning/info, surface, background)
  - Spacing scale (4, 8, 12, 16, 24, 32, 48...)
  - Button (variantes: primary, secondary, outline, ghost, danger; tamanhos: sm, md, lg)
  - Input (text, password, masked — CPF/CNPJ/phone/currency)
  - Card, Badge, Avatar, Divider, Skeleton
- [ ] Componentes com props tipadas (interfaces TypeScript explícitas)
- [ ] Touch targets mínimos de 44x44pt (Apple HIG) / 48x48dp (Material)
- [ ] Feedback tátil em ações (haptics em botões de confirmação/erro)
- [ ] Loading states: skeletons para conteúdo, spinners para ações
- [ ] Empty states: ilustração + mensagem + ação primária
- [ ] Error states: mensagem clara + ação de retry
- [ ] Pull-to-refresh em listas de dados do servidor
- [ ] Teclado: scroll automático para campo ativo, botão submit acessível, tipo de teclado correto (numeric, email, etc.)

**🟡 Recomendado**

- [ ] Dark mode funcional (React Native Paper theming ou context-based)
- [ ] Animações de micro-interação (Reanimated):
  - Botão: press scale feedback
  - Cards: entrada com fade/slide
  - Listas: animação de inserção/remoção
  - Transições entre estados (loading → loaded → error)
- [ ] Responsive design: adaptação para tablets e telas grandes (se aplicável)
- [ ] Safe area handling correto (expo-safe-area-context): notch, home indicator, status bar
- [ ] Gestos nativos: swipe-to-delete, swipe-to-action em listas
- [ ] Bottom sheets para ações contextuais (mais natural que modais no mobile)
- [ ] Formatação localizada: moeda (R$), data (dd/MM/yyyy), números (separador de milhar)

**🔴 Avançado**

- [ ] Temas customizáveis pelo usuário (além de light/dark)
- [ ] Design tokens sincronizados com Figma via Style Dictionary ou similar
- [ ] Storybook mobile para catálogo de componentes
- [ ] Animações complexas: shared element transitions, layout animations
- [ ] Suporte a Dynamic Type (iOS) e font scaling (Android)

### Antipadrões a Evitar

- Portar layout web diretamente para mobile (tabelas, sidebars, layouts largos)
- Touch targets menores que 44pt (frustração do usuário)
- Não tratar safe areas (conteúdo sob notch ou home indicator)
- Usar Alert.alert para tudo (bottom sheets e inline feedback são mais naturais)
- Cores/tokens hardcoded nos componentes (fora do tema)
- Ignorar teclado: campos cobertos pelo keyboard, sem scroll, sem dismiss

---

## Pilar 7 — Performance e Otimização

> Como o app mantém fluidez, tempo de resposta rápido e uso eficiente de recursos do dispositivo.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] Hermes engine habilitado (padrão no Expo SDK 50+)
- [ ] Listas longas usando FlashList (@shopify/flash-list) ou FlatList com otimizações:
  - `keyExtractor` definido
  - `getItemLayout` (se itens de tamanho fixo)
  - `windowSize` e `initialNumToRender` ajustados
  - `removeClippedSubviews` para listas muito longas
- [ ] Imagens otimizadas:
  - `expo-image` (ou FastImage) ao invés de `<Image>` padrão
  - Cached e com placeholder/blur hash
  - Dimensões explícitas (evitar layout shifts)
  - Formatos otimizados (WebP onde suportado)
- [ ] Sem re-renders desnecessários:
  - `React.memo` em componentes de lista
  - `useCallback` / `useMemo` para callbacks e cálculos pesados passados como props
  - Zustand selectors granulares (selecionar só o campo necessário)
- [ ] Bundle size controlado: apenas importar o que usa de cada biblioteca

**🟡 Recomendado**

- [ ] Performance budgets definidos e monitorados:
  - Cold start: < 2 segundos
  - TTI (Time to Interactive): < 3 segundos
  - Frame rate: 60fps em scroll e animações
  - Memória: < 200MB em uso normal
  - Bundle JS: < 5MB (comprimido)
- [ ] Lazy loading de telas: carregar apenas quando necessário
- [ ] Pagination: cursor-based para listas infinitas (evitar offset em dados que mudam)
- [ ] Debounce em buscas e filtros (300-500ms)
- [ ] Animações usando Reanimated (roda na UI thread, não bloqueia JS thread)
- [ ] Profiling periódico com React DevTools e Flipper

**🔴 Avançado**

- [ ] Startup trace: medir e otimizar cada fase do cold start
- [ ] Code splitting por feature (dynamic imports)
- [ ] Background tasks otimizados (expo-background-fetch) sem drain de bateria
- [ ] Hermes bytecode precompilado no build (já padrão no Expo, mas verificar)
- [ ] Memory leak detection automatizada no CI/testes

### Métricas-Chave

| Métrica             | Target MVP | Target Prod | Ferramenta de medição                |
| ------------------- | ---------- | ----------- | ------------------------------------ |
| Cold start          | < 3s       | < 2s        | Sentry Performance / manual          |
| TTI                 | < 4s       | < 3s        | Custom trace                         |
| Frame rate (scroll) | > 55fps    | > 59fps     | React DevTools / Perf Monitor        |
| JS Bundle           | < 8MB      | < 5MB       | `npx expo export`                    |
| RAM (uso normal)    | < 250MB    | < 200MB     | Xcode Instruments / Android Profiler |
| Crash-free rate     | > 98%      | > 99.5%     | Sentry / Crashlytics                 |

### Antipadrões a Evitar

- FlatList sem `keyExtractor` (re-renders de toda a lista)
- Componente `<Image>` padrão para listas (sem cache, lento)
- Animações no JS thread (Animated API padrão sem `useNativeDriver`)
- Console.log em produção (impacta performance)
- Fetch de todos os dados de uma vez (sem paginação)
- Não medir: se não mede, não sabe se está degradando

---

## Pilar 8 — Persistência e Offline

> Como dados são armazenados localmente, como o app se comporta sem conexão e como o estado é sincronizado quando a conectividade retorna.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] Estratégia de storage definida por tipo de dado:
  - **Dados sensíveis** (tokens, biometric keys): `expo-secure-store`
  - **Dados frequentes** (cache, preferências, último estado): `react-native-mmkv`
  - **Dados pesados** (arquivos, imagens): `expo-file-system`
- [ ] Cache de API via React Query com persistência em MMKV:
  - Dashboard e saldo: cache disponível ao reabrir app
  - Listas: última página visualizada disponível offline
- [ ] Detecção de conectividade (`@react-native-community/netinfo`):
  - Banner ou indicador quando offline
  - Desabilitar ações que requerem rede (resgate, pagamento)
  - Reabilitar e sincronizar quando online
- [ ] Graceful degradation: app não crasha sem conexão, exibe dados do cache

**🟡 Recomendado**

- [ ] Stale-while-revalidate: exibir dados do cache imediatamente, atualizar em background
- [ ] Offline queue: ações do usuário feitas offline são enfileiradas e executadas ao reconectar
- [ ] Indicação visual clara do que é dado "fresco" vs. dado "em cache" (timestamp, badge)
- [ ] Cache eviction strategy: limitar tamanho do cache local, remover dados antigos
- [ ] Migration strategy para schema de dados locais entre versões do app

**🔴 Avançado**

- [ ] Offline-first architecture: app funciona 100% offline para leitura
- [ ] Conflict resolution para dados editados offline por múltiplos dispositivos
- [ ] Background sync periódico (expo-background-fetch) para manter dados frescos
- [ ] SQLite/WatermelonDB para dados estruturados complexos com queries locais

### Antipadrões a Evitar

- Crash ou tela branca quando sem conexão
- Não diferenciar visualmente dados frescos de dados em cache
- Armazenar dados sensíveis em MMKV/AsyncStorage sem criptografia
- Cache infinito sem eviction (storage do device cheio)
- Não testar cenários offline durante desenvolvimento

---

## Pilar 9 — Funcionalidades Nativas e APIs de Plataforma

> Como o app integra com capacidades nativas do dispositivo (câmera, biometria, notificações, sensores) de forma segura e com UX adequada.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] Permissões gerenciadas corretamente:
  - Solicitação just-in-time (pedir permissão no momento do uso, não no app start)
  - Tratamento de permissão negada (explicar por que é necessária, link para Settings)
  - Tratamento de "Don't ask again" (Android) / permissão negada permanentemente
  - Permissões declaradas em app.json/app.config.ts (info.plist e AndroidManifest)
- [ ] Câmera/QR Code (expo-camera ou expo-barcode-scanner):
  - Solicitar permissão antes de abrir
  - Preview da câmera funcional
  - Leitura de QR Code com feedback visual e sonoro/háptico
  - Tratamento de device sem câmera
- [ ] Biometria (expo-local-authentication):
  - Verificar suporte do hardware
  - UI de prompt nativa
  - Fallback gracioso

**🟡 Recomendado**

- [ ] Haptic feedback (expo-haptics) em ações-chave:
  - Sucesso: `notificationAsync(Success)` em resgate confirmado
  - Erro: `notificationAsync(Error)` em falha de operação
  - Seleção: `selectionAsync()` em tabs e toggles
- [ ] Share API (expo-sharing) para compartilhar comprovantes, links de indicação
- [ ] Clipboard API para copiar códigos, chaves Pix, etc.
- [ ] App state lifecycle (AppState API):
  - Refresh de dados ao voltar do background
  - Pausar operações pesadas ao ir para background
  - Limpar dados sensíveis da tela ao ir para background (privacy)

**🔴 Avançado**

- [ ] Geolocalização (expo-location) para lojas próximas
- [ ] Widgets (expo-widgets, experimental) para saldo na home screen
- [ ] NFC para pagamentos ou check-in em lojas
- [ ] In-app review prompt (expo-store-review) após ações positivas

### Antipadrões a Evitar

- Pedir todas as permissões no primeiro launch (assusta o usuário)
- Não tratar device sem feature nativa (crash ao tentar usar câmera inexistente)
- Ignorar app state lifecycle (dados desatualizados ao voltar do background)
- Não limpar dados sensíveis da tela ao ir para background

---

## Pilar 10 — Push Notifications

> Como notificações são implementadas, gerenciadas e usadas para engajamento sem ser invasivas.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] Setup completo de push notifications (expo-notifications):
  - Registro de device token (Expo Push Token ou FCM/APNs nativo)
  - Envio do token para o backend (endpoint de device registration)
  - Tratamento de notificação recebida com app em foreground
  - Tratamento de notificação recebida com app em background
  - Tratamento de tap na notificação (deep link para tela relevante)
- [ ] Permissão de notificação solicitada em momento contextual (após primeira ação relevante, não no primeiro launch)
- [ ] Unregister do device token no logout

**🟡 Recomendado**

- [ ] Categorias de notificação (o usuário pode escolher quais receber):
  - Transações (cashback recebido, resgate confirmado)
  - Promoções (novas ofertas de lojistas)
  - Sistema (atualizações, segurança)
- [ ] Notification channels (Android): agrupamento por categoria com configuração de som/vibração
- [ ] Badge count no ícone do app (notificações não lidas)
- [ ] Tela de histórico de notificações in-app (não depender apenas do notification center do OS)
- [ ] Rich notifications: imagem, ações inline (Android), actionable notifications

**🔴 Avançado**

- [ ] Notificações agendadas localmente (lembretes, expiração de cashback)
- [ ] A/B testing de copy de notificações
- [ ] Analytics de notificação: delivered, opened, converted
- [ ] Silent push para sincronização de dados em background

### Antipadrões a Evitar

- Pedir permissão de notificação no primeiro launch (baixa taxa de aceite)
- Enviar notificações excessivas (causa desinstalação)
- Não tratar tap na notificação (abre o app na home ao invés da tela relevante)
- Não remover o token no logout (usuário recebe notificações de outra conta)
- Ignorar notification channels no Android (vai para canal "Miscellaneous")

---

## Pilar 11 — Testes e Qualidade

> Como a qualidade do código e das features é verificada automaticamente em diferentes camadas.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] Framework de testes configurado e funcional:
  - Jest + React Native Testing Library para testes unitários e de componente
  - Cobertura mínima de testes nos services (API layer) e hooks de negócio
- [ ] Testes unitários:
  - Services: testar chamadas à API com mock do Axios (requests e error handling)
  - Stores: testar actions e selectors do Zustand
  - Utils: testar formatters, validators, helpers
- [ ] Testes de componente:
  - Componentes do design system (Button, Input, Card) com seus estados/variantes
  - Formulários: validação, submit, error states
- [ ] Type checking: `tsc --noEmit` passa sem erros
- [ ] Lint: ESLint configurado com regras para React Native (sem erros em CI)

**🟡 Recomendado**

- [ ] Testes de integração:
  - Fluxos completos (login → dashboard → ação) com MSW (Mock Service Worker)
  - Navegação: verificar que ações levam às telas corretas
- [ ] Snapshot tests para componentes estáveis do design system
- [ ] Cobertura de código: target de 70%+ em services/hooks, 50%+ em componentes
- [ ] Pre-commit hooks: lint-staged + type-check antes de cada commit
- [ ] Testes de acessibilidade automatizados (labels, roles, contrast)

**🔴 Avançado**

- [ ] E2E tests com Maestro ou Detox:
  - Fluxo de login completo
  - Fluxo de resgate de cashback
  - Cenários de erro (offline, token expirado)
- [ ] Visual regression testing (componentes do design system)
- [ ] Performance testing automatizado (startup time, frame rate)
- [ ] Testes em CI para múltiplas versões de OS (matrix testing)
- [ ] Chaos testing: simular condições adversas (rede lenta, respostas parciais)

### Antipadrões a Evitar

- Zero testes ("funciona no meu device")
- Testes que testam implementação ao invés de comportamento
- Snapshot tests em componentes que mudam frequentemente (snapshots quebram toda hora)
- Testes que dependem de estado compartilhado (ordem de execução importa)
- Mocks que não refletem o contrato real da API

---

## Pilar 12 — CI/CD e Distribuição

> Como o app é buildado, testado, distribuído e atualizado de forma automatizada e confiável.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] EAS Build configurado com profiles:
  - `development`: build de dev com dev client
  - `preview`: build para testers internos (TestFlight / Internal Track)
  - `production`: build para stores
- [ ] CI pipeline (GitHub Actions ou equivalente):
  - Roda em todo PR: lint, type-check, testes
  - Bloqueia merge se falhar
- [ ] Versionamento semântico: app version e build number incrementados automaticamente
- [ ] Variáveis de ambiente segregadas por profile (API URL, feature flags)
- [ ] Builds de preview distribuídos para QA/testers via EAS

**🟡 Recomendado**

- [ ] OTA Updates via EAS Update:
  - Atualizações JS sem passar pela revisão da store
  - Canais de update: production, staging, preview
  - Rollback capability: voltar para update anterior se detectar problema
- [ ] CD pipeline: build e submit automático ao mergear na branch main/release
- [ ] Automated store submission via EAS Submit
- [ ] Changelog automático baseado em conventional commits
- [ ] Branch preview builds: cada PR gera um build de preview para teste

**🔴 Avançado**

- [ ] Staged rollout: OTA update para 10% → 50% → 100% dos usuários
- [ ] Canary releases: build separado para beta testers
- [ ] Automated rollback: detectar aumento de crash rate e reverter OTA automaticamente
- [ ] Build caching no CI para reduzir tempo de build
- [ ] Multi-environment deployments (dev, staging, production) com pipelines separados

### Antipadrões a Evitar

- Build manual na máquina do dev para produção
- Sem CI: merge direto na main sem checks
- Mesmo bundle de produção para todos os ambientes (staging apontando para prod)
- Não usar OTA quando disponível (forçar o usuário a atualizar pela store para bugfixes JS)
- Secrets em plain text no repositório

---

## Pilar 13 — Monitoramento e Observabilidade

> Como erros, crashes, performance e comportamento do app são detectados, reportados e diagnosticados em produção.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] Crash reporting configurado (Sentry ou Firebase Crashlytics):
  - Captura automática de JS errors e native crashes
  - Source maps enviados para simbolização do stack trace
  - Breadcrumbs: trail de ações do usuário antes do crash
  - Informações de contexto: device, OS version, app version, user ID (anonimizado)
  - Alertas configurados para novos crashes e aumentos de crash rate
- [ ] Crash-free rate monitorado (target: > 99%)
- [ ] Erros de API logados com contexto (endpoint, status code, response body)

**🟡 Recomendado**

- [ ] Performance monitoring:
  - App start time (cold/warm)
  - Screen load time por tela
  - HTTP request duration por endpoint
  - Frame rate drops (slow/frozen frames)
- [ ] Analytics de uso (amplitude, mixpanel ou similar):
  - Screen views (navegação do usuário)
  - Eventos de negócio (resgate, transação, cadastro)
  - Funil de conversão (registro → primeira transação → primeiro resgate)
  - Eventos por perfil (consumidor vs. lojista)
- [ ] Dashboards de saúde do app: crash rate, ANR rate, performance por versão
- [ ] Alertas proativos: crash rate > threshold, latência de API > threshold

**🔴 Avançado**

- [ ] Distributed tracing: correlacionar request do app com logs do backend
- [ ] User session replay (Sentry Session Replay ou equivalente)
- [ ] Custom performance metrics (tempo do fluxo de resgate, etc.)
- [ ] Alertas inteligentes: detecção de anomalias (não apenas thresholds fixos)
- [ ] A/B testing integrado com analytics

### Antipadrões a Evitar

- App em produção sem crash reporting ("os usuários vão avisar")
- Source maps não enviados (stack traces ilegíveis em produção)
- Logar dados sensíveis (PII, tokens, senhas)
- Não segmentar métricas por versão do app (não saber se v2.1 é pior que v2.0)
- Analytics sem propósito (trackar tudo sem saber o que analisar)

---

## Pilar 14 — Acessibilidade

> Como o app é utilizável por pessoas com deficiências visuais, motoras, auditivas ou cognitivas.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] Labels de acessibilidade em todos os elementos interativos:
  - `accessibilityLabel`: descrição para screen reader
  - `accessibilityRole`: tipo do elemento (button, link, header, image, etc.)
  - `accessibilityHint`: o que acontece ao interagir (quando não óbvio pelo label)
- [ ] Hierarquia de headings: títulos de tela marcados como headers para navegação rápida
- [ ] Touch targets: mínimo 44x44pt (iOS) / 48x48dp (Android)
- [ ] Contraste de cores: ratio mínimo 4.5:1 para texto normal, 3:1 para texto grande
- [ ] Imagens decorativas: `accessibilityElementsHidden` ou `importantForAccessibility="no"`
- [ ] Feedback não-visual: ações confirmadas com haptics e/ou `accessibilityLiveRegion`

**🟡 Recomendado**

- [ ] Navegação completa via VoiceOver (iOS) e TalkBack (Android):
  - Ordem de leitura lógica
  - Agrupamento de elementos relacionados (`accessibilityElementsHidden`, `importantForAccessibility`)
  - Ações customizadas (`accessibilityActions`)
- [ ] Suporte a Dynamic Type (iOS) e font scaling (Android): texto escala com preferência do sistema
- [ ] Reduce Motion: respeitar `AccessibilityInfo.isReduceMotionEnabled()` e simplificar animações
- [ ] Foco automático no elemento principal ao navegar para nova tela
- [ ] Formulários: labels associados a inputs, erros anunciados para screen reader

**🔴 Avançado**

- [ ] Testes automatizados de acessibilidade no CI
- [ ] Auditoria com usuários reais de tecnologias assistivas
- [ ] Switch Control support (iOS)
- [ ] RTL (Right-to-Left) layout support (se internacionalização incluir árabe, hebraico)

### Antipadrões a Evitar

- Elementos interativos sem `accessibilityLabel` (screen reader lê "button" sem contexto)
- Ícones-only sem label (usuário não sabe o que faz)
- Informação transmitida apenas por cor (daltônicos não distinguem)
- Ignorar font scaling (layout quebra quando usuário aumenta tamanho de fonte)
- Animações agressivas sem respeitar Reduce Motion

---

## Pilar 15 — Internacionalização (i18n)

> Como o app suporta múltiplos idiomas e localidades de forma escalável e mantém consistência com o ecossistema web.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] i18next configurado e funcional com detecção de idioma do dispositivo
- [ ] Toda string visível ao usuário vem de arquivos de tradução (zero hardcoded)
- [ ] Estrutura de namespaces organizada por domínio (auth, dashboard, cashback, common)
- [ ] Arquivos de tradução compartilhados ou sincronizados com o frontend web
- [ ] Idiomas suportados: pt-BR (padrão) e en
- [ ] Formatação localizada:
  - Moeda: `R$ 1.234,56` (pt-BR) / `$1,234.56` (en) — via `Intl.NumberFormat`
  - Data: `17/02/2026` (pt-BR) / `02/17/2026` (en) — via `Intl.DateTimeFormat` ou date-fns
  - Números: separadores de milhar e decimal corretos por locale

**🟡 Recomendado**

- [ ] Interpolação e pluralização configuradas (`{{count}} item` / `{{count}} items`)
- [ ] Fallback chain: pt-BR → pt → en (se chave não encontrada)
- [ ] Layout adaptável a textos mais longos (alemão pode ser 40% mais longo que inglês)
- [ ] Persistência da preferência de idioma do usuário (MMKV)
- [ ] Troca de idioma em runtime sem restart do app

**🔴 Avançado**

- [ ] Over-the-air translation updates (sem rebuild do app)
- [ ] Integração com plataforma de tradução (Crowdin, Lokalise, Phrase)
- [ ] RTL layout support
- [ ] Variantes regionais (pt-BR vs pt-PT se necessário)

### Antipadrões a Evitar

- Strings hardcoded na UI ("Salvar" ao invés de `t('common.save')`)
- Concatenação de strings traduzidas (quebra em idiomas com ordem de palavras diferente)
- Formatação de moeda/data manual (usar sempre APIs de localização)
- Chaves de tradução genéricas demais (`t('label1')` — impossível saber o contexto)

---

## Pilar 16 — Conformidade com App Stores e Distribuição

> Como o app atende aos requisitos das lojas Apple App Store e Google Play Store para aprovação, manutenção e atualização.

### Critérios de Avaliação

**🟢 Essencial**

- [ ] **Apple App Store**:
  - Conta Apple Developer ativa ($99/ano)
  - Privacy Manifest (PrivacyInfo.xcprivacy) declarando APIs acessadas e data collected
  - App Transport Security (ATS): HTTPS obrigatório
  - App icon: 1024x1024 sem transparência/alpha
  - Screenshots para os tamanhos obrigatórios (6.7", 6.5", 5.5" — iPhone; 12.9" — iPad se universal)
  - Descrição, keywords, categoria, classificação etária preenchidos
  - Política de privacidade URL obrigatória
- [ ] **Google Play Store**:
  - Conta Google Play Developer ($25 one-time)
  - Data Safety Form preenchido (equivalente ao Privacy Manifest)
  - Target SDK level atualizado (requisito anual do Google)
  - App icon: 512x512
  - Feature graphic: 1024x500
  - Screenshots para phone e tablet (se aplicável)
  - Política de privacidade URL obrigatória
  - Content rating questionnaire preenchido
- [ ] **Ambas as stores**:
  - Splash screen configurada (expo-splash-screen)
  - App versioning correto (semver + build number)
  - Permissões justificadas (por que o app precisa de câmera, notificações, etc.)

**🟡 Recomendado**

- [ ] LGPD compliance:
  - Tela de consentimento de dados no primeiro uso
  - Opção de download dos dados pessoais
  - Opção de exclusão de conta/dados
  - Política de privacidade acessível dentro do app
- [ ] Processo de review otimizado:
  - Conta demo para review da Apple (credenciais para tester)
  - Notes for reviewer explicando funcionalidades que precisam de auth
  - Sem referências a "beta", "teste", "em desenvolvimento" no app
- [ ] App Store Optimization (ASO):
  - Título otimizado com keywords
  - Screenshots mostrando features-chave com captions
  - Descrição curta e longa otimizadas

**🔴 Avançado**

- [ ] In-app purchases / subscriptions (se modelo de negócio exigir)
  - Apple IAP e Google Play Billing integrados
  - Restore purchases funcional
  - Server-side validation de receipts
- [ ] In-app review prompt (expo-store-review) em momentos de satisfação
- [ ] App Clips (iOS) / Instant Apps (Android) para preview sem instalação
- [ ] Preparação para regulamentações futuras (Digital Markets Act, etc.)

### Antipadrões a Evitar

- Submeter sem Privacy Manifest/Data Safety Form (rejeição automática)
- Screenshots genéricas ou de baixa qualidade
- Não ter conta demo para review da Apple (atrasa aprovação)
- Não declarar permissões adequadamente (rejeição por uso de câmera sem justificativa)
- Referências a plataformas concorrentes no listing da outra store (mencionar Android no listing da Apple e vice-versa)

---

## Matriz de Priorização por Sprint

| Pilar              | Sprint 0 | Sprint 1 | Sprint 2-4 | Sprint 5-7 | Sprint 8 |
| ------------------ | -------- | -------- | ---------- | ---------- | -------- |
| 1. Arquitetura     | 🟢🟡     | —        | —          | —          | Audit    |
| 2. Navegação       | 🟢       | 🟢       | 🟡         | 🟡         | —        |
| 3. Estado          | 🟢       | 🟢       | 🟡         | 🟡         | —        |
| 4. Rede/API        | 🟢       | 🟢🟡     | —          | —          | —        |
| 5. Auth/Segurança  | —        | 🟢       | —          | 🟡         | Audit    |
| 6. UI/UX           | 🟢       | 🟢       | 🟢🟡       | 🟡         | Polish   |
| 7. Performance     | —        | —        | 🟢         | 🟡         | 🟡 Audit |
| 8. Offline/Persist | —        | 🟢       | 🟢         | 🟡         | —        |
| 9. Nativo          | —        | —        | —          | 🟢         | —        |
| 10. Push           | —        | —        | —          | 🟢🟡       | —        |
| 11. Testes         | 🟢 setup | 🟢       | 🟢         | 🟡         | 🟡🔴     |
| 12. CI/CD          | 🟢       | —        | —          | 🟡         | 🟡       |
| 13. Monitoramento  | 🟢 setup | —        | —          | 🟡         | 🟡       |
| 14. Acessibilidade | —        | 🟢       | 🟢         | 🟡         | Audit    |
| 15. i18n           | 🟢       | 🟢       | 🟢         | —          | —        |
| 16. App Stores     | —        | —        | —          | —          | 🟢🟡     |

---

## Score de Maturidade

Use esta tabela para avaliar o app em cada pilar (0-5):

| Score | Significado                                     |
| ----- | ----------------------------------------------- |
| 0     | Não implementado                                |
| 1     | Implementação parcial, com falhas críticas      |
| 2     | Critérios essenciais parcialmente atendidos     |
| 3     | Todos os critérios essenciais (🟢) atendidos    |
| 4     | Essenciais + recomendados (🟢🟡) atendidos      |
| 5     | Todos os níveis atendidos (🟢🟡🔴) — excelência |

**Score mínimo para MVP**: 3 em todos os pilares (todos os 🟢 atendidos)
**Score target para produção madura**: 4+ em pilares 1-8, 3+ nos demais

### Radar de Maturidade

Acompanhe a evolução do app plotando os scores dos 16 pilares em um gráfico radar a cada release. Isso dá visibilidade instantânea de onde investir esforço.

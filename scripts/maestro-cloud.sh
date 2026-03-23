#!/usr/bin/env bash
# Maestro Cloud — Upload e execução remota de testes E2E
# Requer: Maestro CLI instalado + MAESTRO_CLOUD_API_KEY configurada
#
# Uso:
#   bash scripts/maestro-cloud.sh                # P0 tests
#   bash scripts/maestro-cloud.sh p1             # P1 tests
#   bash scripts/maestro-cloud.sh all            # P0 + P1
#   bash scripts/maestro-cloud.sh <path>         # Path específico
#
# Setup:
#   1. Criar conta em https://cloud.mobile.dev
#   2. Gerar API key
#   3. export MAESTRO_CLOUD_API_KEY=<key>
#   4. Ter APK do app em android/app/build/outputs/apk/debug/app-debug.apk
#      Ou usar: eas build --profile development --platform android --local

set -euo pipefail

# Verificar Maestro CLI
if ! command -v maestro &>/dev/null; then
  echo "❌ Maestro CLI não encontrado. Instale com:"
  echo "   curl -Ls 'https://get.maestro.mobile.dev' | bash"
  exit 1
fi

# Verificar API key
if [ -z "${MAESTRO_CLOUD_API_KEY:-}" ]; then
  echo "❌ MAESTRO_CLOUD_API_KEY não configurada."
  echo "   export MAESTRO_CLOUD_API_KEY=<sua-key>"
  echo "   Obtenha em: https://cloud.mobile.dev"
  exit 1
fi

# Encontrar APK
APK_PATH="${APK_PATH:-android/app/build/outputs/apk/debug/app-debug.apk}"
if [ ! -f "$APK_PATH" ]; then
  echo "❌ APK não encontrado em: $APK_PATH"
  echo "   Build com: npx expo prebuild --platform android && cd android && ./gradlew assembleDebug"
  echo "   Ou: eas build --profile development --platform android --local"
  exit 1
fi

# Determinar flows
FLOW_PATH="maestro/flows/p0/"
case "${1:-p0}" in
  p0)   FLOW_PATH="maestro/flows/p0/" ;;
  p1)   FLOW_PATH="maestro/flows/p1/" ;;
  all)  FLOW_PATH="maestro/flows/" ;;
  *)    FLOW_PATH="$1" ;;
esac

echo "🚀 Uploading to Maestro Cloud..."
echo "   APK: $APK_PATH"
echo "   Flows: $FLOW_PATH"

maestro cloud \
  --apiKey "$MAESTRO_CLOUD_API_KEY" \
  --app-file "$APK_PATH" \
  "$FLOW_PATH"

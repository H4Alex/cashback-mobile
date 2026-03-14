#!/usr/bin/env bash
set -e

########################################
# Test Pipeline - Quality Verification
########################################

print_header() {
  echo ""
  echo "========================================"
  echo "  $1"
  echo "========================================"
  echo ""
}

########################################
# Step 1: Type Checking + Linting (parallel)
########################################
print_header "Step 1/3: Type Checking + Linting (parallel)"

npx tsc --noEmit &
TSC_PID=$!

npm run lint &
LINT_PID=$!

TSC_OK=true
LINT_OK=true

wait $TSC_PID || TSC_OK=false
wait $LINT_PID || LINT_OK=false

if [ "$TSC_OK" = false ]; then
  echo "[FAIL] Type Checking"
  exit 1
fi
if [ "$LINT_OK" = false ]; then
  echo "[FAIL] Linting"
  exit 1
fi
echo "[PASS] Type Checking + Linting"

########################################
# Step 2: All Tests (jest)
########################################
print_header "Step 2/3: All Tests (jest --passWithNoTests)"
npx jest --passWithNoTests
echo "[PASS] All Tests"

########################################
# Step 3: Schema + Contract Tests
########################################
print_header "Step 3/3: Schema + Contract Tests"
npx jest --testPathPattern="__tests__/(schemas|contracts)" --passWithNoTests
echo "[PASS] Schema + Contract Tests"

########################################
# Summary
########################################
echo ""
echo "========================================"
echo "  PIPELINE SUMMARY"
echo "========================================"
echo ""
echo "  Results: 3 / 3 steps passed"
echo ""
echo "  All checks passed!"
echo ""

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
# Step 1: Type Checking
########################################
print_header "Step 1/5: Type Checking (tsc --noEmit)"
npx tsc --noEmit
echo "[PASS] Type Checking"

########################################
# Step 2: Linting
########################################
print_header "Step 2/5: Linting (npm run lint)"
npm run lint
echo "[PASS] Linting"

########################################
# Step 3: Unit / Integration Tests
########################################
print_header "Step 3/5: Unit / Integration Tests (jest --passWithNoTests)"
npx jest --passWithNoTests
echo "[PASS] Unit / Integration Tests"

########################################
# Step 4: Schema Tests
########################################
print_header "Step 4/5: Schema Tests (jest --testPathPattern=__tests__/schemas)"
npx jest --testPathPattern=__tests__/schemas --passWithNoTests
echo "[PASS] Schema Tests"

########################################
# Step 5: Contract Tests
########################################
print_header "Step 5/5: Contract Tests (jest --testPathPattern=__tests__/contracts)"
npx jest --testPathPattern=__tests__/contracts --passWithNoTests
echo "[PASS] Contract Tests"

########################################
# Summary
########################################
echo ""
echo "========================================"
echo "  PIPELINE SUMMARY"
echo "========================================"
echo ""
echo "  Results: 5 / 5 steps passed"
echo ""
echo "  All checks passed!"
echo ""

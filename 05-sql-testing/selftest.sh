#!/usr/bin/env bash
# Self-test for the SQL data-validation gate: a gate that can't fail isn't a gate.
# The real files must pass; each planted defect, in a temporary copy, must make check.sh fail.
set -uo pipefail
cd "$(dirname "$0")"

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
failures=0

expect() { # expect <pass|fail> <description> [VAR=value ...]
  local want=$1 what=$2; shift 2
  if env "$@" ./check.sh > "$tmp/out.txt" 2>&1; then got=pass; else got=fail; fi
  if [[ "$got" == "$want" ]]; then
    echo "PASS $what (check.sh ${got}ed as expected)"
  else
    echo "FAIL $what: expected check.sh to $want, it ${got}ed"; sed 's/^/     /' "$tmp/out.txt"
    failures=$((failures + 1))
  fi
}

expect pass "real queries match expected/"

# 1. Drift: one value in an expected result changes.
cp -R expected "$tmp/drift" && sed -i.bak '2s/[0-9]/9/' "$tmp/drift/data-validation.csv" && rm "$tmp/drift/"*.bak
expect fail "a changed value in an expected result" EXPECTED_DIR="$tmp/drift"

# 2. Missing row: the expected result loses its last line.
cp -R expected "$tmp/short" && sed -i.bak '$d' "$tmp/short/analytics.csv" && rm "$tmp/short/"*.bak
expect fail "a missing row in an expected result" EXPECTED_DIR="$tmp/short"

# 3. Broken SQL: a query that doesn't parse must fail, not produce empty output that "matches".
cp -R queries "$tmp/badsql" && printf 'SELEC broken FROM nowhere;\n' > "$tmp/badsql/data-validation.sql"
expect fail "a query with a syntax error" QUERIES_DIR="$tmp/badsql"

# 4. A failing query whose expected output is also empty: only the error itself can fail the run,
#    which proves sqlite errors aren't swallowed (sqlite3 -bail plus pipefail in check.sh).
cp -R queries "$tmp/err-q" && cp -R expected "$tmp/err-e"
printf 'SELECT * FROM no_such_table;\n' > "$tmp/err-q/zz-error.sql" && : > "$tmp/err-e/zz-error.csv"
expect fail "a query error even when the expected output is empty" QUERIES_DIR="$tmp/err-q" EXPECTED_DIR="$tmp/err-e"

if (( failures > 0 )); then
  echo "$failures self-test(s) failed: the SQL gate is not trustworthy"; exit 1
fi
echo "PASS: the SQL gate fails when it should"

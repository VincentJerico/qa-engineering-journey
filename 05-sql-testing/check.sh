#!/usr/bin/env bash
# Runs every query in queries/ against a fresh database built from schema.sql and diffs the output
# against expected/. --update rewrites expected/ instead. QUERIES_DIR and EXPECTED_DIR override the
# folders, which selftest.sh uses to plant defects without touching the real files.
set -euo pipefail
cd "$(dirname "$0")"
QUERIES_DIR="${QUERIES_DIR:-queries}"
EXPECTED_DIR="${EXPECTED_DIR:-expected}"

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
sqlite3 -bail "$tmp/shop.db" < schema.sql

status=0
for query in "$QUERIES_DIR"/*.sql; do
  name=$(basename "$query" .sql)
  # sqlite3's CSV mode ends rows with CRLF on some builds (macOS) and LF on others (Ubuntu); compare
  # on LF. pipefail (above) still fails the run if the query errors.
  sqlite3 -bail -csv -header "$tmp/shop.db" < "$query" | tr -d '\r' > "$tmp/$name.csv"
  if [[ "${1:-}" == "--update" ]]; then
    mkdir -p "$EXPECTED_DIR"
    cp "$tmp/$name.csv" "$EXPECTED_DIR/$name.csv"
    echo "updated $EXPECTED_DIR/$name.csv"
  elif diff -u "$EXPECTED_DIR/$name.csv" "$tmp/$name.csv"; then
    echo "PASS $name"
  else
    echo "FAIL $name (output drifted from $EXPECTED_DIR/$name.csv)"
    status=1
  fi
done
exit $status

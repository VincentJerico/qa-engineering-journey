#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
sqlite3 -bail "$tmp/shop.db" < schema.sql

status=0
for query in queries/*.sql; do
  name=$(basename "$query" .sql)
  sqlite3 -bail -csv -header "$tmp/shop.db" < "$query" > "$tmp/$name.csv"
  if [[ "${1:-}" == "--update" ]]; then
    mkdir -p expected
    cp "$tmp/$name.csv" "expected/$name.csv"
    echo "updated expected/$name.csv"
  elif diff -u "expected/$name.csv" "$tmp/$name.csv"; then
    echo "PASS $name"
  else
    echo "FAIL $name (output drifted from expected/$name.csv)"
    status=1
  fi
done
exit $status

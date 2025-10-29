#!/bin/sh
set -e

# Encontrar el binario de Next.js en la estructura de pnpm
NEXT_BIN=$(find /app/node_modules/.pnpm -name "next" -type f -path "*/bin/next" | head -n 1)

if [ -z "$NEXT_BIN" ]; then
  echo "Error: No se encontró el binario de Next.js"
  exit 1
fi

echo "Iniciando Next.js desde: $NEXT_BIN"
cd /app/apps/web
exec node "$NEXT_BIN" start --hostname 0.0.0.0

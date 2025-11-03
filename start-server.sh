#!/bin/sh
set -e

# Prisma Client ya fue generado durante el build de Docker
# No es necesario regenerarlo en runtime

# Encontrar el binario de Next.js en la estructura de pnpm
NEXT_BIN=$(find /app/node_modules/.pnpm -name "next" -type f -path "*/bin/next" | head -n 1)

if [ -z "$NEXT_BIN" ]; then
  echo "Error: No se encontró el binario de Next.js"
  exit 1
fi

echo "Iniciando Next.js desde: $NEXT_BIN"

# Configurar NODE_PATH para que Next.js encuentre los módulos en pnpm
export NODE_PATH=/app/node_modules:/app/node_modules/.pnpm/node_modules

cd /app/apps/web
exec node "$NEXT_BIN" start --hostname 0.0.0.0

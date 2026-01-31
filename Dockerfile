# Dockerfile para Web Builder con Next.js 15 + Turbopack (standalone mode)
FROM node:20-alpine AS base

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Instalar dependencias necesarias
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copiar archivos de configuración del monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/
COPY packages/ai/package.json ./packages/ai/
COPY apps/web/package.json ./apps/web/

# ===== DEPENDENCIES =====
FROM base AS deps

RUN pnpm install --frozen-lockfile

# ===== BUILDER =====
FROM base AS builder

# Copiar todo desde deps (incluye node_modules con estructura completa de pnpm)
COPY --from=deps /app ./

# Copiar código fuente
COPY . .

# Generar el cliente de Prisma usando la versión del paquete @repo/db
RUN cd packages/db && pnpm exec prisma generate

# Build con Turbo - genera .next/standalone
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN pnpm turbo build --filter=web

# ===== RUNNER =====
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar el output standalone de Next.js (incluye node_modules trazados)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./

# Copiar archivos estáticos de Next.js
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Copiar archivos públicos
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Copiar archivos de Prisma para migraciones
COPY --from=builder --chown=nextjs:nodejs /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder --chown=nextjs:nodejs /app/packages/db/package.json ./packages/db/package.json

# Copiar el cliente generado de Prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Copiar pg y bcryptjs (needed for auth, not auto-detected by standalone)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/pg@8.*/node_modules/pg ./node_modules/pg
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/pg-types@*/node_modules/pg-types ./node_modules/pg-types
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/pg-protocol@*/node_modules/pg-protocol ./node_modules/pg-protocol
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/pg-pool@*/node_modules/pg-pool ./node_modules/pg-pool
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/pgpass@*/node_modules/pgpass ./node_modules/pgpass
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/pg-connection-string@*/node_modules/pg-connection-string ./node_modules/pg-connection-string
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/postgres-bytea@*/node_modules/postgres-bytea ./node_modules/postgres-bytea
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/postgres-date@*/node_modules/postgres-date ./node_modules/postgres-date
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/postgres-interval@*/node_modules/postgres-interval ./node_modules/postgres-interval
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/postgres-array@*/node_modules/postgres-array ./node_modules/postgres-array
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/obuf@*/node_modules/obuf ./node_modules/obuf
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/packet-reader@*/node_modules/packet-reader ./node_modules/packet-reader
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/split2@*/node_modules/split2 ./node_modules/split2
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/bcryptjs@*/node_modules/bcryptjs ./node_modules/bcryptjs

USER nextjs

WORKDIR /app

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Ejecutar el servidor standalone de Next.js
CMD ["node", "apps/web/server.js"]

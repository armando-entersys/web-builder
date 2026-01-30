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

USER nextjs

WORKDIR /app

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Ejecutar el servidor standalone de Next.js
CMD ["node", "apps/web/server.js"]

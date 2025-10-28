# Dockerfile para Web Builder con Next.js 15 + Turbopack
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

# Copiar código fuente (esto sobrescribirá los package.json pero mantendrá node_modules)
COPY . .

# Generar Prisma Client directamente en workspace root
WORKDIR /app/packages/db
RUN pnpm prisma generate

WORKDIR /app

# Build con Turbo
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm turbo build --filter=web

# ===== RUNNER =====
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar standalone completo (incluye node_modules mínimos y servidor)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Copiar node_modules completo de pnpm desde builder (para Prisma y workspace)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm ./node_modules/.pnpm

# Crear symlinks para @prisma y prisma en el root de node_modules
RUN ln -sf /app/node_modules/.pnpm/node_modules/@prisma /app/node_modules/@prisma && \
    ln -sf /app/node_modules/.pnpm/node_modules/prisma /app/node_modules/prisma

# Copiar packages del workspace (necesario para prisma schema)
COPY --from=builder --chown=nextjs:nodejs /app/packages ./packages

# Regenerar Prisma Client en el runner (necesario para standalone)
WORKDIR /app/packages/db
RUN pnpm prisma generate

# Copiar Prisma Client al standalone node_modules también
RUN mkdir -p /app/apps/web/node_modules && \
    cp -r /app/node_modules/.prisma /app/apps/web/node_modules/ && \
    chown -R nextjs:nodejs /app/apps/web/node_modules

WORKDIR /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Usar el servidor standalone de Next.js
CMD ["node", "apps/web/server.js"]

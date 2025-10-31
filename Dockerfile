# Dockerfile para Web Builder con Next.js 15 + Turbopack (sin standalone)
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

# Generar Prisma Client
WORKDIR /app/packages/db
RUN pnpm prisma generate

# Copiar cliente generado a la ubicación donde pnpm lo resuelve
RUN cp -r ../../node_modules/.prisma ../../node_modules/.pnpm/@prisma+client@6.17.1_prisma@6.17.1_typescript@5.9.3__typescript@5.9.3/node_modules/@prisma/ || true

WORKDIR /app

# Build con Turbo
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN pnpm turbo build --filter=web

# ===== RUNNER =====
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar node_modules completo de pnpm
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copiar packages del workspace
COPY --from=builder --chown=nextjs:nodejs /app/packages ./packages

# Copiar aplicación web compilada
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/next.config.ts ./apps/web/next.config.ts

# Copiar archivos de configuración del monorepo
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=nextjs:nodejs /app/turbo.json ./turbo.json

# Copiar script de inicio
COPY start-server.sh /app/start-server.sh
RUN chmod +x /app/start-server.sh && chown nextjs:nodejs /app/start-server.sh

USER nextjs

WORKDIR /app

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Usar script personalizado para encontrar y ejecutar Next.js
CMD ["/app/start-server.sh"]

// En producción, importar desde .prisma/client directamente para evitar problemas con standalone
import { PrismaClient } from process.env.NODE_ENV === 'production' ? '.prisma/client' : '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Export types - siempre desde @prisma/client para TypeScript
export * from '@prisma/client'

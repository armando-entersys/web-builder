// Use dynamic require to avoid webpack bundling issues with Prisma Client
// @ts-ignore - dynamic require
const { PrismaClient } = require('@prisma/client')

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = globalThis

export const prisma =
  // @ts-ignore - globalThis prisma property added dynamically
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// @ts-ignore - globalThis prisma property added dynamically
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Re-export Prisma types using dynamic require
// @ts-ignore - dynamic require
export * from '@prisma/client'

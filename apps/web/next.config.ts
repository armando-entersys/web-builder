import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  // Excluir Prisma y @repo/db del bundling para evitar problemas de inicialización
  serverExternalPackages: ['@prisma/client', '.prisma/client', '@repo/db'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}

export default nextConfig

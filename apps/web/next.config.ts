import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/db'],
  // Excluir Prisma del bundling para evitar problemas de inicialización
  serverExternalPackages: ['@prisma/client', '.prisma/client'],
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

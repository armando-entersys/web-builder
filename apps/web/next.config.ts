import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  // Excluir Prisma y @repo/db del bundling para evitar problemas de inicialización
  serverExternalPackages: ['@prisma/client', '.prisma/client', '@repo/db'],
  // Configurar webpack para external izar Prisma completamente
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externe izar Prisma en server-side para evitar bundling
      config.externals = config.externals || []
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
        '.prisma/client': 'commonjs .prisma/client',
      })
    }
    return config
  },
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

import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  // Excluir Prisma y @repo/db del bundling para evitar problemas de inicialización
  serverExternalPackages: ['@prisma/client', '.prisma/client', '@repo/db'],
  // Configurar webpack para external izar Prisma completamente
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externe izar Prisma y @repo/db completamente con función personalizada
      const originalExternals = config.externals || []

      config.externals = [
        ...Array.isArray(originalExternals) ? originalExternals : [originalExternals],
        // Función que externe liza cualquier import que contenga prisma o @repo/db
        ({ context, request }: any, callback: any) => {
          // Externe lizar completamente @prisma/client, .prisma/client y @repo/db
          if (
            request === '@prisma/client' ||
            request === '.prisma/client' ||
            request === '@repo/db' ||
            request.startsWith('@prisma/client/') ||
            request.startsWith('.prisma/client/') ||
            request.startsWith('@repo/db/')
          ) {
            return callback(null, `commonjs ${request}`)
          }
          callback()
        },
      ]
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

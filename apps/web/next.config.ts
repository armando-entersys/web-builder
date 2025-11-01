import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  // Excluir solo Prisma del bundling, bundlear @repo/db con Next.js
  serverExternalPackages: ['@prisma/client', '.prisma/client'],
  // Configurar webpack para externalizar solo Prisma
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalizar solo Prisma, bundlear @repo/db
      const originalExternals = config.externals || []

      config.externals = [
        ...Array.isArray(originalExternals) ? originalExternals : [originalExternals],
        // Función que externaliza solo @prisma/client y .prisma/client
        // @ts-ignore - webpack externals function
        ({ context, request }, callback) => {
          // Externalizar completamente solo @prisma/client y .prisma/client
          if (
            request === '@prisma/client' ||
            request === '.prisma/client' ||
            request.startsWith('@prisma/client/') ||
            request.startsWith('.prisma/client/')
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

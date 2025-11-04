import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  // Usar standalone mode para mejor manejo de dependencias
  output: 'standalone',
  // Excluir solo Prisma del bundling
  serverExternalPackages: ['@prisma/client', '.prisma/client', '@prisma/engines'],
  // Asegurar que Prisma Client está incluido en el output
  outputFileTracingIncludes: {
    '/api/**/*': [
      '../../node_modules/.prisma/client/**/*',
      '../../node_modules/@prisma/client/**/*',
    ],
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

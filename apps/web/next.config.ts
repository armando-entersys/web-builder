import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/db'],
  output: 'standalone',
  outputFileTracingIncludes: {
    '/api/**/*': ['../../packages/db/prisma/schema.prisma', '../../../node_modules/.prisma/client/**/*', '../../../node_modules/@prisma/client/**/*'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Marcar Prisma Client y @repo/db como externos
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push('@prisma/client', '.prisma/client')
      }
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

import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/db'],
  output: 'standalone',
  outputFileTracingIncludes: {
    '/api/**/*': ['../../packages/db/prisma/schema.prisma', '../../../node_modules/.prisma/client/**/*', '../../../node_modules/@prisma/client/**/*'],
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

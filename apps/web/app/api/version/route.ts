import { NextResponse } from 'next/server'
import packageJson from '@/package.json'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    version: packageJson.version,
    buildTime: process.env.BUILD_TIME || new Date().toISOString(),
  })
}

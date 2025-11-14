import { NextRequest, NextResponse } from 'next/server'
import { logRequest, logError } from './logger'

// Middleware to log all API requests
export async function withApiLogger<T>(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse<T>>,
  req: NextRequest,
  context?: any
): Promise<NextResponse<T>> {
  const startTime = Date.now()
  const method = req.method
  const url = req.url
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

  try {
    // Execute the actual handler
    const response = await handler(req, context)
    const duration = Date.now() - startTime
    const statusCode = response.status

    // Log the request
    logRequest(method, url, statusCode, duration, undefined, ip)

    return response
  } catch (error) {
    const duration = Date.now() - startTime

    // Log the error
    logError(error as Error, {
      method,
      url,
      ip,
      duration: `${duration}ms`,
    })

    // Log the request with error status
    logRequest(method, url, 500, duration, undefined, ip)

    // Re-throw the error to be handled by the error boundary
    throw error
  }
}

// Helper to wrap API route handlers
export function apiLogger<T>(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse<T>>
) {
  return async (req: NextRequest, context?: any): Promise<NextResponse<T>> => {
    return withApiLogger(handler, req, context)
  }
}

// Extract user ID from request (from auth token/session)
export function getUserIdFromRequest(req: NextRequest): string | undefined {
  try {
    // This depends on your auth implementation
    // For NextAuth, you might decode the session token
    // For now, we'll return undefined
    return undefined
  } catch {
    return undefined
  }
}

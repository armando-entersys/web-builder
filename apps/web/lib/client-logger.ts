'use client'

// Client-side logger that sends logs to the server
export enum ClientLogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogData {
  level: ClientLogLevel
  message: string
  metadata?: Record<string, any>
  userAgent?: string
  url?: string
  timestamp: string
}

class ClientLogger {
  private queue: LogData[] = []
  private flushInterval: NodeJS.Timeout | null = null
  private maxQueueSize = 50
  private flushIntervalMs = 10000 // 10 seconds

  constructor() {
    if (typeof window !== 'undefined') {
      // Start auto-flush
      this.startAutoFlush()

      // Flush on page unload
      window.addEventListener('beforeunload', () => {
        this.flush()
      })

      // Listen for global errors
      window.addEventListener('error', (event) => {
        this.error('Global Error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.stack,
        })
      })

      // Listen for unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.error('Unhandled Promise Rejection', {
          reason: event.reason,
          promise: event.promise,
        })
      })
    }
  }

  private startAutoFlush() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }

    this.flushInterval = setInterval(() => {
      this.flush()
    }, this.flushIntervalMs)
  }

  private addToQueue(level: ClientLogLevel, message: string, metadata?: Record<string, any>) {
    const logData: LogData = {
      level,
      message,
      metadata,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      timestamp: new Date().toISOString(),
    }

    this.queue.push(logData)

    // Flush if queue is full
    if (this.queue.length >= this.maxQueueSize) {
      this.flush()
    }
  }

  async flush() {
    if (this.queue.length === 0) return

    const logs = [...this.queue]
    this.queue = []

    try {
      await fetch('/api/logs/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs }),
        // Use keepalive to ensure logs are sent even when page is closing
        keepalive: true,
      })
    } catch (error) {
      // If sending fails, add back to queue (but don't log to avoid infinite loop)
      console.error('Failed to send logs to server:', error)
    }
  }

  error(message: string, metadata?: Record<string, any>) {
    this.addToQueue(ClientLogLevel.ERROR, message, metadata)
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.addToQueue(ClientLogLevel.WARN, message, metadata)
  }

  info(message: string, metadata?: Record<string, any>) {
    this.addToQueue(ClientLogLevel.INFO, message, metadata)
  }

  debug(message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      this.addToQueue(ClientLogLevel.DEBUG, message, metadata)
    }
  }

  // Log React errors
  logReactError(error: Error, errorInfo: { componentStack?: string | null }) {
    this.error('React Error Boundary', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack || 'Not available',
    })
  }

  // Log user actions
  logUserAction(action: string, metadata?: Record<string, any>) {
    this.info(`User Action: ${action}`, metadata)
  }

  // Log API calls
  logApiCall(endpoint: string, method: string, success: boolean, duration: number, error?: string) {
    const level = success ? ClientLogLevel.INFO : ClientLogLevel.ERROR
    this.addToQueue(level, `API Call: ${method} ${endpoint}`, {
      endpoint,
      method,
      success,
      duration: `${duration}ms`,
      error,
    })
  }

  // Log performance metrics
  logPerformance(metricName: string, value: number, metadata?: Record<string, any>) {
    this.info(`Performance: ${metricName}`, {
      value,
      ...metadata,
    })
  }
}

// Export singleton instance
export const clientLogger = new ClientLogger()

// Helper hooks for React components
export function useClientLogger() {
  return clientLogger
}

// Error boundary logger
export function logErrorBoundary(error: Error, errorInfo: React.ErrorInfo) {
  clientLogger.logReactError(error, errorInfo)
}

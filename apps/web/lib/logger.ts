import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import path from 'path'

// Log levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  DEBUG = 'debug',
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
)

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`
    }
    return msg
  })
)

// Log directory
const logsDir = path.join(process.cwd(), 'logs')

// Create daily rotate file transports
const errorFileRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '14d', // Keep logs for 14 days
  format: logFormat,
})

const combinedFileRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d', // Keep logs for 30 days
  format: logFormat,
})

const httpFileRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'http-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'http',
  maxSize: '20m',
  maxFiles: '7d', // Keep HTTP logs for 7 days
  format: logFormat,
})

// Create winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    errorFileRotateTransport,
    combinedFileRotateTransport,
    httpFileRotateTransport,
  ],
})

// If not in production, also log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  )
}

// Helper functions for different log levels
export const log = {
  error: (message: string, meta?: any) => {
    logger.error(message, meta)
  },
  warn: (message: string, meta?: any) => {
    logger.warn(message, meta)
  },
  info: (message: string, meta?: any) => {
    logger.info(message, meta)
  },
  http: (message: string, meta?: any) => {
    logger.http(message, meta)
  },
  debug: (message: string, meta?: any) => {
    logger.debug(message, meta)
  },
}

// Log API request/response
export const logRequest = (
  method: string,
  url: string,
  statusCode: number,
  duration: number,
  userId?: string,
  ip?: string
) => {
  log.http('HTTP Request', {
    method,
    url,
    statusCode,
    duration: `${duration}ms`,
    userId,
    ip,
  })
}

// Log errors with context
export const logError = (error: Error, context?: Record<string, any>) => {
  log.error(error.message, {
    stack: error.stack,
    name: error.name,
    ...context,
  })
}

// Log API calls
export const logApiCall = (
  endpoint: string,
  method: string,
  success: boolean,
  duration: number,
  error?: string
) => {
  const level = success ? 'info' : 'error'
  logger.log(level, 'API Call', {
    endpoint,
    method,
    success,
    duration: `${duration}ms`,
    error,
  })
}

// Log user actions
export const logUserAction = (
  userId: string,
  action: string,
  resource?: string,
  metadata?: Record<string, any>
) => {
  log.info('User Action', {
    userId,
    action,
    resource,
    ...metadata,
  })
}

// Log database queries
export const logDatabaseQuery = (
  query: string,
  duration: number,
  success: boolean,
  error?: string
) => {
  const level = success ? 'debug' : 'error'
  logger.log(level, 'Database Query', {
    query: query.substring(0, 200), // Truncate long queries
    duration: `${duration}ms`,
    success,
    error,
  })
}

export default logger

import { Pool } from 'pg'

// Create a singleton connection pool
let pool: Pool | null = null

export function getDb(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

// Helper function to execute queries with better error handling
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const db = getDb()
  const result = await db.query(text, params)
  return result.rows
}

// Export types for convenience
export type { Pool, PoolClient, QueryResult } from 'pg'

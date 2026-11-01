import Database from 'better-sqlite3'
import { app } from 'electron'
import { existsSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

let database: Database.Database | null = null

/**
 * Determine the SQLitedatabase location
 *
 * Development:
 *  GarageIQ/database/garageiq.db
 *
 * Production:
 *  Electron userData/database/garageiq.db
 */

function getDatabasePath(): string {
  if (!app.isPackaged) {
    return resolve(app.getAppPath(), '..', 'Database', 'garageiq.db')
  }

  const databaseDirectory = join(app.getPath('userData'), 'Database')

  mkdirSync(databaseDirectory, { recursive: true })

  return join(databaseDirectory, 'garageiq.db')
}

/* Initialize the SQLite connection for GarageIQ */

export function initializeDatabase(): Database.Database {
  if (database?.open) {
    return database
  }

  const databasePath = getDatabasePath()

  if (!existsSync(databasePath)) {
    throw new Error(`GarageIQ database was not found in path: ${databasePath}`)
  }

  try {
    const connection = new Database(databasePath, {
      fileMustExist: true
    })

    // Enforce the fk constraint
    connection.pragma('foreign_keys = ON')

    // Verify the db can execute queries
    const result = connection.prepare('SELECT 1 AS connected').get() as { connected: number }

    if (result.connected !== 1) {
      throw new Error(`SQLite connection verification failed`)
    }

    database = connection

    console.log('[GarageIQ] SQLite Database connected successfully.')
    console.log(`[GarageIQ] Database Path: ${databasePath}`)

    return connection
  } catch (error) {
    console.error('[GarageIQ] SQLite connection failed: ', error)
    throw error
  }
}

/* Return the active DB connection */
export function getDatabase(): Database.Database {
  if (!database?.open) {
    throw new Error('GarageIQ database has not been initialized')
  }

  return database
}

/* Close the active DB connection */
export function closeDatabase(): void {
  if (!database?.open) {
    database.close()
    console.log('[GarageIQ] SQLite database connection closed')
  }

  database = null
}

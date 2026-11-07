import Database from 'better-sqlite3'
import { app } from 'electron'
import { existsSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { runMigrations } from './migration'

let database: Database.Database | null = null

/**
 * Determine the SQLite database location.
 *
 * Development:
 *   GarageIQ/Database/garageiq.db
 *
 * Production:
 *   Electron userData/Database/garageiq.db
 */
function getDatabasePath(): string {
  if (!app.isPackaged) {
    return resolve(app.getAppPath(), '..', 'Database', 'garageiq.db')
  }

  const databaseDirectory = join(app.getPath('userData'), 'Database')

  mkdirSync(databaseDirectory, { recursive: true })

  return join(databaseDirectory, 'garageiq.db')
}

/**
 * Initialize the SQLite connection for GarageIQ.
 */
export function initializeDatabase(): Database.Database {
  if (database?.open) {
    return database
  }

  const databasePath = getDatabasePath()

  if (!existsSync(databasePath)) {
    throw new Error(`GarageIQ database was not found at: ${databasePath}`)
  }

  try {
    const connection = new Database(databasePath, {
      fileMustExist: true
    })

    try {
      // Enable foreign key enforcement.
      connection.pragma('foreign_keys = ON')

      // Run pending database migrations.
      runMigrations(connection)

      // Verify that SQLite can execute queries.
      const result = connection.prepare('SELECT 1 AS connected').get() as { connected: number }

      if (result.connected !== 1) {
        throw new Error('SQLite connection verification failed')
      }

      database = connection

      console.log('[GarageIQ] SQLite database connected successfully')
      console.log(`[GarageIQ] Database path: ${databasePath}`)

      return connection
    } catch (error) {
      // Clean up if initialization or migrations fail.
      connection.close()
      throw error
    }
  } catch (error) {
    console.error('[GarageIQ] SQLite connection failed:', error)
    throw error
  }
}

/**
 * Return the active database connection.
 */
export function getDatabase(): Database.Database {
  if (!database?.open) {
    throw new Error('GarageIQ database has not been initialized')
  }

  return database
}

/**
 * Close the active database connection.
 */
export function closeDatabase(): void {
  if (database?.open) {
    database.close()
    console.log('[GarageIQ] SQLite database connection closed')
  }

  database = null
}

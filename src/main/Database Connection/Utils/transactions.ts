import type Database from 'better-sqlite3'
import { getDatabase } from '../connection'
import { executeDatabaseOperation } from './databaseErrors'

/**
 * Run a synchronous operation inside a SQLite transaction.
 *
 * If the callback throws, better-sqlite3 rolls back
 * all changes made inside the transaction
 */

export function withTransaction<T>(
  operation: string,
  callback: (database: Database.Database) => T,
  database: Database.Database = getDatabase()
): T {
  return executeDatabaseOperation(operation, () => {
    const transaction = database.transaction(() => callback(database))
    return transaction()
  })
}

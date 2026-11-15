import Database from 'better-sqlite3'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resolve } from 'node:path'
import { runMigrations } from '../../src/main/Database Connection/migration'
import { createTestDatabase, initializeTestSchema } from '../Helpers/testDatabase'

// Mock Electron so migrations use the development SQL Scripts
vi.mock('electron', () => ({
  app: {
    isPackaged: false,
    getAppPath: () => resolve(process.cwd())
  }
}))

let database: Database.Database

beforeEach(() => {
  // Fresh - in memory DB
  database = createTestDatabase()
})

afterEach(() => {
  if (database?.open) {
    database.close()
  }
})

describe('GarageIQ Database Initialization', () => {
  it('creates all seven aplication tables', () => {
    runMigrations(database)

    const tables = database
      .prepare(
        `
                SELECT name
                FROM sqlite_master
                WHERE type = 'table'
                    AND name IN ('Users', 'Vehicles', 'ServiceTypes', 'MaintenanceRecord', 'MaintenanceSchedule', 'OdometerHistory', 'Attachments')
            `
      )
      .all()

    expect(tables).toHaveLength(7)
  })

  it('creates all twelve indexes', () => {
    runMigrations(database)

    const indexes = database
      .prepare(
        `
            SELECT name
            FROM sqlite_master
            WHERE type = 'index'
                AND name LIKE 'IX_%'
        `
      )
      .all()

    expect(indexes).toHaveLength(12)
  })

  it('inserts 25 default service types', () => {
    runMigrations(database)

    const result = database
      .prepare(
        `
            SELECT COUNT(*) AS Total
            FROM ServiceTypes
        `
      )
      .get() as { Total: number }

    expect(result.Total).toBe(25)
  })

  it('sets the database schema version to 1', () => {
    runMigrations(database)

    const version = database.pragma('user_version', {
      simple: true
    }) as number

    expect(version).toBe(1)
  })

  it('does not execute completed migrations again', () => {
    runMigrations(database)

    // Simulate multiple application launches
    runMigrations(database)
    runMigrations(database)

    const result = database
      .prepare(
        `
            SELECT COUNT(*) AS Total
            FROM ServiceTypes
        `
      )
      .get() as { Total: number }

    expect(result.Total).toBe(25)

    expect(database.pragma('user_version', { simple: true })).toBe(1)
  })

  it('recognizes an existing database without recreating tables', () => {
    // Simulate a database created manually before migrations
    initializeTestSchema(database)

    expect(database.pragma('user_version', { simple: true })).toBe(0)

    runMigrations(database)

    expect(database.pragma('user_version', { simple: true })).toBe(1)

    const result = database
      .prepare(
        `
            SELECT COUNT(*) AS Total
            FROM ServiceTypes
        `
      )
      .get() as { Total: number }

    expect(result.Total).toBe(25)
  })

  it('preserves existing records durin version registration', () => {
    initializeTestSchema(database)

    const before = database
      .prepare(
        `
            SELECT COUNT(*) AS Total
            FROM ServiceTypes
        `
      )
      .get() as { Total: number }

    runMigrations(database)

    const after = database
      .prepare(
        `
            SELECT COUNT(*) AS Total
            FROM ServiceTypes
        `
      )
      .get() as { Total: number }

    expect(after.Total).toBe(before.Total)
    expect(after.Total).toBe(25)
  })

  it('rejects unsupported future schema versions', () => {
    database.pragma('user_version = 999')

    expect(() => runMigrations(database)).toThrow(/newer than supported/i)
  })

  it('does not upgrade an invalid existing schema', () => {
    // Create an incomplete legacy database
    database.exec(`
            CREATE TABLE Users (TestId INTEGER PRIMARY KEY)
        `)

    expect(() => runMigrations(database)).toThrow()

    expect(database.pragma('user_version', { simple: true })).toBe(0)

    // Original table cannot be dropped
    const result = database
      .prepare(
        `
            SELECT COUNT(*) AS Total
            FROM sqlite_master
            WHERE type = 'table'
                AND name = 'Users'
        `
      )
      .get() as { Total: number }

    expect(result.Total).toBe(1)
  })

  it('passes SQLite database integrity verification', () => {
    runMigrations(database)

    const integrity = database.pragma('integrity_check', {
      simple: true
    })

    expect(integrity).toBe('ok')
  })

  it('has no foreign key violations', () => {
    runMigrations(database)

    const violations = database.pragma('foreign_key_check')

    expect(violations).toEqual([])
  })
})

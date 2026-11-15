import Database from 'better-sqlite3'
import { afterEach, describe, expect, it } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  createTestDatabase,
  initializeTestSchema,
  insertTestUser,
  insertTestVehicle
} from '../Helpers/testDatabase'

const testDirectories: string[] = []

afterEach(() => {
  for (const directory of testDirectories) {
    rmSync(directory, {
      recursive: true,
      force: true
    })
  }

  testDirectories.length = 0
})

describe('SQLite database persistence', () => {
  it('preserves data after closing and reopening', () => {
    const directory = mkdtempSync(join(tmpdir(), 'garageiq-test-'))

    testDirectories.push(directory)

    const databasePath = join(directory, 'garageiq-test.db')

    const database = createTestDatabase(databasePath)

    initializeTestSchema(database)

    const userId = insertTestUser(database)
    const vehicleId = insertTestVehicle(database, userId)

    database.pragma('user_version = 1')

    database.close()

    // Open the same temp file again
    const reopened = new Database(databasePath, { fileMustExist: true })

    try {
      const user = reopened
        .prepare(
          `
                SELECT UserId, UserName
                FROM Users
                WHERE UserId = ?
            `
        )
        .get(userId) as { UserId: number; UserName: string }

      const vehicle = reopened
        .prepare(
          `
                SELECT VehicleId, Make, Model
                FROM Vehicles
                WHERE VehicleId = ?
            `
        )
        .get(vehicleId) as { VehicleId: number; Make: string; Model: string }

      expect(user.UserName).toBe('test_user')
      expect(vehicle.Make).toBe('Nissan')
      expect(vehicle.Model).toBe('Rogue Sport')
      expect(reopened.pragma('user_version', { simple: true })).toBe(1)
    } finally {
      reopened.close()
    }
  })
})

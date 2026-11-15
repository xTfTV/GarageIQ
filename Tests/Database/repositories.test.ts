import Database from 'better-sqlite3'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { VehicleRepository } from '../../src/main/Database Connection/Repositories/VehicleRepository'
import { ServiceTypeRepository } from '../../src/main/Database Connection/Repositories/ServiceTypeRepository'
import { withTransaction } from '../../src/main/Database Connection/Utils/transactions'
import {
  createTestDatabase,
  initializeTestSchema,
  insertTestUser,
  insertTestVehicle
} from '../Helpers/testDatabase'
//import { initializeDatabase } from '../../src/main/Database Connection/connection'

// Prevent repositories from connecting to the
// real development database during tests
vi.mock('../../src/main/Database Connection/connection', () => ({
  getDatabase: () => {
    throw new Error('Tests must inject their database')
  }
}))

let database: Database.Database

beforeEach(() => {
  database = createTestDatabase()
  initializeTestSchema(database)
})

afterEach(() => {
  if (database?.open) {
    database.close()
  }
})

describe('ServiceTypeRepository', () => {
  it('returns all 25 active service types', () => {
    const repository = new ServiceTypeRepository(database)
    expect(repository.findAllActive()).toHaveLength(25)
  })

  it('returns Engine Oil Change by ID', () => {
    const repository = new ServiceTypeRepository(database)
    const service = repository.findById(1)
    expect(service?.ServiceTypeName).toBe('Engine Oil Change')
  })

  it('returns null for a missing service type', () => {
    const repository = new ServiceTypeRepository(database)
    expect(repository.findById(999999)).toBeNull()
  })

  it('excludes logically cancelled service types', () => {
    database
      .prepare(
        `
            UPDATE ServiceTypes
            SET LogicalCancel = 1
            WHERE ServiceTypeId = 1
        `
      )
      .run()

    const repository = new ServiceTypeRepository(database)

    expect(repository.findAllActive()).toHaveLength(24)
    expect(repository.findById(1)).toBeNull()
  })

  it('rejectgs invalid service type IDs', () => {
    const repository = new ServiceTypeRepository(database)

    expect(() => repository.findById(-1)).toThrow(RangeError)
    expect(() => repository.findById(0)).toThrow(RangeError)
  })
})

describe('VehicleRepository', () => {
  it('retrieves a vehicle belonging to the user', () => {
    const userId = insertTestUser(database)
    const vehicleId = insertTestVehicle(database, userId)
    const repository = new VehicleRepository(database)
    const vehicles = repository.findByUserId(userId)

    expect(vehicles).toHaveLength(1)
    expect(vehicles[0].VehicleId).toBe(vehicleId)
    expect(vehicles[0].Make).toBe('Nissan')
  })

  it('returns an empty array for a user without vehicles', () => {
    const userId = insertTestUser(database)
    const repository = new VehicleRepository(database)
    expect(repository.findByUserId(userId)).toEqual([])
  })

  it('returns null for an unknown vehicle', () => {
    const userId = insertTestUser(database)
    const repository = new VehicleRepository(database)
    expect(repository.findById(999999, userId)).toBeNull()
  })

  it('does not return another users vehicles', () => {
    const userId = insertTestUser(database)
    const vehicleId = insertTestVehicle(database, userId)

    database
      .prepare(
        `
            UPDATE Vehicles
            SET LogicalCancel = 1
            WHERE VehicleId = ?
        `
      )
      .run(vehicleId)

    const repository = new VehicleRepository(database)

    expect(() => repository.findByUserId(-1)).toThrow(RangeError)
    expect(() => repository.findById(0, 1)).toThrow(RangeError)
  })
})

describe('Database Constraints', () => {
  it('enables foreign key enforcement', () => {
    expect(() => insertTestVehicle(database, 999999)).toThrow()
  })

  it('passes foreign key verification', () => {
    expect(database.pragma('foreign_key_checks')).toEqual([])
  })
})

describe('Database Transactions', () => {
  it('commits a successful transaction', () => {
    withTransaction(
      'create test user',
      (connection) => {
        insertTestUser(connection)
      },
      database
    )

    const result = database
      .prepare(
        `
            SELECT COUNT(*) AS Total
            FROM Users
        `
      )
      .get() as { Total: number }

    expect(result.Total).toBe(1)
  })

  it('rolls back when a transaction fails', () => {
    expect(() =>
      withTransaction(
        'rollback test',
        (connection) => {
          insertTestUser(connection)
          throw new Error('Simulated Failure')
        },
        database
      )
    ).toThrow()

    const result = database
      .prepare(
        `
            SELECT COUNT(*) AS Total
            FROM Users
        `
      )
      .get() as { Total: number }

    expect(result.Total).toBe(0)
  })
})

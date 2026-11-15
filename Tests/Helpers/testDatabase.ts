import Database from 'better-sqlite3'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const databaseRoot = resolve(process.cwd(), 'Database')

const schemaFiles = [
  '001_Create_Users.sql',
  '002_Create_ServiceTypes.sql',
  '003_Create_Vehicles.sql',
  '004_Create_MaintenanceRecord.sql',
  '005_Create_MaintenanceSchedule.sql',
  '006_Create_OdometerHistory.sql',
  '007_Create_Attachments.sql'
]

export function createTestDatabase(filename: string = ':memory:'): Database.Database {
  const database = new Database(filename)

  database.pragma('foreign_keys = ON')

  return database
}

export function initializeTestSchema(database: Database.Database): void {
  database.transaction(() => {
    for (const file of schemaFiles) {
      const sql = readFileSync(resolve(databaseRoot, 'Schema', file), 'utf8')

      database.exec(sql)
    }

    const seedSql = readFileSync(
      resolve(databaseRoot, 'Seeds', '001_Seed_ServiceTypes.sql'),
      'utf8'
    )

    database.exec(seedSql)
  })()
}

export function insertTestUser(database: Database.Database): number {
  const result = database
    .prepare(
      `
        INSERT INTO Users (UserName, Email, FirstName, LastName, DOB, Password, LogicalCancel)
        VALUES (?,?,?,?,?,?,0)
    `
    )
    .run(
      'test_user',
      'test@example.com',
      'Test',
      'User',
      '1995-06-15',
      'TEST_ONLY_NOT_A_REAL_PASSWORD'
    )

  return Number(result.lastInsertRowid)
}

export function insertTestVehicle(database: Database.Database, userId: number): number {
  const result = database
    .prepare(
      `
        INSERT INTO Vehicles(UserId, VehicleYear, Make, Model, Trim, VIN, LicensePlate, Color, Mileage, PurchaseDate, LogicalCancel)
        VALUES (?,?,?,?,?,?,?,?,?,?,0)
    `
    )
    .run(
      userId,
      2021,
      'Nissan',
      'Rogue Sport',
      'S',
      'TESTVIN000000000001',
      'TEST123',
      'Silver',
      45000,
      '2025-08-07'
    )

  return Number(result.lastInsertRowid)
}

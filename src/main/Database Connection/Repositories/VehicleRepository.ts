import type Database from 'better-sqlite3'
import { getDatabase } from '../connection'
import type { Vehicle } from '../Types/entities'
import { executeDatabaseOperation } from '../Utils/databaseErrors'

export class VehicleRepository {
  constructor(private readonly database: Database.Database = getDatabase()) {}

  findByUserId(userId: number): Vehicle[] {
    if (!Number.isSafeInteger(userId) || userId <= 0) {
      throw new RangeError('A valid UserId is required')
    }

    return executeDatabaseOperation('find vehicles by user', () => {
      const statement = this.database.prepare(`
                SELECT 
                    VehicleId, UserId, VehicleYear, Make, Model, Trim, VIN,
                    LicensePlate, Color, Mileage, PurchaseDate, CreatedDate, 
                    ModifyDate, LogicalCancel
                FROM Vehicles
                WHERE UserId = ?
                    AND LogicalCancel = 0
                ORDER BY VehicleYear DESC, Make, Model
            `)

      return statement.all(userId) as Vehicle[]
    })
  }

  findById(vehicleId: number, userId: number): Vehicle | null {
    if (
      !Number.isSafeInteger(vehicleId) ||
      vehicleId <= 0 ||
      !Number.isSafeInteger(userId) ||
      userId <= 0
    ) {
      throw new RangeError('Valid VehicleId and UserId are required')
    }

    return executeDatabaseOperation('find vehicle by ID', () => {
      const statement = this.database.prepare(`
                SELECT 
                    VehicleId, UserId, VehicleYear, Make, Model, Trim, VIN,
                    LicensePlate, Color, Mileage, PurchaseDate, CreatedDate, 
                    ModifyDate, LogicalCancel
                FROM Vehicles
                WHERE UserId = ?
                    AND VehicleId = ?
                    AND LogicalCancel = 0
            `)
      return (statement.get(vehicleId, userId) as Vehicle | undefined) ?? null
    })
  }
}

import type Database from 'better-sqlite3'
import { getDatabase } from '../connection'
import type { ServiceType } from '../Types/entities'
import { executeDatabaseOperation } from '../Utils/databaseErrors'

export class ServiceTypeRepository {
  constructor(private readonly database: Database.Database = getDatabase()) {}

  /**
   * Retrieve all active service types.
   */
  findAllActive(): ServiceType[] {
    return executeDatabaseOperation('find active service types', () => {
      const statement = this.database.prepare(`
        SELECT
          ServiceTypeId,
          ServiceTypeName,
          Category,
          DefaultIntervalMiles,
          DefaultIntervalMonths,
          Description,
          CreatedDate,
          ModifyDate,
          LogicalCancel
        FROM ServiceTypes
        WHERE LogicalCancel = 0
        ORDER BY Category, ServiceTypeName
      `)

      return statement.all() as ServiceType[]
    })
  }

  /**
   * Retrieve an active service type by its ID.
   */
  findById(serviceTypeId: number): ServiceType | null {
    if (!Number.isSafeInteger(serviceTypeId) || serviceTypeId <= 0) {
      throw new RangeError('A valid ServiceTypeId is required')
    }

    return executeDatabaseOperation('find service type by ID', () => {
      const statement = this.database.prepare(`
        SELECT
          ServiceTypeId,
          ServiceTypeName,
          Category,
          DefaultIntervalMiles,
          DefaultIntervalMonths,
          Description,
          CreatedDate,
          ModifyDate,
          LogicalCancel
        FROM ServiceTypes
        WHERE LogicalCancel = 0
          AND ServiceTypeId = ?
      `)

      return (statement.get(serviceTypeId) as ServiceType | undefined) ?? null
    })
  }
}

import type Database from 'better-sqlite3'
import { app } from 'electron'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const CURRENT_SCHEMA_VERSION = 1

const INITIAL_SCHEMA_FILES = [
  '001_Create_Users.sql',
  '002_Create_ServiceTypes.sql',
  '003_Create_Vehicles.sql',
  '004_Create_MaintenanceRecord.sql',
  '005_Create_MaintenanceSchedule.sql',
  '006_Create_OdometerHistory.sql',
  '007_Create_Attachments.sql'
]

const INITIAL_SEED_FILES = '001_Seed_ServiceTypes.sql'

const REQUIRED_COLUMNS: Record<string, string[]> = {
  Users: [
    'UserId',
    'UserName',
    'Email',
    'FirstName',
    'LastName',
    'DOB',
    'Password',
    'CreatedDate',
    'ModifyDate',
    'LogicalCancel'
  ],
  ServiceTypes: [
    'ServiceTypeId',
    'ServiceTypeName',
    'Category',
    'DefaultIntervalMiles',
    'DefaultIntervalMonths',
    'Description',
    'CreatedDate',
    'ModifyDate',
    'LogicalCancel'
  ],
  Vehicles: [
    'VehicleId',
    'UserId',
    'VehicleYear',
    'Make',
    'Model',
    'Trim',
    'VIN',
    'LicensePlate',
    'Color',
    'Mileage',
    'PurchaseDate',
    'CreatedDate',
    'ModifyDate',
    'LogicalCancel'
  ],
  MaintenanceRecord: [
    'MaintenanceRecordId',
    'VehicleId',
    'ServiceTypeId',
    'UserId',
    'ServiceDate',
    'MileageAtService',
    'Cost',
    'ServiceProvider',
    'InvoiceNumber',
    'Notes',
    'CreatedDate',
    'ModifyDate',
    'LogicalCancel'
  ],
  MaintenanceSchedule: [
    'ScheduleId',
    'VehicleId',
    'ServiceTypeId',
    'UserId',
    'LastServiceDate',
    'LastServiceMileage',
    'IntervalMiles',
    'IntervalMonths',
    'NextDueDate',
    'NextDueMileage',
    'ReminderThresholdMiles',
    'ReminderThresholdDays',
    'IsActive',
    'CreatedDate',
    'ModifyDate',
    'LogicalCancel'
  ],
  Attachments: [
    'AttachmentId',
    'UserId',
    'FileName',
    'FilePath',
    'FileType',
    'FileSize',
    'UploadedDate',
    'LogicalCancel'
  ]
}

const REQUIRED_INDEXES = [
  'IX_Attachments_FileName',
  'IX_Attachments_UserId',
  'IX_MaintenanceRecord_Cost',
  'IX_MaintenanceRecord_ServiceTypeId',
  'IX_MaintenanceRecord_VehicleId',
  'IX_MaintenanceSchedule_ServiceTypeId',
  'IX_MaintenanceSchedule_VehicleId',
  'IX_OdometerHistory_VehicleId',
  'IX_ServiceTypes_ServiceTypeName',
  'IX_Users_Email',
  'IX_Users_UserName',
  'IX_Vehicles_Make'
]

type SchemaObject = {
  name: string
  type: string
}

type TableColumn = {
  name: string
}

function readSqlFile(folder: 'schema' | 'seeds', filename: string): string {
  if (app.isPackaged) {
    throw new Error('Packaged SQL migration assets have not been configured yet')
  }

  const filePath = resolve(app.getAppPath(), '..', 'Database', folder, filename)

  const sql = readFileSync(filePath, 'utf8')

  if (!sql.trim()) {
    throw new Error(`SQL File is empty: ${filename}`)
  }

  // Baseline files must not have transaction control
  // statements
  if (
    /\bDROP\s+TABLE\b/i.test(sql) ||
    /\bDELETE\s+FROM\b/i.test(sql) ||
    /\bBEGIN\s+TRANSACTION\b/i.test(sql) ||
    /\bCOMMIT\b/i.test(sql) ||
    /\bROLLBACK\b/i.test(sql)
  ) {
    throw new Error(`Unsafe statement found in basline SQL file: ${filename}`)
  }

  return sql
}

/**
 * Validate the expected version 1 tables, columns,
 * and explicitly created indexes.
 */

function validateBaseline(database: Database.Database): void {
  const objects = database
    .prepare(`SELECT name, type FROM sqlite_master WHERE type IN ('table', 'index')`)
    .all() as SchemaObject[]

  for (const [table, requiredColumns] of Object.entries(REQUIRED_COLUMNS)) {
    const exists = objects.some((object) => object.type === 'table' && object.name === table)

    if (!exists) {
      throw new Error(`Missing GarageIQ table: ${table}`)
    }

    const actualColumns = database.pragma(`table_info("${table}")`) as TableColumn[]

    const names = new Set(actualColumns.map((column) => column.name))

    for (const column of requiredColumns) {
      if (!names.has(column)) {
        throw new Error(`Missing column: ${table}.${column}`)
      }
    }
  }

  for (const index of REQUIRED_INDEXES) {
    const exists = objects.some((object) => object.type === 'index' && object.name === index)

    if (!exists) {
      throw new Error(`Missing GarageIQ index: ${index}`)
    }
  }

  const violations = database.pragma('foreign_key_check') as unknown[]

  if (violations.length > 0) {
    throw new Error(`GarageIQ database contains foreign key violations`)
  }
}

/**
 * Initialize or Upgrade the GarageIQ database
 *
 * Version 0, empty DB:
 *  Run initial schema and seed scripts.
 *
 * Version 0, existing DB:
 *  Validate the legacy schema and register version 1
 *
 * Version 1:
 *  Skip initial scripts.
 */

export function runMigrations(database: Database.Database): void {
  const currentVersion = database.pragma('user_version', { simple: true }) as number

  console.log(`[GarageIQ] Database schema version: ${currentVersion}`)

  if (currentVersion > CURRENT_SCHEMA_VERSION) {
    throw new Error(
      `Database version ${currentVersion} is newer than supported version ${CURRENT_SCHEMA_VERSION}`
    )
  }

  if (currentVersion === CURRENT_SCHEMA_VERSION) {
    console.log(`[GarageIQ] Database schema is up to date`)
    return
  }

  if (currentVersion !== 0) {
    throw new Error(`Unsupported database version: ${currentVersion}`)
  }

  const migration = database.transaction(() => {
    const existingTables = database
      .prepare(
        `SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name <> '_Setup'`
      )
      .all() as { name: string }[]

    if (existingTables.length === 0) {
      console.log('[GarageIQ] Creating initial database schema')

      // Run the table scripts ONCE
      for (const file of INITIAL_SCHEMA_FILES) {
        const sql = readSqlFile('schema', file)
        database.exec(sql)
        console.log(`[GarageIQ] Applied: ${file}`)
      }

      // Insert default service types
      const seedSql = readSqlFile('seeds', INITIAL_SEED_FILES)
      database.exec(seedSql)
      console.log(`[GarageIQ] Applied: ${INITIAL_SEED_FILES}`)
    } else {
      console.log('[GarageIQ] Existing DB detected')

      // DO NOT run CREATE TABLE scripts against legacy data!!
      // Validate the existing structure INSTEAD
      validateBaseline(database)
      console.log('[GarageIQ] Existing database baseline validated')
    }

    validateBaseline(database)

    // Onlyadvance the version after successful execution
    database.pragma(`user_version = ${CURRENT_SCHEMA_VERSION}`)

    console.log(`[GarageIQ] Database schema upgraded to version ${CURRENT_SCHEMA_VERSION}`)
  })

  try {
    migration()
  } catch (error) {
    console.error('[GarageIQ] Database migration failed: ', error)
    throw error
  }
}

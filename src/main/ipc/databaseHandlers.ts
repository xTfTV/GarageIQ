import { ipcMain, type BrowserWindow, type IpcMainInvokeEvent } from 'electron'
import { VehicleRepository } from '../Database Connection/Repositories/VehicleRepository'
import { ServiceTypeRepository } from '../Database Connection/Repositories/ServiceTypeRepository'
import { IPC_CHANNELS } from '../../shared/garageIQApi'
import { getDatabase } from '../Database Connection/connection'
import { UserRepository } from '../Database Connection/Repositories/UserRepository'
import type { RegisterUserRequest } from '../../shared/garageIQApi'

function validateId(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Invalid ${field}`)
  }

  return value
}

function validateSender(event: IpcMainInvokeEvent, mainWindow: BrowserWindow): void {
  if (
    mainWindow.isDestroyed() ||
    event.sender !== mainWindow.webContents ||
    event.senderFrame !== mainWindow.webContents.mainFrame
  ) {
    throw new Error('Unauthorized IPC sender')
  }
}

function safeOperation<T>(operation: string, callback: () => T): T {
  try {
    return callback()
  } catch (error) {
    console.error(`[GarageIQ] ${operation} failed: `, error)

    // Not exposing the SQL statements, paths, or traces
    throw new Error('Unable to complete database request', { cause: error })
  }
}

export function registerDatabaseIpcHandlers(mainWindow: BrowserWindow): void {
  const vehicleRepository = new VehicleRepository()
  const serviceTypeRepository = new ServiceTypeRepository()
  const userRepository = new UserRepository()

  // Replace the existing handlers when Electron recreates
  // the application window
  for (const channel of Object.values(IPC_CHANNELS)) {
    ipcMain.removeHandler(channel)
  }

  ipcMain.handle(IPC_CHANNELS.VEHICLES_BY_USER, (event, userId: unknown) => {
    validateSender(event, mainWindow)

    const validUserId = validateId(userId, 'UserId')

    return safeOperation('get vehicles by user', () => vehicleRepository.findByUserId(validUserId))
  })

  ipcMain.handle(IPC_CHANNELS.VEHICLE_BY_ID, (event, vehicleId: unknown, userId: unknown) => {
    validateSender(event, mainWindow)

    const validVehicleId = validateId(vehicleId, 'VehicleId')
    const validUserId = validateId(userId, 'UserId')

    return safeOperation('get vehicle by ID', () =>
      vehicleRepository.findById(validVehicleId, validUserId)
    )
  })

  ipcMain.handle(IPC_CHANNELS.SERVICE_TYPE_BY_ID, (event, serviceTypeId: unknown) => {
    validateSender(event, mainWindow)

    const validId = validateId(serviceTypeId, 'ServiceTypeId')

    return safeOperation('get service type by ID', () => {
      return serviceTypeRepository.findById(validId)
    })
  })

  ipcMain.handle(IPC_CHANNELS.SERVICE_TYPES_ALL, (event) => {
    validateSender(event, mainWindow)

    return safeOperation('get actuve service types', () => serviceTypeRepository.findAllActive())
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE_HEALTH, (event) => {
    validateSender(event, mainWindow)

    return safeOperation('check database health', () => {
      const database = getDatabase()

      const result = database.prepare('SELECT 1 AS connected').get() as { connected: number }

      const schemaVersion = database.pragma('user_version', { simple: true }) as number

      const foreignKeys = database.pragma('foreign_keys', { simple: true }) as number

      return {
        connected: result.connected === 1,
        schemaVersion,
        foreignKeysEnabled: foreignKeys === 1
      }
    })
  })

  ipcMain.handle(IPC_CHANNELS.USERS_HAS_ACCOUNT, (event) => {
    validateSender(event, mainWindow)

    return safeOperation('check local account', () => userRepository.hasLocalAccount())
  })

  ipcMain.handle(IPC_CHANNELS.USERS_REGISTER, async (event, input: RegisterUserRequest) => {
    validateSender(event, mainWindow)

    try {
      return await userRepository.register(input)
    } catch (error) {
      console.error('[GarageIQ] User registration failed: ', error)

      // Keep database details out of the renderer
      throw new Error('Unable to complete registration', { cause: error })
    }
  })
}

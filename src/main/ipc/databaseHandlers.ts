import { ipcMain, type BrowserWindow, type IpcMainInvokeEvent } from 'electron'
import { VehicleRepository } from '../Database Connection/Repositories/VehicleRepository'
import { ServiceTypeRepository } from '../Database Connection/Repositories/ServiceTypeRepository'
import { IPC_CHANNELS } from '../../shared/garageIQApi'

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

  ipcMain.handle(IPC_CHANNELS.SERVICE_TYPES_ALL, (event) => {
    validateSender(event, mainWindow)

    return safeOperation('get actuve service types', () => serviceTypeRepository.findAllActive())
  })
}

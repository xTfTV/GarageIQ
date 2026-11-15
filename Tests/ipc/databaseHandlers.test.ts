import Database from 'better-sqlite3'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { BrowserWindow, IpcMainInvokeEvent } from 'electron'
import {
  createTestDatabase,
  initializeTestSchema,
  insertTestUser,
  insertTestVehicle
} from '../Helpers/testDatabase'

const mocks = vi.hoisted(() => ({
  handlers: new Map<string, (...args: unknown[]) => unknown>()
}))

vi.mock('electron', () => ({
  ipcMain: {
    handle: (channel: string, handler: (...args: unknown[]) => unknown) => {
      mocks.handlers.set(channel, handler)
    },
    removeHandler: (channel: string) => {
      mocks.handlers.delete(channel)
    }
  },

  app: { isPackaged: false }
}))

let database: Database.Database

vi.mock('../../src/main/Database Connection/connection', () => ({
  getDatabase: () => database
}))

import { IPC_CHANNELS } from '../../src/shared/garageIQApi'
import { registerDatabaseIpcHandlers } from '../../src/main/ipc/databaseHandlers'

const mainFrame = { id: 1 }
const webContents = { mainFrame }

const mainWindow = {
  isDestroyed: () => false,
  webContents
} as unknown as BrowserWindow

const validEvent = {
  sender: webContents,
  senderFrame: mainFrame
} as unknown as IpcMainInvokeEvent

function invoke(channel: string, ...args: unknown[]): unknown {
  const handler = mocks.handlers.get(channel)

  if (!handler) {
    throw new Error(`Missing IPC handler: ${channel}`)
  }

  return handler(validEvent, ...args)
}

beforeEach(() => {
  database = createTestDatabase()
  initializeTestSchema(database)

  mocks.handlers.clear()
  registerDatabaseIpcHandlers(mainWindow)
})

afterEach(() => {
  if (database?.open) {
    database.close()
  }
})

describe('GarageIQ IPC handlers', () => {
  it('registers the approved channels', () => {
    for (const channel of Object.values(IPC_CHANNELS)) {
      expect(mocks.handlers.has(channel)).toBe(true)
    }
  })

  it('returns all active service types', () => {
    const result = invoke(IPC_CHANNELS.SERVICE_TYPES_ALL) as unknown[]
    expect(result).toHaveLength(25)
  })

  it('returns a service type by ID', () => {
    const result = invoke(IPC_CHANNELS.SERVICE_TYPE_BY_ID, 1) as { ServiceTypeName: string }
    expect(result.ServiceTypeName).toBe('Engine Oil Change')
  })

  it('returns null for a missing service type', () => {
    expect(invoke(IPC_CHANNELS.SERVICE_TYPE_BY_ID, 999999)).toBeNull()
  })

  it('returns the vehicle belonging to a user', () => {
    const userId = insertTestUser(database)
    insertTestVehicle(database, userId)

    const vehicles = invoke(IPC_CHANNELS.VEHICLES_BY_USER, userId) as unknown[]
    expect(vehicles).toHaveLength(1)
  })

  it('rejects invalid UserIds', () => {
    expect(() => invoke(IPC_CHANNELS.VEHICLES_BY_USER, -1)).toThrow()
    expect(() => invoke(IPC_CHANNELS.VEHICLES_BY_USER, '1')).toThrow()
    expect(() => invoke(IPC_CHANNELS.VEHICLES_BY_USER, null)).toThrow()
  })

  it('rejects SQL injection strings', () => {
    expect(() => invoke(IPC_CHANNELS.VEHICLES_BY_USER, '1 OR 1=1')).toThrow()
  })

  it('rejects request from an unauthorized sender', () => {
    const handler = mocks.handlers.get(IPC_CHANNELS.SERVICE_TYPES_ALL)
    expect(handler).toBeDefined()

    const invalidEvent = {
      sender: { mainFrame: { id: 99 } },
      senderFrame: { id: 99 }
    }

    expect(() => handler?.(invalidEvent)).toThrow('Unauthorized IPC sender')
  })

  it('returns DB Health information', () => {
    database.pragma('user_version = 1')

    const result = invoke(IPC_CHANNELS.DATABASE_HEALTH) as {
      connected: boolean
      schemaVersion: number
      foreignKeysEnabled: boolean
    }

    expect(result.connected).toBe(true)
    expect(result.schemaVersion).toBe(1)
    expect(result.foreignKeysEnabled).toBe(true)
  })

  it('does not expose the SQL errors to the renderer', () => {
    // Safe: this table exists only in the
    // temporary in-memory db
    database.exec('DROP TABLE Vehicles')

    expect(() => invoke(IPC_CHANNELS.VEHICLES_BY_USER, 1)).toThrow(
      'Unable to complete database request'
    )
  })
})

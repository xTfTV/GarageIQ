import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, type GarageIQApi } from '../shared/garageIQApi'

// Approved GarageIQ APIs exposed to the renderer
const garageIQApi: GarageIQApi = {
  vehicles: {
    getByUserId: (userId: number) => ipcRenderer.invoke(IPC_CHANNELS.VEHICLES_BY_USER, userId),

    getById: (vehicleId: number, userId: number) =>
      ipcRenderer.invoke(IPC_CHANNELS.VEHICLE_BY_ID, vehicleId, userId)
  },

  serviceTypes: {
    getAllActive: () => ipcRenderer.invoke(IPC_CHANNELS.SERVICE_TYPES_ALL),

    getById: (serviceTypeId: number) =>
      ipcRenderer.invoke(IPC_CHANNELS.SERVICE_TYPE_BY_ID, serviceTypeId)
  },

  database: {
    checkHealth: () => ipcRenderer.invoke(IPC_CHANNELS.DATABASE_HEALTH)
  }
}

// Expose only approved APIs to React
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('garageIQ', garageIQApi)
  } catch (error) {
    console.error('[GarageIQ] Failed to expose API:', error)
  }
} else {
  window.garageIQ = garageIQApi
}

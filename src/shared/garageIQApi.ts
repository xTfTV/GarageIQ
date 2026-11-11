import type { Vehicle, ServiceType } from '../main/Database Connection/Types/entities'

export const IPC_CHANNELS = {
  VEHICLES_BY_USER: 'garageiq:vehicles:by-user',
  VEHICLE_BY_ID: 'garageiq:vehicles:by-id',
  SERVICE_TYPES_ALL: 'garageiq:service-types:all',
  SERVICE_TYPE_BY_ID: 'garageiq:service-types:by-id',
  DATABASE_HEALTH: 'garageiq:database:health'
} as const

export interface DatabaseHealth {
  connected: boolean
  schemaVersion: number
  foreignKeyEnabled: boolean
}

export interface GarageIQApi {
  vehicles: {
    getByUserId(userId: number): Promise<Vehicle[]>
    getById(vehicleId: number, userId: number): Promise<Vehicle | null>
  }

  serviceTypes: {
    getAllActive(): Promise<ServiceType[]>
    getById(serviceTypeId: number): Promise<ServiceType | null>
  }

  database: {
    checkHealth(): Promise<DatabaseHealth>
  }
}

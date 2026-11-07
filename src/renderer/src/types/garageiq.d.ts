import type { GarageIQApi } from '../../../shared/garageIQApi'

declare global {
  interface Window {
    garageIQ: GarageIQApi
  }
}

export {}

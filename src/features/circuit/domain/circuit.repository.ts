import type { LocationSample } from './location-sample.entity'

export interface CircuitRepository {
  getLocations(
    sessionKey: number,
    driverNumber: number,
    startIso: string,
    endIso: string,
  ): Promise<LocationSample[]>
}

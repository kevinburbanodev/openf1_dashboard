import { openf1Get } from '@/shared/lib/openf1-client'
import type { CircuitRepository } from '../domain/circuit.repository'
import type { LocationSample } from '../domain/location-sample.entity'

interface OpenF1LocationResponse {
  date: string
  x: number
  y: number
}

export class OpenF1CircuitRepository implements CircuitRepository {
  async getLocations(
    sessionKey: number,
    driverNumber: number,
    startIso: string,
    endIso: string,
  ): Promise<LocationSample[]> {
    const locations = await openf1Get<OpenF1LocationResponse[]>('/location', {
      session_key: sessionKey,
      driver_number: driverNumber,
      'date>=': startIso,
      'date<=': endIso,
    })
    return (locations || []).map((location) => ({
      date: location.date,
      x: location.x,
      y: location.y,
    }))
  }
}

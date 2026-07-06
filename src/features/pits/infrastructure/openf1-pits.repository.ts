import { openf1Get } from '@/shared/lib/openf1-client'
import type { PitsRepository } from '../domain/pits.repository'
import type { PitStop } from '../domain/pit-stop.entity'

interface OpenF1PitResponse {
  driver_number: number
  lap_number: number | null
  pit_duration: number | null
}

export class OpenF1PitsRepository implements PitsRepository {
  async getPitStops(sessionKey: number): Promise<PitStop[]> {
    const stops = await openf1Get<OpenF1PitResponse[]>('/pit', { session_key: sessionKey })
    return (stops || []).map((stop) => ({
      driverNumber: stop.driver_number,
      lapNumber: stop.lap_number,
      pitDuration: stop.pit_duration,
    }))
  }
}

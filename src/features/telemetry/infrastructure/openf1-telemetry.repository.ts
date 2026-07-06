import { openf1Get } from '@/shared/lib/openf1-client'
import type { TelemetryRepository } from '../domain/telemetry.repository'
import type { Lap } from '../domain/lap.entity'
import type { CarDataSample } from '../domain/car-data-sample.entity'

interface OpenF1LapResponse {
  driver_number: number
  lap_duration: number | null
  date_start: string | null
  is_pit_out_lap: boolean
}

interface OpenF1CarDataResponse {
  date: string
  speed: number | null
  rpm: number | null
  throttle: number | null
  brake: number | null
  drs: number | null
  n_gear: number | null
}

export class OpenF1TelemetryRepository implements TelemetryRepository {
  async getLaps(sessionKey: number, driverNumber: number): Promise<Lap[]> {
    const laps = await openf1Get<OpenF1LapResponse[]>('/laps', {
      session_key: sessionKey,
      driver_number: driverNumber,
    })
    return (laps || []).map((lap) => ({
      driverNumber: lap.driver_number,
      lapDuration: lap.lap_duration,
      dateStart: lap.date_start,
      isPitOutLap: !!lap.is_pit_out_lap,
    }))
  }

  async getCarData(
    sessionKey: number,
    driverNumber: number,
    startIso: string,
    endIso: string,
  ): Promise<CarDataSample[]> {
    const samples = await openf1Get<OpenF1CarDataResponse[]>('/car_data', {
      session_key: sessionKey,
      driver_number: driverNumber,
      'date>=': startIso,
      'date<=': endIso,
    })
    return (samples || [])
      .filter((sample) => sample.speed != null)
      .map((sample) => ({
        date: sample.date,
        speed: sample.speed,
        rpm: sample.rpm,
        throttle: sample.throttle,
        brake: sample.brake,
        drs: sample.drs,
        gear: sample.n_gear,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }
}

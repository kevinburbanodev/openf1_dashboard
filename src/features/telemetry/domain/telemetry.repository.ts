import type { Lap } from './lap.entity'
import type { CarDataSample } from './car-data-sample.entity'

export interface TelemetryRepository {
  getLaps(sessionKey: number, driverNumber: number): Promise<Lap[]>
  getCarData(
    sessionKey: number,
    driverNumber: number,
    startIso: string,
    endIso: string,
  ): Promise<CarDataSample[]>
}

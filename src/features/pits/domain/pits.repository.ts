import type { PitStop } from './pit-stop.entity'

export interface PitsRepository {
  getPitStops(sessionKey: number): Promise<PitStop[]>
}

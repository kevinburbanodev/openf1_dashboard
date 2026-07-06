import type { RaceSession } from './session.entity'

export interface SessionRepository {
  getRaceSessions(year: number): Promise<RaceSession[]>
}

import type { DriverStanding } from './driver-standing.entity'
import type { TeamStanding } from './team-standing.entity'

export interface StandingsRepository {
  getDriverStandings(sessionKey: number): Promise<DriverStanding[]>
  getTeamStandings(sessionKey: number): Promise<TeamStanding[]>
}

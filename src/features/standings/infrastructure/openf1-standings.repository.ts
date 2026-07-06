import { openf1Get } from '@/shared/lib/openf1-client'
import type { StandingsRepository } from '../domain/standings.repository'
import type { DriverStanding } from '../domain/driver-standing.entity'
import type { TeamStanding } from '../domain/team-standing.entity'

interface OpenF1DriverStandingResponse {
  driver_number: number
  position_current: number | null
  points_current: number | null
  points_start: number | null
}

interface OpenF1TeamStandingResponse {
  team_name: string
  position_current: number | null
  points_current: number | null
  points_start: number | null
}

export class OpenF1StandingsRepository implements StandingsRepository {
  async getDriverStandings(sessionKey: number): Promise<DriverStanding[]> {
    const standings = await openf1Get<OpenF1DriverStandingResponse[]>('/championship_drivers', {
      session_key: sessionKey,
    })
    return (standings || []).map((standing) => ({
      driverNumber: standing.driver_number,
      position: standing.position_current,
      points: standing.points_current,
      pointsGained: (standing.points_current ?? 0) - (standing.points_start ?? 0),
    }))
  }

  async getTeamStandings(sessionKey: number): Promise<TeamStanding[]> {
    const standings = await openf1Get<OpenF1TeamStandingResponse[]>('/championship_teams', {
      session_key: sessionKey,
    })
    return (standings || []).map((standing) => ({
      teamName: standing.team_name,
      position: standing.position_current,
      points: standing.points_current,
      pointsGained: (standing.points_current ?? 0) - (standing.points_start ?? 0),
    }))
  }
}

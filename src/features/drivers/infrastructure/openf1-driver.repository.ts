import { openf1Get } from '@/shared/lib/openf1-client'
import { teamColor } from '@/shared/lib/colors'
import type { DriverRepository } from '../domain/driver.repository'
import type { Driver } from '../domain/driver.entity'

interface OpenF1DriverResponse {
  driver_number: number
  full_name: string
  broadcast_name: string
  name_acronym: string
  team_name: string
  team_colour?: string | null
}

export class OpenF1DriverRepository implements DriverRepository {
  async getBySession(sessionKey: number): Promise<Driver[]> {
    const drivers = await openf1Get<OpenF1DriverResponse[]>('/drivers', {
      session_key: sessionKey,
    })
    return (drivers || []).map((driver) => ({
      driverNumber: driver.driver_number,
      fullName: driver.full_name,
      broadcastName: driver.broadcast_name,
      nameAcronym: driver.name_acronym,
      teamName: driver.team_name,
      teamColor: teamColor(driver.team_colour),
    }))
  }
}

import { openf1Get } from '@/shared/lib/openf1-client'
import type { TimingRepository } from '../domain/timing.repository'
import type { RaceResult } from '../domain/race-result.entity'
import type { Stint } from '../domain/stint.entity'
import type { RaceControlMessage } from '../domain/race-control-message.entity'

interface OpenF1ResultResponse {
  driver_number: number
  position: number | null
  gap_to_leader: number | string | null
  number_of_laps: number | null
  dnf?: boolean
  dns?: boolean
  dsq?: boolean
}

interface OpenF1StintResponse {
  driver_number: number
  stint_number: number
  compound: string | null
}

interface OpenF1RaceControlResponse {
  date: string
  flag: string | null
  category: string | null
  message: string | null
}

export class OpenF1TimingRepository implements TimingRepository {
  async getResults(sessionKey: number): Promise<RaceResult[]> {
    const results = await openf1Get<OpenF1ResultResponse[]>('/session_result', {
      session_key: sessionKey,
    })
    return (results || [])
      .filter((result) => result.position != null)
      .map((result) => ({
        driverNumber: result.driver_number,
        position: result.position as number,
        gapToLeader: result.gap_to_leader,
        numberOfLaps: result.number_of_laps,
        isDnf: !!result.dnf,
        isDns: !!result.dns,
        isDsq: !!result.dsq,
      }))
  }

  async getStints(sessionKey: number): Promise<Stint[]> {
    const stints = await openf1Get<OpenF1StintResponse[]>('/stints', {
      session_key: sessionKey,
    })
    return (stints || []).map((stint) => ({
      driverNumber: stint.driver_number,
      stintNumber: stint.stint_number,
      compound: stint.compound,
    }))
  }

  async getRaceControlMessages(sessionKey: number): Promise<RaceControlMessage[]> {
    const messages = await openf1Get<OpenF1RaceControlResponse[]>('/race_control', {
      session_key: sessionKey,
    })
    return (messages || []).map((message) => ({
      date: message.date,
      flag: message.flag,
      category: message.category,
      message: message.message,
    }))
  }
}

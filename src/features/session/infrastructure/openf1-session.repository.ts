import { openf1Get } from '@/shared/lib/openf1-client'
import type { SessionRepository } from '../domain/session.repository'
import type { RaceSession } from '../domain/session.entity'

interface OpenF1SessionResponse {
  session_key: number
  meeting_key: number
  year: number
  location: string
  circuit_short_name: string
  meeting_name: string
  session_name: string
  session_type: string
  date_start: string
  date_end: string | null
  is_cancelled?: boolean
}

export class OpenF1SessionRepository implements SessionRepository {
  async getRaceSessions(year: number): Promise<RaceSession[]> {
    const sessions = await openf1Get<OpenF1SessionResponse[]>('/sessions', {
      year,
      session_type: 'Race',
    })
    return (sessions || [])
      .filter((session) => !session.is_cancelled && session.session_name === 'Race')
      .map((session) => ({
        sessionKey: session.session_key,
        meetingKey: session.meeting_key,
        year: session.year,
        location: session.location,
        circuitShortName: session.circuit_short_name,
        meetingName: session.meeting_name,
        sessionName: session.session_name,
        dateStart: session.date_start,
        dateEnd: session.date_end,
      }))
      .sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime())
  }
}

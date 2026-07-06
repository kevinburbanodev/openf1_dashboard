export interface RaceSession {
  sessionKey: number
  meetingKey: number
  year: number
  location: string
  circuitShortName: string
  meetingName: string
  sessionName: string
  dateStart: string
  dateEnd: string | null
}

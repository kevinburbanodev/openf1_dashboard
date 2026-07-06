import type { RaceResult } from './race-result.entity'
import type { Stint } from './stint.entity'
import type { RaceControlMessage } from './race-control-message.entity'

export interface TimingRepository {
  getResults(sessionKey: number): Promise<RaceResult[]>
  getStints(sessionKey: number): Promise<Stint[]>
  getRaceControlMessages(sessionKey: number): Promise<RaceControlMessage[]>
}

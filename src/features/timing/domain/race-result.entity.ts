export interface RaceResult {
  driverNumber: number
  position: number
  gapToLeader: number | string | null
  numberOfLaps: number | null
  isDnf: boolean
  isDns: boolean
  isDsq: boolean
}

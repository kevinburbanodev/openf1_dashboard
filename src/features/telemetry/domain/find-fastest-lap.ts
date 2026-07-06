import type { Lap } from './lap.entity'

export function findFastestLap(laps: Lap[]): Lap | null {
  const valid = laps.filter((lap) => lap.lapDuration != null && !lap.isPitOutLap && lap.dateStart)
  if (valid.length === 0) return null
  return [...valid].sort((a, b) => (a.lapDuration ?? Infinity) - (b.lapDuration ?? Infinity))[0]!
}

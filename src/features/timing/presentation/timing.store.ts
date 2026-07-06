import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RaceResult } from '../domain/race-result.entity'
import type { Stint } from '../domain/stint.entity'
import type { RaceControlMessage } from '../domain/race-control-message.entity'
import { OpenF1TimingRepository } from '../infrastructure/openf1-timing.repository'
import type { Lap } from '@/features/telemetry/domain/lap.entity'

type Status = 'idle' | 'loading' | 'success' | 'error'

const repository = new OpenF1TimingRepository()

export const useTimingStore = defineStore('timing', () => {
  const status = ref<Status>('idle')
  const rawResults = ref<RaceResult[]>([])
  const stints = ref<Stint[]>([])
  const rawRaceControl = ref<RaceControlMessage[]>([])
  const loadedSessionKey = ref<number | null>(null)

  const results = computed(() =>
    [...rawResults.value].sort((a, b) => a.position - b.position),
  )

  const winnerDriverNumber = computed(() => results.value[0]?.driverNumber ?? null)

  const lastStintByDriver = computed(() => {
    const map: Record<number, Stint> = {}
    for (const stint of stints.value) {
      const current = map[stint.driverNumber]
      if (!current || stint.stintNumber > current.stintNumber) map[stint.driverNumber] = stint
    }
    return map
  })

  const raceControl = computed(() =>
    [...rawRaceControl.value].filter((message) => message.message).slice(-16).reverse(),
  )

  // The "fastest lap" rail on the Timing tab always reflects the race
  // winner, captured once when the session loads — independent of whichever
  // driver is currently selected on the Telemetry tab.
  const winnerFastestLap = ref<Lap | null>(null)
  const winnerFastestLapDriverCode = ref<string | null>(null)

  function setWinnerFastestLap(lap: Lap | null, driverCode: string | null) {
    winnerFastestLap.value = lap
    winnerFastestLapDriverCode.value = driverCode
  }

  async function loadForSession(sessionKey: number) {
    if (loadedSessionKey.value === sessionKey && status.value === 'success') return
    status.value = 'loading'
    try {
      const [resultList, stintList, raceControlList] = await Promise.all([
        repository.getResults(sessionKey),
        repository.getStints(sessionKey),
        repository.getRaceControlMessages(sessionKey),
      ])
      rawResults.value = resultList
      stints.value = stintList
      rawRaceControl.value = raceControlList
      loadedSessionKey.value = sessionKey
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  return {
    status,
    results,
    lastStintByDriver,
    raceControl,
    winnerDriverNumber,
    winnerFastestLap,
    winnerFastestLapDriverCode,
    setWinnerFastestLap,
    loadForSession,
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DriverStanding } from '../domain/driver-standing.entity'
import type { TeamStanding } from '../domain/team-standing.entity'
import { OpenF1StandingsRepository } from '../infrastructure/openf1-standings.repository'

type Status = 'idle' | 'loading' | 'success' | 'error'

const repository = new OpenF1StandingsRepository()

export const useStandingsStore = defineStore('standings', () => {
  const status = ref<Status>('idle')
  const rawDriverStandings = ref<DriverStanding[]>([])
  const rawTeamStandings = ref<TeamStanding[]>([])
  const loadedSessionKey = ref<number | null>(null)

  const driverStandings = computed(() =>
    [...rawDriverStandings.value].sort((a, b) => (a.position ?? 99) - (b.position ?? 99)),
  )
  const teamStandings = computed(() =>
    [...rawTeamStandings.value].sort((a, b) => (a.position ?? 99) - (b.position ?? 99)),
  )

  async function ensureLoaded(sessionKey: number) {
    if (loadedSessionKey.value === sessionKey && status.value === 'success') return
    status.value = 'loading'
    try {
      const [drivers, teams] = await Promise.all([
        repository.getDriverStandings(sessionKey),
        repository.getTeamStandings(sessionKey),
      ])
      rawDriverStandings.value = drivers
      rawTeamStandings.value = teams
      loadedSessionKey.value = sessionKey
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  return { status, driverStandings, teamStandings, ensureLoaded }
})

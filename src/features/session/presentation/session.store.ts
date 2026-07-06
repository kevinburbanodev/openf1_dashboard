import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RaceSession } from '../domain/session.entity'
import { OpenF1SessionRepository } from '../infrastructure/openf1-session.repository'

type Status = 'idle' | 'loading' | 'success' | 'error'

const repository = new OpenF1SessionRepository()

export const useSessionStore = defineStore('session', () => {
  const year = ref(2025)
  const races = ref<RaceSession[]>([])
  const status = ref<Status>('idle')
  const errorMessage = ref('')
  const selected = ref<RaceSession | null>(null)

  async function loadYear(targetYear: number) {
    year.value = targetYear
    status.value = 'loading'
    errorMessage.value = ''
    selected.value = null
    try {
      races.value = await repository.getRaceSessions(targetYear)
      status.value = 'success'
      if (races.value.length > 0) {
        selected.value = races.value[0]!
      } else {
        errorMessage.value = `No hay carreras disponibles para ${targetYear}`
      }
    } catch {
      status.value = 'error'
      errorMessage.value = `No se pudo cargar la temporada ${targetYear}`
    }
  }

  function select(session: RaceSession) {
    selected.value = session
  }

  function selectByKey(sessionKey: number) {
    const found = races.value.find((race) => race.sessionKey === sessionKey)
    if (found) selected.value = found
  }

  function init() {
    if (status.value === 'idle') void loadYear(year.value)
  }

  return {
    year,
    races,
    status,
    errorMessage,
    selected,
    loadYear,
    select,
    selectByKey,
    init,
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TrackModel } from '../domain/build-track'
import { buildTrack } from '../domain/build-track'
import { OpenF1CircuitRepository } from '../infrastructure/openf1-circuit.repository'

type Status = 'idle' | 'loading' | 'success' | 'empty' | 'error'

const repository = new OpenF1CircuitRepository()

export const useCircuitStore = defineStore('circuit', () => {
  const status = ref<Status>('idle')
  const track = ref<TrackModel | null>(null)

  let loadToken = 0

  async function loadForDriver(
    sessionKey: number,
    driverNumber: number,
    startIso: string,
    endIso: string,
  ) {
    status.value = 'loading'
    track.value = null
    const token = ++loadToken
    try {
      const samples = await repository.getLocations(sessionKey, driverNumber, startIso, endIso)
      if (token !== loadToken) return
      const built = buildTrack(samples)
      if (!built) {
        status.value = 'empty'
        return
      }
      track.value = built
      status.value = 'success'
    } catch {
      if (token === loadToken) status.value = 'error'
    }
  }

  function reset() {
    loadToken += 1
    status.value = 'idle'
    track.value = null
  }

  return { status, track, loadForDriver, reset }
})

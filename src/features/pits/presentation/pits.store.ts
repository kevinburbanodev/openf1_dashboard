import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PitStop } from '../domain/pit-stop.entity'
import { OpenF1PitsRepository } from '../infrastructure/openf1-pits.repository'

type Status = 'idle' | 'loading' | 'success' | 'error'

const repository = new OpenF1PitsRepository()

export const usePitsStore = defineStore('pits', () => {
  const status = ref<Status>('idle')
  const pitStops = ref<PitStop[]>([])
  const loadedSessionKey = ref<number | null>(null)

  const sortedStops = computed(() =>
    [...pitStops.value].sort((a, b) => (a.pitDuration ?? Infinity) - (b.pitDuration ?? Infinity)),
  )

  const bestStop = computed(() => {
    const first = sortedStops.value[0]
    return first && first.pitDuration != null ? first : null
  })

  async function ensureLoaded(sessionKey: number) {
    if (loadedSessionKey.value === sessionKey && status.value === 'success') return
    status.value = 'loading'
    try {
      pitStops.value = await repository.getPitStops(sessionKey)
      loadedSessionKey.value = sessionKey
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  return { status, pitStops: sortedStops, bestStop, ensureLoaded }
})

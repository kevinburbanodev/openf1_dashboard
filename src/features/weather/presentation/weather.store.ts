import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WeatherReading } from '../domain/weather.entity'
import { OpenF1WeatherRepository } from '../infrastructure/openf1-weather.repository'

type Status = 'idle' | 'loading' | 'success' | 'error'

const repository = new OpenF1WeatherRepository()

export const useWeatherStore = defineStore('weather', () => {
  const status = ref<Status>('idle')
  const reading = ref<WeatherReading | null>(null)
  const loadedSessionKey = ref<number | null>(null)

  async function ensureLoaded(sessionKey: number) {
    if (loadedSessionKey.value === sessionKey && status.value === 'success') return
    status.value = 'loading'
    try {
      reading.value = await repository.getLatest(sessionKey)
      loadedSessionKey.value = sessionKey
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  return { status, reading, ensureLoaded }
})

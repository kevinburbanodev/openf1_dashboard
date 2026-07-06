import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CarDataSample } from '../domain/car-data-sample.entity'
import type { Lap } from '../domain/lap.entity'
import { findFastestLap } from '../domain/find-fastest-lap'
import { OpenF1TelemetryRepository } from '../infrastructure/openf1-telemetry.repository'

type Status = 'idle' | 'loading' | 'success' | 'empty' | 'error'

const repository = new OpenF1TelemetryRepository()

export const useTelemetryStore = defineStore('telemetry', () => {
  const selectedDriver = ref<number | null>(null)
  const status = ref<Status>('idle')
  const fastestLap = ref<Lap | null>(null)
  const samples = ref<CarDataSample[]>([])
  const windowStart = ref<string | null>(null)
  const windowEnd = ref<string | null>(null)
  const playbackIndex = ref(0)

  let loadToken = 0
  let timer: ReturnType<typeof setInterval> | null = null

  const currentSample = computed<CarDataSample | null>(() => {
    if (samples.value.length === 0) return null
    const index = Math.min(playbackIndex.value, samples.value.length - 1)
    return samples.value[index] ?? null
  })

  const maxSpeed = computed(() => {
    if (samples.value.length === 0) return null
    return Math.max(...samples.value.map((sample) => sample.speed ?? 0))
  })

  const tracePoints = computed(() => {
    const list = samples.value
    if (list.length === 0) return ''
    const speeds = list.map((sample) => sample.speed ?? 0)
    const min = Math.min(...speeds)
    const max = Math.max(...speeds)
    const range = Math.max(1, max - min)
    const n = list.length
    const step = Math.max(1, Math.ceil(n / 500))
    const points: string[] = []
    for (let i = 0; i < n; i += step) {
      const x = (i / (n - 1)) * 600
      const y = 190 - ((speeds[i]! - min) / range) * 175
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    }
    return points.join(' ')
  })

  const traceFill = computed(() => (tracePoints.value ? `0,200 ${tracePoints.value} 600,200` : ''))

  const playheadLeft = computed(() => {
    const n = samples.value.length
    if (n <= 1) return '0%'
    const index = Math.min(playbackIndex.value, n - 1)
    return `${((index / (n - 1)) * 100).toFixed(2)}%`
  })

  function stopPlayback() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function startPlayback() {
    stopPlayback()
    if (samples.value.length === 0) return
    timer = setInterval(() => {
      playbackIndex.value = (playbackIndex.value + 1) % samples.value.length
    }, 85)
  }

  async function selectDriver(sessionKey: number, driverNumber: number) {
    selectedDriver.value = driverNumber
    status.value = 'loading'
    samples.value = []
    playbackIndex.value = 0
    stopPlayback()
    const token = ++loadToken
    try {
      const laps = await repository.getLaps(sessionKey, driverNumber)
      const fast = findFastestLap(laps)
      if (token !== loadToken) return
      fastestLap.value = fast
      if (!fast || !fast.dateStart || fast.lapDuration == null) {
        status.value = 'empty'
        return
      }
      const start = new Date(new Date(fast.dateStart).getTime() - 500).toISOString()
      const end = new Date(
        new Date(fast.dateStart).getTime() + (fast.lapDuration + 2) * 1000,
      ).toISOString()
      windowStart.value = start
      windowEnd.value = end
      const carData = await repository.getCarData(sessionKey, driverNumber, start, end)
      if (token !== loadToken) return
      if (carData.length === 0) {
        status.value = 'empty'
        return
      }
      samples.value = carData
      status.value = 'success'
      startPlayback()
    } catch {
      if (token === loadToken) status.value = 'error'
    }
  }

  function reset() {
    stopPlayback()
    loadToken += 1
    selectedDriver.value = null
    status.value = 'idle'
    samples.value = []
    fastestLap.value = null
    windowStart.value = null
    windowEnd.value = null
    playbackIndex.value = 0
  }

  return {
    selectedDriver,
    status,
    fastestLap,
    samples,
    windowStart,
    windowEnd,
    playbackIndex,
    currentSample,
    maxSpeed,
    tracePoints,
    traceFill,
    playheadLeft,
    selectDriver,
    startPlayback,
    stopPlayback,
    reset,
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Driver } from '../domain/driver.entity'
import { OpenF1DriverRepository } from '../infrastructure/openf1-driver.repository'

type Status = 'idle' | 'loading' | 'success' | 'error'

const repository = new OpenF1DriverRepository()

export const useDriversStore = defineStore('drivers', () => {
  const status = ref<Status>('idle')
  const driverList = ref<Driver[]>([])
  const loadedSessionKey = ref<number | null>(null)

  const driverMap = computed<Record<number, Driver>>(() => {
    const map: Record<number, Driver> = {}
    for (const driver of driverList.value) map[driver.driverNumber] = driver
    return map
  })

  async function ensureLoaded(sessionKey: number) {
    if (loadedSessionKey.value === sessionKey && status.value === 'success') return
    status.value = 'loading'
    try {
      const drivers = await repository.getBySession(sessionKey)
      driverList.value = [...drivers].sort((a, b) => a.driverNumber - b.driverNumber)
      loadedSessionKey.value = sessionKey
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  function driverByNumber(driverNumber: number | null | undefined): Driver | undefined {
    if (driverNumber == null) return undefined
    return driverMap.value[driverNumber]
  }

  return { status, driverList, driverMap, ensureLoaded, driverByNumber }
})

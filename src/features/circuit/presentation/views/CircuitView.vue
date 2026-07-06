<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '@/features/session/presentation/session.store'
import { useDriversStore } from '@/features/drivers/presentation/drivers.store'
import { useTimingStore } from '@/features/timing/presentation/timing.store'
import { useTelemetryStore } from '@/features/telemetry/presentation/telemetry.store'
import { useCircuitStore } from '../circuit.store'
import DriverChips from '@/shared/ui/DriverChips.vue'
import LoadingState from '@/shared/ui/LoadingState.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import TrackMap from '../components/TrackMap.vue'
import { drsState } from '@/shared/lib/colors'
import { formatLapTime } from '@/shared/lib/format'

const sessionStore = useSessionStore()
const driversStore = useDriversStore()
const timingStore = useTimingStore()
const telemetryStore = useTelemetryStore()
const circuitStore = useCircuitStore()

const chipDrivers = computed(() => {
  if (timingStore.results.length > 0) {
    return timingStore.results
      .map((result) => driversStore.driverByNumber(result.driverNumber))
      .filter((driver) => !!driver)
  }
  return driversStore.driverList
})

const selectedDriver = computed(() => driversStore.driverByNumber(telemetryStore.selectedDriver))

const progress = computed(() => {
  const n = telemetryStore.samples.length
  if (n <= 1) return 0
  return telemetryStore.playbackIndex / (n - 1)
})

const drs = computed(() => drsState(telemetryStore.currentSample?.drs))
const drsLabel = computed(() =>
  drs.value === 'on' ? 'ON' : drs.value === 'detected' ? 'DET' : 'OFF',
)

function pickDriver(driverNumber: number) {
  const sessionKey = sessionStore.selected?.sessionKey
  if (sessionKey) void telemetryStore.selectDriver(sessionKey, driverNumber)
}
</script>

<template>
  <div class="px-6.5 pt-4.5 pb-10">
    <DriverChips
      :drivers="chipDrivers"
      :selected="telemetryStore.selectedDriver"
      @pick="pickDriver"
    />

    <LoadingState v-if="circuitStore.status === 'loading'" label="TRAZANDO CIRCUITO…" />
    <EmptyState
      v-else-if="circuitStore.status === 'empty'"
      message="No hay datos de posición (location) para esta sesión / piloto."
    />

    <div v-else-if="circuitStore.status === 'success' && circuitStore.track" class="grid grid-cols-[1fr_300px] gap-4.5">
      <TrackMap
        :track="circuitStore.track"
        :progress="progress"
        :color="selectedDriver?.teamColor ?? '#8a8f9a'"
        :title="sessionStore.selected?.location.toUpperCase() ?? ''"
      />
      <div class="flex flex-col gap-3">
        <div class="rounded-2xl border border-carbon-600 bg-carbon-800 p-4">
          <div class="mb-1.5 flex items-center gap-2.5">
            <span class="h-6 w-1.25 rounded-sm" :style="{ background: selectedDriver?.teamColor }"></span>
            <span class="font-condensed text-2xl font-extrabold text-white">{{
              selectedDriver?.nameAcronym ?? '—'
            }}</span>
          </div>
          <div class="text-xs text-ink-400">
            {{ selectedDriver?.fullName }} · {{ selectedDriver?.teamName }}
          </div>
        </div>
        <div class="rounded-2xl border border-carbon-600 bg-carbon-800 p-4">
          <div class="mb-1 font-mono text-[9px] text-ink-600">VELOCIDAD EN PISTA</div>
          <div class="flex items-end gap-1.5">
            <span class="font-display text-5xl leading-[0.8] text-green">{{
              telemetryStore.currentSample?.speed ?? '—'
            }}</span>
            <span class="mb-2 font-mono text-xs text-ink-600">KM/H</span>
          </div>
          <div class="mt-3.5 flex gap-4">
            <div>
              <div class="font-mono text-[9px] text-ink-600">GEAR</div>
              <div class="font-display text-2xl leading-none text-amber">
                {{ telemetryStore.currentSample?.gear || 'N' }}
              </div>
            </div>
            <div>
              <div class="font-mono text-[9px] text-ink-600">DRS</div>
              <div
                class="font-display text-xl leading-snug"
                :class="drs === 'on' ? 'text-green' : drs === 'detected' ? 'text-yellow' : 'text-ink-600'"
              >
                {{ drsLabel }}
              </div>
            </div>
          </div>
        </div>
        <div class="rounded-2xl border border-carbon-600 bg-carbon-800 px-4 py-3.5">
          <div class="mb-1.5 font-mono text-[9px] text-ink-600">VUELTA RÁPIDA</div>
          <div class="font-display text-2xl text-purple">
            {{ formatLapTime(telemetryStore.fastestLap?.lapDuration) }}
          </div>
          <div class="mt-3 flex items-center gap-1.75 font-mono text-xs text-ink-500">
            <span class="h-2.75 w-2.75 rounded-full border-2 border-ink-100"></span> Meta / línea
            de salida
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

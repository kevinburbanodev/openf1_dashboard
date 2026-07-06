<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useSessionStore } from '@/features/session/presentation/session.store'
import { useDriversStore } from '@/features/drivers/presentation/drivers.store'
import { useTimingStore } from '@/features/timing/presentation/timing.store'
import { useTelemetryStore } from '../telemetry.store'
import DriverChips from '@/shared/ui/DriverChips.vue'
import LoadingState from '@/shared/ui/LoadingState.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import SpeedTraceChart from '../components/SpeedTraceChart.vue'
import LiveReadouts from '../components/LiveReadouts.vue'
import { formatLapTime } from '@/shared/lib/format'

const sessionStore = useSessionStore()
const driversStore = useDriversStore()
const timingStore = useTimingStore()
const telemetryStore = useTelemetryStore()

const chipDrivers = computed(() => {
  if (timingStore.results.length > 0) {
    return timingStore.results
      .map((result) => driversStore.driverByNumber(result.driverNumber))
      .filter((driver) => !!driver)
  }
  return driversStore.driverList
})

const selectedDriver = computed(() => driversStore.driverByNumber(telemetryStore.selectedDriver))

function pickDriver(driverNumber: number) {
  const sessionKey = sessionStore.selected?.sessionKey
  if (sessionKey) void telemetryStore.selectDriver(sessionKey, driverNumber)
}

onMounted(() => {
  if (telemetryStore.samples.length > 0) telemetryStore.startPlayback()
})
onUnmounted(() => {
  telemetryStore.stopPlayback()
})
</script>

<template>
  <div class="px-6.5 pt-4.5 pb-10">
    <DriverChips
      :drivers="chipDrivers"
      :selected="telemetryStore.selectedDriver"
      @pick="pickDriver"
    />

    <LoadingState v-if="telemetryStore.status === 'loading'" label="RECONSTRUYENDO VUELTA RÁPIDA…" />
    <EmptyState
      v-else-if="telemetryStore.status === 'empty'"
      message="No hay datos de telemetría de coche para esta sesión / piloto."
    />

    <div v-else-if="telemetryStore.status === 'success'" class="grid grid-cols-[1fr_320px] gap-4.5">
      <SpeedTraceChart
        :driver="selectedDriver"
        :lap-label="formatLapTime(telemetryStore.fastestLap?.lapDuration)"
        :trace-points="telemetryStore.tracePoints"
        :trace-fill="telemetryStore.traceFill"
        :playhead-left="telemetryStore.playheadLeft"
        :max-speed="telemetryStore.maxSpeed"
      />
      <LiveReadouts :sample="telemetryStore.currentSample" />
    </div>
  </div>
</template>

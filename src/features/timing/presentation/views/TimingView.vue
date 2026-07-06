<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDriversStore } from '@/features/drivers/presentation/drivers.store'
import { useTimingStore } from '../timing.store'
import { useTelemetryStore } from '@/features/telemetry/presentation/telemetry.store'
import { useSessionStore } from '@/features/session/presentation/session.store'
import LoadingState from '@/shared/ui/LoadingState.vue'
import SectionCard from '@/shared/ui/SectionCard.vue'
import ResultsTable from '../components/ResultsTable.vue'
import RaceControlFeed from '../components/RaceControlFeed.vue'
import { formatLapTime } from '@/shared/lib/format'

const router = useRouter()
const sessionStore = useSessionStore()
const driversStore = useDriversStore()
const timingStore = useTimingStore()
const telemetryStore = useTelemetryStore()

function goToTelemetry(driverNumber: number) {
  const sessionKey = sessionStore.selected?.sessionKey
  if (sessionKey) void telemetryStore.selectDriver(sessionKey, driverNumber)
  void router.push('/telemetry')
}
</script>

<template>
  <div class="grid grid-cols-[1fr_384px] gap-0 px-6.5 pt-4.5 pb-10">
    <SectionCard>
      <LoadingState v-if="timingStore.status === 'loading'" label="CARGANDO CLASIFICACIÓN…" />
      <ResultsTable
        v-else-if="timingStore.results.length > 0"
        :results="timingStore.results"
        :driver-map="driversStore.driverMap"
        :last-stint-by-driver="timingStore.lastStintByDriver"
        @pick="goToTelemetry"
      />
    </SectionCard>

    <div class="flex flex-col gap-3.5 pl-4">
      <div class="rounded-2xl border border-carbon-600 bg-carbon-800 px-4 py-3.5">
        <div class="mb-1 font-mono text-[9px] tracking-wide text-ink-600">◢ VUELTA RÁPIDA</div>
        <div class="mb-1.5 flex items-center gap-2.5">
          <span class="h-6.5 w-1 bg-purple"></span>
          <span class="font-condensed text-[22px] font-extrabold text-white">{{
            timingStore.winnerFastestLapDriverCode ?? '—'
          }}</span>
        </div>
        <div class="font-display text-[34px] leading-[0.9] text-purple">
          {{ formatLapTime(timingStore.winnerFastestLap?.lapDuration) }}
        </div>
      </div>
      <div class="flex-1 rounded-2xl border border-carbon-600 bg-carbon-800 px-4 py-3.5">
        <div class="mb-2.5 font-mono text-[9px] tracking-wide text-ink-600">◢ RACE CONTROL</div>
        <RaceControlFeed
          v-if="timingStore.raceControl.length > 0"
          :messages="timingStore.raceControl"
        />
        <div v-else class="font-mono text-xs text-ink-700">
          Sin mensajes de dirección de carrera.
        </div>
      </div>
    </div>
  </div>
</template>

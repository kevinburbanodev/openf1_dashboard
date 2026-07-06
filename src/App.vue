<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useSessionStore } from '@/features/session/presentation/session.store'
import { useDriversStore } from '@/features/drivers/presentation/drivers.store'
import { useTimingStore } from '@/features/timing/presentation/timing.store'
import { useTelemetryStore } from '@/features/telemetry/presentation/telemetry.store'
import { useCircuitStore } from '@/features/circuit/presentation/circuit.store'
import { usePitsStore } from '@/features/pits/presentation/pits.store'
import { useStandingsStore } from '@/features/standings/presentation/standings.store'
import { useWeatherStore } from '@/features/weather/presentation/weather.store'
import AppHeader from '@/shared/layout/AppHeader.vue'
import AppTabs from '@/shared/layout/AppTabs.vue'
import ErrorState from '@/shared/ui/ErrorState.vue'

const sessionStore = useSessionStore()
const driversStore = useDriversStore()
const timingStore = useTimingStore()
const telemetryStore = useTelemetryStore()
const circuitStore = useCircuitStore()
const pitsStore = usePitsStore()
const standingsStore = useStandingsStore()
const weatherStore = useWeatherStore()

// Composition root: this is the only place that knows how the features
// depend on each other. Every store below stays independent and unaware
// of its siblings — App.vue wires the session -> drivers/timing/etc. and
// timing -> telemetry -> circuit chains together.
watch(
  () => sessionStore.selected?.sessionKey,
  (sessionKey) => {
    telemetryStore.reset()
    circuitStore.reset()
    if (!sessionKey) return
    void driversStore.ensureLoaded(sessionKey)
    void timingStore.loadForSession(sessionKey)
    void pitsStore.ensureLoaded(sessionKey)
    void standingsStore.ensureLoaded(sessionKey)
    void weatherStore.ensureLoaded(sessionKey)
  },
  { immediate: true },
)

watch(
  () => timingStore.winnerDriverNumber,
  async (winner) => {
    const sessionKey = sessionStore.selected?.sessionKey
    if (!winner || !sessionKey || telemetryStore.selectedDriver != null) return
    await telemetryStore.selectDriver(sessionKey, winner)
    timingStore.setWinnerFastestLap(
      telemetryStore.fastestLap,
      driversStore.driverByNumber(winner)?.nameAcronym ?? null,
    )
  },
)

watch(
  () => [telemetryStore.selectedDriver, telemetryStore.windowStart, telemetryStore.windowEnd],
  ([, windowStart, windowEnd]) => {
    const sessionKey = sessionStore.selected?.sessionKey
    const driver = telemetryStore.selectedDriver
    if (sessionKey && driver && windowStart && windowEnd) {
      void circuitStore.loadForDriver(sessionKey, driver as number, windowStart as string, windowEnd as string)
    }
  },
)

onMounted(() => {
  sessionStore.init()
})
</script>

<template>
  <div class="relative min-h-screen">
    <div class="scanlines"></div>
    <AppHeader />

    <div class="flex items-baseline gap-3.5 px-6.5 pt-4 pb-2.5">
      <div class="font-display text-3xl leading-[0.9] text-white">
        {{
          sessionStore.selected
            ? sessionStore.selected.location.toUpperCase()
            : sessionStore.status === 'loading'
              ? 'CARGANDO…'
              : '—'
        }}
      </div>
      <div class="font-mono text-[11px] tracking-wide text-ink-500">
        <template v-if="sessionStore.selected">
          {{ sessionStore.selected.circuitShortName }} · {{ sessionStore.selected.sessionName }} ·
          {{ sessionStore.selected.year }}
        </template>
      </div>
    </div>

    <AppTabs />

    <ErrorState v-if="sessionStore.errorMessage" :message="sessionStore.errorMessage" />

    <main>
      <RouterView />
    </main>
  </div>
</template>

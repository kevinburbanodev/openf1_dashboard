<script setup lang="ts">
import { useSessionStore } from '@/features/session/presentation/session.store'
import { useWeatherStore } from '@/features/weather/presentation/weather.store'
import WeatherChips from '@/features/weather/presentation/components/WeatherChips.vue'

const YEARS = [2023, 2024, 2025, 2026]

const sessionStore = useSessionStore()
const weatherStore = useWeatherStore()

function onSelectRace(event: Event) {
  const sessionKey = Number((event.target as HTMLSelectElement).value)
  sessionStore.selectByKey(sessionKey)
}
</script>

<template>
  <div
    class="sticky top-0 z-20 flex items-center gap-4 border-b-2 border-race-red bg-gradient-to-r from-carbon-700 to-carbon-800 px-6.5 py-3.5"
  >
    <div class="font-display text-2xl leading-[0.9] text-white">
      OPENF1<span class="text-race-red">.</span>
    </div>
    <div class="-ml-1.5 font-mono text-[10px] tracking-wide text-ink-600">DASHBOARD</div>

    <div class="ml-2.5 flex gap-1.5">
      <button
        v-for="y in YEARS"
        :key="y"
        type="button"
        class="rounded-lg border px-2.75 py-1.25 font-condensed text-sm font-bold tracking-wide"
        :class="
          y === sessionStore.year
            ? 'border-race-red bg-race-red text-white'
            : 'border-carbon-500 bg-carbon-900 text-ink-400'
        "
        @click="sessionStore.loadYear(y)"
      >
        {{ y }}
      </button>
    </div>

    <select
      class="ml-1.5 max-w-70 cursor-pointer rounded-lg border border-carbon-600 bg-carbon-900 px-3 py-1.75 font-condensed text-sm font-semibold text-ink-100"
      :value="sessionStore.selected?.sessionKey"
      @change="onSelectRace"
    >
      <option v-for="race in sessionStore.races" :key="race.sessionKey" :value="race.sessionKey">
        {{ race.location }} — {{ race.sessionName }} {{ race.year }}
      </option>
    </select>

    <div
      class="flex items-center gap-1.75 rounded-full border border-race-red/40 bg-race-red/14 px-2.75 py-1"
    >
      <span class="h-2 w-2 animate-f1-blink rounded-full bg-race-red"></span>
      <span class="font-mono text-[10px] font-semibold tracking-widest text-race-red-light"
        >RESULT</span
      >
    </div>

    <WeatherChips :reading="weatherStore.reading" />
  </div>
</template>

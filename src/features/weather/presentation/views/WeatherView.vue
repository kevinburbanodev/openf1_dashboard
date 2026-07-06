<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore } from '../weather.store'
import LoadingState from '@/shared/ui/LoadingState.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'

const weatherStore = useWeatherStore()
const reading = computed(() => weatherStore.reading)
const isRaining = computed(() => (reading.value?.rainfall ?? 0) > 0)
</script>

<template>
  <div class="px-6.5 pt-5.5 pb-11">
    <LoadingState v-if="weatherStore.status === 'loading'" />
    <div
      v-else-if="reading"
      class="grid max-w-4xl grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4"
    >
      <div class="rounded-2xl border border-carbon-600 bg-carbon-800 p-5">
        <div class="mb-2 font-mono text-[10px] text-ink-600">TEMP. PISTA</div>
        <div class="font-display text-5xl leading-[0.9] text-amber">
          {{ Math.round(reading.trackTemperature ?? 0) }}°
        </div>
      </div>
      <div class="rounded-2xl border border-carbon-600 bg-carbon-800 p-5">
        <div class="mb-2 font-mono text-[10px] text-ink-600">TEMP. AIRE</div>
        <div class="font-display text-5xl leading-[0.9] text-ink-100">
          {{ Math.round(reading.airTemperature ?? 0) }}°
        </div>
      </div>
      <div class="rounded-2xl border border-carbon-600 bg-carbon-800 p-5">
        <div class="mb-2 font-mono text-[10px] text-ink-600">HUMEDAD</div>
        <div class="font-display text-5xl leading-[0.9] text-blue">
          {{ Math.round(reading.humidity ?? 0) }}%
        </div>
      </div>
      <div class="flex flex-col items-start rounded-2xl border border-carbon-600 bg-carbon-800 p-5">
        <div class="mb-2 font-mono text-[10px] text-ink-600">
          VIENTO · {{ reading.windSpeed ?? '—' }} m/s
        </div>
        <div
          class="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-carbon-500"
        >
          <span class="absolute top-0.75 font-mono text-[8px] text-ink-600">N</span>
          <div
            class="h-0 w-0 border-x-6 border-b-26 border-x-transparent border-b-race-red"
            :style="{ transform: `rotate(${reading.windDirection ?? 0}deg)` }"
          ></div>
        </div>
      </div>
      <div class="rounded-2xl border border-carbon-600 bg-carbon-800 p-5">
        <div class="mb-2 font-mono text-[10px] text-ink-600">PRESIÓN</div>
        <div class="font-display text-4xl leading-[0.9] text-ink-100">
          {{ Math.round(reading.pressure ?? 0) }}
        </div>
        <div class="font-mono text-[10px] text-ink-600">mbar</div>
      </div>
      <div
        class="rounded-2xl border p-5"
        :class="isRaining ? 'border-blue/40 bg-blue/[0.08]' : 'border-carbon-600 bg-carbon-800'"
      >
        <div class="mb-2 font-mono text-[10px] text-ink-600">LLUVIA</div>
        <div
          class="font-display text-4xl leading-[0.9]"
          :class="isRaining ? 'text-blue' : 'text-green'"
        >
          {{ isRaining ? 'SÍ' : 'NO' }}
        </div>
      </div>
    </div>
    <EmptyState
      v-else-if="weatherStore.status === 'success'"
      message="Sin datos meteorológicos para esta sesión."
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherReading } from '../../domain/weather.entity'

const props = defineProps<{ reading: WeatherReading | null }>()

const isRaining = computed(() => (props.reading?.rainfall ?? 0) > 0)
</script>

<template>
  <div class="ml-auto flex gap-2.25">
    <div class="rounded-lg border border-carbon-600 bg-carbon-900 px-3 py-1.5 text-center">
      <div class="font-mono text-[8px] text-ink-600">TRACK</div>
      <div class="font-condensed text-[17px] font-bold text-amber">
        {{ reading ? Math.round(reading.trackTemperature ?? 0) + '°' : '—' }}
      </div>
    </div>
    <div class="rounded-lg border border-carbon-600 bg-carbon-900 px-3 py-1.5 text-center">
      <div class="font-mono text-[8px] text-ink-600">AIR</div>
      <div class="font-condensed text-[17px] font-bold text-ink-100">
        {{ reading ? Math.round(reading.airTemperature ?? 0) + '°' : '—' }}
      </div>
    </div>
    <div class="rounded-lg border border-carbon-600 bg-carbon-900 px-3 py-1.5 text-center">
      <div class="font-mono text-[8px] text-ink-600">HUM</div>
      <div class="font-condensed text-[17px] font-bold text-ink-100">
        {{ reading ? Math.round(reading.humidity ?? 0) + '%' : '—' }}
      </div>
    </div>
    <div class="rounded-lg border border-carbon-600 bg-carbon-900 px-3 py-1.5 text-center">
      <div class="font-mono text-[8px] text-ink-600">RAIN</div>
      <div
        class="font-condensed text-[17px] font-bold"
        :class="isRaining ? 'text-blue' : 'text-green'"
      >
        {{ reading ? (isRaining ? 'SÍ' : 'NO') : '—' }}
      </div>
    </div>
  </div>
</template>

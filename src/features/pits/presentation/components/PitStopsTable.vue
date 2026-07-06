<script setup lang="ts">
import { computed } from 'vue'
import type { PitStop } from '../../domain/pit-stop.entity'
import type { Driver } from '@/features/drivers/domain/driver.entity'

const props = defineProps<{ pitStops: PitStop[]; driverMap: Record<number, Driver> }>()

const rows = computed(() =>
  props.pitStops.map((stop, index) => {
    const driver = props.driverMap[stop.driverNumber]
    const isBest = index === 0 && stop.pitDuration != null
    return {
      rank: index + 1,
      code: driver?.nameAcronym ?? `#${stop.driverNumber}`,
      name: driver?.fullName ?? '',
      color: driver?.teamColor ?? '#8a8f9a',
      lap: stop.lapNumber ?? '—',
      duration: stop.pitDuration != null ? `${stop.pitDuration.toFixed(1)}s` : '—',
      isBest,
    }
  }),
)
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-carbon-600 bg-carbon-800">
    <div
      class="grid grid-cols-[44px_100px_1fr_70px_96px] gap-2.5 border-b border-carbon-600 px-4.5 py-2.5 font-mono text-[9px] tracking-wide text-ink-600"
    >
      <span>#</span><span>DRIVER</span><span></span
      ><span class="text-right">LAP</span><span class="text-right">PARADA</span>
    </div>
    <div
      v-for="row in rows"
      :key="row.rank"
      class="grid h-10 grid-cols-[44px_100px_1fr_70px_96px] items-center gap-2.5 border-b border-white/[0.045] px-4.5"
      :style="{ borderLeft: `2px solid ${row.isBest ? 'rgba(57,255,139,.4)' : 'transparent'}` }"
    >
      <span class="font-display text-base" :style="{ color: row.isBest ? '#39ff8b' : '#6f747f' }">{{
        row.rank
      }}</span>
      <span class="flex items-center gap-2">
        <span class="h-5.5 w-1 rounded-sm" :style="{ background: row.color }"></span>
        <span class="font-condensed text-[17px] font-extrabold text-ink-100">{{ row.code }}</span>
      </span>
      <span class="text-xs text-ink-400">{{ row.name }}</span>
      <span class="text-right font-mono text-xs text-ink-400">{{ row.lap }}</span>
      <span
        class="text-right font-mono text-sm font-semibold"
        :style="{ color: row.isBest ? '#39ff8b' : '#6f747f' }"
        >{{ row.duration }}</span
      >
    </div>
  </div>
</template>

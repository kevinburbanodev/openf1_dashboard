<script setup lang="ts">
import { computed } from 'vue'
import type { RaceResult } from '../../domain/race-result.entity'
import type { Stint } from '../../domain/stint.entity'
import type { Driver } from '@/features/drivers/domain/driver.entity'
import { compoundInfo } from '@/shared/lib/colors'
import { formatGap } from '@/shared/lib/format'

const props = defineProps<{
  results: RaceResult[]
  driverMap: Record<number, Driver>
  lastStintByDriver: Record<number, Stint>
}>()
const emit = defineEmits<{ pick: [driverNumber: number] }>()

const rows = computed(() =>
  props.results.map((result) => {
    const driver = props.driverMap[result.driverNumber]
    const compound = compoundInfo(props.lastStintByDriver[result.driverNumber]?.compound)
    const status = result.isDnf ? 'DNF' : result.isDns ? 'DNS' : result.isDsq ? 'DSQ' : ''
    return {
      driverNumber: result.driverNumber,
      position: result.position,
      code: driver?.nameAcronym ?? `#${result.driverNumber}`,
      name: driver?.fullName ?? '',
      color: driver?.teamColor ?? '#8a8f9a',
      gapTxt: formatGap(result),
      gapColor: result.position === 1 ? '#39ff8b' : '#c3c8d0',
      laps: result.numberOfLaps ?? '—',
      tyreCode: compound.code,
      tyreColor: compound.color,
      status,
      posColor: result.position <= 3 ? '#ffb000' : '#fff',
    }
  }),
)
</script>

<template>
  <div>
    <div
      class="grid grid-cols-[44px_84px_1fr_96px_62px_34px_52px] gap-2.5 border-b border-carbon-600 px-4.5 py-2.5 font-mono text-[9px] tracking-wide text-ink-600"
    >
      <span>POS</span><span>DRIVER</span><span></span
      ><span class="text-right">GAP</span><span class="text-right">LAPS</span
      ><span class="text-center">TY</span><span class="text-center">STAT</span>
    </div>
    <button
      v-for="row in rows"
      :key="row.driverNumber"
      type="button"
      class="grid h-9.5 w-full grid-cols-[44px_84px_1fr_96px_62px_34px_52px] items-center gap-2.5 border-b border-white/[0.045] px-4.5 text-left hover:bg-white/[0.03]"
      @click="emit('pick', row.driverNumber)"
    >
      <span class="font-display text-lg" :style="{ color: row.posColor }">{{
        row.position
      }}</span>
      <span class="flex items-center gap-2">
        <span class="h-5.5 w-1 rounded-sm" :style="{ background: row.color }"></span>
        <span class="font-condensed text-[17px] font-extrabold text-ink-100">{{ row.code }}</span>
      </span>
      <span class="truncate text-[13px] text-ink-400">{{ row.name }}</span>
      <span class="text-right font-mono text-[13px]" :style="{ color: row.gapColor }">{{
        row.gapTxt
      }}</span>
      <span class="text-right font-mono text-xs text-ink-400">{{ row.laps }}</span>
      <span
        class="mx-auto flex h-5.25 w-5.25 items-center justify-center rounded-full border-2 font-mono text-[10px] font-bold"
        :style="{ borderColor: row.tyreColor, color: row.tyreColor }"
        >{{ row.tyreCode }}</span
      >
      <span
        class="mx-auto font-mono text-[10px] font-semibold"
        :style="{ color: row.status ? '#ff5b52' : '#4a4f59' }"
        >{{ row.status }}</span
      >
    </button>
  </div>
</template>

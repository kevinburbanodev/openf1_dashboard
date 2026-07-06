<script setup lang="ts">
import { useDriversStore } from '@/features/drivers/presentation/drivers.store'
import { usePitsStore } from '../pits.store'
import LoadingState from '@/shared/ui/LoadingState.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import PitStopsTable from '../components/PitStopsTable.vue'

const driversStore = useDriversStore()
const pitsStore = usePitsStore()
</script>

<template>
  <div class="px-6.5 pt-5.5 pb-11">
    <LoadingState v-if="pitsStore.status === 'loading'" />
    <template v-else-if="pitsStore.pitStops.length > 0">
      <div v-if="pitsStore.bestStop" class="mb-4.5 flex flex-wrap items-stretch gap-4">
        <div class="min-w-55 rounded-2xl border border-green/35 bg-green/[0.06] px-5.5 py-4">
          <div class="mb-1.5 font-mono text-[9px] text-ink-600">◢ PARADA MÁS RÁPIDA</div>
          <div class="flex items-baseline gap-2.5">
            <span
              class="h-8.5 self-center w-1.25"
              :style="{ background: driversStore.driverByNumber(pitsStore.bestStop.driverNumber)?.teamColor }"
            ></span>
            <span class="font-condensed text-[26px] font-extrabold text-white">{{
              driversStore.driverByNumber(pitsStore.bestStop.driverNumber)?.nameAcronym ??
              `#${pitsStore.bestStop.driverNumber}`
            }}</span>
            <span class="font-display text-[38px] leading-[0.9] text-green"
              >{{ pitsStore.bestStop.pitDuration?.toFixed(1) }}s</span
            >
          </div>
        </div>
      </div>
      <PitStopsTable :pit-stops="pitsStore.pitStops" :driver-map="driversStore.driverMap" />
    </template>
    <EmptyState
      v-else-if="pitsStore.status === 'success'"
      message="Sin datos de paradas en boxes para esta sesión. (La duración estacionaria solo está disponible desde el GP de EE.UU. 2024)."
    />
  </div>
</template>

<script setup lang="ts">
import { useDriversStore } from '@/features/drivers/presentation/drivers.store'
import { useStandingsStore } from '../standings.store'
import LoadingState from '@/shared/ui/LoadingState.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'

const driversStore = useDriversStore()
const standingsStore = useStandingsStore()
</script>

<template>
  <div class="grid grid-cols-2 gap-5.5 px-6.5 pt-5.5 pb-11">
    <div>
      <div class="mb-3 font-display text-xl text-white">
        CAMPEONATO DE PILOTOS
        <span class="font-mono text-[10px] text-ink-600">· tras esta carrera</span>
      </div>
      <LoadingState v-if="standingsStore.status === 'loading'" />
      <div
        v-else-if="standingsStore.driverStandings.length > 0"
        class="overflow-hidden rounded-2xl border border-carbon-600 bg-carbon-800"
      >
        <div
          v-for="standing in standingsStore.driverStandings"
          :key="standing.driverNumber"
          class="grid h-11 grid-cols-[36px_6px_1fr_70px_54px] items-center gap-3 border-b border-white/[0.045] px-4"
        >
          <span
            class="font-display text-lg"
            :style="{ color: (standing.position ?? 99) <= 3 ? '#ffb000' : '#fff' }"
            >{{ standing.position ?? '—' }}</span
          >
          <span
            class="h-6.5 w-1.25 rounded-sm"
            :style="{ background: driversStore.driverByNumber(standing.driverNumber)?.teamColor }"
          ></span>
          <span class="flex flex-col">
            <span class="font-condensed text-base leading-none font-extrabold text-ink-100">{{
              driversStore.driverByNumber(standing.driverNumber)?.nameAcronym ??
              `#${standing.driverNumber}`
            }}</span>
            <span class="text-[10px] text-ink-600">{{
              driversStore.driverByNumber(standing.driverNumber)?.teamName
            }}</span>
          </span>
          <span class="text-right font-display text-xl text-white">{{
            standing.points ?? '—'
          }}</span>
          <span
            class="text-right font-mono text-xs"
            :class="standing.pointsGained > 0 ? 'text-green' : 'text-ink-700'"
            >{{ standing.pointsGained > 0 ? `+${standing.pointsGained}` : '·' }}</span
          >
        </div>
      </div>
      <EmptyState
        v-else-if="standingsStore.status === 'success'"
        message="Standings no disponibles para esta sesión."
      />
    </div>

    <div>
      <div class="mb-3 font-display text-xl text-white">CAMPEONATO DE CONSTRUCTORES</div>
      <LoadingState v-if="standingsStore.status === 'loading'" />
      <div
        v-else-if="standingsStore.teamStandings.length > 0"
        class="overflow-hidden rounded-2xl border border-carbon-600 bg-carbon-800"
      >
        <div
          v-for="standing in standingsStore.teamStandings"
          :key="standing.teamName"
          class="grid h-11 grid-cols-[36px_1fr_70px_54px] items-center gap-3 border-b border-white/[0.045] px-4"
        >
          <span
            class="font-display text-lg"
            :style="{ color: (standing.position ?? 99) <= 3 ? '#ffb000' : '#fff' }"
            >{{ standing.position ?? '—' }}</span
          >
          <span class="font-condensed text-base font-bold text-ink-100">{{
            standing.teamName
          }}</span>
          <span class="text-right font-display text-xl text-white">{{
            standing.points ?? '—'
          }}</span>
          <span
            class="text-right font-mono text-xs"
            :class="standing.pointsGained > 0 ? 'text-green' : 'text-ink-700'"
            >{{ standing.pointsGained > 0 ? `+${standing.pointsGained}` : '·' }}</span
          >
        </div>
      </div>
      <EmptyState
        v-else-if="standingsStore.status === 'success'"
        message="Standings no disponibles para esta sesión."
      />
    </div>
  </div>
</template>

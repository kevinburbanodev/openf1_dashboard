<script setup lang="ts">
import type { Driver } from '@/features/drivers/domain/driver.entity'

defineProps<{ drivers: Driver[]; selected: number | null }>()
const emit = defineEmits<{ pick: [driverNumber: number] }>()
</script>

<template>
  <div class="mb-4 flex gap-2 overflow-auto pb-3">
    <button
      v-for="driver in drivers"
      :key="driver.driverNumber"
      type="button"
      class="flex flex-none items-center gap-2 rounded-xl border px-3.5 py-2 transition hover:-translate-y-0.5"
      :class="
        driver.driverNumber === selected
          ? 'border-race-red bg-race-red/16'
          : 'border-carbon-600 bg-carbon-800'
      "
      @click="emit('pick', driver.driverNumber)"
    >
      <span class="h-5 w-1 rounded-sm" :style="{ background: driver.teamColor }"></span>
      <span
        class="font-condensed text-base font-extrabold"
        :class="driver.driverNumber === selected ? 'text-white' : 'text-ink-300'"
      >
        {{ driver.nameAcronym }}
      </span>
    </button>
  </div>
</template>

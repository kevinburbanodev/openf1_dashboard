<script setup lang="ts">
import type { Driver } from '../../domain/driver.entity'

defineProps<{ driver: Driver }>()
const emit = defineEmits<{ pick: [driverNumber: number] }>()
</script>

<template>
  <button
    type="button"
    class="group relative overflow-hidden rounded-2xl border border-carbon-600 bg-carbon-800 text-left transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,0,0,0.4)]"
    @click="emit('pick', driver.driverNumber)"
  >
    <div class="absolute inset-x-0 top-0 h-1" :style="{ background: driver.teamColor }"></div>
    <div class="flex items-center gap-3 px-4 pt-4 pb-3">
      <div
        class="min-w-13 font-display text-4xl leading-none"
        :style="{ color: driver.teamColor }"
      >
        {{ driver.driverNumber }}
      </div>
      <div class="min-w-0 flex-1">
        <div class="font-condensed text-xl leading-none font-extrabold text-white">
          {{ driver.nameAcronym }}
        </div>
        <div class="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-ink-400">
          {{ driver.fullName || driver.broadcastName }}
        </div>
      </div>
    </div>
    <div class="px-4 pb-3.5">
      <div class="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1">
        <span class="h-2 w-2 rounded-full" :style="{ background: driver.teamColor }"></span>
        <span class="text-xs text-ink-300">{{ driver.teamName }}</span>
      </div>
    </div>
  </button>
</template>

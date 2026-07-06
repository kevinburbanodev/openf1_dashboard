<script setup lang="ts">
import { computed } from 'vue'
import type { RaceControlMessage } from '../../domain/race-control-message.entity'
import { raceControlColor } from '@/shared/lib/colors'
import { formatTimeOfDay } from '@/shared/lib/format'

const props = defineProps<{ messages: RaceControlMessage[] }>()

const rows = computed(() =>
  props.messages.map((message) => ({
    time: formatTimeOfDay(message.date),
    color: raceControlColor(message),
    text: message.message,
  })),
)
</script>

<template>
  <div class="flex max-h-130 flex-col overflow-auto">
    <div
      v-for="(row, index) in rows"
      :key="index"
      class="animate-f1-rise flex gap-2.5 border-b border-white/[0.045] py-2"
    >
      <span class="min-w-9.5 flex-none font-mono text-xs text-ink-600">{{ row.time }}</span>
      <span class="w-0.75 flex-none rounded-sm" :style="{ background: row.color }"></span>
      <span class="text-[11.5px] leading-snug text-ink-300">{{ row.text }}</span>
    </div>
  </div>
</template>

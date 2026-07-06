<script setup lang="ts">
import { computed } from 'vue'
import type { RaceSession } from '@/features/session/domain/session.entity'
import { formatShortDate } from '@/shared/lib/format'

const props = defineProps<{ session: RaceSession; round: number; isActive: boolean }>()
const emit = defineEmits<{ pick: [session: RaceSession] }>()

const isPast = computed(
  () => new Date(props.session.dateEnd || props.session.dateStart).getTime() < Date.now(),
)

const tag = computed(() =>
  props.isActive ? 'ACTIVA' : isPast.value ? 'FINALIZADA' : 'PRÓXIMA',
)
const tagClass = computed(() =>
  props.isActive
    ? 'bg-race-red/18 text-race-red-light'
    : isPast.value
      ? 'bg-white/[0.06] text-ink-400'
      : 'bg-green/12 text-green',
)
const borderClass = computed(() => (props.isActive ? 'border-race-red' : 'border-carbon-600'))
const ctaClass = computed(() => (props.isActive ? 'text-race-red-light' : 'text-amber'))

const name = computed(() =>
  (props.session.meetingName || `${props.session.location} GP`).replace(
    ' Grand Prix',
    ' GP',
  ),
)
</script>

<template>
  <button
    type="button"
    class="group relative overflow-hidden rounded-2xl border bg-carbon-800 p-4 text-left transition hover:-translate-y-0.5"
    :class="borderClass"
    @click="emit('pick', session)"
  >
    <div class="mb-2.5 flex items-start justify-between">
      <div class="font-display text-sm text-ink-600">R{{ round }}</div>
      <div class="rounded-full px-2 py-0.75 font-mono text-[10px]" :class="tagClass">
        {{ tag }}
      </div>
    </div>
    <div class="mb-1 font-condensed text-[22px] leading-tight font-extrabold text-white">
      {{ name }}
    </div>
    <div class="mb-3 text-xs text-ink-400">{{ session.circuitShortName || session.location }}</div>
    <div class="flex items-center justify-between">
      <span class="font-mono text-xs text-ink-500">{{ formatShortDate(session.dateStart) }}</span>
      <span class="font-condensed text-[13px] font-bold tracking-wide" :class="ctaClass"
        >VER →</span
      >
    </div>
  </button>
</template>

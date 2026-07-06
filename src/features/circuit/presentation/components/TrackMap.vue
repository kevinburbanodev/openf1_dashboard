<script setup lang="ts">
import { computed } from 'vue'
import type { TrackModel } from '../../domain/build-track'

const props = defineProps<{
  track: TrackModel
  progress: number
  color: string
  title: string
}>()

function toXY(point: { lx: number; ly: number }) {
  return { x: +(point.lx * 1000).toFixed(1), y: +(point.ly * 600).toFixed(1) }
}

const markerIndex = computed(() => {
  const n = props.track.points.length
  if (n <= 1) return 0
  return Math.min(n - 1, Math.round(props.progress * (n - 1)))
})

const marker = computed(() => toXY(props.track.points[markerIndex.value]!))
const start = computed(() => toXY(props.track.points[0]!))

const trailPoints = computed(() => {
  const from = Math.max(0, markerIndex.value - 16)
  return props.track.points
    .slice(from, markerIndex.value + 1)
    .map((point) => {
      const { x, y } = toXY(point)
      return `${x},${y}`
    })
    .join(' ')
})
</script>

<template>
  <div class="relative rounded-2xl border border-carbon-600 bg-[#101216] p-3.5">
    <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" class="block h-120 w-full">
      <polyline
        :points="track.polyline"
        fill="none"
        stroke="#20242c"
        stroke-width="26"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
      <polyline
        :points="track.polyline"
        fill="none"
        stroke="#2f3540"
        stroke-width="15"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
      <polyline
        :points="track.polyline"
        fill="none"
        stroke="#4a5160"
        stroke-width="1.4"
        stroke-dasharray="4 9"
        stroke-linejoin="round"
      />
      <polyline
        :points="trailPoints"
        fill="none"
        :stroke="color"
        stroke-width="6"
        stroke-linejoin="round"
        stroke-linecap="round"
        opacity="0.55"
      />
      <circle :cx="start.x" :cy="start.y" r="9" fill="none" stroke="#eaeaea" stroke-width="3" />
      <circle :cx="marker.x" :cy="marker.y" r="16" :fill="color" opacity="0.25" />
      <circle :cx="marker.x" :cy="marker.y" r="8" :fill="color" stroke="#fff" stroke-width="2" />
    </svg>
    <div class="absolute top-5 left-5 font-mono text-xs tracking-wide text-ink-600">
      ◢ {{ title }} · TRAZADO REAL
    </div>
  </div>
</template>

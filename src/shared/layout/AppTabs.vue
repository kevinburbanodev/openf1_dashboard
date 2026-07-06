<script setup lang="ts">
const TABS = [
  { to: '/timing', label: 'TIMING' },
  { to: '/telemetry', label: 'TELEMETRÍA' },
  { to: '/circuit', label: 'CIRCUITO' },
  { to: '/pits', label: 'PITS' },
  { to: '/drivers', label: 'PILOTOS' },
  { to: '/standings', label: 'STANDINGS' },
  { to: '/calendar', label: 'CALENDARIO' },
  { to: '/weather', label: 'CLIMA' },
]
</script>

<template>
  <div class="sticky top-[57px] z-15 flex gap-0.5 border-b border-carbon-600 bg-carbon-950 px-5">
    <RouterLink
      v-for="tab in TABS"
      :key="tab.to"
      :to="tab.to"
      class="border-b-2 border-transparent px-4.5 py-3 font-condensed text-sm font-bold tracking-wide text-ink-600 hover:text-ink-100"
      active-class="!border-race-red !text-white"
    >
      {{ tab.label }}
    </RouterLink>
  </div>
</template>

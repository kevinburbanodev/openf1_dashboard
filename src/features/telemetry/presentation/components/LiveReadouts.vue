<script setup lang="ts">
import { computed } from 'vue'
import type { CarDataSample } from '../../domain/car-data-sample.entity'
import { drsState } from '@/shared/lib/colors'

const props = defineProps<{ sample: CarDataSample | null }>()

const drs = computed(() => drsState(props.sample?.drs))
const drsLabel = computed(() =>
  drs.value === 'on' ? 'ON' : drs.value === 'detected' ? 'DET' : 'OFF',
)
const rpmPct = computed(() => {
  const rpm = props.sample?.rpm
  return rpm != null ? Math.min(100, (rpm / 13500) * 100) : 0
})
const throttlePct = computed(() => props.sample?.throttle ?? 0)
const brakeOn = computed(() => (props.sample?.brake ?? 0) > 0)
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="rounded-2xl border border-carbon-600 bg-carbon-800 p-4">
      <div class="flex items-end gap-1.5">
        <span class="font-display text-6xl leading-[0.8] text-white">{{
          sample?.speed ?? '—'
        }}</span>
        <span class="mb-2 font-mono text-xs text-ink-600">KM/H</span>
      </div>
      <div class="mt-3 mb-1 font-mono text-xs text-ink-600">
        RPM · {{ sample?.rpm?.toLocaleString() ?? '—' }}
      </div>
      <div class="h-2.25 overflow-hidden rounded-full bg-carbon-900">
        <div
          class="h-full bg-gradient-to-r from-blue to-race-red"
          :style="{ width: `${rpmPct}%` }"
        ></div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-xl border border-carbon-600 bg-carbon-800 py-3.5 text-center">
        <div class="font-mono text-xs text-ink-600">GEAR</div>
        <div class="font-display text-4xl text-amber">{{ sample?.gear || 'N' }}</div>
      </div>
      <div
        class="rounded-xl border py-3.5 text-center"
        :class="
          drs === 'on'
            ? 'animate-f1-drs border-green/45 bg-green/10'
            : 'border-carbon-600 bg-carbon-800'
        "
      >
        <div class="font-mono text-xs" :class="drs === 'on' ? 'text-green' : 'text-ink-600'">
          DRS
        </div>
        <div
          class="font-display text-2xl leading-[1.4]"
          :class="drs === 'on' ? 'text-green' : drs === 'detected' ? 'text-yellow' : 'text-ink-600'"
        >
          {{ drsLabel }}
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-3 rounded-xl border border-carbon-600 bg-carbon-800 px-4 py-3.5">
      <div>
        <div class="mb-1 flex justify-between font-mono text-xs text-ink-600">
          <span>THROTTLE</span>
          <span>{{ sample?.throttle ?? '—' }}%</span>
        </div>
        <div class="h-2 overflow-hidden rounded bg-carbon-900">
          <div class="h-full bg-green" :style="{ width: `${throttlePct}%` }"></div>
        </div>
      </div>
      <div>
        <div class="mb-1 flex justify-between font-mono text-xs text-ink-600">
          <span>BRAKE</span>
          <span>{{ sample?.brake != null ? (brakeOn ? 'ON' : 'OFF') : '—' }}</span>
        </div>
        <div class="h-2 overflow-hidden rounded bg-carbon-900">
          <div class="h-full bg-race-red" :style="{ width: brakeOn ? '100%' : '4%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Driver } from '@/features/drivers/domain/driver.entity'

defineProps<{
  driver?: Driver
  lapLabel: string
  tracePoints: string
  traceFill: string
  playheadLeft: string
  maxSpeed: number | null
}>()
</script>

<template>
  <div class="rounded-2xl border border-carbon-600 bg-carbon-800 px-5 py-4.5">
    <div class="mb-1 flex items-baseline gap-3">
      <span class="h-6 w-1.25 rounded-sm" :style="{ background: driver?.teamColor }"></span>
      <span class="font-condensed text-2xl font-extrabold text-white">{{
        driver?.nameAcronym ?? '—'
      }}</span>
      <span class="text-sm text-ink-400">{{ driver?.fullName }} · {{ driver?.teamName }}</span>
      <span class="ml-auto font-mono text-xs text-ink-600">VUELTA RÁPIDA {{ lapLabel }}</span>
    </div>
    <div class="mb-3.5 font-mono text-xs text-ink-600">TRAZA DE VELOCIDAD · km/h</div>
    <div class="relative w-full">
      <svg viewBox="0 0 600 200" preserveAspectRatio="none" class="block h-55 w-full">
        <defs>
          <linearGradient id="speed-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#e10600" stop-opacity="0.35" />
            <stop offset="1" stop-color="#e10600" stop-opacity="0" />
          </linearGradient>
        </defs>
        <polygon :points="traceFill" fill="url(#speed-fill)" />
        <polyline
          :points="tracePoints"
          fill="none"
          stroke="#ff3b30"
          stroke-width="2"
          stroke-linejoin="round"
        />
      </svg>
      <div
        class="absolute top-0 bottom-0 w-0.5 bg-green shadow-[0_0_10px_#39ff8b]"
        :style="{ left: playheadLeft }"
      ></div>
      <div
        class="absolute top-[-2px] h-2.5 w-2.5 -translate-x-1 rounded-full bg-green"
        :style="{ left: playheadLeft }"
      ></div>
    </div>
    <div class="mt-1.5 flex justify-between font-mono text-[9px] text-ink-700">
      <span>INICIO DE VUELTA</span>
      <span>MÁX {{ maxSpeed ?? '—' }} km/h</span>
      <span>META</span>
    </div>
  </div>
</template>

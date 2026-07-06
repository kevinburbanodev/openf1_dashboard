<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), {
  label: 'CARGANDO…',
})
</script>

<template>
  <div class="p-16 text-center font-mono text-xs text-ink-600">
    <span
      class="animate-f1-spin mr-2 inline-block h-5.5 w-5.5 rounded-full border-3 border-carbon-600 border-t-race-red align-middle"
    ></span>
    {{ label }}
  </div>
</template>

<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <div
    class="mx-auto my-5 max-w-3xl rounded-xl border border-race-red/35 bg-race-red/10 px-4.5 py-3.5 font-mono text-xs text-race-red-lighter"
  >
    ⚠ {{ message }}
  </div>
</template>

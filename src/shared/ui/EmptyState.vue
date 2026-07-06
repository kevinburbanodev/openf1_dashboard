<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <div class="px-0 py-10 font-mono text-xs text-ink-700">{{ message }}</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '@/features/session/presentation/session.store'
import type { RaceSession } from '@/features/session/domain/session.entity'
import LoadingState from '@/shared/ui/LoadingState.vue'
import CalendarCard from '../components/CalendarCard.vue'

const sessionStore = useSessionStore()

const chronological = computed(() =>
  [...sessionStore.races].sort(
    (a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime(),
  ),
)

function pick(session: RaceSession) {
  sessionStore.select(session)
}
</script>

<template>
  <div class="px-6.5 pt-5.5 pb-11">
    <LoadingState v-if="sessionStore.status === 'loading'" />
    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
      <CalendarCard
        v-for="(race, index) in chronological"
        :key="race.sessionKey"
        :session="race"
        :round="index + 1"
        :is-active="race.sessionKey === sessionStore.selected?.sessionKey"
        @pick="pick"
      />
    </div>
  </div>
</template>

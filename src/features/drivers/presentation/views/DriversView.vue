<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/features/session/presentation/session.store'
import { useDriversStore } from '../drivers.store'
import { useTelemetryStore } from '@/features/telemetry/presentation/telemetry.store'
import LoadingState from '@/shared/ui/LoadingState.vue'
import DriverCard from '../components/DriverCard.vue'

const router = useRouter()
const sessionStore = useSessionStore()
const driversStore = useDriversStore()
const telemetryStore = useTelemetryStore()

function pickDriver(driverNumber: number) {
  const sessionKey = sessionStore.selected?.sessionKey
  if (sessionKey) void telemetryStore.selectDriver(sessionKey, driverNumber)
  void router.push('/telemetry')
}
</script>

<template>
  <div class="px-6.5 pt-5.5 pb-11">
    <LoadingState v-if="driversStore.status === 'loading'" />
    <div
      v-else
      class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4"
    >
      <DriverCard
        v-for="driver in driversStore.driverList"
        :key="driver.driverNumber"
        :driver="driver"
        @pick="pickDriver"
      />
    </div>
  </div>
</template>

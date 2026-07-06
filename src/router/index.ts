import { createRouter, createWebHistory } from 'vue-router'
import TimingView from '@/features/timing/presentation/views/TimingView.vue'
import TelemetryView from '@/features/telemetry/presentation/views/TelemetryView.vue'
import CircuitView from '@/features/circuit/presentation/views/CircuitView.vue'
import PitsView from '@/features/pits/presentation/views/PitsView.vue'
import DriversView from '@/features/drivers/presentation/views/DriversView.vue'
import StandingsView from '@/features/standings/presentation/views/StandingsView.vue'
import CalendarView from '@/features/calendar/presentation/views/CalendarView.vue'
import WeatherView from '@/features/weather/presentation/views/WeatherView.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', redirect: '/timing' },
    { path: '/timing', name: 'timing', component: TimingView },
    { path: '/telemetry', name: 'telemetry', component: TelemetryView },
    { path: '/circuit', name: 'circuit', component: CircuitView },
    { path: '/pits', name: 'pits', component: PitsView },
    { path: '/drivers', name: 'drivers', component: DriversView },
    { path: '/standings', name: 'standings', component: StandingsView },
    { path: '/calendar', name: 'calendar', component: CalendarView },
    { path: '/weather', name: 'weather', component: WeatherView },
  ],
})

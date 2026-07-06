import type { WeatherReading } from './weather.entity'

export interface WeatherRepository {
  getLatest(sessionKey: number): Promise<WeatherReading | null>
}

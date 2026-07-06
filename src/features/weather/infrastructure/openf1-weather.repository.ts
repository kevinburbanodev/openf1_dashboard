import { openf1Get } from '@/shared/lib/openf1-client'
import type { WeatherRepository } from '../domain/weather.repository'
import type { WeatherReading } from '../domain/weather.entity'

interface OpenF1WeatherResponse {
  air_temperature: number | null
  track_temperature: number | null
  humidity: number | null
  rainfall: number | null
  wind_speed: number | null
  wind_direction: number | null
  pressure: number | null
}

export class OpenF1WeatherRepository implements WeatherRepository {
  async getLatest(sessionKey: number): Promise<WeatherReading | null> {
    const readings = await openf1Get<OpenF1WeatherResponse[]>('/weather', {
      session_key: sessionKey,
    })
    if (!readings || readings.length === 0) return null
    const latest = readings[readings.length - 1]!
    return {
      airTemperature: latest.air_temperature,
      trackTemperature: latest.track_temperature,
      humidity: latest.humidity,
      rainfall: latest.rainfall,
      windSpeed: latest.wind_speed,
      windDirection: latest.wind_direction,
      pressure: latest.pressure,
    }
  }
}

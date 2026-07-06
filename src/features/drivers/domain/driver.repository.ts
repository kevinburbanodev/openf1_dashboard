import type { Driver } from './driver.entity'

export interface DriverRepository {
  getBySession(sessionKey: number): Promise<Driver[]>
}

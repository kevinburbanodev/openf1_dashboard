import type { LocationSample } from './location-sample.entity'

export interface NormalizedPoint {
  lx: number
  ly: number
}

export interface TrackModel {
  points: NormalizedPoint[]
  polyline: string
}

const MIN_SAMPLES = 20
const PADDING = 0.09

export function buildTrack(samples: LocationSample[]): TrackModel | null {
  const valid = samples.filter((p) => p.x != null && p.y != null && !(p.x === 0 && p.y === 0))
  if (valid.length < MIN_SAMPLES) return null

  const xs = valid.map((p) => p.x)
  const ys = valid.map((p) => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const width = maxX - minX || 1
  const height = maxY - minY || 1

  const points = valid.map((p) => ({
    lx: PADDING + ((p.x - minX) / width) * (1 - 2 * PADDING),
    ly: PADDING + ((maxY - p.y) / height) * (1 - 2 * PADDING),
  }))
  const polyline = points
    .map((p) => `${(p.lx * 1000).toFixed(1)},${(p.ly * 600).toFixed(1)}`)
    .join(' ')

  return { points, polyline }
}

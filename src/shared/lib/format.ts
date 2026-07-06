export function formatLapTime(seconds?: number | null): string {
  if (seconds == null) return '—'
  const minutes = Math.floor(seconds / 60)
  const rest = seconds - minutes * 60
  return `${minutes}:${rest.toFixed(3).padStart(6, '0')}`
}

export function formatTimeOfDay(iso?: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  const hh = String(date.getUTCHours()).padStart(2, '0')
  const mm = String(date.getUTCMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

export function formatShortDate(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

export function formatGap(result: {
  position: number
  gapToLeader: number | string | null
}): string {
  if (result.position === 1) return 'GANADOR'
  const gap = result.gapToLeader
  if (typeof gap === 'number') return `+${gap.toFixed(3)}`
  if (typeof gap === 'string' && gap) return gap.replace('LAPS', 'V').replace('LAP', 'V')
  return '—'
}

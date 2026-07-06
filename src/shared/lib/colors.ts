const FALLBACK_TEAM_COLOR = '#8a8f9a'

export function teamColor(hex?: string | null): string {
  return hex ? `#${hex.replace('#', '')}` : FALLBACK_TEAM_COLOR
}

interface CompoundInfo {
  code: string
  color: string
}

const COMPOUNDS: Record<string, CompoundInfo> = {
  SOFT: { code: 'S', color: '#e8002d' },
  MEDIUM: { code: 'M', color: '#f5c518' },
  HARD: { code: 'H', color: '#e8e8e8' },
  INTERMEDIATE: { code: 'I', color: '#43b02a' },
  WET: { code: 'W', color: '#0067ad' },
}

export function compoundInfo(compound?: string | null): CompoundInfo {
  return (compound && COMPOUNDS[compound]) || { code: '·', color: '#6f747f' }
}

export function raceControlColor(message: {
  flag?: string | null
  category?: string | null
  message?: string | null
}): string {
  const flag = (message.flag || '').toUpperCase()
  const text = message.message || ''
  if (message.category === 'SafetyCar' || /SAFETY/.test(text)) return '#ffb000'
  if (flag === 'GREEN') return '#39ff8b'
  if (flag === 'YELLOW' || flag === 'DOUBLE YELLOW') return '#f5c518'
  if (flag === 'RED') return '#e10600'
  if (flag === 'CHEQUERED') return '#eaeaea'
  if (flag === 'BLUE') return '#3671c6'
  if (message.category === 'Drs') return '#39ff8b'
  return '#6f747f'
}

export function drsState(drs?: number | null): 'on' | 'detected' | 'off' {
  if (drs === 10 || drs === 12 || drs === 14) return 'on'
  if (drs === 8) return 'detected'
  return 'off'
}

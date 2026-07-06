import axios from 'axios'
import { env } from '@/shared/config/env'

const http = axios.create({ baseURL: env.openf1BaseUrl })

// OpenF1's free tier throttles aggressively and returns 429 once a client
// bursts requests. Every call from every feature is funneled through a
// single queue so the whole app never exceeds one request per MIN_INTERVAL_MS,
// with a short backoff-and-retry when the API still rate-limits us.
const MIN_INTERVAL_MS = 340
const RETRY_DELAY_MS = 1500
const MAX_RETRIES = 4

interface QueueItem {
  path: string
  params?: Record<string, unknown>
  attempt: number
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}

const queue: QueueItem[] = []
let draining = false
let lastRequestAt = 0

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

// OpenF1 encodes comparison filters directly in the query key (e.g. `date>=...`).
// axios's default param serializer percent-encodes `>`/`<`, which the API's
// query parser doesn't understand and answers with a 404 — so the query
// string is built by hand here, leaving operator keys untouched.
function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return ''
  const parts = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      // Comparison keys like `date>=` already carry their own `=`; adding
      // another one splits the value on the wrong character server-side.
      const separator = key.endsWith('=') ? '' : '='
      return `${key}${separator}${encodeURIComponent(String(value))}`
    })
  return parts.length > 0 ? `?${parts.join('&')}` : ''
}

async function drain() {
  if (draining) return
  draining = true
  while (queue.length > 0) {
    const item = queue[0]!
    const wait = Math.max(0, MIN_INTERVAL_MS - (Date.now() - lastRequestAt))
    if (wait > 0) await sleep(wait)
    lastRequestAt = Date.now()
    try {
      const { data } = await http.get(`${item.path}${buildQueryString(item.params)}`)
      queue.shift()
      item.resolve(data)
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined
      if (status === 429 && item.attempt < MAX_RETRIES) {
        item.attempt += 1
        await sleep(RETRY_DELAY_MS)
        continue
      }
      queue.shift()
      item.reject(error)
    }
  }
  draining = false
}

export function openf1Get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    queue.push({ path, params, attempt: 0, resolve: resolve as (value: unknown) => void, reject })
    void drain()
  })
}

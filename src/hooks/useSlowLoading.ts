import { useEffect, useState } from 'react'

/**
 * Returns true when `active` has stayed true for longer than `delayMs`.
 * Used to show a "server is waking up" hint only when a request is slow,
 * e.g. the first request after the backend has scaled to zero (cold start).
 */
export function useSlowLoading(active: boolean, delayMs = 3000): boolean {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (!active) {
      // Reset asynchronously so we never call setState during the effect body.
      const reset = window.setTimeout(() => setSlow(false), 0)
      return () => window.clearTimeout(reset)
    }
    const timer = window.setTimeout(() => setSlow(true), delayMs)
    return () => window.clearTimeout(timer)
  }, [active, delayMs])

  return slow
}

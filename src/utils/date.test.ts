import { describe, expect, it } from 'vitest'
import { addLocalDays, getReminderTiming, parseDateOnly, toInputDate } from './date'

describe('date utilities', () => {
  it('preserves date-only values without timezone shifts', () => {
    expect(toInputDate('2026-09-20T00:00:00Z')).toBe('2026-09-20')
    expect(parseDateOnly('2026-09-20')?.getDate()).toBe(20)
  })

  it('recognizes today and tomorrow', () => {
    const now = new Date(2026, 8, 20, 23, 30)
    expect(getReminderTiming('2026-09-20', now).isToday).toBe(true)
    expect(getReminderTiming(addLocalDays(1, now), now).isTomorrow).toBe(true)
  })
})

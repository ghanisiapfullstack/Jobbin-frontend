/**
 * Format date string ke format yang readable
 * Input: "2026-06-22T00:00:00Z" atau "2026-06-22"
 * Output: "22 Jun 2026"
 */
export function formatDate(date: string | null | undefined): string {
  if (!date) return ''
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return date
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
  } catch {
    return date
  }
}

/**
 * Format date ke YYYY-MM-DD untuk input type="date"
 */
export function toInputDate(date: string | null | undefined): string {
  if (!date) return ''
  try {
    return new Date(date).toISOString().split('T')[0]
  } catch {
    return ''
  }
}

export function toLocalDateInput(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addLocalDays(days: number, from = new Date()): string {
  const date = new Date(from)
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + days)
  return toLocalDateInput(date)
}

export function getReminderTiming(date: string | null | undefined, now = new Date()) {
  const reminderDate = toInputDate(date)
  const today = toLocalDateInput(now)
  const tomorrow = addLocalDays(1, now)

  return {
    isToday: reminderDate === today,
    isTomorrow: reminderDate === tomorrow,
  }
}

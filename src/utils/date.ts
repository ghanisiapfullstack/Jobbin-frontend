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

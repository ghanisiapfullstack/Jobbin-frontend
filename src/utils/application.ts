import type { EmploymentType } from '../api/applications'

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: 'Full-Time',
  part_time: 'Part-Time',
  internship: 'Internship',
  freelance: 'Freelance',
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatRupiahInput(value: string): string {
  const digits = digitsOnly(value)
  if (!digits) return ''
  return new Intl.NumberFormat('id-ID').format(Number(digits))
}

function formatCompactRupiah(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000
    return `Rp${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(millions)} jt`
  }
  return `Rp${new Intl.NumberFormat('id-ID').format(value)}`
}

type SalaryValue = number | string | null | undefined

export function formatSalaryRange(min: SalaryValue, max: SalaryValue): string {
  if (min === null || min === undefined || max === null || max === undefined) return ''

  const normalizedMin = typeof min === 'number' ? min : Number(min)
  const normalizedMax = typeof max === 'number' ? max : Number(max)
  if (!Number.isFinite(normalizedMin) || !Number.isFinite(normalizedMax) || normalizedMin < 0 || normalizedMax < normalizedMin) return ''

  return `${formatCompactRupiah(normalizedMin)} – ${formatCompactRupiah(normalizedMax)}`
}

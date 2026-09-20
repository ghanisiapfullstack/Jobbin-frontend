import { describe, expect, it } from 'vitest'
import { digitsOnly, formatRupiahInput, formatSalaryRange } from './application'

describe('application formatting', () => {
  it('keeps only salary digits', () => {
    expect(digitsOnly('Rp 4.500.000')).toBe('4500000')
  })

  it('formats salary input for Indonesia', () => {
    expect(formatRupiahInput('4500000')).toBe('4.500.000')
  })

  it('formats valid ranges and rejects inverted ranges', () => {
    expect(formatSalaryRange(4_000_000, 10_000_000)).toBe('Rp4 jt – Rp10 jt')
    expect(formatSalaryRange(10_000_000, 4_000_000)).toBe('')
  })
})

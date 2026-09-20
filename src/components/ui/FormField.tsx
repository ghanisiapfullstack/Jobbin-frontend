import type { ReactNode } from 'react'

interface Props {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

export default function FormField({ id, label, error, hint, children }: Props) {
  return (
    <div>
      <label htmlFor={id} className="label-neo">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs font-medium text-dark/60">{hint}</p>}
      {error && <p id={`${id}-error`} className="error-msg" role="alert">{error}</p>}
    </div>
  )
}

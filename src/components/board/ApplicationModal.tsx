import { useState } from 'react'
import { AlertTriangle, Archive, Trash2 } from 'lucide-react'
import type { Application, ApplicationPayload, ApplicationStatus, EmploymentType } from '../../api/applications'
import { digitsOnly, EMPLOYMENT_TYPE_LABELS, formatRupiahInput } from '../../utils/application'
import { toInputDate } from '../../utils/date'
import { getApiErrorData } from '../../utils/apiError'
import NeoDialog from '../ui/NeoDialog'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: ApplicationPayload) => Promise<void>
  onArchive?: (id: number) => Promise<void>
  onDelete?: (id: number) => Promise<void>
  initialData?: Application | null
  defaultStatus?: ApplicationStatus
}

interface ApplicationFormState {
  job_title: string
  company: string
  url: string
  status: ApplicationStatus
  employment_type: EmploymentType | ''
  salary_min: string
  salary_max: string
  applied_date: string
  reminder_date: string
  notes: string
}

type FormErrorKey = keyof ApplicationFormState | 'general'

const STATUS_OPTIONS: ApplicationStatus[] = ['wishlist', 'applied', 'interview', 'offer', 'rejected']
const EMPLOYMENT_OPTIONS = Object.entries(EMPLOYMENT_TYPE_LABELS) as [EmploymentType, string][]

function getInitialForm(initialData?: Application | null, defaultStatus?: ApplicationStatus): ApplicationFormState {
  return {
    job_title: initialData?.job_title ?? '',
    company: initialData?.company ?? '',
    url: initialData?.url ?? '',
    status: initialData?.status ?? defaultStatus ?? 'wishlist',
    employment_type: initialData?.employment_type ?? '',
    salary_min: initialData?.salary_min?.toString() ?? '',
    salary_max: initialData?.salary_max?.toString() ?? '',
    notes: initialData?.notes ?? '',
    applied_date: toInputDate(initialData?.applied_date),
    reminder_date: toInputDate(initialData?.reminder_date),
  }
}

function ApplicationForm({ onClose, onSubmit, onArchive, onDelete, initialData, defaultStatus }: Omit<Props, 'open'>) {
  const [form, setForm] = useState<ApplicationFormState>(() => getInitialForm(initialData, defaultStatus))
  const [errors, setErrors] = useState<Partial<Record<FormErrorKey, string>>>({})
  const [loading, setLoading] = useState(false)
  const [actionBusy, setActionBusy] = useState<'archive' | 'delete' | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const name = event.target.name as keyof ApplicationFormState
    setForm((previous) => ({ ...previous, [name]: event.target.value }))
    setErrors((previous) => ({ ...previous, [name]: undefined, general: undefined }))
  }

  const handleSalaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as 'salary_min' | 'salary_max'
    setForm((previous) => ({ ...previous, [name]: digitsOnly(event.target.value) }))
    setErrors((previous) => ({ ...previous, [name]: undefined, general: undefined }))
  }

  const validate = () => {
    const nextErrors: typeof errors = {}
    if (!form.job_title.trim()) nextErrors.job_title = 'Enter a job title.'
    if (!form.company.trim()) nextErrors.company = 'Enter a company name.'

    const hasMin = form.salary_min !== ''
    const hasMax = form.salary_max !== ''
    if (hasMin !== hasMax) {
      nextErrors.salary_min = 'Enter both ends of the salary range.'
      nextErrors.salary_max = 'Enter both ends of the salary range.'
    } else if (hasMin && Number(form.salary_max) < Number(form.salary_min)) {
      nextErrors.salary_max = 'Maximum salary must be at least the minimum.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await onSubmit({
        job_title: form.job_title.trim(),
        company: form.company.trim(),
        status: form.status,
        employment_type: form.employment_type,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        url: form.url.trim(),
        notes: form.notes.trim(),
        applied_date: form.applied_date,
        reminder_date: form.reminder_date,
      })
      onClose()
    } catch (error: unknown) {
      const data = getApiErrorData(error)
      setErrors(data.errors ?? { general: data.message || 'We could not save this application. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleArchive = async () => {
    if (!initialData || !onArchive) return
    setActionBusy('archive')
    setErrors({})
    try {
      await onArchive(initialData.id)
      onClose()
    } catch (error: unknown) {
      setErrors({ general: getApiErrorData(error).message || 'We could not archive this application.' })
    } finally {
      setActionBusy(null)
    }
  }

  const handleDelete = async () => {
    if (!initialData || !onDelete) return
    setActionBusy('delete')
    setErrors({})
    try {
      await onDelete(initialData.id)
      onClose()
    } catch (error: unknown) {
      setErrors({ general: getApiErrorData(error).message || 'We could not delete this application.' })
      setConfirmingDelete(false)
    } finally {
      setActionBusy(null)
    }
  }

  const busy = loading || actionBusy !== null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="application-job-title" className="label-neo">Job title *</label>
          <input id="application-job-title" name="job_title" value={form.job_title} onChange={handleChange} placeholder="Frontend Developer" autoFocus aria-invalid={!!errors.job_title} aria-describedby={errors.job_title ? 'application-job-title-error' : undefined} className={`input-neo ${errors.job_title ? 'border-red-500' : ''}`} />
          {errors.job_title && <p id="application-job-title-error" className="error-msg">{errors.job_title}</p>}
        </div>
        <div>
          <label htmlFor="application-company" className="label-neo">Company *</label>
          <input id="application-company" name="company" value={form.company} onChange={handleChange} placeholder="Tokopedia" aria-invalid={!!errors.company} aria-describedby={errors.company ? 'application-company-error' : undefined} className={`input-neo ${errors.company ? 'border-red-500' : ''}`} />
          {errors.company && <p id="application-company-error" className="error-msg">{errors.company}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="application-status" className="label-neo">Status</label>
          <select id="application-status" name="status" value={form.status} onChange={handleChange} className="input-neo">
            {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="application-employment-type" className="label-neo">Employment type</label>
          <select id="application-employment-type" name="employment_type" value={form.employment_type} onChange={handleChange} className="input-neo">
            <option value="">Not specified</option>
            {EMPLOYMENT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="application-url" className="label-neo">Job URL</label>
        <input id="application-url" name="url" type="url" value={form.url} onChange={handleChange} placeholder="https://..." className="input-neo" />
      </div>

      <fieldset>
        <legend className="label-neo">Monthly salary range (IDR)</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="application-salary-min" className="sr-only">Minimum salary</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black">Rp</span>
              <input id="application-salary-min" name="salary_min" inputMode="numeric" value={formatRupiahInput(form.salary_min)} onChange={handleSalaryChange} placeholder="4.000.000" aria-invalid={!!errors.salary_min} aria-describedby={errors.salary_min ? 'application-salary-error' : undefined} className={`input-neo pl-11 ${errors.salary_min ? 'border-red-500' : ''}`} />
            </div>
          </div>
          <div>
            <label htmlFor="application-salary-max" className="sr-only">Maximum salary</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black">Rp</span>
              <input id="application-salary-max" name="salary_max" inputMode="numeric" value={formatRupiahInput(form.salary_max)} onChange={handleSalaryChange} placeholder="10.000.000" aria-invalid={!!errors.salary_max} aria-describedby={errors.salary_max ? 'application-salary-error' : undefined} className={`input-neo pl-11 ${errors.salary_max ? 'border-red-500' : ''}`} />
            </div>
          </div>
        </div>
        {(errors.salary_min || errors.salary_max) && <p id="application-salary-error" className="error-msg">{errors.salary_max || errors.salary_min}</p>}
      </fieldset>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="application-applied-date" className="label-neo">Applied date</label>
          <input id="application-applied-date" name="applied_date" type="date" value={form.applied_date} onChange={handleChange} className="input-neo" />
        </div>
        <div>
          <label htmlFor="application-reminder-date" className="label-neo">Reminder date</label>
          <input id="application-reminder-date" name="reminder_date" type="date" value={form.reminder_date} onChange={handleChange} className="input-neo" />
          <p className="mt-1.5 text-xs text-dark/55">Shown in your calendar. Email arrives one day before and on the date.</p>
        </div>
      </div>

      <div>
        <label htmlFor="application-notes" className="label-neo">Notes</label>
        <textarea id="application-notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Referral, interview preparation, follow-up details..." rows={4} className="input-neo resize-y" />
      </div>

      {errors.general && <p className="error-msg border-2 border-red-600 bg-red-50 p-3" role="alert">{errors.general}</p>}

      {confirmingDelete && initialData && (
        <div className="border-2 border-dark bg-rejected p-3" role="alert">
          <div className="flex items-start gap-2">
            <AlertTriangle size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-black">Delete this application permanently?</p>
              <p className="mt-1 text-xs font-semibold">{initialData.job_title} at {initialData.company} cannot be recovered.</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setConfirmingDelete(false)} disabled={busy} className="btn-outline min-h-10 flex-1 px-3 py-2 text-xs">Keep it</button>
            <button type="button" onClick={() => void handleDelete()} disabled={busy} className="btn-danger min-h-10 flex-1 px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-60">{actionBusy === 'delete' ? 'Deleting...' : 'Yes, delete'}</button>
          </div>
        </div>
      )}

      <div className="mt-2 flex flex-col gap-3 border-t-2 border-dark/10 pt-4 lg:flex-row lg:items-center lg:justify-between">
        {initialData && !confirmingDelete ? (
          <div className="flex gap-2">
            <button type="button" onClick={() => void handleArchive()} disabled={busy} className="btn-outline flex-1 px-3 lg:flex-none"><Archive size={16} aria-hidden="true" /> {actionBusy === 'archive' ? 'Archiving...' : 'Archive'}</button>
            <button type="button" onClick={() => setConfirmingDelete(true)} disabled={busy} className="btn-danger flex-1 px-3 lg:flex-none"><Trash2 size={16} aria-hidden="true" /> Delete</button>
          </div>
        ) : <span />}
        <div className="flex gap-3">
          <button type="button" onClick={onClose} disabled={busy} className="btn-outline flex-1 disabled:cursor-not-allowed disabled:opacity-60">Cancel</button>
          <button type="submit" disabled={busy || confirmingDelete} className="btn-dark flex-1 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Saving...' : initialData ? 'Save changes' : 'Add application'}</button>
        </div>
      </div>
    </form>
  )
}

export default function ApplicationModal({ open, onClose, onSubmit, onArchive, onDelete, initialData, defaultStatus }: Props) {
  return (
    <NeoDialog open={open} onClose={onClose} title={initialData ? 'Edit application' : 'Add application'} description={initialData ? 'Keep the details and next step up to date.' : 'Add the essentials now. You can refine the details later.'} className="!max-w-2xl">
      <ApplicationForm key={`${initialData?.id ?? 'new'}-${defaultStatus ?? 'wishlist'}`} onClose={onClose} onSubmit={onSubmit} onArchive={onArchive} onDelete={onDelete} initialData={initialData} defaultStatus={defaultStatus} />
    </NeoDialog>
  )
}

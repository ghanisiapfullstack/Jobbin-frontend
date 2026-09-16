import { useState } from 'react'
import type { Application, ApplicationPayload, ApplicationStatus } from '../../api/applications'
import { toInputDate } from '../../utils/date'
import { getApiErrorData } from '../../utils/apiError'
import NeoDialog from '../ui/NeoDialog'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: ApplicationPayload) => Promise<void>
  initialData?: Application | null
  defaultStatus?: ApplicationStatus
}

const STATUS_OPTIONS: ApplicationStatus[] = ['wishlist', 'applied', 'interview', 'offer', 'rejected']

function getInitialForm(initialData?: Application | null, defaultStatus?: ApplicationStatus): ApplicationPayload {
  if (!initialData) {
    return {
      job_title: '',
      company: '',
      url: '',
      status: defaultStatus || 'wishlist',
      notes: '',
      applied_date: '',
      reminder_date: '',
    }
  }

  return {
    job_title: initialData.job_title,
    company: initialData.company,
    url: initialData.url || '',
    status: initialData.status,
    notes: initialData.notes || '',
    applied_date: toInputDate(initialData.applied_date),
    reminder_date: toInputDate(initialData.reminder_date),
  }
}

function ApplicationForm({ onClose, onSubmit, initialData, defaultStatus }: Omit<Props, 'open'>) {
  const [form, setForm] = useState<ApplicationPayload>(() => getInitialForm(initialData, defaultStatus))
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationPayload | 'general', string>>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const name = event.target.name as keyof ApplicationPayload
    setForm((previous) => ({ ...previous, [name]: event.target.value }))
    setErrors((previous) => ({ ...previous, [name]: undefined, general: undefined }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!form.job_title.trim()) nextErrors.job_title = 'Enter a job title.'
    if (!form.company.trim()) nextErrors.company = 'Enter a company name.'
    if (nextErrors.job_title || nextErrors.company) {
      setErrors(nextErrors)
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        job_title: form.job_title.trim(),
        company: form.company.trim(),
        status: form.status,
        url: form.url?.trim() || '',
        notes: form.notes?.trim() || '',
        applied_date: form.applied_date || '',
        reminder_date: form.reminder_date || '',
      })
      onClose()
    } catch (error: unknown) {
      const data = getApiErrorData(error)
      setErrors(data.errors ?? { general: data.message || 'We could not save this application. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="application-job-title" className="label-neo">Job title *</label>
        <input
          id="application-job-title"
          name="job_title"
          value={form.job_title}
          onChange={handleChange}
          placeholder="Frontend Developer"
          autoFocus
          aria-invalid={!!errors.job_title}
          aria-describedby={errors.job_title ? 'application-job-title-error' : undefined}
          className={`input-neo ${errors.job_title ? 'border-red-500' : ''}`}
        />
        {errors.job_title && <p id="application-job-title-error" className="error-msg">{errors.job_title}</p>}
      </div>

      <div>
        <label htmlFor="application-company" className="label-neo">Company *</label>
        <input
          id="application-company"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Tokopedia"
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? 'application-company-error' : undefined}
          className={`input-neo ${errors.company ? 'border-red-500' : ''}`}
        />
        {errors.company && <p id="application-company-error" className="error-msg">{errors.company}</p>}
      </div>

      <div>
        <label htmlFor="application-status" className="label-neo">Status</label>
        <select id="application-status" name="status" value={form.status} onChange={handleChange} className="input-neo">
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="application-url" className="label-neo">Job URL</label>
        <input
          id="application-url"
          name="url"
          type="url"
          value={form.url}
          onChange={handleChange}
          placeholder="https://..."
          className="input-neo"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="application-applied-date" className="label-neo">Applied date</label>
          <input id="application-applied-date" name="applied_date" type="date" value={form.applied_date} onChange={handleChange} className="input-neo" />
        </div>
        <div>
          <label htmlFor="application-reminder-date" className="label-neo">Reminder date</label>
          <input id="application-reminder-date" name="reminder_date" type="date" value={form.reminder_date} onChange={handleChange} className="input-neo" />
          <p className="text-xs text-dark/55 mt-1.5">Email arrives one day before and on the date.</p>
        </div>
      </div>

      <div>
        <label htmlFor="application-notes" className="label-neo">Notes</label>
        <textarea
          id="application-notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Referral, salary range, preparation notes..."
          rows={3}
          className="input-neo resize-y"
        />
      </div>

      {errors.general && <p className="error-msg" role="alert">{errors.general}</p>}

      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2">
        <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
        <button type="submit" disabled={loading} className="btn-dark flex-1 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Saving...' : initialData ? 'Save changes' : 'Add application'}
        </button>
      </div>
    </form>
  )
}

export default function ApplicationModal({ open, onClose, onSubmit, initialData, defaultStatus }: Props) {
  return (
    <NeoDialog
      open={open}
      onClose={onClose}
      title={initialData ? 'Edit application' : 'Add application'}
      description={initialData ? 'Keep the details and next step up to date.' : 'Add the essentials now. You can refine the details later.'}
    >
      <ApplicationForm
        key={`${initialData?.id ?? 'new'}-${defaultStatus ?? 'wishlist'}`}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={initialData}
        defaultStatus={defaultStatus}
      />
    </NeoDialog>
  )
}

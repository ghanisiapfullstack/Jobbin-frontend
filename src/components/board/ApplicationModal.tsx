import { useEffect, useState } from 'react'
import type { Application, ApplicationPayload, ApplicationStatus } from '../../api/applications'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: ApplicationPayload) => Promise<void>
  initialData?: Application | null
  defaultStatus?: ApplicationStatus
}

const STATUS_OPTIONS: ApplicationStatus[] = ['wishlist', 'applied', 'interview', 'offer', 'rejected']

export default function ApplicationModal({ open, onClose, onSubmit, initialData, defaultStatus }: Props) {
  const [form, setForm] = useState<ApplicationPayload>({
    job_title: '',
    company: '',
    url: '',
    status: defaultStatus || 'wishlist',
    notes: '',
    applied_date: '',
    reminder_date: '',
  })
  const [errors, setErrors] = useState<Partial<ApplicationPayload>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm({
        job_title: initialData.job_title,
        company: initialData.company,
        url: initialData.url || '',
        status: initialData.status,
        notes: initialData.notes || '',
        applied_date: initialData.applied_date || '',
        reminder_date: initialData.reminder_date || '',
      })
    } else {
      setForm({
        job_title: '',
        company: '',
        url: '',
        status: defaultStatus || 'wishlist',
        notes: '',
        applied_date: '',
        reminder_date: '',
      })
    }
    setErrors({})
  }, [initialData, defaultStatus, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    const newErrors: Partial<ApplicationPayload> = {}
    if (!form.job_title.trim()) newErrors.job_title = 'Job title wajib diisi'
    if (!form.company.trim()) newErrors.company = 'Company wajib diisi'
    if (newErrors.job_title || newErrors.company) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      // Strip empty strings jadi undefined
      const payload: ApplicationPayload = {
        job_title: form.job_title.trim(),
        company: form.company.trim(),
        status: form.status,
        ...(form.url?.trim() && { url: form.url.trim() }),
        ...(form.notes?.trim() && { notes: form.notes.trim() }),
        ...(form.applied_date && { applied_date: form.applied_date }),
        ...(form.reminder_date && { reminder_date: form.reminder_date }),
      }
      await onSubmit(payload)
      onClose()
    } catch (err: any) {
      const data = err.response?.data
      if (data?.errors) setErrors(data.errors)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="card-neo w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black">
            {initialData ? 'Edit application' : 'Add application'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 border-2 border-dark flex items-center justify-center font-black hover:bg-rejected transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Job title */}
          <div>
            <label className="label-neo">Job title *</label>
            <input
              name="job_title"
              value={form.job_title}
              onChange={handleChange}
              placeholder="Frontend Developer"
              className={`input-neo ${errors.job_title ? 'border-red-500' : ''}`}
            />
            {errors.job_title && <p className="error-msg">{errors.job_title}</p>}
          </div>

          {/* Company */}
          <div>
            <label className="label-neo">Company *</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Tokopedia"
              className={`input-neo ${errors.company ? 'border-red-500' : ''}`}
            />
            {errors.company && <p className="error-msg">{errors.company}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="label-neo">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input-neo"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* URL */}
          <div>
            <label className="label-neo">Job URL</label>
            <input
              name="url"
              type="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://..."
              className="input-neo"
            />
          </div>

          {/* Applied date + Reminder date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-neo">Applied date</label>
              <input
                name="applied_date"
                type="date"
                value={form.applied_date}
                onChange={handleChange}
                className="input-neo"
              />
            </div>
            <div>
              <label className="label-neo">Reminder date 🔔</label>
              <input
                name="reminder_date"
                type="date"
                value={form.reminder_date}
                onChange={handleChange}
                className="input-neo"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label-neo">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Referral dari teman, salary range, dll..."
              rows={3}
              className="input-neo resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-dark flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : initialData ? 'Save changes' : 'Add application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

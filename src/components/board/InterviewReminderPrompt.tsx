import { useState } from 'react'
import { BellRing, CalendarDays } from 'lucide-react'
import type { Application } from '../../api/applications'
import { addLocalDays, toLocalDateInput } from '../../utils/date'
import NeoDialog from '../ui/NeoDialog'

interface InterviewReminderPromptProps {
  application: Application | null
  saving: boolean
  error: string | null
  onClose: () => void
  onSave: (date: string) => Promise<void>
}

const QUICK_DATES = [
  { label: 'Tomorrow', days: 1 },
  { label: 'In 3 days', days: 3 },
  { label: 'In 1 week', days: 7 },
]

export default function InterviewReminderPrompt({
  application,
  saving,
  error,
  onClose,
  onSave,
}: InterviewReminderPromptProps) {
  const [selectedDate, setSelectedDate] = useState(() => addLocalDays(1))

  return (
    <NeoDialog
      open={!!application}
      onClose={onClose}
      title="Set an interview reminder?"
      description={application ? `${application.job_title} at ${application.company} is now in Interview. Pick a date so the next step does not slip.` : undefined}
    >
      <div className="flex items-center gap-3 bg-interview border-2 border-dark p-3 mb-4">
        <BellRing size={22} strokeWidth={2.5} aria-hidden="true" />
        <p className="text-sm font-bold">We will email you one day before and again on the selected date.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {QUICK_DATES.map((option) => {
          const date = addLocalDays(option.days)
          const active = selectedDate === date
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`min-h-11 border-2 border-dark px-2 py-2 text-xs font-black transition-colors ${active ? 'bg-dark text-primary' : 'bg-white hover:bg-primary'}`}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <div>
        <label htmlFor="interview-reminder-date" className="label-neo">Reminder date</label>
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={18} aria-hidden="true" />
          <input
            id="interview-reminder-date"
            type="date"
            min={toLocalDateInput(new Date())}
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="input-neo pl-10"
          />
        </div>
      </div>

      {error && <p className="error-msg mt-3" role="alert">{error}</p>}

      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-5">
        <button type="button" onClick={onClose} className="btn-outline flex-1">Not now</button>
        <button
          type="button"
          onClick={() => onSave(selectedDate)}
          disabled={saving || !selectedDate}
          className="btn-dark flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Set reminder'}
        </button>
      </div>
    </NeoDialog>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Bell, CalendarClock, CheckCircle2, RefreshCw, X } from 'lucide-react'
import { useRemindersStore } from '../store/remindersStore'

export default function ReminderBell() {
  const { today, tomorrow, loading, error, fetchReminders } = useRemindersStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    void fetchReminders()
  }, [fetchReminders])

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open])

  const total = today.length + tomorrow.length

  return (
    <div className="relative" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="icon-button relative shadow-neo-sm hover:bg-primary"
        aria-label={`Reminders — ${total} upcoming`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="reminder-popover"
      >
        <Bell size={19} strokeWidth={2.5} aria-hidden="true" />
        {total > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center border-2 border-dark bg-rejected px-0.5 text-[9px] font-black">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>

      {open && (
        <div id="reminder-popover" className="absolute right-0 top-12 z-50 w-[min(18rem,calc(100vw-2rem))] border-2 border-dark bg-white shadow-neo-lg" role="region" aria-label="Upcoming reminders">
          <div className="flex items-center gap-2 border-b-2 border-dark bg-primary px-3 py-2.5">
            <CalendarClock size={17} aria-hidden="true" />
            <p className="flex-1 text-sm font-black">Upcoming reminders</p>
            <button type="button" onClick={() => { setOpen(false); triggerRef.current?.focus() }} className="inline-flex h-8 w-8 items-center justify-center border-2 border-transparent hover:border-dark" aria-label="Close reminders">
              <X size={16} strokeWidth={3} aria-hidden="true" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-7 text-xs font-bold" aria-live="polite"><RefreshCw size={17} className="animate-spin" aria-hidden="true" /> Loading reminders…</div>
          ) : error ? (
            <div className="px-4 py-6 text-center" role="alert">
              <p className="text-xs font-bold text-red-700">{error}</p>
              <button type="button" onClick={() => void fetchReminders()} className="btn-outline mt-3 px-3 py-1.5 text-xs"><RefreshCw size={14} aria-hidden="true" /> Retry</button>
            </div>
          ) : total === 0 ? (
            <div className="px-4 py-7 text-center">
              <CheckCircle2 size={28} className="mx-auto mb-2 text-dark/55" aria-hidden="true" />
              <p className="text-xs font-bold text-gray-neo">Nothing due today or tomorrow.</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {today.length > 0 && (
                <section aria-labelledby="reminders-today">
                  <h2 id="reminders-today" className="border-b border-dark/10 bg-rejected/30 px-3 py-1.5 text-xs font-black uppercase tracking-wide">Today</h2>
                  {today.map((reminder) => (
                    <div key={reminder.id} className="border-b border-dark/10 px-3 py-2.5 hover:bg-rejected/10">
                      <p className="truncate text-sm font-bold">{reminder.job_title}</p>
                      <p className="truncate text-xs text-gray-neo">{reminder.company}</p>
                    </div>
                  ))}
                </section>
              )}

              {tomorrow.length > 0 && (
                <section aria-labelledby="reminders-tomorrow">
                  <h2 id="reminders-tomorrow" className="border-b border-dark/10 bg-interview/30 px-3 py-1.5 text-xs font-black uppercase tracking-wide">Tomorrow</h2>
                  {tomorrow.map((reminder) => (
                    <div key={reminder.id} className="border-b border-dark/10 px-3 py-2.5 hover:bg-interview/10">
                      <p className="truncate text-sm font-bold">{reminder.job_title}</p>
                      <p className="truncate text-xs text-gray-neo">{reminder.company}</p>
                    </div>
                  ))}
                </section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

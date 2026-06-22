import { useEffect, useRef, useState } from 'react'
import { useRemindersStore } from '../store/remindersStore'

export default function ReminderBell() {
  const { today, tomorrow, fetchReminders } = useRemindersStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchReminders()
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const total = today.length + tomorrow.length

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 border-2 border-dark bg-white hover:bg-primary flex items-center justify-center shadow-neo-sm transition-colors"
        aria-label={`Reminders — ${total} pending`}
      >
        <span className="text-base">🔔</span>
        {total > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rejected border-2 border-dark text-dark text-[9px] font-black flex items-center justify-center">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-72 bg-white border-2 border-dark shadow-neo-lg z-50">
          {/* Header */}
          <div className="bg-primary border-b-2 border-dark px-3 py-2">
            <p className="font-black text-sm">Reminders</p>
          </div>

          {total === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-2xl mb-1">🎉</p>
              <p className="text-xs font-bold text-gray-neo">No reminders today or tomorrow</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {/* Today */}
              {today.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 bg-rejected/30 border-b border-dark/10">
                    <p className="text-xs font-black text-dark uppercase tracking-wide">Today ⚡</p>
                  </div>
                  {today.map((r) => (
                    <div key={r.id} className="px-3 py-2.5 border-b border-dark/10 hover:bg-rejected/10">
                      <p className="text-sm font-bold truncate">{r.job_title}</p>
                      <p className="text-xs text-gray-neo truncate">{r.company}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tomorrow */}
              {tomorrow.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 bg-interview/30 border-b border-dark/10">
                    <p className="text-xs font-black text-dark uppercase tracking-wide">Tomorrow 🕐</p>
                  </div>
                  {tomorrow.map((r) => (
                    <div key={r.id} className="px-3 py-2.5 border-b border-dark/10 hover:bg-interview/10">
                      <p className="text-sm font-bold truncate">{r.job_title}</p>
                      <p className="text-xs text-gray-neo truncate">{r.company}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

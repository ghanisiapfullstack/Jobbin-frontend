import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Rows3 } from 'lucide-react'
import type { Application, ApplicationStatus } from '../../api/applications'
import { parseDateOnly, toInputDate, toLocalDateInput } from '../../utils/date'

interface Props {
  applications: Application[]
  onSelect: (application: Application) => void
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = Array.from({ length: 12 }, (_, index) => new Date(2020, index, 1).toLocaleDateString('en-US', { month: 'short' }))

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  wishlist: 'bg-wishlist',
  applied: 'bg-applied',
  interview: 'bg-interview',
  offer: 'bg-offer',
  rejected: 'bg-rejected',
}

function startOfCalendar(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1, 12)
  firstDay.setDate(firstDay.getDate() - firstDay.getDay())
  return firstDay
}

function applicationDate(application: Application) {
  return toInputDate(application.reminder_date)
}

function CalendarEvent({ application, onSelect }: { application: Application; onSelect: Props['onSelect'] }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(application)}
      className={`block w-full truncate border border-dark px-1.5 py-1 text-left text-[11px] font-black leading-tight transition-transform hover:-translate-y-0.5 ${STATUS_STYLES[application.status]}`}
      title={`${application.job_title} at ${application.company}`}
    >
      {application.job_title}
      <span className="ml-1 font-semibold opacity-60">· {application.company}</span>
    </button>
  )
}

export default function ApplicationCalendar({ applications, onSelect }: Props) {
  const today = useMemo(() => new Date(), [])
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1, 12))
  const [expandedDate, setExpandedDate] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState(() => today.getFullYear())
  const [calendarExpanded, setCalendarExpanded] = useState(() => localStorage.getItem('jobbin_calendar_expanded') === 'true')
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pickerOpen) return undefined

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !pickerRef.current?.contains(event.target)) setPickerOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPickerOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [pickerOpen])

  const reminders = useMemo(
    () => applications
      .filter((application) => parseDateOnly(application.reminder_date))
      .sort((a, b) => applicationDate(a).localeCompare(applicationDate(b))),
    [applications],
  )

  const remindersByDate = useMemo(() => reminders.reduce<Record<string, Application[]>>((groups, application) => {
    const key = applicationDate(application)
    groups[key] = [...(groups[key] ?? []), application]
    return groups
  }, {}), [reminders])

  const monthReminders = reminders.filter((application) => {
    const date = parseDateOnly(application.reminder_date)
    return date?.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth()
  })

  const calendarDays = useMemo(() => {
    const start = startOfCalendar(month)
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start)
      date.setDate(start.getDate() + index)
      return date
    })
  }, [month])

  const compactDays = useMemo(() => {
    const isCurrentMonth = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth()
    const start = isCurrentMonth ? new Date(today) : new Date(month)
    start.setHours(12, 0, 0, 0)
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start)
      date.setDate(start.getDate() + index)
      return date
    })
  }, [month, today])

  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const todayKey = toLocalDateInput(today)
  const expandedEvents = expandedDate ? remindersByDate[expandedDate] ?? [] : []

  const changeMonth = (offset: number) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1, 12))
    setExpandedDate(null)
  }

  const resetToday = () => {
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1, 12))
    setPickerYear(today.getFullYear())
    setExpandedDate(null)
    setPickerOpen(false)
  }

  const togglePicker = () => {
    setPickerYear(month.getFullYear())
    setPickerOpen((current) => !current)
  }

  const selectMonth = (monthIndex: number) => {
    setMonth(new Date(pickerYear, monthIndex, 1, 12))
    setExpandedDate(null)
    setPickerOpen(false)
  }

  const toggleCalendar = () => {
    setCalendarExpanded((current) => {
      localStorage.setItem('jobbin_calendar_expanded', String(!current))
      return !current
    })
  }

  return (
    <section className="mb-8 border-2 border-dark bg-white shadow-neo" aria-labelledby="application-calendar-title">
      <div className="flex flex-col gap-3 border-b-2 border-dark bg-primary px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div ref={pickerRef} className="relative flex items-center gap-2">
          <h2 id="application-calendar-title" className="text-lg font-black">
            <button
              type="button"
              onClick={togglePicker}
              className="flex min-h-11 items-center gap-2 border-2 border-transparent px-1.5 text-left hover:border-dark hover:bg-white/45"
              aria-haspopup="true"
              aria-expanded={pickerOpen}
              aria-controls="calendar-month-picker"
            >
              <CalendarDays size={21} strokeWidth={2.7} aria-hidden="true" />
              <span>{monthLabel}</span>
              <ChevronDown size={17} strokeWidth={3} className={`transition-transform ${pickerOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
          </h2>
          <span className="border border-dark bg-white px-2 py-0.5 text-xs font-black">{monthReminders.length}</span>

          {pickerOpen && (
            <div
              id="calendar-month-picker"
              role="group"
              aria-label="Choose calendar month and year"
              className="absolute left-0 top-full z-40 mt-2 w-[calc(100vw-2rem)] max-w-sm border-2 border-dark bg-white p-3 shadow-neo"
            >
              <div className="mb-3 flex items-center justify-between border-b-2 border-dark pb-3">
                <button type="button" onClick={() => setPickerYear((year) => year - 1)} className="icon-button h-10 w-10 shadow-none hover:bg-primary" aria-label="Previous year">
                  <ChevronLeft size={18} strokeWidth={3} aria-hidden="true" />
                </button>
                <strong className="text-lg font-black tabular-nums">{pickerYear}</strong>
                <button type="button" onClick={() => setPickerYear((year) => year + 1)} className="icon-button h-10 w-10 shadow-none hover:bg-primary" aria-label="Next year">
                  <ChevronRight size={18} strokeWidth={3} aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((label, monthIndex) => {
                  const isSelected = pickerYear === month.getFullYear() && monthIndex === month.getMonth()
                  const isCurrent = pickerYear === today.getFullYear() && monthIndex === today.getMonth()
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => selectMonth(monthIndex)}
                      className={`min-h-11 border-2 px-2 text-xs font-black transition-transform active:translate-x-0.5 active:translate-y-0.5 ${isSelected ? 'border-dark bg-dark text-white' : isCurrent ? 'border-dark bg-primary' : 'border-dark/20 bg-bg-neo hover:border-dark hover:bg-primary/45'}`}
                      aria-pressed={isSelected}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2" aria-label="Calendar navigation">
          <button type="button" onClick={toggleCalendar} className="hidden min-h-9 items-center gap-1.5 border-2 border-dark bg-white px-3 text-xs font-black hover:bg-bg-neo md:inline-flex" aria-expanded={calendarExpanded} aria-controls="desktop-calendar-grid">
            <Rows3 size={15} strokeWidth={3} aria-hidden="true" /> {calendarExpanded ? 'Compact' : 'Full month'}
          </button>
          <button type="button" onClick={() => changeMonth(-1)} className="icon-button h-9 w-9 shadow-none hover:bg-white/60" aria-label="Previous month">
            <ChevronLeft size={19} strokeWidth={3} aria-hidden="true" />
          </button>
          <button type="button" onClick={resetToday} className="min-h-9 border-2 border-dark bg-white px-3 text-xs font-black hover:bg-bg-neo">Today</button>
          <button type="button" onClick={() => changeMonth(1)} className="icon-button h-9 w-9 shadow-none hover:bg-white/60" aria-label="Next month">
            <ChevronRight size={19} strokeWidth={3} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div id="desktop-calendar-grid" className="hidden md:block">
        {!calendarExpanded && (
          <div className="grid grid-cols-7">
            {compactDays.map((date) => {
              const key = toLocalDateInput(date)
              const events = remindersByDate[key] ?? []
              const isToday = key === todayKey
              return (
                <div key={key} className="min-h-28 border-r border-dark/20 p-2 last:border-r-0">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase text-dark/50">{WEEKDAYS[date.getDay()]}</span>
                    <span className={`inline-flex h-7 min-w-7 items-center justify-center text-xs font-black ${isToday ? 'border-2 border-dark bg-primary' : ''}`}>{date.getDate()}</span>
                  </div>
                  <div className="space-y-1">
                    {events.slice(0, 2).map((application) => <CalendarEvent key={application.id} application={application} onSelect={onSelect} />)}
                    {events.length > 2 && <span className="block text-[10px] font-black text-dark/55">+{events.length - 2} more</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {calendarExpanded && <>
        <div className="grid grid-cols-7 border-b-2 border-dark bg-bg-neo">
          {WEEKDAYS.map((weekday) => <div key={weekday} className="px-2 py-2 text-center text-xs font-black uppercase tracking-wide">{weekday}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((date) => {
            const key = toLocalDateInput(date)
            const events = remindersByDate[key] ?? []
            const isCurrentMonth = date.getMonth() === month.getMonth()
            const isToday = key === todayKey
            return (
              <div
                key={key}
                className={`min-h-24 border-b border-r border-dark/20 p-1.5 ${isCurrentMonth ? 'bg-white' : 'bg-dark/[0.035] text-dark/35'}`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className={`inline-flex h-7 min-w-7 items-center justify-center px-1 text-xs font-black ${isToday ? 'border-2 border-dark bg-primary' : ''}`}>
                    {date.getDate()}
                  </span>
                </div>
                {isCurrentMonth && (
                  <div className="space-y-1">
                    {events.slice(0, 3).map((application) => <CalendarEvent key={application.id} application={application} onSelect={onSelect} />)}
                    {events.length > 3 && (
                      <button type="button" onClick={() => setExpandedDate(key)} className="w-full px-1 py-1 text-left text-[11px] font-black underline decoration-2 underline-offset-2 hover:bg-primary">
                        +{events.length - 3} more
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {monthReminders.length === 0 && (
          <div className="border-t-2 border-dark bg-bg-neo px-4 py-3 text-center text-sm font-bold text-dark/60">
            No reminders this month. Set one from an application to see it here.
          </div>
        )}

        {expandedDate && expandedEvents.length > 0 && (
          <div className="border-t-2 border-dark bg-bg-neo p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="font-black">Reminders for {parseDateOnly(expandedDate)?.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
              <button type="button" onClick={() => setExpandedDate(null)} className="text-xs font-black underline decoration-2 underline-offset-2">Close</button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {expandedEvents.map((application) => <CalendarEvent key={application.id} application={application} onSelect={onSelect} />)}
            </div>
          </div>
        )}
        </>}
      </div>

      <div className="p-3 md:hidden">
        {monthReminders.length === 0 ? (
          <div className="flex min-h-36 flex-col items-center justify-center border-2 border-dashed border-dark/25 px-4 text-center">
            <CalendarDays size={26} className="mb-2 text-dark/35" aria-hidden="true" />
            <p className="text-sm font-black">No reminders this month</p>
            <p className="mt-1 text-xs font-semibold text-dark/55">Set a reminder from an application to see it here.</p>
          </div>
        ) : (
          <ol className="divide-y-2 divide-dark/10">
            {monthReminders.map((application) => {
              const date = parseDateOnly(application.reminder_date)
              if (!date) return null
              return (
                <li key={application.id}>
                  <button type="button" onClick={() => onSelect(application)} className="flex min-h-16 w-full items-center gap-3 px-1 py-3 text-left hover:bg-bg-neo">
                    <span className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center border-2 border-dark text-[10px] font-black uppercase leading-none ${STATUS_STYLES[application.status]}`}>
                      {date.toLocaleDateString('en-US', { month: 'short' })}
                      <strong className="mt-1 text-base leading-none">{date.getDate()}</strong>
                    </span>
                    <span className="min-w-0">
                      <strong className="block truncate text-sm">{application.job_title}</strong>
                      <span className="block truncate text-xs font-semibold text-dark/55">{application.company}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </section>
  )
}

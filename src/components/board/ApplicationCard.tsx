import { useRef, type ReactNode } from 'react'
import {
  Archive,
  BellPlus,
  BellRing,
  CalendarDays,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import type { Application, ApplicationStatus } from '../../api/applications'
import { formatDate, getReminderTiming } from '../../utils/date'

interface Props {
  application: Application
  onEdit: (app: Application) => void
  onDelete: (id: number) => void
  onArchive: (id: number) => void
  onSetReminder?: (app: Application) => void
  onMove?: (app: Application, status: ApplicationStatus) => void
  dragHandle?: ReactNode
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  wishlist: 'badge-wishlist',
  applied: 'badge-applied',
  interview: 'badge-interview',
  offer: 'badge-offer',
  rejected: 'badge-rejected',
}

const STATUS_OPTIONS: ApplicationStatus[] = ['wishlist', 'applied', 'interview', 'offer', 'rejected']

export default function ApplicationCard({
  application,
  onEdit,
  onDelete,
  onArchive,
  onSetReminder,
  onMove,
  dragHandle,
}: Props) {
  const actionsRef = useRef<HTMLDetailsElement>(null)
  const reminderTiming = getReminderTiming(application.reminder_date)

  const runAction = (action: () => void) => {
    actionsRef.current?.removeAttribute('open')
    action()
  }

  return (
    <article className="bg-white border-2 border-dark shadow-neo-sm p-3.5 transition-transform hover:-translate-y-0.5 hover:shadow-neo">
      <div className="flex items-start gap-2 mb-2.5">
        {dragHandle}
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-black text-sm text-dark leading-tight truncate">{application.job_title}</h3>
          <p className="text-xs text-gray-neo font-semibold truncate mt-1">{application.company}</p>
        </div>

        <details ref={actionsRef} className="relative shrink-0" onPointerDown={(event) => event.stopPropagation()}>
          <summary
            className="icon-button h-9 w-9 cursor-pointer list-none shadow-none hover:bg-primary [&::-webkit-details-marker]:hidden"
            aria-label={`Actions for ${application.job_title}`}
          >
            <MoreHorizontal size={18} strokeWidth={2.6} aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-10 z-30 w-40 border-2 border-dark bg-white p-1 shadow-neo">
            <button type="button" onClick={() => runAction(() => onEdit(application))} className="flex min-h-10 w-full items-center gap-2 px-2 text-left text-xs font-bold hover:bg-primary">
              <Pencil size={15} aria-hidden="true" /> Edit
            </button>
            <button type="button" onClick={() => runAction(() => onArchive(application.id))} className="flex min-h-10 w-full items-center gap-2 px-2 text-left text-xs font-bold hover:bg-interview">
              <Archive size={15} aria-hidden="true" /> Archive
            </button>
            <button type="button" onClick={() => runAction(() => onDelete(application.id))} className="flex min-h-10 w-full items-center gap-2 px-2 text-left text-xs font-bold hover:bg-rejected">
              <Trash2 size={15} aria-hidden="true" /> Delete
            </button>
          </div>
        </details>
      </div>

      {application.url && (
        <a
          href={application.url}
          target="_blank"
          rel="noopener noreferrer"
          onPointerDown={(event) => event.stopPropagation()}
          className="mb-3 flex min-h-8 items-center gap-1.5 truncate text-xs font-semibold text-dark underline decoration-2 underline-offset-2 hover:text-dark/65"
        >
          <ExternalLink size={14} aria-hidden="true" />
          <span className="truncate">{application.url.replace(/^https?:\/\//, '').split('/')[0]}</span>
        </a>
      )}

      {application.status === 'interview' && !application.reminder_date && onSetReminder && (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onSetReminder(application)}
          className="mb-3 flex min-h-11 w-full items-center justify-center gap-2 border-2 border-dark bg-primary px-3 text-xs font-black shadow-neo-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <BellPlus size={16} strokeWidth={2.5} aria-hidden="true" /> Set interview reminder
        </button>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`badge ${STATUS_COLORS[application.status]}`}>{application.status}</span>

        {application.reminder_date && (
          <span
            className={`badge ${reminderTiming.isToday ? 'bg-rejected' : reminderTiming.isTomorrow ? 'bg-interview' : 'bg-primary'}`}
            title={`Reminder: ${formatDate(application.reminder_date)}`}
          >
            <BellRing size={13} aria-hidden="true" />
            {reminderTiming.isToday ? 'Today' : reminderTiming.isTomorrow ? 'Tomorrow' : formatDate(application.reminder_date)}
          </span>
        )}

        {application.applied_date && (
          <span className="badge bg-white" title="Applied date">
            <CalendarDays size={13} aria-hidden="true" /> {formatDate(application.applied_date)}
          </span>
        )}
      </div>

      {onMove && (
        <div className="mt-3 border-t-2 border-dark/10 pt-3 md:hidden">
          <label htmlFor={`move-application-${application.id}`} className="sr-only">Move {application.job_title}</label>
          <select
            id={`move-application-${application.id}`}
            value={application.status}
            onPointerDown={(event) => event.stopPropagation()}
            onChange={(event) => onMove(application, event.target.value as ApplicationStatus)}
            className="min-h-11 w-full border-2 border-dark bg-white px-3 text-xs font-black"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>Move to {status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
        </div>
      )}
    </article>
  )
}

import type { ReactNode } from 'react'
import {
  BellPlus,
  CalendarDays,
  ExternalLink,
  HandCoins,
  Pencil,
} from 'lucide-react'
import type { Application, ApplicationStatus } from '../../api/applications'
import { EMPLOYMENT_TYPE_LABELS, formatSalaryRange } from '../../utils/application'
import { formatDate } from '../../utils/date'

interface Props {
  application: Application
  onEdit: (app: Application) => void
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
  onSetReminder,
  onMove,
  dragHandle,
}: Props) {
  const salary = formatSalaryRange(application.salary_min, application.salary_max)

  return (
    <article className="flex min-h-[236px] h-full flex-col border-2 border-dark bg-white p-3.5 shadow-neo-sm transition-transform hover:-translate-y-0.5 hover:shadow-neo md:h-[280px]">
      <div className="flex items-start gap-2 mb-2.5">
        {dragHandle}
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="line-clamp-2 min-h-9 text-sm font-black leading-tight text-dark">{application.job_title}</h3>
          <p className="text-xs text-gray-neo font-semibold truncate mt-1">{application.company}</p>
        </div>
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onEdit(application)}
          className="icon-button h-9 w-9 shrink-0 shadow-none hover:bg-primary"
          aria-label={`Edit ${application.job_title}`}
        >
          <Pencil size={17} strokeWidth={2.7} aria-hidden="true" />
        </button>
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

      {(application.employment_type || salary) && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {application.employment_type && <span className="badge bg-bg-neo">{EMPLOYMENT_TYPE_LABELS[application.employment_type]}</span>}
          {salary && <span className="badge bg-white"><HandCoins size={13} aria-hidden="true" /> {salary}</span>}
        </div>
      )}

      {application.notes && (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onEdit(application)}
          className="mb-3 line-clamp-2 w-full text-left text-xs font-medium leading-relaxed text-dark/65 underline-offset-2 hover:text-dark hover:underline"
          aria-label={`Read notes for ${application.job_title}`}
        >
          {application.notes}
        </button>
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

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        <span className={`badge ${STATUS_COLORS[application.status]}`}>{application.status}</span>

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

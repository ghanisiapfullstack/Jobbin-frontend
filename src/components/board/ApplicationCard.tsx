import type { Application, ApplicationStatus } from '../../api/applications'

interface Props {
  application: Application
  onEdit: (app: Application) => void
  onDelete: (id: number) => void
  onArchive: (id: number) => void
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  wishlist: 'badge-wishlist',
  applied: 'badge-applied',
  interview: 'badge-interview',
  offer: 'badge-offer',
  rejected: 'badge-rejected',
}

export default function ApplicationCard({ application, onEdit, onDelete, onArchive }: Props) {
  const hasReminder = !!application.reminder_date
  const reminderSent = application.reminder_sent_day_of || application.reminder_sent_day_before

  return (
    <div className="bg-white border-2 border-dark shadow-neo-sm p-3 cursor-grab active:cursor-grabbing group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-dark leading-tight truncate">
            {application.job_title}
          </p>
          <p className="text-xs text-gray-neo font-medium truncate mt-0.5">
            {application.company}
          </p>
        </div>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(application) }}
            className="w-6 h-6 border-2 border-dark bg-white hover:bg-primary flex items-center justify-center text-xs font-bold transition-colors"
            title="Edit"
            aria-label="Edit application"
          >
            ✎
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onArchive(application.id) }}
            className="w-6 h-6 border-2 border-dark bg-white hover:bg-interview flex items-center justify-center text-xs font-bold transition-colors"
            title="Archive"
            aria-label="Archive application"
          >
            ⊡
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(application.id) }}
            className="w-6 h-6 border-2 border-dark bg-white hover:bg-rejected flex items-center justify-center text-xs font-bold transition-colors"
            title="Delete"
            aria-label="Delete application"
          >
            ✕
          </button>
        </div>
      </div>

      {/* URL */}
      {application.url && (
        <a
          href={application.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-dark underline underline-offset-2 truncate block mb-2 hover:text-gray-neo"
        >
          {application.url.replace(/^https?:\/\//, '').split('/')[0]}
        </a>
      )}

      {/* Footer badges */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`badge ${STATUS_COLORS[application.status]}`}>
          {application.status}
        </span>

        {hasReminder && (
          <span className={`badge ${reminderSent ? 'bg-gray-200' : 'bg-primary'}`} title="Reminder set">
            🔔 {application.reminder_date}
          </span>
        )}

        {application.applied_date && (
          <span className="badge bg-white" title="Applied date">
            📅 {application.applied_date}
          </span>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { ChevronDown, ChevronRight, GripVertical, Plus } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Application, ApplicationStatus } from '../../api/applications'
import ApplicationCard from './ApplicationCard'

interface CardActions {
  onEdit: (app: Application) => void
  onSetReminder: (app: Application) => void
  onMove: (app: Application, status: ApplicationStatus) => void
}

interface SortableCardProps extends CardActions {
  application: Application
  dragEnabled: boolean
}

function SortableCard({ application, dragEnabled, ...actions }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application.id,
    data: { application },
    disabled: !dragEnabled,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.45 : 1 }}
      {...(dragEnabled ? attributes : {})}
      {...(dragEnabled ? listeners : {})}
      className={dragEnabled ? 'group cursor-grab touch-none select-none active:cursor-grabbing' : undefined}
    >
      <ApplicationCard
        application={application}
        {...actions}
        dragHandle={dragEnabled ? (
          <span
            className="hidden h-9 w-8 shrink-0 items-center justify-center border-2 border-transparent text-dark/45 transition-colors group-hover:border-dark group-hover:bg-primary group-hover:text-dark md:flex"
            aria-hidden="true"
          >
            <GripVertical size={18} aria-hidden="true" />
          </span>
        ) : undefined}
      />
    </div>
  )
}

interface KanbanColumnProps extends CardActions {
  status: ApplicationStatus
  label: string
  color: string
  applications: Application[]
  onAdd: (status: ApplicationStatus) => void
  dragEnabled: boolean
  collapsible?: boolean
}

export default function KanbanColumn({
  status,
  label,
  color,
  applications,
  onAdd,
  dragEnabled,
  onEdit,
  onSetReminder,
  onMove,
  collapsible = false,
}: KanbanColumnProps) {
  const [collapsed, setCollapsed] = useState(collapsible)
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <section className="flex w-full min-w-0 flex-col md:w-[clamp(256px,19vw,288px)] md:min-w-[256px]" aria-labelledby={`column-${status}`}>
      <div className={`relative mb-2 flex min-h-12 items-center justify-between border-2 border-dark px-3 shadow-neo-sm ${color}`}>
        <div className="flex min-w-0 items-center gap-2">
          {collapsible && (
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="-ml-2 inline-flex h-11 w-9 items-center justify-center hover:bg-white/45"
              aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
              aria-expanded={!collapsed}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
          <h2 id={`column-${status}`} className="truncate text-sm font-black uppercase tracking-wide">{label}</h2>
          <span className="border border-dark bg-white/70 px-1.5 py-0.5 text-xs font-black">{applications.length}</span>
        </div>
        <button
          type="button"
          onClick={() => onAdd(status)}
          className="icon-button h-9 w-9 shrink-0 shadow-none hover:bg-dark hover:text-white"
          aria-label={`Add application to ${label}`}
        >
          <Plus size={18} strokeWidth={3} aria-hidden="true" />
        </button>
      </div>

      {!collapsed ? (
        <div
          ref={setNodeRef}
          className={`flex min-h-[360px] flex-1 flex-col gap-2.5 border-2 p-2.5 transition-colors ${isOver ? 'border-dark bg-primary/20' : 'border-dashed border-dark/30 bg-white/35'}`}
        >
          <SortableContext items={applications.map((application) => application.id)} strategy={verticalListSortingStrategy}>
            {applications.map((application) => (
              <SortableCard
                key={application.id}
                application={application}
                dragEnabled={dragEnabled}
                onEdit={onEdit}
                onSetReminder={onSetReminder}
                onMove={onMove}
              />
            ))}
          </SortableContext>

          {applications.length === 0 && (
            <button type="button" onClick={() => onAdd(status)} className="flex min-h-44 flex-1 items-center justify-center text-xs font-black text-dark/40 hover:bg-white/40 hover:text-dark">
              <Plus size={16} className="mr-1.5" aria-hidden="true" /> Add your first card
            </button>
          )}
        </div>
      ) : (
        <button type="button" className="min-h-14 border-2 border-dashed border-dark/30 p-3 text-xs font-bold text-dark/55 hover:bg-white/40" onClick={() => setCollapsed(false)}>
          {applications.length} card{applications.length === 1 ? '' : 's'} hidden
        </button>
      )}
    </section>
  )
}

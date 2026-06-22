import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Application, ApplicationStatus } from '../../api/applications'
import ApplicationCard from './ApplicationCard'

interface SortableCardProps {
  application: Application
  onEdit: (app: Application) => void
  onDelete: (id: number) => void
  onArchive: (id: number) => void
}

function SortableCard({ application, onEdit, onDelete, onArchive }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application.id,
    data: { application },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ApplicationCard
        application={application}
        onEdit={onEdit}
        onDelete={onDelete}
        onArchive={onArchive}
      />
    </div>
  )
}

interface KanbanColumnProps {
  status: ApplicationStatus
  label: string
  color: string
  applications: Application[]
  onAdd: (status: ApplicationStatus) => void
  onEdit: (app: Application) => void
  onDelete: (id: number) => void
  onArchive: (id: number) => void
  collapsible?: boolean
}

export default function KanbanColumn({
  status,
  label,
  color,
  applications,
  onAdd,
  onEdit,
  onDelete,
  onArchive,
  collapsible = false,
}: KanbanColumnProps) {
  const [collapsed, setCollapsed] = useState(collapsible)
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col min-w-[260px] w-[260px]">
      {/* Column header */}
      <div
        className={`border-2 border-dark shadow-neo-sm px-3 py-2 mb-2 flex items-center justify-between ${color}`}
      >
        <div className="flex items-center gap-2">
          {collapsible && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="font-black text-sm w-5 h-5 flex items-center justify-center hover:opacity-70"
              aria-label={collapsed ? 'Expand column' : 'Collapse column'}
            >
              {collapsed ? '▶' : '▼'}
            </button>
          )}
          <span className="font-black text-sm text-dark uppercase tracking-wide">{label}</span>
          <span className="text-xs font-bold bg-white/60 border border-dark px-1.5 py-0.5">
            {applications.length}
          </span>
        </div>
        <button
          onClick={() => onAdd(status)}
          className="w-6 h-6 border-2 border-dark bg-white hover:bg-dark hover:text-white flex items-center justify-center font-black text-sm transition-colors"
          aria-label={`Add to ${label}`}
        >
          +
        </button>
      </div>

      {/* Cards */}
      {!collapsed && (
        <div
          ref={setNodeRef}
          className={`flex-1 flex flex-col gap-2 min-h-[120px] p-2 border-2 transition-colors ${
            isOver ? 'border-dark bg-primary/20' : 'border-dashed border-dark/30 bg-white/40'
          }`}
        >
          <SortableContext
            items={applications.map((a) => a.id)}
            strategy={verticalListSortingStrategy}
          >
            {applications.map((app) => (
              <SortableCard
                key={app.id}
                application={app}
                onEdit={onEdit}
                onDelete={onDelete}
                onArchive={onArchive}
              />
            ))}
          </SortableContext>

          {applications.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-dark/30 font-bold">Drop here</p>
            </div>
          )}
        </div>
      )}

      {collapsed && (
        <div
          className="border-2 border-dashed border-dark/30 p-3 text-center cursor-pointer hover:bg-white/40 transition-colors"
          onClick={() => setCollapsed(false)}
        >
          <p className="text-xs text-dark/50 font-bold">{applications.length} cards hidden</p>
        </div>
      )}
    </div>
  )
}

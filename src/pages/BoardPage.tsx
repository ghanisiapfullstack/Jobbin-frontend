import { useEffect, useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import toast from 'react-hot-toast'
import { useApplicationsStore } from '../store/applicationsStore'
import type { Application, ApplicationStatus } from '../api/applications'
import KanbanColumn from '../components/board/KanbanColumn'
import ApplicationCard from '../components/board/ApplicationCard'
import ApplicationModal from '../components/board/ApplicationModal'
import { ColumnSkeleton } from '../components/board/Skeleton'

const COLUMNS: { status: ApplicationStatus; label: string; color: string; collapsible?: boolean }[] = [
  { status: 'wishlist',  label: 'Wishlist',   color: 'bg-wishlist' },
  { status: 'applied',   label: 'Applied',    color: 'bg-applied' },
  { status: 'interview', label: 'Interview',  color: 'bg-interview' },
  { status: 'offer',     label: 'Offer',      color: 'bg-offer' },
  { status: 'rejected',  label: 'Rejected',   color: 'bg-rejected', collapsible: true },
]

export default function BoardPage() {
  const { applications, loading, fetchApplications, addApplication, updateApplication, updatePosition, archiveApplication, deleteApplication } = useApplicationsStore()

  const [activeApp, setActiveApp] = useState<Application | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<ApplicationStatus>('wishlist')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  useEffect(() => {
    fetchApplications()
  }, [])

  const getColumnApps = useCallback(
    (status: ApplicationStatus) =>
      applications
        .filter((a) => a.status === status)
        .sort((a, b) => a.position - b.position),
    [applications]
  )

  const handleDragStart = (event: DragStartEvent) => {
    const app = applications.find((a) => a.id === event.active.id)
    if (app) setActiveApp(app)
  }

  const handleDragOver = (_event: DragOverEvent) => {
    // handled in dragEnd
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveApp(null)
    const { active, over } = event
    if (!over) return

    const activeApp = applications.find((a) => a.id === active.id)
    if (!activeApp) return

    // Determine target status
    let targetStatus: ApplicationStatus = activeApp.status

    // over.id bisa berupa status string (droppable) atau card id (sortable)
    if (typeof over.id === 'string' && COLUMNS.some((c) => c.status === over.id)) {
      targetStatus = over.id as ApplicationStatus
    } else {
      const overApp = applications.find((a) => a.id === over.id)
      if (overApp) targetStatus = overApp.status
    }

    const columnApps = getColumnApps(targetStatus)

    if (activeApp.status === targetStatus) {
      // Reorder dalam kolom yang sama
      const oldIndex = columnApps.findIndex((a) => a.id === active.id)
      const newIndex = columnApps.findIndex((a) => a.id === over.id)
      if (oldIndex === newIndex) return

      const reordered = arrayMove(columnApps, oldIndex, newIndex)
      // Assign posisi baru
      for (let i = 0; i < reordered.length; i++) {
        await updatePosition(reordered[i].id, i + 1, targetStatus)
      }
    } else {
      // Pindah kolom
      const newPosition = columnApps.length + 1
      await updatePosition(activeApp.id, newPosition, targetStatus)
      toast.success(`Moved to ${targetStatus}`)
    }
  }

  const handleAdd = (status: ApplicationStatus) => {
    setEditingApp(null)
    setDefaultStatus(status)
    setModalOpen(true)
  }

  const handleEdit = (app: Application) => {
    setEditingApp(app)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this application?')) return
    try {
      await deleteApplication(id)
      toast.success('Application deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleArchive = async (id: number) => {
    try {
      await archiveApplication(id)
      toast.success('Application archived')
    } catch {
      toast.error('Failed to archive')
    }
  }

  const handleModalSubmit = async (data: Parameters<typeof addApplication>[0]) => {
    if (editingApp) {
      await updateApplication(editingApp.id, data)
      toast.success('Application updated')
    } else {
      await addApplication({ ...data, status: defaultStatus })
      toast.success('Application added')
    }
  }

  if (loading && applications.length === 0) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-7 w-32 bg-dark/10 animate-pulse mb-1" />
            <div className="h-4 w-24 bg-dark/10 animate-pulse" />
          </div>
          <div className="h-9 w-36 bg-dark/10 animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-6">
          {[1,2,3,4,5].map((i) => <ColumnSkeleton key={i} />)}
        </div>
      </>
    )
  }

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-dark">Job Board</h1>
          <p className="text-sm text-gray-neo mt-0.5">
            {applications.length} application{applications.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => handleAdd('wishlist')}
          className="btn-primary"
        >
          + Add application
        </button>
      </div>

      {/* Kanban board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              label={col.label}
              color={col.color}
              applications={getColumnApps(col.status)}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onArchive={handleArchive}
              collapsible={col.collapsible}
            />
          ))}
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeApp && (
            <div className="rotate-2 opacity-90">
              <ApplicationCard
                application={activeApp}
                onEdit={() => {}}
                onDelete={() => {}}
                onArchive={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Modal */}
      <ApplicationModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingApp(null) }}
        onSubmit={handleModalSubmit}
        initialData={editingApp}
        defaultStatus={defaultStatus}
      />
    </>
  )
}

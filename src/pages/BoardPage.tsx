import { useCallback, useEffect, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { AlertTriangle, Plus, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { toApplicationPayload, type Application, type ApplicationStatus } from '../api/applications'
import ApplicationCard from '../components/board/ApplicationCard'
import ApplicationModal from '../components/board/ApplicationModal'
import InterviewReminderPrompt from '../components/board/InterviewReminderPrompt'
import KanbanColumn from '../components/board/KanbanColumn'
import { ColumnSkeleton } from '../components/board/Skeleton'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useApplicationsStore } from '../store/applicationsStore'
import { useRemindersStore } from '../store/remindersStore'
import { getApiErrorData } from '../utils/apiError'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const COLUMNS: { status: ApplicationStatus; label: string; color: string; collapsible?: boolean }[] = [
  { status: 'wishlist', label: 'Wishlist', color: 'bg-wishlist' },
  { status: 'applied', label: 'Applied', color: 'bg-applied' },
  { status: 'interview', label: 'Interview', color: 'bg-interview' },
  { status: 'offer', label: 'Offer', color: 'bg-offer' },
  { status: 'rejected', label: 'Rejected', color: 'bg-rejected', collapsible: true },
]

export default function BoardPage() {
  const {
    applications,
    loading,
    error,
    fetchApplications,
    addApplication,
    updateApplication,
    updatePosition,
    archiveApplication,
    deleteApplication,
  } = useApplicationsStore()
  const fetchReminders = useRemindersStore((state) => state.fetchReminders)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [activeApp, setActiveApp] = useState<Application | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<ApplicationStatus>('wishlist')
  const [mobileStatus, setMobileStatus] = useState<ApplicationStatus>('wishlist')
  const [reminderApp, setReminderApp] = useState<Application | null>(null)
  const [reminderSaving, setReminderSaving] = useState(false)
  const [reminderError, setReminderError] = useState<string | null>(null)
  const [deletingApp, setDeletingApp] = useState<Application | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    void fetchApplications()
  }, [fetchApplications])

  const getColumnApps = useCallback(
    (status: ApplicationStatus) => applications.filter((application) => application.status === status).sort((a, b) => a.position - b.position),
    [applications],
  )

  const openReminder = (application: Application) => {
    setReminderError(null)
    setReminderApp(application)
  }

  const moveApplication = async (application: Application, targetStatus: ApplicationStatus, position?: number) => {
    if (application.status === targetStatus && position === undefined) return

    const wasInterview = application.status === 'interview'
    const nextPosition = position ?? getColumnApps(targetStatus).length + 1
    await updatePosition(application.id, nextPosition, targetStatus)
    toast.success(`Moved to ${targetStatus}`)

    if (!wasInterview && targetStatus === 'interview' && !application.reminder_date) {
      openReminder({ ...application, status: targetStatus, position: nextPosition })
    }
  }

  const positionBetween = (previous?: Application, next?: Application) => {
    if (previous && next) return previous.position + (next.position - previous.position) / 2
    if (previous) return previous.position + 1
    if (next) return next.position - 1
    return 1
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveApp(applications.find((application) => application.id === event.active.id) ?? null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveApp(null)
    const { active, over } = event
    if (!over) return

    const application = applications.find((item) => item.id === active.id)
    if (!application) return

    const targetStatus: ApplicationStatus =
      typeof over.id === 'string' && COLUMNS.some((column) => column.status === over.id)
        ? over.id as ApplicationStatus
        : applications.find((item) => item.id === over.id)?.status ?? application.status

    try {
      const columnApps = getColumnApps(targetStatus)
      if (application.status !== targetStatus) {
        const targetApps = columnApps.filter((item) => item.id !== application.id)
        const hoveredIndex = typeof over.id === 'number'
          ? targetApps.findIndex((item) => item.id === over.id)
          : -1
        const targetIndex = hoveredIndex >= 0 ? hoveredIndex : targetApps.length
        const nextPosition = positionBetween(targetApps[targetIndex - 1], targetApps[targetIndex])
        await moveApplication(application, targetStatus, nextPosition)
        return
      }

      const oldIndex = columnApps.findIndex((item) => item.id === active.id)
      const newIndex = columnApps.findIndex((item) => item.id === over.id)
      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return

      const reordered = arrayMove(columnApps, oldIndex, newIndex)
      const movedIndex = reordered.findIndex((item) => item.id === application.id)
      const nextPosition = positionBetween(reordered[movedIndex - 1], reordered[movedIndex + 1])
      await updatePosition(application.id, nextPosition, targetStatus)
    } catch (moveError: unknown) {
      toast.error(getApiErrorData(moveError).message || 'We could not move this application.')
    }
  }

  const handleAdd = (status: ApplicationStatus) => {
    setEditingApp(null)
    setDefaultStatus(status)
    setModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setDeletingApp(applications.find((application) => application.id === id) ?? null)
  }

  const confirmDelete = async () => {
    if (!deletingApp) return
    setDeleteBusy(true)
    try {
      await deleteApplication(deletingApp.id)
      setDeletingApp(null)
      toast.success('Application deleted')
    } catch (deleteError: unknown) {
      toast.error(getApiErrorData(deleteError).message || 'We could not delete this application.')
    } finally {
      setDeleteBusy(false)
    }
  }

  const handleArchive = async (id: number) => {
    try {
      await archiveApplication(id)
      toast.success('Application archived')
    } catch (archiveError: unknown) {
      toast.error(getApiErrorData(archiveError).message || 'We could not archive this application.')
    }
  }

  const handleModalSubmit = async (data: Parameters<typeof addApplication>[0]) => {
    if (editingApp) {
      const updated = await updateApplication(editingApp.id, data)
      if (editingApp.status !== 'interview' && updated.status === 'interview' && !updated.reminder_date) openReminder(updated)
      toast.success('Application updated')
    } else {
      const created = await addApplication({ ...data, status: data.status ?? defaultStatus })
      if (created.status === 'interview' && !created.reminder_date) openReminder(created)
      toast.success('Application added')
    }
  }

  const handleSaveReminder = async (date: string) => {
    if (!reminderApp) return
    setReminderSaving(true)
    setReminderError(null)
    try {
      await updateApplication(reminderApp.id, toApplicationPayload(reminderApp, { reminder_date: date }))
      await fetchReminders()
      setReminderApp(null)
      toast.success('Interview reminder set')
    } catch (saveError: unknown) {
      setReminderError(getApiErrorData(saveError).message || 'We could not set this reminder.')
    } finally {
      setReminderSaving(false)
    }
  }

  if (loading && applications.length === 0) {
    return (
      <div aria-label="Loading applications" aria-busy="true">
        <div className="mb-6 flex items-center justify-between">
          <div><div className="mb-2 h-7 w-32 animate-pulse bg-dark/10" /><div className="h-4 w-24 animate-pulse bg-dark/10" /></div>
          <div className="h-11 w-40 animate-pulse bg-dark/10" />
        </div>
        <div className="flex gap-4 overflow-hidden">{[1, 2, 3, 4, 5].map((item) => <ColumnSkeleton key={item} />)}</div>
      </div>
    )
  }

  if (error && applications.length === 0) {
    return (
      <div className="card-neo mx-auto mt-12 max-w-lg text-center" role="alert">
        <AlertTriangle size={36} className="mx-auto mb-3" aria-hidden="true" />
        <h1 className="text-xl font-black">Your board did not load</h1>
        <p className="mt-2 text-sm font-medium text-gray-neo">{error}</p>
        <button type="button" onClick={() => void fetchApplications()} className="btn-dark mt-5">
          <RefreshCw size={17} aria-hidden="true" /> Try again
        </button>
      </div>
    )
  }

  const visibleColumns = isDesktop ? COLUMNS : COLUMNS.filter((column) => column.status === mobileStatus)

  return (
    <>
      <header className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-dark/55">Application tracker</p>
          <h1 className="text-2xl font-black text-dark sm:text-3xl">Job Board</h1>
          <p className="mt-1 text-sm font-semibold text-gray-neo">{applications.length} application{applications.length === 1 ? '' : 's'} across your pipeline</p>
        </div>
        <button type="button" onClick={() => handleAdd(isDesktop ? 'wishlist' : mobileStatus)} className="btn-primary shrink-0 px-3 sm:px-5">
          <Plus size={18} strokeWidth={3} aria-hidden="true" /><span className="hidden sm:inline">Add application</span><span className="sm:hidden">Add</span>
        </button>
      </header>

      <nav className="-mx-4 mb-4 overflow-x-auto px-4 md:hidden" aria-label="Application status">
        <div className="flex min-w-max gap-2 pb-1">
          {COLUMNS.map((column) => {
            const count = getColumnApps(column.status).length
            const active = mobileStatus === column.status
            return (
              <button
                key={column.status}
                type="button"
                onClick={() => setMobileStatus(column.status)}
                className={`min-h-11 border-2 border-dark px-3 text-xs font-black uppercase tracking-wide ${active ? `${column.color} shadow-neo-sm` : 'bg-white'}`}
                aria-current={active ? 'page' : undefined}
              >
                {column.label} <span className="ml-1 opacity-65">{count}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex w-full gap-4 overflow-x-auto pb-6 md:min-w-max">
          {visibleColumns.map((column) => (
            <KanbanColumn
              key={column.status}
              {...column}
              applications={getColumnApps(column.status)}
              onAdd={handleAdd}
              onEdit={(application) => { setEditingApp(application); setModalOpen(true) }}
              onDelete={handleDelete}
              onArchive={handleArchive}
              onSetReminder={openReminder}
              onMove={(application, status) => void moveApplication(application, status).catch((moveError: unknown) => toast.error(getApiErrorData(moveError).message || 'We could not move this application.'))}
              dragEnabled={isDesktop}
              collapsible={isDesktop && column.collapsible}
            />
          ))}
        </div>

        <DragOverlay>
          {activeApp && (
            <div className="w-[288px] rotate-2 opacity-95">
              <ApplicationCard application={activeApp} onEdit={() => undefined} onDelete={() => undefined} onArchive={() => undefined} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <ApplicationModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingApp(null) }}
        onSubmit={handleModalSubmit}
        initialData={editingApp}
        defaultStatus={defaultStatus}
      />

      <InterviewReminderPrompt
        key={reminderApp?.id ?? 'closed'}
        application={reminderApp}
        saving={reminderSaving}
        error={reminderError}
        onClose={() => setReminderApp(null)}
        onSave={handleSaveReminder}
      />

      <ConfirmDialog
        open={!!deletingApp}
        title="Delete application?"
        description={deletingApp ? `${deletingApp.job_title} at ${deletingApp.company} will be permanently removed.` : ''}
        busy={deleteBusy}
        onCancel={() => setDeletingApp(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useApplicationsStore } from '../store/applicationsStore'
import { ArchiveRestore, ArrowLeft, CalendarDays, Inbox, Trash2 } from 'lucide-react'
import { formatDate } from '../utils/date'
import { getApiErrorData } from '../utils/apiError'
import type { Application } from '../api/applications'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useState } from 'react'

export default function ArchivedPage() {
  const { applications, loading, error, fetchArchived, archiveApplication, deleteApplication } = useApplicationsStore()
  const [deletingApp, setDeletingApp] = useState<Application | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  useEffect(() => {
    void fetchArchived()
  }, [fetchArchived])

  const handleRestore = async (id: number) => {
    try {
      await archiveApplication(id)
      toast.success('Application restored')
    } catch (restoreError: unknown) {
      toast.error(getApiErrorData(restoreError).message || 'We could not restore this application.')
    }
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

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-dark">Archived</h1>
          <p className="text-sm text-gray-neo mt-0.5">
            {applications.length} archived application{applications.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/board" className="btn-outline text-sm">
          <ArrowLeft size={17} aria-hidden="true" /> Back to board
        </Link>
      </div>

      {loading && applications.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error && applications.length === 0 ? (
        <div className="card-neo text-center py-12" role="alert">
          <p className="font-black">Your archive did not load.</p>
          <p className="mt-1 text-sm text-gray-neo">{error}</p>
          <button type="button" onClick={() => void fetchArchived()} className="btn-dark mt-5">Try again</button>
        </div>
      ) : applications.length === 0 ? (
        <div className="card-neo text-center py-12">
          <Inbox size={40} className="mx-auto mb-3 text-dark/45" aria-hidden="true" />
          <p className="font-bold text-gray-neo">No archived applications yet.</p>
          <p className="mt-1 text-xs text-dark/45">Archive completed or paused applications to keep your board focused.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {applications.map((app) => (
            <div key={app.id} className="card-neo !p-4">
              <div className="mb-3">
                <p className="font-black text-sm truncate">{app.job_title}</p>
                <p className="text-xs text-gray-neo truncate">{app.company}</p>
              </div>

              <div className="flex items-center gap-1.5 mb-4">
                <span className={`badge badge-${app.status}`}>{app.status}</span>
                {app.applied_date && (
                  <span className="badge bg-white text-xs"><CalendarDays size={13} aria-hidden="true" /> {formatDate(app.applied_date)}</span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleRestore(app.id)}
                  className="btn-primary flex-1 text-xs py-1.5"
                >
                  <ArchiveRestore size={16} aria-hidden="true" /> Restore
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="btn-danger text-xs px-3 py-1.5"
                >
                  <Trash2 size={16} aria-hidden="true" /><span className="sr-only sm:not-sr-only">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deletingApp}
        title="Delete archived application?"
        description={deletingApp ? `${deletingApp.job_title} at ${deletingApp.company} will be permanently removed.` : ''}
        busy={deleteBusy}
        onCancel={() => setDeletingApp(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

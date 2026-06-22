import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useApplicationsStore } from '../store/applicationsStore'

export default function ArchivedPage() {
  const { applications, loading, fetchArchived, archiveApplication, deleteApplication } = useApplicationsStore()

  useEffect(() => {
    fetchArchived()
  }, [])

  const handleRestore = async (id: number) => {
    try {
      await archiveApplication(id)
      toast.success('Application restored')
    } catch {
      toast.error('Failed to restore')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Permanently delete this application?')) return
    try {
      await deleteApplication(id)
      toast.success('Application deleted')
    } catch {
      toast.error('Failed to delete')
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
          ← Back to board
        </Link>
      </div>

      {loading && applications.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="card-neo text-center py-12">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-bold text-gray-neo">No archived applications yet.</p>
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
                  <span className="badge bg-white text-xs">📅 {app.applied_date}</span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleRestore(app.id)}
                  className="btn-primary flex-1 text-xs py-1.5"
                >
                  Restore
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="btn-danger text-xs px-3 py-1.5"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

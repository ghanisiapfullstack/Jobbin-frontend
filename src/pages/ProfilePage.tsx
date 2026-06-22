import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()

  const [nameForm, setNameForm] = useState({ name: user?.name || '' })
  const [nameLoading, setNameLoading] = useState(false)

  const [pwForm, setPwForm] = useState({
    current_password: '',
    new_password: '',
  })
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({})
  const [pwLoading, setPwLoading] = useState(false)

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameForm.name.trim()) return
    setNameLoading(true)
    try {
      const res = await api.put<{ message: string; data: { id: number; name: string; email: string } }>(
        '/profile',
        { name: nameForm.name.trim() }
      )
      setUser({ ...user!, name: res.data.data.name })
      toast.success('Name updated!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update name')
    } finally {
      setNameLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwErrors({})
    if (!pwForm.current_password || !pwForm.new_password) {
      setPwErrors({ general: 'Both fields are required' })
      return
    }
    if (pwForm.new_password.length < 6) {
      setPwErrors({ new_password: 'Minimum 6 characters' })
      return
    }
    setPwLoading(true)
    try {
      await api.put('/profile/password', pwForm)
      toast.success('Password updated!')
      setPwForm({ current_password: '', new_password: '' })
    } catch (err: any) {
      const data = err.response?.data
      if (data?.errors) setPwErrors(data.errors)
      else toast.error(data?.message || 'Failed to update password')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-dark">Profile</h1>
        <p className="text-sm text-gray-neo mt-0.5">{user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        {/* Update name */}
        <div className="card-neo">
          <h2 className="text-lg font-black mb-4">Display name</h2>
          <form onSubmit={handleUpdateName} className="flex flex-col gap-4">
            <div>
              <label className="label-neo">Name</label>
              <input
                value={nameForm.name}
                onChange={(e) => setNameForm({ name: e.target.value })}
                className="input-neo"
                placeholder="Your name"
              />
            </div>
            <button
              type="submit"
              disabled={nameLoading}
              className="btn-dark disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {nameLoading ? 'Saving...' : 'Save name'}
            </button>
          </form>
        </div>

        {/* Update password */}
        <div className="card-neo">
          <h2 className="text-lg font-black mb-4">Change password</h2>
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
            <div>
              <label className="label-neo">Current password</label>
              <input
                type="password"
                value={pwForm.current_password}
                onChange={(e) => setPwForm((p) => ({ ...p, current_password: e.target.value }))}
                className={`input-neo ${pwErrors.current_password ? 'border-red-500' : ''}`}
                placeholder="••••••"
              />
              {pwErrors.current_password && <p className="error-msg">{pwErrors.current_password}</p>}
            </div>
            <div>
              <label className="label-neo">New password</label>
              <input
                type="password"
                value={pwForm.new_password}
                onChange={(e) => setPwForm((p) => ({ ...p, new_password: e.target.value }))}
                className={`input-neo ${pwErrors.new_password ? 'border-red-500' : ''}`}
                placeholder="Min. 6 characters"
              />
              {pwErrors.new_password && <p className="error-msg">{pwErrors.new_password}</p>}
            </div>
            {pwErrors.general && <p className="error-msg">{pwErrors.general}</p>}
            <button
              type="submit"
              disabled={pwLoading}
              className="btn-dark disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pwLoading ? 'Saving...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

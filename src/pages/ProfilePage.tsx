import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi, type User } from '../api/auth'
import { profileApi } from '../api/profile'
import FormField from '../components/ui/FormField'
import { useAuthStore } from '../store/authStore'
import { getApiErrorData } from '../utils/apiError'

export default function ProfilePage() {
  const { user, setUser, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<User | null>(user)
  const [profileError, setProfileError] = useState('')
  const [name, setName] = useState(user?.name ?? '')
  const [nameLoading, setNameLoading] = useState(false)
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '' })
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({})
  const [pwLoading, setPwLoading] = useState(false)
  const [linkLoading, setLinkLoading] = useState(false)

  useEffect(() => {
    void profileApi.show().then((response) => {
      setProfile(response.data.data)
      setName(response.data.data.name)
      setUser(response.data.data)
    }).catch((error: unknown) => {
      setProfileError(getApiErrorData(error).message || 'We could not load your account settings.')
    })
  }, [setUser])

  const handleUpdateName = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    setNameLoading(true)
    try {
      const response = await profileApi.updateName(name.trim())
      const next = { ...(profile ?? user!), ...response.data.data }
      setProfile(next)
      setUser(next)
      toast.success('Name updated')
    } catch (error: unknown) {
      toast.error(getApiErrorData(error).message || 'We could not update your name.')
    } finally {
      setNameLoading(false)
    }
  }

  const handleUpdatePassword = async (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!pwForm.current_password) nextErrors.current_password = 'Enter your current password.'
    if (pwForm.new_password.length < 8) nextErrors.new_password = 'Use at least 8 characters.'
    setPwErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setPwLoading(true)
    try {
      await profileApi.updatePassword(pwForm.current_password, pwForm.new_password)
      clearAuth()
      toast.success('Password updated. Please sign in again.')
      navigate('/login', { replace: true })
    } catch (error: unknown) {
      const data = getApiErrorData(error)
      if (data.errors) setPwErrors(data.errors)
      else setPwErrors({ general: data.message || 'We could not update your password.' })
    } finally {
      setPwLoading(false)
    }
  }

  const sendCreatePasswordLink = async () => {
    if (!profile?.email) return
    setLinkLoading(true)
    try {
      const response = await authApi.forgotPassword(profile.email)
      toast.success(response.data.message, { duration: 6000 })
    } catch (error: unknown) {
      toast.error(getApiErrorData(error).message || 'We could not send the setup link.')
    } finally {
      setLinkLoading(false)
    }
  }

  const hasPassword = profile?.has_password ?? true
  const usesGoogle = profile?.auth_methods?.includes('google') ?? false

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-black text-dark">Profile</h1>
        <p className="mt-0.5 text-sm text-gray-neo">{user?.email}</p>
      </header>

      {profileError && <div className="mb-5 border-2 border-red-600 bg-red-50 p-4 text-sm font-bold" role="alert">{profileError}</div>}

      <div className="grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        <section className="card-neo" aria-labelledby="display-name-title">
          <h2 id="display-name-title" className="mb-4 text-lg font-black">Display name</h2>
          <form onSubmit={handleUpdateName} className="flex flex-col gap-4">
            <FormField id="profile-name" label="Name">
              <input id="profile-name" name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="input-neo" placeholder="Your name" />
            </FormField>
            <button type="submit" disabled={nameLoading} className="btn-dark disabled:cursor-not-allowed disabled:opacity-60">{nameLoading ? 'Saving…' : 'Save name'}</button>
          </form>
        </section>

        <section className="card-neo" aria-labelledby="sign-in-title">
          <div className="mb-4 flex items-start gap-3">
            <ShieldCheck size={25} strokeWidth={2.5} aria-hidden="true" />
            <div>
              <h2 id="sign-in-title" className="text-lg font-black">Sign-in methods</h2>
              <p className="mt-1 text-xs font-medium text-dark/60">Manage how you access this account.</p>
            </div>
          </div>

          {usesGoogle && <div className="mb-4 flex min-h-11 items-center justify-between gap-4 border-2 border-dark bg-bg-neo px-3 py-2 text-sm font-bold"><span>Google</span><span className="text-xs text-dark/55">Connected</span></div>}

          {hasPassword ? (
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
              <FormField id="current-password" label="Current password" error={pwErrors.current_password}>
                <input id="current-password" name="current_password" type="password" autoComplete="current-password" value={pwForm.current_password} onChange={(event) => { setPwForm((current) => ({ ...current, current_password: event.target.value })); setPwErrors((current) => ({ ...current, current_password: '', general: '' })) }} aria-invalid={Boolean(pwErrors.current_password)} aria-describedby={pwErrors.current_password ? 'current-password-error' : undefined} className={`input-neo ${pwErrors.current_password ? 'border-red-600' : ''}`} />
              </FormField>
              <FormField id="new-password" label="New password" error={pwErrors.new_password} hint="Use at least 8 characters.">
                <input id="new-password" name="new_password" type="password" autoComplete="new-password" value={pwForm.new_password} onChange={(event) => { setPwForm((current) => ({ ...current, new_password: event.target.value })); setPwErrors((current) => ({ ...current, new_password: '', general: '' })) }} aria-invalid={Boolean(pwErrors.new_password)} aria-describedby={pwErrors.new_password ? 'new-password-error' : 'new-password-hint'} className={`input-neo ${pwErrors.new_password ? 'border-red-600' : ''}`} />
              </FormField>
              {pwErrors.general && <p className="error-msg" role="alert">{pwErrors.general}</p>}
              <button type="submit" disabled={pwLoading} className="btn-dark disabled:cursor-not-allowed disabled:opacity-60">{pwLoading ? 'Saving…' : 'Update password'}</button>
            </form>
          ) : (
            <div>
              <div className="mb-4 border-2 border-dark bg-interview/35 p-4">
                <p className="font-black">No password yet</p>
                <p className="mt-1 text-sm font-medium text-dark/70">You currently sign in with Google. We can email you a secure link to create a password.</p>
              </div>
              <button type="button" onClick={() => void sendCreatePasswordLink()} disabled={linkLoading} className="btn-dark w-full disabled:cursor-not-allowed disabled:opacity-60"><KeyRound size={17} aria-hidden="true" />{linkLoading ? 'Sending…' : 'Email password setup link'}</button>
            </div>
          )}
        </section>
      </div>
    </>
  )
}

import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import JobbinLogo from '../components/ui/JobbinLogo'
import FormField from '../components/ui/FormField'
import { authApi } from '../api/auth'
import { getApiErrorData } from '../utils/apiError'
import { useAuthStore } from '../store/authStore'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const token = params.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!token) nextErrors.general = 'This reset link is incomplete. Request a new one.'
    if (password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    if (password !== confirmPassword) nextErrors.confirm = 'Passwords do not match.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      const response = await authApi.resetPassword(token, password)
      clearAuth()
      toast.success(response.data.message)
      navigate('/login', { replace: true })
    } catch (requestError: unknown) {
      const data = getApiErrorData(requestError)
      setErrors(data.errors ?? { general: data.message || 'This reset link could not be used.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex" aria-label="Jobbin home"><JobbinLogo /></Link>
        <section className="card-neo" aria-labelledby="reset-title">
          <h1 id="reset-title" className="text-2xl font-black">Create a new password</h1>
          <p className="mb-6 mt-1 text-sm text-gray-neo">Choose a password you haven’t used for this account.</p>
          <form onSubmit={submit} noValidate className="space-y-4">
            {errors.general && <p className="error-msg border-2 border-red-600 bg-red-50 p-3" role="alert">{errors.general}</p>}
            <FormField id="reset-password" label="New password" error={errors.password} hint="8–72 characters.">
              <input id="reset-password" type="password" autoComplete="new-password" value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: '', general: '' })) }} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'reset-password-error' : 'reset-password-hint'} className={`input-neo ${errors.password ? 'border-red-600' : ''}`} autoFocus />
            </FormField>
            <FormField id="reset-confirm" label="Confirm password" error={errors.confirm}>
              <input id="reset-confirm" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); setErrors((current) => ({ ...current, confirm: '' })) }} aria-invalid={Boolean(errors.confirm)} aria-describedby={errors.confirm ? 'reset-confirm-error' : undefined} className={`input-neo ${errors.confirm ? 'border-red-600' : ''}`} />
            </FormField>
            <button type="submit" disabled={loading} className="btn-dark w-full disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Saving…' : 'Save new password'}</button>
          </form>
        </section>
      </div>
    </main>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import JobbinLogo from '../components/ui/JobbinLogo'
import FormField from '../components/ui/FormField'
import { authApi } from '../api/auth'
import { getApiErrorData } from '../utils/apiError'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Enter your email address.')
      return
    }
    setLoading(true)
    try {
      const response = await authApi.forgotPassword(email.trim())
      setMessage(response.data.message)
    } catch (requestError: unknown) {
      setError(getApiErrorData(requestError).message || 'We could not send the reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex" aria-label="Jobbin home"><JobbinLogo /></Link>
        <section className="card-neo" aria-labelledby="forgot-title">
          {message ? (
            <div className="text-center" role="status">
              <MailCheck className="mx-auto mb-4" size={44} strokeWidth={2.5} aria-hidden="true" />
              <h1 id="forgot-title" className="text-2xl font-black">Check your inbox</h1>
              <p className="mt-3 text-sm font-medium text-gray-neo">{message}</p>
              <Link to="/login" className="btn-dark mt-6 w-full">Back to sign in</Link>
            </div>
          ) : (
            <>
              <h1 id="forgot-title" className="text-2xl font-black">Reset your password</h1>
              <p className="mb-6 mt-1 text-sm text-gray-neo">We’ll email a secure link if the address belongs to an account.</p>
              <form onSubmit={submit} noValidate className="space-y-4">
                <FormField id="forgot-email" label="Email" error={error}>
                  <input id="forgot-email" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} aria-invalid={Boolean(error)} aria-describedby={error ? 'forgot-email-error' : undefined} className={`input-neo ${error ? 'border-red-600' : ''}`} autoFocus />
                </FormField>
                <button type="submit" disabled={loading} className="btn-dark w-full disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Sending…' : 'Send reset link'}</button>
              </form>
              <Link to="/login" className="mt-5 block text-center text-sm font-bold underline decoration-2 underline-offset-4">Back to sign in</Link>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

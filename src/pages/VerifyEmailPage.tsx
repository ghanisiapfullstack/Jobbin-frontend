import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../api/auth'
import toast from 'react-hot-toast'

type Status = 'idle' | 'verifying' | 'success' | 'error'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const email = searchParams.get('email') || ''

  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'idle')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Auto-verify kalau ada token di URL
  useEffect(() => {
    if (!token) return
    authApi.verifyEmail(token)
      .then(() => {
        setStatus('success')
        toast.success('Email verified! Redirecting to login...')
        setTimeout(() => navigate('/login'), 2000)
      })
      .catch(() => {
        setStatus('error')
      })
  }, [token])

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return
    setResendLoading(true)
    try {
      await authApi.resendVerification(email)
      toast.success('Verification email sent!')
      // Cooldown 60 detik
      setResendCooldown(60)
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0 }
          return prev - 1
        })
      }, 1000)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal kirim ulang email.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-dark border-2 border-dark flex items-center justify-center">
            <span className="text-primary text-xl font-black">J</span>
          </div>
          <h1 className="text-2xl font-black text-dark">JOBBIN</h1>
        </div>

        <div className="card-neo">
          {/* Verifying state */}
          {status === 'verifying' && (
            <div className="text-center py-6">
              <div className="w-12 h-12 border-4 border-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-black mb-2">Verifying your email...</h2>
              <p className="text-sm text-gray-neo">Please wait a moment.</p>
            </div>
          )}

          {/* Success state */}
          {status === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-offer border-2 border-dark shadow-neo mx-auto mb-4 flex items-center justify-center text-3xl">
                ✓
              </div>
              <h2 className="text-xl font-black mb-2">Email verified!</h2>
              <p className="text-sm text-gray-neo">Redirecting to login...</p>
            </div>
          )}

          {/* Error state */}
          {status === 'error' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-rejected border-2 border-dark shadow-neo mx-auto mb-4 flex items-center justify-center text-3xl">
                ✕
              </div>
              <h2 className="text-xl font-black mb-2">Link invalid or expired</h2>
              <p className="text-sm text-gray-neo mb-6">
                This verification link is invalid or has expired.
              </p>
              {email && (
                <button
                  onClick={handleResend}
                  disabled={resendLoading || resendCooldown > 0}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : resendLoading
                    ? 'Sending...'
                    : 'Resend verification email'}
                </button>
              )}
            </div>
          )}

          {/* Idle state — user baru register, belum klik link */}
          {status === 'idle' && (
            <div>
              <div className="w-16 h-16 bg-primary border-2 border-dark shadow-neo mb-4 flex items-center justify-center text-3xl">
                ✉
              </div>
              <h2 className="text-2xl font-black mb-2">Check your email</h2>
              <p className="text-sm text-gray-neo mb-2">
                We sent a verification link to:
              </p>
              {email && (
                <p className="font-bold text-sm mb-6 break-all">{email}</p>
              )}
              <p className="text-sm text-gray-neo mb-6">
                Click the link in the email to verify your account. The link expires in 24 hours.
              </p>

              {email && (
                <button
                  onClick={handleResend}
                  disabled={resendLoading || resendCooldown > 0}
                  className="btn-outline w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : resendLoading
                    ? 'Sending...'
                    : "Didn't receive it? Resend"}
                </button>
              )}
            </div>
          )}

          <p className="text-sm text-center text-gray-neo mt-6">
            <Link to="/login" className="font-bold text-dark underline underline-offset-2">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

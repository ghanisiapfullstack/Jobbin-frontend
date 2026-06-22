import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { useRemindersStore } from '../store/remindersStore'
import toast from 'react-hot-toast'
import PasswordToggle from '../components/ui/PasswordToggle'

interface FormErrors {
  email?: string
  password?: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    const newErrors: FormErrors = {}
    if (!form.email.trim()) newErrors.email = 'Email wajib diisi'
    if (!form.password) newErrors.password = 'Password wajib diisi'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const res = await authApi.login(form)
      const { token, user } = res.data.data
      setAuth(token, user)
      toast.success(`Welcome back, ${user.name}!`)

      // Fetch reminders dan tampilkan popup kalau ada
      try {
        const remindersStore = useRemindersStore.getState()
        await remindersStore.fetchReminders()
        const { today, tomorrow } = useRemindersStore.getState()
        const total = today.length + tomorrow.length
        if (total > 0) {
          setTimeout(() => {
            toast(
              `⏰ You have ${total} reminder${total > 1 ? 's' : ''} ${
                today.length > 0 ? 'today' : 'tomorrow'
              }!`,
              {
                duration: 5000,
                icon: '🔔',
                style: {
                  border: '2px solid #1a1a1a',
                  boxShadow: '4px 4px 0px #1a1a1a',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  background: '#FFD600',
                },
              }
            )
          }, 1000)
        }
      } catch {
        // silent fail — reminder tidak kritis
      }

      navigate('/board')
    } catch (err: any) {
      const data = err.response?.data
      const status = err.response?.status

      if (status === 422 && data?.errors) {
        setErrors(data.errors)
      } else if (status === 403) {
        toast.error('Please verify your email first.')
        navigate(`/verify-email?email=${encodeURIComponent(form.email)}`)
      } else if (status === 429) {
        toast.error('Too many attempts. Please wait 1 minute.')
      } else {
        toast.error(data?.message || 'Invalid email or password.')
      }
    } finally {
      setLoading(false)
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
          <h2 className="text-2xl font-black text-dark mb-1">Welcome back</h2>
          <p className="text-sm text-gray-neo mb-6">Sign in to your account.</p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label-neo">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                className={`input-neo ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="error-msg">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label-neo">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                  className={`input-neo pr-12 ${errors.password ? 'border-red-500' : ''}`}
                />
                <PasswordToggle show={showPassword} onClick={() => setShowPassword(!showPassword)} />
              </div>
              {errors.password && <p className="error-msg">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-dark w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-neo mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-dark underline underline-offset-2">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

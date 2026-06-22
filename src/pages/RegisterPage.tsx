import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import toast from 'react-hot-toast'
import PasswordToggle from '../components/ui/PasswordToggle'

interface FormErrors {
  name?: string
  email?: string
  password?: string
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
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
    if (!form.name.trim()) newErrors.name = 'Full name wajib diisi'
    if (!form.email.trim()) newErrors.email = 'Email wajib diisi'
    if (!form.password) newErrors.password = 'Password wajib diisi'
    else if (form.password.length < 6) newErrors.password = 'Password minimal 6 karakter'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})
    try {
      await authApi.register(form)
      toast.success('Registrasi berhasil! Cek email untuk verifikasi.')
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`)
    } catch (err: any) {
      const data = err.response?.data
      if (data?.errors) {
        setErrors(data.errors)
      } else {
        toast.error(data?.message || 'Terjadi kesalahan. Coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }

  const passwordLength = form.password.length
  const passwordStrength = passwordLength === 0 ? null : passwordLength < 6 ? 'weak' : passwordLength < 10 ? 'medium' : 'strong'

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
          <h2 className="text-2xl font-black text-dark mb-1">Create account</h2>
          <p className="text-sm text-gray-neo mb-6">Start tracking your applications today.</p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="label-neo">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className={`input-neo ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="error-msg">{errors.name}</p>}
            </div>

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
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className={`input-neo pr-12 ${errors.password ? 'border-red-500' : ''}`}
                />
                <PasswordToggle show={showPassword} onClick={() => setShowPassword(!showPassword)} />
              </div>

              {/* Password strength indicator */}
              {passwordLength > 0 && (
                <div className="mt-1.5">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 border border-dark/20 ${
                          passwordStrength === 'weak' && i === 1 ? 'bg-rejected' :
                          passwordStrength === 'medium' && i <= 2 ? 'bg-interview' :
                          passwordStrength === 'strong' ? 'bg-offer' :
                          'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-semibold ${
                    passwordStrength === 'weak' ? 'text-red-500' :
                    passwordStrength === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {passwordStrength === 'weak' ? `Too short — ${6 - passwordLength} more character${6 - passwordLength > 1 ? 's' : ''} needed` :
                     passwordStrength === 'medium' ? 'Good password' :
                     'Strong password ✓'}
                  </p>
                </div>
              )}
              {errors.password && <p className="error-msg">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-dark w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-neo mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-dark underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

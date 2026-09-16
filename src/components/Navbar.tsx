import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/auth'
import toast from 'react-hot-toast'
import ReminderBell from './ReminderBell'
import JobbinLogo from './ui/JobbinLogo'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/board', label: 'Board' },
  { to: '/archived', label: 'Archived' },
  { to: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      clearAuth()
      navigate('/login')
      toast.success('Logged out.')
    }
  }

  return (
    <header className="bg-primary border-b-3 border-dark sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/board" className="shrink-0" aria-label="Jobbin board">
          <JobbinLogo size="sm" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 text-sm font-bold border-2 transition-all ${
                location.pathname === to
                  ? 'border-dark bg-dark text-primary shadow-neo-sm'
                  : 'border-transparent text-dark hover:border-dark'
              }`}
            >
              {to === '/profile' ? (user?.name?.split(' ')[0] || label) : label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ReminderBell />
          <button
            onClick={handleLogout}
            className="hidden md:inline-flex btn-outline text-xs px-3 py-1.5"
          >
            Logout
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden icon-button shadow-neo-sm"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t-2 border-dark bg-primary">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-bold border-b border-dark/20 ${
                location.pathname === to ? 'bg-dark text-primary' : 'text-dark hover:bg-dark/10'
              }`}
            >
              {to === '/profile' ? (user?.name?.split(' ')[0] || label) : label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm font-bold text-dark hover:bg-dark/10"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  )
}

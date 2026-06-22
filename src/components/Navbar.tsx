import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/auth'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

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
        <Link to="/board" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-dark flex items-center justify-center border-2 border-dark">
            <span className="text-primary text-sm font-black">J</span>
          </div>
          <span className="text-lg font-black text-dark tracking-tight">JOBBIN</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            to="/board"
            className={`px-3 py-1.5 text-sm font-bold border-2 transition-all ${
              location.pathname === '/board'
                ? 'border-dark bg-dark text-primary shadow-neo-sm'
                : 'border-transparent text-dark hover:border-dark'
            }`}
          >
            Board
          </Link>
          <Link
            to="/archived"
            className={`px-3 py-1.5 text-sm font-bold border-2 transition-all ${
              location.pathname === '/archived'
                ? 'border-dark bg-dark text-primary shadow-neo-sm'
                : 'border-transparent text-dark hover:border-dark'
            }`}
          >
            Archived
          </Link>
          <Link
            to="/profile"
            className={`px-3 py-1.5 text-sm font-bold border-2 transition-all ${
              location.pathname === '/profile'
                ? 'border-dark bg-dark text-primary shadow-neo-sm'
                : 'border-transparent text-dark hover:border-dark'
            }`}
          >
            {user?.name?.split(' ')[0] || 'Profile'}
          </Link>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="btn-outline text-xs px-3 py-1.5"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

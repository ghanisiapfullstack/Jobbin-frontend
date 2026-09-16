import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import SplashScreen from '../pages/SplashScreen'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const initialized = useAuthStore((s) => s.initialized)
  if (!initialized) return <SplashScreen compact />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

export function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const initialized = useAuthStore((s) => s.initialized)
  if (!initialized) return <SplashScreen compact />
  if (isAuthenticated) return <Navigate to="/board" replace />
  return <Outlet />
}

import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { ProtectedRoute, GuestRoute } from './components/RouteGuard'
import AppLayout from './components/AppLayout'
import SplashScreen from './pages/SplashScreen'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import LoginPage from './pages/LoginPage'
import BoardPage from './pages/BoardPage'
import ArchivedPage from './pages/ArchivedPage'
import ProfilePage from './pages/ProfilePage'

// ── Page transition wrapper ─────────────────────────────────
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

// ── Animated routes — perlu useLocation di dalam BrowserRouter ──
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />

        {/* Guest only */}
        <Route element={<GuestRoute />}>
          <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/verify-email" element={<PageTransition><VerifyEmailPage /></PageTransition>} />
        </Route>

        {/* Protected — dengan layout navbar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/board" element={<PageTransition><BoardPage /></PageTransition>} />
            <Route path="/archived" element={<PageTransition><ArchivedPage /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
          </Route>
        </Route>

        {/* Default */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

// ── Main App ────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <SplashScreen />

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            border: '2px solid #1a1a1a',
            boxShadow: '4px 4px 0px #1a1a1a',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
          },
        }}
      />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ProtectedRoute, GuestRoute } from './components/RouteGuard'
import AppLayout from './components/AppLayout'
import SplashScreen from './pages/SplashScreen'
import { useAuthStore } from './store/authStore'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const BoardPage = lazy(() => import('./pages/BoardPage'))
const ArchivedPage = lazy(() => import('./pages/ArchivedPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))

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
        <Route path="/reset-password" element={<PageTransition><ResetPasswordPage /></PageTransition>} />

        {/* Guest only */}
        <Route element={<GuestRoute />}>
          <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/verify-email" element={<PageTransition><VerifyEmailPage /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
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
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    void initialize()
  }, [initialize])

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
      <MotionConfig reducedMotion="user">
        <Suspense fallback={<SplashScreen compact />}>
          <AnimatedRoutes />
        </Suspense>
      </MotionConfig>
    </BrowserRouter>
  )
}

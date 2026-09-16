import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'

export default function AppLayout() {
  const location = useLocation()
  const isBoard = location.pathname === '/board'

  return (
    <div className="min-h-screen bg-bg-neo">
      <Navbar />
      <main className={isBoard ? 'w-full px-4 lg:px-6 py-6' : 'max-w-screen-xl mx-auto px-4 py-6'}>
        <Outlet />
      </main>
    </div>
  )
}

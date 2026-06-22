import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-bg-neo">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

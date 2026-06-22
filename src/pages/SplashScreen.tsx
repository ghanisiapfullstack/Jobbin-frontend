import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center gap-8">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 bg-dark border-3 border-dark shadow-neo-lg flex items-center justify-center">
          <span className="text-primary text-4xl font-black">J</span>
        </div>
        <h1 className="text-5xl font-black text-dark tracking-tight">JOBBIN</h1>
        <p className="text-dark/70 font-semibold text-sm">Track your job applications</p>
      </div>

      {/* Progress bar */}
      <div className="w-64">
        <div className="w-full h-4 bg-white border-2 border-dark shadow-neo-sm overflow-hidden">
          <div
            className="h-full bg-dark transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-xs font-bold text-dark/60 mt-2">{progress}%</p>
      </div>
    </div>
  )
}

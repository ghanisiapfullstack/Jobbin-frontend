import JobbinLogo from '../components/ui/JobbinLogo'

interface SplashScreenProps {
  compact?: boolean
}

export default function SplashScreen({ compact = false }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-primary flex flex-col items-center justify-center gap-7" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <JobbinLogo size={compact ? 'md' : 'lg'} />
        {!compact && <p className="text-dark/70 font-semibold text-sm">Track your job applications</p>}
      </div>

      <div className="w-56" aria-hidden="true">
        <div className="w-full h-4 bg-white border-2 border-dark shadow-neo-sm overflow-hidden">
          <div className="h-full w-1/2 bg-dark animate-pulse" />
        </div>
      </div>
      <span className="sr-only">Loading Jobbin</span>
    </div>
  )
}

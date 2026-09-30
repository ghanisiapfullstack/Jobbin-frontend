import { Coffee } from 'lucide-react'

/**
 * Friendly notice shown when a request is slow, typically the first request
 * after the free-tier backend has scaled to zero and needs to wake up.
 * Non-blocking and auto-resolves once data arrives — the user does not need
 * to refresh manually.
 */
export default function WakingUpNotice({ className = '' }: { className?: string }) {
  return (
    <div
      className={`mx-auto flex max-w-sm items-start gap-3 border-2 border-dark bg-white p-4 shadow-neo ${className}`}
      role="status"
      aria-live="polite"
    >
      <Coffee size={20} strokeWidth={2.6} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div>
        <p className="text-sm font-black leading-tight">Menyalakan server...</p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-dark/65">
          Server gratisan lagi bangun tidur 😴. Tunggu sebentar yaw, halaman akan
          muncul sendiri kok tanpa perlu di-refresh.
        </p>
      </div>
    </div>
  )
}

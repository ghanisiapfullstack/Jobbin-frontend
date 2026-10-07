import { useEffect, useState } from 'react'
import { Joyride, STATUS, type EventData, type Step } from 'react-joyride'
import { CalendarDays, LayoutGrid, MousePointerClick, PlusSquare, Sparkles } from 'lucide-react'
import TourTooltip from './TourTooltip'

const TOUR_DONE_KEY = 'jobbin_tour_done'

// Six-step first-run tour (Option 2). Text intentionally avoids em dashes and
// emoji. Steps point at real board elements via the data-tour anchors.
const STEPS: Step[] = [
  {
    target: 'body',
    placement: 'center',
    title: 'Selamat datang di Jobbin',
    content: 'Jobbin adalah papan untuk melacak semua lamaran kerjamu dalam satu tempat. Ikuti panduan singkat ini untuk mulai.',
    data: { icon: Sparkles, hero: true },
  },
  {
    target: '[data-tour="add-application"]',
    title: 'Tambah lamaran',
    content: 'Klik tombol Add application untuk menambahkan lamaran baru, lengkap dengan posisi, perusahaan, dan catatan.',
    data: { icon: PlusSquare },
  },
  {
    target: '[data-tour="board-columns"]',
    title: 'Lima kolom status',
    content: 'Lamaranmu tersusun dalam lima kolom status, mulai dari Wishlist, Applied, Interview, Offer, sampai Rejected.',
    data: { icon: LayoutGrid },
  },
  {
    target: '[data-tour="board-columns"]',
    title: 'Geser untuk ubah status',
    content: 'Seret kartu dari satu kolom ke kolom lain untuk memperbarui status lamaran saat ada perkembangan.',
    data: { icon: MousePointerClick },
  },
  {
    target: '[data-tour="calendar"]',
    title: 'Kalender interview',
    content: 'Kalender di atas papan menampilkan jadwal reminder dan interview supaya kamu tidak melewatkan tenggat penting.',
    data: { icon: CalendarDays },
  },
  {
    target: 'body',
    placement: 'center',
    title: 'Siap mulai',
    content: 'Kamu siap. Mulai dengan menambahkan lamaran pertamamu melalui tombol Add application.',
    data: { icon: Sparkles, hero: true },
  },
]

interface BoardTourProps {
  // When incremented, the tour runs regardless of the localStorage flag
  // (manual replay from the Tutorial button).
  runSignal: number
}

export default function BoardTour({ runSignal }: BoardTourProps) {
  const [run, setRun] = useState(false)

  // Auto-start on first visit; manual replay when runSignal increments.
  useEffect(() => {
    const done = localStorage.getItem(TOUR_DONE_KEY) === 'true'
    const shouldRun = runSignal > 0 || !done
    if (!shouldRun) return
    // Defer the state update so we never call setState during the effect body.
    const timer = window.setTimeout(() => setRun(true), 0)
    return () => window.clearTimeout(timer)
  }, [runSignal])

  const handleEvent = (data: EventData) => {
    const finished = ([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(data.status)
    if (finished) {
      setRun(false)
      localStorage.setItem(TOUR_DONE_KEY, 'true')
    }
  }

  return (
    <Joyride
      steps={STEPS}
      run={run}
      continuous
      onEvent={handleEvent}
      tooltipComponent={TourTooltip}
      locale={{ back: 'Kembali', close: 'Tutup', last: 'Selesai', next: 'Lanjut', skip: 'Lewati' }}
      options={{
        buttons: ['skip', 'back', 'primary'],
        closeButtonAction: 'skip',
        overlayColor: 'rgba(26, 26, 26, 0.6)',
        spotlightRadius: 0,
        zIndex: 10000,
      }}
    />
  )
}

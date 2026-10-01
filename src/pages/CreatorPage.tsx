import { Link } from 'react-router-dom'
import { ArrowLeft, Coffee, ExternalLink } from 'lucide-react'
import JobbinLogo from '../components/ui/JobbinLogo'
import { useAuthStore } from '../store/authStore'

const SAWERIA_URL = 'https://saweria.co/ghanifabihaziq'

export default function CreatorPage() {
  const user = useAuthStore((state) => state.user)
  // Return to the board when signed in, otherwise to the public landing page.
  const backTo = user ? '/board' : '/'
  const backLabel = user ? 'Kembali ke board' : 'Kembali ke beranda'

  return (
    <div className="min-h-screen bg-bg-neo text-dark">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b-3 border-dark bg-primary">
        <div className="mx-auto flex h-14 max-w-screen-md items-center justify-between px-4">
          <Link to={backTo} className="shrink-0" aria-label={backLabel}>
            <JobbinLogo size="sm" />
          </Link>
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 border-2 border-dark bg-white px-3 py-1.5 text-xs font-black shadow-neo-sm transition-transform hover:-translate-y-0.5"
          >
            <ArrowLeft size={15} strokeWidth={3} aria-hidden="true" /> Kembali
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-screen-md px-4 py-10">
        <h1 className="mb-8 text-3xl font-black sm:text-4xl">Tentang Developer</h1>

        {/* Profile card */}
        <section className="mb-6 border-2 border-dark bg-white p-6 shadow-neo-lg sm:flex sm:items-center sm:gap-6">
          <img
            src="/creator.jpg"
            alt="Muhammad Ghani Fabihaziq"
            className="mx-auto mb-4 h-40 w-40 shrink-0 border-2 border-dark object-cover shadow-neo sm:mx-0 sm:mb-0"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-black leading-tight">Muhammad Ghani Fabihaziq</h2>
            <span className="mt-2 inline-block border-2 border-dark bg-primary px-3 py-1 text-sm font-black shadow-neo-sm">
              Creator of Jobbin
            </span>
          </div>
        </section>

        {/* Story */}
        <section className="mb-6 border-2 border-dark bg-white p-6 shadow-neo">
          <h3 className="mb-3 text-lg font-black">Kenapa Jobbin dibuat?</h3>
          <p className="text-sm font-medium leading-relaxed text-dark/80">
            Jobbin awalnya dari pengalamanku sendiri. Waktu iseng melamar magang dan
            kerja ke banyak tempat, harus melacak setiap lamaran satu per satu.
            Ada yang dicatat di spreadsheet, ada yang di notes, berceceran di mana-mana.
            Lama-lama ribet dan lupa sudah apply ke mana, statusnya apa, dan kapan harus
            follow-up. Karena shibal moments itulah saya buat Jobbin, satu tempat rapi untuk
            melacak semua lamaran, lengkap dengan reminder biar tidak ada yang kelewat.
          </p>
        </section>

        {/* Support card */}
        <section className="border-2 border-dark bg-white p-6 shadow-neo-lg">
          <h3 className="mb-2 text-lg font-black">Dukung Jobbin ☕</h3>
          <p className="mb-5 text-sm font-medium leading-relaxed text-dark/80">
            Jobbin gratis dan dikembangkan sendirian selama beta phase. Kalau Jobbin membantu
            perjalanan mencari kerjamu, kamu boleh traktir aku kopi yagesya lewat Saweria.
            Dukunganmu bantu Jobbin tetap hidup dan berkembang anjayy. 🙏
          </p>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <img
              src="/Saweria-qr.png"
              alt="QR code Saweria untuk mendukung Jobbin"
              className="h-44 w-44 shrink-0 border-2 border-dark bg-white p-1 shadow-neo"
            />
            <div className="flex-1 text-center sm:text-left">
              <p className="mb-3 text-xs font-bold text-dark/60">
                Scan QR di atas, atau klik tombol di bawah:
              </p>
              <a
                href={SAWERIA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-dark bg-primary px-5 py-3 text-sm font-black shadow-neo transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <Coffee size={17} strokeWidth={2.7} aria-hidden="true" /> Dukung via Saweria
                <ExternalLink size={14} strokeWidth={2.7} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

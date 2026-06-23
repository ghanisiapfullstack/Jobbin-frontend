import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-primary font-space">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-primary border-b-3 border-dark">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-dark border-2 border-dark flex items-center justify-center">
              <span className="text-primary text-sm font-black">J</span>
            </div>
            <span className="text-lg font-black text-dark tracking-tight">JOBBIN</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-outline text-sm px-4 py-1.5">
              Sign in
            </Link>
            <Link to="/register" className="btn-dark text-sm px-4 py-1.5">
              Get started →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-dark text-primary text-xs font-black px-3 py-1.5 border-2 border-dark shadow-neo-sm mb-6">
            🎯 FREE JOB APPLICATION TRACKER
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-black text-dark leading-tight tracking-tight mb-6">
            Stop losing track.<br />
            <span className="bg-dark text-primary px-2">Start getting hired.</span>
          </h1>

          <p className="text-lg text-dark/70 font-medium mb-8 max-w-lg">
            Track every job application in one visual board. Get reminded before deadlines. Never miss a follow-up again.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="btn-dark text-base px-6 py-3">
              Start for free →
            </Link>
            <Link to="/login" className="btn-outline text-base px-6 py-3">
              Sign in
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-6 text-sm text-dark/50 font-medium">
            ✓ No credit card required &nbsp;·&nbsp; ✓ Free forever
          </p>
        </div>

        {/* Board mockup */}
        <div className="mt-16 border-3 border-dark shadow-neo-lg bg-white p-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {[
              { label: 'Wishlist', color: 'bg-blue-100', count: 3, cards: ['Frontend Dev — Google', 'Product Manager — Shopee'] },
              { label: 'Applied', color: 'bg-green-100', count: 4, cards: ['Backend Dev — Tokopedia', 'Software Eng — Gojek'] },
              { label: 'Interview', color: 'bg-yellow-100', count: 2, cards: ['Full Stack — Grab'] },
              { label: 'Offer', color: 'bg-emerald-100', count: 1, cards: ['iOS Dev — Traveloka'] },
              { label: 'Rejected', color: 'bg-red-100', count: 2, cards: [] },
            ].map((col) => (
              <div key={col.label} className="w-52 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-black px-2 py-1 border border-dark ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-black text-dark/40">{col.count}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {col.cards.map((card) => (
                    <div key={card} className="bg-white border-2 border-dark p-3 shadow-neo-sm">
                      <p className="text-xs font-bold text-dark leading-snug">{card.split(' — ')[0]}</p>
                      <p className="text-xs text-dark/50 mt-0.5">{card.split(' — ')[1]}</p>
                    </div>
                  ))}
                  {col.cards.length === 0 && (
                    <div className="border-2 border-dashed border-dark/20 p-3 text-center">
                      <p className="text-xs text-dark/30 font-medium">Collapsed</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section className="bg-dark py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black text-primary/60 tracking-widest uppercase">Features</span>
            <h2 className="text-3xl sm:text-4xl font-black text-primary mt-2">
              Everything you need to<br />land your next job.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Visual Kanban Board',
                desc: 'See all your applications at a glance. Drag & drop between Wishlist, Applied, Interview, Offer, and Rejected.',
              },
              {
                icon: '⏰',
                title: 'Smart Reminders',
                desc: 'Get email reminders the day before and on the day of your deadline. Never miss a follow-up again.',
              },
              {
                icon: '📁',
                title: 'Archive & Organize',
                desc: 'Keep your board clean by archiving old applications. Restore anytime. Filter by status.',
              },
            ].map((f) => (
              <div key={f.title} className="bg-primary border-3 border-primary/20 p-6 shadow-neo-lg">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-black text-dark mb-2">{f.title}</h3>
                <p className="text-sm text-dark/70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black text-dark/40 tracking-widest uppercase">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-black text-dark mt-2">
              Up and running in 3 steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up for free. No credit card required.' },
              { step: '02', title: 'Add your applications', desc: 'Add jobs you\'ve applied to or plan to apply. Set reminders for follow-ups.' },
              { step: '03', title: 'Track your progress', desc: 'Move cards across columns as you progress. Get email reminders on time.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 bg-primary border-3 border-dark shadow-neo-sm flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-black text-dark">{s.step}</span>
                </div>
                <h3 className="text-lg font-black text-dark mb-2">{s.title}</h3>
                <p className="text-sm text-dark/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-20 bg-primary border-y-3 border-dark">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-dark mb-4">
            Ready to get hired?
          </h2>
          <p className="text-lg text-dark/60 font-medium mb-8">
            Join job seekers who use Jobbin to stay organized and land their dream job.
          </p>
          <Link to="/register" className="btn-dark text-lg px-8 py-4 inline-block">
            Start for free →
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-dark py-8">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary border-2 border-primary flex items-center justify-center">
              <span className="text-dark text-xs font-black">J</span>
            </div>
            <span className="text-sm font-black text-primary">JOBBIN</span>
          </div>
          <p className="text-xs text-primary/40 font-medium">
            © {new Date().getFullYear()} Jobbin. Built with ☕ and determination.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="text-xs text-primary/60 font-bold hover:text-primary transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="text-xs text-primary/60 font-bold hover:text-primary transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

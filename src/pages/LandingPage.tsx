import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { LayoutDashboard, BellRing, Archive, ArrowRight, Check, MoveRight } from 'lucide-react'

// ── Animation variants ──────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.12, ease: 'easeOut' },
  }),
}

// ── Board mockup data ───────────────────────────────────────
const COLUMNS = [
  {
    label: 'Wishlist',
    color: 'bg-[#E3F2FD]',
    cards: [
      { title: 'Frontend Engineer', company: 'Google', tag: null },
      { title: 'Product Manager', company: 'Shopee', tag: null },
    ],
  },
  {
    label: 'Applied',
    color: 'bg-[#E8F5E9]',
    cards: [
      { title: 'Backend Engineer', company: 'Tokopedia', tag: null },
      { title: 'Software Engineer', company: 'Gojek', tag: 'TOMORROW' },
    ],
  },
  {
    label: 'Interview',
    color: 'bg-[#FFF9C4]',
    cards: [
      { title: 'Full Stack Dev', company: 'Grab', tag: 'TODAY' },
    ],
  },
  {
    label: 'Offer',
    color: 'bg-[#E8F5E9]',
    cards: [
      { title: 'iOS Developer', company: 'Traveloka', tag: null },
    ],
  },
  {
    label: 'Rejected',
    color: 'bg-[#FFEBEE]',
    cards: [],
  },
]

const FEATURES = [
  {
    icon: <LayoutDashboard size={24} strokeWidth={2.5} />,
    title: 'Visual Kanban Board',
    desc: 'See all your applications at a glance. Drag & drop between stages — Wishlist, Applied, Interview, Offer, and Rejected.',
  },
  {
    icon: <BellRing size={24} strokeWidth={2.5} />,
    title: 'Smart Reminders',
    desc: 'Get email reminders the day before and on the day of your deadline. Never miss a follow-up again.',
  },
  {
    icon: <Archive size={24} strokeWidth={2.5} />,
    title: 'Archive & Organize',
    desc: 'Keep your board clean by archiving old applications. Restore anytime. Filter by status.',
  },
]

const STEPS = [
  { step: '01', title: 'Create your account', desc: 'Sign up for free in seconds. No credit card required.' },
  { step: '02', title: 'Add your applications', desc: 'Add jobs you have applied to or plan to apply. Set reminders for follow-ups.' },
  { step: '03', title: 'Track your progress', desc: 'Move cards across columns as you progress. Get email reminders on time.' },
]

// ── Component ───────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-40 bg-primary border-b-3 border-dark"
      >
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
            <Link to="/register" className="btn-dark text-sm px-4 py-1.5 flex items-center gap-1.5">
              Get started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-2xl">

          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 bg-dark text-primary text-xs font-black px-3 py-1.5 border-2 border-dark shadow-neo-sm mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            FREE JOB APPLICATION TRACKER
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl sm:text-6xl font-black text-dark leading-tight tracking-tight mb-6"
          >
            Stop losing track.<br />
            <span className="bg-dark text-primary px-2 inline-block mt-1">
              Start getting hired.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg text-dark/70 font-medium mb-8 max-w-lg leading-relaxed"
          >
            Track every job application in one visual board. Get reminded before deadlines. Never miss a follow-up again.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-wrap gap-3"
          >
            <Link to="/register" className="btn-dark text-base px-6 py-3 flex items-center gap-2">
              Start for free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-outline text-base px-6 py-3">
              Sign in
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-6 flex items-center gap-4 flex-wrap"
          >
            {['No credit card required', 'Free forever', 'Setup in 60 seconds'].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-dark/50 font-medium">
                <Check size={13} strokeWidth={3} className="text-dark/40" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Board mockup */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mt-16 border-3 border-dark shadow-neo-lg bg-white p-6 overflow-x-auto"
        >
          {/* Fake browser bar */}
          <div className="flex items-center gap-1.5 mb-5 pb-4 border-b border-dark/10">
            <div className="w-3 h-3 rounded-full bg-rejected border border-dark/20" />
            <div className="w-3 h-3 rounded-full bg-interview border border-dark/20" />
            <div className="w-3 h-3 rounded-full bg-offer border border-dark/20" />
            <div className="ml-3 flex-1 bg-dark/5 border border-dark/10 rounded px-3 py-1 max-w-xs">
              <span className="text-xs text-dark/30 font-medium">www.jobbin.site/board</span>
            </div>
          </div>

          <div className="flex gap-4 min-w-max">
            {COLUMNS.map((col, ci) => (
              <motion.div
                key={col.label}
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                custom={ci}
                className="w-48 shrink-0"
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-black px-2 py-1 border border-dark/30 ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-bold text-dark/30">{col.cards.length}</span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {col.cards.map((card) => (
                    <div key={card.title} className="bg-white border-2 border-dark p-3 shadow-neo-sm hover:shadow-neo transition-all">
                      <p className="text-xs font-bold text-dark leading-snug">{card.title}</p>
                      <p className="text-xs text-dark/50 mt-0.5 font-medium">{card.company}</p>
                      {card.tag && (
                        <span className={`mt-1.5 inline-block text-[10px] font-black px-1.5 py-0.5 border border-dark/30 ${card.tag === 'TODAY' ? 'bg-rejected text-dark' : 'bg-interview text-dark'}`}>
                          {card.tag === 'TODAY' ? '⏰ TODAY' : '⏰ TOMORROW'}
                        </span>
                      )}
                    </div>
                  ))}
                  {col.cards.length === 0 && (
                    <div className="border-2 border-dashed border-dark/15 p-4 text-center">
                      <p className="text-xs text-dark/25 font-medium">Collapsed</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section className="bg-dark py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-black text-primary/40 tracking-widest uppercase">Features</span>
            <h2 className="text-3xl sm:text-4xl font-black text-primary mt-2 leading-tight">
              Everything you need to<br />land your next job.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-primary border-3 border-primary/0 p-7 shadow-neo-lg cursor-default"
              >
                <div className="w-11 h-11 bg-dark border-2 border-dark flex items-center justify-center text-primary mb-5 shadow-neo-sm">
                  {f.icon}
                </div>
                <h3 className="text-xl font-black text-dark mb-2">{f.title}</h3>
                <p className="text-sm text-dark/65 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-black text-dark/30 tracking-widest uppercase">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-black text-dark mt-2">
              Up and running in 3 steps.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-3xl mx-auto relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-7 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-0.5 bg-dark/10" />

            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center relative"
              >
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.4 } }}
                  className="w-14 h-14 bg-primary border-3 border-dark shadow-neo-sm flex items-center justify-center mx-auto mb-5"
                >
                  <span className="text-lg font-black text-dark">{s.step}</span>
                </motion.div>
                <h3 className="text-lg font-black text-dark mb-2">{s.title}</h3>
                <p className="text-sm text-dark/55 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-24 bg-primary border-y-3 border-dark">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-screen-xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-dark mb-4 leading-tight">
            Ready to get hired?
          </h2>
          <p className="text-lg text-dark/55 font-medium mb-10 max-w-md mx-auto">
            Join job seekers who use Jobbin to stay organized and land their dream job.
          </p>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link to="/register" className="btn-dark text-lg px-8 py-4 flex items-center gap-2 inline-flex">
              Start for free <MoveRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
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
          <p className="text-xs text-primary/30 font-medium">
            © {new Date().getFullYear()} Jobbin. Built with focus and determination.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="text-xs text-primary/50 font-bold hover:text-primary transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="text-xs text-primary/50 font-bold hover:text-primary transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

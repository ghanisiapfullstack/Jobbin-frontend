// Google Analytics (GA4) integration.
// Loads gtag.js only when VITE_GA_ID is set and the app runs in production,
// so local/dev traffic never pollutes analytics data.

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined
const ENABLED = Boolean(GA_ID) && import.meta.env.PROD

type GtagFn = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: GtagFn
  }
}

let initialized = false

/** Inject the gtag.js script and configure the GA4 property. Safe to call once. */
export function initAnalytics(): void {
  if (!ENABLED || initialized || typeof window === 'undefined') return
  initialized = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  // Disable automatic page_view; we send them manually on SPA route changes.
  window.gtag('config', GA_ID, { send_page_view: false })
}

/** Record a page view for the given SPA path. */
export function trackPageView(path: string): void {
  if (!ENABLED || !window.gtag) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

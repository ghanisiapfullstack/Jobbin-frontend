import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'jobbin_theme'

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Apply/remove the dark class on <html>. Used only inside the app area so the
 *  landing and auth pages always stay light. */
function setDarkClass(enabled: boolean) {
  document.documentElement.classList.toggle('dark', enabled)
}

/**
 * Theme state for the app area. Reads/writes the preference in localStorage and
 * applies the `dark` class while mounted, then clears it on unmount so pages
 * outside the app area (landing, auth) always render light.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)

  // Apply while mounted; clear on unmount (leaving the app area).
  useEffect(() => {
    setDarkClass(theme === 'dark')
    return () => setDarkClass(false)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return { theme, toggleTheme }
}

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

interface ThemeToggleProps {
  className?: string
}

/**
 * Sun/Moon toggle for light/dark mode, styled to match the neobrutalism UI.
 * Shows the icon for the mode you would switch TO.
 */
export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-9 w-9 items-center justify-center border-2 border-dark bg-white text-dark shadow-neo-sm transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun size={17} strokeWidth={2.8} aria-hidden="true" /> : <Moon size={17} strokeWidth={2.8} aria-hidden="true" />}
    </button>
  )
}

import { create } from 'zustand'
import type { User } from '../api/auth'
import { authApi } from '../api/auth'
import { getAccessToken, setAccessToken } from '../api/token'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  initialized: boolean
  initialize: () => Promise<void>
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  setUser: (user: User) => void
}

let initializationRequest: Promise<void> | null = null

export const useAuthStore = create<AuthState>((set, get) => ({
  token: getAccessToken(),
  user: (() => {
    try {
      const u = localStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch {
      return null
    }
  })(),
  isAuthenticated: false,
  initialized: false,

  initialize: () => {
    if (get().initialized) return Promise.resolve()
    if (initializationRequest) return initializationRequest

    initializationRequest = (async () => {
      try {
        if (getAccessToken()) {
          const response = await authApi.me()
          setAccessToken(getAccessToken())
          set({ token: getAccessToken(), user: response.data.data, isAuthenticated: true, initialized: true })
          localStorage.removeItem('user')
          return
        }

        const response = await authApi.refresh()
        const { token, user } = response.data.data
        setAccessToken(token)
        localStorage.removeItem('user')
        set({ token, user, isAuthenticated: true, initialized: true })
      } catch {
        setAccessToken(null)
        localStorage.removeItem('user')
        set({ token: null, user: null, isAuthenticated: false, initialized: true })
      }
    })().finally(() => {
      initializationRequest = null
    })

    return initializationRequest
  },

  setAuth: (token, user) => {
    setAccessToken(token)
    localStorage.removeItem('user')
    set({ token, user, isAuthenticated: true })
  },

  clearAuth: () => {
    setAccessToken(null)
    localStorage.removeItem('user')
    set({ token: null, user: null, isAuthenticated: false })
  },

  setUser: (user) => {
    set({ user })
  },
}))

import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, setAccessToken } from './token'

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface RefreshResponse {
  data: {
    token: string
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor — inject token
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle 401
let refreshRequest: Promise<string> | null = null

function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = axios
      .post<RefreshResponse>(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true })
      .then((response) => {
        const token = response.data.data.token
        setAccessToken(token)
        return token
      })
      .finally(() => {
        refreshRequest = null
      })
  }
  return refreshRequest
}

// Retry one protected request after rotating the HttpOnly refresh session.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequest | undefined
    const path = request?.url ?? ''
    const isAuthAttempt = ['/auth/login', '/auth/google', '/auth/refresh'].some((endpoint) => path.includes(endpoint))

    if (error.response?.status === 401 && request && !request._retry && !isAuthAttempt) {
      request._retry = true
      try {
        const token = await refreshAccessToken()
        request.headers.Authorization = `Bearer ${token}`
        return api(request)
      } catch {
        setAccessToken(null)
        localStorage.removeItem('user')
        if (window.location.pathname !== '/login') window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

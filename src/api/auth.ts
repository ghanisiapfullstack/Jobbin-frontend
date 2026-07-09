import api from './axios'

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
  avatar?: string | null
  email_verified_at: string | null
  created_at: string
}

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post('/auth/register', data),
  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),
  resendVerification: (email: string) =>
    api.post('/auth/resend-verification', { email }),
  login: (data: LoginPayload) =>
    api.post<{ message: string; data: { token: string; user: User } }>('/auth/login', data),
  googleAuth: (credential: string) =>
    api.post<{ message: string; data: { token: string; user: User } }>('/auth/google', { credential }),
  me: () =>
    api.get<{ message: string; data: User }>('/auth/me'),
  logout: () =>
    api.post('/auth/logout'),
}

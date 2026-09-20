import api from './axios'

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
  remember_me?: boolean
}

export interface User {
  id: number
  name: string
  email: string
  avatar?: string | null
  email_verified_at: string | null
  created_at: string
  has_password?: boolean
  auth_methods?: Array<'password' | 'google'>
}

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post('/auth/register', data),
  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),
  resendVerification: (email: string) =>
    api.post('/auth/resend-verification', { email }),
  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, password }),
  login: (data: LoginPayload) =>
    api.post<{ message: string; data: { token: string; user: User } }>('/auth/login', data),
  googleAuth: (credential: string, rememberMe = false) =>
    api.post<{ message: string; data: { token: string; user: User } }>('/auth/google', {
      credential,
      remember_me: rememberMe,
    }),
  refresh: () =>
    api.post<{ message: string; data: { token: string; user: User } }>('/auth/refresh'),
  me: () =>
    api.get<{ message: string; data: User }>('/auth/me'),
  logout: () =>
    api.post('/auth/logout'),
}

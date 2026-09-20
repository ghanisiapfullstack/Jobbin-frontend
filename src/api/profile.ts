import api from './axios'
import type { User } from './auth'

export const profileApi = {
  show: () => api.get<{ message: string; data: User }>('/profile'),
  updateName: (name: string) => api.put<{ message: string; data: User }>('/profile', { name }),
  updatePassword: (currentPassword: string, newPassword: string) => api.put<{ message: string }>(
    '/profile/password',
    { current_password: currentPassword, new_password: newPassword },
  ),
}

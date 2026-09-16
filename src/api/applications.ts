import api from './axios'
import { toInputDate } from '../utils/date'

export type ApplicationStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected'

export interface Application {
  id: number
  user_id: number
  job_title: string
  company: string
  url: string | null
  status: ApplicationStatus
  notes: string | null
  applied_date: string | null
  reminder_date: string | null
  reminder_sent_day_before: boolean
  reminder_sent_day_of: boolean
  is_archived: boolean
  position: number
  created_at: string
  updated_at: string
}

export interface ApplicationPayload {
  job_title: string
  company: string
  url?: string
  status?: ApplicationStatus
  notes?: string
  applied_date?: string
  reminder_date?: string
}

export function toApplicationPayload(
  application: Application,
  overrides: Partial<ApplicationPayload> = {},
): ApplicationPayload {
  return {
    job_title: application.job_title,
    company: application.company,
    url: application.url || '',
    status: application.status,
    notes: application.notes || '',
    applied_date: toInputDate(application.applied_date),
    reminder_date: toInputDate(application.reminder_date),
    ...overrides,
  }
}

export const applicationsApi = {
  list: (params?: { status?: string; archived?: boolean }) =>
    api.get<{ message: string; data: Application[] }>('/applications', { params }),

  show: (id: number) =>
    api.get<{ message: string; data: Application }>(`/applications/${id}`),

  create: (data: ApplicationPayload) =>
    api.post<{ message: string; data: Application }>('/applications', data),

  update: (id: number, data: ApplicationPayload) =>
    api.put<{ message: string; data: Application }>(`/applications/${id}`, data),

  updatePosition: (id: number, position: number, status: ApplicationStatus) =>
    api.patch(`/applications/${id}/position`, { position, status }),

  archive: (id: number) =>
    api.patch<{ message: string; data: { is_archived: boolean } }>(`/applications/${id}/archive`),

  delete: (id: number) =>
    api.delete(`/applications/${id}`),
}

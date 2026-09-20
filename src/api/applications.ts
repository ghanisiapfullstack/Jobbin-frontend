import api from './axios'
import { toInputDate } from '../utils/date'

export type ApplicationStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected'
export type EmploymentType = 'full_time' | 'part_time' | 'internship' | 'freelance'

export interface Application {
  id: number
  user_id: number
  job_title: string
  company: string
  url: string | null
  status: ApplicationStatus
  employment_type: EmploymentType | null
  salary_min: number | null
  salary_max: number | null
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
  employment_type?: EmploymentType | ''
  salary_min?: number | null
  salary_max?: number | null
  notes?: string
  applied_date?: string
  reminder_date?: string
}

type ApplicationWire = Omit<Application, 'employment_type' | 'salary_min' | 'salary_max'> & {
  employment_type?: EmploymentType | null
  salary_min?: number | string | null
  salary_max?: number | string | null
}

function normalizeSalary(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

function normalizeApplication(application: ApplicationWire): Application {
  return {
    ...application,
    employment_type: application.employment_type ?? null,
    salary_min: normalizeSalary(application.salary_min),
    salary_max: normalizeSalary(application.salary_max),
  }
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
    employment_type: application.employment_type || '',
    salary_min: application.salary_min,
    salary_max: application.salary_max,
    notes: application.notes || '',
    applied_date: toInputDate(application.applied_date),
    reminder_date: toInputDate(application.reminder_date),
    ...overrides,
  }
}

export const applicationsApi = {
  list: async (params?: { status?: string; archived?: boolean }) => {
    const response = await api.get<{ message: string; data: ApplicationWire[] }>('/applications', { params })
    return {
      ...response,
      data: { ...response.data, data: (response.data.data ?? []).map(normalizeApplication) },
    }
  },

  show: async (id: number) => {
    const response = await api.get<{ message: string; data: ApplicationWire }>(`/applications/${id}`)
    return { ...response, data: { ...response.data, data: normalizeApplication(response.data.data) } }
  },

  create: async (data: ApplicationPayload) => {
    const response = await api.post<{ message: string; data: ApplicationWire }>('/applications', data)
    return { ...response, data: { ...response.data, data: normalizeApplication(response.data.data) } }
  },

  update: async (id: number, data: ApplicationPayload) => {
    const response = await api.put<{ message: string; data: ApplicationWire }>(`/applications/${id}`, data)
    return { ...response, data: { ...response.data, data: normalizeApplication(response.data.data) } }
  },

  updatePosition: (id: number, position: number, status: ApplicationStatus) =>
    api.patch(`/applications/${id}/position`, { position, status }),

  archive: (id: number) =>
    api.patch<{ message: string; data: { is_archived: boolean } }>(`/applications/${id}/archive`),

  delete: (id: number) =>
    api.delete(`/applications/${id}`),
}

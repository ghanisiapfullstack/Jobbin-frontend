import api from './axios'

export interface Reminder {
  id: number
  job_title: string
  company: string
  reminder_date: string
  status: string
}

export const remindersApi = {
  list: () =>
    api.get<{ message: string; data: { today: Reminder[]; tomorrow: Reminder[] } }>('/reminders'),
}

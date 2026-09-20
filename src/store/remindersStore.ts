import { create } from 'zustand'
import type { Reminder } from '../api/reminders'
import { remindersApi } from '../api/reminders'

interface RemindersState {
  today: Reminder[]
  tomorrow: Reminder[]
  loading: boolean
  error: string | null
  fetchReminders: () => Promise<void>
}

export const useRemindersStore = create<RemindersState>((set) => ({
  today: [],
  tomorrow: [],
  loading: false,
  error: null,

  fetchReminders: async () => {
    set({ loading: true, error: null })
    try {
      const res = await remindersApi.list()
      set({
        today: res.data.data.today || [],
        tomorrow: res.data.data.tomorrow || [],
        error: null,
      })
    } catch {
      set({ error: 'Reminders could not be loaded.' })
    } finally {
      set({ loading: false })
    }
  },
}))

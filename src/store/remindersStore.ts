import { create } from 'zustand'
import type { Reminder } from '../api/reminders'
import { remindersApi } from '../api/reminders'

interface RemindersState {
  today: Reminder[]
  tomorrow: Reminder[]
  loading: boolean
  fetchReminders: () => Promise<void>
}

export const useRemindersStore = create<RemindersState>((set) => ({
  today: [],
  tomorrow: [],
  loading: false,

  fetchReminders: async () => {
    set({ loading: true })
    try {
      const res = await remindersApi.list()
      set({
        today: res.data.data.today || [],
        tomorrow: res.data.data.tomorrow || [],
      })
    } catch {
      // silent fail
    } finally {
      set({ loading: false })
    }
  },
}))

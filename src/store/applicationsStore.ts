import { create } from 'zustand'
import type { Application, ApplicationStatus, ApplicationPayload } from '../api/applications'
import { applicationsApi } from '../api/applications'

interface ApplicationsState {
  applications: Application[]
  loading: boolean
  error: string | null
  fetchApplications: () => Promise<void>
  fetchArchived: () => Promise<void>
  addApplication: (data: ApplicationPayload) => Promise<Application>
  updateApplication: (id: number, data: ApplicationPayload) => Promise<Application>
  updatePosition: (id: number, position: number, status: ApplicationStatus) => Promise<void>
  archiveApplication: (id: number) => Promise<void>
  deleteApplication: (id: number) => Promise<void>
}

export const useApplicationsStore = create<ApplicationsState>((set, get) => ({
  applications: [],
  loading: false,
  error: null,

  fetchApplications: async () => {
    set({ loading: true, error: null })
    try {
      const res = await applicationsApi.list({ archived: false })
      set({ applications: res.data.data || [] })
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Gagal mengambil data' })
    } finally {
      set({ loading: false })
    }
  },

  fetchArchived: async () => {
    set({ loading: true, error: null })
    try {
      const res = await applicationsApi.list({ archived: true })
      set({ applications: res.data.data || [] })
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Gagal mengambil data' })
    } finally {
      set({ loading: false })
    }
  },

  addApplication: async (data) => {
    const res = await applicationsApi.create(data)
    const newApp = res.data.data
    set((state) => ({ applications: [...state.applications, newApp] }))
    return newApp
  },

  updateApplication: async (id, data) => {
    const res = await applicationsApi.update(id, data)
    const updated = res.data.data
    set((state) => ({
      applications: state.applications.map((a) => (a.id === id ? updated : a)),
    }))
    return updated
  },

  updatePosition: async (id, position, status) => {
    // Optimistic update
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id ? { ...a, position, status } : a
      ),
    }))
    try {
      await applicationsApi.updatePosition(id, position, status)
    } catch {
      // Revert on error
      get().fetchApplications()
    }
  },

  archiveApplication: async (id) => {
    await applicationsApi.archive(id)
    set((state) => ({
      applications: state.applications.filter((a) => a.id !== id),
    }))
  },

  deleteApplication: async (id) => {
    await applicationsApi.delete(id)
    set((state) => ({
      applications: state.applications.filter((a) => a.id !== id),
    }))
  },
}))

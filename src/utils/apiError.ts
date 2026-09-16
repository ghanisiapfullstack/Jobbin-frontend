import axios from 'axios'

export interface ApiErrorData {
  message?: string
  errors?: Record<string, string>
}

export function getApiErrorData(error: unknown): ApiErrorData {
  if (!axios.isAxiosError<ApiErrorData>(error)) return {}
  return error.response?.data ?? {}
}

export function getApiStatus(error: unknown): number | undefined {
  if (!axios.isAxiosError(error)) return undefined
  return error.response?.status
}

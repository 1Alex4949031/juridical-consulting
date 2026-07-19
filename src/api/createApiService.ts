import type { ApiService } from './ApiService'
import { HttpApiService } from './HttpApiService'
import { MockApiService } from './MockApiService'

export function createApiService(): ApiService {
  const mode = import.meta.env.VITE_API_MODE ?? 'mock'

  if (mode === 'mock') {
    return new MockApiService()
  }

  if (mode === 'api') {
    return new HttpApiService(import.meta.env.VITE_BASE_API_URL)
  }

  throw new Error(`Unsupported VITE_API_MODE: ${mode}`)
}

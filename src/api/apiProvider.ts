import type { ApiService } from './ApiService'
import { createApiService } from './createApiService'

let sharedApiService: ApiService | null = null

export function getApiService(): ApiService {
  if (!sharedApiService) {
    sharedApiService = createApiService()
  }

  return sharedApiService
}

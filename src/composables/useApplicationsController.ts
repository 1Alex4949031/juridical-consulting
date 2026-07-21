import { onMounted, onUnmounted, reactive } from 'vue'
import type { ApiService } from '../api/ApiService'
import { getApiService } from '../api/apiProvider'
import { ApplicationsModel } from '../models/ApplicationsModel'

export function useApplicationsController(apiService: ApiService = getApiService()) {
  const model = reactive(new ApplicationsModel(apiService))

  onMounted(() => {
    void model.load()
  })

  onUnmounted(() => {
    model.destroy()
  })

  return {
    model,
  }
}

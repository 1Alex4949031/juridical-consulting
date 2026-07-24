import { onMounted, onUnmounted, reactive } from 'vue'
import type { ApiService } from '../../../api/ApiService'
import { getApiService } from '../../../api/apiProvider'
import { ClientDetailsModel } from '../model/ClientDetailsModel'

export function useClientDetailsController(
  clientId: number,
  apiService: ApiService = getApiService(),
) {
  const model = reactive(new ClientDetailsModel(apiService, clientId))

  function reload(): void {
    void model.load()
  }

  onMounted(reload)
  onUnmounted(() => model.destroy())

  return {
    model,
    reload,
  }
}

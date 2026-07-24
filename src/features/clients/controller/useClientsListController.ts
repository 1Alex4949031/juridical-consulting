import { onMounted, onUnmounted, reactive } from 'vue'
import type { ApiService } from '../../../api/ApiService'
import { getApiService } from '../../../api/apiProvider'
import { ClientsListModel } from '../model/ClientsListModel'

export function useClientsListController(apiService: ApiService = getApiService()) {
  const model = reactive(new ClientsListModel(apiService))

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

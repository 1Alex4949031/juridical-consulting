import { computed, onMounted, reactive } from 'vue'
import { MockApiService } from '../api/MockApiService'
import type { ApiService } from '../api/ApiService'
import type { LegalService } from '../data/legalServices'
import { FormModel } from '../models/FormModel'

export function useConsultationForm(services: LegalService[], apiService: ApiService = new MockApiService()) {
  const request = reactive(new FormModel(services, apiService))

  const documentOptions = ['Есть', 'Нет', 'Нужно подготовить']
  const quickPracticeOptions = computed(() => [
    ...services.map((service) => ({ id: service.id, title: service.title })),
    { id: 'other', title: 'Другое' },
  ])
  const selectedArea = computed(() => request.selectedArea)
  const selectedDirection = computed(() => request.selectedDirection)
  const selectedSituation = computed(() => request.selectedSituation)
  const selectedGoal = computed(() => request.selectedGoal)

  onMounted(() => {
    void request.loadAreas()
  })

  return {
    request,
    documentOptions,
    quickPracticeOptions,
    selectedArea,
    selectedDirection,
    selectedSituation,
    selectedGoal,
  }
}

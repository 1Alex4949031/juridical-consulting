import { computed, onMounted, reactive, shallowRef } from 'vue'
import type { ApiService } from '../api/ApiService'
import { getApiService } from '../api/apiProvider'
import type { LegalService } from '../data/legalServices'
import { formatRussianPhoneInput } from '../domain/phone'
import { FormModel } from '../models/FormModel'

export function useConsultationForm(services: LegalService[], apiService: ApiService = getApiService()) {
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
  const phoneTouched = shallowRef(false)
  const phoneError = computed(() => phoneTouched.value ? request.phoneError : '')

  function touchPhone() {
    phoneTouched.value = true
  }

  function updatePhone(value: string) {
    request.phone = formatRussianPhoneInput(value)
  }

  async function submit() {
    phoneTouched.value = true
    await request.submit()
  }

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
    phoneError,
    touchPhone,
    updatePhone,
    submit,
  }
}

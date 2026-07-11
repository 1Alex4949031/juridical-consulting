import { computed, reactive } from 'vue'
import { legalIntakeAreas } from '../data/legalIntake'
import type { LegalService } from '../data/legalServices'
import { FormModel } from '../models/FormModel'

export function useConsultationForm(services: LegalService[]) {
  const request = reactive(new FormModel(services))

  const documentOptions = ['Есть', 'Нет', 'Нужно подготовить']
  const quickPracticeOptions = computed(() => [
    ...services.map((service) => ({ id: service.id, title: service.title })),
    { id: 'other', title: 'Другое' },
  ])

  const selectedArea = computed(() => legalIntakeAreas.find((area) => area.id === request.legalAreaId))
  const selectedDirection = computed(() =>
    selectedArea.value?.directions.find((direction) => direction.id === request.directionId),
  )
  const selectedSituation = computed(() =>
    selectedDirection.value?.situations.find((situation) => situation.id === request.situationId),
  )
  const selectedGoal = computed(() => selectedSituation.value?.goals.find((goal) => goal.id === request.goalId))

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

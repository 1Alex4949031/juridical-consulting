import { onMounted, reactive } from 'vue'
import type { ApiService } from '../../../api/ApiService'
import { getApiService } from '../../../api/apiProvider'
import type { LegalService } from '../../../data/legalServices'
import type { RequestMode } from '../model/ConsultationFormModel'
import {
  ConsultationFormModel,
  DOCUMENT_OPTIONS,
} from '../model/ConsultationFormModel'

export function useConsultationController(
  services: LegalService[],
  apiService: ApiService = getApiService(),
) {
  const model = reactive(new ConsultationFormModel(services, apiService))

  onMounted(() => {
    void model.intake.loadAreas()
  })

  return {
    model,
    documentOptions: DOCUMENT_OPTIONS,
    setMode: (mode: RequestMode) => model.setMode(mode),
    selectQuickPractice: (practiceId: string) => model.selectQuickPractice(practiceId),
    setDocuments: (value: string) => model.setDocuments(value),
    selectArea: (areaId: string) => model.intake.selectArea(areaId),
    selectDirection: (directionId: string) => model.intake.selectDirection(directionId),
    selectSituation: (situationId: string) => model.intake.selectSituation(situationId),
    selectExpectedResult: (expectedResultId: string) =>
      model.intake.selectExpectedResult(expectedResultId),
    retryIntake: () => model.intake.reloadCurrentStep(),
    submit: () => model.submit(),
  }
}

export type ConsultationController = ReturnType<typeof useConsultationController>

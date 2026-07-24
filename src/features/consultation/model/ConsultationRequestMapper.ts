import type { FormRequest } from '../../../api/ApiService'
import type { LegalService } from '../../../data/legalServices'
import type { ConsultationFormModel } from './ConsultationFormModel'

export class ConsultationRequestMapper {
  static toRequest(model: ConsultationFormModel, services: LegalService[]): FormRequest {
    const email = model.fields.email.value.trim()
    const phone = model.fields.phone.normalizedValue

    if (!phone) {
      throw new Error(model.fields.phone.error || 'Укажите корректный номер телефона.')
    }

    const payload: Record<string, string> = {
      mode: model.mode,
      mode_title: model.mode === 'quick' ? 'Быстрая заявка' : 'Детальная заявка',
      documents: model.fields.documents.value,
      request_topic: model.fields.requestTopic.value.trim(),
    }

    if (model.mode === 'quick') {
      const practiceId = model.fields.quickPractice.value
      const practice = services.find((service) => service.id === practiceId)

      payload.practice_id = practiceId
      payload.practice_title = this.resolveTitle(
        practice,
        model.intake.customDirection.value,
        practiceId,
      )

      this.addCustomValue(payload, 'custom_direction', model.intake.customDirection.value)
    } else {
      const intake = model.intake

      payload.area_id = intake.area.value
      payload.direction_id = intake.direction.value
      payload.situation_id = intake.situation.value
      payload.expected_result_id = intake.expectedResult.value
      payload.area_title = this.resolveTitle(
        intake.selectedArea,
        intake.customArea.value,
        intake.area.value,
      )
      payload.direction_title = this.resolveTitle(
        intake.selectedDirection,
        intake.customDirection.value,
        intake.direction.value,
      )
      payload.situation_title = this.resolveTitle(
        intake.selectedSituation,
        intake.customSituation.value,
        intake.situation.value,
      )
      payload.expected_result_title = this.resolveTitle(
        intake.selectedExpectedResult,
        intake.customExpectedResult.value,
        intake.expectedResult.value,
      )

      this.addCustomValue(payload, 'custom_area', intake.customArea.value)
      this.addCustomValue(payload, 'custom_direction', intake.customDirection.value)
      this.addCustomValue(payload, 'custom_situation', intake.customSituation.value)
      this.addCustomValue(
        payload,
        'custom_expected_result',
        intake.customExpectedResult.value,
      )
    }

    return {
      client: {
        full_name: model.fields.name.value.trim(),
        phone_number: phone,
        ...(email ? { email } : {}),
      },
      payload,
    }
  }

  private static resolveTitle(
    option: { title: string } | undefined,
    customValue: string,
    fallback: string,
  ) {
    return customValue.trim() || option?.title.trim() || fallback
  }

  private static addCustomValue(
    payload: Record<string, string>,
    key: string,
    value: string,
  ) {
    const normalizedValue = value.trim()

    if (normalizedValue) {
      payload[key] = normalizedValue
    }
  }
}

import { describe, expect, it } from 'vitest'
import {
  ApiService,
  type FormRequest,
  type IntakeOption,
} from '../src/api/ApiService'
import { ConsultationFormModel } from '../src/features/consultation/model/ConsultationFormModel'

class ConsultationApiStub extends ApiService {
  submittedRequest: FormRequest | null = null

  async getAreas(): Promise<IntakeOption[]> {
    return [{ id: 'private', title: 'Частное право' }]
  }

  async getDirections(): Promise<IntakeOption[]> {
    return [{ id: 'family', title: 'Семейное право' }]
  }

  async getSituations(): Promise<IntakeOption[]> {
    return [{ id: 'division', title: 'Раздел имущества' }]
  }

  async getExpectedResults(): Promise<IntakeOption[]> {
    return [{ id: 'strategy', title: 'Правовая стратегия' }]
  }

  async createForm(request: FormRequest) {
    this.submittedRequest = request
    return { id: 17 }
  }

  async getClients() {
    return []
  }

  async getClient() {
    throw new Error('Не используется')
  }
}

const services = [
  {
    id: 'business',
    title: 'Бизнес и договоры',
    summary: '',
    detail: '',
    badge: 'B2B',
    tone: 'primary' as const,
    span: 'xl' as const,
  },
]

function fillCommonFields(model: ConsultationFormModel) {
  model.fields.name.setValue('Анна Смирнова')
  model.fields.phone.setValue('+7 913 123 45 67')
  model.fields.email.setValue('anna@example.ru')
  model.fields.requestTopic.setValue('Нужна оценка правовой позиции.')
  model.fields.consent.setValue(true)
}

describe('ConsultationFormModel', () => {
  it('submits a quick request with display titles', async () => {
    const api = new ConsultationApiStub()
    const model = new ConsultationFormModel(services, api)

    fillCommonFields(model)
    await model.submit()

    expect(api.submittedRequest).toMatchObject({
      client: {
        full_name: 'Анна Смирнова',
        phone_number: '+79131234567',
        email: 'anna@example.ru',
      },
      payload: {
        mode: 'quick',
        mode_title: 'Быстрая заявка',
        practice_id: 'business',
        practice_title: 'Бизнес и договоры',
      },
    })
    expect(model.submitSuccess).toContain('17')
  })

  it('submits a detailed request with the selected Russian labels', async () => {
    const api = new ConsultationApiStub()
    const model = new ConsultationFormModel(services, api)

    model.setMode('detail')
    await model.intake.loadAreas()
    await model.intake.selectArea('private')
    await model.intake.selectDirection('family')
    await model.intake.selectSituation('division')
    model.intake.selectExpectedResult('strategy')
    fillCommonFields(model)

    await model.submit()

    expect(api.submittedRequest?.payload).toMatchObject({
      mode: 'detail',
      mode_title: 'Детальная заявка',
      area_id: 'private',
      area_title: 'Частное право',
      direction_id: 'family',
      direction_title: 'Семейное право',
      situation_id: 'division',
      situation_title: 'Раздел имущества',
      expected_result_id: 'strategy',
      expected_result_title: 'Правовая стратегия',
    })
  })

  it('does not submit until required common fields are valid', async () => {
    const api = new ConsultationApiStub()
    const model = new ConsultationFormModel(services, api)

    await model.submit()

    expect(api.submittedRequest).toBeNull()
    expect(model.submitError).toBe('Укажите ФИО.')
    expect(model.fields.phone.error).toBe('Укажите телефон.')
  })
})

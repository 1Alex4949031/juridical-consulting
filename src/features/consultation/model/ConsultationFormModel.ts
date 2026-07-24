import type { ApiService } from '../../../api/ApiService'
import type { LegalService } from '../../../data/legalServices'
import {
  CheckboxField,
  EmailField,
  PhoneField,
  SelectField,
  TextareaField,
  TextField,
} from './fields'
import { ConsultationRequestMapper } from './ConsultationRequestMapper'
import { LegalIntakeModel, OTHER_OPTION } from './LegalIntakeModel'

export type RequestMode = 'quick' | 'detail'

export const DOCUMENT_OPTIONS = ['Есть', 'Нет', 'Нужно подготовить'] as const

export class ConsultationFormModel {
  mode: RequestMode = 'quick'

  readonly intake: LegalIntakeModel

  readonly fields: {
    name: TextField
    phone: PhoneField
    email: EmailField
    quickPractice: SelectField
    documents: SelectField
    requestTopic: TextareaField
    consent: CheckboxField
  }

  isSubmitting = false
  submitError = ''
  submitSuccess = ''

  constructor(
    private readonly services: LegalService[],
    private readonly apiService: ApiService,
  ) {
    this.intake = new LegalIntakeModel(apiService)
    this.fields = {
      name: new TextField({
        name: 'name',
        label: 'ФИО',
        required: true,
        requiredMessage: 'Укажите ФИО.',
        maxLength: 160,
      }),
      phone: new PhoneField(),
      email: new EmailField(),
      quickPractice: new SelectField({
        name: 'quickPractice',
        label: 'Направление / область права',
        initialValue: services[0]?.id ?? '',
        requiredMessage: 'Выберите направление или область права.',
      }),
      documents: new SelectField({
        name: 'documents',
        label: 'Документы',
        initialValue: 'Нет',
      }),
      requestTopic: new TextareaField({
        name: 'requestTopic',
        label: 'Тема запроса',
        required: true,
        requiredMessage: 'Кратко опишите тему запроса.',
      }),
      consent: new CheckboxField({
        name: 'consent',
        label: 'Согласие на обработку данных',
        requiredMessage: 'Подтвердите согласие на обработку персональных данных.',
      }),
    }
  }

  get quickPracticeOptions() {
    return [
      ...this.services.map(({ id, title }) => ({ id, title })),
      OTHER_OPTION,
    ]
  }

  setMode(mode: RequestMode) {
    this.mode = mode
    this.submitError = ''
  }

  selectQuickPractice(practiceId: string) {
    if (this.fields.quickPractice.value !== practiceId && practiceId !== OTHER_OPTION.id) {
      this.intake.customDirection.reset()
    }

    this.fields.quickPractice.setValue(practiceId)
  }

  setDocuments(value: string) {
    this.fields.documents.setValue(value)
  }

  validate() {
    const commonFieldsValid = [
      this.fields.name.validate(),
      this.fields.phone.validate(),
      this.fields.email.validate(),
      this.fields.requestTopic.validate(),
      this.fields.consent.validate(),
    ].every(Boolean)

    const modeFieldsValid = this.mode === 'quick'
      ? this.validateQuickMode()
      : this.intake.validate()

    return commonFieldsValid && modeFieldsValid
  }

  getFirstValidationError() {
    const commonFields = [
      this.fields.name,
      this.fields.phone,
      this.fields.email,
      this.fields.requestTopic,
      this.fields.consent,
    ]
    const commonError = commonFields.find((field) => field.error)?.error

    if (commonError) {
      return commonError
    }

    if (this.mode === 'quick') {
      return this.fields.quickPractice.error || this.intake.customDirection.error
    }

    return this.intake.getFirstValidationError()
  }

  async submit() {
    if (this.isSubmitting) {
      return
    }

    this.submitSuccess = ''

    if (!this.validate()) {
      this.submitError = this.getFirstValidationError()
      return
    }

    this.submitError = ''
    this.isSubmitting = true

    try {
      const request = ConsultationRequestMapper.toRequest(this, this.services)
      const response = await this.apiService.createForm(request)
      this.submitSuccess = `Заявка №${response.id} принята. Мы свяжемся с вами в течение 24 часов.`
    } catch (error) {
      this.submitError = error instanceof Error
        ? error.message
        : 'Не удалось отправить заявку. Попробуйте еще раз.'
    } finally {
      this.isSubmitting = false
    }
  }

  private validateQuickMode() {
    const practiceValid = this.fields.quickPractice.validate()
    const customPracticeValid = this.fields.quickPractice.value === OTHER_OPTION.id
      ? this.intake.customDirection.validateRequired('Укажите свое направление.')
      : true

    if (this.fields.quickPractice.value !== OTHER_OPTION.id) {
      this.intake.customDirection.clearValidation()
    }

    return practiceValid && customPracticeValid
  }
}

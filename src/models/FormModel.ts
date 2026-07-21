import type { ApiService, FormRequest, IntakeOption } from '../api/ApiService'
import type { LegalService } from '../data/legalServices'
import { getRussianPhoneError, normalizeRussianPhone } from '../domain/phone'

export type RequestMode = 'quick' | 'detail'
export type IntakeLoadingStep = 'areas' | 'directions' | 'situations' | 'expectedResults' | null

const otherOption: IntakeOption = {
  id: 'other',
  title: 'Другое',
  isOther: true,
}

function withOtherOption(options: IntakeOption[]) {
  if (options.some((option) => option.id === otherOption.id)) {
    return options
  }

  return [...options, otherOption]
}

export class FormModel {
  mode: RequestMode = 'quick'
  name = ''
  phone = ''
  email = ''
  quickPracticeId = ''
  legalAreaId = ''
  directionId = ''
  situationId = ''
  goalId = ''
  customArea = ''
  customDirection = ''
  customSituation = ''
  customGoal = ''
  documents = 'Нет'
  situation = ''
  consent = false
  areas: IntakeOption[] = []
  directions: IntakeOption[] = []
  situations: IntakeOption[] = []
  expectedResults: IntakeOption[] = []
  intakeLoadingStep: IntakeLoadingStep = null
  intakeError = ''
  isSubmitting = false
  submitError = ''
  submitSuccess = ''

  constructor(
    services: LegalService[],
    private readonly apiService: ApiService,
  ) {
    this.quickPracticeId = services[0]?.id ?? ''
  }

  get isIntakeLoading() {
    return this.intakeLoadingStep !== null
  }

  get selectedArea() {
    return this.areas.find((area) => area.id === this.legalAreaId)
  }

  get selectedDirection() {
    return this.directions.find((direction) => direction.id === this.directionId)
  }

  get selectedSituation() {
    return this.situations.find((situation) => situation.id === this.situationId)
  }

  get selectedGoal() {
    return this.expectedResults.find((goal) => goal.id === this.goalId)
  }

  get phoneError() {
    return getRussianPhoneError(this.phone)
  }

  setMode(mode: RequestMode) {
    this.mode = mode
  }

  async loadAreas() {
    await this.loadIntakeStep('areas', async () => {
      this.areas = withOtherOption(await this.apiService.getAreas())
    })
  }

  async reloadCurrentStep() {
    if (!this.areas.length) {
      await this.loadAreas()
      return
    }

    if (this.situationId) {
      if (this.situationId === otherOption.id) {
        this.expectedResults = [otherOption]
        return
      }

      await this.loadExpectedResults(this.situationId)
      return
    }

    if (this.directionId) {
      if (this.directionId === otherOption.id) {
        this.situations = [otherOption]
        return
      }

      await this.loadSituations(this.directionId)
      return
    }

    if (this.legalAreaId) {
      if (this.legalAreaId === otherOption.id) {
        this.directions = [otherOption]
        return
      }

      await this.loadDirections(this.legalAreaId)
    }
  }

  selectQuickPractice(practiceId: string) {
    if (this.quickPracticeId !== practiceId && practiceId !== 'other') {
      this.customDirection = ''
    }

    this.quickPracticeId = practiceId
  }

  async selectArea(areaId: string) {
    if (this.legalAreaId !== areaId) {
      this.customArea = ''
    }

    this.legalAreaId = areaId
    this.resetDirectionBranch()

    if (areaId && areaId !== otherOption.id) {
      await this.loadDirections(areaId)
    } else if (areaId === otherOption.id) {
      this.directions = [otherOption]
    }
  }

  async selectDirection(directionId: string) {
    if (this.directionId !== directionId) {
      this.customDirection = ''
    }

    this.directionId = directionId
    this.resetSituationBranch()

    if (directionId && directionId !== otherOption.id) {
      await this.loadSituations(directionId)
    } else if (directionId === otherOption.id) {
      this.situations = [otherOption]
    }
  }

  async selectSituation(situationId: string) {
    if (this.situationId !== situationId) {
      this.customSituation = ''
    }

    this.situationId = situationId
    this.goalId = ''
    this.customGoal = ''
    this.expectedResults = []

    if (situationId && situationId !== otherOption.id) {
      await this.loadExpectedResults(situationId)
    } else if (situationId === otherOption.id) {
      this.expectedResults = [otherOption]
    }
  }

  selectGoal(goalId: string) {
    if (this.goalId !== goalId) {
      this.customGoal = ''
    }

    this.goalId = goalId
  }

  async submit() {
    if (this.isSubmitting) {
      return
    }

    this.submitError = this.validate()
    this.submitSuccess = ''

    if (this.submitError) {
      return
    }

    this.isSubmitting = true

    try {
      const response = await this.apiService.createForm(this.createFormRequest())
      this.submitSuccess = `Заявка №${response.id} принята. Мы свяжемся с вами в течение 24 часов.`
    } catch (error) {
      this.submitError = error instanceof Error
        ? error.message
        : 'Не удалось отправить заявку. Попробуйте еще раз.'
    } finally {
      this.isSubmitting = false
    }
  }

  private resetDirectionBranch() {
    this.directionId = ''
    this.directions = []
    this.resetSituationBranch()
  }

  private resetSituationBranch() {
    this.situationId = ''
    this.situations = []
    this.goalId = ''
    this.customDirection = ''
    this.customSituation = ''
    this.customGoal = ''
    this.expectedResults = []
  }

  private async loadDirections(areaId: string) {
    await this.loadIntakeStep('directions', async () => {
      this.directions = withOtherOption(await this.apiService.getDirections(areaId))
    })
  }

  private async loadSituations(directionId: string) {
    await this.loadIntakeStep('situations', async () => {
      this.situations = withOtherOption(await this.apiService.getSituations(directionId))
    })
  }

  private async loadExpectedResults(situationId: string) {
    await this.loadIntakeStep('expectedResults', async () => {
      this.expectedResults = withOtherOption(await this.apiService.getExpectedResults(situationId))
    })
  }

  private validate() {
    if (!this.name.trim()) {
      return 'Укажите ФИО.'
    }

    if (this.phoneError) {
      return this.phoneError
    }

    if (!this.situation.trim()) {
      return 'Кратко опишите тему запроса.'
    }

    if (this.mode === 'quick') {
      if (!this.quickPracticeId) {
        return 'Выберите направление или область права.'
      }

      if (this.quickPracticeId === otherOption.id && !this.customDirection.trim()) {
        return 'Укажите свое направление.'
      }
    }

    if (this.mode === 'detail') {
      if (!this.legalAreaId || !this.directionId || !this.situationId || !this.goalId) {
        return 'Пройдите все шаги детальной заявки.'
      }

      if (this.legalAreaId === otherOption.id && !this.customArea.trim()) {
        return 'Укажите свою область права.'
      }

      if (this.directionId === otherOption.id && !this.customDirection.trim()) {
        return 'Укажите свое направление.'
      }

      if (this.situationId === otherOption.id && !this.customSituation.trim()) {
        return 'Опишите свою ситуацию.'
      }

      if (this.goalId === otherOption.id && !this.customGoal.trim()) {
        return 'Укажите ожидаемый результат.'
      }
    }

    if (!this.consent) {
      return 'Подтвердите согласие на обработку персональных данных.'
    }

    return ''
  }

  private createFormRequest(): FormRequest {
    const email = this.email.trim()
    const phone = normalizeRussianPhone(this.phone)

    if (!phone) {
      throw new Error(getRussianPhoneError(this.phone))
    }

    const payload: Record<string, string> = {
      mode: this.mode,
      documents: this.documents,
      request_topic: this.situation.trim(),
    }

    if (this.mode === 'quick') {
      payload.practice_id = this.quickPracticeId

      if (this.customDirection.trim()) {
        payload.custom_direction = this.customDirection.trim()
      }
    } else {
      payload.area_id = this.legalAreaId
      payload.direction_id = this.directionId
      payload.situation_id = this.situationId
      payload.expected_result_id = this.goalId

      if (this.customArea.trim()) {
        payload.custom_area = this.customArea.trim()
      }

      if (this.customDirection.trim()) {
        payload.custom_direction = this.customDirection.trim()
      }

      if (this.customSituation.trim()) {
        payload.custom_situation = this.customSituation.trim()
      }

      if (this.customGoal.trim()) {
        payload.custom_expected_result = this.customGoal.trim()
      }
    }

    return {
      client: {
        full_name: this.name.trim(),
        phone_number: phone,
        ...(email ? { email } : {}),
      },
      payload,
    }
  }

  private async loadIntakeStep(step: Exclude<IntakeLoadingStep, null>, loader: () => Promise<void>) {
    this.intakeLoadingStep = step
    this.intakeError = ''

    try {
      await loader()
    } catch {
      this.intakeError = 'Не удалось загрузить данные. Попробуйте еще раз.'
    } finally {
      this.intakeLoadingStep = null
    }
  }
}

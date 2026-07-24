import type { ApiService, IntakeOption } from '../../../api/ApiService'
import { SelectField, TextField } from './fields'

export type IntakeLoadingStep = 'areas' | 'directions' | 'situations' | 'expectedResults' | null

export const OTHER_OPTION: IntakeOption = {
  id: 'other',
  title: 'Другое',
  isOther: true,
}

function withOtherOption(options: IntakeOption[]) {
  if (options.some((option) => option.id === OTHER_OPTION.id)) {
    return options
  }

  return [...options, OTHER_OPTION]
}

export class LegalIntakeModel {
  readonly area = new SelectField({
    name: 'legalArea',
    label: 'Область права',
    requiredMessage: 'Выберите область права.',
  })

  readonly direction = new SelectField({
    name: 'direction',
    label: 'Направление',
    requiredMessage: 'Выберите направление.',
  })

  readonly situation = new SelectField({
    name: 'situationType',
    label: 'Тип ситуации',
    requiredMessage: 'Выберите тип ситуации.',
  })

  readonly expectedResult = new SelectField({
    name: 'expectedResult',
    label: 'Что нужно получить',
    requiredMessage: 'Выберите ожидаемый результат.',
  })

  readonly customArea = new TextField({
    name: 'customArea',
    label: 'Своя область права',
  })

  readonly customDirection = new TextField({
    name: 'customDirection',
    label: 'Свое направление',
  })

  readonly customSituation = new TextField({
    name: 'customSituation',
    label: 'Своя ситуация',
  })

  readonly customExpectedResult = new TextField({
    name: 'customExpectedResult',
    label: 'Своя задача',
  })

  areas: IntakeOption[] = []
  directions: IntakeOption[] = []
  situations: IntakeOption[] = []
  expectedResults: IntakeOption[] = []
  loadingStep: IntakeLoadingStep = null
  error = ''

  constructor(private readonly apiService: ApiService) {}

  get isLoading() {
    return this.loadingStep !== null
  }

  get selectedArea() {
    return this.areas.find((option) => option.id === this.area.value)
  }

  get selectedDirection() {
    return this.directions.find((option) => option.id === this.direction.value)
  }

  get selectedSituation() {
    return this.situations.find((option) => option.id === this.situation.value)
  }

  get selectedExpectedResult() {
    return this.expectedResults.find((option) => option.id === this.expectedResult.value)
  }

  async loadAreas() {
    await this.loadStep('areas', async () => {
      this.areas = withOtherOption(await this.apiService.getAreas())
    })
  }

  async reloadCurrentStep() {
    if (!this.areas.length) {
      await this.loadAreas()
      return
    }

    if (this.situation.value) {
      if (this.situation.value === OTHER_OPTION.id) {
        this.expectedResults = [OTHER_OPTION]
        return
      }

      await this.loadExpectedResults(this.situation.value)
      return
    }

    if (this.direction.value) {
      if (this.direction.value === OTHER_OPTION.id) {
        this.situations = [OTHER_OPTION]
        return
      }

      await this.loadSituations(this.direction.value)
      return
    }

    if (this.area.value) {
      if (this.area.value === OTHER_OPTION.id) {
        this.directions = [OTHER_OPTION]
        return
      }

      await this.loadDirections(this.area.value)
    }
  }

  async selectArea(areaId: string) {
    if (this.area.value !== areaId) {
      this.customArea.reset()
    }

    this.area.setValue(areaId)
    this.resetDirectionBranch()

    if (areaId && areaId !== OTHER_OPTION.id) {
      await this.loadDirections(areaId)
    } else if (areaId === OTHER_OPTION.id) {
      this.directions = [OTHER_OPTION]
    }
  }

  async selectDirection(directionId: string) {
    if (this.direction.value !== directionId) {
      this.customDirection.reset()
    }

    this.direction.setValue(directionId)
    this.resetSituationBranch()

    if (directionId && directionId !== OTHER_OPTION.id) {
      await this.loadSituations(directionId)
    } else if (directionId === OTHER_OPTION.id) {
      this.situations = [OTHER_OPTION]
    }
  }

  async selectSituation(situationId: string) {
    if (this.situation.value !== situationId) {
      this.customSituation.reset()
    }

    this.situation.setValue(situationId)
    this.expectedResult.reset()
    this.customExpectedResult.reset()
    this.expectedResults = []

    if (situationId && situationId !== OTHER_OPTION.id) {
      await this.loadExpectedResults(situationId)
    } else if (situationId === OTHER_OPTION.id) {
      this.expectedResults = [OTHER_OPTION]
    }
  }

  selectExpectedResult(expectedResultId: string) {
    if (this.expectedResult.value !== expectedResultId) {
      this.customExpectedResult.reset()
    }

    this.expectedResult.setValue(expectedResultId)
  }

  validate() {
    const selectionsValid = [
      this.area.validate(),
      this.direction.validate(),
      this.situation.validate(),
      this.expectedResult.validate(),
    ].every(Boolean)

    if (!selectionsValid) {
      return false
    }

    const customFieldsValid = [
      this.validateOther(this.area.value, this.customArea, 'Укажите свою область права.'),
      this.validateOther(this.direction.value, this.customDirection, 'Укажите свое направление.'),
      this.validateOther(this.situation.value, this.customSituation, 'Опишите свою ситуацию.'),
      this.validateOther(
        this.expectedResult.value,
        this.customExpectedResult,
        'Укажите ожидаемый результат.',
      ),
    ].every(Boolean)

    return customFieldsValid
  }

  getFirstValidationError() {
    const fields = [
      this.area,
      this.direction,
      this.situation,
      this.expectedResult,
      this.customArea,
      this.customDirection,
      this.customSituation,
      this.customExpectedResult,
    ]

    return fields.find((field) => field.error)?.error ?? ''
  }

  private resetDirectionBranch() {
    this.direction.reset()
    this.directions = []
    this.resetSituationBranch()
  }

  private resetSituationBranch() {
    this.situation.reset()
    this.situations = []
    this.expectedResult.reset()
    this.customDirection.reset()
    this.customSituation.reset()
    this.customExpectedResult.reset()
    this.expectedResults = []
  }

  private async loadDirections(areaId: string) {
    await this.loadStep('directions', async () => {
      this.directions = withOtherOption(await this.apiService.getDirections(areaId))
    })
  }

  private async loadSituations(directionId: string) {
    await this.loadStep('situations', async () => {
      this.situations = withOtherOption(await this.apiService.getSituations(directionId))
    })
  }

  private async loadExpectedResults(situationId: string) {
    await this.loadStep('expectedResults', async () => {
      this.expectedResults = withOtherOption(await this.apiService.getExpectedResults(situationId))
    })
  }

  private validateOther(value: string, field: TextField, message: string) {
    if (value !== OTHER_OPTION.id) {
      field.clearValidation()
      return true
    }

    return field.validateRequired(message)
  }

  private async loadStep(step: Exclude<IntakeLoadingStep, null>, loader: () => Promise<void>) {
    this.loadingStep = step
    this.error = ''

    try {
      await loader()
    } catch {
      this.error = 'Не удалось загрузить данные. Попробуйте еще раз.'
    } finally {
      this.loadingStep = null
    }
  }
}

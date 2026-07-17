import type { ApiService, IntakeOption } from '../api/ApiService'
import type { LegalService } from '../data/legalServices'

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

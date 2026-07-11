import type { LegalService } from '../data/legalServices'

export type RequestMode = 'quick' | 'detail'

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

  constructor(services: LegalService[]) {
    this.quickPracticeId = services[0]?.id ?? ''
  }

  setMode(mode: RequestMode) {
    this.mode = mode
  }

  selectQuickPractice(practiceId: string) {
    if (this.quickPracticeId !== practiceId && practiceId !== 'other') {
      this.customDirection = ''
    }

    this.quickPracticeId = practiceId
  }

  selectArea(areaId: string) {
    if (this.legalAreaId !== areaId) {
      this.customArea = ''
    }

    this.legalAreaId = areaId
    this.directionId = ''
    this.situationId = ''
    this.goalId = ''
    this.customDirection = ''
    this.customSituation = ''
    this.customGoal = ''
  }

  selectDirection(directionId: string) {
    if (this.directionId !== directionId) {
      this.customDirection = ''
    }

    this.directionId = directionId
    this.situationId = ''
    this.goalId = ''
    this.customSituation = ''
    this.customGoal = ''
  }

  selectSituation(situationId: string) {
    if (this.situationId !== situationId) {
      this.customSituation = ''
    }

    this.situationId = situationId
    this.goalId = ''
    this.customGoal = ''
  }

  selectGoal(goalId: string) {
    if (this.goalId !== goalId) {
      this.customGoal = ''
    }

    this.goalId = goalId
  }
}

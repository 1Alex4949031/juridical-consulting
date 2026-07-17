import { legalIntakeAreas } from '../data/legalIntake'
import { ApiService, type IntakeOption } from './ApiService'

export class MockApiService extends ApiService {
  async getAreas(): Promise<IntakeOption[]> {
    return legalIntakeAreas.map(({ id, title, description, isOther }) => ({
      id,
      title,
      description,
      isOther,
    }))
  }

  async getDirections(areaId: string): Promise<IntakeOption[]> {
    const area = legalIntakeAreas.find((item) => item.id === areaId)

    return (
      area?.directions.map(({ id, title, isOther }) => ({
        id,
        title,
        isOther,
      })) ?? []
    )
  }

  async getSituations(directionId: string): Promise<IntakeOption[]> {
    const direction = legalIntakeAreas
      .flatMap((area) => area.directions)
      .find((item) => item.id === directionId)

    return (
      direction?.situations.map(({ id, title, isOther }) => ({
        id,
        title,
        isOther,
      })) ?? []
    )
  }

  async getExpectedResults(situationId: string): Promise<IntakeOption[]> {
    const situation = legalIntakeAreas
      .flatMap((area) => area.directions)
      .flatMap((direction) => direction.situations)
      .find((item) => item.id === situationId)

    return (
      situation?.goals.map(({ id, title, isOther }) => ({
        id,
        title,
        isOther,
      })) ?? []
    )
  }
}

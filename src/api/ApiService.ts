export interface IntakeOption {
  id: string
  title: string
  description?: string
  isOther?: boolean
}

export abstract class ApiService {
  abstract getAreas(): Promise<IntakeOption[]>

  abstract getDirections(areaId: string): Promise<IntakeOption[]>

  abstract getSituations(directionId: string): Promise<IntakeOption[]>

  abstract getExpectedResults(situationId: string): Promise<IntakeOption[]>
}

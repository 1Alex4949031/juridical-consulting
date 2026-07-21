import type { ClientDetailsDto, ClientSummaryDto } from './ApiDto'

export interface IntakeOption {
  id: string
  title: string
  description?: string
  isOther?: boolean
}

export interface FormClient {
  full_name: string
  phone_number: string
  email?: string
}

export interface FormRequest {
  client: FormClient
  payload: Record<string, string>
}

export interface FormResponse {
  id: number
}

export abstract class ApiService {
  abstract getAreas(): Promise<IntakeOption[]>

  abstract getDirections(areaId: string): Promise<IntakeOption[]>

  abstract getSituations(directionId: string): Promise<IntakeOption[]>

  abstract getExpectedResults(situationId: string): Promise<IntakeOption[]>

  abstract createForm(request: FormRequest): Promise<FormResponse>

  abstract getClients(): Promise<ClientSummaryDto[]>

  abstract getClient(id: number): Promise<ClientDetailsDto>
}

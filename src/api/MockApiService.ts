import { legalIntakeAreas } from '../data/legalIntake'
import {
  ApiService,
  type ClientDetails,
  type ClientSummary,
  type FormRequest,
  type FormResponse,
  type IntakeOption,
} from './ApiService'

export class MockApiService extends ApiService {
  private readonly clients: ClientDetails[] = []
  private nextClientId = 1
  private nextFormId = 1

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

  async createForm(request: FormRequest): Promise<FormResponse> {
    const timestamp = new Date().toISOString()
    const client: ClientDetails = {
      id: this.nextClientId,
      ...request.client,
      forms: [
        {
          payload: { ...request.payload },
          created_at: timestamp,
          updated_at: timestamp,
        },
      ],
    }

    this.nextClientId += 1
    this.clients.push(client)

    const response = { id: this.nextFormId }
    this.nextFormId += 1

    return response
  }

  async getClients(): Promise<ClientSummary[]> {
    return this.clients.map(({ forms: _forms, ...client }) => ({ ...client }))
  }

  async getClient(id: number): Promise<ClientDetails> {
    const client = this.clients.find((item) => item.id === id)

    if (!client) {
      throw new Error('Клиент не найден.')
    }

    return {
      ...client,
      forms: client.forms.map((form) => ({
        ...form,
        payload: { ...form.payload },
      })),
    }
  }
}

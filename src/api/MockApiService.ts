import { legalIntakeAreas } from '../data/legalIntake'
import type { ClientDetailsDto, ClientFormDto, ClientSummaryDto } from './ApiDto'
import {
  ApiService,
  type FormRequest,
  type FormResponse,
  type IntakeOption,
} from './ApiService'

interface StoredClient {
  id: number
  full_name: string
  phone_number: string
  email?: string
  forms: ClientFormDto[]
}

const seededClients: StoredClient[] = [
  {
    id: 1,
    full_name: 'Анна Смирнова',
    phone_number: '+79131234567',
    email: 'anna@example.ru',
    forms: [
      {
        payload: {
          mode: 'detail',
          area_id: 'private',
          direction_id: 'family',
          situation_id: 'division',
          expected_result_id: 'strategy',
          documents: 'Есть',
          request_topic: 'Нужна оценка перспектив раздела совместного имущества.',
        },
        created_at: '2026-07-20T08:30:00.000Z',
        updated_at: '2026-07-20T08:30:00.000Z',
      },
    ],
  },
  {
    id: 2,
    full_name: 'Михаил Орлов',
    phone_number: '+79139876543',
    email: 'm.orlov@example.ru',
    forms: [
      {
        payload: {
          mode: 'quick',
          practice_id: 'business',
          documents: 'Нужно подготовить',
          request_topic: 'Проверка договора поставки перед подписанием.',
        },
        created_at: '2026-07-19T11:15:00.000Z',
        updated_at: '2026-07-19T11:15:00.000Z',
      },
      {
        payload: {
          mode: 'quick',
          practice_id: 'court',
          documents: 'Есть',
          request_topic: 'Контрагент не исполняет обязательства по оплате.',
        },
        created_at: '2026-07-18T06:10:00.000Z',
        updated_at: '2026-07-18T06:10:00.000Z',
      },
    ],
  },
]

export class MockApiService extends ApiService {
  private readonly clients: StoredClient[] = seededClients.map((client) => ({
    ...client,
    forms: client.forms.map((form) => ({
      ...form,
      payload: { ...form.payload },
    })),
  }))
  private nextClientId = seededClients.length + 1
  private nextFormId = seededClients.reduce((total, client) => total + client.forms.length, 0) + 1

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
    const form: ClientFormDto = {
      payload: { ...request.payload },
      created_at: timestamp,
      updated_at: timestamp,
    }
    const existingClient = this.clients.find(
      (client) => client.phone_number === request.client.phone_number,
    )

    if (existingClient) {
      existingClient.full_name = request.client.full_name
      existingClient.email = request.client.email
      existingClient.forms.push(form)
    } else {
      this.clients.push({
        id: this.nextClientId,
        ...request.client,
        forms: [form],
      })
      this.nextClientId += 1
    }

    const response = { id: this.nextFormId }
    this.nextFormId += 1

    return response
  }

  async getClients(): Promise<ClientSummaryDto[]> {
    return this.clients.map(({ forms: _forms, ...client }) => ({ ...client }))
  }

  async getClient(id: number): Promise<ClientDetailsDto> {
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

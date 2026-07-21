import {
  ApiService,
  type FormRequest,
  type FormResponse,
  type IntakeOption,
} from './ApiService'
import type {
  ClientDetailsDto,
  ClientSummaryDto,
  FormResponseDto,
  IntakeOptionDto,
} from './ApiDto'

interface ApiErrorPayload {
  error?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function createQuery(parameters: Record<string, string>) {
  const query = new URLSearchParams(parameters).toString()
  return query ? `?${query}` : ''
}

function normalizeOptions(options: IntakeOptionDto[]): IntakeOption[] {
  return options.flatMap(({ id, title }) => {
    if (id === undefined || typeof title !== 'string') {
      return []
    }

    return [{ id: String(id), title }]
  })
}

export class HttpApiService extends ApiService {
  private readonly baseUrl: string

  constructor(baseUrl: string | undefined) {
    super()

    const normalizedBaseUrl = (baseUrl ?? '').trim().replace(/\/+$/, '')

    if (!normalizedBaseUrl) {
      throw new Error('VITE_BASE_API_URL is required when VITE_API_MODE=api')
    }

    this.baseUrl = normalizedBaseUrl
  }

  async getAreas(): Promise<IntakeOption[]> {
    return normalizeOptions(await this.request<IntakeOptionDto[]>('/area'))
  }

  async getDirections(areaId: string): Promise<IntakeOption[]> {
    const options = await this.request<IntakeOptionDto[]>(`/direction${createQuery({ area_id: areaId })}`)
    return normalizeOptions(options)
  }

  async getSituations(directionId: string): Promise<IntakeOption[]> {
    const options = await this.request<IntakeOptionDto[]>(`/situation${createQuery({ direction_id: directionId })}`)
    return normalizeOptions(options)
  }

  async getExpectedResults(situationId: string): Promise<IntakeOption[]> {
    const options = await this.request<IntakeOptionDto[]>(
      `/expected-result${createQuery({ situation_id: situationId })}`,
    )
    return normalizeOptions(options)
  }

  async createForm(request: FormRequest): Promise<FormResponse> {
    const response = await this.request<FormResponseDto>('/form', {
      method: 'POST',
      body: JSON.stringify(request),
    })

    if (!Number.isInteger(response.id) || Number(response.id) < 1) {
      throw new ApiError('Сервер вернул некорректный идентификатор заявки.', 500)
    }

    return { id: response.id as number }
  }

  async getClients(): Promise<ClientSummaryDto[]> {
    return this.request<ClientSummaryDto[]>('/clients')
  }

  async getClient(id: number): Promise<ClientDetailsDto> {
    return this.request<ClientDetailsDto>(`/clients/${encodeURIComponent(String(id))}`)
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers)
    headers.set('Accept', 'application/json')

    if (options.body) {
      headers.set('Content-Type', 'application/json')
    }

    let response: Response

    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers,
      })
    } catch {
      throw new ApiError('Не удалось подключиться к серверу. Проверьте соединение и попробуйте снова.', 0)
    }

    if (!response.ok) {
      const payload = await response.json().catch(() => null) as ApiErrorPayload | null
      throw new ApiError(payload?.error || `Сервер вернул ошибку ${response.status}.`, response.status)
    }

    return response.json() as Promise<T>
  }
}

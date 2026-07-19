import {
  ApiService,
  type ClientDetails,
  type ClientSummary,
  type FormRequest,
  type FormResponse,
  type IntakeOption,
} from './ApiService'

interface ApiErrorPayload {
  error?: string
}

interface ApiIntakeOption {
  id: string | number
  title: string
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

function normalizeOptions(options: ApiIntakeOption[]): IntakeOption[] {
  return options.map(({ id, title }) => ({
    id: String(id),
    title,
  }))
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
    return normalizeOptions(await this.request<ApiIntakeOption[]>('/area'))
  }

  async getDirections(areaId: string): Promise<IntakeOption[]> {
    const options = await this.request<ApiIntakeOption[]>(`/direction${createQuery({ area_id: areaId })}`)
    return normalizeOptions(options)
  }

  async getSituations(directionId: string): Promise<IntakeOption[]> {
    const options = await this.request<ApiIntakeOption[]>(`/situation${createQuery({ direction_id: directionId })}`)
    return normalizeOptions(options)
  }

  async getExpectedResults(situationId: string): Promise<IntakeOption[]> {
    const options = await this.request<ApiIntakeOption[]>(
      `/expected-result${createQuery({ situation_id: situationId })}`,
    )
    return normalizeOptions(options)
  }

  async createForm(request: FormRequest): Promise<FormResponse> {
    return this.request<FormResponse>('/form', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getClients(): Promise<ClientSummary[]> {
    return this.request<ClientSummary[]>('/clients')
  }

  async getClient(id: number): Promise<ClientDetails> {
    return this.request<ClientDetails>(`/clients/${encodeURIComponent(String(id))}`)
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

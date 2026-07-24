import type { ApiService } from '../../../api/ApiService'
import type { ClientDetails } from './Client'
import { ClientMapper } from './ClientMapper'

export class ClientDetailsModel {
  client: ClientDetails | null = null
  isLoading = false
  error = ''

  private loadRevision = 0

  constructor(
    private readonly apiService: ApiService,
    private readonly clientId: number,
  ) {}

  get totalRequests(): number {
    return this.client?.requests.length ?? 0
  }

  async load(): Promise<void> {
    if (this.isLoading) {
      return
    }

    if (!Number.isInteger(this.clientId) || this.clientId < 1) {
      this.client = null
      this.error = 'Некорректный идентификатор клиента.'
      return
    }

    const revision = ++this.loadRevision
    this.isLoading = true
    this.error = ''

    try {
      const client = ClientMapper.fromDetails(await this.apiService.getClient(this.clientId))

      if (revision !== this.loadRevision) {
        return
      }

      this.client = client
    } catch (error) {
      if (revision !== this.loadRevision) {
        return
      }

      this.client = null
      this.error = error instanceof Error
        ? error.message
        : 'Не удалось загрузить данные клиента. Попробуйте еще раз.'
    } finally {
      if (revision === this.loadRevision) {
        this.isLoading = false
      }
    }
  }

  destroy(): void {
    this.loadRevision += 1
    this.isLoading = false
  }
}

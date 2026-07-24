import type { ApiService } from '../../../api/ApiService'
import type { ClientListItem } from './Client'
import { ClientMapper } from './ClientMapper'

export class ClientsListModel {
  clients: ClientListItem[] = []
  isLoading = false
  error = ''

  private loadRevision = 0

  constructor(private readonly apiService: ApiService) {}

  get totalClients(): number {
    return this.clients.length
  }

  async load(): Promise<void> {
    if (this.isLoading) {
      return
    }

    const revision = ++this.loadRevision
    this.isLoading = true
    this.error = ''

    try {
      const clients = ClientMapper.fromSummaryList(await this.apiService.getClients())

      if (revision !== this.loadRevision) {
        return
      }

      this.clients = clients.sort((left, right) => right.id - left.id)
    } catch (error) {
      if (revision !== this.loadRevision) {
        return
      }

      this.clients = []
      this.error = error instanceof Error
        ? error.message
        : 'Не удалось загрузить клиентов. Попробуйте еще раз.'
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

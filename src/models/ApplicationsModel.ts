import type { ApiService } from '../api/ApiService'
import { ApplicationMapper } from '../mappers/ApplicationMapper'
import type { ApplicationRecord } from './Application'

export class ApplicationsModel {
  applications: ApplicationRecord[] = []
  isLoading = false
  error = ''
  warning = ''

  private loadRevision = 0

  constructor(private readonly apiService: ApiService) {}

  get totalApplications() {
    return this.applications.length
  }

  get totalClients() {
    return new Set(this.applications.map((application) => application.clientId)).size
  }

  async load() {
    if (this.isLoading) {
      return
    }

    const revision = ++this.loadRevision
    this.isLoading = true
    this.error = ''
    this.warning = ''

    try {
      const clients = await this.apiService.getClients()
      const clientIds = clients.flatMap((client) =>
        Number.isInteger(client.id) && Number(client.id) > 0 ? [client.id as number] : [],
      )
      let failedClients = clients.length - clientIds.length
      const results = await Promise.allSettled(
        clientIds.map((clientId) => this.apiService.getClient(clientId)),
      )
      const applications: ApplicationRecord[] = []

      for (const result of results) {
        if (result.status === 'rejected') {
          failedClients += 1
          continue
        }

        try {
          applications.push(...ApplicationMapper.fromClient(result.value))
        } catch {
          failedClients += 1
        }
      }

      if (revision !== this.loadRevision) {
        return
      }

      this.applications = applications.sort(
        (left, right) => (right.createdAt?.getTime() ?? 0) - (left.createdAt?.getTime() ?? 0),
      )

      if (failedClients) {
        this.warning = `Не удалось загрузить данные по клиентам: ${failedClients}. Остальные заявки показаны.`
      }
    } catch (error) {
      if (revision !== this.loadRevision) {
        return
      }

      this.applications = []
      this.error = error instanceof Error
        ? error.message
        : 'Не удалось загрузить заявки. Попробуйте еще раз.'
    } finally {
      if (revision === this.loadRevision) {
        this.isLoading = false
      }
    }
  }

  destroy() {
    this.loadRevision += 1
    this.isLoading = false
  }
}

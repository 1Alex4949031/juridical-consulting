import { describe, expect, it, vi } from 'vitest'
import { MockApiService } from '../src/api/MockApiService'
import { ClientDetailsModel } from '../src/features/clients/model/ClientDetailsModel'
import { ClientsListModel } from '../src/features/clients/model/ClientsListModel'

describe('ClientsListModel', () => {
  it('loads summaries without requesting every client profile', async () => {
    const apiService = new MockApiService()
    const getClient = vi.spyOn(apiService, 'getClient')
    const model = new ClientsListModel(apiService)

    await model.load()

    expect(model.error).toBe('')
    expect(model.totalClients).toBe(2)
    expect(model.clients.map(({ id }) => id)).toEqual([2, 1])
    expect(getClient).not.toHaveBeenCalled()
  })
})

describe('ClientDetailsModel', () => {
  it('loads one client with all requests', async () => {
    const apiService = new MockApiService()
    const model = new ClientDetailsModel(apiService, 2)

    await model.load()

    expect(model.error).toBe('')
    expect(model.client?.fullName).toBe('Михаил Орлов')
    expect(model.totalRequests).toBe(2)
    expect(model.client?.requests[0]?.details).toContainEqual({
      key: 'practice_id',
      label: 'Направление / область права',
      value: 'Бизнес и договоры',
    })
  })

  it('rejects an invalid client identifier before calling the API', async () => {
    const apiService = new MockApiService()
    const getClient = vi.spyOn(apiService, 'getClient')
    const model = new ClientDetailsModel(apiService, 0)

    await model.load()

    expect(model.error).toBe('Некорректный идентификатор клиента.')
    expect(getClient).not.toHaveBeenCalled()
  })
})

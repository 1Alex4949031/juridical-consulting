import { describe, expect, it } from 'vitest'
import { ClientMapper } from '../src/features/clients/model/ClientMapper'

describe('ClientMapper', () => {
  it('maps a client summary without leaking API field names', () => {
    expect(ClientMapper.fromSummary({
      id: 7,
      full_name: '  Иван Петров  ',
      phone_number: '+79130000000',
      email: 'ivan@example.ru',
    })).toEqual({
      id: 7,
      fullName: 'Иван Петров',
      phone: '+79130000000',
      email: 'ivan@example.ru',
    })
  })

  it('uses Russian labels for legacy identifier payloads', () => {
    const client = ClientMapper.fromDetails({
      id: 5,
      full_name: 'Иван Иванов',
      phone_number: '+79130000000',
      forms: [
        {
          payload: {
            mode: 'detail',
            area_id: 'private',
            direction_id: 'family',
            situation_id: 'division',
            expected_result_id: 'strategy',
          },
          created_at: '2026-07-20T08:30:00.000Z',
        },
      ],
    })

    expect(client.requests[0]?.details.slice(0, 5).map(({ label, value }) => [label, value]))
      .toEqual([
        ['Тип заявки', 'Детальная заявка'],
        ['Область права', 'Частное право'],
        ['Направление', 'Семейное право'],
        ['Ситуация', 'Раздел имущества'],
        ['Ожидаемый результат', 'Правовая стратегия'],
      ])
  })
})

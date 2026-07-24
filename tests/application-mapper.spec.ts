import { describe, expect, it } from 'vitest'
import { ApplicationMapper } from '../src/mappers/ApplicationMapper'

describe('ApplicationMapper', () => {
  it('uses Russian labels for legacy identifier payloads', () => {
    const [application] = ApplicationMapper.fromClient({
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

    expect(application.details.slice(0, 5).map(({ label, value }) => [label, value])).toEqual([
      ['Тип заявки', 'Детальная заявка'],
      ['Область права', 'Частное право'],
      ['Направление', 'Семейное право'],
      ['Ситуация', 'Раздел имущества'],
      ['Ожидаемый результат', 'Правовая стратегия'],
    ])
  })
})

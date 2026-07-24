import type { ClientDetailsDto, ClientFormDto, ClientSummaryDto } from '../../../api/ApiDto'
import { legalIntakeAreas } from '../../../data/legalIntake'
import { legalServices } from '../../../data/legalServices'
import type {
  ClientDetails,
  ClientListItem,
  ClientRequest,
  ClientRequestDetail,
} from './Client'

interface PayloadField {
  key: string
  label: string
  titleKey?: string
  customKey?: string
  valueTitles?: ReadonlyMap<string, string>
}

const modeTitles = new Map([
  ['quick', 'Быстрая заявка'],
  ['detail', 'Детальная заявка'],
])
const practiceTitles = new Map(legalServices.map(({ id, title }) => [id, title] as const))
const areaTitles = new Map(legalIntakeAreas.map(({ id, title }) => [id, title] as const))
const directionTitles = new Map(
  legalIntakeAreas.flatMap((area) => area.directions.map(({ id, title }) => [id, title] as const)),
)
const situationTitles = new Map(
  legalIntakeAreas.flatMap((area) =>
    area.directions.flatMap((direction) =>
      direction.situations.map(({ id, title }) => [id, title] as const),
    ),
  ),
)
const expectedResultTitles = new Map(
  legalIntakeAreas.flatMap((area) =>
    area.directions.flatMap((direction) =>
      direction.situations.flatMap((situation) =>
        situation.goals.map(({ id, title }) => [id, title] as const),
      ),
    ),
  ),
)

areaTitles.set('private', 'Частное право')
directionTitles.set('family', 'Семейное право')
situationTitles.set('division', 'Раздел имущества')
expectedResultTitles.set('strategy', 'Правовая стратегия')

const payloadFields: PayloadField[] = [
  { key: 'mode', label: 'Тип заявки', titleKey: 'mode_title', valueTitles: modeTitles },
  {
    key: 'practice_id',
    label: 'Направление / область права',
    titleKey: 'practice_title',
    customKey: 'custom_direction',
    valueTitles: practiceTitles,
  },
  {
    key: 'area_id',
    label: 'Область права',
    titleKey: 'area_title',
    customKey: 'custom_area',
    valueTitles: areaTitles,
  },
  {
    key: 'direction_id',
    label: 'Направление',
    titleKey: 'direction_title',
    customKey: 'custom_direction',
    valueTitles: directionTitles,
  },
  {
    key: 'situation_id',
    label: 'Ситуация',
    titleKey: 'situation_title',
    customKey: 'custom_situation',
    valueTitles: situationTitles,
  },
  {
    key: 'expected_result_id',
    label: 'Ожидаемый результат',
    titleKey: 'expected_result_title',
    customKey: 'custom_expected_result',
    valueTitles: expectedResultTitles,
  },
  { key: 'documents', label: 'Документы' },
  { key: 'request_topic', label: 'Тема запроса' },
]

const extraPayloadLabels: Record<string, string> = {
  custom_area: 'Своя область права',
  custom_direction: 'Свое направление',
  custom_situation: 'Своя ситуация',
  custom_expected_result: 'Свой ожидаемый результат',
}

function parseDate(value: string | undefined): Date | null {
  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function mapPayloadDetails(payload: Record<string, string>): ClientRequestDetail[] {
  const details: ClientRequestDetail[] = []
  const handledKeys = new Set<string>()

  for (const field of payloadFields) {
    const rawValue = payload[field.key]?.trim() ?? ''
    const explicitTitle = field.titleKey ? payload[field.titleKey]?.trim() ?? '' : ''
    const customValue = field.customKey ? payload[field.customKey]?.trim() ?? '' : ''
    const value = explicitTitle
      || (rawValue === 'other' && customValue
        ? customValue
        : field.valueTitles?.get(rawValue) ?? rawValue)

    handledKeys.add(field.key)

    if (field.titleKey) {
      handledKeys.add(field.titleKey)
    }

    if (field.customKey && (rawValue || explicitTitle)) {
      handledKeys.add(field.customKey)
    }

    if (value) {
      details.push({ key: field.key, label: field.label, value })
    }
  }

  for (const [key, rawValue] of Object.entries(payload)) {
    const value = rawValue.trim()

    if (!value || handledKeys.has(key) || key.endsWith('_title')) {
      continue
    }

    details.push({
      key,
      label: extraPayloadLabels[key] ?? 'Дополнительные сведения',
      value,
    })
  }

  return details
}

function requireClientId(id: number | undefined): number {
  if (!Number.isInteger(id) || Number(id) < 1) {
    throw new Error('В ответе клиента отсутствует корректный идентификатор.')
  }

  return id as number
}

function mapClientBase(client: ClientSummaryDto): ClientListItem {
  return {
    id: requireClientId(client.id),
    fullName: client.full_name?.trim() || 'Без имени',
    phone: client.phone_number?.trim() || null,
    email: client.email?.trim() || null,
  }
}

function mapRequest(clientId: number, form: ClientFormDto, index: number): ClientRequest {
  const createdAt = parseDate(form.created_at)
  const updatedAt = parseDate(form.updated_at)
  const payload = { ...(form.payload ?? {}) }

  return {
    id: `${clientId}-${form.created_at ?? 'unknown'}-${index}`,
    details: mapPayloadDetails(payload),
    createdAt,
    updatedAt,
  }
}

export class ClientMapper {
  static fromSummary(client: ClientSummaryDto): ClientListItem {
    return mapClientBase(client)
  }

  static fromSummaryList(clients: ClientSummaryDto[]): ClientListItem[] {
    return clients.map((client) => this.fromSummary(client))
  }

  static fromDetails(client: ClientDetailsDto): ClientDetails {
    const base = mapClientBase(client)
    const requests = (client.forms ?? [])
      .map((form, index) => mapRequest(base.id, form, index))
      .sort(
        (left, right) =>
          (right.createdAt?.getTime() ?? 0) - (left.createdAt?.getTime() ?? 0),
      )

    return {
      ...base,
      requests,
    }
  }
}

import type { ClientDetailsDto, ClientFormDto } from '../api/ApiDto'
import type { ApplicationRecord } from '../models/Application'

function parseDate(value: string | undefined): Date | null {
  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export class ApplicationMapper {
  static fromClient(client: ClientDetailsDto): ApplicationRecord[] {
    if (!Number.isInteger(client.id) || Number(client.id) < 1) {
      throw new Error('В ответе клиента отсутствует корректный идентификатор.')
    }

    const clientId = client.id as number

    return (client.forms ?? []).map((form, index) =>
      this.fromForm(clientId, client, form, index),
    )
  }

  private static fromForm(
    clientId: number,
    client: ClientDetailsDto,
    form: ClientFormDto,
    index: number,
  ): ApplicationRecord {
    const createdAt = parseDate(form.created_at)
    const updatedAt = parseDate(form.updated_at)

    return {
      id: `${clientId}-${form.created_at ?? 'unknown'}-${index}`,
      clientId,
      fullName: client.full_name?.trim() || 'Без имени',
      phone: client.phone_number?.trim() || 'Не указан',
      email: client.email?.trim() || null,
      payload: { ...(form.payload ?? {}) },
      createdAt,
      updatedAt,
    }
  }
}

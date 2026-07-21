export interface ApplicationDetail {
  key: string
  label: string
  value: string
}

export interface ApplicationRecord {
  id: string
  clientId: number
  fullName: string
  phone: string
  email: string | null
  payload: Record<string, string>
  details: ApplicationDetail[]
  createdAt: Date | null
  updatedAt: Date | null
}

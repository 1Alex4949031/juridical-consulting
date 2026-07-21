export interface ApplicationRecord {
  id: string
  clientId: number
  fullName: string
  phone: string
  email: string | null
  payload: Record<string, string>
  createdAt: Date | null
  updatedAt: Date | null
}

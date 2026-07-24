export interface ClientListItem {
  id: number
  fullName: string
  phone: string | null
  email: string | null
}

export interface ClientRequestDetail {
  key: string
  label: string
  value: string
}

export interface ClientRequest {
  id: string
  details: ClientRequestDetail[]
  createdAt: Date | null
  updatedAt: Date | null
}

export interface ClientDetails extends ClientListItem {
  requests: ClientRequest[]
}

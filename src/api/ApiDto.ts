export interface IntakeOptionDto {
  id?: string | number
  title?: string
}

export interface FormResponseDto {
  id?: number
}

export interface ClientSummaryDto {
  id?: number
  full_name?: string
  phone_number?: string
  email?: string
}

export interface ClientFormDto {
  payload?: Record<string, string>
  created_at?: string
  updated_at?: string
}

export interface ClientDetailsDto extends ClientSummaryDto {
  forms?: ClientFormDto[]
}

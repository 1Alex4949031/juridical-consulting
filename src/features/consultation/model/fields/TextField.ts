import { z } from 'zod'
import { AbstractField } from './AbstractField'

export interface TextFieldOptions {
  name: string
  label: string
  initialValue?: string
  required?: boolean
  requiredMessage?: string
  maxLength?: number
}

export class TextField extends AbstractField<string> {
  constructor(options: TextFieldOptions) {
    const {
      name,
      label,
      initialValue = '',
      required = false,
      requiredMessage = `Укажите поле «${label}».`,
      maxLength = 500,
    } = options

    let schema = z.string().trim().max(maxLength, `Максимальная длина: ${maxLength} символов.`)

    if (required) {
      schema = schema.min(1, requiredMessage)
    }

    super({
      name,
      label,
      initialValue,
      schema,
    })
  }

  validateRequired(message: string) {
    if (!this.value.trim()) {
      this.setExternalError(message)
      return false
    }

    return this.validate()
  }
}

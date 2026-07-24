import { z } from 'zod'
import { getRussianPhoneError, normalizeRussianPhone } from '../../../../domain/phone'
import { AbstractField } from './AbstractField'

export class PhoneField extends AbstractField<string> {
  constructor() {
    super({
      name: 'phone',
      label: 'Телефон',
      initialValue: '',
      schema: z.string().superRefine((value, context) => {
        const message = getRussianPhoneError(value)

        if (message) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message,
          })
        }
      }),
    })
  }

  get normalizedValue() {
    return normalizeRussianPhone(this.value)
  }
}

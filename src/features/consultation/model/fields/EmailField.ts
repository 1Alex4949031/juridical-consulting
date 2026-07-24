import { z } from 'zod'
import { AbstractField } from './AbstractField'

const emailSchema = z.string().trim().refine(
  (value) => !value || z.string().email().safeParse(value).success,
  'Введите электронную почту в формате name@example.ru.',
)

export class EmailField extends AbstractField<string> {
  constructor() {
    super({
      name: 'email',
      label: 'Электронная почта',
      initialValue: '',
      schema: emailSchema,
    })
  }
}

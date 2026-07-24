import { z } from 'zod'
import { AbstractField } from './AbstractField'

export interface SelectFieldOptions {
  name: string
  label: string
  initialValue?: string
  requiredMessage?: string
}

export class SelectField extends AbstractField<string> {
  constructor(options: SelectFieldOptions) {
    super({
      name: options.name,
      label: options.label,
      initialValue: options.initialValue ?? '',
      schema: z.string().trim().min(
        1,
        options.requiredMessage ?? `Выберите поле «${options.label}».`,
      ),
    })
  }
}

import { z } from 'zod'
import { AbstractField } from './AbstractField'

export interface CheckboxFieldOptions {
  name: string
  label: string
  requiredMessage?: string
}

export class CheckboxField extends AbstractField<boolean> {
  constructor(options: CheckboxFieldOptions) {
    super({
      name: options.name,
      label: options.label,
      initialValue: false,
      schema: z.boolean().refine(
        (value) => value,
        options.requiredMessage ?? `Подтвердите поле «${options.label}».`,
      ),
    })
  }
}

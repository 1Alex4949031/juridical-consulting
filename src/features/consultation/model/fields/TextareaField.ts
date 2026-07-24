import { TextField, type TextFieldOptions } from './TextField'

export class TextareaField extends TextField {
  constructor(options: TextFieldOptions) {
    super({
      maxLength: 2_000,
      ...options,
    })
  }
}

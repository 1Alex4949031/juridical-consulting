import type { ZodType } from 'zod'

export interface FieldOptions<T> {
  name: string
  label: string
  initialValue: T
  schema: ZodType<T>
}

export abstract class AbstractField<T> {
  value: T
  touched = false
  errors: string[] = []

  readonly name: string
  readonly label: string
  readonly initialValue: T

  private readonly getValidationErrors: (value: T) => string[]

  protected constructor(options: FieldOptions<T>) {
    this.name = options.name
    this.label = options.label
    this.initialValue = options.initialValue
    this.value = options.initialValue
    const schema = options.schema
    this.getValidationErrors = (value) => {
      const result = schema.safeParse(value)
      return result.success
        ? []
        : result.error.issues.map((issue) => issue.message)
    }
  }

  get dirty() {
    return !Object.is(this.value, this.initialValue)
  }

  get error() {
    return this.errors[0] ?? ''
  }

  get valid() {
    return this.errors.length === 0
  }

  setValue(value: T) {
    this.value = value

    if (this.touched) {
      this.validate(false)
    }
  }

  touch() {
    this.touched = true
    this.validate(false)
  }

  validate(touch = true) {
    if (touch) {
      this.touched = true
    }

    this.errors = this.getValidationErrors(this.value)

    return this.errors.length === 0
  }

  setExternalError(message: string) {
    this.touched = true
    this.errors = message ? [message] : []
  }

  clearValidation() {
    this.errors = []
  }

  reset() {
    this.value = this.initialValue
    this.touched = false
    this.errors = []
  }
}

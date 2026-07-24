import { describe, expect, it } from 'vitest'
import {
  CheckboxField,
  EmailField,
  PhoneField,
  TextField,
} from '../src/features/consultation/model/fields'

describe('form fields', () => {
  it('tracks dirty, touched and reset state', () => {
    const field = new TextField({
      name: 'name',
      label: 'ФИО',
      required: true,
      requiredMessage: 'Укажите ФИО.',
    })

    expect(field.dirty).toBe(false)
    expect(field.validate()).toBe(false)
    expect(field.error).toBe('Укажите ФИО.')
    expect(field.touched).toBe(true)

    field.setValue('Анна Смирнова')

    expect(field.dirty).toBe(true)
    expect(field.error).toBe('')

    field.reset()

    expect(field.value).toBe('')
    expect(field.touched).toBe(false)
    expect(field.dirty).toBe(false)
  })

  it('validates and normalizes a Russian phone', () => {
    const field = new PhoneField()

    field.setValue('+7 913 123 45 67')

    expect(field.validate()).toBe(true)
    expect(field.normalizedValue).toBe('+79131234567')

    field.setValue('+7 913 123')

    expect(field.validate()).toBe(false)
    expect(field.error).toContain('11 цифр')
  })

  it('allows an empty optional email and rejects malformed values', () => {
    const field = new EmailField()

    expect(field.validate()).toBe(true)

    field.setValue('invalid')

    expect(field.validate()).toBe(false)
    expect(field.error).toContain('name@example.ru')
  })

  it('requires consent', () => {
    const field = new CheckboxField({
      name: 'consent',
      label: 'Согласие',
      requiredMessage: 'Нужно согласие.',
    })

    expect(field.validate()).toBe(false)
    expect(field.error).toBe('Нужно согласие.')

    field.setValue(true)

    expect(field.validate()).toBe(true)
  })
})

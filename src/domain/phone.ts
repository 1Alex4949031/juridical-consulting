const allowedPhoneCharacters = /^[+\d\s()-]+$/

export function formatRussianPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  const nationalNumber = (digits.startsWith('7') || digits.startsWith('8')
    ? digits.slice(1)
    : digits
  ).slice(0, 10)
  const groups = [
    nationalNumber.slice(0, 3),
    nationalNumber.slice(3, 6),
    nationalNumber.slice(6, 8),
    nationalNumber.slice(8, 10),
  ].filter(Boolean)

  return ['+7', ...groups].join(' ')
}

export function normalizeRussianPhone(value: string): string | null {
  const trimmedValue = value.trim()

  if (!trimmedValue || !allowedPhoneCharacters.test(trimmedValue)) {
    return null
  }

  let digits = trimmedValue.replace(/\D/g, '')

  if (digits.length === 11 && digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  }

  if (digits.length !== 11 || !digits.startsWith('7')) {
    return null
  }

  return `+${digits}`
}

export function getRussianPhoneError(value: string): string {
  if (!value.trim()) {
    return 'Укажите телефон.'
  }

  if (!normalizeRussianPhone(value)) {
    return 'Введите 11 цифр в формате +7 913 123 45 67.'
  }

  return ''
}

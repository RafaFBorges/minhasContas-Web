export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function notEmpty(value: string) {
  return value.trim() !== ''
}

export function validateStrongPassword(value: string): boolean {
  // Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(value)
}

export function validateDate(value: string): boolean {
  if (!value)
    return false

  // Aceita dd/mm/yyyy ou yyyy-mm-dd
  const brFormat = /^(\d{2})\/(\d{2})\/(\d{4})$/
  const isoFormat = /^(\d{4})-(\d{2})-(\d{2})$/

  let day: number, month: number, year: number

  const brMatch = value.match(brFormat)
  const isoMatch = value.match(isoFormat)

  if (brMatch) {
    day = parseInt(brMatch[1])
    month = parseInt(brMatch[2])
    year = parseInt(brMatch[3])
  } else if (isoMatch) {
    year = parseInt(isoMatch[1])
    month = parseInt(isoMatch[2])
    day = parseInt(isoMatch[3])
  } else {
    return false
  }

  if (day < 1 || month < 1 || 12 < month)
    return false

  if (year < 1900 || new Date().getFullYear() < year)
    return false

  const daysInMonth = new Date(year, month, 0).getDate()

  if (daysInMonth < day)
    return false

  return true
}

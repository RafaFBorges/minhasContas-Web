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

  const date = new Date(value)
  if (isNaN(date.getTime()))
    return false

  const now = new Date()
  const minDate = new Date('1900-01-01')

  return minDate <= date && date <= now
}

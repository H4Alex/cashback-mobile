/** Input validation helpers for CPF, CNPJ, email, phone, password, and financial values. */

/**
 * Validate email format using a basic regex pattern.
 * @param email - Email address to validate
 * @returns true if the email matches a valid format
 * @example isValidEmail('user@example.com') // true
 * @example isValidEmail('invalid') // false
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Check if a password meets the minimum length requirement (8 characters).
 * For stronger validation with multiple criteria, use {@link isStrongPassword}.
 * @param password - Password to validate
 * @returns true if password has at least 8 characters
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8
}

/**
 * Validate a Brazilian phone number (10 or 11 digits).
 * Accepts formatted or raw input — non-digit characters are stripped.
 * @param phone - Phone number (e.g. "(11) 99999-9999" or "11999999999")
 * @returns true if the phone has 10-11 digits
 * @example isValidPhone('(11) 99999-9999') // true
 */
export const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 11
}

const digit = (s: string, i: number): number => s.charCodeAt(i) - 48

export const isValidCpf = (cpf: string): boolean => {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += digit(digits, i) * (10 - i)
  let rest = (sum * 10) % 11
  if (rest === 10) rest = 0
  if (rest !== digit(digits, 9)) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += digit(digits, i) * (11 - i)
  rest = (sum * 10) % 11
  if (rest === 10) rest = 0
  return rest === digit(digits, 10)
}

const cnpjWeight = (i: number, start: number): number => (i < start - 1 ? start - i : start + 8 - i)

export const isValidCnpj = (cnpj: string): boolean => {
  const digits = cnpj.replace(/\D/g, '')
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false
  let sum = 0
  for (let i = 0; i < 12; i++) sum += digit(digits, i) * cnpjWeight(i, 5)
  let rest = sum % 11
  if (rest < 2) rest = 0
  else rest = 11 - rest
  if (rest !== digit(digits, 12)) return false
  sum = 0
  for (let i = 0; i < 13; i++) sum += digit(digits, i) * cnpjWeight(i, 6)
  rest = sum % 11
  if (rest < 2) rest = 0
  else rest = 11 - rest
  return rest === digit(digits, 13)
}

/**
 * Validate either a CPF (11 digits) or CNPJ (14 digits).
 * Delegates to {@link isValidCpf} or {@link isValidCnpj} based on length.
 * @param value - CPF or CNPJ string (formatted or raw)
 * @returns true if the document number is valid
 * @example isValidCpfCnpj('12345678900') // validates as CPF
 * @example isValidCpfCnpj('11222333000181') // validates as CNPJ
 */
export const isValidCpfCnpj = (value: string): boolean => {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 11) return isValidCpf(value)
  if (digits.length === 14) return isValidCnpj(value)
  return false
}

/**
 * Check password strength against multiple criteria.
 * Requires: min 8 chars, 1 uppercase, 1 lowercase, 1 digit.
 * @param password - Password to check
 * @returns Object with `valid` boolean and `errors` array of unmet criteria
 * @example isStrongPassword('Abc12345') // { valid: true, errors: [] }
 * @example isStrongPassword('abc') // { valid: false, errors: ['Mínimo 8 caracteres', ...] }
 */
export const isStrongPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  if (password.length < 8) errors.push('Mínimo 8 caracteres')
  if (!/[A-Z]/.test(password)) errors.push('Pelo menos 1 letra maiúscula')
  if (!/[a-z]/.test(password)) errors.push('Pelo menos 1 letra minúscula')
  if (!/\d/.test(password)) errors.push('Pelo menos 1 número')
  return { valid: errors.length === 0, errors }
}

/**
 * Validate that a start date is not after an end date.
 * @param start - Start date as ISO string
 * @param end - End date as ISO string
 * @returns true if start <= end and both are non-empty
 * @example isValidDateRange('2025-01-01', '2025-12-31') // true
 */
export const isValidDateRange = (start: string, end: string): boolean => {
  if (!start || !end) return false
  return new Date(start) <= new Date(end)
}

/**
 * Validate a percentage value (must be between 0 exclusive and 100 inclusive).
 * @param value - Percentage to validate
 * @returns true if 0 < value <= 100
 * @example isValidPercentual(5) // true
 * @example isValidPercentual(0) // false
 */
export const isValidPercentual = (value: number): boolean => {
  return value > 0 && value <= 100
}

/**
 * Validate a monetary value (must be positive and finite).
 * @param value - Amount in BRL to validate
 * @returns true if value > 0 and is finite
 * @example isValidMonetaryValue(100.50) // true
 * @example isValidMonetaryValue(-10) // false
 */
export const isValidMonetaryValue = (value: number): boolean => {
  return value > 0 && isFinite(value)
}

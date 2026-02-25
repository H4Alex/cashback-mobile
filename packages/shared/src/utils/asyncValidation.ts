/**
 * Async validation utilities for form fields.
 * Used with React Hook Form's `validate` option for debounced server-side checks.
 *
 * @example
 * // In a Controller or register call:
 * register('email', { validate: { unique: createAsyncValidator(validateEmailUnique, 500) } })
 */

type AsyncValidatorFn = (value: string) => Promise<string | true>

const pendingValidations = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Creates a debounced async validator compatible with React Hook Form.
 * Returns `true` if valid, or an error string if invalid.
 */
export function createAsyncValidator(
  validatorFn: AsyncValidatorFn,
  debounceMs = 500
): (value: string) => Promise<string | true> {
  const key = validatorFn.name || Math.random().toString(36)

  return (value: string) => {
    return new Promise<string | true>((resolve) => {
      const existing = pendingValidations.get(key)
      if (existing) clearTimeout(existing)

      const timer = setTimeout(async () => {
        pendingValidations.delete(key)
        try {
          const result = await validatorFn(value)
          resolve(result)
        } catch {
          resolve(true) // On network error, don't block the form
        }
      }, debounceMs)

      pendingValidations.set(key, timer)
    })
  }
}

/**
 * Check if an email is already registered.
 * TODO(API-007): Replace mock with actual API call — GET /api/auth/check-email?email=...
 */
export async function validateEmailUnique(email: string): Promise<string | true> {
  if (!email) return true
  // Placeholder — always returns valid until API is connected
  await Promise.resolve()
  return true
}

/**
 * Check if a CNPJ is already registered.
 * TODO(API-008): Replace mock with actual API call — GET /api/empresas/check-cnpj?cnpj=...
 */
export async function validateCnpjUnique(cnpj: string): Promise<string | true> {
  if (!cnpj) return true
  const digits = cnpj.replace(/\D/g, '')
  if (digits.length !== 14) return true // Skip check for incomplete CNPJs
  // Placeholder — always returns valid until API is connected
  await Promise.resolve()
  return true
}

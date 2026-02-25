/**
 * Password strength utility.
 */
export interface PasswordStrength {
  score: number
  label: string
  color: string
}

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Fraca', color: '#EF4444' }
  if (score <= 2) return { score, label: 'Razoável', color: '#F59E0B' }
  if (score <= 3) return { score, label: 'Boa', color: '#3B82F6' }
  return { score, label: 'Forte', color: '#22C55E' }
}

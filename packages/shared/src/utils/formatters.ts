/**
 * Currency, date, CPF, phone, and text formatting utilities.
 * All locale-sensitive formatters accept an optional `locale` parameter
 * that defaults to 'pt-BR' for backward compatibility.
 */

/** Default locale used by all formatting functions. */
const DEFAULT_LOCALE = 'pt-BR'

/**
 * Format a number as currency.
 * @param value - Numeric amount to format
 * @param locale - BCP 47 locale tag (default: 'pt-BR')
 * @param currency - ISO 4217 currency code (default: 'BRL')
 * @returns Formatted string, e.g. "R$ 1.234,56"
 * @example formatCurrency(1234.56) // "R$ 1.234,56"
 * @example formatCurrency(1234.56, 'en-US', 'USD') // "$1,234.56"
 */
export function formatCurrency(value: number, locale = DEFAULT_LOCALE, currency = 'BRL'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Format a date as dd/mm/yyyy (locale-aware).
 * @param date - ISO string or Date object
 * @param locale - BCP 47 locale tag (default: 'pt-BR')
 * @returns Formatted date string, e.g. "25/12/2025"
 */
export function formatDate(date: string | Date, locale = DEFAULT_LOCALE): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale).format(d)
}

/**
 * Format a date with time (locale-aware).
 * @param date - ISO string or Date object
 * @param locale - BCP 47 locale tag (default: 'pt-BR')
 * @returns Formatted date-time string, e.g. "25/12/2025, 14:30"
 */
export function formatDateTime(date: string | Date, locale = DEFAULT_LOCALE): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d)
}

/**
 * Format a date as relative time (e.g. "ha 5 min", "ha 3h", "ha 2d").
 * Falls back to absolute date for dates older than 7 days.
 * @param date - ISO string or Date object
 * @param locale - BCP 47 locale tag (default: 'pt-BR')
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date, locale = DEFAULT_LOCALE): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (diffSec < 60) return rtf.format(-diffSec, 'second')
  const diffMins = Math.floor(diffSec / 60)
  if (diffMins < 60) return rtf.format(-diffMins, 'minute')
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return rtf.format(-diffHours, 'hour')
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return rtf.format(-diffDays, 'day')

  return formatDate(d, locale)
}

/**
 * Format a CPF number with dots and dash (XXX.XXX.XXX-XX).
 * @param cpf - Raw CPF string (digits only or already formatted)
 * @returns Formatted CPF string
 * @example formatCPF('12345678900') // "123.456.789-00"
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '')
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Format a Brazilian phone number with area code.
 * Handles both 10-digit (landline) and 11-digit (mobile) numbers.
 * @param phone - Raw phone string (digits only or already formatted)
 * @returns Formatted phone string, e.g. "(11) 99999-9999"
 * @example formatPhone('11999999999') // "(11) 99999-9999"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

/**
 * Format a number as a percentage string.
 * @param value - Numeric percentage value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string, e.g. "12.5%"
 * @example formatPercent(12.5) // "12.5%"
 * @example formatPercent(100, 0) // "100%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Truncate text to a maximum length, appending "..." if truncated.
 * @param text - Text to truncate
 * @param maxLength - Maximum allowed length (including ellipsis)
 * @returns Truncated or original string
 * @example truncate('Hello World', 8) // "Hello..."
 * @example truncate('Short', 10) // "Short"
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

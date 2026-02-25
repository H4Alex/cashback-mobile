/**
 * Platform-agnostic secure storage abstraction.
 * Each platform (web/mobile) must call initSecureStorage() to inject its implementation.
 */

export interface SecureStorageAdapter {
  setItem: (key: string, value: string) => Promise<void>
  getItem: (key: string) => Promise<string | null>
  removeItem: (key: string) => void | Promise<void>
}

let _adapter: SecureStorageAdapter | null = null

export function initSecureStorage(adapter: SecureStorageAdapter): void {
  _adapter = adapter
}

function getAdapter(): SecureStorageAdapter {
  if (!_adapter) {
    throw new Error(
      '@cashback/shared: SecureStorage not initialized. Call initSecureStorage() first.'
    )
  }
  return _adapter
}

export async function secureSetItem<T>(key: string, value: T): Promise<void> {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value)
  await getAdapter().setItem(key, serialized)
}

export async function secureGetItem<T>(key: string): Promise<T | null> {
  const raw = await getAdapter().getItem(key)
  if (raw === null) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return raw as unknown as T
  }
}

export function secureRemoveItem(key: string): void {
  getAdapter().removeItem(key)
}

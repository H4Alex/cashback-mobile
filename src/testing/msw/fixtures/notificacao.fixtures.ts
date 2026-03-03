/**
 * Notification fixtures — mobile consumer notifications.
 *
 * Every factory calls `schema.parse()` to guarantee the mock
 * matches the contract schemas exactly.
 */
import { faker } from '@faker-js/faker/locale/pt_BR'
import {
  notificationSchema,
  notificationPreferencesSchema,
} from '@/src/contracts/schemas'
import type {
  MobileNotification,
  NotificationPreferences,
} from '@/src/contracts/schemas'

// ─── Factories ──────────────────────────────────────────────

export function createMockNotification(
  overrides: Partial<MobileNotification> = {},
): MobileNotification {
  return notificationSchema.parse({
    id: faker.number.int({ min: 1, max: 99_999 }),
    titulo: faker.lorem.sentence({ min: 3, max: 8 }),
    mensagem: faker.lorem.paragraph({ min: 1, max: 3 }),
    tipo: faker.helpers.arrayElement([
      'cashback_gerado',
      'cashback_expirado',
      'campanha_nova',
      'sistema',
    ]),
    lida: faker.datatype.boolean(),
    dados_extras: faker.helpers.maybe(
      () => ({ transacao_id: faker.number.int({ min: 1, max: 99_999 }) }),
      { probability: 0.4 },
    ) ?? null,
    created_at: faker.date.past().toISOString(),
    ...overrides,
  })
}

export function createMockNotificationList(count = 10): MobileNotification[] {
  return Array.from({ length: count }, () => createMockNotification())
}

export function createMockNotificationPreferences(
  overrides: Partial<NotificationPreferences> = {},
): NotificationPreferences {
  return notificationPreferencesSchema.parse({
    push_enabled: true,
    email_enabled: true,
    marketing_enabled: false,
    ...overrides,
  })
}

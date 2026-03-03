/**
 * Notificacao domain fixtures — schema-validated mock factories.
 */
import { faker } from "@faker-js/faker/locale/pt_BR";
import {
  notificationSchema,
  notificationPreferencesSchema,
} from "@/src/contracts/schemas";

// ─── MobileNotification ─────────────────────────────────────

export function createMockNotification(overrides?: Record<string, unknown>) {
  return notificationSchema.parse({
    id: faker.number.int({ min: 1, max: 99999 }),
    titulo: faker.lorem.sentence({ min: 3, max: 6 }),
    mensagem: faker.lorem.sentence({ min: 5, max: 15 }),
    tipo: faker.helpers.arrayElement([
      "cashback_recebido",
      "cashback_expirado",
      "promo",
      "sistema",
    ]),
    lida: faker.datatype.boolean(),
    dados_extras: faker.helpers.maybe(
      () => ({ transacao_id: faker.number.int({ min: 1, max: 99999 }) }),
      { probability: 0.5 },
    ) ?? null,
    created_at: faker.date.past().toISOString(),
    ...overrides,
  });
}

export function createMockNotificationList(count = 5) {
  return Array.from({ length: count }, () => createMockNotification());
}

// ─── NotificationPreferences ────────────────────────────────

export function createMockNotificationPreferences(
  overrides?: Record<string, unknown>,
) {
  return notificationPreferencesSchema.parse({
    push_enabled: true,
    email_enabled: true,
    marketing_enabled: false,
    ...overrides,
  });
}

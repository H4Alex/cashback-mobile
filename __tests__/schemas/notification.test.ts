import { notificationPreferencesSchema } from '@/src/schemas/notification';

describe('notificationPreferencesSchema', () => {
  it('validates correct preferences', () => {
    const result = notificationPreferencesSchema.safeParse({
      push_enabled: true,
      email_enabled: false,
      marketing_enabled: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing fields', () => {
    const result = notificationPreferencesSchema.safeParse({
      push_enabled: true,
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-boolean values', () => {
    const result = notificationPreferencesSchema.safeParse({
      push_enabled: 'yes',
      email_enabled: false,
      marketing_enabled: true,
    });
    expect(result.success).toBe(false);
  });
});

import { z } from "zod";

export const notificationPreferencesSchema = z.object({
  push_enabled: z.boolean(),
  email_enabled: z.boolean(),
  marketing_enabled: z.boolean(),
});
export type NotificationPreferencesFormData = z.infer<typeof notificationPreferencesSchema>;

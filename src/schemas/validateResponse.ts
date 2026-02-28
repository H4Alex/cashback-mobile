import type { z } from "zod";

const isDev = __DEV__;

export function validateResponse<T extends z.ZodType>(
  schema: T,
  data: unknown,
  label: string,
): z.infer<T> {
  if (!isDev) return data as z.infer<T>;

  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn(
      `[Contract Mismatch] ${label}`,
      "\nIssues:", result.error.issues,
      "\nReceived:", JSON.stringify(data, null, 2),
    );
  }
  return data as z.infer<T>;
}

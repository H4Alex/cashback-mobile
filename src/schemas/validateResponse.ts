/**
 * Runtime response validation — delegates to contract violation system.
 */
import type { z } from "zod";
import { validateWithSchema } from "@/contracts/apiCall";

export function validateResponse<T extends z.ZodType>(
  schema: T,
  data: unknown,
  label: string
): z.infer<T> {
  return validateWithSchema(schema, data, label);
}

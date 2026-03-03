/**
 * API Call com validação runtime via Zod safeParse — Mobile.
 *
 * Graceful degradation: se o safeParse falhar, retorna response.data as T.
 * Em dev: loga violações detalhadas. Em prod: reporta silenciosamente.
 */
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type { z } from "zod";

const isDev = __DEV__;

interface ContractViolation {
  endpoint: string;
  method: string;
  errors: z.typeToFlattenedError<unknown>;
  timestamp: string;
}

const violations: ContractViolation[] = [];

function reportContractViolation(violation: ContractViolation): void {
  violations.push(violation);
  if (isDev) {
    console.warn(
      `[Contract Violation] ${violation.method} ${violation.endpoint}`,
      violation.errors.fieldErrors
    );
  }
}

export function getContractViolations(): readonly ContractViolation[] {
  return violations;
}

export function clearContractViolations(): void {
  violations.length = 0;
}

interface ApiCallOptions<T extends z.ZodTypeAny> {
  schema: T;
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: unknown;
  params?: Record<string, unknown>;
  config?: AxiosRequestConfig;
}

export async function apiCall<T extends z.ZodTypeAny>(
  httpClient: AxiosInstance,
  options: ApiCallOptions<T>
): Promise<z.infer<T>> {
  const { schema, url, method, data, params, config } = options;

  const response = await httpClient.request({
    url,
    method,
    data,
    params,
    ...config,
  });

  const parsed = schema.safeParse(response.data);
  if (!parsed.success) {
    reportContractViolation({
      endpoint: url,
      method,
      errors: parsed.error.flatten(),
      timestamp: new Date().toISOString(),
    });
    return response.data as z.infer<T>;
  }

  return parsed.data;
}

export function validateWithSchema<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  label: string
): z.infer<T> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    reportContractViolation({
      endpoint: label,
      method: "VALIDATE",
      errors: parsed.error.flatten(),
      timestamp: new Date().toISOString(),
    });
    return data as z.infer<T>;
  }
  return parsed.data;
}

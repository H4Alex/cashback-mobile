import type { InternalAxiosRequestConfig } from "axios";
import { sslPinningInterceptor, validateApiHost } from "@/src/lib/ssl-pinning";

// Control isProd from tests — jest.mock is hoisted above imports by babel-jest
let mockIsProd = false;
let mockApiBaseUrl = "http://localhost:3000";

jest.mock("@/src/config/env", () => ({
  get isProd() {
    return mockIsProd;
  },
  get isDev() {
    return !mockIsProd;
  },
  get env() {
    return {
      API_BASE_URL: mockApiBaseUrl,
      SENTRY_DSN: "",
      APP_ENV: mockIsProd ? "production" : "development",
    };
  },
}));

function makeConfig(
  overrides: Partial<InternalAxiosRequestConfig> = {},
): InternalAxiosRequestConfig {
  return {
    headers: {} as any,
    ...overrides,
  };
}

describe("sslPinningInterceptor", () => {
  afterEach(() => {
    mockIsProd = false;
  });

  // ── Dev mode ──
  it("passes through any config in dev mode", () => {
    mockIsProd = false;
    const config = makeConfig({ url: "http://evil.com/steal" });
    expect(sslPinningInterceptor(config)).toBe(config);
  });

  // ── Production: allowed hosts ──
  it("allows requests to api.h4cashback.com in production", () => {
    mockIsProd = true;
    const config = makeConfig({
      baseURL: "https://api.h4cashback.com",
      url: "/api/v1/cashback",
    });
    expect(sslPinningInterceptor(config)).toBe(config);
  });

  it("allows requests to u.expo.dev in production", () => {
    mockIsProd = true;
    const config = makeConfig({
      url: "https://u.expo.dev/update",
    });
    expect(sslPinningInterceptor(config)).toBe(config);
  });

  // ── Production: disallowed host ──
  it("throws for disallowed host in production", () => {
    mockIsProd = true;
    const config = makeConfig({
      url: "https://evil.example.com/steal",
    });
    expect(() => sslPinningInterceptor(config)).toThrow("[SSL] Host not allowed: evil.example.com");
  });

  // ── Production: cannot determine host ──
  it("throws when URL is empty in production", () => {
    mockIsProd = true;
    const config = makeConfig({ url: undefined, baseURL: undefined });
    expect(() => sslPinningInterceptor(config)).toThrow("[SSL] Cannot determine request host");
  });

  it("throws when URL is malformed in production", () => {
    mockIsProd = true;
    const config = makeConfig({ url: "not-a-valid-url" });
    expect(() => sslPinningInterceptor(config)).toThrow("[SSL] Cannot determine request host");
  });

  // ── Production: HTTPS enforcement ──
  it("throws for HTTP (non-localhost) in production", () => {
    mockIsProd = true;
    const config = makeConfig({
      url: "http://api.h4cashback.com/api/v1/test",
    });
    expect(() => sslPinningInterceptor(config)).toThrow("[SSL] HTTPS required in production");
  });

  // ── Production: baseURL + url combination ──
  it("constructs full URL from baseURL + url", () => {
    mockIsProd = true;
    const config = makeConfig({
      baseURL: "https://api.h4cashback.com",
      url: "/api/v1/data",
    });
    const result = sslPinningInterceptor(config);
    expect(result).toBe(config);
  });

  it("uses url alone when baseURL is absent", () => {
    mockIsProd = true;
    const config = makeConfig({
      url: "https://api.h4cashback.com/api/v1/data",
    });
    expect(sslPinningInterceptor(config)).toBe(config);
  });

  it("uses empty string for url when url is undefined", () => {
    mockIsProd = true;
    const config = makeConfig({
      baseURL: "https://api.h4cashback.com",
      url: undefined,
    });
    expect(sslPinningInterceptor(config)).toBe(config);
  });
});

describe("validateApiHost", () => {
  afterEach(() => {
    mockIsProd = false;
    mockApiBaseUrl = "http://localhost:3000";
  });

  it("does nothing in dev mode", () => {
    mockIsProd = false;
    mockApiBaseUrl = "http://evil.com";
    expect(() => validateApiHost()).not.toThrow();
  });

  it("passes for allowed host in production", () => {
    mockIsProd = true;
    mockApiBaseUrl = "https://api.h4cashback.com";
    expect(() => validateApiHost()).not.toThrow();
  });

  it("throws for disallowed host in production", () => {
    mockIsProd = true;
    mockApiBaseUrl = "https://evil.example.com";
    expect(() => validateApiHost()).toThrow("[SSL] API_BASE_URL points to disallowed host");
  });

  it("throws for malformed API_BASE_URL in production", () => {
    mockIsProd = true;
    mockApiBaseUrl = "not-a-url";
    expect(() => validateApiHost()).toThrow("[SSL] API_BASE_URL points to disallowed host");
  });

  it("throws for empty API_BASE_URL in production", () => {
    mockIsProd = true;
    mockApiBaseUrl = "";
    expect(() => validateApiHost()).toThrow("[SSL] API_BASE_URL points to disallowed host");
  });
});

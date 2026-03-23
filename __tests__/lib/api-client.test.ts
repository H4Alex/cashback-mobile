import { saveTokens, clearTokens, getToken, apiClient } from "@/src/lib/api-client";
import * as SecureStore from "expo-secure-store";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("@/src/lib/ssl-pinning", () => ({
  sslPinningInterceptor: (config: unknown) => config,
}));

jest.mock("@/src/config/env", () => ({
  env: { API_BASE_URL: "http://test.api", SENTRY_DSN: "", APP_ENV: "test" },
}));

// Mock adapter to avoid real HTTP calls while letting interceptors run
function mockAdapter(status = 200, data: unknown = {}) {
  return async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => ({
    data,
    status,
    statusText: "OK",
    headers: {},
    config,
  });
}

describe("api-client token helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveTokens", () => {
    it("saves auth token to SecureStore", async () => {
      await saveTokens("my-token");
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("auth_token", "my-token");
    });

    it("saves refresh token when provided", async () => {
      await saveTokens("my-token", "my-refresh");
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("auth_token", "my-token");
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("refresh_token", "my-refresh");
    });

    it("does not save refresh token when not provided", async () => {
      await saveTokens("my-token");
      expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe("clearTokens", () => {
    it("deletes both tokens from SecureStore", async () => {
      await clearTokens();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("refresh_token");
    });
  });

  describe("getToken", () => {
    it("retrieves auth token from SecureStore", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("stored-token");
      const token = await getToken();
      expect(token).toBe("stored-token");
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("auth_token");
    });

    it("returns null when no token stored", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      const token = await getToken();
      expect(token).toBeNull();
    });
  });
});

describe("api-client interceptors", () => {
  const originalAdapter = apiClient.defaults.adapter;

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter;
    jest.clearAllMocks();
  });

  it("attaches Authorization header when token exists", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("jwt-token-123");
    apiClient.defaults.adapter = mockAdapter(200, { ok: true });

    const response = await apiClient.get("/test");
    // The request interceptor should have added the Authorization header
    expect(response.config.headers.Authorization).toBe("Bearer jwt-token-123");
  });

  it("does not attach Authorization when no token", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    apiClient.defaults.adapter = mockAdapter(200, { ok: true });

    const response = await apiClient.get("/test");
    expect(response.config.headers.Authorization).toBeUndefined();
  });

  it("passes through successful responses", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    apiClient.defaults.adapter = mockAdapter(200, { data: "ok" });

    const response = await apiClient.get("/test");
    expect(response.data).toEqual({ data: "ok" });
  });

  it("rejects non-401 errors without retry", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("token");
    apiClient.defaults.adapter = async () => {
      const error = new Error("Server Error") as any;
      error.response = { status: 500, data: {} };
      error.config = { headers: {} };
      throw error;
    };

    await expect(apiClient.get("/test")).rejects.toThrow();
  });

  it("attempts token refresh on 401", async () => {
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce("expired-token") // request interceptor
      .mockResolvedValueOnce("refresh-token-123"); // refresh flow

    let callCount = 0;
    apiClient.defaults.adapter = async (config) => {
      callCount++;
      if (callCount === 1) {
        // First call — simulate 401
        const error = new Error("Unauthorized") as any;
        error.response = { status: 401, data: {} };
        error.config = { ...config, _retry: undefined, headers: config.headers || {} };
        throw error;
      }
      // Retry call after refresh — succeed
      return { data: { refreshed: true }, status: 200, statusText: "OK", headers: {}, config };
    };

    // Mock the axios.post for refresh endpoint
    const axios = require("axios");
    const originalPost = axios.post;
    axios.post = jest.fn().mockResolvedValue({
      data: { data: { token: "new-jwt-token", refresh_token: "new-refresh" } },
    });

    try {
      const response = await apiClient.get("/protected");
      expect(response.data.refreshed).toBe(true);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("auth_token", "new-jwt-token");
    } finally {
      axios.post = originalPost;
    }
  });

  it("clears tokens when refresh fails", async () => {
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce("expired-token")
      .mockResolvedValueOnce("bad-refresh");

    apiClient.defaults.adapter = async (config) => {
      const error = new Error("Unauthorized") as any;
      error.response = { status: 401, data: {} };
      error.config = { ...config, _retry: undefined, headers: config.headers || {} };
      throw error;
    };

    const axios = require("axios");
    const originalPost = axios.post;
    axios.post = jest.fn().mockRejectedValue(new Error("Refresh failed"));

    try {
      await expect(apiClient.get("/protected")).rejects.toThrow("Refresh failed");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("refresh_token");
    } finally {
      axios.post = originalPost;
    }
  });

  it("queues concurrent 401 requests during refresh", async () => {
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce("expired") // first request interceptor
      .mockResolvedValueOnce("refresh-tok") // refresh flow getRefreshToken
      .mockResolvedValueOnce("expired"); // second request interceptor (queued)

    let callCount = 0;
    apiClient.defaults.adapter = async (config) => {
      callCount++;
      if (callCount <= 2) {
        // First two calls simulate 401
        const error = new Error("Unauthorized") as any;
        error.response = { status: 401, data: {} };
        error.config = { ...config, _retry: undefined, headers: config.headers || {} };
        throw error;
      }
      // Retry calls succeed
      return { data: { retried: true }, status: 200, statusText: "OK", headers: {}, config };
    };

    const axios = require("axios");
    const originalPost = axios.post;
    axios.post = jest.fn().mockResolvedValue({
      data: { data: { token: "queued-new-token", refresh_token: "new-refresh" } },
    });

    try {
      // Fire two concurrent requests — both hit 401
      const [r1, r2] = await Promise.all([
        apiClient.get("/endpoint1"),
        apiClient.get("/endpoint2"),
      ]);
      expect(r1.data.retried).toBe(true);
    } finally {
      axios.post = originalPost;
    }
  });

  it("clears tokens when no refresh token available", async () => {
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce("expired-token")
      .mockResolvedValueOnce(null); // no refresh token

    apiClient.defaults.adapter = async (config) => {
      const error = new Error("Unauthorized") as any;
      error.response = { status: 401, data: {} };
      error.config = { ...config, _retry: undefined, headers: config.headers || {} };
      throw error;
    };

    await expect(apiClient.get("/protected")).rejects.toThrow("No refresh token");
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token");
  });
});

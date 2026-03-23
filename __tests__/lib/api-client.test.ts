import { saveTokens, clearTokens, getToken } from "@/src/lib/api-client";
import * as SecureStore from "expo-secure-store";

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

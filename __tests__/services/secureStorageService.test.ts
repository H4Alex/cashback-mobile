import * as SecureStore from "expo-secure-store";
import { secureStorage } from "@/src/services/secureStorageService";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe("secureStorageService", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getToken", () => {
    it("retrieves auth_token from SecureStore", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("my-token");
      const result = await secureStorage.getToken();
      expect(result).toBe("my-token");
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("auth_token");
    });
  });

  describe("setToken", () => {
    it("stores auth_token in SecureStore", async () => {
      await secureStorage.setToken("new-token");
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("auth_token", "new-token");
    });
  });

  describe("getRefreshToken", () => {
    it("retrieves refresh_token from SecureStore", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("refresh-abc");
      const result = await secureStorage.getRefreshToken();
      expect(result).toBe("refresh-abc");
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("refresh_token");
    });
  });

  describe("setRefreshToken", () => {
    it("stores refresh_token in SecureStore", async () => {
      await secureStorage.setRefreshToken("refresh-xyz");
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("refresh_token", "refresh-xyz");
    });
  });

  describe("clearTokens", () => {
    it("deletes both tokens", async () => {
      await secureStorage.clearTokens();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("refresh_token");
    });
  });

  describe("getItem / setItem / removeItem", () => {
    it("gets arbitrary key", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("val");
      const result = await secureStorage.getItem("my-key");
      expect(result).toBe("val");
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("my-key");
    });

    it("sets arbitrary key-value", async () => {
      await secureStorage.setItem("my-key", "my-val");
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("my-key", "my-val");
    });

    it("removes arbitrary key", async () => {
      await secureStorage.removeItem("my-key");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("my-key");
    });
  });
});

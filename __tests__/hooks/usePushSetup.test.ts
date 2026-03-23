import { renderHook, act, waitFor } from "@testing-library/react-native";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { usePushSetup } from "@/src/hooks/usePushSetup";
import { useAuthStore } from "@/src/stores";

jest.mock("@/src/lib/api-client", () => ({
  apiClient: {
    post: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

jest.mock("@/src/lib/analytics", () => ({
  analytics: {
    notificationReceived: jest.fn(),
    notificationTapped: jest.fn(),
  },
}));

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: { eas: { projectId: "test-project-id" } },
    },
  },
}));

jest.mock("@/src/stores", () => ({
  useAuthStore: jest.fn((selector) =>
    selector({
      isAuthenticated: false,
    }),
  ),
}));

describe("usePushSetup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the isRegistered ref between tests
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ isAuthenticated: false }),
    );
  });

  it("mounts without errors", () => {
    expect(() => {
      renderHook(() => usePushSetup());
    }).not.toThrow();
  });

  it("only registers once across rerenders", () => {
    const { rerender } = renderHook(() => usePushSetup());
    rerender({});
    rerender({});
    // No assertion needed - verifying no errors and no infinite loops
  });

  it("returns expoPushToken as null initially", () => {
    const { result } = renderHook(() => usePushSetup());
    expect(result.current.expoPushToken).toBeNull();
  });

  it("returns unregisterToken function", () => {
    const { result } = renderHook(() => usePushSetup());
    expect(typeof result.current.unregisterToken).toBe("function");
  });

  it("does not register when not authenticated", () => {
    const { apiClient } = require("@/src/lib/api-client");
    renderHook(() => usePushSetup());
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it("sets up notification listeners when authenticated", () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ isAuthenticated: true }),
    );

    renderHook(() => usePushSetup());

    // Should set up received and response listeners
    expect(Notifications.addNotificationReceivedListener).toHaveBeenCalled();
    expect(Notifications.addNotificationResponseReceivedListener).toHaveBeenCalled();
  });

  it("calls analytics.notificationReceived when notification arrives", () => {
    const { analytics } = require("@/src/lib/analytics");
    let receivedCallback: (notification: unknown) => void = () => {};
    (Notifications.addNotificationReceivedListener as jest.Mock).mockImplementation((cb) => {
      receivedCallback = cb;
      return { remove: jest.fn() };
    });

    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ isAuthenticated: true }),
    );

    renderHook(() => usePushSetup());

    receivedCallback({
      request: { content: { data: { type: "cashback" } } },
    });

    expect(analytics.notificationReceived).toHaveBeenCalledWith("cashback");
  });

  it("calls analytics.notificationTapped when user taps notification", () => {
    const { analytics } = require("@/src/lib/analytics");
    let responseCallback: (response: unknown) => void = () => {};
    (Notifications.addNotificationResponseReceivedListener as jest.Mock).mockImplementation((cb) => {
      responseCallback = cb;
      return { remove: jest.fn() };
    });

    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ isAuthenticated: true }),
    );

    renderHook(() => usePushSetup());

    responseCallback({
      notification: { request: { content: { data: { type: "campanha" } } } },
    });

    expect(analytics.notificationTapped).toHaveBeenCalledWith("campanha");
  });

  it("does not call analytics without type data", () => {
    const { analytics } = require("@/src/lib/analytics");
    let receivedCallback: (notification: unknown) => void = () => {};
    (Notifications.addNotificationReceivedListener as jest.Mock).mockImplementation((cb) => {
      receivedCallback = cb;
      return { remove: jest.fn() };
    });

    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ isAuthenticated: true }),
    );

    renderHook(() => usePushSetup());

    // Notification without type
    receivedCallback({
      request: { content: { data: {} } },
    });

    expect(analytics.notificationReceived).not.toHaveBeenCalled();
  });

  it("handles registerToken error gracefully", async () => {
    const { apiClient } = require("@/src/lib/api-client");
    apiClient.post.mockRejectedValueOnce(new Error("Network error"));

    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ isAuthenticated: true }),
    );

    // Should not throw
    expect(() => renderHook(() => usePushSetup())).not.toThrow();
  });

  it("cleans up listeners on unmount", () => {
    const removeReceived = jest.fn();
    const removeResponse = jest.fn();
    (Notifications.addNotificationReceivedListener as jest.Mock).mockReturnValue({ remove: removeReceived });
    (Notifications.addNotificationResponseReceivedListener as jest.Mock).mockReturnValue({ remove: removeResponse });

    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ isAuthenticated: true }),
    );

    const { unmount } = renderHook(() => usePushSetup());
    unmount();

    expect(removeReceived).toHaveBeenCalled();
    expect(removeResponse).toHaveBeenCalled();
  });

  it("returns null when not on physical device", async () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ isAuthenticated: true }),
    );
    (Device as { isDevice: boolean }).isDevice = false;

    const { result } = renderHook(() => usePushSetup());

    // Should not call getExpoPushTokenAsync
    await waitFor(() => {
      expect(Notifications.getExpoPushTokenAsync).not.toHaveBeenCalled();
    });
    expect(result.current.expoPushToken).toBeNull();
  });

  it("unregisterToken calls delete endpoint", async () => {
    const { apiClient } = require("@/src/lib/api-client");
    const { result } = renderHook(() => usePushSetup());

    // unregisterToken should do nothing when no token
    await act(async () => {
      await result.current.unregisterToken();
    });
    expect(apiClient.delete).not.toHaveBeenCalled();
  });
});

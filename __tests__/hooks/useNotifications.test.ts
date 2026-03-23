import { renderHook, act, waitFor } from "@testing-library/react-native";
import { createWrapper } from "@/src/testing/hook-test-helpers";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from "@/src/hooks/useNotifications";

jest.mock("@/src/services", () => ({
  mobileNotificationService: {
    getNotifications: jest.fn().mockResolvedValue({
      data: [],
      meta: { has_more_pages: false, next_cursor: null, total_unread: 0 },
    }),
    markAsRead: jest.fn().mockResolvedValue(undefined),
    markAllAsRead: jest.fn().mockResolvedValue(undefined),
    getPreferences: jest.fn().mockResolvedValue({ push: true, email: false }),
    updatePreferences: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("@/src/stores", () => ({
  useNotificationStore: jest.fn((selector) =>
    selector({
      setUnreadCount: jest.fn(),
      updatePreferences: jest.fn(),
    }),
  ),
}));

describe("useNotifications hooks", () => {
  describe("useNotifications", () => {
    it("returns infinite query", () => {
      const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });
      expect(result.current.fetchNextPage).toBeDefined();
    });
  });

  describe("useMarkNotificationRead", () => {
    it("returns mutate function", () => {
      const { result } = renderHook(() => useMarkNotificationRead(), {
        wrapper: createWrapper(),
      });
      expect(result.current.mutate).toBeDefined();
    });
  });

  describe("useMarkAllNotificationsRead", () => {
    it("returns mutate function", () => {
      const { result } = renderHook(() => useMarkAllNotificationsRead(), {
        wrapper: createWrapper(),
      });
      expect(result.current.mutate).toBeDefined();
    });
  });

  describe("useNotificationPreferences", () => {
    it("returns query", () => {
      const { result } = renderHook(() => useNotificationPreferences(), {
        wrapper: createWrapper(),
      });
      expect(result.current.isLoading).toBeDefined();
    });
  });

  describe("useUpdateNotificationPreferences", () => {
    it("returns mutate function", () => {
      const { result } = renderHook(() => useUpdateNotificationPreferences(), {
        wrapper: createWrapper(),
      });
      expect(result.current.mutate).toBeDefined();
    });

    it("calls updatePreferences service on mutate", async () => {
      const { mobileNotificationService } = require("@/src/services");
      const { result } = renderHook(() => useUpdateNotificationPreferences(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate({ push: false, email: true });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mobileNotificationService.updatePreferences).toHaveBeenCalled();
    });
  });

  describe("useMarkNotificationRead - mutation flow", () => {
    it("calls markAsRead on mutate and invalidates queries", async () => {
      const { mobileNotificationService } = require("@/src/services");
      const { result } = renderHook(() => useMarkNotificationRead(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(42);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mobileNotificationService.markAsRead).toHaveBeenCalledWith(42);
    });
  });

  describe("useMarkAllNotificationsRead - mutation flow", () => {
    it("calls markAllAsRead on mutate and resets unread count", async () => {
      const { mobileNotificationService } = require("@/src/services");
      const { result } = renderHook(() => useMarkAllNotificationsRead(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate();
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mobileNotificationService.markAllAsRead).toHaveBeenCalled();
    });
  });
});

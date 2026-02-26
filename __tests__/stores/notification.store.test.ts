import { useNotificationStore } from "@/src/stores/notification.store";

describe("useNotificationStore", () => {
  beforeEach(() => {
    useNotificationStore.setState({
      unreadCount: 0,
      preferences: null,
    });
  });

  it("defaults to 0 unread and null preferences", () => {
    const state = useNotificationStore.getState();
    expect(state.unreadCount).toBe(0);
    expect(state.preferences).toBeNull();
  });

  it("sets unread count", () => {
    useNotificationStore.getState().setUnreadCount(5);
    expect(useNotificationStore.getState().unreadCount).toBe(5);
  });

  it("updates preferences", () => {
    const prefs = {
      cashback_recebido: true,
      cashback_expirado: false,
      campanhas: true,
      sistema: true,
    };
    useNotificationStore.getState().updatePreferences(prefs as any);
    expect(useNotificationStore.getState().preferences).toEqual(prefs);
  });

  it("resets state", () => {
    useNotificationStore.getState().setUnreadCount(10);
    useNotificationStore.getState().reset();
    expect(useNotificationStore.getState().unreadCount).toBe(0);
    expect(useNotificationStore.getState().preferences).toBeNull();
  });
});

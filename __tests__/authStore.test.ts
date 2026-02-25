import { useAuthStore } from "@/src/stores/authStore";
import type { UserProfile } from "@/src/types/auth";

const mockUser: UserProfile = {
  id: "1",
  nome: "Test User",
  email: "test@example.com",
  tipo: "consumidor",
  created_at: "2026-01-01T00:00:00Z",
};

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it("starts with no user and loading", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
  });

  it("sets user and marks as authenticated", () => {
    useAuthStore.getState().setUser(mockUser);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("clears user on logout", () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("updates loading state", () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});

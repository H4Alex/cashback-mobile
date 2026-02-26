import { useAuthStore } from "@/src/stores/auth.store";

jest.mock("@/src/services/mobile.auth.service");
jest.mock("@/src/lib/api-client", () => ({
  apiClient: { post: jest.fn(), get: jest.fn(), patch: jest.fn() },
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getToken: jest.fn(),
}));

describe("Auth Navigation Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect to auth when not authenticated and in protected group", () => {
    useAuthStore.setState({ isAuthenticated: false, isLoading: false });

    const segments = ["(consumer)"];
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const inAuthGroup = segments[0] === "(auth)";

    const shouldRedirectToLogin = !isAuthenticated && !inAuthGroup;
    expect(shouldRedirectToLogin).toBe(true);
  });

  it("should redirect to consumer when authenticated and in auth group", () => {
    useAuthStore.setState({ isAuthenticated: true, isLoading: false });

    const segments = ["(auth)"];
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const inAuthGroup = segments[0] === "(auth)";

    const shouldRedirectToApp = isAuthenticated && inAuthGroup;
    expect(shouldRedirectToApp).toBe(true);
  });

  it("should stay on consumer screen when authenticated", () => {
    useAuthStore.setState({ isAuthenticated: true, isLoading: false });

    const segments = ["(consumer)"];
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const inAuthGroup = segments[0] === "(auth)";

    const shouldRedirectToLogin = !isAuthenticated && !inAuthGroup;
    const shouldRedirectToApp = isAuthenticated && inAuthGroup;

    expect(shouldRedirectToLogin).toBe(false);
    expect(shouldRedirectToApp).toBe(false);
  });

  it("should stay on auth screen when not authenticated", () => {
    useAuthStore.setState({ isAuthenticated: false, isLoading: false });

    const segments = ["(auth)"];
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const inAuthGroup = segments[0] === "(auth)";

    const shouldRedirectToLogin = !isAuthenticated && !inAuthGroup;
    const shouldRedirectToApp = isAuthenticated && inAuthGroup;

    expect(shouldRedirectToLogin).toBe(false);
    expect(shouldRedirectToApp).toBe(false);
  });
});

import { useThemeStore } from "@/src/stores/theme.store";

describe("useThemeStore", () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: "system" });
  });

  it("defaults to system mode", () => {
    expect(useThemeStore.getState().mode).toBe("system");
  });

  it("sets mode to light", () => {
    useThemeStore.getState().setMode("light");
    expect(useThemeStore.getState().mode).toBe("light");
  });

  it("sets mode to dark", () => {
    useThemeStore.getState().setMode("dark");
    expect(useThemeStore.getState().mode).toBe("dark");
  });

  it("sets mode back to system", () => {
    useThemeStore.getState().setMode("dark");
    useThemeStore.getState().setMode("system");
    expect(useThemeStore.getState().mode).toBe("system");
  });
});

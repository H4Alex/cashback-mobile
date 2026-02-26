import { useConnectivityStore } from "@/src/stores/connectivity.store";

describe("useConnectivityStore", () => {
  beforeEach(() => {
    useConnectivityStore.setState({
      isOnline: true,
      connectionType: "unknown",
    });
  });

  it("defaults to online and unknown connection type", () => {
    const state = useConnectivityStore.getState();
    expect(state.isOnline).toBe(true);
    expect(state.connectionType).toBe("unknown");
  });

  it("sets online status", () => {
    useConnectivityStore.getState().setOnline(false);
    expect(useConnectivityStore.getState().isOnline).toBe(false);
  });

  it("sets connection type", () => {
    useConnectivityStore.getState().setConnectionType("wifi");
    expect(useConnectivityStore.getState().connectionType).toBe("wifi");
  });

  it("handles multiple connection type updates", () => {
    useConnectivityStore.getState().setConnectionType("wifi");
    useConnectivityStore.getState().setConnectionType("cellular");
    expect(useConnectivityStore.getState().connectionType).toBe("cellular");
  });
});

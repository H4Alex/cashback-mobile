import { renderHook } from "@testing-library/react-native";
import NetInfo from "@react-native-community/netinfo";
import { useConnectivity } from "@/src/hooks/useConnectivity";
import { useConnectivityStore } from "@/src/stores/connectivity.store";

describe("useConnectivity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useConnectivityStore.setState({
      isOnline: true,
      connectionType: "unknown",
    });
  });

  it("subscribes to NetInfo on mount", () => {
    renderHook(() => useConnectivity());
    expect(NetInfo.addEventListener).toHaveBeenCalled();
  });

  it("unsubscribes on unmount", () => {
    const unsubscribe = jest.fn();
    (NetInfo.addEventListener as jest.Mock).mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useConnectivity());
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it("returns isOnline and connectionType from store", () => {
    useConnectivityStore.setState({ isOnline: false, connectionType: "wifi" });
    const { result } = renderHook(() => useConnectivity());
    expect(result.current.isOnline).toBe(false);
    expect(result.current.connectionType).toBe("wifi");
  });

  it("updates store when NetInfo reports wifi connected", () => {
    let netInfoCallback: (state: unknown) => void = () => {};
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb: (state: unknown) => void) => {
      netInfoCallback = cb;
      return jest.fn();
    });

    renderHook(() => useConnectivity());
    netInfoCallback({ isConnected: true, type: "wifi" });
    expect(useConnectivityStore.getState().isOnline).toBe(true);
    expect(useConnectivityStore.getState().connectionType).toBe("wifi");
  });

  it("updates store for cellular connection", () => {
    let netInfoCallback: (state: unknown) => void = () => {};
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb: (state: unknown) => void) => {
      netInfoCallback = cb;
      return jest.fn();
    });

    renderHook(() => useConnectivity());
    netInfoCallback({ isConnected: true, type: "cellular" });
    expect(useConnectivityStore.getState().connectionType).toBe("cellular");
  });

  it("sets connectionType to none when disconnected", () => {
    let netInfoCallback: (state: unknown) => void = () => {};
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb: (state: unknown) => void) => {
      netInfoCallback = cb;
      return jest.fn();
    });

    renderHook(() => useConnectivity());
    netInfoCallback({ isConnected: false, type: "none" });
    expect(useConnectivityStore.getState().isOnline).toBe(false);
    expect(useConnectivityStore.getState().connectionType).toBe("none");
  });

  it("sets connectionType to unknown for unrecognized type", () => {
    let netInfoCallback: (state: unknown) => void = () => {};
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb: (state: unknown) => void) => {
      netInfoCallback = cb;
      return jest.fn();
    });

    renderHook(() => useConnectivity());
    netInfoCallback({ isConnected: true, type: "vpn" });
    expect(useConnectivityStore.getState().connectionType).toBe("unknown");
  });
});

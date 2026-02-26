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
});

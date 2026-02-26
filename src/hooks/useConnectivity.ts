import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useConnectivityStore } from "@/src/stores/connectivity.store";

/**
 * Subscribes to network state changes via NetInfo and updates the connectivity store.
 * Call this once at the app root level.
 */
export function useConnectivity() {
  const setOnline = useConnectivityStore((s) => s.setOnline);
  const setConnectionType = useConnectivityStore((s) => s.setConnectionType);
  const isOnline = useConnectivityStore((s) => s.isOnline);
  const connectionType = useConnectivityStore((s) => s.connectionType);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);

      const type = state.type as string;
      if (type === "wifi" || type === "cellular" || type === "ethernet") {
        setConnectionType(type);
      } else if (state.isConnected) {
        setConnectionType("unknown");
      } else {
        setConnectionType("none");
      }
    });

    return unsubscribe;
  }, [setOnline, setConnectionType]);

  return { isOnline, connectionType };
}

import { useState, useEffect, useCallback } from "react";
import { Alert, AppState } from "react-native";
import * as Updates from "expo-updates";

interface UpdateInfo {
  isAvailable: boolean;
  isChecking: boolean;
  isDownloading: boolean;
  lastChecked: Date | null;
}

export function useAppUpdate() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    isAvailable: false,
    isChecking: false,
    isDownloading: false,
    lastChecked: null,
  });

  const checkForUpdate = useCallback(async () => {
    setUpdateInfo((prev) => ({ ...prev, isChecking: true }));

    try {
      if (!Updates.isEnabled) {
        setUpdateInfo((prev) => ({
          ...prev,
          isChecking: false,
          lastChecked: new Date(),
        }));
        return;
      }

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateInfo((prev) => ({
          ...prev,
          isAvailable: true,
          isChecking: false,
          lastChecked: new Date(),
        }));
      } else {
        setUpdateInfo((prev) => ({
          ...prev,
          isAvailable: false,
          isChecking: false,
          lastChecked: new Date(),
        }));
      }
    } catch {
      setUpdateInfo((prev) => ({
        ...prev,
        isChecking: false,
        lastChecked: new Date(),
      }));
    }
  }, []);

  const downloadAndApply = useCallback(async () => {
    setUpdateInfo((prev) => ({ ...prev, isDownloading: true }));

    try {
      await Updates.fetchUpdateAsync();

      Alert.alert(
        "Atualização disponível",
        "Uma nova versão foi baixada. Reiniciar o app para aplicar?",
        [
          { text: "Depois", style: "cancel" },
          {
            text: "Reiniciar",
            onPress: () => Updates.reloadAsync(),
          },
        ],
      );
    } catch {
      Alert.alert("Erro", "Não foi possível baixar a atualização.");
    } finally {
      setUpdateInfo((prev) => ({ ...prev, isDownloading: false }));
    }
  }, []);

  // Check on app foreground
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkForUpdate();
      }
    });

    // Initial check
    checkForUpdate();

    return () => sub.remove();
  }, [checkForUpdate]);

  return {
    ...updateInfo,
    checkForUpdate,
    downloadAndApply,
  };
}

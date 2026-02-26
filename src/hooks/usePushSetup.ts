import { useEffect, useRef, useState, useCallback } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { apiClient } from "@/src/lib/api-client";
import { analytics } from "@/src/lib/analytics";
import { useAuthStore } from "@/src/stores";

const DEVICE_ENDPOINT = "/api/mobile/v1/devices";

// Configure how notifications are displayed when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  // Configure Android notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Geral",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#16a34a",
    });

    await Notifications.setNotificationChannelAsync("cashback", {
      name: "Cashback",
      description: "Notificações de cashback recebido e utilizado",
      importance: Notifications.AndroidImportance.HIGH,
    });

    await Notifications.setNotificationChannelAsync("campanhas", {
      name: "Campanhas",
      description: "Novas campanhas e promoções",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) return null;

  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  return token;
}

/**
 * Registers for push notifications and sets up foreground/tap handlers.
 * Call once at the app root after authentication.
 */
export function usePushSetup() {
  const isRegistered = useRef(false);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const registerToken = useCallback(async (token: string) => {
    try {
      await apiClient.post(DEVICE_ENDPOINT, {
        push_token: token,
        platform: Platform.OS,
        device_name: Device.deviceName ?? "unknown",
      });
    } catch {
      // Token registration failure is non-critical
    }
  }, []);

  useEffect(() => {
    if (isRegistered.current || !isAuthenticated) return;
    isRegistered.current = true;

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        registerToken(token);
      }
    });

    // Foreground notification received
    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      const type = notification.request.content.data?.type as string;
      if (type) {
        analytics.notificationReceived(type);
      }
    });

    // User tapped on notification
    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const type = response.notification.request.content.data?.type as string;
      if (type) {
        analytics.notificationTapped(type);
      }
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, [isAuthenticated, registerToken]);

  return { expoPushToken };
}

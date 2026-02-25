import { View, Text, TouchableOpacity, SectionList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/src/hooks";
import { useNotificationStore } from "@/src/stores";
import { NotificationItem, formatDateGroup } from "@/src/components/NotificationItem";
import { EmptyState } from "@/src/components";
import type { MobileNotification } from "@/src/types";

interface NotificationSection {
  title: string;
  data: MobileNotification[];
}

function groupByDay(notifications: MobileNotification[]): NotificationSection[] {
  const groups = new Map<string, MobileNotification[]>();
  for (const n of notifications) {
    const key = formatDateGroup(n.created_at);
    const existing = groups.get(key);
    if (existing) {
      existing.push(n);
    } else {
      groups.set(key, [n]);
    }
  }
  return Array.from(groups.entries()).map(([title, data]) => ({ title, data }));
}

export default function NotificationsScreen() {
  const router = useRouter();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.pages.flatMap((p) => p.notifications) ?? [];
  const sections = groupByDay(notifications);

  const handlePress = (notification: MobileNotification) => {
    if (!notification.lida) {
      markRead.mutate(notification.id);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header actions */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <Text className="text-lg font-bold">
          Notificações{unreadCount > 0 ? ` (${unreadCount})` : ""}
        </Text>
        <View className="flex-row gap-3">
          {unreadCount > 0 && (
            <TouchableOpacity onPress={() => markAllRead.mutate()}>
              <Text className="text-blue-600 text-sm font-medium">✓ Todas</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => router.push("/(consumer)/(tabs)/notifications/preferences")}
          >
            <Text className="text-gray-500 text-sm">Preferências</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="Nenhuma notificação"
          message="Você será avisado quando receber cashback, promoções e novidades."
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          renderSectionHeader={({ section }) => (
            <View className="bg-gray-50 px-4 py-2">
              <Text className="text-xs font-semibold text-gray-500 uppercase">{section.title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <NotificationItem item={item} onPress={() => handlePress(item)} />
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator className="py-4" /> : null}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/src/hooks';
import { useNotificationStore } from '@/src/stores';
import type { MobileNotification } from '@/src/types';

function NotificationItem({
  item,
  onPress,
}: {
  item: MobileNotification;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className={`px-4 py-3 border-b border-gray-100 ${
        item.lida ? 'bg-white' : 'bg-blue-50'
      }`}
      onPress={onPress}
    >
      <View className="flex-row items-start">
        {!item.lida && (
          <View className="w-2 h-2 rounded-full bg-blue-600 mt-2 mr-2" />
        )}
        <View className="flex-1">
          <Text className="font-semibold text-base">{item.titulo}</Text>
          <Text className="text-gray-600 text-sm mt-1">{item.mensagem}</Text>
          <Text className="text-gray-400 text-xs mt-1">
            {new Date(item.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.pages.flatMap((p) => p.notifications) ?? [];

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
          Notificações{unreadCount > 0 ? ` (${unreadCount})` : ''}
        </Text>
        <View className="flex-row gap-3">
          {unreadCount > 0 && (
            <TouchableOpacity onPress={() => markAllRead.mutate()}>
              <Text className="text-blue-600 text-sm">Marcar todas lidas</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() =>
              router.push('/(consumer)/(tabs)/notifications/preferences')
            }
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
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-500 text-center">
            Nenhuma notificação ainda.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <NotificationItem item={item} onPress={() => handlePress(item)} />
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator className="py-4" />
            ) : null
          }
        />
      )}
    </View>
  );
}

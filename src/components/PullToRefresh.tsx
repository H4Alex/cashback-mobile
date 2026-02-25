import type { ReactNode } from "react";
import { RefreshControl, ScrollView } from "react-native";

interface PullToRefreshProps {
  refreshing: boolean;
  onRefresh: () => void;
  children: ReactNode;
  className?: string;
}

export function PullToRefresh({
  refreshing,
  onRefresh,
  children,
  className = "flex-1 bg-white",
}: PullToRefreshProps) {
  return (
    <ScrollView
      className={className}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {children}
    </ScrollView>
  );
}

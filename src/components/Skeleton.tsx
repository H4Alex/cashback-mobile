import { type DimensionValue, View } from "react-native";

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({
  width = "100%" as DimensionValue,
  height = 16,
  borderRadius = 8,
  className = "",
}: SkeletonProps) {
  return (
    <View
      className={`bg-gray-200 animate-pulse ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
      <Skeleton width={120} height={14} className="mb-3" />
      <Skeleton width={180} height={32} className="mb-4" />
      <View className="flex-row justify-between">
        <Skeleton width={100} height={12} />
        <Skeleton width={80} height={12} />
      </View>
    </View>
  );
}

export function SkeletonTransaction() {
  return (
    <View className="flex-row items-center py-3 px-4">
      <Skeleton width={40} height={40} borderRadius={20} className="mr-3" />
      <View className="flex-1">
        <Skeleton width={140} height={14} className="mb-2" />
        <Skeleton width={80} height={12} />
      </View>
      <Skeleton width={60} height={14} />
    </View>
  );
}

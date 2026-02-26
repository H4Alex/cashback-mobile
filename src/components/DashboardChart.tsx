import { View, Text } from "react-native";
import Svg, { Path, Circle, Line, Text as SvgText } from "react-native-svg";
import { Skeleton } from "./Skeleton";

interface ChartPoint {
  label: string;
  gerado: number;
  utilizado: number;
}

interface DashboardChartProps {
  data: ChartPoint[];
  isLoading?: boolean;
}

function buildPath(points: number[], width: number, height: number, maxVal: number): string {
  if (points.length === 0) return "";
  const stepX = width / (points.length - 1 || 1);
  const padding = 4;
  const usableH = height - padding * 2;

  return points
    .map((val, i) => {
      const x = i * stepX;
      const y = padding + usableH - (maxVal > 0 ? (val / maxVal) * usableH : 0);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function DashboardChart({ data, isLoading }: DashboardChartProps) {
  if (isLoading) {
    return (
      <View className="bg-white rounded-xl p-4" style={{ height: 180 }}>
        <Skeleton style={{ width: 120, height: 16, borderRadius: 4, marginBottom: 12 }} />
        <Skeleton style={{ width: "100%", height: 120, borderRadius: 8 }} />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="bg-white rounded-xl p-4 items-center justify-center" style={{ height: 180 }}>
        <Text className="text-gray-400 text-sm">Sem dados para exibir</Text>
      </View>
    );
  }

  const chartW = 300;
  const chartH = 120;
  const allValues = data.flatMap((d) => [d.gerado, d.utilizado]);
  const maxVal = Math.max(...allValues, 1);

  const geradoPath = buildPath(data.map((d) => d.gerado), chartW, chartH, maxVal);
  const utilizadoPath = buildPath(data.map((d) => d.utilizado), chartW, chartH, maxVal);

  const stepX = chartW / (data.length - 1 || 1);

  return (
    <View className="bg-white rounded-xl p-4" style={{ height: 180 }}>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm font-semibold text-gray-700">Evolução 7 dias</Text>
        <View className="flex-row gap-4">
          <View className="flex-row items-center">
            <View className="w-3 h-0.5 bg-green-500 mr-1" />
            <Text className="text-xs text-gray-500">Gerado</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-0.5 bg-blue-500 mr-1" />
            <Text className="text-xs text-gray-500">Utilizado</Text>
          </View>
        </View>
      </View>

      <Svg width="100%" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <Line
            key={pct}
            x1={0}
            y1={4 + (chartH - 8) * (1 - pct)}
            x2={chartW}
            y2={4 + (chartH - 8) * (1 - pct)}
            stroke="#f3f4f6"
            strokeWidth={1}
          />
        ))}

        {/* Lines */}
        <Path d={geradoPath} stroke="#22c55e" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Path d={utilizadoPath} stroke="#3b82f6" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {data.map((d, i) => {
          const x = i * stepX;
          const yG = 4 + (chartH - 8) - (maxVal > 0 ? (d.gerado / maxVal) * (chartH - 8) : 0);
          const yU = 4 + (chartH - 8) - (maxVal > 0 ? (d.utilizado / maxVal) * (chartH - 8) : 0);
          return (
            <View key={i}>
              <Circle cx={x} cy={yG} r={3} fill="#22c55e" />
              <Circle cx={x} cy={yU} r={3} fill="#3b82f6" />
            </View>
          );
        })}

        {/* X labels */}
        {data.map((d, i) => (
          <SvgText
            key={`label-${i}`}
            x={i * stepX}
            y={chartH}
            fontSize={9}
            fill="#9ca3af"
            textAnchor="middle"
          >
            {d.label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

/** Mini sparkline for consumer dashboard */
export function SparklineChart({ values, color = "#22c55e" }: { values: number[]; color?: string }) {
  if (!values || values.length < 2) return null;

  const w = 80;
  const h = 24;
  const maxVal = Math.max(...values, 1);
  const path = buildPath(values, w, h, maxVal);

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Path d={path} stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

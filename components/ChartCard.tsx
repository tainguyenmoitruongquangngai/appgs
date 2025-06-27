import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

interface ChartCardProps {
  title: string;
  description?: string;
  chartData?: any; // Placeholder for chart data
  value?: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  color?: string;
  onPress?: () => void;
  height?: number;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  value,
  unit,
  trend,
  trendValue,
  color = "#007AFF",
  onPress,
  height = 200,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "trending-up";
      case "down":
        return "trending-down";
      case "stable":
        return "remove";
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "#10B981";
      case "down":
        return "#EF4444";
      case "stable":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[styles.container, { height }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>

        {trend && (
          <View
            style={[
              styles.trendContainer,
              { backgroundColor: `${getTrendColor()}15` },
            ]}
          >
            <Icon name={getTrendIcon()!} size={16} color={getTrendColor()} />
            {trendValue && (
              <Text style={[styles.trendText, { color: getTrendColor() }]}>
                {trendValue}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Chart Area - Placeholder */}
      <View style={[styles.chartArea, { borderColor: `${color}30` }]}>
        <View style={styles.chartPlaceholder}>
          <Icon name="bar-chart-outline" size={48} color={`${color}80`} />
          <Text style={[styles.chartPlaceholderText, { color: `${color}80` }]}>
            Biểu đồ dữ liệu
          </Text>
        </View>

        {/* Gradient overlay for visual effect */}
        <View
          style={[styles.chartOverlay, { backgroundColor: `${color}10` }]}
        />
      </View>

      {value && (
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color }]}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
      )}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  chartArea: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    position: "relative",
    overflow: "hidden",
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  chartPlaceholderText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  chartOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  unit: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
    fontWeight: "500",
  },
});

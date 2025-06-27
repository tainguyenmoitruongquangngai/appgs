import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  color?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  color = "#007AFF",
  trend,
  trendValue,
  onPress,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "trending-up-outline";
      case "down":
        return "trending-down-outline";
      case "stable":
        return "remove-outline";
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
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            <Icon name={getTrendIcon()!} size={16} color={getTrendColor()} />
            {trendValue && (
              <Text style={[styles.trendText, { color: getTrendColor() }]}>
                {trendValue}
              </Text>
            )}
          </View>
        )}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 6,
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
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  title: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
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

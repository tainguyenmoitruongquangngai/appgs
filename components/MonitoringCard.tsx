import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface MonitoringCardProps {
  title: string;
  description?: string;
  status: "online" | "offline" | "warning" | "error";
  lastUpdate?: string;
  value?: string | number;
  unit?: string;
  onPress?: () => void;
  icon?: string;
}

export const MonitoringCard: React.FC<MonitoringCardProps> = ({
  title,
  description,
  status,
  lastUpdate,
  value,
  unit,
  onPress,
  icon = "analytics-outline",
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "#34c759";
      case "offline":
        return "#8e8e93";
      case "warning":
        return "#ff9500";
      case "error":
        return "#ff3b30";
      default:
        return "#8e8e93";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "Hoạt động";
      case "offline":
        return "Ngoại tuyến";
      case "warning":
        return "Cảnh báo";
      case "error":
        return "Lỗi";
      default:
        return "Không xác định";
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getStatusColor() + "20" },
            ]}
          >
            <Icon name={icon} size={24} color={getStatusColor()} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
          />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      {(value !== undefined || lastUpdate) && (
        <View style={styles.content}>
          {value !== undefined && (
            <View style={styles.valueContainer}>
              <Text style={styles.value}>
                {value}
                {unit && <Text style={styles.unit}> {unit}</Text>}
              </Text>
            </View>
          )}

          {lastUpdate && (
            <Text style={styles.lastUpdate}>Cập nhật: {lastUpdate}</Text>
          )}
        </View>
      )}

      {onPress && (
        <View style={styles.footer}>
          <Icon name="chevron-forward" size={20} color="#c7c7cc" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: "row",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: "#8e8e93",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: "#f2f2f7",
    paddingTop: 12,
  },
  valueContainer: {
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  unit: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#8e8e93",
  },
  lastUpdate: {
    fontSize: 12,
    color: "#8e8e93",
  },
  footer: {
    alignItems: "flex-end",
    marginTop: 8,
  },
});

export default MonitoringCard;

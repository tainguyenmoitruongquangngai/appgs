import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface StatusIndicatorProps {
  status: "online" | "offline" | "warning" | "maintenance";
  label: string;
  description?: string;
  size?: "small" | "medium" | "large";
  showIcon?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  description,
  size = "medium",
  showIcon = true,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          color: "#10B981",
          icon: "checkmark-circle",
          bgColor: "#D1FAE5",
          text: "Hoạt động",
        };
      case "offline":
        return {
          color: "#EF4444",
          icon: "close-circle",
          bgColor: "#FEE2E2",
          text: "Ngừng hoạt động",
        };
      case "warning":
        return {
          color: "#F59E0B",
          icon: "warning",
          bgColor: "#FEF3C7",
          text: "Cảnh báo",
        };
      case "maintenance":
        return {
          color: "#6366F1",
          icon: "construct",
          bgColor: "#E0E7FF",
          text: "Bảo trì",
        };
      default:
        return {
          color: "#6B7280",
          icon: "help-circle",
          bgColor: "#F3F4F6",
          text: "Không xác định",
        };
    }
  };

  const config = getStatusConfig();
  const dotSize = size === "small" ? 8 : size === "medium" ? 12 : 16;
  const iconSize = size === "small" ? 16 : size === "medium" ? 20 : 24;

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        {showIcon ? (
          <View
            style={[styles.iconContainer, { backgroundColor: config.bgColor }]}
          >
            <Icon name={config.icon} size={iconSize} color={config.color} />
          </View>
        ) : (
          <View
            style={[
              styles.dot,
              {
                width: dotSize,
                height: dotSize,
                backgroundColor: config.color,
              },
            ]}
          />
        )}

        <View style={styles.textContainer}>
          <Text style={[styles.label, size === "small" && styles.smallText]}>
            {label}
          </Text>
          <Text
            style={[
              styles.statusText,
              { color: config.color },
              size === "small" && styles.smallText,
            ]}
          >
            {config.text}
          </Text>
        </View>
      </View>

      {description && (
        <Text
          style={[styles.description, size === "small" && styles.smallText]}
        >
          {description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dot: {
    borderRadius: 50,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    marginLeft: 44,
    lineHeight: 20,
  },
  smallText: {
    fontSize: 12,
  },
});

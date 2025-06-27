import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface ReportCardProps {
  title: string;
  subtitle?: string;
  date: string;
  status: "draft" | "pending" | "approved" | "rejected";
  onPress?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  title,
  subtitle,
  date,
  status,
  onPress,
  onDownload,
  onShare,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "draft":
        return {
          color: "#6B7280",
          bgColor: "#F3F4F6",
          text: "Bản nháp",
          icon: "document-outline",
        };
      case "pending":
        return {
          color: "#F59E0B",
          bgColor: "#FEF3C7",
          text: "Chờ duyệt",
          icon: "time-outline",
        };
      case "approved":
        return {
          color: "#10B981",
          bgColor: "#D1FAE5",
          text: "Đã duyệt",
          icon: "checkmark-circle-outline",
        };
      case "rejected":
        return {
          color: "#EF4444",
          bgColor: "#FEE2E2",
          text: "Từ chối",
          icon: "close-circle-outline",
        };
      default:
        return {
          color: "#6B7280",
          bgColor: "#F3F4F6",
          text: "Không xác định",
          icon: "help-circle-outline",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusConfig.bgColor },
          ]}
        >
          <Icon name={statusConfig.icon} size={14} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.text}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Icon name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.date}>{date}</Text>
        </View>

        {(onDownload || onShare) && (
          <View style={styles.actions}>
            {onDownload && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onDownload}
                activeOpacity={0.7}
              >
                <Icon name="download-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
            {onShare && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onShare}
                activeOpacity={0.7}
              >
                <Icon name="share-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
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
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 6,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
});

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface InfoItemProps {
  icon: string;
  label: string;
  value: string;
  onPress?: () => void;
  showChevron?: boolean;
}

interface InfoCardProps {
  title: string;
  items: InfoItemProps[];
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, items }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>
        {items.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.row}
              onPress={item.onPress}
              disabled={!item.onPress}
              activeOpacity={item.onPress ? 0.7 : 1}
            >
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={20} color="#007AFF" />
              </View>
              <View style={styles.content}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
              {item.showChevron && (
                <Icon
                  name="chevron-forward-outline"
                  size={20}
                  color="#C7C7CC"
                />
              )}
            </TouchableOpacity>
            {index < items.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#8e8e93",
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: "#1c1c1e",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#f2f2f7",
    marginHorizontal: 16,
  },
});

export default InfoCard;

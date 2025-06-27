import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface IconActionCardProps {
  title: string;
  icon: string;
  color?: string;
  onPress: () => void;
}

export const IconActionCard: React.FC<IconActionCardProps> = ({
  title,
  icon,
  color = "#007AFF",
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Icon name={icon} size={50} color="#fff" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 100,
    maxHeight: 120,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
  },
});

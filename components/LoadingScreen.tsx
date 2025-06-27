import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Đang tải...",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    gap: 16,
  },
  message: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
});

export default LoadingScreen;

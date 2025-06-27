import React from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import { AppHeader } from "./AppHeader";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  onRightPress?: () => void;
  rightIcon?: string;
  children: React.ReactNode;
  backgroundColor?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  onBackPress,
  onRightPress,
  rightIcon,
  children,
  backgroundColor = "#f8f9fa",
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <AppHeader
        title={title}
        subtitle={subtitle}
        onBackPress={onBackPress}
        onRightPress={onRightPress}
        rightIcon={rightIcon}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});

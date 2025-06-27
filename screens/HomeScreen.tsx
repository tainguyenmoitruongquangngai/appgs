import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { AppHeader } from "../components/AppHeader";
import { IconActionCard } from "../components/IconActionCard";
import { LoadingScreen } from "../components/LoadingScreen";

export default function HomeScreen() {
  const router = useRouter();
  const { getUserInfo, logout, isLoading } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const info = await getUserInfo();
      setUserInfo(info);
    } catch (error) {
      console.error("Error loading user info:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "THÔNG BÁO",
      "Bạn thực sự muốn đăng xuất?",
      [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          onPress: async () => {
            await logout();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserInfo();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if (isLoading) {
    return <LoadingScreen message="Đang tải..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      <AppHeader
        title={`Xin chào, ${userInfo?.userName || "User"}!`}
        subtitle="Hệ thống giám sát môi trường"
        onRightPress={handleLogout}
        rightIcon="log-out-outline"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hành động nhanh */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hành động nhanh</Text>

          <View style={styles.actionGrid}>
            <View style={styles.actionRow}>
              <IconActionCard
                title="Thông tin công trình"
                icon="people-outline"
                color="#e49813"
                onPress={() => router.push("/get-info")}
              />
              <View style={styles.actionSpacing} />
              <IconActionCard
                title="Truyền số liệu"
                icon="cloud-upload-outline"
                color="#8E8E93"
                onPress={() => router.push("/transfer-data")}
              />
            </View>

            <View style={styles.actionRow}>
              <IconActionCard
                title="Tra cứu dữ liệu"
                icon="search-outline"
                color="#4CAF50"
                onPress={() => router.push("/get-data")}
              />
              <View style={styles.actionSpacing} />
              <IconActionCard
                title="Trợ giúp"
                icon="help-circle-outline"
                color="#2196F3"
                onPress={() =>
                  Alert.alert("Thông báo", "Tính năng đang phát triển")
                }
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  actionGrid: {
    width: "100%",
    gap: 16,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "stretch",
    width: "100%",
  },
  actionSpacing: {
    width: 16,
  },
});

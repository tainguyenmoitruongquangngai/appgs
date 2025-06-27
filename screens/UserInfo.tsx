import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  RefreshControl,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";
import { UserAvatar } from "../components/UserAvatar";
import { InfoCard } from "../components/InfoCard";

export default function UserInfoScreen() {
  const router = useRouter();
  const { getUserInfo, logout, isLoading } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserInfo = async () => {
    try {
      const info = await getUserInfo();
      setUserInfo(info);
    } catch (error) {
      console.error("Error loading user info:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserInfo();
    setRefreshing(false);
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  const handleLogout = () => {
    Alert.alert("Xác nhận đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  if (loading || isLoading) {
    return <LoadingScreen message="Đang tải thông tin..." />;
  }

  const defaultAvatar =
    "https://gstnn.quangngai.gov.vn/images/logos/logo_sotnmt.png";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header với Avatar */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <UserAvatar
              size={100}
              userName={userInfo?.userName}
              imageUri={defaultAvatar}
              showInitials={true}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Icon name="camera-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{userInfo?.userName || "Người dùng"}</Text>

          <Text style={styles.role}>
            {userInfo?.role || "Vai trò chưa xác định"}
          </Text>
        </View>

        {/* Thông tin chi tiết */}
        <InfoCard
          title="Thông tin cá nhân"
          items={[
            {
              icon: "person-outline",
              label: "Tên đăng nhập",
              value: userInfo?.userName || "N/A",
            },
            {
              icon: "shield-checkmark-outline",
              label: "Vai trò",
              value: userInfo?.role || "N/A",
            },
          ]}
        />

        {/* Các tùy chọn */}
        <InfoCard
          title="Tùy chọn"
          items={[
            {
              icon: "create-outline",
              label: "Chỉnh sửa thông tin",
              value: "Cập nhật thông tin cá nhân",
              onPress: () => {
                // TODO: Navigate to edit profile
                Alert.alert("Thông báo", "Tính năng đang phát triển");
              },
              showChevron: true,
            },
            {
              icon: "lock-closed-outline",
              label: "Đổi mật khẩu",
              value: "Thay đổi mật khẩu đăng nhập",
              onPress: () => {
                // TODO: Navigate to change password
                Alert.alert("Thông báo", "Tính năng đang phát triển");
              },
              showChevron: true,
            },
            {
              icon: "settings-outline",
              label: "Cài đặt",
              value: "Tùy chỉnh ứng dụng",
              onPress: () => {
                // TODO: Navigate to settings
                Alert.alert("Thông báo", "Tính năng đang phát triển");
              },
              showChevron: true,
            },
          ]}
        />

        {/* Nút đăng xuất */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
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
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: "#8e8e93",
    fontWeight: "500",
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#ff3b30",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

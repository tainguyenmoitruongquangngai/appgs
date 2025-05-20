import { useRouter } from 'expo-router';
import React from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, StatusBar, Platform } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

export default function DetailScreen() {
  const router = useRouter();

  const user = {
    avatar: "https://gstnn.quangngai.gov.vn/images/logos/logo_sotnmt.png",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123 456 789",
    address: "TP. Hồ Chí Minh",
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <TouchableOpacity style={styles.editButton}>
          <Icon name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{user.name}</Text>

      <View style={styles.infoRow}>
        <Icon name="mail-outline" size={20} color="#555" />
        <Text style={styles.infoText}>{user.email}</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="call-outline" size={20} color="#555" />
        <Text style={styles.infoText}>{user.phone}</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="location-outline" size={20} color="#555" />
        <Text style={styles.infoText}>{user.address}</Text>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Icon name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 100,
    paddingHorizontal: 100,
    backgroundColor: "#f5f5f5",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 5,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  actionButton: {
    marginTop: 40,
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
});

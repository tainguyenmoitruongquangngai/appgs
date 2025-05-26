import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function GetData() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'THÔNG BÁO',
      'Bạn thực sự muốn đăng xuất?',
      [
        {
          text: 'HUỶ',
          style: 'cancel',
        },
        {
          text: 'ĐĂNG XUẤT',
          onPress: () => {
            logout();
            router.replace("/login");
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView>
      <View style={styles.header}>
        <TouchableOpacity style={[styles.buttonLogout]} onPress={() => router.replace('/')}>
          <Icon name="arrow-back-outline" style={styles.iconWhite} size={25} ></Icon>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Số liệu vận hành</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  datetimeButton: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#035291',
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#fff',
  },
  buttonLogout: {
    padding: 10,
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 10,
  },
  iconWhite: {
    color: '#fff'
  },
  red: { backgroundColor: "#D32F2F" },
});

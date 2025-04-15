import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';

const factors = [
  "MUATHUONGLUU", "THUONGLUU", "HALUU", "DUNGTICH", "QDEN", "QUATRAN",
  "NHAMAY", "DCTT", "LUULUONGHADU", "DUKIENLUULUONGHADU", "MUCNUOCHODUKIEN12GIO"
];

export default function DataInputForm() {
  const [projectName, setProjectName] = useState('');
  const [datetime, setDatetime] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(true);

  const [dataRows, setDataRows] = useState(
    Array.from({ length: 11 }, (_, index) => ({
      factor: factors[index % factors.length],
      value: '',
      unit: '',
    }))
  );

  const handleDateConfirm = (date: Date) => {
    setDatetime(date);
    setDatePickerVisible(false);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newData = [...dataRows];
    newData[index][field as 'factor' | 'value' | 'unit'] = value;
    setDataRows(newData);
  };

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
        <Text style={styles.headerTitle}>Nhập số liệu vận hành</Text>
        <TouchableOpacity style={[styles.red, styles.buttonLogout]} onPress={handleLogout}>
          <Icon name="log-out-outline" style={styles.iconWhite} size={25} ></Icon>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Tên công trình */}
      <Text style={styles.label}>Tên công trình</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên công trình"
        value={projectName}
        onChangeText={setProjectName}
      />

      {/* Thời gian nhập dữ liệu */}
      <Text style={styles.label}>Thời gian nhập dữ liệu</Text>
      <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.datetimeButton}>
        <Text>{datetime.toLocaleString()}</Text>
      </TouchableOpacity>

      {/* Form 12 hàng */}
      <Text style={styles.label}>Dữ liệu quan trắc</Text>
      {dataRows.map((row, index) => (
        <View key={index} style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1.3 }]}
            placeholder="Yếu tố"
            value={row.factor}
            onChangeText={(text) => handleChange(index, 'factor', text)}
            editable={false}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Giá trị"
            keyboardType="numeric"
            value={row.value}
            onChangeText={(text) => handleChange(index, 'value', text)}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Đơn vị"
            value={row.unit}
            onChangeText={(text) => handleChange(index, 'unit', text)}
          />
        </View>
      ))}

      {/* Gửi dữ liệu */}
      <Button title="Gửi dữ liệu" onPress={() => console.log({ projectName, datetime, dataRows })} />
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

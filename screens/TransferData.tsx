import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

const factors = [
  "MUATHUONGLUU", "THUONGLUU", "HALUU", "DUNGTICH", "QDEN", "QUATRAN",
  "NHAMAY", "DCTT", "LUULUONGHADU", "DUKIENLUULUONGHADU", "MUCNUOCHODUKIEN12GIO"
];

export default function DataInputForm() {
  const [projectName, setProjectName] = useState('');
  const [datetime, setDatetime] = useState(new Date());
  const [dateShow, setDateShow] = useState(false);
  
  const onChangeDate = (event:any, selectedDate:any) => {
    const currentDate = selectedDate;
    setDatetime(currentDate);
    setDateShow(false);
  };

  const showDateMode = () => {
    setDateShow(true);
  };

  const [dataRows, setDataRows] = useState(
    Array.from({ length: 11 }, (_, index) => ({
      factor: factors[index % factors.length],
      value: '',
      unit: '',
    }))
  );

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
      <View style={styles.row}>
        <Text style={styles.label}>Chọn thời gian nhập dữ liệu:</Text>
        <TouchableOpacity onPress={showDateMode} style={styles.datetimeButton}>
          <Icon name="calendar-outline" style={styles.iconWhite} size={25} ></Icon>
        </TouchableOpacity>
        <TouchableOpacity onPress={showDateMode} style={styles.datetimeButton}>
          <Icon name="calendar-outline" style={styles.iconWhite} size={25} ></Icon>
        </TouchableOpacity>
      </View>


      <Text>Thời gian nhập dữ liệu: {datetime.toLocaleString()}</Text>

      {dateShow && (
        <DateTimePicker
          testID="dateTimePicker"
          value={datetime}
          mode='date'
          is24Hour={true}
          onChange={onChangeDate}
        />
      )}

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

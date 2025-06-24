import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from "expo-router";

const factors = [
  "MUATHUONGLUU", "THUONGLUU", "HALUU", "DUNGTICH", "QDEN", "QUATRAN",
  "NHAMAY", "DCTT", "LUULUONGHADU", "DUKIENLUULUONGHADU", "MUCNUOCHODUKIEN12GIO"
];

const units = [
  "mm", "m", "m", "trieum3", "m3/s", "m3/s", "m3/s", "m3/s", "m3/s", "m3/s", "m"
];

export default function TransferData() {
  const [datetime, setDatetime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [values, setValues] = useState(Array(11).fill(''));

  const onChangeDate = (event:any, selectedDate:any) => {
    if (selectedDate) setDatetime(selectedDate);
    setShowDate(false);
  };

  const handleValueChange = (index:any, value:any) => {
    const newValues = [...values];
    newValues[index] = value.replace(/[^0-9.]/g, '');
    setValues(newValues);
  };

  const handleSubmit = () => {
    // Xử lý gửi dữ liệu ở đây
    console.log({
      datetime,
      data: factors.map((factor, i) => ({
        factor,
        value: values[i],
        unit: units[i]
      }))
    });
  };

  const router = useRouter();

  return (
    <ScrollView >
      <View style={styles.header}>
        <TouchableOpacity style={[styles.buttonBack]} onPress={() => router.replace('/')}>
          <Icon name="arrow-back-outline" style={styles.iconWhite} size={25} ></Icon>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhập số liệu vận hành</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.label}>Tên công trình:</Text>
        <TextInput style={[styles.input, { flex: 1 }]} />

        <Text style={styles.label}>Thời gian nhập dữ liệu:</Text>
        <TouchableOpacity onPress={() => setShowDate(true)} style={styles.datetimeButton}>
          <Text>{datetime.toLocaleString()}</Text>
        </TouchableOpacity>
      
      {showDate && (
        <DateTimePicker
          value={datetime}
          mode="datetime"
          display="default" // hoặc "calendar", "default"
          onChange={onChangeDate}
        />
      )}
      <Text style={styles.label}>Dữ liệu quan trắc:</Text>
      {factors.map((factor, i) => (
        <View key={factor} style={styles.dataRow}>
          <TextInput
            style={[styles.input, { flex: 1.5, backgroundColor: '#eee' }]}
            value={factor}
            editable={false}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Giá trị"
            keyboardType="numeric"
            value={values[i]}
            onChangeText={text => handleValueChange(i, text)}
          />
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: '#eee' }]}
            value={units[i]}
            editable={false}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmit}>
        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>GỬI DỮ LIỆU</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  label: { fontWeight: '600', marginBottom: 8, marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  datetimeButton: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  dataRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
    header: {
    backgroundColor: '#035291',
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 90,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#fff',
  },
  buttonBack: {
    padding: 10,
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 10,
  }, 
  iconWhite: {
    color: '#fff'
  },
  buttonSubmit: {
    backgroundColor: '#035291',
    padding: 10,
    borderRadius: 6,
    marginTop: 16,
  },
});
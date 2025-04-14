import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';
import { useState } from "react";

export default function TransferData() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  type DataItem = {
    hour: string;
    factor: string;
    value: string;
    unit: string;
  };

  const initialData: DataItem[] = Array.from({ length: 24 }, (_, hour) => ({
    hour: hour.toString().padStart(2, '0'),
    factor: '',
    value: '',
    unit: '',
  }));
  
  const [data, setData] = useState<DataItem[]>(initialData);

  const handleChange = (
    index: number,
    field: keyof Omit<DataItem, 'hour'>, // loại trừ `hour` vì không chỉnh sửa
    value: string
  ) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);
  };

  return (
    <>
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
      {data.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.hour}>{item.hour}h</Text>
          <TextInput
            style={styles.input}
            placeholder="Yếu tố"
            value={item.factor}
            onChangeText={(text) => handleChange(index, 'factor', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Giá trị"
            keyboardType="numeric"
            value={item.value}
            onChangeText={(text) => handleChange(index, 'value', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Đơn vị"
            value={item.unit}
            onChangeText={(text) => handleChange(index, 'unit', text)}
          />
        </View>
        ))}
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#035291',
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: "#e2f3ff",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#fff',
  },
  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
  hour: {
    width: 40,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
    padding: 6,
    borderRadius: 4,
  },
  red: { backgroundColor: "#D32F2F" },
})

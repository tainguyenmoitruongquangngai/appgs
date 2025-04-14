import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
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
    <>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Xin chào!</Text>
      <TouchableOpacity style={[styles.red, styles.buttonLogout]} onPress={handleLogout}>
        <Icon name="log-out-outline" style={styles.iconWhite} size={25} ></Icon>
      </TouchableOpacity>
    </View>

    <View style={styles.container}>

      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.button, styles.orange]}
          onPress={() => {}}
        >
          <Icon name="people-outline" style={styles.iconWhite} size={50} ></Icon>
          <Text style={styles.buttonText}>Tra cứu khách hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.gray]}
          onPress={() => {router.replace('/transfer-data')}}
        >
          <Icon name="cloud-upload-outline" style={styles.iconWhite} size={50} ></Icon>
          <Text style={styles.buttonText}>Truyền số liệu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.green]}
          onPress={() => {}}
        >
          <Icon name="search-outline" style={styles.iconWhite} size={50} ></Icon>
          <Text style={styles.buttonText}>Tra cứu dữ liệu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.blue]}
          onPress={() => {}}
        >
          <Icon name="help-circle-outline" style={styles.iconWhite} size={50} ></Icon>
          <Text style={styles.buttonText}>Trợ giúp</Text>
        </TouchableOpacity>

      </View>
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
  button: {
    width: "48%",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
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
  orange: { backgroundColor: "#e49813" },
  gray: { backgroundColor: "#8E8E93" },
  green: { backgroundColor: "#4CAF50" },
  blue: { backgroundColor: "#2196F3" },
  darkBlue: { backgroundColor: "#1565C0" },
  red: { backgroundColor: "#D32F2F" },
});

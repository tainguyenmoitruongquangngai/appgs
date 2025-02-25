import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export default function HomeScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  // Định nghĩa navigation với kiểu DrawerNavigationProp
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const handleLogout = async () => {
    await logout();
    router.replace('/login')
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trang chủ</Text>
      <Button title="Mở Menu" onPress={() => navigation.openDrawer()} />
      
      <View style={styles.grid}>
        <TouchableOpacity style={[styles.button, styles.yellow]} onPress={() => {}}>
          <Text style={styles.buttonText}>Thu thập</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.gray]} onPress={() => {}}>
          <Text style={styles.buttonText}>Kiểm tra</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.green]} onPress={() => {}}>
          <Text style={styles.buttonText}>Ghi chỉ số</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.blue]} onPress={() => {}}>
          <Text style={styles.buttonText}>Ghi chỉ số trực tuyến</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.darkBlue]} onPress={() => {}}>
          <Text style={styles.buttonText}>Tra cứu khách hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.red]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  yellow: { backgroundColor: '#F5C518' },
  gray: { backgroundColor: '#8E8E93' },
  green: { backgroundColor: '#4CAF50' },
  blue: { backgroundColor: '#2196F3' },
  darkBlue: { backgroundColor: '#1565C0' },
  red: { backgroundColor: '#D32F2F' },
});

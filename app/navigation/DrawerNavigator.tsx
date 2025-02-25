import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import DetailScreen from '@/screens/DetailScreen';
import HomeScreen from '@/screens/HomeScreen';

const Drawer = createDrawerNavigator();

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài đặt</Text>
    </View>
  );
}

function LogoutScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bạn có chắc muốn đăng xuất?</Text>
      <Text onPress={() => router.replace('/login')} style={styles.logoutButton}>
        Đăng xuất
      </Text>
    </View>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={DetailScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutButton: {
    fontSize: 18,
    color: 'red',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

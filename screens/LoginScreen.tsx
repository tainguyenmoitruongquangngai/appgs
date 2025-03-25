import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../constants/ApiURL'
import Icon from 'react-native-vector-icons/Ionicons';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Vui lòng nhập tài khoản và mật khẩu!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch([API_BASE_URL]+`/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
      })
      console.log(response)
      if (response.ok == true) {
          await login(username, password);
          router.replace('/(tabs)');
      } else {
        setIsError(true);
      }
    } catch (error) {
      alert('Đăng nhập thất bại, vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ĐĂNG NHẬP</Text>
      <View style={styles.inputContainer}>
        <Icon name="person-circle-outline" size={25} style={styles.icon} ></Icon>
        <TextInput style={styles.input} placeholder="Tên đăng nhập" onChangeText={setUsername} value={username} />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={25} style={styles.icon} ></Icon>
        <TextInput style={styles.input} placeholder="Mật khẩu" onChangeText={setPassword} value={password} secureTextEntry />
      </View>
      {isError && (
        <Text style={styles.alert}>Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!</Text>
      )}
      <Button title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'} onPress={handleLogin} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  alert: {
    color: "red", 
    paddingBottom: 10
  },
  icon: {
    marginRight: 10,
  },
});

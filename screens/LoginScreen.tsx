import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { authService } from "../api/authService";
import Icon from "react-native-vector-icons/Ionicons";

const image = { uri: "../assets/images/environment-background.jpg" };

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    setLoading(true);
    setIsError(false);

    try {
      const loginResult = await authService.login({
        userName: username,
        password: password,
        rememberMe: true,
      });

      if (loginResult && loginResult.success && loginResult.token) {
        // authService.login đã lưu token vào AsyncStorage và hiển thị thông báo thành công
        await login(loginResult.token); // Cập nhật state trong AuthContext
        router.replace("/(tabs)");
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/environmental-protection.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          HỆ THỐNG QUẢN TRỊ {`\n`}DỮ LIỆU NÔNG NGHIỆP VÀ MÔI TRƯỜNG
        </Text>
        <View style={styles.inputContainer}>
          <Icon
            name="person-circle-outline"
            size={25}
            style={styles.icon}
          ></Icon>
          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập"
            onChangeText={setUsername}
            value={username}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={25} style={styles.icon}></Icon>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            onChangeText={setPassword}
            value={password}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            {showPassword ? (
              <Icon name="eye-off-outline" size={25} style={styles.icon}></Icon>
            ) : (
              <Icon name="eye-outline" size={25} style={styles.icon}></Icon>
            )}
          </TouchableOpacity>
        </View>
        {isError && (
          <Text style={styles.alert}>
            Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!
          </Text>
        )}
        <Pressable
          style={styles.buttonLogin}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <View>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : (
            <Text style={styles.loginText}>Đăng nhập</Text>
          )}
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    height: 50,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#035291",
    textAlign: "center",
  },
  input: {
    flex: 1,
    height: "100%",
  },
  alert: {
    color: "red",
    paddingBottom: 10,
    fontWeight: 600,
  },
  icon: {
    marginRight: 10,
  },
  buttonLogin: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#0077df",
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

import AsyncStorage from "@react-native-async-storage/async-storage";

// Địa chỉ API gốc (có thể thay đổi dựa trên môi trường)
import { API_BASE_URL } from "./constants/ApiURL";

// Hàm gọi API đăng nhập
export const loginApi = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Lỗi đăng nhập: ${response.status}`);
    }

    const data = await response.json();

    if (data?.token) {
      await AsyncStorage.setItem("authToken", data.token);
    }

    return data;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    throw error;
  }
};

// Hàm gọi API đăng xuất
export const logoutApi = async () => {
  await AsyncStorage.removeItem("authToken");
};

// Hàm gọi API lấy dữ liệu (GET)
export const getData = async (
  endpoint: string,
  params: Record<string, string | number> = {}
) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const url = new URL(`${API_BASE_URL}/${endpoint}`);

    Object.keys(params).forEach(
      (key) => url.searchParams.append(key, String(params[key])) // Chuyển giá trị thành string
    );

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi lấy dữ liệu: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi lấy dữ liệu:", error);
    throw error;
  }
};

// Hàm gọi API gửi dữ liệu (POST)
export const postData = async (endpoint: string, data: any) => {
  try {
    const token = await AsyncStorage.getItem("authToken");

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Lỗi gửi dữ liệu: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi gửi dữ liệu:", error);
    throw error;
  }
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { authService } from "../api/authService";

interface AuthContextProps {
  isLoggedIn: boolean | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<
    UserInfo | { id: null; userName: null; role: null }
  >;
  checkAuthStatus: () => Promise<void>;
}

export interface UserInfo {
  id: string; // Id nguoi dung
  userName: string; // Ten dang nhap
  role: string; // Vai tro
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const getToken = useCallback(async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }, []);

  const getUserInfo = useCallback(async (): Promise<
    UserInfo | { id: null; userName: null; role: null }
  > => {
    try {
      const token = await getToken();
      if (!token) {
        return { id: null, userName: null, role: null };
      }
      const decoded = jwtDecode(token) as { [key: string]: any };
      return {
        id: decoded["id"],
        userName:
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        role: decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
      };
    } catch (err) {
      console.error("Failed to decode user info:", err);
      return { id: null, userName: null, role: null };
    }
  }, [getToken]);

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const isAuthenticated = await authService.isAuthenticated();
      setIsLoggedIn(isAuthenticated);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async (token: string) => {
    try {
      await AsyncStorage.setItem("authToken", token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error saving token:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setIsLoggedIn(false);
      await router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Even if logout fails, clear local state and redirect
      await AsyncStorage.removeItem("authToken");
      setIsLoggedIn(false);
      await router.replace("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        login,
        logout,
        getUserInfo,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};

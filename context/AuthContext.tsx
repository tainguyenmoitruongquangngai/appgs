import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'expo-router';

interface AuthContextProps {
  isLoggedIn: boolean | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadToken();
  }, []);

  const login = async (token: string) => {
    await AsyncStorage.setItem('authToken', token);
    setToken(token);
    router.replace('/'); // Điều hướng về trang chính
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setToken(null);
    router.replace('/login'); // Điều hướng về login sau khi đăng xuất
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: token !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

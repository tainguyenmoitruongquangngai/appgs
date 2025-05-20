import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'expo-router';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface AuthContextProps {
  isLoggedIn: boolean | null;
  login: (token: string) => void;
  logout: () => Promise<void>;
  userInfo: () => UserInfo | { id: null; userName: null; role: null };
}

export interface UserInfo {
  id: string // Id nguoi dung
  userName: string // Ten dang nhap
  role: string // Vai tro
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!Cookies.get('authToken')
  })

  const getToken = useCallback(() => Cookies.get('authToken') || null, []);

  const userInfo = useCallback(() => {
    const token = getToken();
    if (!token) {
      return { id: null, userName: null, role: null };
    }
    try {
      const decoded = jwtDecode(token) as { [key: string]: any };
      return {
        id: decoded['id'],
        userName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      };
    } catch (err) {
      console.error('Failed to decode user info:', err);
      return { id: null, userName: null, role: null };
    }
  }, [getToken]);

  const router = useRouter();

  useEffect(() => {

  }, []);

  const login = useCallback(
    (token: string) => {
      // Cookie settings based on environment
      const cookieOptions = {
        expires: 7,
        // Set secure flag if not in development
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict' as const
      }

      Cookies.set('authToken', token, cookieOptions)
      setIsLoggedIn(true)
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      Cookies.remove('authToken')
      setIsLoggedIn(false)
      await router.replace('/login')
    } catch (err) {
      console.error('Logout error:', err)
      router.replace('/login')
    }
  }, [router])

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userInfo }}>
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

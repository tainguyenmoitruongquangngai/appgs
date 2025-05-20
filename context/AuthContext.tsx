import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'expo-router';
import Cookies from 'js-cookie';

interface AuthContextProps {
  isLoggedIn: boolean | null;
  login: (token: string) => void
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!Cookies.get('authToken')
  })

  const getToken = useCallback(() => Cookies.get('authToken') || null, [])

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
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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

// hooks/useRequireAuth.ts
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export const useRequireAuth = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang Login
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  return isLoggedIn;
};

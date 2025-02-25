import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import HomeScreen from '@/screens/HomeScreen';

export default function Index() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);
    if (isLoggedIn === false) {
      router.replace('/login'); // Điều hướng nếu chưa đăng nhập
    }
  }, [isLoggedIn]);

  if (isLoggedIn === null) {
    return null; // Hiển thị màn hình trống khi đang kiểm tra đăng nhập
  }

  return isLoggedIn ? <HomeScreen /> : null;
}

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';
import 'react-native-gesture-handler';
import DrawerNavigator from '@/app/navigation/DrawerNavigator';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isReady, setIsReady] = useState(false);

  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      setIsReady(true);
    }
  }, [loaded]);

  if (!loaded || !isReady) {
    return null; // Đảm bảo không render `Stack` trước khi sẵn sàng
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        {pathname === '/login' ? (
          // Nếu đang ở màn hình đăng nhập, chỉ hiển thị Stack mà không có Drawer
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
          </Stack>
        ) : (
          // Nếu không phải màn hình đăng nhập, hiển thị toàn bộ DrawerNavigator
          <DrawerNavigator />
        )}
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}

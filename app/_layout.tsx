import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ApiContextProvider } from "../context/ApiContext";
import { LoadingScreen } from "../components/LoadingScreen";
import "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Component con để sử dụng useAuth hook
function AppStack() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Đang kiểm tra đăng nhập..." />;
  }

  return (
    <Stack initialRouteName="login">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="transfer-data" options={{ headerShown: false }} />
      <Stack.Screen name="get-info" options={{ headerShown: false }} />
      <Stack.Screen name="get-data" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isReady, setIsReady] = useState(false);

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
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ApiContextProvider>
        <AuthProvider>
          <AppStack />
          <StatusBar style="auto" />
        </AuthProvider>
      </ApiContextProvider>
    </ThemeProvider>
  );
}

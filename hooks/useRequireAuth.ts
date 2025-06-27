// hooks/useRequireAuth.ts
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export const useRequireAuth = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Chờ cho đến khi kiểm tra auth hoàn thành
    if (!isLoading && isLoggedIn === false) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang Login
      router.replace("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  return { isLoggedIn, isLoading };
};

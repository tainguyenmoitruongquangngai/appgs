import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        // Nếu đã đăng nhập, chuyển đến trang chính
        router.replace("/(tabs)");
      } else {
        // Nếu chưa đăng nhập, chuyển đến trang login
        router.replace("/login");
      }
    }
  }, [isLoggedIn, isLoading, router]);

  // Hiển thị loading trong khi kiểm tra trạng thái auth
  return <LoadingScreen message="Đang khởi tạo ứng dụng..." />;
}

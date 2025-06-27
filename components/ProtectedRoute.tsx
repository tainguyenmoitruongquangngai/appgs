import React, { ReactNode } from "react";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { LoadingScreen } from "./LoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = <LoadingScreen message="Đang kiểm tra quyền truy cập..." />,
}) => {
  const { isLoggedIn, isLoading } = useRequireAuth();

  // Hiển thị loading trong khi kiểm tra auth
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Nếu chưa đăng nhập, useRequireAuth sẽ tự động redirect
  // Chỉ render children khi đã đăng nhập
  if (isLoggedIn) {
    return <>{children}</>;
  }

  // Fallback trong trường hợp chưa redirect
  return <>{fallback}</>;
};

export default ProtectedRoute;

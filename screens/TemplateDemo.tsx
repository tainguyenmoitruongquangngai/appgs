import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  DashboardLayout,
  GridLayout,
  StatCard,
  ChartCard,
  QuickActionCard,
  StatusIndicator,
  ReportCard,
  MonitoringCard,
  EmptyState,
} from "../components";

/**
 * TEMPLATE DEMONSTRATION SCREEN
 *
 * Màn hình demo các template components hiện đại cho ứng dụng giám sát
 * Sử dụng file này làm reference để xây dựng các màn hình khác
 */
export default function TemplateDemo() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("overview");

  const handleAction = (actionName: string) => {
    Alert.alert("Demo Action", `Bạn đã chọn: ${actionName}`);
  };

  return (
    <DashboardLayout
      title="Template Demo"
      subtitle="Showcase các components hiện đại"
      onBackPress={() => router.back()}
      onRightPress={() =>
        Alert.alert("Info", "Template components cho ứng dụng giám sát")
      }
      rightIcon="information-circle-outline"
    >
      {/* Section 1: Overview Stats */}
      <GridLayout columns={2} spacing={16}>
        <StatCard
          title="Tổng trạm giám sát"
          value={24}
          icon="hardware-chip-outline"
          color="#007AFF"
          trend="up"
          trendValue="+2"
          onPress={() => handleAction("Trạm giám sát")}
        />

        <StatCard
          title="Dữ liệu hôm nay"
          value={156}
          unit="mẫu"
          icon="analytics-outline"
          color="#10B981"
          trend="stable"
        />

        <StatCard
          title="Cảnh báo"
          value={3}
          icon="warning-outline"
          color="#F59E0B"
          trend="down"
          trendValue="-2"
        />

        <StatCard
          title="Độ ẩm trung bình"
          value="68.5"
          unit="%"
          icon="water-outline"
          color="#06B6D4"
          trend="up"
          trendValue="+5.2%"
        />
      </GridLayout>

      {/* Section 2: Charts */}
      <ChartCard
        title="Biểu đồ mức nước theo thời gian"
        description="Theo dõi thay đổi mức nước trong 24h qua"
        value="2.35"
        unit="m"
        trend="up"
        trendValue="+0.1m"
        color="#007AFF"
        height={220}
        onPress={() => handleAction("Xem biểu đồ chi tiết")}
      />

      <GridLayout columns={1} spacing={16}>
        <ChartCard
          title="Lưu lượng nước"
          description="Dữ liệu lưu lượng tuần qua"
          value="45.8"
          unit="m³/s"
          trend="stable"
          color="#10B981"
          height={180}
        />
      </GridLayout>

      {/* Section 3: System Status */}
      <MonitoringCard
        title="Trạng thái hệ thống"
        description="Tình trạng hoạt động của các thiết bị"
        status="online"
        lastUpdate="2 phút trước"
        icon="server-outline"
      />

      <StatusIndicator
        status="online"
        label="Kết nối mạng"
        description="Tất cả thiết bị kết nối ổn định"
        size="large"
      />

      <StatusIndicator
        status="warning"
        label="Cảm biến nhiệt độ #3"
        description="Cần kiểm tra và bảo trì"
        size="medium"
      />

      {/* Section 4: Quick Actions */}
      <QuickActionCard
        title="Nhập dữ liệu mới"
        description="Cập nhật số liệu giám sát mới nhất"
        icon="add-circle-outline"
        color="#007AFF"
        onPress={() => router.push("/transfer-data")}
      />

      <QuickActionCard
        title="Tạo báo cáo"
        description="Xuất báo cáo định kỳ hoặc theo yêu cầu"
        icon="document-text-outline"
        color="#6366F1"
        badge="Mới"
        onPress={() => handleAction("Tạo báo cáo")}
      />

      <QuickActionCard
        title="Cài đặt cảnh báo"
        description="Thiết lập ngưỡng và thông báo"
        icon="notifications-outline"
        color="#F59E0B"
        onPress={() => handleAction("Cài đặt cảnh báo")}
      />

      {/* Section 5: Recent Reports */}
      <ReportCard
        title="Báo cáo giám sát môi trường - Tháng 12/2024"
        subtitle="Hồ chứa Khe Bố, tỉnh Quảng Ngãi"
        date="27/12/2024"
        status="approved"
        onPress={() => handleAction("Xem báo cáo")}
        onDownload={() => handleAction("Tải xuống")}
        onShare={() => handleAction("Chia sẻ")}
      />

      <ReportCard
        title="Báo cáo vận hành tuần 51/2024"
        subtitle="Dữ liệu từ 16-22/12/2024"
        date="23/12/2024"
        status="pending"
        onPress={() => handleAction("Xem báo cáo")}
      />

      <ReportCard
        title="Báo cáo sự cố thiết bị"
        subtitle="Cảm biến áp suất hư hỏng"
        date="20/12/2024"
        status="rejected"
        onPress={() => handleAction("Xem báo cáo")}
      />

      {/* Section 6: Empty State Demo */}
      {/* Uncomment để xem EmptyState component
      <EmptyState
        icon="folder-open-outline"
        title="Không có dữ liệu"
        description="Chưa có dữ liệu giám sát nào được ghi nhận trong khoảng thời gian này"
        actionText="Nhập dữ liệu mới"
        onAction={() => handleAction('Nhập dữ liệu')}
        color="#6366F1"
      />
      */}
    </DashboardLayout>
  );
}

/**
 * HƯỚNG DẪN SỬ DỤNG TEMPLATE:
 *
 * 1. DashboardLayout: Layout cơ bản với header và scroll view
 * 2. GridLayout: Sắp xếp components theo dạng lưới (1, 2, hoặc 3 cột)
 * 3. StatCard: Hiển thị thống kê với trend và icon
 * 4. ChartCard: Placeholder cho biểu đồ với giá trị hiện tại
 * 5. MonitoringCard: Hiển thị trạng thái giám sát
 * 6. StatusIndicator: Hiển thị trạng thái hệ thống
 * 7. QuickActionCard: Các hành động nhanh với icon và badge
 * 8. ReportCard: Hiển thị báo cáo với các actions
 * 9. EmptyState: Hiển thị khi không có dữ liệu
 *
 * COLORS PALETTE:
 * - Primary Blue: #007AFF
 * - Success Green: #10B981
 * - Warning Orange: #F59E0B
 * - Error Red: #EF4444
 * - Info Purple: #6366F1
 * - Cyan: #06B6D4
 * - Gray: #6B7280
 */

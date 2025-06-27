# Template Hệ Thống Giám Sát Môi Trường

## Tổng quan

Template hiện đại và chuyên nghiệp cho ứng dụng truyền dữ liệu giám sát môi trường, được thiết kế với React Native và Expo.

## 🎨 Design System

### Color Palette

```javascript
Primary Blue: #007AFF    // Chính
Success Green: #10B981   // Thành công
Warning Orange: #F59E0B  // Cảnh báo
Error Red: #EF4444       // Lỗi
Info Purple: #6366F1     // Thông tin
Cyan: #06B6D4            // Nước
Gray: #6B7280            // Phụ
Background: #f8f9fa      // Nền
```

### Typography

- **Title**: 20px, weight: 700
- **Subtitle**: 16px, weight: 600
- **Body**: 14px, weight: 400
- **Caption**: 12px, weight: 500

## 📦 Components Library

### Layout Components

#### DashboardLayout

Layout cơ bản với header và scroll view cho toàn bộ ứng dụng.

```jsx
<DashboardLayout
  title="Trang chủ"
  subtitle="Hệ thống giám sát"
  onBackPress={() => router.back()}
  rightIcon="settings-outline"
  onRightPress={() => {}}
>
  {/* Content */}
</DashboardLayout>
```

#### GridLayout

Sắp xếp components theo dạng lưới responsive.

```jsx
<GridLayout columns={2} spacing={16}>
  <StatCard {...props} />
  <StatCard {...props} />
</GridLayout>
```

### Data Display Components

#### StatCard

Hiển thị thống kê với trend và biểu tượng.

```jsx
<StatCard
  title="Tổng báo cáo"
  value={125}
  icon="document-text-outline"
  color="#007AFF"
  trend="up"
  trendValue="+12%"
  onPress={() => {}}
/>
```

#### ChartCard

Placeholder cho biểu đồ với thông tin tổng quan.

```jsx
<ChartCard
  title="Biểu đồ mức nước"
  description="Theo dõi 24h"
  value="2.35"
  unit="m"
  trend="up"
  color="#007AFF"
  height={200}
/>
```

#### MonitoringCard

Hiển thị trạng thái giám sát thiết bị.

```jsx
<MonitoringCard
  title="Kết nối máy chủ"
  description="Trạng thái kết nối"
  status="online"
  lastUpdate="2 phút trước"
  icon="server-outline"
/>
```

#### ReportCard

Hiển thị báo cáo với các hành động.

```jsx
<ReportCard
  title="Báo cáo tháng 12/2024"
  subtitle="Hồ chứa Khe Bố"
  date="15/12/2024"
  status="approved"
  onPress={() => {}}
  onDownload={() => {}}
  onShare={() => {}}
/>
```

### Form Components

#### DataInputField

Input field với icon và validation.

```jsx
<DataInputField
  label="Tên công trình"
  value={value}
  placeholder="Nhập tên..."
  onChangeText={setValue}
  icon="business-outline"
  required
  error={error}
/>
```

### UI Components

#### QuickActionCard

Card hành động nhanh với badge.

```jsx
<QuickActionCard
  title="Truyền dữ liệu"
  description="Nhập dữ liệu mới"
  icon="cloud-upload-outline"
  color="#007AFF"
  badge="Mới"
  onPress={() => {}}
/>
```

#### StatusIndicator

Hiển thị trạng thái hệ thống.

```jsx
<StatusIndicator
  status="online"
  label="Máy chủ trung tâm"
  description="Kết nối ổn định"
  size="large"
/>
```

#### EmptyState

Hiển thị khi không có dữ liệu.

```jsx
<EmptyState
  icon="folder-open-outline"
  title="Không có dữ liệu"
  description="Chưa có dữ liệu nào"
  actionText="Thêm mới"
  onAction={() => {}}
/>
```

## 🚀 Screens Template

### HomeScreen

- Dashboard với thống kê tổng quan
- Quick actions cards
- System status
- Recent reports

### TransferData

- Form nhập dữ liệu với validation
- Real-time monitoring status
- Professional submission UI

### DetailScreen (Profile)

- User information display
- Modern avatar and info cards
- Action buttons

## 📱 Usage Examples

### Tạo màn hình mới với template:

```jsx
import React from "react";
import {
  DashboardLayout,
  GridLayout,
  StatCard,
  QuickActionCard,
} from "../components";

export default function MyScreen() {
  return (
    <DashboardLayout title="Màn hình mới" subtitle="Mô tả ngắn">
      <GridLayout columns={2}>
        <StatCard title="Stat 1" value={100} icon="..." />
        <StatCard title="Stat 2" value={200} icon="..." />
      </GridLayout>

      <QuickActionCard
        title="Hành động"
        description="Mô tả"
        icon="..."
        onPress={() => {}}
      />
    </DashboardLayout>
  );
}
```

### Tích hợp với navigation:

```jsx
// Trong _layout.tsx
<Stack.Screen name="my-screen" options={{ headerShown: false }} />;

// Trong component
import { useRouter } from "expo-router";
const router = useRouter();
router.push("/my-screen");
```

## 🔧 Customization

### Thay đổi màu sắc chính:

```jsx
// Trong component
<StatCard
  color="#10B981" // Green theme
  // ... other props
/>
```

### Custom styles:

```jsx
const styles = StyleSheet.create({
  customCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    // ... custom styles
  },
});
```

## 📂 File Structure

```
components/
├── index.ts                 # Export tất cả components
├── DashboardLayout.tsx      # Layout chính
├── GridLayout.tsx           # Grid system
├── StatCard.tsx             # Thống kê card
├── ChartCard.tsx            # Biểu đồ card
├── MonitoringCard.tsx       # Giám sát card
├── ReportCard.tsx           # Báo cáo card
├── QuickActionCard.tsx      # Hành động nhanh
├── StatusIndicator.tsx      # Trạng thái
├── DataInputField.tsx       # Input field
├── EmptyState.tsx           # Trạng thái trống
├── AppHeader.tsx            # Header
├── UserAvatar.tsx           # Avatar
├── InfoCard.tsx             # Thông tin card
└── LoadingScreen.tsx        # Loading

screens/
├── HomeScreen.tsx           # Trang chủ
├── TransferData.tsx         # Truyền dữ liệu
├── DetailScreen.tsx         # Chi tiết (Profile)
└── TemplateDemo.tsx         # Demo template
```

## 🎯 Best Practices

1. **Consistency**: Sử dụng design system tutorết
2. **Accessibility**: Thêm accessibilityLabel cho các components
3. **Performance**: Sử dụng React.memo cho các components phức tạp
4. **Responsive**: Test trên nhiều kích cỡ màn hình
5. **Error Handling**: Luôn có error states và loading states

## 🔄 Updates & Maintenance

- Template được thiết kế modular để dễ mở rộng
- Mỗi component độc lập và có thể tái sử dụng
- Color palette có thể dễ dàng thay đổi từ một nơi duy nhất
- Components tương thích với React Native và Expo mới nhất

---

**Developed by**: GitHub Copilot  
**Version**: 1.0.0  
**Last Updated**: December 27, 2024
